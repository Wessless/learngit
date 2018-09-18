<template>
    <div class="SetScheduleDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="日期">
                <el-date-picker
                    v-model="form.CourseDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    style="width:400px;"
                    size="small"
                    placeholder="请选择日期">
                </el-date-picker>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="开始时间">
               <el-time-picker
                    v-model="form.CourseFrom"
                    size="small"
                    format="HH:mm"
                    value-format="HH:mm"
                    style="width:400px;"
                    placeholder="请选择开始时间">
                </el-time-picker> 
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="结束时间">
               <el-time-picker
                    v-model="form.CourseTo"
                    size="small"
                    format="HH:mm"
                    value-format="HH:mm"
                    style="width:400px;"
                    placeholder="请选择结束时间">
                </el-time-picker> 
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="老师">
               <el-select v-model="form.TeacherName" filterable clearable size="small" placeholder="请选择教师" style="width:400px;">
                    <el-option
                        v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffName">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="科目">
                <el-input placeholder="请输入科目" v-model="form.CourseName" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="课程类型">
                <el-radio v-model="form.radio" label="0">普通课程</el-radio>
                <el-radio v-model="form.radio" label="1" @change="getPTDClist" style="margin-left:20px;">拼图道场</el-radio>
            </el-form-item>
            <el-form-item label="课程信息">
               <el-select v-model="form.PTDCID" :disabled="form.radio==0" filterable clearable size="small" placeholder="请选择课程信息" style="width:400px;">
                    <el-option
                        v-for="item in form.PTDCArr"
                        :key="item.id"
                        :label="item.grade"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getCourseTableSetDetail,addOrUpdateCourseTable,getPTDClist } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'SetScheduleDetail',
    data(){
        return {
            title:"",
            form: {
                CourseDate:"",
                CourseFrom:"",
                CourseTo:"",
                TeacherName:"",
                CourseName:"",
                PTDCID:"",
                PTDCArr:[],
                radio:"0",
            },
            entry:'',
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="add"){
            this.title = "添加课程信息";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改课程信息";          
        }
        this.getCourseTableSetDetail();
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
                // ID：-1添加
                // ptdcID：拼图道场id
                // ddlClassID：班级id
                // CourseDate：日期2018-01-01
                // CourseFrom：开始时间09:00
                // CourseTo：结束时间10:00
                // Teacher:教师姓名
                // CourseName：课程名称
                ddlClassID : this.$route.params.data.split("&")[0],
                CourseDate : this.form.CourseDate,
                CourseFrom : this.form.CourseFrom,
                CourseTo : this.form.CourseTo,
                Teacher : this.form.TeacherName,
                CourseName : this.form.CourseName,
            }
            if (this.$route.meta.type=="update") {
                json.ID = this.$route.params.data.split("&")[1]
            }
            if (this.$route.meta.type=="add") {
                json.ID = -1;
            }
            if(this.form.radio == "1"){
                json.ptdcID = this.form.PTDCID;
            }
            // console.log(json)
            if(json.Teacher==""){
                this.$message.error({
                    message:"请输入老师姓名！"
                });
				return false;
            }
            if(json.CourseDate==""){
                this.$message.error({
                    message:"请选择日期！"
                });
				return false;
            }
            if(json.CourseFrom==""){
                this.$message.error({
                    message:"请选择开始时间！"
                });
				return false;
            }
            if(json.CourseTo==""){
                this.$message.error({
                    message:"请选择结束时间！"
                });
				return false;
            }
            if(json.CourseTo.replace(":","")<=json.CourseFrom.replace(":","")){
                this.$message.error({
                    message:"请选择正确的时间段！"
                });
				return false;
            }
            if(json.Teacher==""){
                this.$message.error({
                    message:"请输入老师姓名！"
                });
				return false;
            }
            let loading = showLoading();
            addOrUpdateCourseTable(json).then((result)=>{
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
                }else if(this.$route.meta.type=="add"){
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"添加成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"添加失败"
                        });
                    }
                }
            })
            // .catch((err)=>{
            //     alertError(this,"2155");
            // });
        },
        getCourseTableSetDetail(){
            let classId,CourseDate,ID;
            if (this.$route.meta.type=="update") { 
                classId = this.$route.params.data.split("&")[0];
                ID = this.$route.params.data.split("&")[1];
                this.entry = 1;
            }else if(this.$route.meta.type=="add"){
                classId = this.$route.params.data.split("&")[0];
                CourseDate = this.$route.params.data.split("&")[1];
                this.entry = -1;
            }
            getCourseTableSetDetail(this.entry,ID,classId).then((result)=>{
                // console.log(result.data)
                let lessonInfo = result.data;
                this.form.CourseDate = lessonInfo.CourseDate?lessonInfo.CourseDate:CourseDate;
                this.form.CourseFrom = lessonInfo.CourseFrom?lessonInfo.CourseFrom:"";
                this.form.CourseTo = lessonInfo.CourseTo?lessonInfo.CourseTo:"";
                this.form.TeacherName = lessonInfo.TeacherName?lessonInfo.TeacherName:"";
                this.form.CourseName = lessonInfo.CourseName?lessonInfo.CourseName:"";
                this.form.PTDCID = lessonInfo.PTDCID?lessonInfo.PTDCID:"";
                // this.form.PTDCText = lessonInfo.PTDCText?lessonInfo.PTDCText:"";
                if (lessonInfo.PTDCID) {
                    this.form.radio = "1";
                    this.getPTDClist();
                }
            })
            // .catch((err)=>{
            //     alertError(this,"1040");
            // });
        },
        getPTDClist(){
            let classId = this.$route.params.data.split("&")[0];
            getPTDClist(classId).then((result)=>{
                this.form.PTDCArr = result.data.data;
            })
            // .catch((err)=>{
            //     alertError(this,"1040");
            // });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.SetScheduleDetail{
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
.interestClassTeacher_label{
    /* color:#c0c4cc; */
    font-weight: lighter;
}
</style>