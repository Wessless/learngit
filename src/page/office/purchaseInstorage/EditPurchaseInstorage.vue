<template>
    <div class="purchaseInstorage">
        <chat-header :showBack="true" :title="'采购入库'"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" v-show="$route.meta.type!='purchaseFindEdit'" :model="form" class="demo-form-inline">
                <el-form-item  class="addbtn">
                    <el-button type="primary" size="medium" @click.stop="confirmAdd">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="PurchaseApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Edit-Purchase-Instorage-item v-for="item in PurchaseApplyList" :key="item.num" :item="item" @clickDelete="clickDelete"></Edit-Purchase-Instorage-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该入库信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getPurchaseApplyAllInInfo ,deleteGoodsInfo} from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import EditPurchaseInstorageItem from '@/page/office/purchaseInstorage/EditPurchaseInstorageItem'
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
            sortID:0,
            isValid:1,
            hdmode:"master",
            keyword:"",
            stabilizeAssetsNum:"",
            dep:"",
            position:"",
            userID:"",
            form:{
                SequenceNo:"",
            },
        }
    },
    components:{
        NoData,
        ChatHeader,
        EditPurchaseInstorageItem
    },
    mounted(){

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
            let applyID = this.$route.params.applyId;
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                // let loading = showLoading();
                getPurchaseApplyAllInInfo(applyID,this.sortID,this.isValid,this.hdmode,this.keyword,this.stabilizeAssetsNum,this.dep,this.position,this.userID,this.currentPage,this.pageSize)
                .then((result)=>{
                    if(reload){
                        this.PurchaseApplyList = [];
                    }
                    // console.log(result)
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    // closeLoading(loading);
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
                    alertError(this,"1238");
                });
            }
        },
        clickDelete(item){
            this.dialogVisible = true;
            this.clickItem = item;
        },
        confirmDelete(){
            this.dialogVisible = false;  
            let ID = this.clickItem.GoodsID;
            let loading = showLoading();
            deleteGoodsInfo(ID).then((result)=>{
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
                alertError(this,"2160");
            })
        },
        confirmAdd(){
            let Id = this.PurchaseApplyList[0].GoodsID;
            this.$router.push(this.$route.fullPath+"/add/"+Id);
        },
        // getSortId(){
        //     let applyID = this.$route.params.applyId;
        //     getPurchaseDetailOutByAplyId(applyID).then((result)=>{
        //         let obj = result.data.data;
        //         this.sortID = obj[0].GoodsSrot;
        //     }) 
        // }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.purchaseInstorage{
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