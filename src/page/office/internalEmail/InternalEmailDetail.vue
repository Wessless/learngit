<template>
    <div class="InternalEmailDetail" @drop="drop($event)" @dragenter="dragenter($event)" @dragleave="dragleave($event)" @dragover="dragover($event)">
        <!-- <div class="redColor">*必填</div> -->
        <div class="whiteBg" v-show="showWhite"></div> 
        <input  name="file" type="file" id="uploadCloudFile" multiple="multiple" style="display:none" @change="uploadFile"/>
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'发送'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="收件人">
                <el-select v-model="form.Receivers" filterable size="small" style="width:470px;" multiple placeholder="请选择收件人">
                    <el-option
                        v-for="item in form.ReceiversArr"
                        :key="item.StaffName"
                        :label="item.StaffName"
                        :value="item.StaffName">
                    </el-option>
                </el-select>
                <el-button @click="selectAll('Receivers')" type="primary" size="small" style="margin-left:5px;">全选</el-button>
                <el-button @click="selectClear('Receivers')" type="primary" size="small" style="margin-left:5px;">清空</el-button>
            </el-form-item>

            <el-form-item label="抄送人">
                <el-select v-model="form.CCs" filterable size="small" style="width:470px;" multiple placeholder="请选择抄送人">
                    <el-option
                    v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
                <el-button @click="selectAll('CCs')" type="primary" size="small" style="margin-left:5px;">全选</el-button>
                <el-button @click="selectClear('CCs')" type="primary" size="small" style="margin-left:5px;">清空</el-button>
            </el-form-item>

            <el-form-item label="密送人">
                <el-select v-model="form.BCCs" filterable size="small" style="width:470px;" multiple placeholder="请选择密送人">
                    <el-option
                    v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
                <el-button @click="selectAll('BCCs')" type="primary" size="small" style="margin-left:5px;">全选</el-button>
                <el-button @click="selectClear('BCCs')" type="primary" size="small" style="margin-left:5px;">清空</el-button>
            </el-form-item>
            
            <el-form-item label="主题">
                <el-input v-model="form.Title" size="small" style="width:600px;" placeholder="请输入主题"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button size="mini" type="primary" @click="clickUploadFile" style="margin-bottom:8px;">添加附件</el-button>
                <el-checkbox v-model="cbOnlyText" @change="form.content=''" style="margin-left:122px;">仅以纯文本发送</el-checkbox>
                <label style="color:#606266;margin:0 8px 0 30px;">邮件编码</label>
                <el-select v-model="form.EncodingValue" size="small" style="width:170px;" placeholder="请选择邮件编码">
                    <el-option
                    v-for="item in form.EncodingValueArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div v-for="(item,index) in uploadArr" :key="index" class="uploadDiv">
                    <div>
                        <img v-bind:src="item.imgPath">
                        <span class="name" style="margin-left: 10px;" :title="item.fileName">{{ item.fileName }}</span>
                        <span class="del"  @click="delFile(item,index)">删除</span>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="内容" v-if="cbOnlyText">
                <el-input v-model="form.content" size="small" style="width:600px;" type="textarea" rows="5" placeholder="请输入内容"></el-input>
            </el-form-item>

            <div v-if="!cbOnlyText">
                <span class="labelQuill">内容</span>
                <quill-editor 
                    v-model="form.content" 
                    ref="myQuillEditor" 
                    :options="editorOption" >
                </quill-editor>
            </div>
            <!-- @blur="onEditorBlur($event)" @focus="onEditorFocus($event)
                 @change="onEditorChange($event)"" -->
        </el-form>
    </div>
</template>

<script>

import { sendLocalMail,showLocalMailInfo } from '@/js/api'
import { quillEditor } from 'vue-quill-editor'
import { showLoading,closeLoading,imageCompress,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'InternalEmailDetail',
    data(){
        return {
            title:"",
            checkAll:false,
            form: {
                Receivers:[],   //收件人
                ReceiversArr:[],
                CCs:[],
                BCCs:[],
                Title:"",
                MailContent:"",
                content:"",
                EncodingValue:"65001",
                EncodingValueArr:[
                    {value:"65001",label:'Unicode(UTF-8)'},
                    {value:"65002",label:'Unicode(UTF-7)'},
                    {value:"50220",label:'日语(JIS)'},
                    {value:"936",label:'简体中文(GB2312)'},
                ],
                // images:[]
            },
            oldOptions: [],
            cbOnlyText:false,
            showWhite:false,
            uploadArr:[],
            uploadFileArr:[],
            editorOption:{
                theme:'snow',
                modules:{
                    toolbar:[
                        ['bold','italic','underline','strike', 
                        'clean','blockquote','code-block',
                        {'font':[]},{'color':[]},{'background':[]},{'align':[]},
                        { 'size': ['small', 'large', 'huge'] },],        // toggled buttons
                    ]
                },
                placeholder:"请输入内容"
            }
        }
    },
    components:{
        ChatHeader,
        quillEditor
    },
    mounted(){
        this.form.ReceiversArr = this.allStaffs;
        if(this.$route.meta.type=="add"){
            this.title = "写邮件";
        }else{
            if (this.$route.meta.type=="transpond") {
                this.title = "转发邮件";
            }
            if (this.$route.meta.type=="writeback") {
                this.title = "回复邮件";
            }
            if (this.$route.meta.type=="allWriteback") {
                this.title = "回复邮件";
            }
            this.showLocalMailInfo();
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
            // staffId
            // mailAttachmentIDs:附件Id,分割
            // Id：邮件Id，新写不传
            // Receivers
            // CCs
            // BCCs
            // Title               
            // cbOnlyText：1纯文本
            // MailContent：纯文本传
            // FCKeditorBody
            // EncodingValue：编码
            // files：附件
            let json = {
                staffId : this.userInfo.userStaffID,
                mailAttachmentIDs : "",
                Id : this.$route.params.ID?this.$route.params.ID:"",
                Receivers : this.form.Receivers.length!='0'?this.form.Receivers.join(","):"",
                CCs : this.form.CCs.length!='0'?this.form.CCs.join(","):"",
                BCCs : this.form.BCCs.length!='0'?this.form.BCCs.join(","):"",
                Title : this.form.Title,
                cbOnlyText : this.cbOnlyText?'1':'2',
                MailContent : this.cbOnlyText?this.form.content:"",
                FCKeditorBody : this.cbOnlyText?"":this.form.content,
                EncodingValue : this.form.EncodingValue,
            }
            //转发已有文件
            for (let i = 0; i < this.uploadArr.length; i++) {
                if (this.uploadArr[i].ID) {
                    if (i==0) {
                        json.mailAttachmentIDs = '@'+this.uploadArr[i].ID;
                    }else{
                        json.mailAttachmentIDs +=';'+'@'+this.uploadArr[i].ID;
                    }
                }
            }
            //添加新文件
            let files=[];
            for (let j = 0; j < this.uploadFileArr.length; j++) {
                if (!this.uploadFileArr[j].ID) {
                    files.push(this.uploadFileArr[j]);
                }
            }
            console.log(json);
            console.log(files);
            if(json.Receivers==""){
                this.$message.error({
                    message:"请选择收件人！"
                });
				return;
            }
            if(this.form.content==""){
                this.$message.error({
                    message:"请输入内容！"
                });
				return;
            }
            let loading = showLoading();
            sendLocalMail(json,files).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"发送成功",
                        type:"success"
                    });
                    if (this.$route.meta.type=="add") {
                        window.history.go(-1);
                    }else{
                        this.$router.push('/mainpage/office/1/internalEmail');
                    }
                }else{
                    this.$message.error({
                        message:"发送失败"
                    });
                }
            })
            .catch((err)=>{
                alertError(this,"2204");
                closeLoading(loading);
            });
        },
        //加载页面
        showLocalMailInfo(){
            // WriteType:0回复，1回复所有，3已发送邮件，4从收件箱进行转发的邮件，5从已发送邮件进行转发的邮件，6发送失败的邮件
            // staffId
            // Id
            // cosNum
            // ip
            let WriteType,Id;
            let staffId = this.userInfo.userStaffID;
            let cosNum = 'COS'+this.userInfo.cosNum;
            let ip = this.userInfo.currCOSIP.split("//")[1].split(":")[0];
            if (this.$route.meta.type=="transpond") {
                Id = this.$route.params.emailID.split("&")[0];
                if (this.$route.params.emailID.split("&")[1]=='-1') {
                    WriteType = "4";
                }else{
                    WriteType = "5";
                }
            }else if (this.$route.meta.type=="writeback") {
                Id = this.$route.params.emailID;
                WriteType = "0";
            }else if (this.$route.meta.type=="allWriteback") {
                Id = this.$route.params.emailID;
                WriteType = "1";
            }
            let loading = showLoading();
            showLocalMailInfo(WriteType,staffId,Id,cosNum,ip).then((result)=>{
                closeLoading(loading);
                console.log(result.data);
                // Receivers:[],   //收件人
                // CCs:[],
                // BCCs:[],
                // Title:"",
                // MailContent:"",
                // content:"",
                // EncodingValue:"65001",
                // EncodingValueArr:[
                //     {value:"65001",label:'Unicode(UTF-8)'},
                //     {value:"65002",label:'Unicode(UTF-7)'},
                //     {value:"50220",label:'日语(JIS)'},
                //     {value:"936",label:'简体中文(GB2312)'},
                // ],         
                let obj = result.data;
                this.form.Receivers = obj.Receivers!=''?obj.Receivers.split(","):[];
                this.form.Title = obj.Title;
                this.form.EncodingValue = obj.Encoding;
                this.form.content = obj.FCKeditorBody;
                this.cbOnlyText = obj.cbOnlyText;
                if (obj.link) {
                    for (let i = 0; i < obj.link.length; i++) {
                        let obj1 = {"ID":"","fileName":"","type":"","imgPath":"","attachmentSize":"","AttachmentPath":""};
                        let array = obj.link[i].Text.split(".");
                        obj1.type = array[array.length-1];
                        obj1.AttachmentPath = obj.link[i].CommandArgument;
                        if(obj1.type=="doc" || obj1.type=="docx"){
                            obj1.imgPath = "static/images/doc.png";
                        }else if(obj1.type=="xlsx" || obj1.type=="xls"){
                            obj1.imgPath = "static/images/xlsx.png";
                        }else if(obj1.type=="txt"){
                            obj1.imgPath = "static/images/txt.png";
                        }else if(obj1.type=="mp3"){
                            obj1.imgPath = "static/images/mp3.png";
                        }else if(obj1.type=="mp4"){
                            obj1.imgPath = "static/images/mp4.png";
                        }else if(obj.type=="jpg" || obj1.type=="jpeg" || obj1.type=="png" || obj1.type=="bmp"){
                            obj1.imgPath = "static/images/pic.png";
                        }else if(obj.type=="pdf"){
                            obj1.imgPath = "static/images/pdf.png";
                        }else if(obj.type=="imageText"){
                            obj1.imgPath = "static/images/imageText.png";
                        }else{
                            obj1.imgPath = "static/images/undefined.png";
                        }
                        obj1.fileName = obj.link[i].Text;
                        obj1.attachmentSize = obj.link[i].attachmentSize;
                        obj1.ID = obj.link[i].ID;
                        this.uploadArr.push(obj1);
                        this.uploadFileArr.push(obj1);
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"2204");
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
        //点击添加事件
        clickUploadFile(){
            document.getElementById("uploadCloudFile").click();
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
            this.uploadFileArr.push(file);
        },
        delFile(item,index){
            this.uploadArr.splice(index,1);
            this.uploadFileArr.splice(index,1);
        },
        selectAll(type){
            let allValues = [];
            for (let i = 0; i < this.form.ReceiversArr.length; i++) {
                allValues.push(this.form.ReceiversArr[i].StaffName);
            }
            if (type=="Receivers") {
                this.form.Receivers = allValues;
            }else if (type=="CCs") {
                this.form.CCs = allValues;
            }else if (type=="BCCs") {
                this.form.BCCs = allValues;
            }
        },
        selectClear(type){
            if (type=="Receivers") {
                this.form.Receivers = [];
            }else if (type=="CCs") {
                this.form.CCs = [];  
            }else if (type=="BCCs") {
                this.form.BCCs = [];
            }
        }
        // selectAll(val){
        //     let allValues = [];
        //     for (let i = 0; i < this.form.ReceiversArr.length; i++) {
        //         allValues.push(this.form.ReceiversArr[i].StaffName);
        //     }
        //     let oldVal = this.oldOptions.length === 1 ? this.oldOptions[0] : [];
            
        //     if(val.includes("全部")){
        //         this.form.Receivers = allValues;
        //     }
        //     if (oldVal.includes("全部")&&!val.includes("全部")) {
        //         this.form.Receivers = [];
        //     }
        //     if (oldVal.includes("全部")&&val.includes("全部")) {
        //         let index = val.indexOf("全部");
        //         val.splice(index,1);
        //         console.log(val)
        //         this.form.Receivers = val;
        //     }
        //     if (!oldVal.includes("全部")&&!val.includes("全部")) {
        //         if (val.length == allValues.length-1) {
        //             this.form.Receivers = ["全部"].concat(val);
        //         }
        //     }
        //     this.oldOptions[0] = this.form.Receivers;
        // }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.InternalEmailDetail{
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
.uploadDiv div{
    display: flex;
    width:600px;
    height: 27px;
    margin-bottom:10px;
}
.uploadDiv div .name{
    margin-left: 10px;
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
.quill-editor {
    width: 600px;
    height: 250px;
    margin-left: 120px;
    margin-top: 5px;
}
.ql-container{
    height: 80% !important;
}
.labelQuill{
    position: relative;
    top: 0px;
    margin-top: 12px;
    display: block;
    font-weight: bold;
    width: 120px;
    text-align: right;
    float: left;
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.uploadImages{
    display: flex;
    width:280px;
    margin-bottom:10px;
    flex-wrap: wrap;
}
.uploadImages > .imagediv{
    margin-right: 10px;
    margin-bottom: 10px;
    width:60px;
    height: 60px;
    display: inline-block;
    cursor: pointer;
    position: relative;
}
.imagediv > img{
    width: 100%;
    height: 100%;
    position: absolute;
    left:0;
    top:0;
}
.imagediv > .deleteImgBtn{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    background:rgba(0, 0, 0, .3);
    font-size:16px;
    line-height: 20px;
    text-align: center;
    color: #ffffff;
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