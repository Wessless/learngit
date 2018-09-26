<template>
    <div class="templateDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="$route.meta.type!='detail'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirmAdd"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <!-- <el-form-item label="班号">
                <el-input v-model="form.ClassNum" size="small" style="width:400px;" placeholder="" disabled></el-input>
                <div class="redColor">*必填</div>
            </el-form-item> -->
            <el-form-item label="银行名称">
                <el-input v-model="form.BankTitle" size="small" style="width:400px;" placeholder="请输入银行名称"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="账户性质">
                <el-radio v-model="form.AccountNature" label="1" style="margin-left:20px;">基本</el-radio>
                <el-radio v-model="form.AccountNature" label="2" style="margin-left:20px;">一般</el-radio>
                <el-radio v-model="form.AccountNature" label="3" style="margin-left:20px;">个人</el-radio>
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="form.AccountNumber" size="small" style="width:400px;" placeholder="请输入账号"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="开户人姓名">
                <el-input v-model="form.AccountName" size="small" style="width:400px;" placeholder="请输入开户人姓名"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="备注" style="margin-top:10px;">
                <el-input v-model="form.Description" size="small" type="textarea" :rows="4" style="width:400px;" placeholder="请输入备注"></el-input>
            </el-form-item>            
        </el-form>
    </div>
</template>

<script>

import { getBankAccountByID,addOrUpdateBankAccount } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'ClassManagementDetail',
    data(){
        return {
            title:"",
            form: {
                BankTitle:"",
                AccountName:"",
                AccountNumber:"",
                Description:"",
                AccountNature:"1",
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
            this.title = "添加银行账户";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改银行账户";
            this.getBankAccountByID();
        }
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
        getBankAccountByID(){
            let loading = showLoading();
            let bankID = this.$route.params.bankID; 
            getBankAccountByID(bankID).then((result)=>{
                closeLoading(loading);
                let bankInfo = result.data.data[0];
                console.log(bankInfo)
                this.form.AccountName = bankInfo.AccountName;
                this.form.AccountNumber = bankInfo.AccountNumber;
                this.form.BankTitle = bankInfo.BankTitle;
                this.form.Description = bankInfo.Description;
                this.form.AccountNature = bankInfo.AccountNature;
            }).catch((err)=>{
                alertError(this,"1165");
                closeLoading(loading);
                console.log(err)
            });
        },
        confirmAdd(){
            // if(this.$route.meta.type=="add"){
            //     this.dialogVisible = true;
            // }else{
                this.confirm();
            // }
        },
        // 点击确认保存模板
        confirm(){
            let bankAccountID = this.$route.params.bankID?this.$route.params.bankID:"-1";
            
            let bankTitle = this.form.BankTitle;
            let accountName = this.form.AccountName;
            let accountNumber = this.form.AccountNumber;
            let description = this.form.Description;
            let accountNature = this.form.AccountNature;
            let staffName = this.userInfo.userName;

            if(bankTitle.trim()==""){
                this.$message.error({
                    message : "请输入银行名称！"
                });
                return;
            }
            if(accountNumber.trim()==""){
                this.$message.error({
                    message : "请输入银行账号！"
                });
                return;
            }
            if(accountName.trim()==""){
                this.$message.error({
                    message : "请输入开户人姓名！"
                });
                return;
            }

            let type = "";
            if(this.$route.meta.type=="add"){
                type = "添加";
            }else if(this.$route.meta.type=="update"){
                type = "修改";
            }
            let loading = showLoading();
            
            addOrUpdateBankAccount(bankAccountID,staffName,bankTitle,accountNature,accountNumber,accountName,description)
            .then((result)=>{
                console.log(result);
                closeLoading(loading);
                if(result.data.Result==1){
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
                alertError(this,"2103");
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