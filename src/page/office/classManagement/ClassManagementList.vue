<template>
    <div class="expense">
        <chat-header :showBack="true" :title="'班级管理'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item style="float:right;">
                    <el-radio v-model="formInline.radio" label="0" style="margin-left:20px;" @change="getClassesByStatus">进行中班级</el-radio>
                    <el-radio v-model="formInline.radio" label="1" style="margin-left:20px;" @change="getClassesByStatus">已毕业班级</el-radio>
                    <!-- <el-radio v-model="formInline.radio" label="2" style="margin-left:20px;" @change="getClassesByStatus">中途退学</el-radio> -->
                </el-form-item>
            </el-form>
        </div>
        <div class="classManagementList">
            <class-management-item v-for="(item,index) in classManagementList" :key="index" :item="item"></class-management-item>
        </div>
        <el-dialog :visible.sync="dialogFormVisible">
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import { getChargeBill,getClassesByStatus } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ClassManagementItem from '@/page/office/classManagement/ClassManagementItem'

export default {
    name: 'ClassManagement',
    data(){
        return {
            formInline: {
                radio:"0"
            },
            classManagementList:[],
            dialogFormVisible: false,
            form: {
                
            },
            currChargeBillID:''
        }
    },
    components:{
        ChatHeader,
        ClassManagementItem
    },
    mounted(){
        this.getClassesByStatus();

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
        getClassesByStatus(){
            let loading = showLoading();
            getClassesByStatus("0",this.formInline.radio).then((result)=>{
                closeLoading(loading);
                this.classManagementList = result.data.data;
            });
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