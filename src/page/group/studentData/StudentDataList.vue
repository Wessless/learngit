<template>
    <div class="ChargeExpendList groupEcharts">
        <router-view @showDialog="showDialog"></router-view>
        <chat-header :showBack="true" :title="title" :isgoBack="true" :gobackName="'goback'" @goback="goback"></chat-header>
        <div class="cosName">{{cosName}}</div>
        <div style="width:100%;padding:66px 20px 20px 20px;overflow:scroll;height:100vh;position:relative;">
            <div class="childCard">
                <div class="childCardItem">
                    <div class="title" style="background-color: #38ADFF;">在籍<br />幼儿</div>
                    <div class="childNum"><span style="display:block;width:100%;text-align: center;">{{data.ChildNumber}}&nbsp;名</span></div>
                </div>
                <div class="childCardItem">
                    <div class="title" style="background-color: #FF9D00;">正常<br />毕业</div>
                    <div class="childNum">
                        <span style="display:block;width:100%;text-align: center;">{{data.GraduationNumber}}&nbsp;名<span class="iconfont icon" @click.stop="examineEcharts">&#xe73b;</span></span>
                    </div>
                </div>
                <div class="childCardItem">
                    <div class="title" style="background-color: #e51c23;">中途<br />退学</div>
                    <div class="childNum"><span style="display:block;width:100%;text-align: center;">{{data.LeaveNumber}}&nbsp;名</span></div>
                </div>
            </div>
            <div class="echartsCard">
                <div class="echartsCardItem">
                    <div class="title">按年龄统计图</div>
                    <v-chart class="echarts" v-if="isNotCloseLeft" :options="data.optionAge"/>
                </div>
                <div class="echartsCardItem">
                    <div class="title">按班级类型统计图</div>
                    <v-chart class="echarts" v-if="isNotCloseLeft" :options="data.optionType"/>
                </div>
                <div class="echartsCardItem">
                    <div class="title">按性别统计图</div>
                    <v-chart class="echarts" v-if="isNotCloseLeft" :options="data.optionSex"/>
                </div>
                <div class="echartsCardItem">
                    <div class="title">班级人数</div>
                    <div class="midTableHeight table">
                        <el-table :data="data.classDataList" border max-height="335" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle">
                            <el-table-column prop="Classname" align="center"  label="班级名称"></el-table-column>
                            <el-table-column prop="Childcount" align="center"  label="人数"  width="80"></el-table-column>
                            <!-- <el-table-column align="center" label="详情"  width="80">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="examineCertification(scope.row)">查看</el-button>
                                </template>
                            </el-table-column> -->
                        </el-table>
                    </div>
                </div>
            </div>
            <el-dialog
                title="已毕业学年统计图"
                class="subDialog"
                :center="true"
                :visible.sync="echartsDialogVisible"
                width="50%">
                <v-chart :options="option" style="margin:0 auto;"/>
            </el-dialog>
        </div>
    </div>
</template>

<script>

import { getCosByCosNum,getCosChildCountStatistic,getCosChildStatisticByAge,getCosChildStatisticByType,
         getCosChildStatisticByClass,getCosChildStatisticBySex,getCosChildStatisticByGraduation } from '@/js/api'
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
            title:"学员数据",
            cosName:"",
            data:{
                ChildNumber:"",
                GraduationNumber:"",
                LeaveNumber:"",
                optionAge:{},
                optionType:{},
                optionSex:{},
                classDataList:[],
                staffDataList:[],
            },
            option:{},
            // dialogVisible:false,
            pageSize:10,
            currentPage:1,
            echartsDialogVisible:false,
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
            this.data.optionType = {};
            this.data.optionSex = {};
            this.data.classDataList = [];
            // numCos,
            // acctID,
            // monthYear
            let numCos = this.$route.params.cosNum;
            let acctID = this.userInfo.mobile;
            let loading = showLoading();
            Promise.all([
                getCosChildCountStatistic(numCos,acctID),
                getCosChildStatisticByAge(numCos,acctID),
                getCosChildStatisticByType(numCos,acctID),
                getCosChildStatisticByClass(numCos,acctID),
                getCosChildStatisticBySex(numCos,acctID),
            ]).then((result) => {
                closeLoading(loading);
                this.data.ChildNumber = result[0].data.ChildNumber;
                this.data.GraduationNumber = result[0].data.GraduationNumber;
                this.data.LeaveNumber = result[0].data.LeaveNumber;

                let result2 = result[1].data;
                let ageRange = [0,0,0,0,0,0];
                for(let i=0;i<result2.AgeRange.length;i++){
                    if(result2.AgeRange[i]=="2"){
                        ageRange[0] = result2.AgeNum[i]
                    }
                    if(result2.AgeRange[i]=="3"){
                        ageRange[1] = result2.AgeNum[i]
                    }
                    if(result2.AgeRange[i]=="4"){
                        ageRange[2] = result2.AgeNum[i]
                    }
                    if(result2.AgeRange[i]=="5"){
                        ageRange[3] = result2.AgeNum[i]
                    }
                    if(result2.AgeRange[i]=="6"){
                        ageRange[4] = result2.AgeNum[i]
                    }
                    if(result2.AgeRange[i]=="7"){
                        ageRange[5] = result2.AgeNum[i]
                    }
                }
                this.ageDataEchartsLoad(["不满3岁","满3岁","满4岁","满5岁","满6岁","7岁以上"],ageRange);

                let result3 = result[2].data;
                let typeRange = [0,0,0,0];
                for(let j=0;j<result3.ClassType.length;j++){
                    if(result3.ClassType[j]=="1"){
                        typeRange[0] = result3.ChildCount[j]
                    }
                    if(result3.ClassType[j]=="2"){
                        typeRange[1] = result3.ChildCount[j]
                    }
                    if(result3.ClassType[j]=="3"){
                        typeRange[2] = result3.ChildCount[j]
                    }
                    if(result3.ClassType[j]=="4"){
                        typeRange[3] = result3.ChildCount[j]
                    }
                }
                this.classDataEchartsLoad(["托班","小班","中班","大班"],typeRange)

                let result4 = result[3].data;
                let array = [];
                for (let n = 0; n < result4.Classname.length; n++) {
                    let obj = {};
                    obj.Classname = result4.Classname[n];
                    obj.Childcount = result4.Childcount[n];
                    array.push(obj);
                }
                this.data.classDataList = array;
                console.log(this.data.classDataList);
                
                let result5 = result[4].data;
                let sex = [];
                for(let m=0;m<result5.Childsex.length;m++){
                    if(result5.Childsex[m]=="0"){
                        sex.push({
                            value:result5.SexNum[m],
                            name:'男'
                        });
                    }
                    if(result5.Childsex[m]=="1"){
                        sex.push({
                            value:result5.SexNum[m],
                            name:'女'
                        });
                    }
                }
                this.sexDataEchartsLoad(sex);

            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1283/1279/1280/1281/1284");
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
                    data:["幼儿人数"]
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
                    name: '幼儿人数/人',
                    offset:0,
                    boundaryGap: [0, '20%'],
                    minInterval:1,
                },
                series: [
                    {
                        name:'幼儿人数',
                        type:'bar',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: alreadyMoney,
                        barWidth: "40px"
                    }
                ]
            }
        },
        classDataEchartsLoad(months,alreadyMoney){
            this.data.optionType = {
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
                            name:"按班级类型统计图",             //保存的文件名称，默认使用 title.text 作为名称
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
                    data:["幼儿人数"]
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
                    name: '幼儿人数/人',
                    offset:0,
                    boundaryGap: [0, '20%'],
                },
                color:"#38adff",
                series: [
                    {
                        name:'幼儿人数',
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
                color:["#38ADFF","#F817A6"],
                tooltip: {//弹出数据提示
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                    trigger: 'item',
                },
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    data:["女","男"]
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
        graduationEchartsLoad(months,alreadyMoney){
            this.option = {
                grid:{
                    y2:"80px"
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
                            name:"已毕业学年统计",                        //保存的文件名称，默认使用 title.text 作为名称
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
                    text: '已毕业学年统计',
                    top:10,
                },
                legend: {
                    x: 'center',
                    data:["幼儿人数"]
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
                yAxis: [{
                    type: 'value',
                    name:'幼儿人数/人',
                    boundaryGap: [0, '20%'],
                    minInterval:1,
                    splitLine:{
                        show:true
                    },
                    axisLabel:{
                        formatter:'{value}'
                    }
                }],
                series: [
                    {
                        name:'幼儿人数',
                        type:'bar',// line 折线图 bar 柱状图
                        symbol: 'none',
                        sampling: 'average',
                        data: alreadyMoney,
                        barWidth: "40px"
                    }
                ]
            };
        },
        goback(){
            this.$router.push("/mainpage/group");
        },
        examineEcharts(){
            this.echartsDialogVisible = true;
            let numCos = this.$route.params.cosNum;
            let acctID = this.userInfo.mobile;
            getCosChildStatisticByGraduation(numCos,acctID).then((result)=>{
                let ret = result.data;
                let year = [];
				let num = [];
				for(let i=0;i<ret.ClassType.length;i++){
					year.push(ret.ClassType[i]+"年毕业");
					num.push(ret.ChildCount[i]);
				}
				this.graduationEchartsLoad(year,num);
            }).catch((err)=>{
                alertError(this,"1282");
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
.childCard{
    /* padding:20px 20px 0 20px; */
    padding:10px 20px 20px 20px;
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
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
    font-size: 20px;
    height: 100%;
    width: 85px;
    letter-spacing : 10px;
    padding-top:10px;
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
    grid-template-columns: 50% 50%;
    max-height: 100%;
    background: #fafafa;
    /* background: red; */
}
@media screen and (max-width: 1140px){
    .echartsCard{
        padding:10px;
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
        max-height: 100%;
        background: #fafafa;
    }
}
@media screen and (max-width: 980px){
    .echartsCard{
        padding:10px;
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
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
    width: 95%;
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
.icon{
    margin-left: 5px;
    display: inline-block;
    font-size: 18px;
    cursor: pointer;
    color: #38ADFF;
}
</style>