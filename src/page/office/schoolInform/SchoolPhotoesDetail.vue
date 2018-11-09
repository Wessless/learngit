<template>
    <div class="SchoolPhotoesDetail" @drop="drop($event)" @dragenter="dragenter($event)" @dragleave="dragleave($event)" @dragover="dragover($event)">
        <chat-header :fixIndex="10" :showRightBtn="$route.meta.type=='add'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm" :showBack="true" :title="title" :isgoBack="true" :gobackName="'goback'" @goback="goback"></chat-header>
        <div class="whiteBg" v-show="showWhite"></div>
        <input  name="file" type="file" multiple="multiple" id="uploadMyDatabaseFile" style="display:none" @change="uploadFile"/>
        <div style="width:100%;height:100%;overflow:scroll;">
        <el-form ref="form" :model="form" label-width="100px" style="width:100%;">
            <el-form-item label="发布时间" v-show="$route.meta.type=='examine'">
                <el-date-picker
                    style="width:400px;"
                    disabled
                    size="small"
                    v-model="form.PromulgateTime"
                    type="datetime"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="发布人">
                <el-select v-model="form.Promulgator" disabled size="small" style="width:400px;" placeholder="请选择发布人">
                    <el-option
                        v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通知内容" style="margin-top:3px;">
                <el-input v-model="form.PhotoDescribe" :readonly="disabled" size="small" type="textarea" :rows="12" style="width:400px;" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="图片" :style="{margin:$route.meta.type!='add'?'12px 0 0 0':'3px 0 0 0'}" v-show="form.images.length!='0'||$route.meta.type=='add'">
                <el-button size="mini" type="primary" v-show="$route.meta.type=='add'" @click="clickUploadFile" style="margin-bottom:8px;">添加图片</el-button>
                <div class="uploadImages">
                    <div class="imagediv" @click="borwserImage(item)" v-for="(item,index) in form.images" :key="item.compressImage">
                        <img :src="item.compressImage" alt="">
                        <div class="deleteImgBtn iconfont" v-show="$route.meta.type=='add'" @click.stop="deleteImage(item,index)">&#xe69a;</div>
                    </div>
                </div>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>

import { findPhotoByID,addPhoto } from '@/js/api'
import { showLoading,closeLoading,imageCompress,alertError,getExtImagePath} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'SchoolPhotoesDetail',
    data(){
        return {
            title:"园所相册详情",
            form: {
                PromulgateTime:"",//发布时间
                Promulgator:"",   //发布人ID
                PhotoDescribe:"", //通知内容
                images:[],
            },
            disabled:true,
            showWhite:false,
            photofaceList:[],
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if (this.$route.meta.type=="examine") {
            this.title = "园所相册详情";
            this.findPhotoByID();
        }else if (this.$route.meta.type=="add") {
            this.title = "发布园所相册"
            this.form.Promulgator = this.userInfo.userStaffID;
            this.disabled = false;
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs',
        ]),
    },
    watch:{
    },
    methods:{
        ...mapMutations([
            'SET_BROWSERIMG'
        ]),
        confirm(){
            // staffID,
            // classID,
            // content,
            // type
            let json = {
                staffID:this.form.Promulgator,
                classID:"0",
                content:this.form.PhotoDescribe,
                flag:"0"
            }
            if(json.staffID==""){
                this.$message.error({
                    message:"请选择发布人"
                });
                return;
            }
            let photofaceList = this.photofaceList;
            if(photofaceList.length=="0"){
                this.$message.error({
                    message:"请至少选择一张图片"
                });
                return;
            }
            let loading = showLoading();
            addPhoto(json,photofaceList).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=='1'){
                    this.$message({
                        message:"发布成功",
                        type:"success"
                    });
                    this.$emit("showDialog",true);
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message:"发布失败"
                    });
                }
            })
            .catch((err)=>{
                alertError(this,"2004");
                closeLoading(loading);
            });
        },
        goback(){
            window.history.go(-1);
        },
        findPhotoByID(){
            let loading = showLoading();
            findPhotoByID(this.$route.params.noticeID)
            .then((result)=>{
                console.log(result.data);
                let data = result.data;
                this.form.PromulgateTime = data.PromulgateTime;
                this.form.Promulgator = data.Promulgator.toString();
                this.form.PhotoDescribe = data.PhotoDescribe;
                // 图片
                let images = [];
                let everyImage = '';
                if(data.Img1){
                    everyImage = data.Img1;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(data.Img2){
                    everyImage = data.Img2;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(data.Img3){
                    everyImage = data.Img3;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(data.Img4){
                    everyImage = data.Img4;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(data.Img5){
                    everyImage = data.Img5;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(data.Img6){
                    everyImage = data.Img6;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(data.Img7){
                    everyImage = data.Img7;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(data.Img8){
                    everyImage = data.Img8;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                this.form.images = images;
                closeLoading(loading);
            })
            .catch((err)=>{
                alertError(this,"1324");
                closeLoading(loading);
            });
        },
        borwserImage(item){
            this.SET_BROWSERIMG({
                imgPath:item.oldImage
            });
        },
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
        clickUploadFile(){
            document.getElementById("uploadMyDatabaseFile").click();
        },
        uploadFile(e){
            let files = e.target.files;
            for(let i=0;i<files.length;i++){
                this.uploadOneFile(files[i]);
            }
        },
        uploadOneFile(file){
            let names = file.name.split(".");
            let fileName = file.name;
            let ext = names[names.length-1];
            if(ext=="jpg" || ext=="jpeg" || ext=="png" || ext=="bmp"|| ext=="gif"|| ext=="ico"){
                if((ext=="jpg" || ext=="jpeg" || ext=="png" || ext=="bmp"|| ext=="gif"|| ext=="ico")&&this.form.images.length>=8){
                    this.$message({
                        message: '图片最多选择8张',
                        type: 'error'
                    });
                    return;
                }
                this.photofaceList.push(file);
            }else{
                this.$message({
                    message: '图片格式错误',
                    type: 'error'
                });
                return;
            }
            imageCompress(file,0.5,(base64)=>{
                let base64Image = base64;
                let path = base64Image;
                if(this.form.images.length<8){
                    let everyImage = path;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    this.form.images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:true
                    });
                }
            })
        },
        deleteImage(item,index){
            if(!item.isNew){
                this.delImgUrl.push(item.AttachmentPath);
            }
            this.form.images.splice(index,1);
            this.photofaceList.splice(index,1);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.SchoolPhotoesDetail{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    /* max-height: 100%; */
    background: #fafafa;
    padding-top:54px;
    position: relative;
    height: 100vh;
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