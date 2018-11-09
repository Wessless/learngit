<template>
    <div class="CommonExamineList">
        <router-view :item="clickItem" @refresh="refresh"></router-view>
        <chat-header :showBack="true" :title="'一般考核设定'"></chat-header>
        <div style="width:100%;padding:54px 20px 10px 20px;overflow:scroll">
            <label style="margin-left:10px;">考核名称</label>
            <el-select v-model="evaluationName" @change="loadList" size="medium" placeholder="请选择考核名称" style="width:200px;margin:10px;">
                <el-option
                v-for="item in evaluationNameArr"
                :key="item.name"
                :label="item.name"
                :value="item.name">
                </el-option>
            </el-select>
            <el-button style="display:block;float:right;margin:10px 10px 10px 5px;" type="primary" size="medium" @click="addExamine">添加</el-button>
            <div class="midTableHeight" style="width:100%;display:block;padding:0px 10px;">
                <el-table :data="commonExamineList" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="470">
                    <el-table-column prop="StaffName" align="center"  label="被考核人"  width="80"></el-table-column>
                    <el-table-column label="考核名称"  width="145">
                        <template slot-scope="scope">
                            <span class="spanTitle" :title="scope.row.Name">{{scope.row.Name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="考核模板">
                        <template slot-scope="scope">
                            <span class="spanTitle" :title="scope.row.TemplateName">{{scope.row.TemplateName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="有效时间" width="183">
                        <template slot-scope="scope">
                            <span>{{scope.row.BeginDate.split(" ")[0]+' ~ '+scope.row.EndDate.split(" ")[0]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="考核人" width="190">
                        <template slot-scope="scope">
                            <span>{{scope.row.StaffName1+(scope.row.StaffName2?'，'+scope.row.StaffName2:"")+(scope.row.StaffName3?'，'+scope.row.StaffName3:"")}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态" width="80">
                        <template slot-scope="scope">
                            <span :style="{color:scope.row.stateColor}">{{scope.row.status}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="140">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="updateExamine(scope.row)">修改</el-button>
                            <el-button
                                type="danger"
                                size="mini"
                                style="margin-left:3px;"
                                @click="deleteExamine(scope.row)">删除</el-button>
                        </template>
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
        <el-dialog
            title="提示"
            :visible.sync="dialogVisibleDel"
            width="400px">
            <span>您确定要删除该绩效考核吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleDel = false">取 消</el-button>
                <el-button type="primary" @click="confirmDel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getOtherEvaluationMessage,getOtherEvaluationName,deleteEvaluationByID } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'CommonExamineList',
    data(){
        return {
            nowDate:[],
            evaluationName:"全部",
            evaluationNameArr:[],
            commonExamineList:[],
            clickItem:{},
            dialogVisibleDel:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.getNowTime();
        this.getOtherEvaluationName();
        this.loadList();    
    },
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
        refresh(type){
            if (type == "add") {
                this.evaluationName = "全部"
                this.loadList();
            }else if (type == "update") {
                this.loadList();
            }
        },
        loadList(){
            this.commonExamineList = [];
            let name;
            if (this.evaluationName == "全部") {
                name = "-1";
            }else{
                name = this.evaluationName;
            }
            let loading = showLoading();
            getOtherEvaluationMessage("-1",name,"-1").then((result)=>{
                closeLoading(loading);
                console.log(result.data.data);
                let arr = result.data.data;
                for (let i = 0; i < arr.length; i++) {
                    let beginDateArr = arr[i].BeginDate.split(" ")[0].split("-");
                    let beginDateObj = new Date(beginDateArr[0],beginDateArr[1]-1,beginDateArr[2]);
                    let endDateArr = arr[i].EndDate.split(" ")[0].split("-");
                    let endDateObj = new Date(endDateArr[0],endDateArr[1]-1,endDateArr[2]);
                    // let currDateObj = new Date();
                    let currDateObj = new Date(this.nowDate[0],this.nowDate[1]-1,this.nowDate[2]);
                    if(beginDateObj.getTime()>currDateObj.getTime()){
                        arr[i].status = '尚未开始';
                        arr[i].stateColor = "#FF9D00";
                    }else if(endDateObj.getTime()<currDateObj.getTime()){
                        arr[i].status = '已过期';
                        arr[i].stateColor = "#e51c23";
                    }else{
                        arr[i].status = '进行中';
                        arr[i].stateColor = "#4DC060";
                    }
                }
                this.commonExamineList = arr;
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1198");
            });
        },
        getOtherEvaluationName(){
            this.evaluationNameArr = [];
            getOtherEvaluationName().then((result)=>{
                let arr = result.data.data;
                let obj = {name:"全部"}
                arr.unshift(obj);
                this.evaluationNameArr = arr;
            }).catch((err)=>{
                alertError(this,"1212");
                closeLoading(loading);
            });
        },
        addExamine(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        updateExamine(item){
            this.clickItem = item;
            this.$router.push(this.$route.fullPath+"/update");
        },
        deleteExamine(item){
            this.dialogVisibleDel = true;
            this.clickItem = item;
        },
        confirmDel(){
            let id = this.clickItem.ResultID;
            this.dialogVisibleDel = false;
            let loading = showLoading();
            deleteEvaluationByID(id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"删除成功",
                        type:"success"
                    });
                    this.loadList();
                }else{
                    this.$message.error({
                        message:"删除失败"
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2133");
            });
        },
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
            this.nowDate = [year,month,strDate];
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
        getColStyle({ row, column, rowIndex, columnIndex }){
            if (columnIndex == 0) {
				return 'padding-bottom:7px;text-align:center;'
			} else {
				return ''
            }
        },
        tableCellClassName({row, column, rowIndex, columnIndex}) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
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
.CommonExamineList{
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
.spanTitle{
    display: inline-block;
    height: 18px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>