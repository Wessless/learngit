<template>
    <div class="interestClassTeacherDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="兴趣班名称">
                <el-input v-model="form.ClassName" size="small" style="width:400px;" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="任课教师" v-show="isShow">
                <el-select v-model="form.ExternalTeacherName" @change="hangdleChange" size="small" style="width:400px;" placeholder="请选择任课教师">
                    <el-option
                    v-for="item in form.ExternalTeacherArr"
                    :key="item.ID"
                    :label="item.TeacherName"
                    :value="item.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="跟班教师" v-show="isShow1">
                <el-select v-model="form.TeacherName" multiple size="small" placeholder="请选择跟班教师" style="width:400px;" >
                    <el-option
                    v-for="item in allStaffs"
                    :key="item.StaffName"
                    :label="item.StaffName"
                    :value="item.StaffName">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { addOrUpdateTeacherDetail,getAllExternalTeacher,addOrUpdateTeacher } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'InterestClassManageDetail',
    data(){
        return {
            title:"",
            form: {
                ClassName:"",
                ExternalTeacherID:"",
                ExternalTeacherName:"",
                ExternalTeacherArr:[],
                TeacherName:[],
            },
            isShow:false,
            isShow1:false,
            pageNo:1,
            pageSize:1000,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="change"){
            if (this.$route.params.data.split("&")[2]==1) {
                this.title = "设定出勤任课教师";
                this.addOrUpdateTeacherDetail(1,"");
                this.isShow = true;
            }else{
                this.title = "设定出勤陪班教师";
                this.addOrUpdateTeacherDetail(2,"");
                this.isShow1 = true;
            }
        }else if(this.$route.meta.type=="update"){
            if (this.$route.params.data.split("&")[2]==1) {
                this.title = "修改出勤任课教师";
                this.addOrUpdateTeacherDetail(1,1);
                this.isShow = true;
            }else{
                this.title = "修改出勤陪班教师";
                this.addOrUpdateTeacherDetail(2,1);
                this.isShow1 = true;
            }
        }
        this.getAllExternalTeacher();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    watch:{
    },
    methods:{
        // 点击确认保存模板
        confirm(){
            let json = {
                calendarID:this.$route.params.data.split("&")[1],
                turn:this.$route.params.data.split("&")[2]==1?"ETeacher":"Teacher",
                teacherID:this.isShow?this.form.ExternalTeacherID:"",
                teacherName:this.isShow?this.form.ExternalTeacherName:this.form.TeacherName.join(),
            }
            if (this.$route.meta.type=="update") {
                json.status = "modify";
            }else if(this.$route.meta.type=="change"){
                json.status = "add"
            }
            if(json.teacherName==""){
                this.$message.error({
                    message:"请选择教师！"
                });
				return false;
            }
            let loading = showLoading();
            addOrUpdateTeacher(json).then((result)=>{
                closeLoading(loading);
                if(this.$route.meta.type=="update"){
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"修改成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"修改失败"
                        });
                    }
                }else{
                     if(result.data.Result=='1'){
                        this.$message({
                            message:"设定成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"设定失败"
                        });
                    }
                }
            })
            // .catch((err)=>{
            //     alertError(this,"2155");
            // });
        },
        getAllExternalTeacher(){
            getAllExternalTeacher(this.pageNo,this.pageSize).then((result)=>{
                this.form.ExternalTeacherArr = result.data.data; 
            })
        },
        addOrUpdateTeacherDetail(turn,status){
            let classId = this.$route.params.data.split("&")[0];
            let calendarID = this.$route.params.data.split("&")[1];
            // console.log(classId,calendarID,turn,status)
            addOrUpdateTeacherDetail(classId,calendarID,turn,status).then((result)=>{
                // console.log(result.data)
                this.form.ClassName = result.data.InterestClassName;
                this.form.ExternalTeacherName = result.data.ExternalTeacherName?result.data.ExternalTeacherName:"";
                this.form.TeacherName = result.data.Teachers?result.data.Teachers.split(";"):[];
                this.form.ExternalTeacherID = result.data.ExternalTeacherID?result.data.ExternalTeacherID:"";
            })
        },
        hangdleChange(value){
            for (let i = 0; i < this.form.ExternalTeacherArr.length; i++) {
                if(this.form.ExternalTeacherArr[i].ID==value){
                    this.form.ExternalTeacherName = this.form.ExternalTeacherArr[i].TeacherName;
                    this.form.ExternalTeacherID = this.form.ExternalTeacherArr[i].ID;
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interestClassTeacherDetail{
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
</style>