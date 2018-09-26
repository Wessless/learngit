<template>
    <div class="dueExpenseIdDetail" @drop="drop($event)" @dragenter="dragenter($event)" @dragleave="dragleave($event)" @dragover="dragover($event)">
        <div class="whiteBg" v-show="showWhite"></div> 
        <input  name="file" type="file" id="uploadDueExpenseFile" multiple="multiple" style="display:none" @change="uploadFile"/>
        <!-- <div class="redColor">*必填</div> -->
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="金额" class="secondBg" style="padding-top:3px;">
                <el-input v-model="form.money" @keyup.native="changeMoney" size="small" style="width:100px;" placeholder="请输入金额"></el-input>
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
                <el-input v-model="form.remark" size="small" type="textarea" :rows="4" style="width:600px;padding: 4px 0px 7px 0;" placeholder="请输入详细说明"></el-input>
            </el-form-item>
            <el-form-item label="签字负责人">
                <label class="labeleg" :disabled="true">{{form.FinanceSignManagerName}}</label>
                <label class="labeleg" :disabled="true">{{form.FinanceSignManagerName2}}</label>
                <label class="labeleg" :disabled="true">{{form.FinanceSignManagerName3}}</label>
            </el-form-item>
            <el-form-item label="追加签字人" style="transform:translateY(-8px);">
                <el-select v-model="form.sidAdditionalSigner1" filterable size="small" style="width:220px;" placeholder="请选择追加签字人">
                    <el-option
                        v-for="item in form.plusSignManagerNameArr"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
                <el-select v-model="form.sidAdditionalSigner2" filterable size="small" style="width:220px;margin-left:34px;" placeholder="请选择追加签字人">
                    <el-option
                        v-for="item in form.plusSignManagerNameArr"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
                <el-checkbox v-model="checked2" style="margin-left:10px;" @change="changePlusSignManagerName">显示离职员工</el-checkbox>
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

import { findAllRetiredStaffs,addOrUpdatePaymentChargeDetail,paymentChargeDetailForm,deletePaymentChargeAtt } from '@/js/api'
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
                approvalUser:"",
                ccUser:"",
                FinanceSignManager:"",
                FinanceSignManager2:"",
                FinanceSignManager3:"",
                FinanceSignManagerName:"",
                FinanceSignManagerName2:"",
                FinanceSignManagerName3:"",
                plusSignManagerNameArr:[],
                sidAdditionalSigner1:"",
                sidAdditionalSigner2:"",
                images:[],
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
            this.title = '添加应付款';
        }
        if(this.$route.meta.type=='update'){
            this.title = '修改应付款';
            this.loadDetail();
        }
        this.getFinanceSignManagerName();
        this.form.plusSignManagerNameArr = this.findAllstaffs;
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        findAllstaffs(){
            let staffs = [];
            for(let i=0;i<this.allStaffs.length;i++){
                let json = {  
                    StaffID:this.allStaffs[i].StaffID,
                    StaffName:this.allStaffs[i].StaffName
                }
                staffs.push(json);
            }
            return staffs;
        },
    },
    watch:{
    },
    methods:{
        // 点击确认保存模板
        confirm(){
            console.log("confirm")
            let staffID = this.userInfo.userStaffID;
            let state = '-1';
            let ChargeBillID = '-1';
            if(this.$route.meta.type=='update'){
                state = '1';
                ChargeBillID = this.$route.params.dueID;
            }
            let signers = '';
            if(this.form.FinanceSignManager){
                signers += this.form.FinanceSignManager;
            }
            if(this.form.FinanceSignManager2&&this.form.FinanceSignManager2!='-1'){
                signers += ',' + this.form.FinanceSignManager2;
            }
            if(this.form.FinanceSignManager3&&this.form.FinanceSignManager3!='-1'){
                signers += ',' + this.form.FinanceSignManager3;
            }
            let moneyNum = this.form.money.split(',').join('');
            let examineID = this.$route.params.examineID?this.$route.params.examineID:'';
            let note = this.form.remark;
            let expenseID = this.$route.params.expenseID;
            let signer1 = this.form.sidAdditionalSigner1?this.form.sidAdditionalSigner1:'-1';
            let signer2 = this.form.sidAdditionalSigner2?this.form.sidAdditionalSigner2:'-1';
            let files = [];
            for (let j = 0; j < this.pathArr.length; j++) {
                if (!this.pathArr[j].ID) {
                    files.push(this.pathArr[j]);
                }
            }
            addOrUpdatePaymentChargeDetail(state,staffID,ChargeBillID,expenseID,moneyNum,signer1,signer2,signers,note,examineID,files).then((result)=>{
                let type = '';
                if(this.$route.meta.type=='add'){
                    type = '添加'
                }
                if(this.$route.meta.type=='update'){
                    type = '修改'
                }
                if(result.data.Result=='1'||result.data.Result=='2'){
                    this.$message({
                        message:type+"成功",
                        type:'success'
                    });
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message:result.data.Msg
                    })
                }
            }).catch((err)=>{
                alertError(this,'2209');
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
        //显示离线员工
        changePlusSignManagerName(){
            if(this.checked2){
                this.findAllRetiredStaffs();
            }else{
                this.form.plusSignManagerNameArr = this.findAllstaffs;
            }
        },
        //离线员工列表
        findAllRetiredStaffs(){
            let AllRetiredStaffsArr = [];
            findAllRetiredStaffs().then((result)=>{
                if(result){
                    if(result.data.data.length>0){
                        for(let i=0;i<result.data.data.length;i++){
                            let json = {
                                StaffID:result.data.data[i].StaffID,
                                StaffName:result.data.data[i].StaffName
                            }
                            AllRetiredStaffsArr.push(json);
                        }
                        this.form.plusSignManagerNameArr = this.form.plusSignManagerNameArr.concat(AllRetiredStaffsArr);
                    }
                }
            }).catch((err)=>{
                alertError(this,"1053");
            });
        },
        //获得审批人
        getFinanceSignManagerName(){
            let staffID = this.userInfo.userStaffID;
            for (let i = 0; i < this.allStaffs.length; i++) {
                if (staffID == this.allStaffs[i].StaffID) {
                    this.form.FinanceSignManager = this.allStaffs[i].FinanceSignManager;
                    this.form.FinanceSignManager2 = this.allStaffs[i].FinanceSignManager2;
                    this.form.FinanceSignManager3 = this.allStaffs[i].FinanceSignManager3;
                }
            }
            for (let i = 0; i < this.allStaffs.length; i++) {
                if (this.form.FinanceSignManager == this.allStaffs[i].StaffID) {
                    this.form.FinanceSignManagerName = this.allStaffs[i].StaffName;
                    continue;
                }else if (this.form.FinanceSignManager2 == this.allStaffs[i].StaffID) {
                    this.form.FinanceSignManagerName2 = this.allStaffs[i].StaffName; 
                    continue;
                }else if (this.form.FinanceSignManager3 == this.allStaffs[i].StaffID) {
                    this.form.FinanceSignManagerName3 = this.allStaffs[i].StaffName;
                    continue;
                }
            }
        },
        loadDetail(){
            let cosNum = this.userInfo.cosNum;
            console.log(this.$route.params)
            let loading = showLoading();
            paymentChargeDetailForm('Modify',this.$route.params.staffID,this.$route.params.dueID,this.$route.params.expenseID).then((result)=>{
                closeLoading(loading);
                let obj = result.data;
                // this.detail.ApplyName = obj.fillStaffName;
                this.form.money = money(obj.Money);
                this.form.remark = obj.Note;
                this.form.sidAdditionalSigner1 = obj.Signer1Value&&obj.Signer1Value!='-1'?obj.Signer1Value:'';
                this.form.sidAdditionalSigner2 = obj.Signer2Value&&obj.Signer2Value!='-1'?obj.Signer2Value:'';
                // this.detail.link = obj.link;
                // this.detail.approvalArr = [];
                for(let i=0;i<obj.link.length;i++){
                    let object = {"fileName":"","type":"","imgPath":""};
                    console.log(obj.link[0])
                    object.fileName = obj.link[i].FileName;
                    
                    let names = object.fileName.split(".");
                    object.type = names[names.length-1];
                    if(object.type=="doc" || object.type=="docx"){
                        object.imgPath = "static/images/doc.png";
                    }else if(object.type=="xlsx" || object.type=="xls"){
                        object.imgPath = "static/images/xlsx.png";
                    }else if(object.type=="txt"){
                        object.imgPath = "static/images/txt.png";
                    }else if(object.type=="mp3"){
                        object.imgPath = "static/images/mp3.png";
                    }else if(object.type=="mp4"){
                        object.imgPath = "static/images/mp4.png";
                    }else if(object.type=="jpg" || object.type=="jpeg" || object.type=="png" || object.type=="bmp"){
                        object.imgPath = "static/images/pic.png";
                    }else if(object.type=="pdf"){
                        object.imgPath = "static/images/pdf.png";
                    }else if(object.type=="imageText"){
                        object.imgPath = "static/images/imageText.png";
                    }else{
                        object.imgPath = "static/images/undefined.png";
                    }
                    object.ID = obj.link[i].FinanceAttachmentID;
                    this.uploadArr.push(object);
                    this.pathArr.push(object);
                }
            })
            .catch((err)=>{
                console.log(err)
                alertError(this,"1089");
                closeLoading(loading);
            });
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