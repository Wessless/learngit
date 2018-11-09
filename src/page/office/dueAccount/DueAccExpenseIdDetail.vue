<template>
    <div class="dueExpenseIdDetail" @drop="drop($event)" @dragenter="dragenter($event)" @dragleave="dragleave($event)" @dragover="dragover($event)">
        <div class="whiteBg" v-show="showWhite"></div> 
        <input  name="file" type="file" id="uploadDueExpenseFile" multiple="multiple" style="display:none" @change="uploadFile"/>
        <!-- <div class="redColor">*必填</div> -->
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="金额" class="secondBg" style="padding-top:3px;">
                <el-input v-model="form.money" @keyup.native="changeMoney" size="small" style="width:100px;" placeholder="请输入金额"></el-input>
                <label style="color:#606266;margin:0 8px 0 90px;">支付日期</label>
                <el-date-picker
                    style="width:188px;"
                    size="small"
                    v-model="form.payDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :placeholder="'选择日期'">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="凭证号">
                <el-input v-model="form.warrantNumber" size="small" style="width:450px;" placeholder="请输入凭证号"></el-input>
            </el-form-item>
            <el-form-item :label="'银行账号'">
                <el-select v-model="form.repayBankAccount" clearable size="small" style="width:450px;" filterable :placeholder="'请选择银行账号'">
                    <el-option
                        v-for="item in form.bankList"
                        :key="item.BankAccountID"
                        :label="item.BankTitle"
                        :value="item.BankAccountID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="thirdBg">
                <el-button size="mini" type="primary" @click="clickUploadFile" style="margin-bottom:8px;">添加附件</el-button>
                <div v-for="(item,index) in uploadArr" :key="index" class="uploadDiv">
                    <div>
                        <img v-bind:src="item.imgPath">
                        <span class="name" style="margin-left: 10px" :title="item.fileName">{{ item.fileName }}</span>
                        <span class="del"  @click="delFile(item,index)">删除</span>
                    </div>
                </div>
                <div class="uploadImages">
                    <div class="imagediv" @click="borwserImage(item)" v-for="(item,number) in form.images" :key="item.compressImage">
                        <img :src="item.compressImage" alt="">
                        <div class="deleteImgBtn iconfont" @click.stop="deleteImage(item,number)">&#xe69a;</div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="详细说明" class="ReceiveApplyDetail_signatory">
                <el-input v-model="form.remark" size="small" type="textarea" :rows="4" style="width:450px;padding: 4px 0px 7px 0;" placeholder="请输入详细说明"></el-input>
            </el-form-item>
        </el-form>
        <el-dialog
            title="提示"
            :visible.sync="dialogFormVisible"
            width="30%">
            <span>删除后该附件将无法恢复，是否删除该附件</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { addPaymentRecord,deletePaymentChargeAtt,getBankAccount } from '@/js/api'
import { showLoading,closeLoading,alertError,money} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'DueExpenseIdDetail',
    data(){
        return {
            title:"",
            form: {
                money:"",
                remark:"",
                images:[],
                payDate:"",
                bankList:[],
                warrantNumber:"",
                repayBankAccount:"",
            },
            showWhite:false,
            uploadArr:[],//全部数组
            pathArr:[],
            checked2:false,
            currDelFileObj: {},
            dialogFormVisible:false,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=='add'){
            this.title = '添加应付款记账';
            this.getBankAccount();
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
            let staffID = this.userInfo.userStaffID;
            let state = '-1';
            let ChargeBillID = '-1';
            let moneyNum = this.form.money.split(',').join('');
            let note = this.form.remark;
            let belongChargeBillID = this.$route.params.expenseID;
            let payDate = this.form.payDate;
            let repayBankAccount = this.form.repayBankAccount;
            let warrantNumber = this.form.warrantNumber;
            let files = [];
            for (let j = 0; j < this.pathArr.length; j++) {
                if (!this.pathArr[j].ID) {
                    files.push(this.pathArr[j]);
                }
            }
            if (payDate=="") {
                this.$message.error({
                    message:"请选择支付日期"
                });
                return;
            }
            let loading = showLoading();
            addPaymentRecord(state,staffID,ChargeBillID,belongChargeBillID,moneyNum,note,payDate,repayBankAccount,warrantNumber,files).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"添加成功",
                        type:'success'
                    });
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message:result.data.Msg
                    })
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,'2220');
            });
        },
        getBankAccount(){
            let loading = showLoading();
            getBankAccount().then((result)=>{
                closeLoading(loading);
                this.form.bankList = result.data.data;
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,'1164');
            });
        },
        //金额转换
        changeMoney(obj){
            // console.log(obj.target._value)
            let value = this.form.money;
            value = value.replace(/[^\d\.]/g,"").replace(/(\.\d{2}).+$/,"$1").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0");
            // value = value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符  
            // value = value.replace(/^\./g,""); //验证第一个字符是数字而不是  
            // value = value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
            // value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
            // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
            if(value.indexOf(".")< 0 && value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                value= parseFloat(value); 
            } 
            // console.log(value);
            value = money(value)
            this.form.money = value;
        },
        //拖拽添加附件
        drop(e){
            e.preventDefault();
            this.showWhite = false;
            console.log(e)
            this.fileList(e.dataTransfer);
        },
        dragleave(e){
            e.preventDefault();
            this.showWhite = false;
        },
        dragenter(e){
            e.preventDefault();
        },
        dragover(e){
            e.preventDefault();
            this.showWhite = true;
        },
        fileList(fileList) {
            let files = fileList.files;
            for (let i = 0; i < files.length; i++) {
                // 判断是否为文件夹
                console.log(files[i])
                if (files[i].type != '') {
                    this.fileAdd(files[i]);
                } else {
                    // 文件夹处理
                    // this.folders(fileList.items[i]);
                    this.$message.error({
                        message:'无法上传文件夹'
                    })
                }
            }
        },
        foldersAdd(entry) {
            entry.file((file) => {
                this.fileAdd(file);
            })
        },
        fileAdd(file) {
            this.uploadOneFile(file);
        },
        //上传文件
        clickUploadFile(){
            document.getElementById("uploadDueExpenseFile").click();
        },
        uploadFile(e){
            let files = e.target.files;
            for(let i=0;i<files.length;i++){
                this.uploadOneFile(files[i]);
            }
        },
        uploadOneFile(file){
            let obj = {"fileName":"","type":"","imgPath":""}
            obj.fileName = file.name;
            let names = obj.fileName.split(".");
            obj.type = names[names.length-1];
            if(obj.type=="doc" || obj.type=="docx"){
                obj.imgPath = "static/images/doc.png";
            }else if(obj.type=="xlsx" || obj.type=="xls"){
                obj.imgPath = "static/images/xlsx.png";
            }else if(obj.type=="txt"){
                obj.imgPath = "static/images/txt.png";
            }else if(obj.type=="mp3"){
                obj.imgPath = "static/images/mp3.png";
            }else if(obj.type=="mp4"){
                obj.imgPath = "static/images/mp4.png";
            }else if(obj.type=="jpg" || obj.type=="jpeg" || obj.type=="png" || obj.type=="bmp"){
                obj.imgPath = "static/images/pic.png";
            }else if(obj.type=="pdf"){
                obj.imgPath = "static/images/pdf.png";
            }else if(obj.type=="imageText"){
                obj.imgPath = "static/images/imageText.png";
            }else{
                obj.imgPath = "static/images/undefined.png";
            }
            this.uploadArr.push(obj);
            this.pathArr.push(file);
        },
        delFile(item,index){
            if(this.pathArr[index].ID){
                this.currDelFileObj.index = index;
                this.dialogFormVisible = true;
            }else{
                this.uploadArr.splice(index,1);
                this.pathArr.splice(index,1);
            }
        },
        confirmDelete(){
            let index = this.currDelFileObj.index;
            let id = this.pathArr[index].ID;
            deletePaymentChargeAtt(id)
            .then((result)=>{
                if(result.data.Reult=='1'){
                    this.$message({
                        type:"success",
                        message:"删除成功"
                    });
                    this.uploadArr.splice(index,1);
                    this.pathArr.splice(index,1);
                    this.dialogFormVisible = false;
                }else{
                    this.$message.error({
                        message:"删除失败"
                    })
                }
            })
            .catch((err)=>{
                alertError(this,"2210");
            });
        },
        deleteImage(item,index){
            if(!item.isNew){
                this.delImgUrl.push(item.AttachmentPath);
            }
            this.form.images.splice(index,1);
        },
        borwserImage(item){
            this.SET_BROWSERIMG({
                imgPath:item.oldImage
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.dueExpenseIdDetail{
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
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.el-table th, .el-table tr {
    background-color: #38ADFF;
}
.el-table .cell{
    color: #fff;
}
.uploadDiv div{
    display: flex;
    width:600px;
    height: 27px;
    margin-bottom:10px;
}
.uploadDiv div .name{
    margin-left: 10px;
    width: 150px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    line-height: 27px;
}
.uploadDiv div .del{
    margin-left: 10px;
    width: 40px;
    line-height: 27px;
    color:#38ADFF;
    cursor: pointer;
}
.uploadDiv img{  
    width:27px;
    height: 27px;
}
.labeleg{
    text-align: left;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.labeleg[disabled=disabled]{
    color:#c0c4cc;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.firstBg{
    background: rgba(255, 182, 193,0.4);
}
.secondBg{
    background: #FFFACD;
}
.thirdBg{
    background: #dcdcdc;;
}
.whiteBg{
    position: absolute;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, .6);
    left:0;
    top:0;
    z-index: 999;
    min-height: 100%;
    color:#8f8f94;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>