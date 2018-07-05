<template>
    <div class="chatBoxInner">
        <chat-header :showBack="false" :title="staffName" :showRightBtn="false" :rightBtnTitle="editable?$t('message.userSetting.save'):$t('message.userSetting.edit')" :rightBtnName="editable?'userSave':'userEdit'" @userSave="userSave" @userEdit="userEdit"></chat-header>
        <div id="functionBox">
            <div class="userInfo">
                <div class="userData clearfix">
                    <div class="photo">
                        <!-- <img class="img" v-show="portraitUri" v-bind:src="portraitUri" alt=""> -->
                        <div class="img" v-show="portraitUri"><image-proxy :imagePath="portraitUri"></image-proxy></div>
                        <div id="portrait" v-show="!portraitUri" class="portrait">{{firstchar}}</div>
                    </div>
                    <div class="info" v-show="!editable">
                        <h3 class="userName">
                            <span class="userName_text">
                            {{staffName||$t('message.userSetting.none')}}
                            <!-- <i class="Presence Presence--user offline"></i> -->
                            </span>
                        </h3>
                        <!-- <p class="userId">ID : <span>{{loginUser.id}}</span></p> -->
                        <!-- <p class="isBlack">已加入黑名单</p> -->
                    </div>
                    <div class="editName clearfix" v-show="editable">
                    <form name="modifyName" novalidate="novalidate">
                        <div class="clearfix">
                            <div class="col-xs-3">
                                <input type="text" name="userName" class="form-control" id="editName" required  minlength="1" maxlength="32"  v-model="newName">
                            </div>
                            <span class="error-block" ng-show="modifyName.userName.$dirty&&modifyName.userName.$error.required">用户名不能为空</span>
                            <span class="error-block" ng-show="modifyName.userName.$dirty&&(modifyName.userName.$error.minlength||modifyName.userName.$error.maxlength)">昵称长度1-32</span>
                            </div>
                    </form>
                    </div>
                </div>
                <div class="userFunPannel clearfix">
                    <div class="officeContent">
                        <div class="officeItem" v-for="item in officeList" :key="item.Num" @click="toUrl(item)">
                            <img :src="'/static/images/office/'+item.Num+'.png'" alt="">
                            <div class="title">{{ item.MENU_NM }}</div>
                        </div>
                    </div>
                    <div style="flex:1;">
                    </div>
                    <ul class="clearfix myInfo">
                        <li class="clearfix">
                            <div class="sendMsgBtn" @click="sendMsg">发消息</div>
                            <div class="right hide"><input type="checkbox" class="js-switch" checked /></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import SwitchButton from '@/components/chat/SwitchButton'
import ChatHeader from '@/components/chat/ChatHeader'
import { mapState,mapMutations } from 'vuex'
import { couldSeeStaffMessage } from '@/js/api'
import { rong_getConversation } from '@/js/rongCloud'
import imageProxy from '@/components/chat/ImageProxy'

export default {
    name: 'UserSetting',
    data(){
        return {
            editable:false,
            newName:"",
            loginUser:{
                id:1,
                hasSound:true
            },
            officeMenu:{
                "2002": {
                    router:""
                },
                "2003": {
                    router:""
                },
                "2004": {
                    router:""
                },
                "2005": {
                    router:""
                },
                "2006": {
                    router:""
                },
                "2007": {
                    router:""
                },
                "2008": {
                    router:""
                },
                "2009": {
                    router:""
                }
            },
            itemList:[{
                MENU_NM:"考勤",
                MENU_URL:"/image/firstpage/1-3_menu ico-311.png",
                Num:"2002",
                Router:"",
                TITLE_IMAGE:""
            },{
                MENU_NM:"日报",
                MENU_URL:"/image/firstpage/1-3_menu ico-311.png",
                Num:"2003",
                Router:"",
                TITLE_IMAGE:""
            },{
                MENU_NM:"足迹",
                MENU_URL:"/image/firstpage/1-3_menu ico-311.png",
                Num:"2004",
                Router:"",
                TITLE_IMAGE:""
            },{
                MENU_NM:"排班",
                MENU_URL:"/image/firstpage/1-3_menu ico-311.png",
                Num:"2005",
                Router:"",
                TITLE_IMAGE:""
            },{
                MENU_NM:"年假",
                MENU_URL:"/image/firstpage/1-3_menu ico-311.png",
                Num:"2006",
                Router:"",
                TITLE_IMAGE:""
            },{
                MENU_NM:"考核",
                MENU_URL:"/image/firstpage/1-3_menu ico-311.png",
                Num:"2007",
                Router:"",
                TITLE_IMAGE:""
            },{
                MENU_NM:"赏罚",
                MENU_URL:"/image/firstpage/1-3_menu ico-311.png",
                Num:"2008",
                Router:"",
                TITLE_IMAGE:""
            },{
                MENU_NM:"积分",
                MENU_URL:"/image/firstpage/1-3_menu ico-311.png",
                Num:"2009",
                Router:"",
                TITLE_IMAGE:""
            }],
            officeList:[]
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'currFriendList'
        ]),
        staffInfo(){
            if(this.currFriendList&&this.currFriendList.data){
                return this.currFriendList.data
            }else{
                return null;
            }
        },
        staffID(){
            if(this.currFriendList&&this.currFriendList.data){
                return this.currFriendList.data.StaffID
            }else{
                return "";
            }
        },
        staffName(){
            if(this.currFriendList&&this.currFriendList.data){
                return this.currFriendList.data.StaffName
            }else{
                return "";
            }
        },
        firstchar(){
            if(this.staffName){
                let userName = this.staffName;
                return userName.substr(userName.length-2<0?0:userName.length-2,userName.length);
            }else{
                return ""
            }
        },
        portraitUri(){
            if(this.currFriendList&&this.currFriendList.data){
                return this.currFriendList.data.ImagePath.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/");
            }else{
                return "";
            }
        }
    },
    components:{
        SwitchButton,
        ChatHeader,
        imageProxy
    },
    mounted(){
        couldSeeStaffMessage(this.userInfo.userStaffID,this.staffID).then((result)=>{
            console.log(result)
            if(result.data.result=="1"){
                this.officeList = this.itemList;
            }
        });
    },
    updated(){
        couldSeeStaffMessage(this.userInfo.userStaffID,this.staffID).then((result)=>{
            
            if(result.data.result=="1"){
                this.officeList = this.itemList;
            }else{
                this.officeList = [];
            }
        });
    },
    methods:{
        ...mapMutations([
            'SET_CURRCONVERSATION',
            'SET_CURRFRIENDLIST',
        ]),
        toUrl(item){
            if(item.Router){
                this.$router.push(this.$route.fullPath+item.Router);
            }else{
                this.$message('敬请期待，请前往蜂堡办公系统APP版进行操作');
            }
        },
        userEdit(){
            this.editable = true;
            this.newName = this.loginUser.nickName;
        },
        userSave(){
            this.editable = false;
            this.loginUser.nickName = this.newName;
        },
        modalVisibleChange(val){
            this.loginUser.hasSound = val;
        },
        sendMsg(){

            var data = {
                conversationType:RongIMLib.ConversationType.PRIVATE,
                targetId:this.userInfo.cosNum+"_"+this.staffID,
                chatInfo:this.staffInfo
            };
            data.chatInfo.chatType = "staff";
            // 显示消息组件
            this.SET_CURRCONVERSATION(data);
            // 隐藏员工（群组）信息组件
            this.SET_CURRFRIENDLIST(null);
            // 路由跳转到消息路由
            this.$router.push('/mainpage/friendList');
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.portrait{
  height: 65px;
  width: 65px;
  font-size: 20px;
  line-height: 65px;
}
#functionBox {
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    top: 54px;
    bottom: 0;
    width: 100%;
    display: flex;
}
/* userInfo*/
.userInfo{
    width: 100%;
    padding: 20px 100px;
    display: flex;
    flex-direction: column;
}
.userInfo .photo .img {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    overflow: hidden;
}
.userInfo .photo {
    float: left;
    display: flex;
}
.userInfo .info {
    float: left;
    margin-left: 15px;
}
.userInfo .info .userName{
    /*font-weight: bold;*/
    font-size: 17px;
    color: #000;
    /*line-height: 50px;*/
    margin-top: 10px;
    margin-bottom: 8px;
}
.userInfo .info .userName span{
    position: relative;
}
/* 好友设置备注名 */
.userInfo .info .remarkName.form-group {
    display: inline-block;
    margin-bottom: 0;
    margin-top: -6px;
}
.userInfo .info .remarkName .form-control {
    display: inline-block;
    width: auto;
}
.userInfo .info .remarkName label{
    font-weight: normal;
    font-size: 14px;
    color: #999;
    margin-right: 3px;
    margin-bottom: 0;
}
.userInfo .info .remarkName input{
    margin-right: 5px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    border-bottom: 1px solid #ccc;
    padding: 0;
    background: transparent;
    height: 20px;
    text-indent: 3px;
    width: 120px!important;
}
.userInfo .info .remarkName > i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: -4px;
    /* background: url(../../static/images/icons.png) 0 -576px/100px auto no-repeat; li */
}
.userInfo .info .remarkName .error-block{
    display: inline-block;
    margin-left: 10px;
    color: #f00;
}
.Presence--user.online {
    position: absolute;
    top: 5px;
    right: -18px;
    width: 10px;
    height: 10px;
}
.Presence--user.offline {
    position: absolute;
    top: 5px;
    right: -18px;
    width: 10px;
    height: 10px;
    background-color:#b3b3b3;
}
.userInfo .info .userId{
    color: #95989a;
    font-size: 14px;
}
.userInfo .info .isBlack{
    color: #95989a;
    margin-top: 5px;
    transition: all .1s;
}
.userInfo .editName>div{
    margin-top: 16px;
}
.userInfo .editName>div>div{
    min-width: 130px;
}
.userInfo .editName>div input{
    min-width: 130px;
}
.userInfo .editName .error-block{
    float: left;
    margin-left: 25px;
    margin-top: 7px;
    color: #ff0000;
}

.userFunPannel{
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    flex:1;
}
.userFunPannel ul li{
    /* border-bottom: 1px solid #d8d8d8; */
    line-height: 40px;
    /*margin-top: 10px;*/
    font-size: 16px;
    padding: 5px 0;
}
.userFunPannel ul li .left{
    float: left;
    display: flex;
    align-items: center;
}
.userFunPannel ul li .left a{
    color: #00a0ff;
}
.userFunPannel ul li .right{
    float: right;
    padding-right: 5px;
    height: 40px;
    display: flex;
    align-items: center;
}
.userFunPannel ul li:last-child{
    /*margin-top: 300px;*/
}
.redColor{
    color: #ff0000;
}
.blueColor{
    color: #38adff;
}
.userFunPannel .myInfo{
    padding: 0 1%;
}
.userFunPannel .myInfo .right a{
    color: #0099ff;
}
.userFunPannel .myInfo .right a:hover{
    color: #0892ef;
}
.userFunPannel .myInfo .right a i{
    margin-left: 5px;
    margin-bottom: 2px;
    display: inline-block;
    width: 9px;
    height: 9px;
    border-bottom: 2px solid #0099ff;
    border-right: 2px solid #0099ff;
    transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
}
.sendMsgBtn{
    width:100%;
    background:#4dc060;
    color: #ffffff !important;
    text-align: center;
    cursor:pointer;
    border-radius: 5px;
    margin-right:5px;
}
/* menu */
.officeContent{
    display: grid;
    width: 100%;
    grid-template-columns: 25% 25% 25% 25%;
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
}
@media screen and (max-width: 1140px){
    .officeContent{
        display: grid;
        width: 100%;
        grid-template-columns: 33.3% 33.3% 33.3%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
@media screen and (max-width: 980px){
    .officeContent{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
@media screen and (max-width: 870px){
    .officeContent{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
/* .officeItem{
    display: flex;
    height:80px;
    width:23%;
    margin-bottom: 30px;
    flex-direction: row;
    border:1px solid #dddddd;
    border-radius: 5px;
    min-width: 200px;
    align-items: center;
    margin-right:10px;
} */
.officeItem{
    display: flex;
    height:80px;
    justify-self: center;
    width: 92%;
    margin-bottom: 30px;
    flex-direction: row;
    border:1px solid #dddddd;
    border-radius: 5px;
    align-items: center;
}

.officeItem:hover{
    cursor: pointer;
    border:1px solid #38adff;
}
.officeItem > img{
    width:80px;
    height:80px;
    display: inline-block;
}
.officeItem > .title{
    display: inline-block;
    height:20px;
} 
</style>