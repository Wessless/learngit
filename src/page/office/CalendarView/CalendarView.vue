<template>
    <div class="calendarView">
        <chat-header :showBack="true" :title="title" :showRightBtn="$route.meta.type=='update'" :rightBtnTitle="'保存'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" class="demo-form-inline">
                <!-- <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="assignChildClick">分班</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <div class="childInfoList">
            <calendar :red="redDate" :calendar="yearMonth" @month-changed="changeMonth" @clickDate="clickDate"></calendar>
        </div>
    </div>
</template>

<script>

import { getVacDate,updateDate } from '@/js/api'
import { showLoading,closeLoading,alertError,dateTimeFormatter } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import Calendar from '@/components/chat/Calendar'

export default {
    name: 'AddNewChild',
    data(){
        return {
            title:"",
            redDate:{},
            yearMonth:{
                params:{
                    curYear:new Date().getFullYear(),
                    curMonth:new Date().getMonth()
                }
            },
            form:{
                dataFrom:"",
                classID:"",
                remark:""
            },
            date:null
        }
    },
    components:{
        // NoData,
        // ScrollTop,
        ChatHeader,
        Calendar

    },
    mounted(){
        this.date = new Date();
        if(this.$route.meta.type=="detail"){
            this.title = '日历查看';
        }else{
            this.title = '日历设定';
        }
        this.getVacDate();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ])
    },
    watch:{
        
    },
    methods:{
        getVacDate(){
            getVacDate(this.yearMonth.params.curYear,this.yearMonth.params.curMonth+1).then((result)=>{
                let array = result.data.data.split(";");
                let obj = {};
                for(let i=0;i<array.length-1;i++){
                    let thisDate = new Date(array[i].split("-")[0],array[i].split("-")[1]-1,array[i].split("-")[2]);
                    obj[thisDate.getFullYear()+"/"+(thisDate.getMonth()+1)+"/"+thisDate.getDate()] = "isRed";
                }
                this.redDate = obj;
            }).catch((err)=>{
                alertError(this,"1052");
            });
        },
        changeMonth(num){
            let thisDate = new Date(this.yearMonth.params.curYear,this.yearMonth.params.curMonth,1);
            thisDate.setMonth(thisDate.getMonth()+num);
            this.yearMonth.params.curYear = thisDate.getFullYear();
            this.yearMonth.params.curMonth = thisDate.getMonth();
            this.getVacDate();
        },
        clickDate(date){
            if(this.$route.meta.type=="update"){
                let obj = {};
                for(let key in this.redDate){
                    obj[key] = this.redDate[key];
                }
                if(date.isRed){
                    obj[date.date] = "";
                }else{
                    obj[date.date] = "isRed";
                }
                this.redDate = obj;
            }
        },
        confirm(){
            let workDateArr = [];
            let vacDateArr = [];
            let date = new Date(this.yearMonth.params.curYear,this.yearMonth.params.curMonth,1);
            for(let i=1;this.yearMonth.params.curMonth==date.getMonth();i++){
                let dateStr = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                let dateStr1 = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
                if(this.redDate[dateStr1]){
                    vacDateArr.push(dateStr);
                }else{
                    workDateArr.push(dateStr);
                }
                date.setDate(date.getDate()+1);
            }
            vacDateArr.push("");
            workDateArr.push("");
            console.log(this.yearMonth.params.curYear,this.yearMonth.params.curMonth+1,workDateArr.join(";"),vacDateArr.join(";"));
            updateDate(this.yearMonth.params.curYear,this.yearMonth.params.curMonth+1,workDateArr.join(";"),vacDateArr.join(";")).then((result)=>{
                let ret = result.data;
                if(ret!=null&&ret!=""&&ret.ret!=null&&ret.ret==1){
                    this.$message({
                        type:"success",
                        message:"保存成功"
                    });
                }else{
                    this.$message({
                        type:"error",
                        message:"保存失败"
                    });
                }
                this.getVacDate();
            }).catch((err)=>{
                alertError(this,"2028");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.calendarView{
    padding:20px;
    /* display: flex;
    flex-direction: row;
    flex-wrap: wrap;  */
    max-height: 100%;
    min-height: 100vh;
    /* overflow: scroll; */
    background: #fafafa;
    position: relative;
}
/* .staffInfo{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.childInfoList{
    display: flex;
    width: 100%;
}

.el-form-item {
    margin-bottom: 0px !important;
}

</style>