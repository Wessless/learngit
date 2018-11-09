<template>
    <div class="PointsScoreList">
        <router-view :item="clickItem" :yearMonth="form.yearMonth" :AStaffs="AStaffs" @refresh="refresh"></router-view>
        <!-- :span-method="arraySpanMethod" -->
        <chat-header :showBack="true" :title="'积分评分'"></chat-header>
        <div style="width:100%;padding:74px 20px 10px 20px;overflow:scroll">
            <el-form :inline="true" :model="form" class="demo-form-inline" style="margin:0 0 10px 20px;">
                <el-form-item>
                    <el-date-picker
                        v-model="form.yearMonth"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        :clearable="false"
                        style="width:160px;"
                        @change="loadList"
                        size="medium">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        
            <div class="midTableHeight redTable" style="width:100%;display:block;padding:0px 20px 20px 20px;">
                <el-table :data="pointsAscoreList" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="470">
                    <el-table-column align="center"  label="A分">
                        <el-table-column prop="StaffName" align="center"  label="姓名"  width="180"></el-table-column>
                        <el-table-column prop="Point" align="center"  label="本月积分"  width="150">
                            <!-- <template slot-scope="scope">
                                <span>{{scope.row.Status=="待评定"?"待评定":scope.row.Point}}</span>
                            </template> -->
                        </el-table-column>
                        <el-table-column align="center"  label="评定人"  width="180">
                            <template slot-scope="scope">   
                                <span>{{scope.row.Status=="待评定"?"":scope.row.ManagerName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center"  label="评定时间"  >
                            <template slot-scope="scope">
                                <span>{{scope.row.Status=="待评定"?"待评定":scope.row.ManageTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addScore(scope.row,'A')">评定</el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
                <!-- <div>
                    <el-pagination
                        style="float:left;"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="itemNum">
                    </el-pagination>
                </div> -->
            </div>
            <div class="midTableHeight" style="width:100%;display:block;padding:10px 20px 20px 20px;">
                <el-table :data="pointsBscoreList" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle1" border max-height="470">
                    <el-table-column align="center"  label="B分">
                        <el-table-column prop="StaffName" align="center"  label="姓名"  width="180"></el-table-column>
                        <el-table-column prop="Point" align="center"  label="本月积分"  width="150">
                            <!-- <template slot-scope="scope">
                                <span>{{scope.row.Status=="待评定"?"待评定":scope.row.Point}}</span>
                            </template> -->
                        </el-table-column>
                        <el-table-column align="center"  label="评定人"  width="180">
                            <template slot-scope="scope">   
                                <span>{{scope.row.Status=="待评定"?"":scope.row.ManagerName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center"  label="评定时间"  >
                            <template slot-scope="scope">   
                                <span>{{scope.row.Status=="待评定"?"待评定":scope.row.ManageTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addScore(scope.row,'B')">评定</el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
                <!-- <div>
                    <el-pagination
                        style="float:left;"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="itemNum">
                    </el-pagination>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>

import { getCreditList } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'PointsScoreList',
    data(){
        return {
            form:{
                yearMonth:"",
            },
            AStaffs:[],
            pointsAscoreList:[],
            BStaffs:[],
            pointsBscoreList:[],
            clickItem:{},
            
            dialogVisibleRestart:false,
            dialogVisibleShutdown:false,
            dialogVisibleWifi:false,
            dialogVisibleDetail:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.getNowTime()
;    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        // overflow(){
        //     if (this.$route.params.staffID) {
        //         return "hidden";
        //     }else{
        //         return "hidden";
        //     }
        // }
    },
    methods:{
        refresh(isFresh){
            if (isFresh) {
                this.getNowTime();
            }
        },
        loadList(){
            this.pointsAscoreList = [];
            this.pointsBscoreList = [];
            this.AStaffs = [];
            this.BStaffs = [];
            let staffID = "-1";
            let managerID = this.userInfo.userStaffID;
            let yearMonth = this.form.yearMonth;
            let loading = showLoading();
            getCreditList(staffID,managerID,yearMonth).then((result)=>{
                closeLoading(loading);
                // console.log(result.data.data);
                let arr = result.data.data;
                let arrSplice1 = [];
                let arrSplice2 = [];
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].Type == "A") {
                        let obj1 = {};
                        obj1.StaffID = arr[i].StaffID;
                        obj1.StaffName = arr[i].StaffName;
                        this.AStaffs.push(obj1);

                        if (arr[i].SalaryNotIncluded == "1") {
                            arrSplice1.push(arr[i]);
                        }else{
                            this.pointsAscoreList.push(arr[i]);
                        }
                    }else{
                        let obj2 = {};
                        obj2.StaffID = arr[i].StaffID;
                        obj2.StaffName = arr[i].StaffName;
                        this.BStaffs.push(obj2);

                        if (arr[i].SalaryNotIncluded == "1") {
                            arrSplice2.push(arr[i]);
                        }else{
                            this.pointsBscoreList.push(arr[i]);
                        }
                    }
                }
                this.AStaffs = this.uniqueArray(this.AStaffs,"StaffID");
                this.BStaffs = this.uniqueArray(this.BStaffs,"StaffID");
                this.pointsAscoreList = this.pointsAscoreList.concat(arrSplice1);
                this.pointsBscoreList = this.pointsBscoreList.concat(arrSplice2);
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1207");
            });
        },
        //获取当前时间
        getNowTime(){
            let date = new Date();
            let year =  date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            this.form.yearMonth = year + "-" + month;
            this.loadList();
        },
        //修改积分评定
        addScore(item,type){
            this.clickItem = item;
            this.$router.push(this.$route.fullPath+"/add");
        },
        uniqueArray(array, key){
            var result = [array[0]];
            for(var i = 1; i < array.length; i++){
                var item = array[i];
                var repeat = false;
                for (var j = 0; j < result.length; j++) {
                    if (item[key] == result[j][key]) {
                        repeat = true;
                        break;
                    }
                }
                if (!repeat) {
                    result.push(item);
                }
            }
            return result;
        },
        // handleSizeChange(val){
        //     this.pageSize = val;
        //     this.loadList();
        // },
        // handleCurrentChange(val){
        //     this.currentPage = val;
        //     this.loadList();
        // },

        //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0||rowIndex == 1) {
                return 'background:#38ADFF;color:#fff;text-align:center;'
            }
        },
        getRowStyle1({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0||rowIndex == 1) {
                return 'background:#FF9D00;color:#fff;text-align:center;'
            }
        },
        getColStyle({ row, column, rowIndex, columnIndex }){
            if (columnIndex == 0) {
				return 'padding-bottom:7px;text-align:center;'
			} else {
				return ''
            }
        },
        tableCellClassName({row, column, rowIndex, columnIndex}) {
            // if (columnIndex === 0) {
            //     return 'nohover';
            // }else{
            //     if (rowIndex%2 ==0) {
            //         return 'grayRow';
            //     } 
            //     return '';
            // }
            if (rowIndex>0) {
                if (row.SalaryNotIncluded == "1") {
                    return 'grayRowDeep';
                } 
            }
        },
        //合并
        // arraySpanMethod({row, column, rowIndex, columnIndex}){
        //     if (columnIndex === 1) {
        //         if (row.Status == "待评定") {
        //             return {
        //                 rowspan: 1,
        //                 colspan: 3
        //             };
        //         } else {
        //             return {
        //                 rowspan: 0,
        //                 colspan: 0
        //             };
        //         }
        //     }
        // },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.PointsScoreList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh; 
}
/* .pointsScoreList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.pointsScoreList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .pointsScoreList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .pointsScoreList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.addbtn{
    float: right;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
</style>