<template>
    <div class="expenseItem">
        <div class="headTitle">{{item.BankTitle}}</div>
        <div class="title">ID：{{item.BankAccountID}}</div>
        <div class="title">账户性质：{{item.AccountNature}}</div>
        <div class="title">账号：{{item.AccountNumber}}</div>
        <div class="title">开户人姓名：{{item.AccountName}}</div>
        <div class="bottomBtns">
            <!-- <div class="bottomBtn" @click.stop="deleteChild">删除</div> -->
            <div class="bottomBtn" @click.stop="changeBank">修改</div>
        </div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'ExpenseFindItem',
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
            if (this.item.State=='未通过审批') {
                return "#e51c23"
            }else if (this.item.State=='处理完毕') {
                return "#4DC060"
            }else{
                return "#FF9D00"
            }
        }
    },
    watch:{
    },
    methods:{
        changeBank(){
            let id = this.item.BankAccountID;
            this.$router.push(this.$route.fullPath+"/update/"+id);
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
.bottomBtns{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    margin-top:3px;
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
</style>