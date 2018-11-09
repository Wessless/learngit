<template>
    <div class="purchaseApply">
        <!-- <chat-header :showBack="true" :title="'采购申请'"></chat-header> -->
        <div style="width:100%;padding-bottom:10px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item  class="addbtn">
                    <el-button type="primary" size="medium" @click.stop="confirm">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="PurchaseApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Purchase-Apply-item v-for="item in PurchaseApplyList" :key="item.num" :item="item" @clickDelete="clickDelete"></Purchase-Apply-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该采购信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getAllPurchaseApplyByStaffId ,deletePurchaseApplyInfo} from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import PurchaseApplyItem from '@/page/office/purchaseApply/PurchaseApplyItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'purchaseApply',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[]
            },
            // form: {
            //     GoodsSortName : "",
            //     StabilizeAssetsNum : "",
            //     GoodsName : ""
            // },
            isNoData:false,
            order:"apply",
            currentPage:1,
            pageSize:10,
            dialogFormVisible:false,
            dialogVisible:false,
            PurchaseApplyList:[],
            clickItem:{},
        }
    },
    components:{
        NoData,
        ChatHeader,
        PurchaseApplyItem
    },
    mounted(){
        
    },
    computed:{
        ...mapState([
            'userInfo',
        ])
    },
    watch:{
    },
    methods:{
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            // staffID = "0";
            // let fillStaffID = this.formInline.staffID ? this.formInline.staffID : "-1";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getAllPurchaseApplyByStaffId(staffID,this.order,this.currentPage,this.pageSize).then((result)=>{
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
                    alertError(this,"1231");
                });
            }
        },
        confirm(){
            this.$router.push(this.$route.fullPath+"/purchaseApply/add");
        },
        clickDelete(item){
            this.dialogVisible = true;
            this.clickItem = item;
        },
        confirmDelete(){
            this.dialogVisible = false;  
            console.log(this.clickItem)
            let applyID = this.clickItem.ApplyID;
            let loading = showLoading();
            deletePurchaseApplyInfo(applyID).then((result)=>{
                closeLoading(loading);
                if(result.data.ret==1){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                alertError(this,"2153");
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.purchaseApply{
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