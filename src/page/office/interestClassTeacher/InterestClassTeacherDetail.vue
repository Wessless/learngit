<template>
    <div class="interestClassTeacherDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="姓名">
                <el-input v-model="form.TeacherName" size="small" style="width:400px;" placeholder="请输入姓名"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio v-model="form.TeacherSex" label="0">男</el-radio>
                <el-radio v-model="form.TeacherSex" label="1" style="margin-left:20px;">女</el-radio>
            </el-form-item>
            <el-form-item label="身份证号">
                <el-input v-model="form.TeacherIdentityNo" size="small" style="width:400px;" placeholder="请输入身份证号"></el-input>
            </el-form-item>
            <el-form-item label="座机">
                <el-input v-model="form.TeacherCallNum" size="small" style="width:400px;" placeholder="请输入座机"></el-input>
                <!-- <div class="redColor">*必填</div> -->
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="form.TeacherPhoneNum" size="small" style="width:400px;" placeholder="请输入手机"></el-input>
                <!-- <div class="redColor">*必填</div> -->
            </el-form-item>
            <el-form-item label="QQ">
                <el-input v-model="form.TeacherQQ" size="small" style="width:400px;" placeholder="请输入QQ"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件">
                <el-input v-model="form.TeacherEmail" size="small" style="width:400px;" placeholder="请输入电子邮件"></el-input>
            </el-form-item>
            <el-form-item label="担当课程">
                <el-input v-model="form.TeacherClass" size="small" style="width:400px;" placeholder="请输入担当课程"></el-input>
            </el-form-item>
            <el-form-item label="课时费标准">
                <el-select v-model="form.TeacherPayWay" size="small" style="width:400px;" placeholder="请选择课时费标准">
                    <el-option label="按出勤人次提成" value="1"></el-option>
                    <el-option label="课时包干" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="收费价格">
                <el-input v-model="form.TeacherPay" size="small" style="width:400px;" placeholder="请输入收费价格">
                    <span slot="append">元/节课</span>
                </el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="其他" style="margin-top:10px;">
                <el-input v-model="form.Remark" size="small" type="textarea" :rows="4" style="width:400px;" placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getExternalTeacherByID,addOrUpdateExternalTeacher } from '@/js/api'
import { showLoading,closeLoading,IdentityCodeValid,PhoneNumValid,imageCompress,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'InterestClassTeacherDetail',
    data(){
        return {
            title:"",
            form: {
                TeacherName:"",
                TeacherSex:"0",
                TeacherIdentityNo:"",
                TeacherCallNum:"",
                TeacherPhoneNum:"",
                TeacherQQ:"",
                TeacherEmail:"",
                TeacherClass:"",
                TeacherPayWay:"",
                TeacherPay:"",
                Remark:"",
            },
            
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="add"){
            this.title = "添加教师信息";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改教师信息";
            this.getExternalTeacherByID();
        }
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
                id : this.$route.params.ID?this.$route.params.ID:"",
                teacherName : this.form.TeacherName,
                sex : this.form.TeacherSex,
                teacherIdentityNo : this.form.TeacherIdentityNo,
                teacherCallNum : this.form.TeacherCallNum,
                teacherPhoneNum : this.form.TeacherPhoneNum,
                teacherQQ : this.form.TeacherQQ,
                teacherEmail : this.form.TeacherEmail,
                teacherClass : this.form.TeacherClass,
                teacherPayWay : this.form.TeacherPayWay,
                teacherPay : this.form.TeacherPay,
                remark : this.form.Remark,
            }
            // console.log(json)
            if(json.teacherName==""){
                this.$message.error({
                    message:"请输入姓名！"
                });
				return false;
            }
            if(json.teacherIdentityNo==""){
                this.$message.error({
                    message:"请输入身份证号！"
                });
				return false;
            }
            if (json.teacherIdentityNo != "") {
				if (!IdentityCodeValid(json.teacherIdentityNo)) {
                    this.$message.error({
                        message:"身份证号格式不正确！"
                    });
					return false;
				}
            }
            if (json.teacherPhoneNum == "") {
                this.$message.error({
                    message:"请输入手机号！"
                });
				return false;
			}
            if(!PhoneNumValid(json.teacherPhoneNum)){
                this.$message.error({
                    message:"请输入正确手机号！"
                });
				return false;
			}
            if(json.teacherClass==""){
                this.$message.error({
                    message:"请输入担当课程！"
                });
				return false;
            }
            if(json.teacherPay==""){
                this.$message.error({
                    message:"请输入收费价格！"
                });
				return false;
            }
            let loading = showLoading();
            addOrUpdateExternalTeacher(json).then((result)=>{
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
        getExternalTeacherByID(){
            let ID = this.$route.params.ID;
            getExternalTeacherByID(ID).then((result)=>{
                console.log(result)
                let teacherInfo = result.data;
                this.form.TeacherName = teacherInfo.TeacherName;
                this.form.TeacherSex = teacherInfo.TeacherSex.toString();
                this.form.TeacherIdentityNo = teacherInfo.TeacherIdentityNo;
                this.form.TeacherCallNum = teacherInfo.TeacherCallNum;
                this.form.TeacherPhoneNum = teacherInfo.TeacherPhoneNum;
                this.form.TeacherQQ = teacherInfo.TeacherQQ;
                this.form.TeacherEmail = teacherInfo.TeacherEmail;
                this.form.TeacherClass = teacherInfo.TeacherClass;
                this.form.Remark = teacherInfo.Remark;
                this.form.TeacherPayWay = teacherInfo.TeacherPayWay;
                this.form.TeacherPay = teacherInfo.TeacherPay;
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
.interestClassTeacher_label{
    /* color:#c0c4cc; */
    font-weight: lighter;
}
</style>