<template>
    <div class="chatBoxInner">
        <chat-header :showBack="false" :title="groupName" :showRightBtn="false" :rightBtnTitle="editable?$t('message.userSetting.save'):$t('message.userSetting.edit')" :rightBtnName="editable?'userSave':'userEdit'" @userSave="userSave" @userEdit="userEdit"></chat-header>
        <div id="functionBox">
            <div class="userInfo">
                <div class="userData clearfix">
                    <div class="photo">
                        <!-- <img class="img" v-show="portraitUri" v-bind:src="portraitUri" alt=""> -->
                        <div class="img" v-show="portraitUri"><image-proxy :imagePath="portraitUri"></image-proxy></div>
                        <div id="portrait" v-show="!portraitUri" class="portrait">
                            <!-- <div class="threeIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div>
                            <div class="threeIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div>
                            <div class="threeIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div> -->
                            <!-- <div class="fourIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div>
                            <div class="fourIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div>
                            <div class="fourIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div>
                            <div class="fourIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div> -->
                            <div class="allIcon" v-bind:class="{threeIcon:(staffArray.length==3),fourIcon:(staffArray.length==4)}" v-for="imgItem in staffArray" :key="imgItem.StaffID" v-bind:odd-even="imgItem.StaffID%2==0?1:0" v-bind:data-sex="imgItem.Sex">
                                <div v-show="!imgItem.ImagePath">{{ imgItem.StaffName.substring(imgItem.StaffName.length-1,imgItem.StaffName.length) }}</div>
                                <span v-if="imgItem.ImagePath">
                                    <!-- <img v-bind:src="imgItem.ImagePath.replace('../../../',userInfo.currCOSIP+'/COS'+userInfo.cosNum+'/')" alt=""> -->
                                    <div class="image"><image-proxy :imagePath="imgItem.ImagePath" :hasImg="false"></image-proxy></div>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="info" v-show="!editable">
                        <h3 class="userName">
                            <span class="userName_text">
                            {{groupName||$t('message.userSetting.none')}}
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
                    <ul class="clearfix myInfo">
                        <!-- <li class="clearfix">
                            <div class="left">
                                <p><span>账号安全</span></p>
                            </div>
                            <div class="right"><a href="javascript:void 0">修改密码<i></i></a></div>
                        </li>
                        <li class="clearfix">
                            <div class="left">
                                <p><span>系统消息</span></p>
                            </div>
                            <div class="right">
                                <switch-button :emit="'changeSwitch'" @changeSwitch="modalVisibleChange" v-model="loginUser.hasSound"></switch-button>
                            </div>
                        </li>
                        <li class="clearfix">
                            <div class="left">
                                <p><span>隐私</span></p>
                            </div>
                            <div class="right"><a href="javascript:void 0" >黑名单<i></i></a></div>
                        </li> -->
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
import imageProxy from '@/components/chat/ImageProxy'
import { mapState,mapMutations } from 'vuex'
import { rong_getConversation } from '@/js/rongCloud'

export default {
    name: 'UserSetting',
    data(){
        return {
            editable:false,
            newName:"",
            loginUser:{
                id:1,
                hasSound:true
            }
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'currFriendList',
            'allStaffs'
        ]),
        groupInfo(){
            if(this.currFriendList&&this.currFriendList.data){
                return this.currFriendList.data
            }else{
                return null;
            }
        },
        groupID(){
            if(this.currFriendList&&this.currFriendList.data){
                return this.currFriendList.data.ID
            }else{
                return "";
            }
        },
        groupName(){
            if(this.currFriendList&&this.currFriendList.data){
                return this.currFriendList.data.GroupName
            }else{
                return "";
            }
        },
        firstchar(){
            if(this.groupName){
                let userName = this.groupName;
                return userName.substr(userName.length-2<0?0:userName.length-2,userName.length);
            }else{
                return ""
            }
        },
        portraitUri(){
            if(this.currFriendList&&this.currFriendList.data){
                return this.currFriendList.data.Portraiturl.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/");
            }else{
                return "";
            }
        },
        staffArray(){
            if(this.groupInfo.Staffs){
                let staffs = this.groupInfo.Staffs.split(",");
                let allStaffs = this.allStaffs;
                let staffArray = [];
                for(let i=0;i<staffs.length;i++){
                    for(let j=0;j<allStaffs.length;j++){
                        if(staffs[i].split("_")[1] == allStaffs[j].StaffID && i<4){
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
    components:{
        SwitchButton,
        ChatHeader,
        imageProxy
    },
    methods:{
        ...mapMutations([
            'SET_CURRCONVERSATION',
            'SET_CURRFRIENDLIST',
        ]),
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
                conversationType:RongIMLib.ConversationType.GROUP,
                targetId:"g_"+this.userInfo.cosNum+"_"+this.groupInfo.ID,
                chatInfo:{
                    StaffID: this.groupInfo.ID,
                    StaffName: this.groupInfo.GroupName,
                    ImagePath: this.groupInfo.Portraiturl,
                    Staffs: this.groupInfo.Staffs,
                    length: this.groupInfo.Staffs.split(",").length,
                    chatType:"group",
                }
            };
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
    flex-direction: column-reverse;
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
/* 群组头像 */	
.threeIcon{
    width:50%;
    box-sizing: border-box;
    float: left; 
    position:relative;
    color:#FFFFFF;
    font-size: 18px;
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
    width:18px;
    height:18px;
    line-height:18px;
}
.threeIcon:nth-child(1){
    border-right:1px solid #FFFFFF;
    height: 100%;
    background-size: 100% 100%;
}
.threeIcon:nth-child(1) > div{
    top:22px;
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
    font-size: 18px;
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
    width:18px;
    height:18px;
    line-height:18px;
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
.sendMsgBtn{
    width:100%;
    background:#4dc060;
    color: #ffffff !important;
    text-align: center;
    cursor:pointer;
    border-radius: 5px
}
</style>