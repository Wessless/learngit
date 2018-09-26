<template>
    <div class="SchoolInformDetail">
        <chat-header :showBack="true" :title="title"></chat-header>
        <el-form ref="form" :model="form" label-width="100px" style="width:100%;">
            <el-form-item label="班级">
                <el-select v-model="form.classID" size="small" disabled filterable style="width:400px;" placeholder="请选择班级">
                        <el-option
                            v-for="item in form.classArr"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="发布时间">
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
                <el-input v-model="form.PhotoDescribe" readonly size="small" type="textarea" :rows="6" style="width:400px;" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="图片" style="margin-top:12px;" v-show="form.images.length!='0'">
                <div class="uploadImages">
                    <div class="imagediv" @click="borwserImage(item)" v-for="item in form.images" :key="item.compressImage">
                        <img :src="item.compressImage" alt="">
                        <!-- <div class="deleteImgBtn iconfont" @click.stop="deleteImage(item,number)">&#xe69a;</div> -->
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { findPhotoByID,getAllClasses } from '@/js/api'
import { showLoading,closeLoading,imageCompress,alertError,getExtImagePath} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'SchoolInformDetail',
    data(){
        return {
            title:"班级相册详情",
            form: {
                PromulgateTime:"",//发布时间
                Promulgator:"",   //发布人ID
                PhotoDescribe:"", //通知内容
                images:[],
                classID:"",
                classArr:[],
            },
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        this.getAllClasses();
        this.findPhotoByID();
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
        findPhotoByID(){
            let loading = showLoading();
            findPhotoByID(this.$route.params.noticeID)
            .then((result)=>{
                console.log(result.data);
                let data = result.data;
                this.form.PromulgateTime = data.PromulgateTime;
                this.form.Promulgator = data.Promulgator.toString();
                this.form.classID = data.Flag.toString();
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
        getAllClasses(){
            let classStatus = "-1";
            getAllClasses(classStatus).then((result)=>{
                // console.log(result.data)
                this.form.classArr = result.data.data;
            }).catch((err)=>{
                alertError(this,"1039");
                closeLoading(loading);
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.SchoolInformDetail{
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