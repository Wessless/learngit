<template>
    <div class="expense">
        <chat-header :showBack="true" :title="'缴费科目设定'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-radio v-model="formInline.radio" label="0" style="margin-left:20px;" @change="getPaymentManageList">使用中</el-radio>
                    <el-radio v-model="formInline.radio" label="1" style="margin-left:20px;" @change="getPaymentManageList">已删除</el-radio>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addSubject">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="classManagementList">
            <set-tuition-subject-item v-for="(item,index) in classManagementList" :key="index" :item="item" :flag="formInline.radio" @clickDelete="clickDelete"></set-tuition-subject-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该缴费科目</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getClassesByStatus,deleteClassByID,getPaymentManageList,deletePayment } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import SetTuitionSubjectItem from '@/page/office/setTuitionSubject/SetTuitionSubjectItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'SetTuitionSubject',
    data(){
        return {
            formInline: {
                radio:"0"
            },
            isNoData:false,
            classManagementList:[],
            dialogVisible: false,
            clickItem:null,
            currPage:1,
            pageSize:1000
        }
    },
    components:{
        NoData,
        ChatHeader,
        SetTuitionSubjectItem
    },
    mounted(){
        this.getPaymentManageList();
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
        addSubject(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        getPaymentManageList(){
            let loading = showLoading();
            getPaymentManageList(this.userInfo.userStaffID,this.currPage,this.pageSize,this.formInline.radio).then((result)=>{
                closeLoading(loading);
                // for(let i=0;i<result.data.data.length;i++){
                //     if(result.data.data[i].ClassNum=="-1"){
                //         result.data.data.splice(i,1);
                //     }
                // }
                console.log(result)
                this.classManagementList = result.data.data;
                if(this.classManagementList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                alertError(this,"1300");
            });
        },
        // 删除
        clickDelete(item){
            this.dialogVisible = true;  
            this.clickItem = item;
        },
        // 确认删除
        confirmDelete(){
            let id = this.clickItem.ID;
            let loading = showLoading();
            deletePayment(id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message:'删除成功',
                        type:'success'
                    });
                    this.getPaymentManageList();
                }else{
                    this.$message.error({
                        message:'删除失败',
                    });
                }
            }).catch((err)=>{
                alertError(this,"2188");
            });
            this.dialogVisible = false;  
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.expense{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .classManagementList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.classManagementList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .classManagementList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .classManagementList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>