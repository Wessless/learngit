<template>
    <div class="ChargeExpendList groupEcharts">
        <chat-header :showBack="true" :title="title" :isgoBack="true" :gobackName="'goback'" @goback="goback"></chat-header>
        <div class="cosName">{{cosName}}</div>
        <div style="width:100%;padding:66px 20px 20px 20px;overflow:scroll;height:100vh;position:relative;">
            <el-tabs v-model="tabSelect" @tab-click="handleClick" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;width:100%;" class="tuitionIncomeTabs">
                <el-tab-pane label="按天" name="first" >
                    <div v-if="clickTabName=='按天'">
                    <div class="chargeCard">
                        <div class="chargeCardItem">
                            <div class="title" style="background-color: #38ADFF;">今日<br />收费</div>
                            <div class="dateAndprice">
                                <div class="prices">{{data.tuitionMoney}}&nbsp;元</div>
                                <div class="date">
                                    <el-date-picker
                                        v-model="dayDate"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :clearable="false"
                                        style="width:100%"
                                        @change="loadList"
                                        size="small">
                                    </el-date-picker>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div class="echartsCard">
                        <div class="echartsCardItem">
                            <div class="title">近一月学费收入统计图</div>
                            <v-chart v-if="isNotCloseLeft" class="echarts" id="echartsMonth" :options="data.optionMonth"/>
                        </div>
                    </div>
                    <div class="smallEchartsCard">
                        <div class="echartsCardItem">
                            <div class="title">按支付方式统计图</div>
                            <v-chart v-if="isNotCloseLeft" class="echarts" id="echartsPaymentType" :options="data.optionPaymentType"/>
                        </div>
                        <div class="echartsCardItem">
                            <div class="title">按缴费科目统计图</div>
                            <v-chart v-if="isNotCloseLeft" class="echarts" id="echartsPaymentName" :options="data.optionPaymentName"/>
                        </div>
                        <div class="echartsCardItem">
                            <div class="title">按班级</div>
                            <div class="midTableHeight table">
                                <el-table :data="data.classDataList" border max-height="335" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle">
                                    <el-table-column prop="paymentClasse" align="center"  label="班级名称"></el-table-column>
                                    <el-table-column prop="pay" align="center"  label="收费金额"  width="120"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="按月" name="second" >
                    <div v-if="clickTabName=='按月'">
                    <div class="chargeCard">
                        <div class="chargeCardItem">
                            <div class="title" style="background-color: #38ADFF;">本月<br />收费</div>
                            <div class="dateAndprice">
                                <div class="prices">{{data.tuitionMoney}}&nbsp;元</div>
                                <div class="date">
                                    <el-date-picker
                                        v-model="monthDate"
                                        type="month"
                                        format="yyyy-MM"
                                        value-format="yyyy-MM"
                                        :clearable="false"
                                        style="width:100%"
                                        @change="loadList"
                                        size="small">
                                    </el-date-picker>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div class="echartsCard">
                        <div class="echartsCardItem">
                            <div class="title">近半年学费收入统计图</div>
                            <v-chart v-if="isNotCloseLeft" class="echarts" :options="data.optionMonth"/>
                        </div>
                    </div>
                    <div class="smallEchartsCard">
                        <div class="echartsCardItem">
                            <div class="title">按支付方式统计图</div>
                            <v-chart v-if="isNotCloseLeft" class="echarts" :options="data.optionPaymentType"/>
                        </div>
                        <div class="echartsCardItem">
                            <div class="title">按缴费科目统计图</div>
                            <v-chart v-if="isNotCloseLeft" class="echarts" :options="data.optionPaymentName"/>
                        </div>
                        <div class="echartsCardItem">
                            <div class="title">按班级</div>
                            <div class="midTableHeight table">
                                <el-table :data="data.classDataList" border max-height="335" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle">
                                    <el-table-column prop="paymentClasse" align="center"  label="班级名称"></el-table-column>
                                    <el-table-column prop="pay" align="center"  label="收费金额"  width="120"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

import { getCosByCosNum,getCosStatisticByDate,getCosStatisticByDay,getCosStatisticByMonth,getCosStatisticByPaymentWay,
         getCosStatisticByPaymentName,getCosStatisticByPaymentClass } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import config from '@config';

export default {
    name: 'ChargeExpendList',
    data(){
        return {
            title:"学费收入",
            cosName:"",
            dayDate:"",
            monthDate:"",
            tabSelect:"first",
            clickTabName:"",
            data:{
                tuitionMoney:"",
                optionMonth:{},
                optionPaymentType:{},
                optionPaymentName:{},
                classDataList:[],
            },
            isNotCloseLeft:true,
        }
    },
    
    components:{
        ChatHeader
    },
    mounted(){
        if (this.tabSelect == "first") {
            this.clickTabName = "按天";
        }else if (this.tabSelect == "second") {
            this.clickTabName = "按月";
        }
        this.getNowDate();
        this.getCosByCosNum();
        this.loadList();
    },
    watch:{
        cosNum(newVal,oldVal){
            this.getCosByCosNum();
            this.loadList();
        },
        closeLeft(newVal,oldVal){
            this.isNotCloseLeft = false;
            setTimeout(()=>{
                this.isNotCloseLeft = true;
            },0);
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs',
            'closeLeft',
        ]),
        cosNum(){
            return this.$route.params.cosNum;
        }
    },
    methods:{ 
        getCosByCosNum(){
            let cosNum = this.$route.params.cosNum;
            getCosByCosNum(cosNum).then((result)=>{
                // console.log(result.data);
                this.cosName = result.data.F_CosName;
            }).catch((err)=>{
                alertError(this,"1993");
            });
        },
        loadList(){
            this.data.optionMonth = {};
            this.data.optionPaymentType = {};
            this.data.optionPaymentName = {};
            this.data.classDataList = [];
            let cosNum = this.$route.params.cosNum;
            let acctID = this.userInfo.mobile;
            let startDate,endDate;
            let promises = [];
            if (this.clickTabName=="按天") {
                startDate = this.dayDate;
                endDate = this.dayDate;
                let dateObj = new Date(endDate.split("-")[0],parseInt(endDate.split("-")[1])-1,endDate.split("-")[2]);
                dateObj.setDate(dateObj.getDate()-30);
                let startDate1 = dateObj.getFullYear() + "-" + (Array(3).join(0) + (dateObj.getMonth() + 1)).slice(-2) + "-" + (Array(3).join(0) + dateObj.getDate()).slice(-2);
                promises = [
                    getCosStatisticByDate(cosNum,acctID,startDate,endDate),
                    getCosStatisticByDay(cosNum,acctID,startDate1,endDate),
                    getCosStatisticByPaymentWay(cosNum,acctID,startDate,endDate),
                    getCosStatisticByPaymentName(cosNum,acctID,startDate,endDate),
                    getCosStatisticByPaymentClass(cosNum,acctID,startDate,endDate),
                ];
            }else if (this.clickTabName=="按月") {
                startDate = this.monthDate +"-"+ "01";
                let day = new Date(this.monthDate.split("-")[0] , this.monthDate.split("-")[1], 0).getDate();
                endDate = this.monthDate +"-"+ day;
                let dateStr = this.monthDate;
                let dateObj1 = new Date(dateStr.split("-")[0],parseInt(dateStr.split("-")[1])-1,1);
                let endMonth = dateObj1.getFullYear() + "-" + (Array(3).join(0) + (dateObj1.getMonth() + 1)).slice(-2) + "-" + (Array(3).join(0) + dateObj1.getDate()).slice(-2);
                dateObj1.setMonth(dateObj1.getMonth()-6);
                let startmonth = dateObj1.getFullYear() + "-" + (Array(3).join(0) + (dateObj1.getMonth() + 1)).slice(-2) + "-" + (Array(3).join(0) + dateObj1.getDate()).slice(-2);
                promises = [
                    getCosStatisticByDate(cosNum,acctID,startDate,endDate),
                    getCosStatisticByMonth(cosNum,acctID,startmonth,endMonth),
                    getCosStatisticByPaymentWay(cosNum,acctID,startDate,endDate),
                    getCosStatisticByPaymentName(cosNum,acctID,startDate,endDate),
                    getCosStatisticByPaymentClass(cosNum,acctID,startDate,endDate),
                ];
            }
            let loading = showLoading();
            Promise.all(promises).then((result) => {
                closeLoading(loading);
                this.data.tuitionMoney = money(result[0].data.TotalMoney);
                
                let result1 = result[1].data;
                let months = [];
				let alreadyMoney = [];
				if (this.clickTabName == "按天") {
                    for(let i=0;i<result1.days.length;i++){
                        months.push(result1.days[i]);
                        alreadyMoney.push(result1.prices[i]);
                    }
                }else if (this.clickTabName == "按月") {
                    for(let i=0;i<result1.months.length;i++){
                        months.push(result1.months[i]);
                        alreadyMoney.push(result1.prices[i]);
                    }
                }
                this.monthDateEchartsLoad(months,alreadyMoney);

                let result2 = result[2].data;
                let months1 = [];
				let alreadyMoney1 = [];
				for(let j=0;j<result2.paymentWays.length;j++){
					months1.push(result2.paymentWays[j]);
					alreadyMoney1.push(result2.pays[j]);
                }
                this.paymentTypeEchartsLoad(months1,alreadyMoney1);
                
                let result3 = result[3].data;
                let months2 = [];
                let strArr = [];
				let alreadyMoney2 = [];
				for(let m=0;m<result3.paymentNames.length;m++){
                    months2.push(result3.paymentNames[m]);
					alreadyMoney2.push(result3.pays[m]);
                }
                this.paymentNameEchartsLoad(months2,alreadyMoney2);

                let result4 = result[4].data;
                for (let n = 0; n < result4.paymentClasses.length; n++) {
                    let obj = {};
                    if (result4.paymentClasses[n] == "缴费区") {
                        obj.paymentClasse = "<无班级信息>";
                    }else{
                        obj.paymentClasse = result4.paymentClasses[n];
                    }
                    obj.pay = money(result4.pays[n])+"元";
                    this.data.classDataList.push(obj);
                }
                console.log(this.data.classDataList)
                // console.log(result[0].data)
                // console.log(result[1].data)
            }).catch((err)=>{
                closeLoading(loading);
                console.log(err)
                alertError(this,"5016/5017/5018/5019/5020/5021");
            });
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
            this.dayDate = currentdate + "-" + strDate;
            this.monthDate = currentdate;
        },
        monthDateEchartsLoad(months,alreadyMoney){
            this.data.optionMonth = {
                grid:{
                    x:"70px",
                    x2:"45px"
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
                            name:this.clickTabName=="按天"?"近一月学费收入统计图":"近半年学费收入统计图",     //保存的文件名称，默认使用 title.text 作为名称
                            backgroundColor:"#ffffff",        //保存的图片背景色，默认使用 backgroundColor，如果backgroundColor不存在的话会取白色
                            title:"保存为图片",
                            pixelRatio:1  
                        },
                        // magicType: {//动态类型切换
                        //     type: ['bar', 'line']
                        // }
                    }
                },
                tooltip: {//弹出数据提示
                    trigger: 'axis',
                },
                legend: {
                    orient: 'vertical',
                    x: 'center',
                    data:["收费金额"]
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: months,
                    axisLabel:{
                        rotate:-35,
                        interval:0
                    },
                },
                yAxis: {
                    type: 'value',
                    offset:0,
                    boundaryGap: [0, '20%'],
                },
                series: [
                    {
                        name:'收费金额',
                        type:'bar',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: alreadyMoney,
                        barWidth: this.clickTabName=="按月"?"40px":"auto"
                    }
                ]
            };
        },
        paymentTypeEchartsLoad(months,alreadyMoney){
            this.data.optionPaymentType = {
                grid:{
                    x:"65px",
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
                            name:"按支付方式统计图",             //保存的文件名称，默认使用 title.text 作为名称
                            backgroundColor:"#ffffff",        //保存的图片背景色，默认使用 backgroundColor，如果backgroundColor不存在的话会取白色
                            title:"保存为图片",
                            pixelRatio:1  
                        },
                        // magicType: {//动态类型切换
                        //     type: ['bar', 'line']
                        // }
                    }
                },
                tooltip: {//弹出数据提示
                    trigger: 'axis',
                },
                legend: {
                    orient: 'vertical',
                    x: 'center',
                    data:["收费金额"]
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: months,
                    axisLabel:{
                        rotate:-35,
                        interval:0,
                        formatter:function(value){
                            if (value.length>6) {
                                let str;
                                if (value[4] == "年") {
                                    str = value.substring(8,value.length);
                                }else{
                                    str = value.substring(6,value.length);
                                }
                                let newVal = value.replace(str,"...");
                                return newVal;
                            }else{
                                return value;
                            }
                        }
                    },
                },
                yAxis: {
                    type: 'value',
                    offset:0,
                    boundaryGap: [0, '20%'],
                },
                color:"#38adff",
                series: [
                    {
                        name:'收费金额',
                        type:'bar',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: alreadyMoney,
                        barWidth: "60px"
                    }
                ]
            };
        },
        paymentNameEchartsLoad(months,alreadyMoney){
            this.data.optionPaymentName = {
                grid:{
                    x:"70px",
                    x2:"40px"
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
                            name:"按支付方式统计图",             //保存的文件名称，默认使用 title.text 作为名称
                            backgroundColor:"#ffffff",        //保存的图片背景色，默认使用 backgroundColor，如果backgroundColor不存在的话会取白色
                            title:"保存为图片",
                            pixelRatio:1  
                        },
                        // magicType: {//动态类型切换
                        //     type: ['bar', 'line']
                        // }
                    }
                },
                tooltip: {//弹出数据提示
                    trigger: 'axis',
                },
                legend: {
                    orient: 'vertical',
                    x: 'center',
                    data:["收费金额"]
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: months,
                    axisLabel:{
                        rotate:-35,
                        interval:0,
                        formatter:function(value){
                            if (value.length>6) {
                                let str;
                                if (value[4] == "年") {
                                    str = value.substring(8,value.length);
                                }else{
                                    str = value.substring(6,value.length);
                                }
                                let newVal = value.replace(str,"...");
                                return newVal;
                            }else{
                                return value;
                            }
                        }
                    },
                },
                yAxis: {
                    type: 'value',
                    offset:0,
                    boundaryGap: [0, '20%'],
                },
                color:"#FF9D00",
                series: [
                    {
                        name:'收费金额',
                        type:'bar',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: alreadyMoney,
                        barWidth: months.length>7?"auto":"40px"
                    }
                ]
            };
        },
        goback(){
            this.$router.push("/mainpage/group");
        },
        handleClick(tab, event) {
            if (tab.label == "按天") {
                this.clickTabName = "按天";
                this.loadList();
            }else if (tab.label == "按月") {
                this.clickTabName = "按月";
                this.loadList();
            }
        },

        //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0||rowIndex == 1) {
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
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
            return '';
        },
        getRowStyle1({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0||rowIndex == 1) {
                if (columnIndex == 0) {
				    return 'padding-bottom:7px;background:#FF9D00;color:#fff;'
                }
                return 'background:#FF9D00;color:#fff;text-align:center;'
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
    padding:10px 20px;
    display: grid;
    width: 100%;
    grid-template-columns: 100%;
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    /* background: red; */
}
@media screen and (max-width: 1140px){
    .chargeCard{
        padding:10px 20px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
@media screen and (max-width: 980px){
    .chargeCard{
        padding:10px 20px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
@media screen and (max-width: 800px){
    .chargeCard{
        padding:10px 20px;
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
    width: 40%;
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
.echartsCard{
    /* padding:20px 20px 0 20px; */
    padding:10px;
    display: grid;
    width: 100%;
    grid-template-columns: 100%;
    max-height: 100%;
    background: #fafafa;
    /* background: red; */
}
@media screen and (max-width: 1140px){
    .echartsCard{
        padding:10px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;;
        max-height: 100%;
        background: #fafafa;
    }
}
@media screen and (max-width: 980px){
    .echartsCard{
        padding:10px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;;
        max-height: 100%;
        background: #fafafa;
    }
}
@media screen and (max-width: 800px){
    .echartsCard{
        padding:10px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
        max-height: 100%;
        background: #fafafa;
    }
}
.echartsCardItem{
    position: relative;
    height:400px;
    justify-self: center;
    width: 98%;
    margin-bottom: 15px;
    border:1px solid #dddddd;
    border-radius: 5px;
    align-items: center;
    display: flex;
    flex-direction: column;
}
.smallEchartsCard .echartsCardItem{
    width: 95%;
}
.echartsCardItem > .title{
    font-size: 20px;
    text-align: center;
    height: 100%;
    flex: 1;
    width: 100%;
    line-height: 39px;
}
.echartsCardItem > .echarts{
    flex: 11;
    width: 100%;
}
.echartsCardItem > .table{
    flex: 11;
    width:100%;
    display:block;
    margin-top: 5px;
}
.echartsCardItem > .echarts > div{
    width: 100% !important;
}
.smallEchartsCard{
    /* padding:20px 20px 0 20px; */
    padding:10px;
    display: grid;
    width: 100%;
    grid-template-columns: 50% 50%;
    max-height: 100%;
    background: #fafafa;
    /* background: red; */
}
@media screen and (max-width: 1140px){
    .smallEchartsCard{
        padding:10px;
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
        max-height: 100%;
        background: #fafafa;
    }
}
@media screen and (max-width: 980px){
    .smallEchartsCard{
        padding:10px;
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
        max-height: 100%;
        background: #fafafa;
    }
}
@media screen and (max-width: 800px){
    .smallEchartsCard{
        padding:10px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
        max-height: 100%;
        background: #fafafa;
    }
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
</style>