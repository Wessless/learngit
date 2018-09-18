<template>
    <div class="ApplyExamineList">
        <!-- <chat-header :showBack="true" :title="'申领出库'"></chat-header> -->
        <div style="width:100%;padding-bottom:10px;"></div>
        <no-data :isShow="isNoData"></no-data>
        <div class="receiveApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Apply-Outstorage-item v-for="item in receiveApplyList" :key="item.num" :item="item"  @clickOutStorage="clickOutStorage"></Apply-Outstorage-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>您确定要出库吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmOutstorage">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getAlloutByStaffId, outGoods} from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ApplyOutstorageItem from '@/page/office/applyOutstorage/ApplyOutstorageItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'applyOutstorageList',
    data(){
        return {
            form: {
                GoodsSortName : "",
                StabilizeAssetsNum : "",
                GoodsName : ""
            },
            isNoData:false,
            dialogVisible:false,
            clickItem:{},
            pageNo : "1",
            order:'out',
            receiveApplyList:[],
            pageSize:10,
            currentPage:1,
            isDisabled:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
        ApplyOutstorageItem
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
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getAlloutByStaffId(staffID,this.order,this.currentPage,this.pageSize).then((result)=>{
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
                    alertError(this,"1227");
                });
            }
        },
        clickOutStorage(item){
            this.dialogVisible = true;
            this.clickItem = item;
        },
        confirmOutstorage(){
            this.dialogVisible = false;
            let staffId = this.userInfo.userStaffID;
            let applyIds = this.clickItem.ApplyID;
            let loading = showLoading();
            outGoods(staffId,applyIds).then((result)=>{
                closeLoading(loading);
                if(result.data.ret==1){
                    this.$message({
                        message: '出库成功',
                        type: 'success'
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message: '出库失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2149");
            });
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