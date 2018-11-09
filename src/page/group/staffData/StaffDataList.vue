<template>
    <div class="ChargeExpendList groupEcharts">
        <router-view @showDialog="showDialog"></router-view>
        <chat-header :showBack="true" :title="title" :isgoBack="true" :gobackName="'goback'" @goback="goback"></chat-header>
        <div class="cosName">{{cosName}}</div>
        <div style="width:100%;padding:66px 20px 20px 20px;overflow:hidden;height:100vh;position:relative;">
            <div class="chargeCard">
                <div class="chargeCardItem">
                    <div class="title">按年龄统计图</div>
                    <v-chart class="echarts" v-if="isNotCloseLeft" :options="data.optionAge"/>
                </div>
                <div class="chargeCardItem" v-if="$route.params.isGroup=='0'">
                    <div class="title">按入职时间统计图</div>
                    <v-chart class="echarts" v-if="isNotCloseLeft" :options="data.optionBeStaff"/>
                </div>
                <div class="chargeCardItem">
                    <div class="title">按性别统计图</div>
                    <v-chart class="echarts" v-if="isNotCloseLeft" :options="data.optionSex"/>
                </div>
                <div class="chargeCardItem" v-if="$route.params.isGroup=='0'">
                    <div class="title">证书</div>
                    <div class="midTableHeight table">
                        <el-table :data="data.certification" border max-height="315" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle">
                            <el-table-column prop="certificationName" align="center"  label="证书名称"></el-table-column>
                            <el-table-column prop="certificationCount" align="center"  label="人数"  width="70"></el-table-column>
                            <el-table-column align="center" label="详情"  width="80">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="examineCertification(scope.row)">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <el-dialog
                title=""
                :center="true"
                class="chargeBillDialog"
                :visible.sync="dialogVisible"
                width="40%">
                <!-- <span style="margin-left:25px;display:block;">共{{ this.data.chargeBillNum }}条，总金额：{{ this.data.chargeBillMoney }}元</span> -->
                <div class="midTableHeight" style="width:95%;display:block;margin:10px auto;">
                    <el-table :data="data.staffDataList" border max-height="400" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle">
                        <el-table-column prop="StaffName" align="center"  label="姓名"></el-table-column>
                        <el-table-column prop="StaffNum" align="center"  label="员工编号"></el-table-column>
                    </el-table>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

import { getStaffStatisticByAge,getStaffStatisticBySex,getCosStaffStatisticByAge,getCosStaffStatisticBySex,getCosStaffStatisticByBeStaff,
         getCosStaffStatisticByCertification,getCosByCosNum,getStaffByCertification } from '@/js/api'
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
            title:"员工数据",
            cosName:"",
            data:{
                optionAge:{},
                optionBeStaff:{},
                optionSex:{},
                certification:[],
                staffDataList:[],
            },
            dialogVisible:false,
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
            this.data.optionAge = {};
            this.data.optionBeStaff = {};
            this.data.optionSex = {};
            this.data.certification = [];
            // numCos,
            // acctID,
            // monthYear
            let numCos = this.$route.params.cosNum;
            let acctID = this.userInfo.mobile;
            let date = new Date();
            let monthYear = date.getFullYear() + (Array(3).join(0) + (date.getMonth() + 1)).slice(-2) + "01";
            let loading = showLoading();
            let promiseArr = [];
            if(this.$route.params.isGroup=='0'){
                promiseArr = [
                    getCosStaffStatisticByAge(numCos,acctID,monthYear),
                    getCosStaffStatisticBySex(numCos,acctID,monthYear),
                    getCosStaffStatisticByBeStaff(numCos,acctID,monthYear),
                    getCosStaffStatisticByCertification(numCos,acctID,monthYear)
                ]
            }else{
                promiseArr = [
                    getStaffStatisticByAge(numCos,acctID,monthYear),
                    getStaffStatisticBySex(numCos,acctID,monthYear)
                ]
            }
            Promise.all(promiseArr).then((result) => {
                closeLoading(loading);
                let result1 = result[0].data;
                let num = [0,0,0,0,0];
                for(let i=0;i<result1.AgeRange.length;i++){
                    if(result1.AgeRange[i]=="20"){
                        num[0] = result1.AgeNum[i]
                    }
                    if(result1.AgeRange[i]=="20-25"){
                        num[1] = result1.AgeNum[i]
                    }
                    if(result1.AgeRange[i]=="26-30"){
                        num[2] = result1.AgeNum[i]
                    }
                    if(result1.AgeRange[i]=="31-40"){
                        num[3] = result1.AgeNum[i]
                    }
                    if(result1.AgeRange[i]=="41"){
                        num[4] = result1.AgeNum[i]
                    }
                }
                this.ageDataEchartsLoad(["20岁以下","20-25岁","26-30岁","31-40岁","40岁以上"],num);
            
                let result2 = result[1].data;
                let sex = [];
                for(let j=0;j<result2.StaffSex.length;j++){
                    if(result2.StaffSex[j]=="0"){
                        sex.push({
                            value:result2.StaffCount[j],
                            name:'女'
                        });
                    }
                    if(result2.StaffSex[j]=="1"){
                        sex.push({
                            value:result2.StaffCount[j],
                            name:'男'
                        });
                    }
                }
                this.sexDataEchartsLoad(sex);

                if(this.$route.params.isGroup=='0'){
                    let result3 = result[2].data;
                    let yearNum = [0,0,0,0,0];
                    for(let m=0;m<result3.InYears.length;m++){
                        if(result3.InYears[m]=="0"){
                            yearNum[0] = result3.InNum[m];
                        }
                        if(result3.InYears[m]=="1"){
                            yearNum[1] = result3.InNum[m];
                        }
                        if(result3.InYears[m]=="2"){
                            yearNum[2] = result3.InNum[m];
                        }
                        if(result3.InYears[m]=="3"){
                            yearNum[3] = result3.InNum[m];
                        }
                        if(result3.InYears[m]=="4"){
                            yearNum[4] = result3.InNum[m];
                        }
                    }
                    this.beStaffDataEchartsLoad(["入职不满一年","入职满1年","入职满2年","入职满3年","入职4年以上"],yearNum);
                    
                    let result4 = result[3].data;
                    let array = [];
                    for (let n = 0; n < result4.CertificationNames.length; n++) {
                        let obj = {};
                        obj.certificationName = result4.CertificationNames[n];
                        obj.certificationCount = result4.CertificationCounts[n];
                        array.push(obj);
                    }
                    this.data.certification = array;
                    console.log(this.data.certification);
                }

            }).catch((err)=>{
                closeLoading(loading);
                if(this.$route.params.isGroup=='0'){
                    alertError(this,"1267/1272/1268/1269");
                }else{
                    alertError(this,"1264/1265");
                }
            });
        },
        ageDataEchartsLoad(months,alreadyMoney){
            this.data.optionAge = {
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
                            name:"按年龄统计图",                        //保存的文件名称，默认使用 title.text 作为名称
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
                    data:["员工人数"]
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
                    name: '员工人数/人',
                    offset:0,
                    boundaryGap: [0, '20%'],
                    minInterval:1,
                },
                series: [
                    {
                        name:'员工人数',
                        type:'bar',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: alreadyMoney,
                        barWidth: "40px"
                    }
                ]
            }
        },
        beStaffDataEchartsLoad(months,alreadyMoney){
            this.data.optionBeStaff = {
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
                            name:"按入职时间统计图",             //保存的文件名称，默认使用 title.text 作为名称
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
                title: {
                    left: 'center',
                    text: '按入职时间统计图',
                    top:10,
                },
                legend: {
                    orient: 'vertical',
                    x: 'center',
                    data:["员工人数"]
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
                    name: '员工人数/人',
                    offset:0,
                    boundaryGap: [0, '20%'],
                },
                color:"#38adff",
                series: [
                    {
                        name:'员工人数',
                        type:'bar',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: alreadyMoney,
                        barWidth: "40px"
                    }
                ]
            };
        },
        sexDataEchartsLoad(array){
            this.data.optionSex  = {
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
                            name:"按性别统计图",                //保存的文件名称，默认使用 title.text 作为名称
                            backgroundColor:"#ffffff",        //保存的图片背景色，默认使用 backgroundColor，如果backgroundColor不存在的话会取白色
                            title:"保存为图片",
                            pixelRatio:1  
                        },
                        // magicType: {//动态类型切换
                        //     type: ['bar', 'line']
                        // }
                    }
                },
                color:["#F817A6","#38ADFF"],
                tooltip: {//弹出数据提示
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                    trigger: 'item',
                },
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    data:["男","女"]
                },
                series: [
                    {
                        name:'男女比例',
                        type:'pie',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: array
                    }
                ]
            };
        },
        goback(){
            this.$router.push("/mainpage/group");
        },
        examineCertification(item){
            this.data.staffDataList = [];
            this.dialogVisible = true;
            // numCos,
            // acctID,
            // monthYear,
            // certificationName
            let numCos = this.$route.params.cosNum;
            let acctID = this.userInfo.mobile;
            let date = new Date();
            let monthYear = date.getFullYear() + "-" + (Array(3).join(0) + (date.getMonth() + 1)).slice(-2) + "-01";
            let loading = showLoading();
            let certificationName = item.certificationName;
            getStaffByCertification(numCos,acctID,monthYear,certificationName).then((result)=>{
                closeLoading(loading);
                console.log(result.data.data)
                this.data.staffDataList = result.data.data;
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1270");
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
    padding:10px;
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
        padding:10px;
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
        padding:10px;
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
        padding:10px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
.chargeCardItem{
    position: relative;
    height:400px;
    justify-self: center;
    width: 95%;
    margin-bottom: 15px;
    border:1px solid #dddddd;
    border-radius: 5px;
    align-items: center;
    display: flex;
    flex-direction: column;
}
.chargeCardItem > .title{
    font-size: 20px;
    text-align: center;
    height: 100%;
    flex: 1;
    width: 100%;
    line-height: 39px;
}
.chargeCardItem > .echarts{
    flex: 11;
    width: 100%;
}
.chargeCardItem > .table{
    flex: 11;
    width:100%;
    display:block;
    margin-top: 20px;
}
.chargeCardItem > .echarts > div{
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