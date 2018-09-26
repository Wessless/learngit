<template>
    <div class="expenseItem">
        <div class="headTitle">{{item.ApplyName}}的{{applyType}}申请</div>
        <div class="title">创建日期：{{item.CreateDate}}</div>
        <div class="title" :style="{color: stateColor}">状态：{{applyStates}}</div>
        <div class="title" :class="{blueColor:item.Type==15}" @click="urlToExpense">{{item.ChargeID?IDName+"ID："+item.ChargeID:`&nbsp;`}}</div>
        <div class="title" v-show="item.OrderApplyNum">{{item.OrderApplyNum?"订单编号："+item.OrderApplyNum:`&nbsp;`}}</div>
        <div class="title" style="color:#FF9D00;">{{item.BillMoney?"金额："+item.BillMoney:`&nbsp;`}}</div>
        <!-- <div class="leftButton"  v-show="item.Result=='0'&&tabType=='2'&&isShowUpdate" @click="updateItem">修改</div> -->
        <!-- <div class="leftButton"  v-show="isShowExamine&&item.Result=='0'&&tabType=='2'" @click="examineItem">详情</div> -->
        <!-- <div class="rightButton" v-show="item.Result=='0'&&tabType=='2'" @click="delItem">撤销</div> -->
        <div class="rightButton" v-show="tabType!='0'" @click="examineItem">详情</div>
        <div class="rightButton" v-show="item.Result=='0'&&tabType=='0'" @click="approveItem">审批</div>
        <div class="bottomBtns">
            <div class="bottomBtn" v-show="item.Result=='0'&&tabType=='2'&&item.IsDelAble=='1'" @click.stop="delItem">撤销</div>
            <div class="bottomBtn" v-show="item.Result=='0'&&tabType=='2'&&item.IsDelAble=='1'&&isShowUpdate" @click.stop="updateItem">修改</div>
        </div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'ExpensePaymentItem',
    props: {
        item:{
            type:Object
        },
        tabType:{
            type:String
        }
    },
    data(){
        return {  
            isShowUpdate:false,
            // isShowExamine:true,
        }
    },
    mounted(){
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        IDName(){// 应付款显示报销ID
            if(this.item.Type==10){
                this.isShowUpdate = true;
                // this.isShowExamine = false;
                return "报销"
            }else if (this.item.Type==8) {
                return "请假"
            }else if (this.item.Type==12) {
                return "违规"
            }else if (this.item.Type==1) {
                return "通用"
            }else if (this.item.Type==6) {
                return "外出"
            }else if (this.item.Type==7) {
                return "出差"
            }else if (this.item.Type==8) {
                return "请假"
            }else if (this.item.Type==9) {
                this.isShowUpdate = true;
                return "订单"
            }else if (this.item.Type==11) {
                this.isShowUpdate = true;
                // this.isShowExamine = false;
                return "借款"
            }else if (this.item.Type==14) {
                return "加班"
            }else if (this.item.Type==15) {
                this.isShowUpdate = true;
                return "报销"
            }else{
                return "";
            }
        },
        applyType(){
            if(this.item.Type==10){
                this.isShowUpdate = true;
                // this.isShowExamine = false;
                return "报销"
            }else if (this.item.Type==12) {
                return "违规"
            }else if (this.item.Type==1) {
                return "通用"
            }else if (this.item.Type==6) {
                return "外出"
            }else if (this.item.Type==7) {
                return "出差"
            }else if (this.item.Type==8) {
                return "请假"
            }else if (this.item.Type==9) {
                this.isShowUpdate = true;
                return "订单"
            }else if (this.item.Type==11) {
                this.isShowUpdate = true;
                // this.isShowExamine = false;
                return "借款"
            }else if (this.item.Type==14) {
                return "加班"
            }else if (this.item.Type==15) {
                return "应付款"
            }
        },
        applyStates(){
            if (this.item.Result=='0') {
                return "等待审批"
            }else if (this.item.Result=='1') {
                return "审批同意"
            }else if (this.item.Result=='2') {
                return "审批拒绝"
            }
        },
        stateColor(){
            if (this.item.Result=='0') {
                return "#FF9D00"
            }else if (this.item.Result=='1') {
                return "#4DC060"
            }else if (this.item.Result=='2') {
                return "#e51c23"
            }
        }
    },
    watch:{
    },
    methods:{
        updateItem(){
            if (this.item.Type==9) {
                let ChargeID = this.item.ChargeID;
                this.$router.push(this.$route.fullPath+"/updateOrderform/"+ChargeID);
            }
            if (this.item.Type==10) {
                let ChargeID = this.item.ChargeID;
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/updateExpense/"+ChargeID+"&"+ID);
            }
            if (this.item.Type==11) {
                let ChargeID = this.item.ChargeID;
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/updateBorrow/"+ChargeID+"&"+ID);
            }
            if (this.item.Type==15) {
                let expenseID = this.item.ChargeID;// 报销ID
                let examineID = this.item.ID;// 审批ID
                let ID = this.item.CID;//应付款ID
                let staffID = this.item.ApplyUser;// 申请人ID
                this.$router.push(this.$route.fullPath+"/updateDue/"+expenseID+"/"+staffID+"/"+examineID+"/"+ID);
            }
        },
        examineItem(){
            if (this.item.Type==1) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/examineCommon/"+ID);
            }
            if (this.item.Type==6) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/examineOutside/"+ID);
            }
            if (this.item.Type==7) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/examineBusiness/"+ID);
            }
            if (this.item.Type==8) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/examineHoliday/"+ID);
            }
            if (this.item.Type==9) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/examineOrderform/"+ID);
            }
            if (this.item.Type==10) {
                let ChargeID = this.item.ChargeID;
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/examineExpense/"+ChargeID+"&"+ID);
            }
            if (this.item.Type==11) {
                let ChargeID = this.item.ChargeID;
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/examineBorrow/"+ChargeID+"&"+ID);
            }
            if (this.item.Type==12) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/examineIllegal/"+ID);
            }
            if (this.item.Type==14) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/examineExtrawork/"+ID);
            }
            if (this.item.Type==15) {
                let expenseID = this.item.ChargeID;// 报销ID
                let examineID = this.item.ID;// 审批ID
                let ID = this.item.CID;//应付款ID
                let staffID = this.item.ApplyUser;// 申请人ID
                this.$router.push(this.$route.fullPath+"/examineDue/"+expenseID+"/"+staffID+"/"+examineID+"/"+ID);
            }
        },
        delItem(){
            this.$emit("clickDeleteExpense",this.item);
        },
        approveItem(){
            if (this.item.Type==1) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/approveCommon/"+ID);
            }
            if (this.item.Type==6) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/approveOutside/"+ID);
            }
            if (this.item.Type==7) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/approveBusiness/"+ID);
            }
            if (this.item.Type==8) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/approveHoliday/"+ID);
            }
            if (this.item.Type==9) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/approveOrderform/"+ID);
            }
            if (this.item.Type==10) {
                let ChargeID = this.item.ChargeID;
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/approveExpense/"+ChargeID+"&"+ID);
            }
            if (this.item.Type==11) {
                let ChargeID = this.item.ChargeID;
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/approveBorrow/"+ChargeID+"&"+ID);
            }
            if (this.item.Type==12) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/approveIllegal/"+ID);
            }
            if (this.item.Type==14) {
                let ID = this.item.ID;
                this.$router.push(this.$route.fullPath+"/approveExtrawork/"+ID);
            }
            if (this.item.Type==15) {
                let expenseID = this.item.ChargeID;// 报销ID
                let examineID = this.item.ID;// 审批ID
                let ID = this.item.CID;//应付款ID
                let staffID = this.item.ApplyUser;// 申请人ID
                this.$router.push(this.$route.fullPath+"/approveDue/"+expenseID+"/"+staffID+"/"+examineID+"/"+ID);
            }
        },
        // 应付款跳转到报销
        urlToExpense(){
            if(this.item.Type==15){
                let ID = this.item.ChargeID;// 报销ID
                this.$router.push("/mainpage/office/"+this.$route.params.id+"/expensePayment/"+ID);
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .expenseItem{
    display: block;
    position: relative;
    width:310px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 10px;
    margin-right: 20px;
    margin-bottom: 20px;
} */
.expenseItem{
    display: block;
    position: relative;
    justify-self: center;
    width: 94%;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 5px 10px 10px 10px;
    margin-right: 3%;
    margin-left: 3%;
    margin-bottom: 20px; 
    margin-top: 20px; 
    border:1px solid #ffffff;
}
.headTitle{
    font-size:20px;
    font-weight: 500;
}
.createDate{
    font-size: 14px;
    color: #999999;
}
.title{
    /* width:49%; */
    display: block;
    color: #999999;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.rightButton{
    position: absolute;
    right:20px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.leftButton{
    position: absolute;
    right:60px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.bottomBtns{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    margin-top:3px;
    margin-right: 8px;
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
.blueColor{
    color: #38adff;
    cursor: pointer;
}
</style>