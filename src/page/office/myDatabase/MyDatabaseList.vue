<template>
    <div class="borrow">
        <chat-header :showBack="true" :title="'我的资料库'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <!-- <el-form-item label="">
                    <el-input v-model="formInline.fileName" placeholder="请输入文件名"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="">
                    <el-select v-model="formInline.staffID" filterable placeholder="请选择同事">
                        <el-option
                        v-for="item in formInline.staffs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadList(true)">查询</el-button>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="addKnowledgeBase">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="myDatabaseList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <my-database-item v-for="(item,index) in myDatabaseList" :key="index" :item="item" @deleteKnowledge="deleteKnowledge"></my-database-item>
        </div>
        <el-dialog
            title="删除"
            :visible.sync="dialogVisible"
            width="30%">
        <span>是否删除该资料库</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteKnowledgeBase">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>

import { getBaseByStaffID,deleteKnowledgeBase } from '@/js/api'
import { showLoading,closeLoading ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import MyDatabaseItem from '@/page/office/myDatabase/MyDatabaseItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'MyDatabase',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[]
            },
            isNoData:false,
            myDatabaseList:[],
            pageSize:15,
            currentPage:1,
            isDisabled:false,
            dialogVisible:false,
            clickItem:{},
        }
    },
    components:{
        NoData,
        ChatHeader,
        MyDatabaseItem
    },
    mounted(){
        // this.showInfo();
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
        addKnowledgeBase(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        deleteKnowledge(item){
            // let id = item.KnowledgeBaseID;
            this.clickItem = item;
            this.dialogVisible = true;
        },
        deleteKnowledgeBase(){
            let id = this.clickItem.KnowledgeBaseID;
            deleteKnowledgeBase(id).then((result)=>{
                if(result.data.Result=="1"){
                    this.$message({
                        type:'success',
                        message:result.data.Msg
                    });
                    this.loadList(true);
                    this.dialogVisible = false;
                }else{
                    this.$message.error({
                        message:result.data.Msg
                    });
                }
            }).catch((err)=>{
                console.log(err);
                alertError(this,"2128");
            });
        },
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
                getBaseByStaffID(this.currentPage,this.pageSize,staffID).then((result)=>{
                    if(reload){
                        this.myDatabaseList = [];
                    }
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        this.myDatabaseList.push(result.data.data[i]);
                    }
                    if(this.myDatabaseList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                }).catch((err)=>{
                    alertError(this,"1194");
                });
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.borrow{
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
/* .myDatabaseList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.myDatabaseList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .myDatabaseList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .myDatabaseList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>