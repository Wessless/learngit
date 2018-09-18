<template>
    <div class="examineApproveList">
        <chat-header :showBack="true" :title="'审批'"></chat-header>
        <div style="width:100%;padding:66px 20px 20px 20px;overflow:hidden;height:100vh;position:relative;">
            <el-tabs v-model="approveName" @tab-click="handleClick" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;" class="examineApproveTabs">
                <el-tab-pane label="发起审批" name="first" >
                    <div class="approveList" v-if="clickTabName=='发起审批'">
                        <div class="approveItem" v-for="item in approveList" :key="item.name" @click="toUrl(item)">
                            <img :src="'/static/images/office/'+item.id+(item.router?'':'_gray')+'.png'" alt="">
                            <div class="title">{{ item.name }}</div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="待我审批的" name="second" >
                    <Examine-Approve-Tab-List v-if="clickTabName=='待我审批的'" :clickTabName="clickTabName"></Examine-Approve-Tab-List>
                </el-tab-pane>
                <el-tab-pane label="我已审批的" name="third" >
                    <Examine-Approve-Tab-List v-if="clickTabName=='我已审批的'" :clickTabName="clickTabName"></Examine-Approve-Tab-List>
                </el-tab-pane>
                <el-tab-pane label="我发起的" name="fourth" >
                    <Examine-Approve-Tab-List v-if="clickTabName=='我发起的'" :clickTabName="clickTabName"></Examine-Approve-Tab-List>
                </el-tab-pane>
                <el-tab-pane label="抄送我的" name="fifth" >
                    <Examine-Approve-Tab-List v-if="clickTabName=='抄送我的'" :clickTabName="clickTabName"></Examine-Approve-Tab-List>
                </el-tab-pane>
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
import ExamineApproveTabList from '@/page/office/examineApproveTab/ExamineApproveTabList'

export default {
    name: 'examineApproveList',
    data(){
        return {
            isNoData:false,
            itemList:[],
            clickTabName:"",
            examineApproveList:[
                { name:"通用"  ,id:"1019", router:"/commonApply"},
                { name:"外出"  ,id:"1020", router:"/gooutApply"},
                { name:"出差"  ,id:"1021", router:"/businessTripApply"},
                { name:"请假"  ,id:"1004", router:"/holidayApply"},
                { name:"订单"  ,id:"1005", router:"/orderformApply"},
                { name:"报销"  ,id:"1006", router:"/expenseApply"},
                { name:"借款"  ,id:"1007", router:"/borrowApply"},
                { name:"加班"  ,id:"1017", router:"/extraWorkApply"},
                { name:"违规"  ,id:"1018", router:"/illegalApply"},
                { name:"应付款"  ,id:"1028", router:"/dueApply"},
            ],
            approveName:""
        }
    },
    components:{
        NoData,
        ChatHeader,
        ExamineApproveTabList
    },
    mounted(){
        if(this.approveTabType){
            this.approveName = this.approveTabType;
        }else{
            this.approveName = "first";
        }
        if (this.approveName == "first") {
            this.clickTabName = "发起审批";
        }else if (this.approveName == "second") {
            this.clickTabName = "待我审批的";
        }else if (this.approveName == "third") {
            this.clickTabName = "我已审批的";
        }else if (this.approveName == "fourth") {
            this.clickTabName = "我发起的";
        }else if (this.approveName == "fifth") {
            this.clickTabName = "抄送我的";
        }
        this.getMenusByStaffID();
    },
    computed:{
        ...mapState([
            'userInfo',
            'approveTabType'
        ]),
        approveList(){
            let resultArr = [];
            let result;
            let loading = showLoading();
            for(let j=0;j<this.examineApproveList.length;j++){
                if (j==8) {
                    // resultArr.push(this.examineApproveList[j]);
                    result = this.examineApproveList[j];
                    continue;
                }
                for(let i=0;i<this.itemList.length;i++){
                    let obj = this.itemList[i];
                    if(obj.Num==this.examineApproveList[j].id){
                        resultArr.push(this.examineApproveList[j]);
                    }
                }
            }
            // console.log(resultArr)
            resultArr.push(result);
            closeLoading(loading);
            return resultArr;
        },
        // activeName(){
        //     return this.approveTabType;
        // }
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
        toUrl(item){
            if(item.router!=""){
                this.$router.push(this.$route.fullPath+item.router);
            }else{
                const h = this.$createElement;
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message:
                        h('p', null, [
                            h('span', null, '请前往蜂堡办公系统手机版进行操作 '),
                            h('a', { style: 'color: #38adff',on:{ click:this.openQRCode } }, '下载手机版')
                        ])
                });
            }
        },
        openQRCode(){
            this.SET_BROWSERIMG({
                imgPath:"static/images/cos_qrcode.png",
                styleObject:{
                    width:"300px",
                    height:"300px"
                }
            });
        },
        handleClick(tab, event) {
            if (tab.label == "待我审批的") {
                this.clickTabName = "待我审批的";
                this.SET_APPROVETABTYPE("second");
                // console.log(this.approveTabType);
            }else if (tab.label == "我已审批的") {
                this.clickTabName = "我已审批的";
                this.SET_APPROVETABTYPE("third");
                // console.log(this.approveTabType);
            }else if (tab.label == "我发起的") {
                this.clickTabName = "我发起的";
                this.SET_APPROVETABTYPE("fourth");
                // console.log(this.approveTabType);
            }else if (tab.label == "抄送我的") {
                this.clickTabName = "抄送我的";
                this.SET_APPROVETABTYPE("fifth");
                // console.log(this.approveTabType);
            }else if(tab.label == "发起审批"){
                this.clickTabName = "发起审批";
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