<template>
    <div class="ExamineScoreList">
        <router-view :item="clickItem" @refresh="refresh" :staffsList="staffsList"></router-view>
        <chat-header :showBack="true" :title="'考核评分'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding:54px 20px 20px 20px;overflow:scroll;">
            <el-tabs v-model="tabSelect" @tab-click="handleClick" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;width:100%;" class="tuitionIncomeTabs">
                <el-tab-pane label="评分任务" name="first" >
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 10px;">
                        <el-table :data="examineScoreList" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="455">
                            <el-table-column align="center"  label="一般考核" >
                                <el-table-column prop="StaffName" align="center"  label="被考核人"  width="100"></el-table-column>
                                <el-table-column label="考核名称">
                                    <template slot-scope="scope">
                                        <span class="spanTitle">{{scope.row.Name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center"  label="有效时间"  width="220">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.BeginDate.split(" ")[0]+' ~ '+scope.row.EndDate.split(" ")[0]}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center"  label="状态"  width="120">
                                    <template slot-scope="scope">
                                        <span :style="{color:scope.row.stateColor}">{{scope.row.statusName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" width="80">
                                    <template slot-scope="scope">
                                        <el-button
                                            type="primary"
                                            size="mini"
                                            @click="scoreExamine(scope.row,'1')">评分</el-button>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="midTableHeight" style="width:100%;display:block;padding:30px 10px 0px 10px;">
                        <el-table :data="examineScoreList1" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle1" border max-height="470">
                            <el-table-column align="center"  label="月度考核">
                                <el-table-column prop="StaffName" align="center"  label="被考核人"></el-table-column>
                                <el-table-column align="center"  label="状态"  width="120">
                                    <template slot-scope="scope">
                                        <span :style="{color:scope.row.stateColor}">{{scope.row.statusName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" width="80">
                                    <template slot-scope="scope">
                                        <el-button
                                            type="primary"
                                            size="mini"
                                            @click="scoreExamine(scope.row,'2')">评分</el-button>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="评分结果" name="second" >
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 10px;">
                        <el-table :data="examineResultList" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="455">
                            <el-table-column align="center"  label="一般考核" >
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
                            </el-table-column>
                        </el-table>
                    </div>
                    
                    <div class="midTableHeight" style="width:100%;display:block;padding:30px 10px 0px 10px;">
                        <el-table :data="examineResultList1" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle1" border max-height="470">
                            <el-table-column align="center"  label="月度考核">
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
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

import { getEvaluationList,getAllMonthEvaluationList,getMonthEvaluationResult,getOtherEvaluationResult } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'ExamineScoreList',
    data(){
        return {
            tabSelect:"first",
            dialogVisible:false,
            
            commonStaffs:[],
            examineScoreList:[],
            monthStaffs:[],
            examineScoreList1:[],

            examineResultList:[],
            examineResultList1:[],

            staffsList:[],
            clickItem:{},
            currentPage:1,
            pageSize:1000,
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.loadListScore();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    methods:{
        refresh(){
            this.loadListScore();
        },
        loadListScore(){
            this.examineScoreList = [];
            this.commonStaffs = [];
            this.monthStaffs = [];
            let staffID = "-1";
            let managerID = this.userInfo.userStaffID;
            let loading = showLoading();
            Promise.all([
                getEvaluationList(staffID,managerID),
                getAllMonthEvaluationList(staffID,managerID),
            ]).then((result)=>{
                closeLoading(loading);
                let arr1 = result[0].data.data;
                for (let i = 0; i < arr1.length; i++) {
                    let obj1 = {};
                    obj1.StaffID = arr1[i].StaffID;
                    obj1.StaffName = arr1[i].StaffName;
                    this.commonStaffs.push(obj1);

                    if(arr1[i].Status=="0"){
                        arr1[i].statusName = "尚未考核";
                        arr1[i].stateColor = "#e51c23";
                    }else if(arr1[i].Status=="1"||arr1[i].Status=="已考核"){
                        arr1[i].statusName = "已考核";
                        arr1[i].stateColor = "#4DC060";
                    }else{
                        arr1[i].statusName = arr1[i].Status;
                        arr1[i].stateColor = "#FF9D00";
                    }
                }
                console.log(this.commonStaffs)
                let arr2 = [];
                if (result[1].data.totalCount!="0") {
                    arr2 = result[1].data.data;
                    for (let j = 0; j < arr2.length; j++) {
                        let obj2 = {};
                        obj2.StaffID = arr2[j].StaffID;
                        obj2.StaffName = arr2[j].StaffName;
                        this.monthStaffs.push(obj2);

                        arr2[j].statusName = arr2[j].Status;
                        if (arr2[j].Status == "尚未考核") {
                            arr2[j].stateColor = "#e51c23";
                        }else{
                            arr2[j].stateColor = "#4DC060";
                        }
                    }
                }
                this.examineScoreList = arr1;
                this.examineScoreList1 = arr2;
            }).catch((err)=>{
                console.log(err);
                alertError(this,"1199/1210");
                closeLoading(loading);
            });
        },
        loadListResult(){
            let examineResultList = [];
            this.commonStaffs = [];
            this.monthStaffs = [];
            let managerID = this.userInfo.userStaffID;
            let year = "-1";
            let name = "-1";
            let staffID = "-1";
            let dateFrom = "-1";
            let dateTo = "-1";
            let loading = showLoading();
            Promise.all([
                getOtherEvaluationResult(this.currentPage,this.pageSize,staffID,year,name,managerID,dateFrom,dateTo,"1","1"),
                getMonthEvaluationResult(this.currentPage,this.pageSize,staffID,dateFrom,dateTo,managerID,"1","1"),
            ]).then((result)=>{
                closeLoading(loading);
                let arr1 = result[0].data.data;
                console.log(arr1)
                for (let i = 0; i < arr1.length; i++) {
                    let obj1 = {};
                    obj1.StaffID = arr1[i].StaffID;
                    obj1.StaffName = arr1[i].StaffName;
                    this.commonStaffs.push(obj1);

                    if (arr1[i].PointType=='5') {
                        if (arr1[i].FinalPoint.trim()=="进行中") {
                            arr1[i].stateName = "进行中";
                            arr1[i].stateColor = "#FF9D00";
                        }else if (arr1[i].FinalPoint.trim()=="待考核") {
                            arr1[i].stateName = "待考核";
                            arr1[i].stateColor = "#e51c23";
                        }else if (arr1[i].FinalPoint.trim()=="已过期") {
                            arr1[i].stateName = "已过期";
                            arr1[i].stateColor = "#e51c23";
                        }else {
                            arr1[i].stateName = arr1[i].FinalPoint;
                            arr1[i].stateColor = "#4DC060";
                        }
                    }else{
                        if (arr1[i].FinalPoint.trim()=="进行中") {
                            arr1[i].stateName = "进行中";
                            arr1[i].stateColor = "#FF9D00";
                        }else if (arr1[i].FinalPoint.trim()=="待考核") {
                            arr1[i].stateName = "待考核";
                            arr1[i].stateColor = "#e51c23";
                        }else if (arr1[i].FinalPoint.trim()=="已过期") {
                            arr1[i].stateName = "已过期";
                            arr1[i].stateColor = "#e51c23";
                        }else {
                            arr1[i].stateName = "已完毕&nbsp;("+arr1[i].FinalPoint+")"
                            arr1[i].stateColor = "#4DC060";
                        }
                    }
                }
                let arr2 = result[1].data.data;
                for (let j = 0; j < arr2.length; j++) {
                    let obj2 = {};
                    obj2.StaffID = arr2[j].StaffID;
                    obj2.StaffName = arr2[j].StaffName;
                    this.monthStaffs.push(obj2);
                    if (arr2[j].FinalPoint.trim()=="进行中") {
                        arr2[j].stateName = "进行中";
                        arr2[j].stateColor = "#FF9D00";
                    }else if (arr2[j].FinalPoint.trim()=="待考核") {
                        arr2[j].stateName = "待考核";
                        arr2[j].stateColor = "#e51c23";
                    }else {
                        arr2[j].stateName = "总分：" + arr2[j].FinalPoint;
                        arr2[j].stateColor = "";
                    }
                }
                this.examineResultList = arr1;
                this.examineResultList1 = arr2;
            }).catch((err)=>{
                console.log(err);
                alertError(this,"1201/1283");
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
        scoreExamine(item,type){
            this.clickItem = item;
            if (type=="1") {
                this.staffsList = this.uniqueArray(this.commonStaffs,"StaffID");
                this.$router.push(this.$route.fullPath+"/commonScore");
            }else if (type=="2") {
                this.staffsList = this.uniqueArray(this.monthStaffs,"StaffID");
                this.$router.push(this.$route.fullPath+"/monthlyScore");
            }
        },
        handleClick(tab, event) {
            if (tab.label == "评分任务") {
                this.loadListScore();
            }else if (tab.label == "评分结果") {
                this.loadListResult();
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
        tableCellClassName({ row, column, rowIndex, columnIndex }) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.ExamineScoreList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .examineScoreList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.examineScoreList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .examineScoreList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .examineScoreList{
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
    height: 17px;
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
</style>