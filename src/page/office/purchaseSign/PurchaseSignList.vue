<template>
    <div class="purchaseSign">
        <!-- <chat-header :showBack="true" :title="'采购审批'"></chat-header> -->
        <div style="width:100%;padding-bottom:10px;"></div>
        <no-data :isShow="isNoData"></no-data>
        <div class="PurchaseApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Purchase-Sign-item v-for="item in PurchaseApplyList" :key="item.num" :item="item"></Purchase-Sign-item>
        </div>
    </div>
</template>

<script>

import { getAllPurchaseSignByStaffId } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import PurchaseSignItem from '@/page/office/purchaseSign/PurchaseSignItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'purchaseSign',
    data(){
        return {
            order:"sign",
            isNoData:false,
            currentPage:1,
            pageSize:10,
            PurchaseApplyList:[],
        }
    },
    components:{
        NoData,
        ChatHeader,
        PurchaseSignItem
    },
    mounted(){
        
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
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getAllPurchaseSignByStaffId(staffID,this.order,this.currentPage,this.pageSize).then((result)=>{
                    if(reload){
                        this.PurchaseApplyList = [];
                    }
                    // console.log(result)
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        this.PurchaseApplyList.push(result.data.data[i]);
                    }
                    if(this.PurchaseApplyList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                }).catch((err)=>{
                    alertError(this,"1232");
                });
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.purchaseSign{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .PurchaseApplyList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.PurchaseApplyList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .PurchaseApplyList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .PurchaseApplyList{
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
</style>