<template>
    <div class="purchaseInstorage">
        <!-- <chat-header :showBack="true" :title="'采购入库'"></chat-header> -->
        <div style="width:100%;padding-bottom:10px;">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="" style="float:right">
                    <el-select v-model="form.SequenceNo" filterable :placeholder="'批次号'" @change="loadList(true)">
                        <el-option
                        v-for="item in form.SequenceNoArr"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="PurchaseApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Purchase-Instorage-item v-for="item in PurchaseApplyList" :key="item.num" :item="item" @clickDone="clickDone"></Purchase-Instorage-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>点击确定按钮将结束物品入库过程。是否继续</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDone">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getAllPurchaseOutByStaffId ,getAllSequenceNo,doInApply} from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import PurchaseInstorageItem from '@/page/office/purchaseInstorage/PurchaseInstorageItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'purchaseInstorage',
    data(){
        return {
            isNoData:false,
            order:"in",
            currentPage:1,
            pageSize:10,
            PurchaseApplyList:[],
            clickItem:{},
            dialogVisible:false,
            form:{
                SequenceNo:"",
                SequenceNoArr:[],
            },
        }
    },
    components:{
        NoData,
        ChatHeader,
        PurchaseInstorageItem,
    },
    mounted(){
        this.getAllSequenceNo();
    },
    computed:{
        ...mapState([
            'userInfo',
            // 'allStaffs'
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
                getAllPurchaseOutByStaffId(staffID,this.order,this.currentPage,this.pageSize,this.form.SequenceNo).then((result)=>{
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
                    console.log(err);
                    closeLoading(loading);
                    alertError(this,"1234");
                });
            }
        },
        clickDone(item){
            this.dialogVisible = true;
            this.clickItem = item;
        },
        confirmDone(){
            this.dialogVisible = false;  
            let ApplyID = this.clickItem.ApplyID;
            let loading = showLoading();
            doInApply(ApplyID).then((result)=>{
                closeLoading(loading);
                if(result.data.ret==1){
                    this.$message({
                        message: '入库成功',
                        type: 'success'
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message: '入库失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                alertError(this,"2161");
            })
        },
        getAllSequenceNo(){
            getAllSequenceNo().then((result)=>{
                let Arr = result.data.data;
                let sequenceNo = [{
                    value:-1,
                    label:"全部",
                }];
                for(var i=1;i<Arr.length;i++){
                    let json = {
                        value:Arr[i],
                        label:Arr[i]
                    }
                    sequenceNo.push(json);
                }
                this.form.SequenceNoArr = sequenceNo;
            }).catch((err)=>{
                alertError(this,"1242");
            }) 
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.purchaseInstorage{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    /* overflow: scroll; */
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