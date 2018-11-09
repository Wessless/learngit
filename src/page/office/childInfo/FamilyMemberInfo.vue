<template>
    <div class="templateDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="80px" style="width:100%;">
            <el-form-item label="姓名">
                <el-input v-model="form.ParentName" size="small" style="width:400px;"></el-input>
                <div class="redColor">*必填</div>
                <el-radio v-model="form.Sex" label="0" style="margin-left:20px;">男</el-radio>
                <el-radio v-model="form.Sex" label="1" style="margin-left:20px;">女</el-radio>
            </el-form-item>
            <el-form-item label="关系">
                <el-input v-model="form.Relation" size="small" style="width:400px;"></el-input>
                <div class="redColor">*必填</div>
                <span style="padding-left:15px;color:#999999;">（例如：父亲、母亲）</span>
            </el-form-item>
            <el-form-item label="考勤卡号">
                <el-input v-model="form.CardID" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="头像">
                <div class="avatar" @click="clickUploadFile">
                    <i class="element-icon avatar-uploader-icon"></i>
                    <img :src="imagePath" v-show="imagePath" alt="">
                    <input name="file" type="file" id="familyMemberUploadFile" style="display:none" accept=".png,.jpg,.jpeg" @change="familyMemberFileChange"/>
                </div>
            </el-form-item>
            <el-form-item label="职业">
                <el-input v-model="form.Career" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址">
                <el-input v-model="form.Address" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="证件号码">
                <el-input v-model="form.IdentityCard" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="固定电话">
                <el-input v-model="form.PhoneNum" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="form.MobileNum" size="small" style="width:400px;"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="QQ">
                <el-input v-model="form.QQ" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱">
                <el-input v-model="form.Email" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.Remark"  size="small" style="width:400px;" type="textarea" :rows="4"></el-input>
            </el-form-item>
        </el-form>
        
    </div>
</template>

<script>

import { findParentByID,addOrUpdateParent } from '@/js/api'
import { showLoading,closeLoading,imageCompress,PhoneNumValid,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'FamilyMemberInfo',
    data(){
        return {
            title:"",
            form: {
                ParentName:"",
                Sex:"0",
                Relation:"",
                CardID:"",
                Career:"",
                Address:"",
                IdentityCard:"",
                ImagePath:"",
                PhoneNum:"",
                MobileNum:"",
                QQ:"",
                Email:"",
                Remark:""
            },
            familyMemberFile:null,
            uploadPath:"",
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        // this.loadDetail();
        if(this.$route.meta.type=="add"){
            this.title = "添加家庭成员";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改家庭成员";
            this.findParentByID();
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        imagePath(){
            if(this.uploadPath){
                return this.uploadPath;
            }else if(this.form.ImagePath){
                return this.form.ImagePath.replace("../../../",this.userInfo.currProxy+'/COS'+this.userInfo.cosNum+'/');
            }else{
                return '';
            }
        }
    },
    watch:{
    },
    methods:{
        findParentByID(){
            let ID = this.$route.params.familyMemberID;
            findParentByID(ID).then((result)=>{
                console.log(result)
                // this.form = result.data.data[0];
                let data = result.data.data[0];
                this.form.ParentName = data.ParentName;
                this.form.Sex = data.Sex;
                this.form.Relation = data.Relation;
                this.form.CardID = data.CardID;
                this.form.Career = data.Career;
                this.form.Address = data.Address;
                this.form.IdentityCard = data.IdentityCard;
                this.form.PhoneNum = data.PhoneNum;
                this.form.MobileNum = data.MobileNum;
                this.form.ImagePath = data.ImagePath;
                this.form.QQ = data.QQ;
                this.form.Email = data.Email;
                this.form.Remark = data.Remark;
            }).catch((err)=>{
                alertError(this,"1070");
            });
        },
        familyMemberFileChange(e){
            let file = e.target.files[0];
            this.familyMemberFile = file;
            // this.familyMemberFileName = file.name;
            imageCompress(file,0.5,(base64)=>{
                let base64Image = base64;
                this.uploadPath = base64Image;
            });
        },
        clickUploadFile(){
            document.getElementById("familyMemberUploadFile").click();
        },
        // 点击确认保存模板
        confirm(){
            let id = this.$route.meta.type=="add"?"":this.$route.params.familyMemberID;
            let json = {
                id,
                staffID:this.userInfo.userStaffID,
                childID:this.$route.params.childID,
                parentName:this.form.ParentName,
                sex:this.form.Sex,
                relation:this.form.Relation,
                address:this.form.Address,
                phoneNum:this.form.PhoneNum,
                mobileNum:this.form.MobileNum,
                qq:this.form.QQ,
                career:this.form.Career,
                cardID:this.form.CardID,
                email:this.form.Email,
                remark:this.form.Remark,
                file:this.familyMemberFile,
            }

            if(json.parentName==""){
                this.$message.error({
                    message:"请输入姓名"
                });
                return;
            }
            
            if(json.relation==""){
                this.$message.error({
                    message:"请输入关系"
                });
                return;
            }
            
            if(!PhoneNumValid(json.mobileNum)){
                this.$message.error({
                    message:"请输入正确的手机号码"
                });
                return;
            }
            
            if(json.cardID!=""&&!/^[a-zA-Z0-9]{8,10}$/.test(json.cardID)){
                this.$message.error({
                    message:"考勤卡号为八到十位数"
                });
                return;
            }

            var regEmail=/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/;
            if(json.email!=""&&!regEmail.test(json.email)){
                this.$message.error({
                    message:"请输入正确的邮箱"
                });
                return;
            }
            
            let loading = showLoading();
            addOrUpdateParent(json).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=='1'){
                    this.$message({
                        message:"保存成功",
                        type:"success"
                    });
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message:"保存失败"
                    });
                }
            }).catch((err)=>{
                alertError(this,"2042");
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
/* .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
} */
.element-icon{
    font-family: element-icons!important;
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