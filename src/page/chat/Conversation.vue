<template>
    <div class="chatList" v-bind:class="{selected:isCurrentConversation}" @click="showChatBox" @contextmenu.prevent="rightClick">
        <div class="chat_item online slide-left">
            <div class="photo">
                <!-- <img class="img" v-show="imgSrc" :src="imgSrc" alt="" onError="" ref="img"> -->
                <div class="img" v-show="imgSrc"><image-proxy :imagePath="item.chatInfo.ImagePath"></image-proxy></div>
                <div class="portrait" v-show="!imgSrc&&item.chatInfo.chatType!='group'" :odd-even="staffID%2" :data-sex="sex">{{firstchar}}</div>
                <div class="portrait" v-show="!imgSrc&&item.chatInfo.chatType=='group'">
                    <div class="allIcon" v-bind:class="{threeIcon:(staffArray.length==3),fourIcon:(staffArray.length==4)}" v-for="imgItem in staffArray" :key="imgItem.StaffID" v-bind:odd-even="imgItem.StaffID%2==0?1:0" v-bind:data-sex="imgItem.Sex">
                        <div v-show="!imgItem.ImagePath">{{ imgItem.StaffName.substring(imgItem.StaffName.length-1,imgItem.StaffName.length) }}</div>
                        <span v-if="imgItem.ImagePath"><div class="image"><image-proxy :imagePath="imgItem.ImagePath" :hasImg="false"></image-proxy></div></span>
                    </div>
                </div>
                <i class="Presence Presence--stacked Presence--mainBox" v-show="false"></i>
            </div>
            <div class="info">
                <h3 class="nickname">
                    <span class="nickname_text">{{title}}</span>
                </h3>
                <p class="msg ng-scope" >
                    <!-- // <span ng-if="conversation.unReadNum>0" class="ng-binding ng-scope">[{{conversation.unReadNum}}条未读]</span> -->
                    <span class="at_show" v-show="conversation.atStr">{{conversation.atStr}}</span>
                    <span class="ng-binding" v-html="content"></span>
                </p>
            </div>
            <div class="ext">
                <p class="attr clearfix timer">
                    <span class="pull-left">{{lastTime}}</span>
                    <!-- // <span class="pull-right timeBoundary">PM</span> -->
                </p>
                <!-- // <p class="attr "> -->
                <p class="attr clearfix">
                    <span class="badge" v-if="item.unreadMessageCount>0">{{item.unreadMessageCount>99?"99+":item.unreadMessageCount}}</span>
                    <i class="no-remind" v-show="false"></i>
                </p>
            </div>
        </div>
    </div>
</template>

<script>

import { _format } from '@/config/utils'
import { mapState,mapMutations } from 'vuex'
import imageProxy from '@/components/chat/ImageProxy'


export default {
    name: 'Conversations',
    props: {
        item:{
            type:Object
        },
        friendList:{
            type:Array
        }
    },
    data :function() {
        return {
            conversation:{
                atStr:""
            }
        }
    },
    mounted () {

        // if(this.item.chatInfo.ImagePath=="../../../Data/UPLOADFILES/ForumFaceImage/teacher_1_male.jpg"||this.item.chatInfo.ImagePath=="../../../Data/UPLOADFILES/ForumFaceImage/teacher_1_female.jpg"){
        //     this.imgSrc = "";
        // }else{
        //     this.imgSrc = this.item.chatInfo.ImagePath.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/");
        // }

        // this.$refs.img.onerror = () => {
        //     console.log("ERROR");
        //     this.imgSrc = this.imgSrc.replace("111.160.234.166:888","172.16.1.100:888");
        // }
    },
    components:{
        imageProxy
    },
    computed:{
        ...mapState([
            'userInfo',
            'currConversation'
        ]),
        lastTime(){
            let lastTime = new Date(this.item.sentTime?this.item.sentTime:this.item.receivedTime);
            return _format(lastTime,"yyyy-MM-dd HH:mm:ss");
        },
        title(){
            return this.item.chatInfo.StaffName;
        },
        staffID(){
            return this.item.chatInfo.StaffID;
        },
        sex(){
            return this.item.chatInfo.Sex;
        },
        firstchar(){
            let userName = this.item.chatInfo.StaffName;
            return userName.substr(userName.length-2<0?0:userName.length-2,userName.length);
        },
        imgSrc(){
            if(this.item.chatInfo.ImagePath=="../../../Data/UPLOADFILES/ForumFaceImage/teacher_1_male.jpg"||this.item.chatInfo.ImagePath=="../../../Data/UPLOADFILES/ForumFaceImage/teacher_1_female.jpg"){
                return "";
            }else{
                return this.item.chatInfo.ImagePath.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/");
            }
        },
        isCurrentConversation(){
            if(this.currConversation){
                return this.item.targetId==this.currConversation.targetId;
            }else{
                return false;
            }
        },
        content(){
            if(this.item.latestMessage.content.messageName == "ImageMessage"){
                return "[图片]"
            }else if(this.item.latestMessage.content.messageName == "FileMessage"){
                return "[文件]"
            }else{
                return RongIMLib.RongIMEmoji.symbolToHTML(this.item.latestMessage.content.content);
            }
        },
        staffArray(){
            if(this.item.chatInfo.Staffs){
                let staffs = this.item.chatInfo.Staffs.split(",");
                let allStaffs = this.friendList;
                let staffArray = [];
                for(let i=0;i<staffs.length;i++){
                    for(let j=0;j<allStaffs.length;j++){
                        if(staffs[i].split("_")[1] == allStaffs[j].StaffID && staffArray.length<4){
                            staffArray.push(allStaffs[j]);
                        }
                    }
                }
                return staffArray;
            }else{
                return [];
            }
        }
    },
    methods:{
        ...mapMutations([
            'SET_CURRCONVERSATION',
            'SET_CURRFRIENDLIST',
        ]),
        showChatBox(){
            // 显示消息组件
            this.SET_CURRCONVERSATION(this.item);
            // 隐藏员工（群组）信息组件
            this.SET_CURRFRIENDLIST(null);
        },
        rightClick(){
            var x = event.clientX
            var y = event.clientY
            // Get the current location
            let data = {};
            data.axios = {
                x, y
            }
            data.menuData = this.item;
            this.$emit("childRightClick",data);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/**/ 
.chat_item {
    overflow: hidden;
    /*padding: 12px 18px 11px;*/
    padding: 8px 18px 7px;
    border-bottom: 1px solid #e1e9f1;
    cursor: pointer;
    position: relative;
}

.chat_item p {
    margin: 0;
}

.chat_item.online {
    opacity: 1;
    display: flex;
}

.chat_item.offline {
    opacity: .3;
}

.chat_item .photo {
    float: left;
    margin-right: 10px;
    position: relative;
    display: flex;
}

.chat_item .photo .img {
    display: block;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    overflow: hidden;
}

.Presence--mainBox {
    left: 2px;
    top: 0px;
    border-color: #f4f8fc;
}



.chat_item .info {
    overflow: hidden;
    flex:1;
}

.chat_item .info .nickname {
    font-weight: 400;
    font-size: 16px;
    color: #000;
    line-height: 20px;
    margin: 0;
}

.chat_item .info .nickname_text {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: top;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal
}

.chat_item .info .nickname_count {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: top
}

.chat_item .info .msg {
    color: #8e969f;
    font-size: 14px;
    width: 100%;
    /*overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    height: 1.5em*/
    /* display: -webkit-box; */
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    word-wrap:normal;
    padding-top:3px;
    /* -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; */
    height: 26px;/*IE*/
}

.chat_item .ext {
    float: right;
    color: #6b6f7c;
    font-size: 13px;
    text-align: right;
    min-width: 55px;
    position: relative;
}

.chat_item .ext .attr {
    height: 19px;
    line-height: 1.5;
    font-size: 12px;
    margin-top:20px;
}

.no-remind {
    background: url(../../img/icons.png) 3px -135px/100px auto no-repeat;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    display: inline-block;
    float: right;
}
/*  */ 
.chatList .portrait{
  height: 45px;
  width: 45px;
  font-size: 16px;
  line-height: 45px;
}
.chatList:hover {
    background: #ebf2f7;
}
.chatList.selected {
    background: #dde7f0;
}
.chatList .timeBoundary{
    margin-left:5px ;
}

.chatList .badge{
    float: left;
    background-color:#0099ff ;
    font-weight:normal;
}
.chatList .timer{
    color: #8e969f;
    position: absolute;
    right: 0;
    white-space: nowrap;
    margin-top:0px !important;
}

.nickname .nickname_text{
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.chat_item .attr span{
    display: inline-block;
    float: none !important;
    /* position: absolute;
    right: 0;
    white-space: nowrap; */
}
/*             有人at         */
.chat_item .info .msg .at_show{
    color: #cc3333;
}
/* 群组头像 */	
.threeIcon{
    width:50%;
    box-sizing: border-box;
    float: left; 
    position:relative;
    color:#FFFFFF;
    font-size: 10px;
    overflow:hidden;
    background-repeat: no-repeat;
    position: relative;
}
/*.threeIcon > img{
    position:relative;
    z-index:3;
    height:100%;
}*/
.threeIcon > div{
    position:absolute;
    text-align:center;
    width:12px;
    height:12px;
    line-height:12px;
}
.threeIcon:nth-child(1){
    border-right:1px solid #FFFFFF;
    height: 100%;
    background-size: 100% 100%;
}
.threeIcon:nth-child(1) > div{
    top:16px;
    right:3px;
}
.threeIcon:nth-child(2){
    border-left:1px solid #FFFFFF;
    border-bottom:1px solid #FFFFFF;
    height: 50%;
    background-size:50% 50%;
}
.threeIcon:nth-child(2) > div{
    bottom:3px;
    left:3px;
}
.threeIcon:nth-child(3){
    border-left:1px solid #FFFFFF;
    border-top:1px solid #FFFFFF;
    height: 50%;
    background-size:50% 50%;
}
.threeIcon:nth-child(3) > div{
    top:3px;
    left:3px;
}
.fourIcon{
    height:50%;
    width:50%;
    box-sizing: border-box;
    float: left;
    position:relative;
    color:#FFFFFF;
    font-size: 12px;
    overflow:hidden;
    background-repeat: no-repeat;
    background-size:50% 50%;
}
/*.fourIcon > img{
    position:relative;
    z-index:3;
    width:100%;
    height:100%;
}*/
.fourIcon > div{
    position:absolute;
    text-align:center;
    width:12px;
    height:12px;
    line-height:12px;
}
.fourIcon:nth-child(1){
    border-right:1px solid #FFFFFF;
    border-bottom:1px solid #FFFFFF;
}
.fourIcon:nth-child(1) > div{
    bottom:3px;
    right:3px;
}
.fourIcon:nth-child(2){
    border-left:1px solid #FFFFFF;
    border-bottom:1px solid #FFFFFF;
}
.fourIcon:nth-child(2) > div{
    bottom:3px;
    left:3px;
}
.fourIcon:nth-child(3){
    border-right:1px solid #FFFFFF;
    border-top:1px solid #FFFFFF;
}
.fourIcon:nth-child(3) > div{
    top:3px;
    right:3px;
}
.fourIcon:nth-child(4){
    border-left:1px solid #FFFFFF;
    border-top:1px solid #FFFFFF;
}
.fourIcon:nth-child(4) > div{
    top:3px;
    left:3px;
}	
.allIcon[odd-even='0'][data-sex='1']{
    background: #6BB5CE;
}
.allIcon[odd-even='0'][data-sex='0']{
    background: #FF943E;
}
.allIcon[odd-even='1'][data-sex='1']{
    background: #78C06E;
}
.allIcon[odd-even='1'][data-sex='0']{
    background: #F65E5E;
}
.allIcon span{
    display: block;
    width: 100%;
    height: 100%;
}
.allIcon span .image{
    height: 100%;
    min-width: 100%;
    position: relative;
    display: block;
}
</style>