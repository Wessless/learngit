<template>
    <div ng-switch="item.panelType">
        <!-- <date-message  ng-switch-when="104" date="item.sendTime"></date-message> -->
        <div class="Messages-date" v-if="type=='date'"><b style="cursor: default;">{{date}}</b></div>
        <!-- <get-more-message ng-switch-when="106" myclick="$parent.$parent.$parent.getMoreMessage()"></get-more-message> -->
        <div class="Messages-getHistory" v-else-if="type=='more'"><b @click="getMore" class="" style="cursor: pointer;">{{ $t("message.conversationItem.getMoreMessage") }}</b></div>
        <!-- <get-history-message ng-switch-when="105" myclick="$parent.$parent.$parent.getHistoryMessage()" ></get-history-message> -->
        <div class="Messages-getHistory" v-else-if="type=='history'"><b ng-click="myclick()" class="" style="cursor: pointer;">{{ $t("message.conversationItem.getHistoryMessage") }}</b></div>
        <!-- else -->
        <div class="sys-tips" v-else-if="type=='join'"><span>{{item.content}}</span></div>
        <div v-bind:class="{'Message':!isSend,'Send-Message':isSend}" v-else-if="type=='message'">
            <div class="Messages-unreadLine"></div>
            <div>
                <div v-bind:class="{'Message-header':!isSend,'Send-Message-header':isSend}">
                    <div class="img u-isActionable avatar portrait" v-bind:class="{'Message-avatar':!isSend,'Send-Message-avatar':isSend}" v-show="!item.imgSrc">
                        {{item.senderUserImgSrc}}
                    </div>
                    <!-- <img class="img u-isActionable avatar" v-bind:class="{'Message-avatar':!isSend,'Send-Message-avatar':isSend}" v-show="item.imgSrc"
                        :src="item.imgSrc||'../../img/barBg.png'" alt=""> -->
                    <div class="img u-isActionable avatar portrait" v-bind:class="{'Message-avatar':!isSend,'Send-Message-avatar':isSend}" v-show="item.imgSrc">
                        <image-proxy :imagePath="userImg"></image-proxy>
                    </div>
                    <div class="clearfix" v-bind:class="{'Message-author':!isSend,'Send-Message-author':isSend}">
                        <a class="author u-isActionable"  ng-click="$parent.$parent.$parent.touserinfo(item.senderUserId)">{{item.senderUserName}}</a>
                        <!-- <span class="time " title="2015 年 8 月 6 日">{{item.sendTime|date:'HH:mm:ss'}}</span> -->
                    </div>
                </div>
            </div>
            <div v-bind:class="{'Message-body':!isSend,'Send-Message-body':isSend}">
                <text-message :message="item.content" v-if="messageType=='TextMessage'" :isSend="isSend"></text-message>
                <image-message :message="item.content" v-else-if="messageType=='ImageMessage'" :isSend="isSend"></image-message>
                <voice-message :message="item.content" :duration="item.duration" v-else-if="messageType=='VoiceMessage'" :isSend="isSend"></voice-message>
                <file-message  :fileName="item.fileName" :fileExt="item.fileExt" :fileSize="item.fileSize" :fileUrl="item.fileUrl" v-else-if="messageType=='FileMessage'" :isSend="isSend"></file-message>
            </div>
        </div>
        
    </div>
</template>

<script>
import TextMessage from '@/page/chat/message/TextMessage'
import ImageMessage from '@/page/chat/message/ImageMessage'
import VoiceMessage from '@/page/chat/message/VoiceMessage'
import FileMessage from '@/page/chat/message/FileMessage'
import imageProxy from '@/components/chat/ImageProxy'
import {mapState} from 'vuex'

export default { 
    name: 'ConversationItem',
    props: {
        conversationItem:{
            type:Object
        }
    },
    data() {
        return {
            date:"",
            // historyTime:"historyTime",
            item:{
                content:"",
                imgSrc:"",
                senderUserId:"",
                senderUserImgSrc:"",
                senderUserName:"",
                fileName:"",
                fileExt:"",
                fileSize:"",
                fileUrl:"",
            },
            type:"",
            messageType:"",
            isSend:false
        }
    },
    components:{
        TextMessage,
        ImageMessage,
        VoiceMessage,
        FileMessage,
        imageProxy
    },
    methods:{
        getMore(){
            this.$emit("getMore");
        },
        updateMessageList(){
            
            if(this.conversationItem.type){
                this.type = this.conversationItem.type;
            }
            if(this.conversationItem.messageType){
                // 设置消息文本类型：文字消息、图片消息、文件消息、语音消息
                this.messageType = this.conversationItem.messageType;
                // 这是发送方还是接收方
                if(this.conversationItem.senderUserId==this.userInfo.cosNum+"_"+this.userInfo.userStaffID){
                    this.isSend = true;
                }else{
                    this.isSend = false;
                }
                let message = JSON.parse(this.conversationItem.content.extra);
                let userPhoto;
                if(message.childID){
                    this.item.senderUserId = message.childID;
                    this.item.senderUserName = this.currConversation.chatInfo.StaffName;
                    let userName = this.currConversation.chatInfo.StaffName;
                    this.item.senderUserImgSrc = userName.substr(userName.length-2<0?0:userName.length-2,userName.length);
                    this.item.imgSrc = this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"+this.currConversation.chatInfo.ImagePath.split("../../../")[1];
                }else{
                    userPhoto = message.userPhoto;
                    this.item.senderUserId = message.userID;
                    this.item.senderUserName = message.userName;
                    let userName = message.userName;
                    this.item.senderUserImgSrc = userName.substr(userName.length-2<0?0:userName.length-2,userName.length);
                    console.log(userPhoto);
                    if(userPhoto&&userPhoto!="../../image/teacher_1_male.jpg"&&userPhoto!="../../image/teacher_1_female.jpg"){
                        if(userPhoto.split("../../../")[1]){
                            this.item.imgSrc = this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"+userPhoto.split("../../../")[1];
                        }else{
                            this.item.imgSrc = this.userInfo.currCOSIP+"COS"+userPhoto.split("COS")[1];
                        }
                    }else{
                        this.item.imgSrc = "";
                    }
                }
                if(this.conversationItem.messageType=='TextMessage'){
                    this.item.content = this.conversationItem.content.content;
                }else if(this.conversationItem.messageType=='ImageMessage'){
                    this.item.content = this.conversationItem.content.imageUri;
                }else if(this.conversationItem.messageType=='VoiceMessage'){
                    this.item.duration = this.conversationItem.content.duration;
                    this.item.content = this.conversationItem.content.content;
                }else if(this.conversationItem.messageType=='FileMessage'){
                    this.item.fileName = this.conversationItem.content.name;
                    this.item.fileExt = this.conversationItem.content.type;
                    this.item.fileSize = this.conversationItem.content.size;
                    this.item.fileUrl = this.conversationItem.content.fileUrl;
                }
            }
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'currConversation'
        ]),
        listenConversationItem() {  
            return this.conversationItem;  
        },
        userImg(){
            return "../../../data/"+this.item.imgSrc.split("/data/")[1];
        }
    },
    mounted() {
        this.updateMessageList();
    },
    watch:{
        listenConversationItem(newVal,oldVal){// 监听ConversationItem的props变化切换消息列表选中值
            if(newVal){
                if(newVal.type=="message"){
                    this.updateMessageList();
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

/* 日期历史 */
.Messages-date {
    text-align: center;
    padding: 10px 20px;
    /*border-bottom: 1px solid #e4e7ea;*/
    margin-bottom: 30px;
    height: 10px;
}

.Messages-date b {
    font-size: 12px;
    font-weight: normal;
    color: #ccc;
    background-color: #f9fbfd;
    display: inline-block;
    padding: 0 20px;
    transform: scale(0.9,0.9);
    -webkit-transform: scale(0.9,0.9);
    cursor: default;
}

.Messages-getHistory {
    text-align: center;
    padding: 10px 20px;
    /*border-bottom: 1px solid #e4e7ea;*/
    margin-bottom: 30px;
    height: 10px;
}

.Messages-getHistory b {
    font-size: 9pt;
    font-weight: normal;
    color: #8e969f;
    background-color: #f9fbfd;
    display: inline-block;
    padding: 0 20px;
    cursor: pointer;
}
.Messages-getHistory b:hover {
  color: #0099ff;
}  

.sys-tips{
    text-align: center;
    padding: 10px 0;
}
.sys-tips>span{
    padding:7px 10px;
    background: #e7ecf2;
    border-radius: 3px;
    font-size: 13px;
    color: #8e969f;
}

/* 发送消息模板样式 */
.portrait{
  height: 40px;
  width: 40px;
  font-size: 14px;
  line-height: 40px;
} 

.Message {
    position: relative;
    padding-left: 3pc;
    word-wrap: break-word;
    word-break: break-all;
    border-spacing: 1px;
}

.Message-header {
    padding-top: 8px;
    margin-top: 9pt;
    display: flex;
    flex-direction: row;
    padding-bottom: 8px;
}

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor:pointer;
}

.Message img {
    max-width: 240px;
    max-height: 240px;
}

.Message-avatar {
    position: absolute;
    left:0;
    /* margin-left: -3pc; */
    width: 40px;
    height: 40px;
}

.Message-author {
    display: inline-block;
    position: relative;
    padding-right: 30px;
}
.Message-author .author, .Message-author .time {
    display: block;
    float: left;
    line-height: 1pc;
    cursor: default;
}

.Message-author > .author {
    color: #8e969f;
    cursor: pointer;
}
.Message-author > .author:hover {
    color: #0099ff;
}

.Message-author > .time {
    color: #8e969f;
    font-size: 9pt;
    margin-left: 9pt;
}

.Message-body {
    position: relative;
    /* margin-right: 70px; */
    font-size: 14px;
    line-height: 26px;
    color: #444;
    display:flex;
    flex-direction: row;
}
/*lixiaowei*/ 
.Send-Message {
    position: relative;
    padding-right: 3pc;
    word-wrap: break-word;
    word-break: break-all;
    border-spacing: 1px;
}

.Send-Message-header {
    padding-top: 8px;
    margin-top: 9pt;
    display: flex;
    flex-direction: row-reverse;
    padding-bottom: 8px;
}

.Send-Message img {
    max-width: 240px;
    max-height: 240px;
}

.Send-Message-avatar {
    position: absolute;
    right: 0;
    width: 40px;
    height: 40px;
}

.Send-Message-author {
    display: inline-block;
    position: relative;
    padding-left: 30px;
}
.Send-Message-author .author, .Send-Message-author .time {
    display: block;
    float: right;
    line-height: 1pc;
    cursor: default;
}

.Send-Message-author > .author {
    color: #8e969f;
    cursor: pointer;
}
.Send-Message-author > .author:hover {
    color: #0099ff;
}

.Send-Message-author > .time {
    color: #8e969f;
    font-size: 9pt;
    margin-left: 9pt;
}

.Send-Message-body {
    position: relative;
    /* margin-right: 70px; */
    font-size: 14px;
    line-height: 26px;
    color: #444;
    display:flex;
    flex-direction: row-reverse;
}
</style>