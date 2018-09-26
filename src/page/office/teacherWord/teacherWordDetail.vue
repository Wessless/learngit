<template>
    <div class="SchoolInformDetail">
        <chat-header :showBack="true" :title="title"></chat-header>
        <el-form ref="form" :model="form" label-width="100px" style="width:100%;">
            <el-form-item label="日期">
                <el-date-picker
                    style="width:400px;"
                    disabled
                    v-model="form.WriteDate"
                    type="date"
                    size="small"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="幼儿">
                <el-select v-model="form.childID" disabled size="small" style="width:400px;" placeholder="请选择幼儿">
                    <el-option
                        v-for="item in form.childArr"
                        :key="item.Id"
                        :label="item.ChildName"
                        :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="内容" style="margin-top:3px;">
                <el-input v-model="form.Remark" readonly size="small" type="textarea" :rows="6" style="width:400px;" placeholder="请输入内容"></el-input>
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

import { findEverydayLiveByID,getChildByChildID } from '@/js/api'
import { showLoading,closeLoading,imageCompress,alertError,getExtImagePath} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'SchoolInformDetail',
    data(){
        return {
            title:"园所相册详情",
            form: {
                WriteDate:"",//发布时间
                ChildID:"",  //幼儿ID
                Remark:"",   //内容
                images:[],
                childID:"",
                childArr:[],
            },
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        this.findEverydayLiveByID();
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
        findEverydayLiveByID(){
            let loading = showLoading();
            findEverydayLiveByID(this.$route.params.wordID)
            .then((result)=>{
                console.log(result.data);
                let data = result.data;
                this.form.WriteDate = data.WriteDate.split(" ")[0];
                this.form.ChildID = data.ChildID.toString();
                this.form.Remark = data.Remark;
                this.getChildByChildID(this.form.ChildID);
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
                alertError(this,"1325");
                closeLoading(loading);
            });
        },
        borwserImage(item){
            this.SET_BROWSERIMG({
                imgPath:item.oldImage
            });
        },
        getChildByChildID(childID){
            getChildByChildID(childID).then((result)=>{
                this.form.childArr = result.data.data;
                this.form.childID = childID;
            }).catch((err)=>{
                alertError(this,"1040");
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