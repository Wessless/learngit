<template>
    <div class="OrderformFindItem">
        <div class="headTitle">{{item.StaffName}}的订单</div>
        <!-- <div class="title">单号：{{item.ApplyID}}</div> -->
        <div class="title">订单号：{{item.OrderNum}}</div>
        <div class="title">用户：{{item.UserName}}</div>
        <div class="title">申请时间：{{item.FillDate.split(" ")[0]=='1900-01-01'?'':item.FillDate.split(" ")[0]}}</div>
        <div class="title">审批人：{{item.SignedName}}</div>
        <div class="title">审批时间：{{item.ApprovalDate.split(" ")[0]=='1900-01-01'?'':item.ApprovalDate.split(" ")[0]}}</div>
        <div class="title">出库人：{{item.FinalKeeper}}</div>
        <div class="title">出库时间：{{item.StockoutDate.split(" ")[0]=='1900-01-01'?'':item.StockoutDate.split(" ")[0]}}</div>
        <div class="title" style="color:#FF9D00;">总金额：{{item.Price!='0'?item.Price:'免费'}}</div>
        <div class="title" :style="{color: stateColor}">订单状态：{{item.Status}}</div>
        <!-- <div class="title">财务：{{item.FinanceManager}}</div>
        <div class="title">收费时间：{{item.ChargeDate}}</div>
        <div class="title">收据号：{{item.ReceiptNum}}</div> -->
        <div class="detail" @click.stop="showDetail">详情</div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'OrderformFindItem',
    props: {
        item:{
            type:Object
        }
    },
    data(){
        return {
            payType:{
                "0":"现金",
                "1":"支票",
                "2":"银行汇款",
                "3":"其他",
                "4":"汇票",
                "5":"虚拟账户",
            }
        }
    },
    components:{
    },
    mounted(){
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        money(){
            return money(this.item.Money);
        },
        stateColor(){
            if (this.item.Status=='待审批') {
                return "#e51c23"
            }else if(this.item.Status=='待收款'){
                return "#FF9D00"
            }else if(this.item.Status=='待出库'){
                return "#38ADFF"
            }else if(this.item.Status=='已处理完毕'){
                return "#4DC060"
            }
        }
    },
    watch:{
    },
    methods:{
        showDetail(){
            let orderformID = this.item.ApplyID;
            this.$router.push(this.$route.fullPath+"/"+orderformID);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .OrderformFindItem{
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
.OrderformFindItem{
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
.detail{
    position: absolute;
    right:30px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.giveMoney{
    position: absolute;
    right:80px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
</style>