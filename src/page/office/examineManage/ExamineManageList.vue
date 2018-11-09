<template>
    <div class="ExamineManageList">
        <router-view :item="clickItem" :staffsList="staffsList"></router-view>
        <chat-header :showBack="true" :title="'考核管理'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding:54px 20px 20px 20px;overflow:scroll;">
            <el-tabs v-model="tabSelect" @tab-click="handleClick" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;width:100%;" class="tuitionIncomeTabs">
                <el-tab-pane label="一般考核结果" name="first" >
                    <label style="margin-left:10px;">考核名称</label>
                    <el-select v-model="evaluationName" @change="loadCommonList" size="medium" placeholder="请选择考核名称" style="width:200px;margin:10px;">
                        <el-option
                        v-for="item in evaluationNameArr"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>

                    <el-date-picker
                        style="width:300px;margin:10px;"
                        v-model="dateRange"
                        type="daterange"
                        range-separator="一"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        size="medium"
                        @change="loadCommonList"
                        unlink-panels 
                        :default-value="[new Date(beforeYearMonth),new Date(yearMonth)]"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                    <el-dropdown @command="handleCommand" style="display:block;float:right;margin:10px 10px 10px 5px;">
                        <el-button type="primary" size="medium">
                            设置<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1"><img src="static/images/yb.png" class="imgS">一般考核设定</el-dropdown-item>
                            <el-dropdown-item command="2"><img src="static/images/yd.png" class="imgS">月度考核设定</el-dropdown-item>
                            <el-dropdown-item command="3"><img src="static/images/mb.png" class="imgS">考核模板设定</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 10px;">
                        <el-table :data="examineManageList" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="455">
                            <el-table-column align="center"  label="被考核人"  width="140">
                                <template slot-scope="scope">
                                    <span>{{scope.row.StaffName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="考核名称">
                                <template slot-scope="scope">
                                    <span>{{scope.row.Name}}</span>
                                    <span class="bBtn" v-show="scope.row.PointType=='5'">五分制</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="有效时间"  width="220">
                                <template slot-scope="scope">
                                    <span>{{scope.row.BeginDate.split(" ")[0]+' ~ '+scope.row.EndDate.split(" ")[0]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="考核结果"  width="220">
                                <template slot-scope="scope">
                                    <span class="iconStyle" @click="examineDetail(scope.row,'0')" v-show="scope.row.NeedSelfCheck=='1'">
                                        {{scope.row.SelfPoint?isVorPoint(scope.row,'0')+' (自)':"&#xe69a; (自)"}}
                                    </span>
                                    <span v-show="scope.row.NeedSelfCheck=='1'">一</span>
                                    <span class="iconStyle" @click="examineDetail(scope.row,'1')" v-show="scope.row.StaffID1!='-1'">
                                        {{scope.row.Point1?isVorPoint(scope.row,'1'):"&#xe69a;"}}
                                    </span>
                                    <span v-show="scope.row.StaffID2!='-1'">一</span>
                                    <span class="iconStyle" @click="examineDetail(scope.row,'2')" v-show="scope.row.StaffID2!='-1'">
                                        {{scope.row.Point2?isVorPoint(scope.row,'2'):"&#xe69a;"}}
                                    </span>
                                    <span v-show="scope.row.StaffID3!='-1'">一</span>
                                    <span class="iconStyle" @click="examineDetail(scope.row,'3')" v-show="scope.row.StaffID3!='-1'">
                                        {{scope.row.Point3?isVorPoint(scope.row,'3'):"&#xe69a;"}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="状态"  width="120">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row.stateColor}">{{scope.row.stateName}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="margin-bottom:50px;">
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
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="月度考核结果" name="second" >
                    <el-date-picker
                        v-model="yearMonth1"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        :clearable="false"
                        style="width:160px;margin:10px;"
                        @change="loadMonthlyList"
                        size="medium">
                    </el-date-picker>
                    <el-dropdown @command="handleCommand" style="display:block;float:right;margin:10px 10px 10px 5px;">
                        <el-button type="primary" size="medium">
                            设置<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1"><img src="static/images/yb.png" class="imgS">一般考核设定</el-dropdown-item>
                            <el-dropdown-item command="2"><img src="static/images/yd.png" class="imgS">月度考核设定</el-dropdown-item>
                            <el-dropdown-item command="3"><img src="static/images/mb.png" class="imgS">考核模板设定</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 10px 20px 10px;">
                        <el-table :data="examineManageList1" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="470">
                            <el-table-column align="center"  label="被考核人">
                                <template slot-scope="scope">
                                    <span>{{scope.row.StaffName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="考核结果"  width="220">
                                <template slot-scope="scope">
                                    <span class="iconStyle" @click="examineDetail1(scope.row,'1')" v-show="scope.row.Manager1!='-1'">
                                        {{scope.row.Point1?isVorPoint1(scope.row,'1'):"&#xe69a;"}}
                                    </span>
                                    <span v-show="scope.row.Manager2!='-1'">一</span>
                                    <span class="iconStyle" @click="examineDetail1(scope.row,'2')" v-show="scope.row.Manager2!='-1'">
                                        {{scope.row.Point2?isVorPoint1(scope.row,'2'):"&#xe69a;"}}
                                    </span>
                                    <span v-show="scope.row.Manager3!='-1'">一</span>
                                    <span class="iconStyle" @click="examineDetail1(scope.row,'3')" v-show="scope.row.Manager3!='-1'">
                                        {{scope.row.Point3?isVorPoint1(scope.row,'3'):"&#xe69a;"}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="状态"  width="120">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row.stateColor}">{{scope.row.stateName}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="margin-bottom:50px;">
                            <el-pagination
                                style="float:left;"
                                @size-change="handleSizeChange1"
                                @current-change="handleCurrentChange1"
                                :current-page="currentPage1"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="pageSize1"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="itemNum1">
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

import { getOtherEvaluationName,getOtherEvaluationResult,getMonthEvaluationResult } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'ExamineManageList',
    data(){
        return {
            tabSelect:"first",
            //一般考核结果
            beforeYearMonth:"",
            yearMonth:"",
            dateRange:"",
            evaluationName:"全部",
            evaluationNameArr:[],

            pageSize:10,
            currentPage:1,
            itemNum:0,
            commonStaffs:[],
            examineManageList:[],

            //月度考核结果
            yearMonth1:"",
            pageSize1:10,
            currentPage1:1,
            itemNum1:0,
            monthStaffs:[],
            examineManageList1:[],
            
            staffsList:[],
            clickItem:{},

            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }],
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.getNowTime();
        this.getOtherEvaluationName();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    methods:{
        loadCommonList(){
            this.examineManageList = [];
            this.commonStaffs = [];
            let managerID = this.userInfo.userStaffID;
            let year = "-1";
            let name;
            if (this.evaluationName == "全部") {
                name = "-1";
            }else{
                name = this.evaluationName;
            }
            let dateFrom = this.dateRange==null||this.dateRange==""?"-1":this.dateRange[0];
            let dateTo = this.dateRange==null||this.dateRange==""?"-1":this.dateRange[1];
            let staffID = "-1";
            let loading = showLoading();
            getOtherEvaluationResult(this.currentPage,this.pageSize,staffID,year,name,managerID,dateFrom,dateTo,"1","0").then((result)=>{
                closeLoading(loading);
                console.log(result.data.data);
                let arr = result.data.data;
                for (let i = 0; i < arr.length; i++) {
                    let obj1 = {};
                    obj1.StaffID = arr[i].StaffID;
                    obj1.StaffName = arr[i].StaffName;
                    this.commonStaffs.push(obj1);
                    if (arr[i].PointType=='5') {
                        if (arr[i].FinalPoint.trim()=="进行中") {
                            arr[i].stateName = "进行中";
                            arr[i].stateColor = "#FF9D00";
                        }else if (arr[i].FinalPoint.trim()=="待考核") {
                            arr[i].stateName = "待考核";
                            arr[i].stateColor = "#e51c23";
                        }else if (arr[i].FinalPoint.trim()=="已过期") {
                            arr[i].stateName = "已过期";
                            arr[i].stateColor = "#e51c23";
                        }else {
                            arr[i].stateName = arr[i].FinalPoint;
                            arr[i].stateColor = "#38ADFF";
                        }
                    }else{
                        if (arr[i].FinalPoint.trim()=="进行中") {
                            arr[i].stateName = "进行中";
                            arr[i].stateColor = "#FF9D00";
                        }else if (arr[i].FinalPoint.trim()=="待考核") {
                            arr[i].stateName = "待考核";
                            arr[i].stateColor = "#e51c23";
                        }else if (arr[i].FinalPoint.trim()=="已过期") {
                            arr[i].stateName = "已过期";
                            arr[i].stateColor = "#e51c23";
                        }else {
                            arr[i].stateName = "已完毕&nbsp;("+arr[i].FinalPoint+")"
                            arr[i].stateColor = "#38ADFF";
                        }
                    }
                }
                this.examineManageList = arr;
                this.itemNum = result.data.totalCount;
            }).catch((err)=>{
                alertError(this,"1201");
                closeLoading(loading);
            });
        },
        loadMonthlyList(){
            let examineManageList1 = [];
            let managerID = this.userInfo.userStaffID;
            let staffID = "-1";

			let date = new Date(this.yearMonth1.split("-")[0],(this.yearMonth1.split("-")[1]-1));
            let hasDays = new Date(this.yearMonth1.split("-")[0],this.yearMonth1.split("-")[1],0).getDate();

			let dateFrom = date.getFullYear() + "-" + (Array(3).join(0) + (date.getMonth() + 1)).slice(-2) + "-01";
            let dateTo = date.getFullYear() + "-" + (Array(3).join(0) + (date.getMonth() + 1)).slice(-2) + "-" + hasDays;

            let loading = showLoading();
            getMonthEvaluationResult(this.currentPage1,this.pageSize1,staffID,dateFrom,dateTo,managerID,"1","0").then((result)=>{
                closeLoading(loading);
                let arr2 = result.data.data;
                for (let i = 0; i < arr2.length; i++) {
                    let obj2 = {};
                    obj2.StaffID = arr2[i].StaffID;
                    obj2.StaffName = arr2[i].StaffName;
                    this.monthStaffs.push(obj2);
                    if (arr2[i].FinalPoint.trim()=="进行中") {
                        arr2[i].stateName = "进行中";
                        arr2[i].stateColor = "#FF9D00";
                    }else if (arr2[i].FinalPoint.trim()=="待考核") {
                        arr2[i].stateName = "待考核";
                        arr2[i].stateColor = "#e51c23";
                    }else {
                        arr2[i].stateName = "总分：" + arr2[i].FinalPoint;
                        arr2[i].stateColor = "";
                    }
                }
                this.itemNum1 = result.data.totalCount;
                this.examineManageList1 = arr2;
            })
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
        //一般考核点击考核结果内容后查看详情
        examineDetail(item,type){
            this.clickItem = item;
            if (type=="0") {
                this.clickItem.Type = type;
                this.clickItem.ManageID = item.StaffID;
            }else if (type=="1") {
                this.clickItem.Type = type;
                this.clickItem.ManageID = item.StaffID1;
            }else if (type=="2") {
                this.clickItem.Type = type;
                this.clickItem.ManageID = item.StaffID2;
            }else if (type=="3") {
                this.clickItem.Type = type;
                this.clickItem.ManageID = item.StaffID3;
            }
            this.staffsList = this.uniqueArray(this.commonStaffs,"StaffID");
            this.$router.push(this.$route.fullPath+"/showCommonDetail");
        },
        //月度考核点击考核结果内容后查看详情
        examineDetail1(item,type){
            this.clickItem = item;
            if (type=="1") {
                this.clickItem.Status = item.Point1?"1":"尚未考核";
                this.clickItem.ManageID = item.Manager1;
            }else if (type=="2") {
                this.clickItem.Status = item.Point2?"1":"尚未考核";
                this.clickItem.ManageID = item.Manager2;
            }else if (type=="3") {
                this.clickItem.Status = item.Point3?"1":"尚未考核";
                this.clickItem.ManageID = item.Manager3;
            }
            this.staffsList = this.uniqueArray(this.monthStaffs,"StaffID");
            this.$router.push(this.$route.fullPath+"/showMonthDetail");
        },
        handleCommand(item){
            if (item=="1") {
                this.$router.push(this.$route.fullPath+"/commonExamine");
            }else if (item=="2") {
                this.$router.push(this.$route.fullPath+"/monthlyExamine");
            }else if (item=="3") {
                this.$router.push("/mainpage/office/"+this.$route.params.id+"/examineTemplate");
            }
        },
        handleClick(tab, event) {
            if (tab.label == "一般考核结果") {
                this.loadCommonList();
            }else if (tab.label == "月度考核结果") {
                this.loadMonthlyList();
            }
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
        isVorPoint(item,num){
            if (item.PointType=='5') {
                return "√";
            }else{
                if (num == '0') {
                    return item.SelfPoint;
                }else if (num == '1') {
                    return item.Point1;
                }else if (num == '2') {
                    return item.Point2;
                }else if (num == '3') {
                    return item.Point3;
                }
            }
        },
        isVorPoint1(item,num){
            let self = ' (自)';
            let staffID = this.userInfo.userStaffID;
            if (num == '1') {
                if (!item.Point1) {
                    return "尚未考核"
                }
                if (item.Manager1==staffID) {
                    return item.Point1 + self;
                }else{
                    return item.Point1;
                }
            }else if (num == '2') {
                if (!item.Point2) {
                    return "尚未考核"
                }
                if (item.Manager2==staffID) {
                    return item.Point2 + self;
                }else{
                    return item.Point2;
                }
            }else if (num == '3') {
                if (!item.Point3) {
                    return "尚未考核"
                }
                if (item.Manager3==staffID) {
                    return item.Point3 + self;
                }else{
                    return item.Point3;
                }
            }
        },
        //获取当前时间
        getNowTime(){
            let date = new Date();
            let year =  date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            let beforeMonth = month - 1;
            let beforeYear = year;
            if (beforeMonth == 0) {
                beforeMonth = 12;
                beforeYear = year - 1;
            }else if (beforeMonth >= 1 && beforeMonth <= 9) {
                beforeMonth = "0" + beforeMonth;
            }
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            this.beforeYearMonth = beforeYear + "-" + beforeMonth;
            this.yearMonth = year + "-" + month;
            this.yearMonth1 = year + "-" + month;
            this.loadCommonList();
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.loadCommonList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.loadCommonList();
        },
        handleSizeChange1(val){
            this.pageSize1 = val;
            this.loadMonthlyList();
        },
        handleCurrentChange1(val){
            this.currentPage1 = val;
            this.loadMonthlyList();
        },
        //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0) {
                if (columnIndex == 0) {
				    return 'padding-bottom:7px;background:#38ADFF;color:#fff;'
                }
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
        tableCellClassName({ row, column, rowIndex, columnIndex }) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
        },
        //合并
        // arraySpanMethod({row, column, rowIndex, columnIndex}){
        //     if (columnIndex === 0) {
        //         if (row.index === 0) {
        //             return {
        //                 rowspan: row.len,
        //                 colspan: 1
        //             };
        //         } else {
        //             return {
        //                 rowspan: 0,
        //                 colspan: 0
        //             };
        //         }
        //     }
        //     if (columnIndex === 1) {
        //         if (row.index === 0) {
        //             return {
        //                 rowspan: row.len,
        //                 colspan: 1
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
.ExamineManageList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .examineManageList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.examineManageList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .examineManageList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .examineManageList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.bBtn{
    display: inline-block;
    margin-left: 5px;
    font-size: 12px;
    font-weight: normal;
    padding: 2px 2px 0 2px;
    line-height: 13px;
    border-radius: 12%;
    color:#fff;
    background:#38adff;
    border:1px solid #38adff;
    /* cursor: pointer; */
    /* color: #999; */
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.spanTitle{
    display: inline-block;
    height: 22px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.orangeButton{
    background: #FF9D00;
    border-color: #FF9D00;
    color: #fff;
}
.orangeButton:hover{
    background: rgb(255, 179, 56);
    border-color: rgb(255, 179, 56);
    color: #fff;
}
.iconStyle{
    font-family: "iconfont" !important;
    font-size: 13px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0px;
    color: #38adff;
    cursor: pointer;
}
.imgS{
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    transform: translateY(-1px);
}
</style>