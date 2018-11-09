<template>
    <div class="StudentDataList groupEcharts">
        <router-view @showDialog="showDialog"></router-view>
        <chat-header :showBack="true" :title="title" :isgoBack="true" :gobackName="'goback'" @goback="goback"></chat-header>
        <div class="cosName">{{cosName}}</div>
        <div style="width:100%;padding:66px 20px 20px 20px;overflow:scroll;height:100vh;position:relative;">
            <div class="childCard">
                <div class="childCardItem">
                    <div class="title" style="background-color: #38ADFF;">今日<br />应该<br />出勤</div>
                    <div class="childNum"><span style="display:block;width:100%;text-align: center;">{{data.ChildCount}}&nbsp;名</span></div>
                </div>
                <div class="childCardItem">
                    <div class="title" style="background-color: #FF9D00;">今日<br />实际<br />出勤</div>
                    <div class="childNum"><span style="display:block;width:100%;text-align: center;">{{data.AttCount}}&nbsp;名{{data.AttPercent?"("+data.AttPercent+")":""}}</span></div>
                </div>
            </div>
            <div class="echartsCard">
                <div class="echartsCardItem">
                    <div class="title">近一月出勤统计图</div>
                    <v-chart @click="clickDayAttendance" v-if="isNotCloseLeft" class="echarts" :options="data.optionMonth"/>
                </div>
                <div class="echartsCardItem">
                    <div class="title">近半年出勤统计图</div>
                    <v-chart @click="clickMonthAttendance" v-if="isNotCloseLeft" class="echarts" :options="data.optionYear"/>
                </div>
            </div>
            <el-dialog
                title="日度学员出勤"
                :center="true"
                :visible.sync="dayDialogVisible"
                width="50%">
                <div class="midTableHeight" style="width:95%;display:block;margin:10px auto;">
                    <div style="transform:translateY(-20px)">
                        <label>日期：</label>
                        <el-date-picker
                            v-model="dayDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :clearable="false"
                            style="width:160px"
                            @change="clickDayAttendance"
                            size="small">
                        </el-date-picker>
                    </div>
                    <el-table :data="data.dayAttendance" border max-height="350" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle">
                        <el-table-column prop="ClassName" align="center"  label="班级名称"></el-table-column>
                        <el-table-column align="center"  width="120"  label="出勤状况">
                            <template slot-scope="scope">
                                <span>{{scope.row.AttCount+"/"+scope.row.ChildCount}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="AttPercent" align="center"  width="80"  label="百分比"></el-table-column>
                    </el-table>
                </div>
            </el-dialog>

            <el-dialog
                title="月度学员出勤"
                :center="true"
                :visible.sync="monthDialogVisible"
                width="50%">
                <div class="midTableHeight" style="width:95%;display:block;margin:10px auto;">
                    <div style="transform:translateY(-20px)">
                        <label>月份：</label>
                        <el-date-picker
                            v-model="monthDate"
                            type="month"
                            format="yyyy-MM"
                            value-format="yyyy-MM"
                            :clearable="false"
                            style="width:160px"
                            @change="clickMonthAttendance"
                            size="small">
                        </el-date-picker>
                    </div>
                    <el-table :data="data.monthAttendance" border max-height="350" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle">
                        <el-table-column prop="ClassName" align="center"  label="班级名称"></el-table-column>
                        <el-table-column align="center"  width="120"  label="出勤状况">
                            <template slot-scope="scope">
                                <span>{{scope.row.AttCount+"/"+scope.row.ChildCount}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="AttPercent" align="center"  width="80"  label="百分比"></el-table-column>
                    </el-table>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

import { getCosByCosNum,getCosStaffStatisticByDate,getCosMonthStaffStatisticByDate,getCosHalfYearStaffStatisticByDate,
         getCosStaffStatisticByClass } from '@/js/api'
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
    name: 'StudentDataList',
    data(){
        return {
            title:"学员出勤",
            cosName:"",
            data:{
                ChildCount:"",
                AttCount:"",
                AttPercent:"",
                optionMonth:{},
                optionYear:{},
                dayAttendance:[],
                monthAttendance:[],
            },
            dayDialogVisible:false,
            monthDialogVisible:false,
            dayDate:"",
            monthDate:"",
            pageSize:10,
            currentPage:1,
            isNotCloseLeft:true,
        }
    },
    
    components:{
        ChatHeader
    },
    mounted(){
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
        showDialog(v){
            this.isTodayDate = v;
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
        loadList(){
            this.data.optionMonth = {};
            this.data.optionYear = {};
            // numCos,
            // acctID,
            // monthYear
            let numCos = this.$route.params.cosNum;
            let acctID = this.userInfo.mobile;
            let dateObj = new Date();
		    let queryDate = dateObj.getFullYear() + "-" + (Array(3).join(0) + (dateObj.getMonth() + 1)).slice(-2) + "-" + (Array(3).join(0) + dateObj.getDate()).slice(-2);
            let loading = showLoading();
            Promise.all([
                getCosStaffStatisticByDate(numCos,acctID,queryDate),
                getCosMonthStaffStatisticByDate(numCos,acctID),
                getCosHalfYearStaffStatisticByDate(numCos,acctID),
            ]).then((result) => {
                closeLoading(loading);
                let result1 = result[0].data;
                this.data.ChildCount = result1.ChildCount;
                this.data.AttCount = result1.AttCount;
                this.data.AttPercent = result1.AttPercent;

                let result2 = result[1].data;
                let monthDate = [];
                let percent = [];
                for(let i=0;i<result2.length;i++){
                    monthDate.unshift(result2[i].Date);
                    percent.unshift(result2[i].TotalPercent);
                }
                this.monthDataEchartsLoad(monthDate,percent);

                let result3 = result[2].data;
                let monthDate1 = [];
                let percent1 = [];
                for(let j=0;j<result3.length;j++){
                    monthDate1.unshift(result3[j].Date);
                    percent1.unshift(result3[j].TotalPercent);
                }
                this.yearDataEchartsLoad(monthDate1,percent1);

                // console.log(result[0].data)
                // console.log(result[1].data)
                // console.log(result[2].data)
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1288/1289/1290");
            });
        },
        monthDataEchartsLoad(months,alreadyMoney){
            this.data.optionMonth = {
                grid:{
                    // left:0,
                    x:"30px",
                    // right:-10,
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
                            name:"近一月出勤统计图",             //保存的文件名称，默认使用 title.text 作为名称
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
                    formatter:'{a} <br/>{b}: {c}%'
                },
                legend: {
                    x: 'center',
                    data:["出勤率"]
                },
                color:"#d14a61",
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
                    name:'出勤率/%',
                    boundaryGap: [0, '20%'],
                    splitLine:{
                        show:true
                    },
                    axisLabel:{
                        formatter:'{value}'
                    },
                    max:100,
                    min:0,
                }],
                series: [
                    {
                        name:'出勤率',
                        type:'bar',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: alreadyMoney,
                    }
                ]
            };
        },
        yearDataEchartsLoad(months,alreadyMoney){
            this.data.optionYear = {
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
                            name:"近半年出勤统计图",             //保存的文件名称，默认使用 title.text 作为名称
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
                    formatter:'{a} <br/>{b}: {c}%'
                },
                legend: {
                    x: 'center',
                    data:["出勤率"]
                },
                color:"#38adff",
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
                    name:'出勤率/%',
                    boundaryGap: [0, '20%'],
                    splitLine:{
                        show:true
                    },
                    axisLabel:{
                        formatter:'{value}'
                    },
                    max:100,
                    min:0,
                }],
                series: [
                    {
                        name:'出勤率',
                        type:'bar',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: alreadyMoney,
                        barWidth: "60px"
                    }
                ]
            };
        },
        goback(){
            this.$router.push("/mainpage/group");
        },
        clickDayAttendance(item){
            this.dayDialogVisible = true;
            this.data.dayAttendance = [];
            let numCos = this.$route.params.cosNum;
            let acctID = this.userInfo.mobile;
            if (typeof(item)=="object") {
                let startDate = item.name;
                let endDate = item.name;
                this.dayDate = item.name;
            }
            getCosStaffStatisticByClass(numCos,acctID,this.dayDate,this.dayDate).then((result)=>{
                this.data.dayAttendance = result.data;
            }).catch((err)=>{
                alertError(this,"1292");
            });
        },
        clickMonthAttendance(item){
            this.monthDialogVisible = true;
            this.data.monthAttendance = [];
            let numCos = this.$route.params.cosNum;
            let acctID = this.userInfo.mobile;
            let date,startDate,endDateObj,endDate;
            if (typeof(item)=="object") {
                this.monthDate = item.name;
                date = item.name;
                startDate = date + "-01";
				endDateObj = new Date(date.split("-")[0],parseInt(date.split("-")[1])-1,1);
				endDateObj.setMonth(endDateObj.getMonth()+1);
				endDateObj.setDate(endDateObj.getDate()-1);
				if(endDateObj.getTime()>new Date().getTime()){
					endDateObj = new Date();
                }
                endDate = endDateObj.getFullYear() + "-" + (Array(3).join(0) + (endDateObj.getMonth() + 1)).slice(-2) + "-" + (Array(3).join(0) + endDateObj.getDate()).slice(-2);
                console.log(11)
            }else{
                date = this.monthDate;
                startDate = date + "-01";
				endDateObj = new Date(date.split("-")[0],parseInt(date.split("-")[1])-1,1);
				endDateObj.setMonth(endDateObj.getMonth()+1);
				endDateObj.setDate(endDateObj.getDate()-1);
				if(endDateObj.getTime()>new Date().getTime()){
					endDateObj = new Date();
                }
                endDate = endDateObj.getFullYear() + "-" + (Array(3).join(0) + (endDateObj.getMonth() + 1)).slice(-2) + "-" + (Array(3).join(0) + endDateObj.getDate()).slice(-2);
            }
            getCosStaffStatisticByClass(numCos,acctID,startDate,endDate).then((result)=>{
                this.data.monthAttendance = result.data;
            }).catch((err)=>{
                alertError(this,"1292");
            });
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
.StudentDataList{
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
.childCard{
    /* padding:20px 20px 0 20px; */
    padding:10px 20px 20px 20px;
    display: grid;
    width: 100%;
    grid-template-columns: 50% 50%;
    max-height: 100%;
    background: #fafafa;
    /* background: red; */
}
@media screen and (max-width: 1140px){
    .childCard{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
        max-height: 100%;
        background: #fafafa;
    }
}
@media screen and (max-width: 980px){
    .childCard{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
        max-height: 100%;
        background: #fafafa;
    }
}
@media screen and (max-width: 800px){
    .childCard{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
        max-height: 100%;
        background: #fafafa;
    }
}
.childCardItem{
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
.childCardItem > .title{
    /* display: inline-block;
    height:20px; */
    color: #fff;
    text-align: center;
    font-size: 18px;
    height: 100%;
    width: 85px;
    letter-spacing : 10px;
    /* line-height: 78px; */
}
.childCardItem > .childNum{
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 20px;
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
    width: 100%;
    margin-bottom: 15px;
    border:1px solid #dddddd;
    border-radius: 5px;
    align-items: center;
    display: flex;
    flex-direction: column;
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
.spanTitle{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>