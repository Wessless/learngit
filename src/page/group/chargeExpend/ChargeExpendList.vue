<template>
    <div class="ChargeExpendList groupEcharts">
        <router-view @showDialog="showDialog"></router-view>
        <chat-header :showBack="true" :title="title" :isgoBack="true" :gobackName="'goback'" @goback="goback"></chat-header>
        <div class="cosName">{{cosName}}</div>
        <div style="width:100%;padding:66px 20px 20px 20px;overflow:scroll;height:100vh;position:relative;">
            <div class="chargeCard">
                <div class="chargeCardItem">
                    <div class="title" style="background-color: #38ADFF;">今日<br />报销</div>
                    <div class="dateAndprice">
                        <div class="prices" @click="examineExpenseFind(true)">{{this.TodayMoneySum}}&nbsp;元</div>
                        <div class="today">{{this.todayDate}}</div>
                    </div>
                </div>
                <div class="chargeCardItem">
                    <div class="title" style="background-color: #FF9D00;">当月<br />报销</div>
                    <div class="dateAndprice">
                        <div class="prices" @click="examineExpenseFind(false)">{{this.MonthMoneySum}}&nbsp;元</div>
                        <div class="date">
                            <el-date-picker
                                v-model="chargeDate"
                                @change="getChargeByCosNum"
                                type="month"
                                format="yyyy-MM"
                                value-format="yyyy-MM"
                                :clearable="false"
                                style="width:100%"
                                size="small">
                            </el-date-picker>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="midTableHeight" style="width:100%;display:block;transform:translateY(-10px);">
                <el-table :data="data.OutDetail" border max-height="485" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle">
                    <el-table-column align="center" label="资金出处">
                        <el-table-column prop="OutName" align="center"  label="出处详细"  width="620"></el-table-column>
                        <el-table-column prop="MoneySum" align="center"  label="报销金额"  ></el-table-column>
                        <el-table-column prop="point" align="center" label="百分比"  ></el-table-column>
                    </el-table-column>
                </el-table>
            </div>

            <div class="midTableHeight" style="width:100%;display:block;margin-top:30px;transform:translateY(-10px);">
                <el-table :data="data.SubjectDetail" border max-height="485" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle">
                    <el-table-column align="center" label="资金分类">
                        <el-table-column prop="SubjectName" align="center"  label="资金科目"  width="550"></el-table-column>
                        <el-table-column prop="MoneySum" align="center"  label="报销金额"  ></el-table-column>
                        <el-table-column prop="point" align="center" label="百分比"  ></el-table-column>
                        <el-table-column align="center" label="统计"  width="80">
                            <template slot-scope="scope">
                                <span class="iconfont icon" @click.stop="examineEcharts(scope.row)">&#xe73b;</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog
                title="科目月变化图"
                class="subDialog"
                :center="true"
                :visible.sync="subDialogVisible"
                width="50%">
                <span style="margin-left:25px;padding-bottom:10px;display:block;">资金科目：<span style="color:#FF9D00;">{{subjectName}}</span></span>
                <v-chart :options="option" style="margin:0 auto;"/>
            </el-dialog>

            <el-dialog
                title="报销查询"
                :center="true"
                class="chargeBillDialog"
                :visible.sync="expDialogVisible"
                width="70%">
                <span style="margin-left:25px;display:block;">共{{ this.data.chargeBillNum }}条，总金额：{{ this.data.chargeBillMoney }}元</span>
                <div class="midTableHeight" style="width:95%;display:block;margin:10px auto;">
                    <el-table :data="data.chargeBillList" border max-height="500" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle1">
                        <el-table-column prop="ChargeBillID" align="center"  label="ID"  width="60"></el-table-column>
                        <el-table-column prop="FillStaff" align="center"  label="填表人"  width="80"></el-table-column>
                        <el-table-column prop="FillDate" align="center" label="填表日期"  width="120"></el-table-column>
                        <el-table-column prop="Money" align="center" label="报销金额"  width="110"></el-table-column>
                        <el-table-column align="center"  label="资金分类"  >
                            <template slot-scope="scope">
                                <span class="spanTitle">{{scope.row.Subject}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="详情"  width="80">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="examineExpenseDetail(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div>
                        <el-pagination
                            style="float:left;"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="data.chargeBillNum">
                        </el-pagination>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

import { getChargeByCosNum,getCosByCosNum,getAllYearChargeBySubjec,getChargeBillForGroup } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import config from '@config';

export default {
    name: 'ChargeExpendList',
    data(){
        return {
            title:"费用支出",
            todayDate:"",
            chargeDate:"",
            TodayMoneySum:"",
            MonthMoneySum:"",
            cosName:"",
            data:{
                SubjectDetail:[],
                OutDetail:[],
                chargeBillList:[],
                chargeBillNum:0,
                chargeBillMoney:0,
            },
            subDialogVisible:false,
            expDialogVisible:false,
            isClickToday:true,
            option:{},
            subjectName:"",
            pageSize:10,
            currentPage:1,
            isTodayDate:true,
        }
    },
    
    components:{
        ChatHeader
    },
    mounted(){
        if (this.isTodayDate) {
            this.getNowDate();
        }
        this.getCosByCosNum();
        this.getChargeByCosNum();
    },
    watch:{
        cosNum(newVal,oldVal){
            this.getNowDate();
            this.getCosByCosNum();
            this.getChargeByCosNum();
        }
    },
    // beforeMount() {
    //     console.log('beforeMounted')
    // },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs',
        ]),
        cosNum(){
            return this.$route.params.cosNum;
        }
    },
    methods:{ 
        showDialog(v){
            this.isTodayDate = v;
            this.expDialogVisible = true;
        },
        getCosByCosNum(){
            let cosNum = this.$route.params.cosNum;
            getCosByCosNum(cosNum).then((result)=>{
                // console.log(result.data);
                this.cosName = result.data.F_CosName;
            }).catch((err)=>{
                alertError(this,"1993");
            });
        },
        getChargeByCosNum(){
            // numCos,
			// acctID,
			// startDate,
            // endDate
            this.data.chargeBillList = [];
            let numCos = this.$route.params.cosNum;
            let acctID = this.userInfo.mobile;
            let startDate = this.chargeDate +'-'+'01';
            let hasDays = new Date(this.chargeDate.split("-")[0],this.chargeDate.split("-")[1],0).getDate();
            let endDate = this.chargeDate +'-'+hasDays;
            let loading = showLoading();
            getChargeByCosNum(numCos,acctID,startDate,endDate).then((result)=>{
                closeLoading(loading);
                this.MonthMoneySum = money(result.data.MonthMoneySum);
                this.TodayMoneySum = money(result.data.TodayMoneySum);
                this.data.SubjectDetail = result.data.SubjectDetail;
                this.data.OutDetail = result.data.OutDetail;

                let SubjectDetail = this.data.SubjectDetail;
                let subjectMoneySum = 0;
                for (let m = 0; m < SubjectDetail.length; m++) {
                    subjectMoneySum += parseFloat(SubjectDetail[m].MoneySum);
                }
                for (let i = 0; i < SubjectDetail.length; i++) {
                    this.data.SubjectDetail[i].point = ((parseFloat(SubjectDetail[i].MoneySum)/subjectMoneySum)*100).toFixed(2)+'%';
                }
                let OutDetail = this.data.OutDetail;
                let outMoneySum = 0;
                for (let n = 0; n < OutDetail.length; n++) {
                    outMoneySum += parseFloat(OutDetail[n].MoneySum);
                }
                for (let j = 0; j < OutDetail.length; j++) {
                    this.data.OutDetail[j].point = ((parseFloat(OutDetail[j].MoneySum)/outMoneySum)*100).toFixed(2)+'%';
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1172");
            });
        },
        goback(){
            this.$router.push("/mainpage/group");
        },
        getNowDate() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            let currentdate = year + "-" + month;
            this.todayDate = currentdate + "-" + strDate;
            this.chargeDate = currentdate;
        },
        //************************************************************************************************** */
        examineEcharts(item){
            this.option = {};
            let numCos = this.$route.params.cosNum;
            let acctID = this.userInfo.mobile;
            let yearMonth = this.chargeDate.replace("-","");
            this.subjectName = item.SubjectName
            this.subDialogVisible = true;
            let loading = showLoading();
            getAllYearChargeBySubjec(numCos,acctID,yearMonth,this.subjectName).then((result)=>{
                closeLoading(loading);
                let obj = result.data;
                let months = [];
                let alreadyMoney = [];
                let alreadyNum = [];
                for (let i = 0; i < obj.length; i++) {
                    months.unshift(obj[i].Date);
                    alreadyMoney.unshift(obj[i].MoneySum);
                    alreadyNum.unshift(obj[i].MoneyNum);
                }
                this.echartsLoad(months,alreadyMoney,alreadyNum,this.subjectName);
            }).catch((err)=>{
                alertError(this,"1263");
            });
        },
        echartsLoad(months,alreadyMoney,alreadyNum,subjectName){
            this.option = {
                grid:{
                    // bottom:50,
                    // left:60,
                    top:70,
                },
                tooltip: {//弹出数据提示
                    trigger: 'axis',
                },
                toolbox: {
                    show: true,
                    right: '20',
                    itemSize:12,
                    feature: {
                        // dataView: { //数据视图
                        //     show: true
                        // },
                        // restore: { //重置
                        //     show: true
                        // },
                        saveAsImage: {//保存图片
                            show: true,                         //是否显示该工具。
                            type:"png",                         //保存的图片格式。支持 'png' 和 'jpeg'。
                            name:"科目月变化图-"+subjectName,                        //保存的文件名称，默认使用 title.text 作为名称
                            backgroundColor:"#ffffff",        //保存的图片背景色，默认使用 backgroundColor，如果backgroundColor不存在的话会取白色
                            title:"保存为图片",
                            pixelRatio:1  
                        },
                        // magicType: {//动态类型切换
                        //     type: ['bar', 'line']
                        // }
                    }
                },
                legend: {
                    x: 'center',
                    // left:0,
                    // top:10,
                    data:["报销金额","报销单数"]
                },
                color:["#d14a61","#675bba"],
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: months,
                    axisLabel:{
                        rotate:-35,
                        interval:0
                    },
                },
                yAxis: [{
                    type: 'value',
                    name:'报销金额/元',
                    boundaryGap: [0, '20%'],
                    splitLine:{
                        show:true
                    },
                    axisLabel:{
                        formatter:'{value}'
                    }
                },{
                    type: 'value',
                    name:'报销单数/笔',
                    position:"right",
                    boundaryGap: [0, '20%'],
                    splitLine:{
                        show:false
                    },
                    minInterval:1,
                    axisLabel:{
                        formatter:'{value}'
                    },
                }],
                // dataZoom: [{
                //     type: 'inside',
                //     start: 50,
                //     end: 100
                // }],
                series: [
                    {
                        name:'报销金额',
                        type:'bar',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: alreadyMoney
                    },
                    {
                        name:'报销单数',
                        type:'line',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        yAxisIndex:1,
                        data: alreadyNum
                    }
                ]
            } 
        },
        //****************************************************************************************************** */
        examineExpenseFind(isClickToday){
            if (!this.expDialogVisible) {
                console.log("reload")
                this.pageSize = 10;
                this.currentPage = 1;
            }
            console.log("new"+this.currentPage)
            this.isClickToday = isClickToday;
            this.expDialogVisible = true;
            let cosNum = this.$route.params.cosNum;
            let currProxy = "";
            getCosByCosNum(cosNum).then((result)=>{
                let currCOSIP = result.data.F_CosUrl;
                let proxyTables = config.dev.proxyTable;
                for(let proxyTable in proxyTables){
                    if(proxyTables[proxyTable].target==currCOSIP){
                        currProxy = proxyTable
                    }
                }
                if(currProxy=='/COS0OUT'&&this.userInfo.currProxy=='/COS0IN'){
                    currProxy = '/COS0IN'
                }
                console.log("new11111:"+this.currentPage)
                this.getChargeBillForGroup(currProxy,cosNum);
            }).catch((err)=>{
                alertError(this,"1993");
            });
        },
        getChargeBillForGroup(currProxy,cosNum){
            this.data.chargeBillList=[];
            let chargeDateFrom;
            let chargeDateTo;
            let hasDays = new Date(this.chargeDate.split("-")[0],this.chargeDate.split("-")[1],0).getDate();
            if (this.isClickToday) {
                chargeDateFrom = this.todayDate;
                chargeDateTo = this.todayDate;
            }else{
                chargeDateFrom = this.chargeDate +'-'+'01';
                chargeDateTo = this.chargeDate +'-'+hasDays;
            }
            let status = "2";
            let loading = showLoading();
            console.log("new---------------"+this.currentPage)
            getChargeBillForGroup(currProxy,cosNum,this.currentPage,this.pageSize,"-1","-1","-1","-1","-1",chargeDateFrom,chargeDateTo,"-1","-1","-1","-1","-1","-1",status,"-1","-1","-1","-1","-1")
            .then((result)=>{
                closeLoading(loading);
                this.data.chargeBillList = result.data.data;
                for (let i = 0; i < this.data.chargeBillList.length; i++) {
                    this.data.chargeBillList[i].Money = money(this.data.chargeBillList[i].Money);
                }
                this.data.chargeBillNum = result.data.totalCount;
                this.data.chargeBillMoney = money(result.data.TotalMoney);
                console.log(this.data.chargeBillList)
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1174");
            });
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.examineExpenseFind(this.isClickToday);
        },
        handleCurrentChange(val){
            console.log(val)
            this.currentPage = val;
            // console.log("handleCurrentChange:"+this.currentPage);
            this.examineExpenseFind(this.isClickToday);
        },
        examineExpenseDetail(item){
            let expenseID = item.ChargeBillID;
            this.expDialogVisible = false;
            this.$router.push(this.$route.fullPath+"/expense/"+expenseID);
        },
         //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0||rowIndex == 1) {
                if (columnIndex == 0&&rowIndex == 0) {
				    return 'padding-bottom:7px;background:rgba(136,136,136);color:#fff;'
                }
                return 'background:rgba(136,136,136,.5);color:#fff;text-align:center;'
            }
        },
        getColStyle({ row, column, rowIndex, columnIndex }){
            if (columnIndex == 0) {
				return 'padding-bottom:7px;text-align:center;'
			} else {
				return ''
            }
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 1) {
                return 'grayRow';
            }
            return '';
        },
        getRowStyle1({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0||rowIndex == 1) {
                if (columnIndex == 0) {
				    return 'padding-bottom:7px;background:#38adff;color:#fff;'
                }
                return 'background:#38adff;color:#fff;text-align:center;'
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.ChargeExpendList{
    /* padding:20px; */
    /* display: flex;
    flex-direction: row; */
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
.chargeCard{
    /* padding:20px 20px 0 20px; */
    padding:10px 20px 20px 20px;
    display: grid;
    width: 100%;
    grid-template-columns: 50% 50%;
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    /* background: red; */
}
@media screen and (max-width: 1140px){
    .chargeCard{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
@media screen and (max-width: 980px){
    .chargeCard{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
@media screen and (max-width: 800px){
    .chargeCard{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
.chargeCardItem{
    display: flex;
    height:80px;
    justify-self: center;
    width: 80%;
    margin-bottom: 15px;
    flex-direction: row;
    border:1px solid #dddddd;
    border-radius: 5px;
    align-items: center;
}
.chargeCardItem > .title{
    /* display: inline-block;
    height:20px; */
    color: #fff;
    text-align: center;
    font-size: 20px;
    height: 100%;
    width: 85px;
    letter-spacing : 10px;
    padding-top:10px;
    /* line-height: 78px; */
}
.chargeCardItem > .price{
    /* display: inline-block;
    height:20px; */
    font-size: 20px;
    text-align: center;
    height: 100%;
    flex: 1;
    color:#38ADFF;
    line-height: 39px;
}
.chargeCardItem > .dateAndprice{
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.dateAndprice .date{
    /* line-height: 35px; */
    /* background-color: rgba(255, 157, 0); */
    /* border-bottom:1px solid #dddddd; */
    box-sizing: border-box;
    width:100%;
    flex:1;
    display: flex;
    align-items: center;
    justify-content: center;
}
.dateAndprice .today{
    font-size: 14px;
    text-align: center;
    flex: 1;
    color: #333;
    width: 100%;
    /* background-color: rgba(56, 173, 255); */
}
.dateAndprice .prices{
    text-align: center;
    flex: 2;
    font-size: 24px;
    width: 100%;
    color:#38ADFF;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
.el-form-item {
    margin-bottom: 0px !important;
}
.el-tabs__nav {
    width: 100% !important;
}
.cosName{
    width:100%;
    /* padding:60px 0 5px 0; */
    position: absolute;
    top: 36px;
    left: 0;
    /* background-color: #FFFACD; */
    text-align: center;
    color: #38ADFF;
    z-index: 9;
    font-size: 12px;
}
.icon{
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
    color: #38ADFF;
}
.spanTitle{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>