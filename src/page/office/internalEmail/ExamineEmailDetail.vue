<template>
    <div class="InternalEmailDetail">
        <!-- <div class="redColor">*必填</div> -->
        <chat-header :showBack="true" :title="title"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item :label="flag=='-2'?'邮件编码':''" :style="{margin:flag=='-2'?'':'0 0 7px 0'}" >
                <div style="width:600px;">
                    <el-select v-model="form.EncodingValue" v-show="flag=='-2'" disabled size="small" style="width:170px;" placeholder="请选择邮件编码">
                        <el-option
                        v-for="item in form.EncodingValueArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-checkbox v-model="form.cbOnlyText" v-show="flag=='-2'" disabled @change="form.content=''" style="margin-left:10px;">仅以纯文本发送</el-checkbox>
                    <el-button type="primary" size="small" @click="transpondEmail" style="float:right;margin-top:4px;" >转发</el-button>
                    <el-button type="primary" v-show="flag!='-2'" size="small" @click="allWritebackEmail" style="float:right;margin-top:4px;margin-right:10px;" >全部回复</el-button>            
                    <el-button type="primary" v-show="flag!='-2'" size="small" @click="writebackEmail" style="float:right;margin-top:4px;" >回复</el-button>
                </div>   
            </el-form-item>

            <el-form-item label="收件人" v-show="flag=='-2'">
                <el-select v-model="form.Receivers" disabled size="small" style="width:600px;" multiple placeholder="请选择收件人">
                    <el-option
                    v-for="item in allStaffs"
                        :key="item.StaffName"
                        :label="item.StaffName"
                        :value="item.StaffName">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发件人" v-show="flag!='-2'">
                <el-input v-model="form.Sender" disabled size="small" style="width:600px;" placeholder="请输入发件人"></el-input>
            </el-form-item>
            
            <el-form-item label="主题">
                <el-input v-model="form.Title" disabled size="small" style="width:600px;" placeholder="请输入主题"></el-input>
            </el-form-item>

            <el-form-item label="附件" v-if="uploadArr.length!='0'">
                <div v-for="(item,index) in uploadArr" :key="index" class="uploadDiv">
                    <div>
                        <img v-bind:src="item.imgPath">
                        <span class="name" style="margin-left: 10px;" :title="item.fileName">{{ item.fileName }}</span>
                        <span class="del"  @click="examineFile(item)">下载</span>
                    </div>
                </div>
            </el-form-item>
            
            <el-form-item label="内容" v-if="form.cbOnlyText&&flag=='-2'">
                <el-input v-model="form.content" size="small" style="width:600px;" type="textarea" rows="5" placeholder="请输入内容"></el-input>
            </el-form-item>

            <div v-if="!form.cbOnlyText||flag=='-1'">
                <span class="labelQuill">内容</span>
                <quill-editor 
                    style="width:600px;"
                    v-model="form.content" 
                    ref="myQuillEditor" 
                    disabled
                    :options="editorOption" >
                </quill-editor>
            </div>
        </el-form>
    </div>
</template>

<script>

import { readLocalMail,showLocalMailInfo,downloadFile } from '@/js/api'
import { quillEditor } from 'vue-quill-editor'
import { showLoading,closeLoading,imageCompress,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'InternalEmailDetail',
    data(){
        return {
            title:"读邮件",
            form:{
                Sender:"",
                Receivers:[],
                Title:"",
                content:"",
                EncodingValue:"65001",
                EncodingValueArr:[
                    {value:"65001",label:'Unicode(UTF-8)'},
                    {value:"65002",label:'Unicode(UTF-7)'},
                    {value:"50220",label:'日语(JIS)'},
                    {value:"936",label:'简体中文(GB2312)'},
                ],
                cbOnlyText:false,
            },
            emailID:"",
            flag:"",
            uploadArr:[],
            editorOption:{
                modules:{
                    toolbar:[
                        ['bold','italic','underline','strike', 
                        'clean','blockquote','code-block',
                        {'font':[]},{'color':[]},{'background':[]},{'align':[]},
                        { 'size': ['small', 'large', 'huge'] },],        // toggled buttons
                    ]
                },
                placeholder:"请输入内容"
            },
        }
    },
    components:{
        ChatHeader,
        quillEditor
    },
    mounted(){
        this.flag = this.$route.params.emailID.split("&")[1];
        this.loadEmail();
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
        loadEmail(){
            let staffID = this.userInfo.userStaffID;
            this.emailID = this.$route.params.emailID.split("&")[0];
            let cosNum = 'COS'+this.userInfo.cosNum;
            let ip = this.userInfo.currCOSIP.split("//")[1].split(":")[0];
            let loading = showLoading();
            if (this.flag=='-1') {
                readLocalMail(staffID,this.emailID,cosNum,ip).then((result)=>{
                    closeLoading(loading);
                    let obj = result.data;
                    this.form.Receivers = obj.Receivers.split(",");
                    this.form.Sender = obj.Sender;
                    this.form.Title = obj.Title;
                    this.form.content = obj.MailContent;
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
                    }
                    console.log(obj)
                }).catch((err)=>{
                    alertError(this,"1314");
                    closeLoading(loading)
                });
            }
            if (this.flag=='-2') {
                showLocalMailInfo(3,staffID,this.emailID,cosNum,ip).then((result)=>{
                    closeLoading(loading);
                    let obj = result.data;
                    this.form.Receivers = obj.Receivers.split(",");
                    this.form.Sender = obj.Sender;
                    this.form.Title = obj.Title;
                    this.form.content = obj.FCKeditorBody;
                    this.form.cbOnlyText = obj.cbOnlyText;
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
                    }
                }).catch((err)=>{
                    alertError(this,"1315");
                });
            }
        },
        examineFile(item){
            console.log(item.AttachmentPath);
            // return
            let url = item.AttachmentPath.replace("../../../",this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
            downloadFile(url).then((result)=>{
                const content = result.data;
                console.log("downloadFile");
                console.log(result);
                const blob = new Blob([content]);
                const fileName = item.fileName;
                if ('download' in document.createElement('a')) { // 非IE下载
                    const elink = document.createElement('a');
                    elink.download = fileName;
                    elink.style.display = 'none';
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                } else { // IE10+下载
                    navigator.msSaveBlob(blob, fileName)
                }
            }).catch(()=>{
                console.log("error")
            });
        },
        transpondEmail(){
            this.$router.push('/mainpage/office/1/internalEmail'+"/transpond/"+this.emailID+'&'+this.flag);
        },
        writebackEmail(){
            this.$router.push('/mainpage/office/1/internalEmail'+"/writeback/"+this.emailID);
        },
        allWritebackEmail(){
            this.$router.push('/mainpage/office/1/internalEmail'+"/allWriteback/"+this.emailID);
        },
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
.uploadDiv{
    margin-top: 5px;
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