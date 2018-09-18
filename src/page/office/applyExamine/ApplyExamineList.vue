<template>
    <div class="ApplyExamineList">
        <!-- <chat-header :showBack="true" :title="'申领审批'"></chat-header> -->
        <div style="width:100%;padding-bottom:10px;"></div>
        <no-data :isShow="isNoData"></no-data>
        <div class="receiveApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Apply-Examine-item v-for="item in receiveApplyList" :key="item.num" :item="item"></Apply-Examine-item>
        </div>
    </div>
</template>

<script>

import { getAllsignByStaffId } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import NoData from '@/components/chat/NoData'
import ChatHeader from '@/components/chat/ChatHeader'
import ApplyExamineItem from '@/page/office/applyExamine/ApplyExamineItem'

export default {
    name: 'ApplyExamineList',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[]
            },
            form: {
                GoodsSortName : "",
                StabilizeAssetsNum : "",
                GoodsName : ""
            },
            isNoData:false,
            dialogVisible:false,
            clickItem:{},
            pageNo : "1",
            order:'apply',
            receiveApplyList:[],
            pageSize:10,
            currentPage:1,
            isDisabled:false,
            sortID:"",
            goodsID:"",
        }
    },
    components:{
        NoData,
        ChatHeader,
        ApplyExamineItem
    },
    mounted(){
    },
    computed:{
        ...mapState([
            'userInfo'
        ])
    },
    methods:{
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            // staffID = "0";
            let fillStaffID = this.formInline.staffID ? this.formInline.staffID : "-1";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getAllsignByStaffId(staffID,this.order,this.currentPage,this.pageSize).then((result)=>{
                    if(reload){
                        this.receiveApplyList = [];
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
                        this.receiveApplyList.push(result.data.data[i]);
                    }
                    if(this.receiveApplyList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                }).catch((err)=>{
                    alertError(this,"1226");
                });
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.ApplyExamineList{
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
/* .receiveApplyList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.receiveApplyList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .receiveApplyList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .receiveApplyList{
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