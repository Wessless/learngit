<template>
    <div class="BorrowFindList">
        <chat-header :showBack="true" :title="'银行账户'"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form class="demo-form-inline">
                <el-form-item style="float:right;">
                    <el-button type="primary" @click="addBank" size="medium">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="bankAccountList" >
            <bank-account-item v-for="item in bankAccountList" :key="item.num" :item="item"></bank-account-item>
        </div>
    </div>
</template>

<script>

import { getBookCharge,getBankAccount } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import BankAccountItem from '@/page/office/bankAccount/BankAccountItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'BankAccountList',
    data(){
        return {
            isNoData:false,
            clickItem:{},
            pageNo : 1,
            bankAccountList:[],
            pageSize:15,
            currentPage:1,
            isDisabled:false,
            checked:false,
            outBillIDDisabled:false,
            includeProjectDisabled:true,
            itemNum:0,
            itemMoney:0,
        }
    },
    components:{
        NoData,
        ChatHeader,
        BankAccountItem
    },
    mounted(){
        this.getBankAccount();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    methods:{
        addBank(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        getBankAccount(){
            let loading = showLoading();
            getBankAccount().then((result)=>{
                closeLoading(loading);
                this.bankAccountList = result.data.data;
                if(this.bankAccountList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                alertError(this,"1164");
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.BorrowFindList{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .bankAccountList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.bankAccountList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .bankAccountList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .bankAccountList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.addbtn{
    float: right;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>