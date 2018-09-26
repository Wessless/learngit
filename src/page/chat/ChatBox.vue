<template>
<div class="chatBox" @click="showemoji=false">
    <input  name="file" type="file" id="imageInput" style="display:none" accept="image/png,image/gif,image/jpeg" @change="uploadImg"/>
    <input  name="file" type="file" id="fileInput" style="display:none" @change="uploadFile"/>
    <div class="chatBoxInner client" id="chatMain">
        <!--header-->
        <chat-header :title="currentConversation.title" :showRightBtn="false" ></chat-header>
        <!-- content -->
        <div id="Messages">
            <conversation-item v-for="(conversationitem,index) in conversationMsgList" :key='index' :conversationItem="conversationitem">
            </conversation-item>
            <conversation-item v-if="showMore" :conversationItem="{type:'more'}" @getMore="getHistroyMessage(null)"></conversation-item>
        </div>
        
        <!-- inputBox -->
        <div class="inputBox">
            <!-- <div v-if="mainData.isTyping">
            <div class="typingIcon"><i></i><i></i><i></i></div>
            </div> -->
            <div id="MessageForm" class="">
                <div id="MessageForm-header">
                    <div class="MessageForm-tool">
                        <i class="iconfont-smile" @click.stop="showemoji=!showemoji"></i>
                        <div class="expressionWrap" v-bind:class="{expressionWrapShow:showemoji}" @click.stop="stopMethod"><i class="arrow"></i>
                            <!-- <emoji ng-repeat="item in emojiList" item="item" content="msgvalue"></emoji> -->
                            <emoji v-for="(item,index) in emojiList" :key="index" :item="item" @insertEmoji="insertEmoji"></emoji>
                        </div>
                    </div>
                    <div class="MessageForm-tool" v-show="false">
                        <i class="screen_shot" id="screen_shot" style="position: relative; z-index: 1;" ng-click="takeScreenShot()"></i>
                    </div>
                    <div class="MessageForm-tool">
                        <i class="iconfont-upload" id="upload-image" style="position: relative; z-index: 1;" @click="selectImg"></i>
                        <div class="moxie-shim moxie-shim-html5" style="position: absolute; top: 5px; left: 0px; width: 20px; height: 15px; overflow: hidden; z-index: 0;"></div>
                    </div>
                    <div class="MessageForm-tool">
                        <i class="file_shot" id="upload-file" style="position: relative; z-index: 1;" @click="selectFile"></i>
                    </div>
                </div>
                <div class="progress-wrapper ng-isolate-scope" v-show="uploadStatus.show&&uploadStatus.progress!=100"><span class="progress-text ng-binding">正在上传: {{uploadStatus.progress}}%</span>
                    <div class="progress">
                        <div class="progress-bar" v-bind:style="{ width:uploadStatus.progress+'%' }"></div>
                    </div>
                    <a class="progress-cancel" v-show="uploadStatus.showCancel" @click="cancelUpload">{{ $t("message.chatBox.cancel") }}</a>
                </div>
            </div>
            <div class="MessageForm-appearance active" >
                <div id="TestInput"></div>
                <textarea id="message-content" @focus="showemoji=false"  v-model="currentConversation.draftMsg"  @keydown.enter.exact.prevent="sendBtn" @keydown.ctrl.enter.exact="nextLine" contenteditable="true" fun="sendBtn()" ctrlenter="false" :placeholder="$t('message.chatBox.inputText')" ondrop="return false;"></textarea>
                <a class="sendBtn" href="javascript:void 0" @click="sendBtn">{{ $t("message.chatBox.send") }}</a>
                <div class="arobase" ng-show="atShow" id="atList">
                    <ul>
                        <li v-for="(item,index) in showGroupList" ng-click="moveToItem(this);selectMember(item)" :key="index">
                            <img v-bind:src="item.imgSrc||'../../img/barBg.png'">
                            <span class="involvesName">{{item.name}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
// import axios from '@/config/axios'
import axios from 'axios';
import SwitchButton from '@/components/chat/SwitchButton'
import ChatHeader from '@/components/chat/ChatHeader'
import ConversationItem from '@/page/chat/ConversationItem'
import Emoji from '@/page/chat/Emoji'
import {mapState, mapMutations, mapActions} from 'vuex'
import { rong_getHistroyMessage,rong_sendTextMessage,rong_sendImageMessage,rong_sendFileMessage,rong_sendCommandMessage,rong_clearUnreadCount,rong_SendSyncReadStatusMessage } from '@/js/rongCloud'
import { uploadImg } from '@/js/api'
import { imageCompress,fileNameInfo,fileSizeInfo } from '@/config/utils'

export default {
    name: 'ChatBox',
    data(){
        return {
            source:null,
            currentConversation:{
                title:"",
                // targetType:2,
                // targetId:2,
                draftMsg:"",// 发送的消息
            },
            conversationMsgList:[],// 消息数据
            conversationType:null,
            targetId:null,
            instance:null,
            showMore:false,
            showemoji:false,
            emojiList:RongIMLib.RongIMEmoji.list,
            showGroupList:[],
            uploadStatus:{
                show:false,
                progress:0,
                showCancel:true
            },
            uploadInput:""
        }
    },
    mounted(){
        // 初始化声音库
        let RongIMVoice = RongIMLib.RongIMVoice;
        RongIMVoice.init();
    },
    computed:{
        ...mapState([
            'userInfo',
            'currConversation'
        ]),
        listenCurrConversation() {  
            return this.$store.state.currConversation;  
        },
        listenCurrNewMessage() {  
            return this.$store.state.currNewMessage;  
        },
        // 发送消息的用户信息
        sendMessageExtra(){
            // 发送用户信息的头像是外网地址
            let sexImg = this.userInfo.userSex=="1"?"../../image/teacher_1_male.jpg":"../../image/teacher_1_female.jpg";
            let userPhoto = this.userInfo.imagePath?this.userInfo.imagePath.replace("../../../","http://111.160.234.166:888/"+"COS"+this.userInfo.cosNum+"/"):sexImg;
            let extra = "{\"userID\":\""+this.userInfo.userStaffID+"\", \"userName\":\""+this.userInfo.userName+"\", \"userPhoto\":\""+userPhoto+"\", ";
            if(this.listenCurrConversation.chatInfo.chatType=="child"){
                extra += "\"childID\":\""+this.listenCurrConversation.chatInfo.StaffID+"\", ";
            }
            extra += "\"duration\":\"\"}";
            return extra;
        }
    },
    components:{
        SwitchButton,
        ChatHeader,
        ConversationItem,
        Emoji
    },
    watch:{
        listenCurrConversation(newVal,oldVal){
            if(newVal){
                this.currentConversation.title = newVal.chatInfo.StaffName;
                this.conversationType = newVal.conversationType;
                this.targetId = newVal.targetId;
                this.instance = RongIMClient.getInstance();
                this.conversationMsgList = [];
                let timestrap = new Date().getTime();
                this.getHistroyMessage(timestrap);
                rong_sendCommandMessage(newVal.conversationType,newVal.targetId);
            }
        },
        listenCurrNewMessage(newVal,oldVal){
            if(newVal){
                if(newVal.messageType != "CommandMessage"&&newVal.messageType != "SyncReadStatusMessage"&&this.currConversation){
                    if(newVal.targetId==this.currConversation.targetId){
                        newVal.type = "message";
                        this.conversationMsgList.splice(0, 0, newVal);
                        this.currConversation.unreadMessageCount = 0;
                        if(newVal.senderUserId == this.userInfo.cosNum+"_"+this.userInfo.userStaffID){
                        }else{
                            rong_sendCommandMessage(newVal.conversationType,newVal.targetId);
                        }
                        rong_clearUnreadCount(newVal.conversationType, newVal.targetId, (data) => {
                            if(data){
                                rong_SendSyncReadStatusMessage(newVal.conversationType, newVal.targetId, newVal.sentTime);
                            }
                        });
                    }
                }else if(newVal.messageType == "CommandMessage"&&this.currConversation){// 已读消息
                    
                }else if(newVal.messageType == "SyncReadStatusMessage"&&this.currConversation){// 同步未读数消息

                }
                // message.type = "message";
                // this.conversationMsgList.splice(0, 0, message);
            }
        }
    },
    methods:{
        ...mapMutations([
            'SET_UPLOADFILE',
            'SET_CURRNEWMESSAGE',
        ]),
        stopMethod(){},
        insertEmoji(item){
            // 插入到输入框
            this.currentConversation.draftMsg = this.currentConversation.draftMsg+item.symbol;
            // 隐藏表情
            this.showemoji = false;
        },
        nextLine(){
            this.currentConversation.draftMsg = this.currentConversation.draftMsg+'\n';
        },
        cancelUpload(){
            console.log("source",this.source);
            this.source.cancel('Operation canceled by the user.');
            this.uploadStatus.show = false;
            this.uploadStatus.progress = 0;
        },
        selectImg(){
            document.getElementById("imageInput").click();
        },
        uploadImg(e){
            let file = e.target.files[0];
            let localPath = e.target.value;
            this.uploadStatus.show = true;
            this.uploadStatus.progress = 0;
            // this.SET_UPLOADFILE(file);
            // 取消按钮
            var CancelToken = axios.CancelToken;
            let source = CancelToken.source();
            this.source = source;
            console.log("开始上传");
            uploadImg(file,source.token,(progressEvent)=>{
                var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
                this.uploadStatus.progress = complete;
            }).then((response) => {
                if(response.data.statu==1){
                    console.log("上传成功");
                    let imgSrc = response.data.path.split("../../../")[1];
                    console.log("-------------------------------------------------------------------")
                    this.uploadStatus.show = false;
                    this.uploadStatus.progress = 0;
                    return new Promise((resolve, reject) => {
                        resolve(imgSrc)
                    });
                }
            }).then((imgSrc) => {
                let httpImgSrc = "http://111.160.234.166:888/COS"+this.userInfo.cosNum+"/"+imgSrc;
                imageCompress(file,0.5,(base64)=>{
                    let base64Image = base64;
                    let content = {
                        imageUri:httpImgSrc,
                        content:base64Image.split("base64,")[1],
                        extra: this.sendMessageExtra,
                        messageName:"ImageMessage",
                    };
                    rong_sendImageMessage(content, this.conversationType, this.targetId,(message) => {
                        message.type = "message";
                        this.currentConversation.draftMsg = "";
                        this.SET_CURRNEWMESSAGE(message);
                    });
                });
            }).catch(function(thrown) {
                if (axios.isCancel(thrown)) {
                    console.log('Request canceled', thrown.message);
                } else {
                    // handle error
                }
            });


        },
        selectFile(){
            document.getElementById("fileInput").click();
        },
        uploadFile(e){
            let file = e.target.files[0];
            let localPath = e.target.value;
            this.uploadStatus.show = true;
            this.uploadStatus.progress = 0;
            // 取消按钮
            var CancelToken = axios.CancelToken;
            console.log(CancelToken)
            let source = CancelToken.source();
            this.source = source;
            uploadImg(file,source.token,(progressEvent)=>{
                var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
                this.uploadStatus.progress = complete;
            }).then((response) => {
                if(response.data.statu==1){
                    let filePath = response.data.path.split("../../../")[1];
                    this.uploadStatus.show = false;
                    this.uploadStatus.progress = 0;
                    return new Promise((resolve, reject) => {
                        resolve(filePath)
                    });
                }
            }).then((filePath) => {
                let httpFileSrc = this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"+filePath;
                let fileInfoObj = fileNameInfo(file.name);
                let fileSize = fileSizeInfo(file.size);
                let content = {
                    name: fileInfoObj.name, // 文件名称
                    size: fileSize, // 文件大小，单位自己约定
                    type: fileInfoObj.ext, // 文件的后缀名，例如 png、js、doc ...
                    fileUrl: httpFileSrc, // 文件地址
                    extra: this.sendMessageExtra,
                };
                rong_sendFileMessage(content, this.conversationType, this.targetId,(message) => {
                    message.type = "message";
                    this.currentConversation.draftMsg = "";
                    this.SET_CURRNEWMESSAGE(message);
                });
            });

        },
        getHistroyMessage(timestrap){
            rong_getHistroyMessage(this.conversationType, this.targetId, timestrap, (list, hasMsg)=>{
                this.showMore = hasMsg;
                for(let i=0;i<list.length;i++){
                    list[i].type = 'message';
                }
                // let newList = list.concat(this.conversationMsgList);
                for(let i=0;i<list.length;i++){
                    this.conversationMsgList.push(list[i]);
                }
                // this.conversationMsgList = list;
            });
        },
        sendBtn(){
            if(this.currentConversation.draftMsg.trim()==""){
                return;
            }
            // console.log(this.sendMessageExtra);
            // return;
            let content = {
            	content: this.currentConversation.draftMsg,
                extra: this.sendMessageExtra,
                messageName:"TextMessage"
            };
            rong_sendTextMessage(content, this.conversationType, this.targetId,(message) => {
                message.type = "message";
                this.currentConversation.draftMsg = "";
                this.SET_CURRNEWMESSAGE(message);
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

/**/ 
.chatBox .chatBoxInner{
    height: 100%;
    position: relative;
}
.chatBox .chatBoxInner .clientHd{
    display: none;
    height: 14px;
    width: 100%;
    background: #fff;
}
/**/
#Messages {
    background-color: #f9fbfd;
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    position: absolute;
    top: 54px;
    bottom: 118px;
    padding-bottom: 30px;
    display: flex;
    flex-direction: column-reverse;
}

#Messages.empty .emptyBox {
    display: block;
}

#Messages.empty .MessagesInner {
    display: none;
}

#Messages .emptyBox {
    display: none;
    font-size: 14px;
    color: #8e969f;
    text-align: center;
    height: 20px;
    line-height: 20px;
    margin-top: -10px;
    position: absolute;
    top: 50%;
    width: 100px;
    margin-left: -50px;
    left: 50%;
}
/* 底部发送消息 */
/* inputBox */
.inputBox {
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    /*box-shadow: 0 6px 8px 2px #8b96ad;*/
    box-shadow:-2px -2px 2px #f5f7fa;
    border-top: 1px solid #dddddd;
}

#MessageForm {
    line-height: 1.7em;
    width: 100%;
    /*border-top: 2px solid #fafafa;*/
    background-color: #fff;
    padding: 10px 20px 0px;
}

#MessageForm-header {
    font-size: 13px;
    height: 28px;
    vertical-align: middle;
}

.MessageForm-tool {
    position: relative;
    margin-right: 8px;
    float: left;
}

.MessageForm-tool i {
    width: 20px;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
    display: inline-block;
}

.MessageForm-tool i.iconfont-smile {
    background: url(../../img/icons.png) 0 -188px/100px auto no-repeat;
}
.MessageForm-tool i.iconfont-smile:hover {
    background-position: -60px -188px;
}
.MessageForm-tool i.screen_shot {
     background: url(../../img/icons.png) 0 -641px/100px auto no-repeat;
}
.MessageForm-tool i.screen_shot:hover {
    background-position: -60px -641px;
}

.MessageForm-tool i.iconfont-upload {
    background: url(../../img/icons.png) 0 -546px/100px auto no-repeat;
}
.MessageForm-tool i.iconfont-upload:hover {
    background-position: -60px -546px;
}

.MessageForm-tool i.file_shot {
    background: url(../../img/icons.png) 0 -672px/100px auto no-repeat;
}
.MessageForm-tool i.file_shot:hover {
    background: url(../../img/icons.png) -60px -672px/100px auto no-repeat;
}
.MessageForm-appearance{
    position: relative;
}
#message-content {
    /*border: 1px solid #ccc;
    border-radius: 5px;*/
    display: block;
    padding: 5px 60px 15px 20px;
    width: 100%;
    bottom: 0;
    max-height: 10pc !important;
    overflow: auto !important;
    border: none;
    outline: 0;
    word-wrap: break-word;
    resize: none;
    height: 80px;
}

#MessageForm textarea {
    width: 100%;
    padding: 0;
    box-shadow: none;
    font-size: 14px;
    border-radius: 0;
    outline: 0;
    background-color: transparent;
    color: #444;
    clear: both;
    border: 0;
}

.sendBtn {
    position: absolute;
    color: #c3c3c3;
    top: -38px;
    right: 0px;
    font-size: 16px;
    line-height: 24px;
    border-left: 1px solid #dddddd;
    height:118px;
    width: 80px;
    line-height: 118px;
    text-align: center;
}
.sendBtn:hover,.sendBtn:active,.sendBtn:focus{
    color: #c3c3c3;
    cursor: default;
}
.MessageForm-appearance.active .sendBtn {
    color: #0099ff;
    cursor: pointer;
}
.MessageForm-appearance.active .sendBtn.disabled {
    color: #c3c3c3;
    cursor: default;
}

/* 表情 */
.expressionWrap{
    border: 1px solid #D9DADC;
    margin: 6px 15px;
    width: 348px;
    padding: 5px 8px;
    position: absolute;
    left: -16px;
    /* top: -220px; */
    bottom: 38px;
    background: #fff;
    z-index: -1;
}
.expressionWrapShow{
    z-index: 1100;
}
.expressionWrap.expMes{
    left: 3px;
    bottom: -94px;
    margin: -1px -4px;
    width: 890px;
    border-top: 1px solid #D9DADC!important;
}
.expressionWrap .arrow{
    position: absolute;
    left: 5px;
    bottom: -9px;
    display: inline-block;
    width: 10px;
    height: 9px;
    background: url(../../img/arrow.png);
}
.expressionWrap div{
    cursor: default;
}
/*.RC_Expression {
    width: 22px;
    height: 22px;
    background-image: url(http://res.websdk.rongcloud.cn/css-sprite_bg.png);
    display: inline-block;
}*/
.expressionWrap div { padding: 3px; border-radius: 4px; }
.expressionWrap div:hover { background: #eee; }
.expressionWrap>div>span>span{ font-size: 20px; vertical-align: middle; }

/* 正在输入图标 */
.typingIcon{
    position: absolute;
    top: -25px;
    left: 10px;
    z-index: 10;
}
.typingIcon > i {
    background-color: #fff;
    width: 6px;
    height: 6px;
    border-radius: 100%;
    margin: 2px 3px;
    display: inline-block;
}
.typingIcon > i:nth-child(1) {
    animation: typing1 1s infinite;
}
.typingIcon > i:nth-child(2) {
    animation: typing2 1s  infinite;
}
.typingIcon > i:nth-child(3) {
    animation: typing3 1s  infinite;
}
@-webkit-keyframes typing1 {
    0%,24% {
        background-color: #fff; }


    25%,100% {
        background-color: rgba(0,153,255,.4) }


}
@keyframes typing1 {
    0%,24% {
        background-color: #fff; }


    25%,100% {
        background-color: rgba(0,153,255,.4) }


}
@-webkit-keyframes typing2 {
    0%,49% {
        background-color: #fff; }


    50%,100% {
        background-color: rgba(0,153,255,.4) }


}
@keyframes typing2 {
    0%,49%  {
        background-color: #fff; }


    50%,100% {
        background-color: rgba(0,153,255,.4) }


}
@-webkit-keyframes typing3 {
    0%,74% {
        background-color: #fff; }


    75%,100% {
        background-color: rgba(0,153,255,.4) }


}
@keyframes typing3 {
    0%,74% {
        background-color: #fff; }


    75%,100% {
        background-color: rgba(0,153,255,.4) }


}

/*                                      @功能                            */
.arobase{
    width: 150px;
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0px 2px rgba(17,55,94,0.2);
    box-shadow: inset 0 0px 2px rgba(17,55,94,0.2);
    position: absolute;
    /*top:-80px;*/
    bottom: 80px;
    left: 30px;
    background: #fff;
    z-index: 9999;
    max-height: 216px;
    overflow: auto;
}
.arobase ul li{
    padding: 5px 10px;
    height: 36px;
}
.arobase ul li:hover{
    background:#dde7f0;
}
.arobase ul li.selected {
    background: #dde7f0;
}
.arobase ul li img{
    width: 26px;
    height: 26px;
    display: block;
    margin-right: 9px;
    border-radius: 50%;
    float: left;
}
.arobase ul li span.involvesName{
    line-height: 26px;
    max-width: 77px;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    cursor: default;
}

/*lixiaowei*/ 
#message-content{
    background-color: rgba(0,0,0,0);
    font-family: "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    white-space: pre-wrap;
}

</style>