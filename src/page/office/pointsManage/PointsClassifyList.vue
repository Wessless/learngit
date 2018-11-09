<template>
    <div class="PointsClassifyList">
        <chat-header :showBack="true" :title="'积分分类'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addClassify">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="pointsClassifyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <points-classify-item v-for="item in pointsClassifyList" :key="item.num" :item="item" @clickDelete="clickDelete"></points-classify-item>
        </div>
        <el-dialog 
            title="提示"
            :visible.sync="dialogFormVisible"
            width="35%">
            <span>您确定要删除该分类吗？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import { getAllCreditType,delCreditType } from '@/js/api'
import { showLoading,closeLoading,alertError,dateTimeFormatter} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import PointsClassifyItem from '@/page/office/pointsManage/PointsClassifyItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'PointsClassifyList',
    data(){
        return {
            isNoData:false,
            pointsClassifyList:[],
            isDisabled:false,
            dialogFormVisible: false,
            currentPage:1,
            pageSize:10,
            clickItem:{},
        }
    },
    components:{
        NoData,
        ChatHeader,
        PointsClassifyItem
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
            let type = "-1";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getAllCreditType(this.currentPage,this.pageSize,type).then((result)=>{
                    if(reload){
                        this.pointsClassifyList = [];
                    }
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        this.pointsClassifyList.push(result.data.data[i]);
                    }
                    if(this.pointsClassifyList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                }).catch((err)=>{
                    alertError(this,"1205");
                    closeLoading(loading);
                });
            }
        },
        addClassify(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        clickDelete(item){
            this.dialogFormVisible = true;
            this.clickItem = item;
        },
        confirmDelete(){
            this.dialogFormVisible = false;
            let id = this.clickItem.ID;
            let loading = showLoading();
            delCreditType(id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
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
                closeLoading(loading);
                alertError(this,"2137");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.PointsClassifyList{
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
/* .pointsClassifyList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.pointsClassifyList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .pointsClassifyList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .pointsClassifyList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>