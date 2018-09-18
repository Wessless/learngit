<template>
    <div class="expense">
        <chat-header :showBack="true" :title="'班级管理'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-radio v-model="formInline.radio" label="0" style="margin-left:20px;" @change="getClassesByStatus">进行中班级</el-radio>
                    <el-radio v-model="formInline.radio" label="1" style="margin-left:20px;" @change="getClassesByStatus">已毕业班级</el-radio>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addClass">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="classManagementList">
            <class-management-item v-for="(item,index) in classManagementList" :key="index" :item="item" @clickDelete="clickDelete" @changeClassType="changeClassType" @changeClassName="changeClassName" @graduate="graduate"></class-management-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该班级</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="typeDialogVisible"
            width="30%">
            <div></div>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="班级名称">
                    <el-input v-model="className" size="medium" placeholder="请输入升班后的班级名称"></el-input>
                </el-form-item>
            </el-form>
            <span>点击确定按钮，该班级将被升班。该操作一旦执行，无法回退，您确定要继续吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="typeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmType">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="statusDialogVisible"
            width="30%">
            <span>点击确定按钮，该班级将被标记为已毕业。该操作一旦执行，无法回退，您确定要继续吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="statusDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmStatus">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="修改班级名称"
            :visible.sync="nameDialogVisible"
            width="30%">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="班级名称">
                    <el-input v-model="className" size="medium" placeholder="请输入班级名称"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="nameDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmName">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getClassesByStatus,deleteClassByID,setClassType,setClassStatus,addOrUpdateClass } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ClassManagementItem from '@/page/office/classManagement/ClassManagementItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'ClassManagement',
    data(){
        return {
            formInline: {
                radio:"0"
            },
            isNoData:false,
            classManagementList:[],
            dialogVisible: false,
            statusDialogVisible: false,
            typeDialogVisible: false,
            nameDialogVisible: false,
            form: {
                
            },
            currChargeBillID:'',
            clickItem:null,
            className:""
        }
    },
    components:{
        NoData,
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
        addClass(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        findClassByID(){
            let loading = showLoading();
            findClassByID(item.ID).then((result)=>{
                closeLoading(loading);
                let classInfo = result.data.data[0];
                this.className = classInfo.ClassName;
            }).catch((err)=>{
                alertError(this,"1027");
            });
        },
        getClassesByStatus(){
            let loading = showLoading();
            getClassesByStatus("-1",this.formInline.radio).then((result)=>{
                closeLoading(loading);
                for(let i=0;i<result.data.data.length;i++){
                    if(result.data.data[i].ClassNum=="-1"){
                        result.data.data.splice(i,1);
                    }
                }
                result.data.data.sort((x,y)=>{
                    if(Number(x.ClassType)>Number(y.ClassType)){
                        return 1;
                    }else if(Number(x.ClassType)<Number(y.ClassType)){
                        return -1;
                    }else{
                        return 0;
                    }
                });
                this.classManagementList = result.data.data;
                console.log(this.classManagementList);
                if(this.classManagementList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                alertError(this,"1028");
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
            deleteClassByID(id).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        message:'删除成功',
                        type:'success'
                    });
                    this.getClassesByStatus();
                }else{
                    this.$message.error({
                        message:'删除失败',
                    });
                }
            }).catch((err)=>{
                alertError(this,"2017");
            });
            this.dialogVisible = false;  
        },
        // 升班
        changeClassType(item){
            this.typeDialogVisible = true; 
            this.clickItem = item;
            this.className = item.ClassName;
        },
        confirmType(){
            let id = this.clickItem.ID;
            let loading = showLoading();
            setClassType(id,this.className).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message:result.data.Msg,
                        type:'success'
                    });
                    this.className = "";
                    this.getClassesByStatus();
                }else{
                    this.$message.error({
                        message:result.data.Msg
                    });
                }
            });
            this.typeDialogVisible = false;  
        },
        // 毕业
        graduate(item){
            this.statusDialogVisible = true;
            this.clickItem = item;
        },
        confirmStatus(){
            let id = this.clickItem.ID;
            let loading = showLoading();
            setClassStatus(id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message:result.data.Msg,
                        type:'success'
                    });
                    this.getClassesByStatus();
                }else{
                    this.$message.error({
                        message:result.data.Msg
                    });
                }
            });
            this.statusDialogVisible = false;  
        },
        changeClassName(item){
            this.nameDialogVisible = true;
            this.clickItem = item;
            this.className = "";
            
        },
        confirmName(){
            
            let id = this.clickItem.ID;
            let classNum = this.clickItem.ClassNum;
            let className = this.className;
            let classSetNum = this.clickItem.ClassSetNum;
            let classDate = this.clickItem.ClassDate;
            let classStatus = this.clickItem.ClassStatus;
            let classType = this.clickItem.ClassType;
            let remark = this.clickItem.Remark;
            let classTeacher = this.clickItem.TeacherID;
            let assistant = this.clickItem.AssistantID;
            let nurse = this.clickItem.NurseryID;
            if(className.trim()==""){
                this.$message.error({
                    message : "请输入班级名称"
                });
                return;
            }
            let loading = showLoading();
            addOrUpdateClass(id,classNum,className,classSetNum,classDate,classStatus,classType,classTeacher,remark,assistant,nurse)
            .then((result)=>{
                console.log(result);
                closeLoading(loading);
                if(result.data.classid){
                    this.$message({
                        message : "修改成功",
                        type : "success"
                    });
                    this.className = "";
                    this.nameDialogVisible = false;  
                    this.getClassesByStatus();
                }else{
                    this.$message.error({
                        message : "修改失败"
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2016");
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