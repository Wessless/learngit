<template>
    <div class="expenseItem">
        <div class="headTitle">{{item.FillStaff}}的报销支付</div>
        <div class="title">单号：{{item.ChargeBillID}}</div>
        <div class="title" style="color:#FF9D00;">金额：{{money}}{{item.MoneyUnitName}}</div>
        <div class="title">创建日期：{{item.FillDate}}</div>
        <div class="title">支付方式：{{payType[item.PayType]}}</div>
        <div class="title">用途说明：{{item.BigType}} - {{item.SmallType}} - {{item.Subject}}</div>
        <div class="detail" @click.stop="showDetail">详情</div>
        <div class="giveMoney" @click.stop="paymoney">付款</div>
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
        }
    },
    watch:{
    },
    methods:{
        paymoney(){
            this.$emit("clickPayMoney",this.item);
        },
        showDetail(){
            let expenseID = this.item.ChargeBillID;
            this.$router.push(this.$route.fullPath+"/"+expenseID);
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