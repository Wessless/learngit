<template>
    <div class="templateDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="$route.meta.type!='detail'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirmAdd"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="班号">
                <el-input v-model="form.ClassNum" size="small" style="width:400px;" placeholder="" disabled></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="班名">
                <el-input v-model="form.ClassName" size="small" :disabled="disabledChangeName" style="width:400px;" placeholder="请输入班名"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="班级类别">
                <el-radio v-model="form.ClassType" label="1" :disabled="$route.meta.type=='update'||$route.meta.type=='detail'" style="margin-left:20px;">托班</el-radio>
                <el-radio v-model="form.ClassType" label="2" :disabled="$route.meta.type=='update'||$route.meta.type=='detail'" style="margin-left:20px;">小班</el-radio>
                <el-radio v-model="form.ClassType" label="3" :disabled="$route.meta.type=='update'||$route.meta.type=='detail'" style="margin-left:20px;">中班</el-radio>
                <el-radio v-model="form.ClassType" label="4" :disabled="$route.meta.type=='update'||$route.meta.type=='detail'" style="margin-left:20px;">大班</el-radio>
            </el-form-item>
            <el-form-item label="添加日期">
                <el-date-picker
                    v-model="form.ClassDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    size="small"
                    placeholder="请选择添加日期"
                    :disabled="$route.meta.type=='detail'"
                    style="width:400px;">
                </el-date-picker>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="班级定员">
                <el-input v-model="form.ClassSetNum" size="small" :disabled="$route.meta.type=='detail'" style="width:400px;" placeholder="请输入班级定员"></el-input>
                <div class="grayColor">是指按照教育局规定该班能容纳的最多人数</div>
            </el-form-item>
            <el-form-item label="班级教师">
                <el-select v-model="form.TeacherID" multiple size="small" :disabled="$route.meta.type=='detail'" placeholder="请选择班级教师" style="width:400px;" >
                    <el-option
                    v-for="item in allStaff"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="班级助教">
                <el-select v-model="form.AssistantID" multiple size="small" :disabled="$route.meta.type=='detail'" placeholder="请选择班级助教" style="width:400px;" >
                    <el-option
                    v-for="item in allStaff"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="班级保育员">
                <el-select v-model="form.NurseryID" multiple size="small" :disabled="$route.meta.type=='detail'" placeholder="请选择班级保育员" style="width:400px;" >
                    <el-option
                    v-for="item in allStaff"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="班级状态">
                <el-radio v-model="form.ClassStatus" label="0" :disabled="$route.meta.type=='update'||$route.meta.type=='detail'" style="margin-left:20px;">进行中</el-radio>
                <el-radio v-model="form.ClassStatus" label="1" :disabled="$route.meta.type=='update'||$route.meta.type=='detail'" style="margin-left:20px;">已毕业</el-radio>
            </el-form-item>
            <el-form-item label="备注" style="margin-top:10px;">
                <el-input v-model="form.Remark" size="small" type="textarea" :disabled="$route.meta.type=='detail'" :rows="4" style="width:400px;" placeholder="请输入备注"></el-input>
            </el-form-item>            
        </el-form>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <span>班级名称“{{ form.ClassName }}”，班级类型“{{ classType }}”，请再次确认该信息是否正确，一旦保存，便不能修改。您确定要继续吗？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>

import { findClassByID,getClassNum,addOrUpdateClass } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'ClassManagementDetail',
    data(){
        return {
            title:"",
            form: {
                ClassNum:"",
                ClassName:"",
                ClassDate:"",
                ClassType:"2",
                ClassStatus:"0",
                ClassSetNum:"",
                TeacherID:[],
                AssistantID:[],
                NurseryID:[],
                Remark:""
            },
            disabledChangeName:false,
            allStaff:[],
            dialogVisible:false,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        // this.loadDetail();
        if(this.$route.meta.type=="add"){
            this.title = "添加班级";
            this.getClassNum();
        }else if(this.$route.meta.type=="update"){
            this.title = "修改班级";
            this.findClassByID();
        }else if(this.$route.meta.type=="detail"){
            this.title = "查看班级";
            this.disabledChangeName = true;
            this.findClassByID();
        }
        this.allStaff = this.allStaffs;
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        classType(){
            if(this.form.ClassType=="1"){
                return "托班";
            }
            if(this.form.ClassType=="2"){
                return "小班";
            }
            if(this.form.ClassType=="3"){
                return "中班";
            }
            if(this.form.ClassType=="4"){
                return "大班";
            }
            return "";
        }
    },
    watch:{
    },
    methods:{
        getClassNum(){
            getClassNum().then((result)=>{
                this.form.ClassNum = result.data.classnum;
            }).catch((err)=>{
                alertError(this,"1026");
            });
        },
        findClassByID(){
            let loading = showLoading();
            let classID = this.$route.params.classID; 
            findClassByID(classID).then((result)=>{
                closeLoading(loading);
                let classInfo = result.data.data[0];
                this.form.ClassNum = classInfo.ClassNum;
                this.form.ClassName = classInfo.ClassName;
                this.form.ClassDate = classInfo.ClassDate.split(" ")[0];
                this.form.ClassStatus = classInfo.ClassStatus;
                this.form.ClassType = classInfo.ClassType;
                this.form.ClassSetNum = classInfo.ClassSetNum;
                this.form.TeacherID = classInfo.TeacherID?classInfo.TeacherID.split(","):[];
                this.form.AssistantID = classInfo.AssistantID?classInfo.AssistantID.split(","):[];
                this.form.NurseryID = classInfo.NurseryID?classInfo.NurseryID.split(","):[];
                this.form.Remark = classInfo.Remark;
                if(this.form.ClassStatus=="0"){
                    this.disabledChangeName = true;
                }
            }).catch((err)=>{
                alertError(this,"1027");
            });
        },
        confirmAdd(){
            if(this.$route.meta.type=="add"){
                this.dialogVisible = true;
            }else{
                this.confirm();
            }
        },
        // 点击确认保存模板
        confirm(){
            this.dialogVisible = false;
            let id = this.$route.params.classID?this.$route.params.classID:"";
            let classNum = this.form.ClassNum;
            let className = this.form.ClassName;
            let classDate = this.form.ClassDate;
            let classSetNum = this.form.ClassSetNum;
            let classStatus = this.form.ClassStatus;
            let classType = this.form.ClassType;
            let classTeacher = [];
            let teachers = this.form.TeacherID;

            if(className.trim()==""){
                this.$message.error({
                    message : "请输入班名！"
                });
                return;
            }

            if(classDate.trim()==""){
                this.$message.error({
                    message : "请选择添加日期！"
                });
                return;
            }

            for(let i=0;i<teachers.length;i++){
                let teacherID = teachers[i];
                for(let j=0;j<this.allStaff.length;j++){
                    if(teacherID==this.allStaff[j].StaffID){
                        classTeacher.push(this.allStaff[j].StaffName);
                    }
                }
            }

            let assistant = [];
            teachers = this.form.AssistantID;
            for(let i=0;i<teachers.length;i++){
                let teacherID = teachers[i];
                for(let j=0;j<this.allStaff.length;j++){
                    if(teacherID==this.allStaff[j].StaffID){
                        assistant.push(this.allStaff[j].StaffName);
                    }
                }
            }

            let nurse = [];
            teachers = this.form.NurseryID;
            for(let i=0;i<teachers.length;i++){
                let teacherID = teachers[i];
                for(let j=0;j<this.allStaff.length;j++){
                    if(teacherID==this.allStaff[j].StaffID){
                        nurse.push(this.allStaff[j].StaffName);
                    }
                }
            }

            let remark = this.form.Remark;
            let type = "";
            if(this.$route.meta.type=="add"){
                type = "添加";
            }else if(this.$route.meta.type=="update"){
                type = "修改";
            }
            let loading = showLoading();
            
            addOrUpdateClass(id,classNum,className,classSetNum,classDate,classStatus,classType,classTeacher.join(","),remark,assistant.join(","),nurse.join(","))
            .then((result)=>{
                console.log(result);
                closeLoading(loading);
                if(result.data.classid){
                    this.$message({
                        message : type + "成功",
                        type : "success"
                    });
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message : type + "失败"
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
.templateDetail{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    padding-top:74px;
    position: relative;
}
.el-form-item {
    margin-bottom: 0px;
}
.examineProject{
    width:100%;
    margin-top:20px; 
    padding-top:20px;
    margin-left:10px;
    border-top: 1px solid #666666;
}
.topLine{
    display: flex;
    flex-direction: row;
    margin-bottom:10px;
}
.topLine > .title{
    display: flex;
    align-items: center;
    margin-right: 5px;
}
.el-input__inner:disabled{
    color:#606266 !important;
}
.redColor{
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: red;
    display: inline-block;
}
.grayColor{
    height: 100%;
    width:100%;
    display: flex;
    align-items: center;
    /* padding-left: 10px; */
    color: #888;
    display: inline-block;
}
.element-icon{
    font-family: element-icons !important;
    /* speak: none; */
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
}
.avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    position: absolute;
}
.avatar-uploader-icon:before {
    content: "\E62B";
    z-index: 1;
}
.avatar {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 5px;
    display: block;
    margin:5px 0;
    background:#ffffff;
    overflow: hidden;
    cursor: pointer;
}
.avatar:hover{
    border: 1px dashed #38adff;
}
.avatar > img {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 5;
}
</style>