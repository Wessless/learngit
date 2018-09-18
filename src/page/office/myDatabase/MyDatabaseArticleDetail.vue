<template>
    <div class="myDatabaseArticleDetail" @drop="drop($event)" @dragenter="dragenter($event)" @dragleave="dragleave($event)" @dragover="dragover($event)">
        <div class="whiteBg" v-show="showWhite"></div> 
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <input  name="file" type="file" multiple="multiple" id="uploadMyDatabaseFile" style="display:none" @change="uploadFile"/>
        <el-form ref="form" :model="form" label-width="100px" style="width:100%;">
            <el-form-item label="分类">
                <el-input v-model="myDatabase.treeNode.treeNodeName" size="small" :disabled="true" style="width:400px;" placeholder="请输入分类"></el-input>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="form.ArticleTitle" size="small" style="width:400px;" placeholder="请输入标题"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="创建者">
                <el-input v-model="form.CreateUser" size="small" :disabled="true" style="width:400px;" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <el-input v-model="form.ArticleText" size="small" type="textarea" :rows="4" style="width:400px;" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="附件">
                <el-button size="mini" type="primary" @click="clickUploadFile" style="margin-bottom:8px;">添加附件</el-button>
                <div v-for="(item,index) in form.Attachment" :key="index" class="uploadDiv">
                    <div>
                        <img v-bind:src="item.iconPath">
                        <span class="name" style="margin-left: 10px;" :title="item.AttachmentName">{{ item.AttachmentName }}</span>
                        <span class="del"  @click="delFile(item,index)">删除</span>
                    </div>
                </div>
                <div class="uploadImages">
                    <div class="imagediv" @click="borwserImage(item)" v-for="(item,number) in form.images" :key="item.compressImage">
                        <img :src="item.compressImage" alt="">
                        <div class="deleteImgBtn iconfont" @click.stop="deleteImage(item,number)">&#xe69a;</div>
                    </div>
                </div>
                <!-- <div v-for="(item1,index1) in form.images" :key="index1" class="uploadImages">
                    <div class="imagediv" @click="borwserImage(item1)">
                        <img src="static/images/doc.png" alt="">
                        <div class="deleteImgBtn iconfont" @click.stop="deleteImage(item1)">&#xe69a;</div>
                    </div>
                </div> -->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { addKnowledgeArticle,getArticleDetail,addKnowledgeAttachment } from '@/js/api'
import { showLoading,closeLoading,imageCompress,alertError,getExtImagePath} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'MyDatabaseArticleDetail',
    data(){
        return {
            title:"",
            form: {
                ArticleID:"",
                ArticleTitle:"",
                CreateUser:"",
                ArticleText:"",
                Attachment:[],// [{"AttachmentID":"438","AttachmentName":"1111.doc","DataFrom":"1","AttachmentPath":"../../../data/UPLOADFILES/KnowledgeAttachment/MTQwOUNDNjYyNTEwNjNBMA==1111.doc"}]
                images:[],
            },
            delID:[],// 要删除的附件ID，以,分隔
            attachment:[],// PC上上传文件，文件名:路径 以","分隔
            delImgUrl:[],// 要删除的图片路径,以,分隔
            showWhite:false,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="add"){
            this.title = "添加资料";
            this.form.CreateUser = this.userInfo.userName;
        }else if(this.$route.meta.type=="update"){
            this.title = "修改资料";
            this.getArticleDetail();
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs',
            'myDatabase'
        ]),
    },
    watch:{
    },
    methods:{
        ...mapMutations([
            'SET_BROWSERIMG'
        ]),
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
        //文件夹处理
        folders(files) {
            //判断是否为原生file
            if (files.kind) {
                files = files.webkitGetAsEntry();
            }
            files.createReader().readEntries((file) => {
                for (let i = 0; i < file.length; i++) {
                    if (file[i].isFile) {
                        this.foldersAdd(file[i]);
                    } else {
                        this.folders(file[i]);
                    }
                }
            })
        },
        foldersAdd(entry) {
            entry.file((file) => {
                this.fileAdd(file);
            })
        },
        fileAdd(file) {
            this.uploadOneFile(file);
        },
        // 上传文件
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
            if((ext=="jpg" || ext=="jpeg" || ext=="png" || ext=="bmp"|| ext=="gif"|| ext=="ico")&&this.form.images.length>=8){
                this.$message({
                    message: '图片最多选择8张',
                    type: 'error'
                });
                return;
            }
            addKnowledgeAttachment(file).then((result) => {
                console.log(result)
                let path = result.data.Path;
                if(result.data.Result=="1"){
                    if(ext=="jpg" || ext=="jpeg" || ext=="png" || ext=="bmp"|| ext=="gif"|| ext=="ico"){
                        if(this.form.images.length<8){
                            let everyImage = '../../../Data/UPLOADFILES/KnowledgeAttachment/'+path;
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
                    }else{
                        let pathArray = path.split(".");
                        let ext = pathArray[pathArray.length-1];
                        this.form.Attachment.push({
                            AttachmentName:fileName,
                            iconPath:getExtImagePath(ext),
                            isNew:true
                        })
                    }
                    this.attachment.push(fileName+':'+path);
                }else{
                }
            })
            .catch((err)=>{
                alertError(this,"2192");
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
        delFile(item,index){
            console.log(item)
            if(!item.isNew){
                this.delID.push(item.AttachmentID);
            }
            this.form.Attachment.splice(index,1);
        },
        getArticleDetail(){
            let loading = showLoading();
            getArticleDetail(this.$route.params.articleID)
            .then((result)=>{
                let data = result.data;
                this.form.ArticleTitle = data.ArticleTitle;
                this.form.ArticleID = this.$route.params.articleID;
                this.form.CreateUser = data.CreateUser;
                this.form.ArticleText = data.ArticleText;
                // 文件
                let attachment = data.Attachment;
                for(let i=0;i<attachment.length;i++){
                    let pathArray = attachment[i].AttachmentPath.split(".");
                    let ext = pathArray[pathArray.length-1];
                    attachment[i].iconPath = getExtImagePath(ext);
                    attachment[i].isNew = false;
                }
                this.form.Attachment = attachment;
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
                console.log(err)
                alertError(this,"1192");
                closeLoading(loading);
            });
        },
        // 点击确认保存模板
        confirm(){
            // let json = {
            //     id : this.$route.params.ID?this.$route.params.ID:"",
            //     teacherName : this.form.TeacherName,
            //     sex : this.form.TeacherSex,
            //     teacherIdentityNo : this.form.TeacherIdentityNo,
            //     teacherCallNum : this.form.TeacherCallNum,
            //     teacherPhoneNum : this.form.TeacherPhoneNum,
            //     teacherQQ : this.form.TeacherQQ,
            //     teacherEmail : this.form.TeacherEmail,
            //     teacherClass : this.form.TeacherClass,
            //     teacherPayWay : this.form.TeacherPayWay,
            //     teacherPay : this.form.TeacherPay,
            //     remark : this.form.Remark,
            // }
            // // console.log(json)
            // if(json.teacherName==""){
            //     this.$message.error({
            //         message:"请输入姓名！"
            //     });
			// 	return false;
            // }
            // if(json.teacherIdentityNo==""){
            //     this.$message.error({
            //         message:"请输入身份证号！"
            //     });
			// 	return false;
            // }
            // if (json.teacherIdentityNo != "") {
			// 	if (!IdentityCodeValid(json.teacherIdentityNo)) {
            //         this.$message.error({
            //             message:"身份证号格式不正确！"
            //         });
			// 		return false;
			// 	}
            // }
            // if (json.teacherPhoneNum == "") {
            //     this.$message.error({
            //         message:"请输入手机号！"
            //     });
			// 	return false;
			// }
            // if(!PhoneNumValid(json.teacherPhoneNum)){
            //     this.$message.error({
            //         message:"请输入正确手机号！"
            //     });
			// 	return false;
			// }
            // if(json.teacherClass==""){
            //     this.$message.error({
            //         message:"请输入担当课程！"
            //     });
			// 	return false;
            // }
            // if(json.teacherPay==""){
            //     this.$message.error({
            //         message:"请输入收费价格！"
            //     });
			// 	return false;
            // }
            let id = this.form.ArticleID?this.form.ArticleID:"-1";
            let staffID = this.userInfo.userStaffID;
            let staffName = this.userInfo.userName;
            let treeNodeID = this.myDatabase.treeNode.treeNodeID;
            let articleTitle = this.form.ArticleTitle;
            let articleText = this.form.ArticleText;
            let knowledgeBaseID = this.myDatabase.knowledgeID;
            let delID = this.delID.join(',');
            let attachment = this.attachment.join(',');
            let delImgUrl = this.delImgUrl.join(',');
            if(articleTitle==""){
                this.$message.error({
                    message:"请输入标题！"
                });
				return false;
            }
            console.log(id,staffID,staffName,treeNodeID,articleTitle,articleText,knowledgeBaseID,'',delID,attachment,delImgUrl)
            let loading = showLoading();
            addKnowledgeArticle(id,staffID,staffName,treeNodeID,articleTitle,articleText,knowledgeBaseID,'',delID,attachment,delImgUrl).then((result)=>{
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
                closeLoading(loading);
            })
            .catch((err)=>{
                alertError(this,"2155");
                closeLoading(loading);
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.myDatabaseArticleDetail{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
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