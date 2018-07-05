<template>
    <div class="chatBoxInner">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="editable?$t('message.userSetting.save'):$t('message.userSetting.edit')" :rightBtnName="editable?'userSave':'userEdit'" @userSave="userSave" @userEdit="userEdit"></chat-header>
        <div id="functionBox">
            <div class="userInfo">
                <div class="userData clearfix">
                    <div class="photo">
                        <img class="img" v-show="loginUser.portraitUri" v-bind:src="loginUser.portraitUri" alt="">
                        <div id="portrait" v-show="!loginUser.portraitUri" class="portrait">{{loginUser.firstchar}}</div>
                    </div>
                    <div class="info" v-show="!editable">
                        <h3 class="userName">
                            <span class="userName_text">
                            {{loginUser.nickName||$t('message.userSetting.none')}}
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
                        <li class="clearfix">
                            <div class="left">
                                <p><span>账号安全</span></p>
                            </div>
                            <div class="right"><a href="javascript:void 0">修改密码<i></i></a></div><!--ui-sref="main.modifypassword"-->
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
                            <div class="right"><a href="javascript:void 0" >黑名单<i></i></a></div><!-- ui-sref="main.blacklist" -->
                        </li>
                        <li class="clearfix" style="margin-top:200px">
                            <div class="left">
                                <p><span class="redColor" style="cursor:pointer;" @click="logout">退出登录</span></p>
                            </div>
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
export default {
    name: 'UserSetting',
    data(){
        return {
            showBack:true,
            title:this.$t("message.userSetting.userSetting"),
            rightBtn:{
                isShow:true,
            },
            editable:false,
            newName:"",
            loginUser:{
                firstchar:"李",
                portraitUri:"http://172.16.1.100:888/COS3/data/UPLOADFILES/ForumFaceImage/ded01648-1e27-492b-83e3-1fc9fed1389f.jpg",
                nickName: "wessless",
                id:1,
                hasSound:true
            }
        }
    },
    components:{
        SwitchButton,
        ChatHeader
    },
    
    methods:{
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
        logout(){

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
#functionBox {
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    top: 54px;
    bottom: 0;
    width: 100%;
}
/* userInfo*/
.userInfo{
    width: 100%;
    padding: 20px 100px;
}
.userInfo .photo .img {
    width: 65px;
    height: 65px;
    border-radius: 50%;
}
.userInfo .photo {
    float: left;
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
}
.userFunPannel ul li{
    border-bottom: 1px solid #d8d8d8;
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
</style>