<template>
    <div class="main" @click="trueFlag">
        <!-- 预览图片 -->
        <el-dialog :visible.sync="browserImg.imgPath!=''" :fullscreen="true" :show-close="true">
            <div class="browser" @click="hideBrowserImg">
                <div class="browserImg">
                    <img class="browserImg" :style="browserImg.styleObject" :src="browserImg.imgPath" alt="">
                    <div class="downloadQRCode" v-if="browserImg.download">
                        <div @click.stop="download(browserImg.download.url)">{{browserImg.download.text}}</div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 预览多个二维码 -->
        <el-dialog :visible.sync="showKindgardenQRCodeDialog" :fullscreen="true" :show-close="true">
            <div class="qrcode" @click="showKindgardenQRCodeDialog = false">
                <div class="qrcodeImage" v-for="(item,index) in qrcodeArr" :key="index">
                    <img class="qrcodeImageDom" :src="item.url" alt="">
                    <div class="kindgardenQRCode">
                        <div>{{ item.name }}</div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 预览员工信息 -->
        <el-dialog :visible.sync="showCurrUserInfo" :fullscreen="true" :show-close="true">
            <div class="staffInfo">
                <div class="staffInfoBlock">
                    <div class="deleteBtn iconfont" @click="showCurrUserInfo = false">&#xe69a;</div>
                    <div class="staffImage">
                        <input  name="file" type="file" id="uploadSelfStaffImage" style="display:none" accept="image/png,image/gif,image/jpeg" @change="uploadImage"/>
                        <img :src="imagePath" @click.stop="clickUploadImage" title="点击图片重新上传头像">
                        <div class="headTitle">
                            {{userInfo.userName}}
                            <span class="sex iconfont" v-if="sex=='0'" style="color:#f817a6">&#xe72c;</span>
                            <span class="sex iconfont" v-if="sex=='1'" style="color:#38adff">&#xe72b;</span>
                        </div>
                    </div>
                    <div class="infoItem">
                        <div class="title">手机</div>
                        <div class="content">{{userInfo.mobile}}</div>
                    </div>
                    <div class="infoItem">
                        <div class="title">部门</div>
                        <div class="content">{{userInfo.DepartmentName}}</div>
                    </div>
                    <div class="infoItem">
                        <div class="title">工号</div>
                        <div class="content">{{userInfo.StaffNum}}</div>
                    </div>
                    <div class="infoItem">
                        <div class="title">机构</div>
                        <div class="content">{{cosName}}</div>
                    </div>
                    <div class="infoItem">
                        <div class="title">角色</div>
                        <div class="content">{{userInfo.userRole}}</div>
                    </div>
                    <div class="quitButton" @click="quitLogin">退出登录</div>
                </div>
            </div>
        </el-dialog>
        <!-- 其他 -->
        <div class="main_inner clearfix">
            <div class="no_network"><span>{{ $t("message.mainPage.no_network") }}</span></div>
            <main-header @changeFlag="changeFlag" :hideflag="hideflag" @quitLogin="quitLogin" @changeMoreFlag="changeMoreFlag" @clickUserInfo="clickUserInfo" @showKindgardenQRCode="showKindgardenQRCode" :hideMoreflag="hideMoreflag" ></main-header>
            <friend-list v-show="!showText"></friend-list>
            <div class="showText" v-show="showText">{{ cosName+"蜂堡办公系统" }}</div>
            <div class="elseComponent" :class="{leftSmall:closeLeft}">
                <!-- <div class="emptyBox" v-if="!this.currConversation&&!this.currFriendList&&($route.meta.pageType=='conversation'||$route.meta.pageType=='friendList')">
                    <div class="cosName">{{ cosName }}<br/>欢迎您！</div>
                </div> -->
                <!-- <div class="emptyBox" v-if="$route.meta.pageType=='office'&&$route.meta.isoffice">
                    <img src="static/images/office.png" class="office" alt="">
                </div> -->
                
                <chat-box v-show="this.currConversation&&!this.currFriendList&&!showText"></chat-box>
                <!-- <friend-list-info v-show="!this.currConversation&&this.currFriendList"></friend-list-info>    -->
                <keep-alive :max="5">
                    <router-view v-show="!showText" v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-show="!showText" v-if="!$route.meta.keepAlive"></router-view>
                <!-- <user-setting></user-setting> -->
            </div>
            <!-- <div class="elseComponent">
                
            </div> -->
        </div>
        <div class="previewPicLayer" v-show="showUploadImg"></div> 
        <div class="previewPic" v-show="showUploadImg" ng-keypress="checkSend($event)" tabindex="1">
            <span class="closeBtn"  @click="closeUploadImg"></span>
            <h2>{{ $t("message.mainPage.sendImage") }}</h2>
            <div class="picWrap">
                <img class="picContent" alt=""/>
            </div>
            <div class="picFooter">
                <button type="button" class="btn" @click="closeUploadImg">{{ $t("message.mainPage.cancel") }}</button>
                <button type="button" class="btn cur" ng-click="uploadPasteImage()">{{ $t("message.mainPage.send") }}</button>
            </div>
        </div>
        <div class="load-container">
            <div class="loader">Loading...</div>
        </div>
    </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import reset from '@/style/reset.css'
import common from '@/style/common.css'
import mainHeader from '@/page/MainHeader'
import friendList from '@/page/chat/FriendList'
import userSetting from '@/page/user/UserSetting'
import chatBox from '@/page/chat/ChatBox'
import { downloadFile,addStaffPhoto,findAllStaffs } from '@/js/api'
import {mapState, mapMutations} from 'vuex'
import {aesEncrypt, aesDecrypt} from '@/config/AES';// AES加密解密算法
import {_setSession, _getSession,_removeSession} from '@/config/utils';


export default {
    name: 'MainPage',
    data :function() {
        return {
            hideflag:true,
            hideMoreflag:true,
            showText:true,
            showCurrUserInfo:false,
            showKindgardenQRCodeDialog:false,
            qrcodeArr:[],
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'appKey',
            'currConversation',
            'currFriendList',
            'login',
            'uploadFile',
            'browserImg',
            'closeLeft',
        ]),
        showUploadImg(){
            // if(){
            //     return true;
            // }
            return this.uploadFile;
        },
        cosName(){
            if(this.userInfo.cosName){
                return this.userInfo.cosName;
            }else{
                return "";
            }
        },
        sex(){
            if(this.userInfo.userSex=="0"){
                return '0';
            }else{
                return '1';
            }
        },
        imagePath(){
            // return "";
            if(this.userInfo.imagePath){
                return this.userInfo.imagePath.replace("../../../",this.userInfo.currProxy+'/COS'+this.userInfo.cosNum+'/');
            }else{
                if(this.userInfo.userSex=="0"){
                    return "/static/images/staff_female.jpg";
                }else{
                    return "/static/images/staff_male.jpg";
                }
            }
        }
    },
    watch:{
        showUploadImg(newVal,oldVal){
        }
    },
    beforeCreate(){
        // 刷新页面时重新定位到主页
        this.$router.push('/mainPage');
        document.title = '蜂堡办公系统';
        document.getElementById("titleIcon").href = 'static/cos.ico';
    },
    beforeMount(){
        if(!this.login){
            let user_info = _getSession('user_info');
            if(user_info){
                let userInfo = JSON.parse(aesDecrypt(user_info));
                this.SAVE_USERINFO(userInfo);
            }else{
                this.$router.push('/login');
            }
        }
    },
    mounted(){
        // this.$message({
        //     dangerouslyUseHTMLString: true,
        //     message:
        //         h('p', null, [
        //             h('span', null, cosName+'蜂堡办公系统'),
        //             // h('a', { style: 'color: #38adff',on:{ click:this.openQRCode } }, '下载手机版')
        //         ])
        // });
        if(this.cosName){
            this.showText = true;
            setTimeout(()=>{
                this.showText = false;
            },2000)
            // this.$message({
            //     message:this.cosName+"蜂堡办公系统",
            //     duration:2000
            // })
            // const h = this.$createElement;
            // this.$notify({
            //     showClose:false,
            //     message: h('span', { style: 'color: #38adff;font-size:18px;'}, this.cosName+"蜂堡办公系统"),
            //     offset: 150,
            //     duration:2000
            // });
        }
        console.log(this.userInfo)
    },
    components:{
        mainHeader,
        friendList,
        chatBox,
        userSetting
    },
    methods:{
        ...mapMutations([
            'SAVE_USERINFO',
            'SET_UPLOADFILE',
            'SET_BROWSERIMG',
            'SET_SELFIMAGEPATH',
            'SET_ALLSTAFFS',
        ]),
        changeFlag(val){// 点击加号显示隐藏添加列表
            this.hideflag = val;
        },
        changeMoreFlag(val){// 点击加号显示隐藏添加列表
            this.hideMoreflag = val;
        },
        clickUserInfo(){// 点击头像
            this.showCurrUserInfo = true;
        },
        quitLogin(){
            _removeSession('user_info');
            this.$router.push('/login');
        },
        trueFlag(){// 点击其他区域隐藏添加列表
            this.hideflag = true;
            this.hideMoreflag = true;
        },
        closeUploadImg(){
            this.SET_UPLOADFILE(null);
        },
        hideBrowserImg(){
            this.SET_BROWSERIMG({imgPath:""});
        },
        clickUploadImage(){
            document.getElementById("uploadSelfStaffImage").click();
        },
        findAllStaffs(){
            findAllStaffs().then((result)=>{
                this.SET_ALLSTAFFS(result.data.data);
            })
        },
        uploadImage(e){
            let file = e.target.files[0];
            let staffID = this.userInfo.userStaffID;
            addStaffPhoto(staffID,file).then((response) => {
                console.log(response)
                if(response.data.statu == 1){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.showCurrUserInfo = false;
                    this.SET_SELFIMAGEPATH(response.data.path);
                    let user_info = aesEncrypt(JSON.stringify(this.userInfo));
                    _setSession('user_info',user_info);
                    this.findAllStaffs();
                }else{
                    this.$message({
                        message: '修改失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                alertError(this,"2024");
            });
        },
        download(url){
            downloadFile(url).then((result)=>{
                const content = result.data;
                const blob = new Blob([content]);
                const fileName = 'enrollment.zip';
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
        showKindgardenQRCode(val){
            this.qrcodeArr = val;
            this.showKindgardenQRCodeDialog = true;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* @import '../style/main.css' */
.main{
    /* padding-left:384px; */
    width: 100%;
}
.main_inner {
    min-height: 100vh;
    
    /* overflow: hidden; */
}
/* chatBox */
.chatBox {
    position: relative;
    background-color: #f9fbfd;
    height: 100vh;
    overflow: hidden;
}
.elseComponent > .emptyBox {
    width: 100%;
    height: 100vh;
    position: relative;
}

.emptyBox > .cosName{
    position: absolute;
    left:50%;
    top:50%;
    font-size: 36px;
    text-align: center;
    color: #333;
    /* margin-top:-320px; */
    transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
}

.elseComponent > .emptyBox > .center {
    width:500px;
    position: absolute;
    left:50%;
    top:50%;
    /* margin-top:-70px; */
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
}

.elseComponent > .emptyBox > .office {
    width:600px;
    position: absolute;
    left:50%;
    top:50%;
    /* margin-top:-70px; */
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
}

.elseComponent > .emptyBox > .topImg{
    width: 100%;
    position: absolute;
    bottom: 0;
}

.chatBox > .emptyBox {
    /*display: none;*/
    width: 847px;
    height: 640px;
    background: url(../img/emptyBox.png) no-repeat;
    background-size: cover;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -320px;
    margin-left: -423px;
}

.chatBox.empty .emptyBox {
    display: block;
}

.chatBox.empty {
    display: none;
}
/**/
.elseComponent{
    position: relative;
    background-color: #fafafa;
    padding-left:384px;
    min-height: 100vh;
}

.leftSmall{
    padding-left: 70px !important;
}

/* 没有网络 */
.no_network{
    text-align: center;
    position: absolute;;
    top:54px;
    width: 100%;
    /* min-width: 1000px; */
    padding-left: 384px;
    z-index: 9999;
    visibility:hidden;
}
.no_network span{
    padding:11px;
    background: #ffdfdf;
    color: #776868;
    line-height: 1;
    border-radius: 5px;
    display: inline-block;
    margin-top: 2px;
    vertical-align: middle;
}
.no_network span:before{
    content: " ";
    background: url(../img/network.png) no-repeat;
    background-size: 17px 17px;
    display: inline-block;
    width: 17px;
    height: 17px;
    margin-right: 7px;
    vertical-align: -3px;
}
.drag_area{
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 999;
}

@media screen and (max-width: 600px) {

    .no_network{
      padding-left: 0px !important;
    }

    .phone_return {
        top: 7px;
        left: -3px;
        font-size: 14px;
    }

    .box_hd {
        height: 40px;
    }

    .box_hd .title_wrap {
        padding: 5px 0 0 0;
    }

    #messageInput {
        height: 40px;
    }
}

/*无回话背景处理 .chatBox > .emptyBox */
@media only screen and (max-width: 735px){
    .chatBox > .emptyBox{
        width: 500px;
        height: 378px;
        margin-top: -189px;
        margin-left: -250px;
    }
}
@media only screen and (min-width: 736px) and (max-width:1069px){
    .chatBox > .emptyBox{
        width: 580px;
        height: 438px;
        margin-top: -219px;
        margin-left: -290px;
    }
}
@media only screen and (min-width: 1070px) and (max-width:1218px){
    .chatBox > .emptyBox{
        width: 680px;
        height: 514px;
        margin-top: -257px;
        margin-left: -340px;
    }
}
@media only screen and (min-width: 1440px){
    .chatBox > .emptyBox{
        width: 847px;
        height: 640px;
        margin-top: -320px;
        margin-left: -423px;
    }
}
/* 粘贴图片预览 */
.previewPic{
    width:560px;
    height:420px;
    overflow:hidden;
    border-radius: 6px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -280px;
    margin-top: -210px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.3),0 1px 1px rgba(50,50,50,.05);
    z-index: 100;
    padding: 13px;
    /* visibility: hidden; */
}
.previewPic .closeBtn{
    display: inline-block;
    position: absolute;
    top: 10px;
    right: 10px;
    background: url(../img/icons.png) 0 -604px/100px auto no-repeat;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
}
.previewPic h2{
    text-align: center;
    width: 100%;
    font-size: 18px;
    font-weight: normal;
    margin-top: 5px;
    letter-spacing: .5px;
}
.previewPic .picWrap{
    text-align: center;
    background: url(../img/picWrapBg.png) 0 0/18px auto repeat;
    margin: 20px 15px 25px;
    line-height: 250px;
}
.previewPic .picWrap .picContent{
    max-width: 100%;
    max-height: 250px;
    display: inline-block;
}
.previewPic .picFooter{
    text-align: center;
    width: 100%;
    border-top: 1px solid #d4d4d4;
    padding-top: 20px;
}
.previewPic .picFooter .btn{
    display: inline-block;
    width: 130px;
    height: 44px;
    font-size: 18px;
    outline: 0;
    border: 1px solid #cecece;
    color: #000;
    background: #ebebeb;
    border-radius: 8px;
}
.previewPic .picFooter .btn:first-child{
    margin-right: 80px;
}
.previewPic .picFooter .btn.cur{
    color: #fff;
    background: #008be7;
    border-color: #008be7;
}
.previewPicLayer{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    background-color: #000;
    opacity: 0.1;
}
.previewPic .picFooter .btn:hover{
    color: #fff;
    background: #0099ff;
    border-color: #0099ff;
}
.load-container {
    width: 56px;
    height: 56px;
    position: absolute;
    overflow: hidden;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    top: 50%;
    left: 50%;
    margin-top:-28px;
    margin-left:-28px;
    z-index: 101;
    visibility: hidden;
}
.loader {
    margin: 25px auto;
    font-size: 25px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
    text-indent: -9999em;
    -webkit-animation: loadUpdate 1.1s infinite ease;
    animation: loadUpdate 1.1s infinite ease;
}
@-webkit-keyframes loadUpdate {
    0%,
    100% {
        box-shadow: 0 -20.8px 0 0 #ffffff, 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2), 20px 0 0 0 rgba(0, 153, 255, 0.2), 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.2), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.2), -20.8px 0 0 0 rgba(0, 153, 255, 0.5), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.7);
    }
    12.5% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.7), 14.4px -14.4px 0 0 #ffffff, 20px 0 0 0 rgba(0, 153, 255, 0.2), 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.2), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.2), -20.8px 0 0 0 rgba(0, 153, 255, 0.2), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.5);
    }
    25% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.5), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.7), 20px 0 0 0 #ffffff, 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.2), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.2), -20.8px 0 0 0 rgba(0, 153, 255, 0.2), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2);
    }
    37.5% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.2), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.5), 20px 0 0 0 rgba(0, 153, 255, 0.7), 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.2), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.2), -20.8px 0 0 0 rgba(0, 153, 255, 0.2), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2);
    }
    50% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.2), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2), 20px 0 0 0 rgba(0, 153, 255, 0.5), 14px 14px 0 0 rgba(0, 153, 255, 0.7), 0 20px 0 0 #ffffff, -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.2), -20.8px 0 0 0 rgba(0, 153, 255, 0.2), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2);
    }
    62.5% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.2), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2), 20px 0 0 0 rgba(0, 153, 255, 0.2), 14px 14px 0 0 rgba(0, 153, 255, 0.5), 0 20px 0 0 rgba(0, 153, 255, 0.7), -14.4px 14.4px 0 0 #ffffff, -20.8px 0 0 0 rgba(0, 153, 255, 0.2), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2);
    }
    75% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.2), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2), 20px 0 0 0 rgba(0, 153, 255, 0.2), 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.5), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.7), -20.8px 0 0 0 #ffffff, -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2);
    }
    87.5% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.2), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2), 20px 0 0 0 rgba(0, 153, 255, 0.2), 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.2), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.5), -20.8px 0 0 0 rgba(0, 153, 255, 0.7), -14.4px -14.4px 0 0 #ffffff;
    }
}
@keyframes loadUpdate {
    0%,
    100% {
        box-shadow: 0 -20.8px 0 0 #ffffff, 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2), 20px 0 0 0 rgba(0, 153, 255, 0.2), 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.2), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.2), -20.8px 0 0 0 rgba(0, 153, 255, 0.5), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.7);
    }
    12.5% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.7), 14.4px -14.4px 0 0 #ffffff, 20px 0 0 0 rgba(0, 153, 255, 0.2), 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.2), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.2), -20.8px 0 0 0 rgba(0, 153, 255, 0.2), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.5);
    }
    25% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.5), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.7), 20px 0 0 0 #ffffff, 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.2), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.2), -20.8px 0 0 0 rgba(0, 153, 255, 0.2), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2);
    }
    37.5% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.2), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.5), 20px 0 0 0 rgba(0, 153, 255, 0.7), 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.2), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.2), -20.8px 0 0 0 rgba(0, 153, 255, 0.2), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2);
    }
    50% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.2), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2), 20px 0 0 0 rgba(0, 153, 255, 0.5), 14px 14px 0 0 rgba(0, 153, 255, 0.7), 0 20px 0 0 #ffffff, -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.2), -20.8px 0 0 0 rgba(0, 153, 255, 0.2), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2);
    }
    62.5% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.2), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2), 20px 0 0 0 rgba(0, 153, 255, 0.2), 14px 14px 0 0 rgba(0, 153, 255, 0.5), 0 20px 0 0 rgba(0, 153, 255, 0.7), -14.4px 14.4px 0 0 #ffffff, -20.8px 0 0 0 rgba(0, 153, 255, 0.2), -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2);
    }
    75% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.2), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2), 20px 0 0 0 rgba(0, 153, 255, 0.2), 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.5), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.7), -20.8px 0 0 0 #ffffff, -14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2);
    }
    87.5% {
        box-shadow: 0 -20.8px 0 0 rgba(0, 153, 255, 0.2), 14.4px -14.4px 0 0 rgba(0, 153, 255, 0.2), 20px 0 0 0 rgba(0, 153, 255, 0.2), 14px 14px 0 0 rgba(0, 153, 255, 0.2), 0 20px 0 0 rgba(0, 153, 255, 0.2), -14.4px 14.4px 0 0 rgba(0, 153, 255, 0.5), -20.8px 0 0 0 rgba(0, 153, 255, 0.7), -14.4px -14.4px 0 0 #ffffff;
    }
}
/* 预览图片 */
.browser{
    width: 100%;
    height: 100%;
    position: relative;
    display: table;
}
.browserImg{
    max-width: 100%;
    margin: 0 auto;
    /* max-height: 100%; */
    display: table-cell;
    vertical-align: middle;
} 
.qrcode{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.qrcodeImage{
    display:flex;
    padding:0 10px;
    flex-direction: column;
} 
.qrcodeImageDom{
    width:300px;
    height: 300px;
}
.kindgardenQRCode{
    padding-top:20px;
    display: flex;
    justify-content: center;
}
.kindgardenQRCode > div{
    display: inline-block;
    color:#38adff;
}
.downloadQRCode{
    padding-top:20px;
    display: flex;
    justify-content: center;
}
.downloadQRCode > div{
    display: inline-block;
    color:#38adff;
    cursor: pointer;
}
.showText{
    display: inline-block;
    padding:15px;
    border:1px solid #38adff;
    position: absolute;
    left:50%;
    top:50%;
    font-size: 24px;
    color: #38adff;
    background: #ffffff;
    border-radius: 10px;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    margin-left: 35px;
    z-index: 99;
}
.staffInfo{
    width:100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}
.deleteBtn{
    position: absolute;
    right:10px;
    top:10px;
    color: #fff;
    cursor: pointer;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
}
.deleteBtn:hover{
    color: red;
}
.staffInfoBlock{
    height:400px;
    width:300px;
    background: #ffffff;
    border-radius: 5px;
    position: relative;
}
.staffImage{
    padding:25px 0 25px 0;
    background: #aaa;
    border-radius: 5px 5px 0 0;
    display: flex;
    flex-direction: row;
}
.staffImage > img{
    display: block;
    margin-left:30px;
    margin-right: 10px;
    height:82px;
    width:82px;
    border-radius: 50%;
    border:2px solid #ffffff;
    overflow: hidden;
    cursor: pointer;
}
.headTitle{
    font-size:18px;
    font-weight: 500;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    text-align:center;
    color: #fff;
    margin-top:10px;
}
.sex{
    padding-left:5px;
    font-size:20px;
}
.moneyIcon{
    padding-right:5px;
}
.infoItem{
    display:flex;
    flex-direction: row;
    padding-top:10px;
    font-size: 15px;
    align-items: center;
}
.infoItem > .title{
    padding:0 20px 0 30px;
    color:#8f8f8f;
}
.infoItem > .content{
    color: #333;
    flex:1;
    padding-right:10px;
}
.quitButton{
    width:100%;
    color:#e51c23;
    position: absolute;
    bottom:0;
    text-align: center;
    padding:8px 0;
    border-top:1px solid #dddddd;
    cursor: pointer;
}
</style>