<template>
    <div class="SchoolInformDetail">
        <chat-header :fixIndex="10" :showRightBtn="$route.meta.type=='add'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm" :showBack="true" :title="title" :isgoBack="true" :gobackName="'goback'" @goback="goback"></chat-header>
        <div style="width:100%;height:100%;overflow:scroll;">
        <el-form ref="form" :model="form" label-width="100px" style="width:100%;">
            <el-form-item label="日期" v-show="$route.meta.type=='examine'">
                <el-date-picker
                    style="width:400px;"
                    disabled
                    v-model="form.WriteDate"
                    type="date"
                    size="small"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="班级" v-show="$route.meta.type=='add'">
                <el-select v-model="form.classID" @change="getChildsByClassID" size="small" :disabled="disabled" filterable style="width:400px;" placeholder="请选择班级">
                    <el-option
                        v-for="item in form.classArr"
                        :key="item.ID"
                        :label="item.ClassName"
                        :value="item.ID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="幼儿">
                <el-select v-model="form.childID" :disabled="disabled" size="small" style="width:400px;" placeholder="请选择幼儿">
                    <el-option
                        v-for="item in form.childArr"
                        :key="item.Id"
                        :label="item.ChildName"
                        :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="喝水" v-show="$route.meta.type=='add'">
                <div>
                    <el-radio v-model="form.drink" label="1">1</el-radio>
                    <el-radio style="margin-left:40px;" v-model="form.drink" label="2">2</el-radio>
                    <el-radio style="margin-left:40px;" v-model="form.drink" label="3">3</el-radio>
                    <el-radio style="margin-left:40px;" v-model="form.drink" label="4">4</el-radio>
                    <el-radio style="margin-left:40px;" v-model="form.drink" label="5">5</el-radio>
                </div>
                <div style="margin-top:-15px;">
                    <el-radio v-model="form.drink" label="6">6</el-radio>
                    <el-radio style="margin-left:40px;" v-model="form.drink" label="7">7</el-radio>
                    <el-radio style="margin-left:40px;" v-model="form.drink" label="8">8</el-radio>
                    <el-radio style="margin-left:40px;" v-model="form.drink" label="9">9</el-radio>
                    <el-radio style="margin-left:40px;" v-model="form.drink" label="10">10</el-radio>
                </div>
            </el-form-item>

            <el-form-item label="吃饭" v-show="$route.meta.type=='add'">
                <el-radio v-model="form.dinner" label="好">好</el-radio>
                <el-radio style="margin-left:35px;" v-model="form.dinner" label="中">中</el-radio>
                <el-radio style="margin-left:35px;" v-model="form.dinner" label="差">差</el-radio>
            </el-form-item>

            <el-form-item label="睡觉" v-show="$route.meta.type=='add'">
                <el-radio v-model="form.sleep" label="好">好</el-radio>
                <el-radio style="margin-left:35px;" v-model="form.sleep" label="中">中</el-radio>
                <el-radio style="margin-left:35px;" v-model="form.sleep" label="差">差</el-radio>
            </el-form-item>

            <el-form-item label="大便" v-show="$route.meta.type=='add'">
                <el-radio v-model="form.egest" label="有">有</el-radio>
                <el-radio style="margin-left:35px;" v-model="form.egest" label="无">无</el-radio>
            </el-form-item>

            <el-form-item label="小便" v-show="$route.meta.type=='add'">
                <el-radio v-model="form.pee" label="有">有</el-radio>
                <el-radio style="margin-left:35px;" v-model="form.pee" label="无">无</el-radio>
            </el-form-item>

            <el-form-item label="小红花" v-show="$route.meta.type=='add'">
                <div>
                <el-radio v-model="form.redf" label="1">1</el-radio>
                <el-radio style="margin-left:40px;" v-model="form.redf" label="2">2</el-radio>
                <el-radio style="margin-left:40px;" v-model="form.redf" label="3">3</el-radio>
                <el-radio style="margin-left:40px;" v-model="form.redf" label="4">4</el-radio>
                <el-radio style="margin-left:40px;" v-model="form.redf" label="5">5</el-radio>
                </div>
            </el-form-item>

            <el-form-item label="内容" style="margin-top:3px;">
                <el-input v-model="form.Remark" :readonly="disabled" size="small" type="textarea" :rows="rows" style="width:400px;" placeholder="请输入内容"></el-input>
            </el-form-item>
            
            <el-form-item label="图片" style="margin-top:12px;" v-show="form.images.length!='0'">
                <div class="uploadImages">
                    <div class="imagediv" @click="borwserImage(item)" v-for="item in form.images" :key="item.compressImage">
                        <img :src="item.compressImage" alt="">
                    </div>
                </div>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>

import { findEverydayLiveByID,getChildByChildID,getClasses,getChildsByClassID,addOrUpdateMemo } from '@/js/api'
import { showLoading,closeLoading,imageCompress,alertError,getExtImagePath} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'SchoolInformDetail',
    data(){
        return {
            title:"老师的话详情",
            form: {
                WriteDate:"",//发布时间
                ChildID:"",  //幼儿ID
                Remark:"",   //内容
                images:[],
                childID:"",
                childArr:[],
                classID:"",
                classArr:[],
                drink:"",
                dinner:"",
                sleep:"",
                egest:"",
                pee:"",
                redf:"",
                liveDate:""
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
            this.title = "老师的话详情";
            this.findEverydayLiveByID();
        }else if (this.$route.meta.type=="add") {
            this.getClasses();
            this.title = "发布老师的话"
            this.disabled = false;
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs',
        ]),
        rows(){
            if (this.$route.meta.type=="examine") {
                return 13
            }else{
                return 8
            }
        }
    },
    watch:{
    },
    methods:{
        ...mapMutations([
            'SET_BROWSERIMG'
        ]),
        confirm(){
            this.getNowDate();
            let json = {
                childID:this.form.childID,
                liveDate:this.form.liveDate,
                drink:this.form.drink,
                dinner:this.form.dinner,
                sleep:this.form.sleep,
                egest:this.form.egest,
                pee:this.form.pee,
                redf:this.form.redf,
                remark:this.form.Remark,
                staffID:this.userInfo.userStaffID,
            }
            if (this.form.classID=="") {
                this.$message.error({
                    message:"请选择班级"
                });
                return;
            }
            if (this.form.childID=="") {
                this.$message.error({
                    message:"请选择幼儿"
                });
                return;
            }
            console.log(json);
            let loading = showLoading();
            addOrUpdateMemo(json).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=='1'){
                    this.$message({
                        message:"发布成功",
                        type:"success"
                    });
                    this.$emit("showDialog",true,this.form.classID);
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message:"发布失败"
                    });
                }
            })
            .catch((err)=>{
                alertError(this,"2010");
                console.log(err)
                closeLoading(loading);
            });
        },
        goback(){
            // this.$emit("showDialog",true);
            window.history.go(-1);
        },
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
        getClasses(){
            this.form.classArr = [];
            let staffID = this.userInfo.userStaffID;
            getClasses(staffID).then((result)=>{
                this.form.classArr = result.data.data;
            }).catch((err)=>{
                alertError(this,"1002");
            });
        },
        getChildsByClassID(){
            this.form.childID = "";
            this.form.childArr = [];
            let loading = showLoading();
            getChildsByClassID(this.form.classID).then((result)=>{
                closeLoading(loading);
                this.form.childArr = result.data.data;
            }).catch((err)=>{
                alertError(this,"1003");
            });
        },
        getNowDate() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            let currentdate = year + "-" + month;
            this.form.liveDate = currentdate + "-" + strDate;
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