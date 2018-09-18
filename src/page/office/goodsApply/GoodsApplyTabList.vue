<template>
    <div class="examineApproveList">
        <chat-header :showBack="true" :title="'物品申领'"></chat-header>
        <div style="width:100%;padding:66px 20px 20px 20px;overflow:hidden;height:100vh;position:relative;">
            <el-tabs v-model="approveName" @tab-click="handleClick" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;" class="goodsApplyTabs">
                <el-tab-pane label="申领申请" name="first" >
                    <Receive-Apply-List v-if="clickTabName=='申领申请'"></Receive-Apply-List>
                </el-tab-pane>
                <el-tab-pane label="申领审批" name="second" >
                    <Apply-Examine-List v-if="clickTabName=='申领审批'" :clickTabName="clickTabName"></Apply-Examine-List>
                </el-tab-pane>
                <el-tab-pane label="申领出库" name="third" >
                    <Apply-Outstorage-List v-if="clickTabName=='申领出库'" :clickTabName="clickTabName"></Apply-Outstorage-List>
                </el-tab-pane>
                <el-tab-pane label="申领归还" name="fourth" >
                    <Apply-Instorage-List v-if="clickTabName=='申领归还'" :clickTabName="clickTabName"></Apply-Instorage-List>
                </el-tab-pane>
                <!-- <el-tab-pane label="抄送我的" name="fifth" >
                    <Examine-Approve-Tab-List v-if="clickTabName=='抄送我的'" :clickTabName="clickTabName"></Examine-Approve-Tab-List>
                </el-tab-pane> -->
            </el-tabs>
        </div>
        <!-- <no-data :isShow="isNoData"></no-data> -->
        <!-- <div class="receiveApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Apply-Examine-item v-for="item in receiveApplyList" :key="item.num" :item="item"></Apply-Examine-item>
        </div> -->
    </div>
</template>

<script>

import { getMenusByStaffID } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import NoData from '@/components/chat/NoData'
import ChatHeader from '@/components/chat/ChatHeader'
import ReceiveApplyList from '@/page/office/ReceiveApply/ReceiveApplyList'
import ApplyExamineList from '@/page/office/applyExamine/ApplyExamineList'
import ApplyOutstorageList from '@/page/office/applyOutstorage/ApplyOutstorageList'
import ApplyInstorageList from '@/page/office/applyInstorage/ApplyInstorageList'
// import ExamineApproveTabList from '@/page/office/examineApproveTab/ExamineApproveTabList'

export default {
    name: 'GoodsApplyTabList',
    data(){
        return {
            isNoData:false,
            clickTabName:"",
            approveName:""
        }
    },
    components:{
        NoData,
        ChatHeader,
        ReceiveApplyList,
        ApplyExamineList,
        ApplyOutstorageList,
        ApplyInstorageList
    },
    mounted(){
        if(this.approveTabType){
            this.approveName = this.approveTabType;
        }else{
            this.approveName = "first";
        }
        if (this.approveName == "first") {
            this.clickTabName = "申领申请";
        }else if (this.approveName == "second") {
            this.clickTabName = "申领审批";
        }else if (this.approveName == "third") {
            this.clickTabName = "申领出库";
        }else if (this.approveName == "fourth") {
            this.clickTabName = "申领归还";
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'approveTabType'
        ]),
    },
    methods:{
        ...mapMutations([
            'SET_BROWSERIMG',
            'SET_APPROVETABTYPE'
        ]),
        getMenusByStaffID(){
            getMenusByStaffID(this.userInfo.userStaffID).then((result)=>{
                this.itemList = result.data.data;

            })
            .catch((err)=>{
                alertError(this,"1016");
            });
        },
        handleClick(tab, event) {
            if (tab.label == "申领审批") {
                this.clickTabName = "申领审批";
                this.SET_APPROVETABTYPE("second");
                // console.log(this.approveTabType);
            }else if (tab.label == "申领出库") {
                this.clickTabName = "申领出库";
                this.SET_APPROVETABTYPE("third");
                // console.log(this.approveTabType);
            }else if (tab.label == "申领归还") {
                this.clickTabName = "申领归还";
                this.SET_APPROVETABTYPE("fourth");
                // console.log(this.approveTabType);
            }else if(tab.label == "申领申请"){
                this.clickTabName = "申领申请";
                this.SET_APPROVETABTYPE("first");
                // console.log(this.approveTabType);
            }
        },
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.examineApproveList{
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
.el-tabs__nav {
    width: 100% !important;
}
.approveList{
    padding:20px 20px 0 20px;
    display: grid;
    width: 100%;
    grid-template-columns: 25% 25% 25% 25%;
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    /* background: red; */
}
@media screen and (max-width: 1140px){
    .approveList{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 33.3% 33.3% 33.3%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
@media screen and (max-width: 980px){
    .approveList{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
@media screen and (max-width: 800px){
    .approveList{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
.approveItem{
    display: flex;
    height:80px;
    justify-self: center;
    width: 94%;
    margin-bottom: 15px;
    flex-direction: row;
    border:1px solid #dddddd;
    border-radius: 5px;
    align-items: center;
}
.approveItem:hover{
    cursor: pointer;
    border:1px solid #38adff;
}
.approveItem > img{
    padding: 15px;
    width:80px;
    height:80px;
    display: inline-block;
}
.approveItem > .title{
    display: inline-block;
    height:20px;
}
</style>