<template>
    <div class="interestClassTeacher">
        <chat-header :showBack="true" :title="'兴趣班班级管理'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-radio v-model="formInline.radio" label="0" @change="loadList" style="margin-left:20px;">进行中的班级</el-radio>
                    <el-radio v-model="formInline.radio" label="1" @change="loadList" style="margin-left:20px;">已结束的班级</el-radio>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addTeacher">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="employTeacherList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Interest-Class-Manage-item v-for="item in employTeacherList" :key="item.num" :item="item" @clickDelete="clickDelete" @clickEnd="clickEnd"></Interest-Class-Manage-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该兴趣班</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="statusDialogVisible"
            width="30%">
            <span>是否将该班级标志为已结束</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="statusDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmStatus">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getIClass,deleteIClass,endClass } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import InterestClassManageItem from '@/page/office/interestClassManage/InterestClassManageItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'interestClassTeacher',
    data(){
        return {
            formInline:{
                radio:"0",
            },
            isDisabled:false,
            currentPage:1,
            pageNo:1,
            pageSize:10,
            dialogVisible:false,
            item:"",
            statusDialogVisible:false,
            employTeacherList:[],
            clickItem:{},
            isNoData:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
        InterestClassManageItem
    },
    mounted(){
        
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
    },
    watch:{
        
    },
    methods:{
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            let endFlag = this.formInline.radio;
            // staffID = "0";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getIClass(this.currentPage,this.pageSize,staffID,endFlag).then((result)=>{
                    if(reload){
                        this.employTeacherList = [];
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
                        this.employTeacherList.push(result.data.data[i]);
                    }
                    if(this.employTeacherList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                });
            }
        },
        addTeacher(){
            this.$router.push(this.$route.fullPath+"/add/");
        },
        clickDelete(item){
            this.dialogVisible = true;
            this.clickItem = item;
        },
        confirmDelete(){
            this.dialogVisible = false;
            let id = this.clickItem.ID;
            let loading = showLoading();
            deleteIClass(id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.loadList(true);
                }else if(result.data.Result=="2"){
                    this.$message({
                        message: '已绑定学员的兴趣班不能删除',
                        type: 'error'
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                }
            })
        },
        getClassesByStatus(){
            console.log(this.formInline.radio)
        },
        clickEnd(item){
            this.statusDialogVisible = true;
            this.clickItem = item;
        },
        confirmStatus(){
            this.statusDialogVisible = false;
            let classID = this.clickItem.ID;
            let loading = showLoading();
            endClass(classID).then((result)=>{
                closeLoading(loading);
                if(result.data.Result==1){
                    this.$message({
                        message: '标记成功',
                        type: 'success'
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message: '标记失败',
                        type: 'error'
                    });
                }
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interestClassTeacher{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .interestClassTeacher{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.employTeacherList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .employTeacherList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .employTeacherList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}

</style>