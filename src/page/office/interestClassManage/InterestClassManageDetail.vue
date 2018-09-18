<template>
    <div class="interestClassTeacherDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="班级名称">
                <el-input v-model="form.ClassName" size="small" style="width:400px;" placeholder="请输入班级名称"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="每节课收费标准">
                <el-input v-model="form.EachClassPay" size="small" style="width:400px;" placeholder="请输入每节课收费标准">
                    <span slot="append">元</span>
                </el-input>
                <!-- <label class="interestClassTeacher_label">元</label> -->
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="课时费标准">
                <el-input v-model="form.EachHourPay" size="small" style="width:400px;" placeholder="请输入每节课课时费标准">
                    <span slot="append">分钟</span>
                </el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="预定任课教师">
                <el-select v-model="form.ExternalTeacherName" size="small" style="width:400px;" placeholder="请选择任课教师">
                    <el-option
                    v-for="item in ExternalTeacherArr"
                    :key="item.ID"
                    :label="item.TeacherName"
                    :value="item.ID">
                    </el-option>
                </el-select>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="预定跟班教师">
                <el-select v-model="form.TeacherName" multiple size="small" placeholder="请选择跟班教师" style="width:400px;" >
                    <el-option
                    v-for="item in allStaffs"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                    </el-option>
                </el-select>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="开始日期">
                <el-date-picker
                    v-model="form.BeginDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    size="small"
                    placeholder="请选择添加日期"
                    style="width:400px;">
                </el-date-picker>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="兴趣班类型">
                <el-radio v-model="form.kindOfClass" label="0">标准兴趣班</el-radio>
                <el-radio v-model="form.kindOfClass" label="1" style="margin-left:20px;">拼图道场</el-radio>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getIClassByID,getAllExternalTeacher,addOrUpdateIClass } from '@/js/api'
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
                ExternalTeacherName:"",
                TeacherName:[],
                EachClassPay:"",
                EachHourPay:"",
                BeginDate:"",
                SpecialClass:"",
                EndFlag:"",
                kindOfClass:"",
            },
            ExternalTeacherArr:[],
            pageNo:1,
            pageSize:1000,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="add"){
            this.title = "添加兴趣班信息";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改兴趣班信息";
            this.getIClassByID();
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
                id : this.$route.params.classID?this.$route.params.classID:"",
                className : this.form.ClassName,
                eachClassPay : this.form.EachClassPay,
                eachHourPay : this.form.EachHourPay,
                externalTeacher : this.form.ExternalTeacherName,
                teacher : this.form.TeacherName.join(),
                endFlag : this.form.EndFlag?this.form.EndFlag:"0",
                beginDate : this.form.BeginDate.split(" ")[0],
                endDate : "",
                isPTDC : this.form.kindOfClass,
            }
            console.log(json);
            // console.log(this.form.TeacherName);
            if(json.className==""){
                this.$message.error({
                    message:"请选择班级名称！"
                });
				return false;
            }
            if(json.eachClassPay==""){
                this.$message.error({
                    message:"请输入每节课收费标准！"
                });
				return false;
            }
            if(json.eachHourPay==""){
                this.$message.error({
                    message:"请输入课时费标准！"
                });
				return false;
            }
            if(json.externalTeacher==""){
                this.$message.error({
                    message:"请选择预定任课老师！"
                });
				return false;
            }
            if(json.beginDate==""){
                this.$message.error({
                    message:"请选择开始日期！"
                });
				return false;
            }
            if(json.isPTDC==""){
                this.$message.error({
                    message:"请选择兴趣班类型！"
                });
				return false;
            }
            let loading = showLoading();
            addOrUpdateIClass(json).then((result)=>{
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
        getIClassByID(){
            let classID = this.$route.params.classID;
            let Loading = showLoading();
            getIClassByID(classID).then((result)=>{
                let classInfo = result.data;
                this.form.ClassName = classInfo.ClassName;    
                this.form.EachClassPay = classInfo.EachClassPay;    
                this.form.EachHourPay = classInfo.EachHourPay;    
                this.form.ExternalTeacherName = classInfo.ExternalTeacherID;    
                this.form.TeacherName = classInfo.TeacherID!="-1"?classInfo.TeacherID.split(","):[];    
                this.form.ExternalTeacherID = classInfo.ExternalTeacherID;    
                this.form.TeacherID = classInfo.TeacherID;    
                this.form.BeginDate = classInfo.BeginDate;    
                this.form.SpecialClass = classInfo.SpecialClass; 
                if(this.form.SpecialClass=="PTDC"){
                    this.form.kindOfClass = "1";
                }else{
                    this.form.kindOfClass = "0";
                }
                this.form.EndFlag = classInfo.EndFlag; 
                closeLoading(Loading);
            })
            // .catch((err)=>{
            //     alertError(this,"1040");
            // });
        },
        getAllExternalTeacher(){
            getAllExternalTeacher(this.pageNo,this.pageSize).then((result)=>{
                this.ExternalTeacherArr = result.data.data; 
            })
        },
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