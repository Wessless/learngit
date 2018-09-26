<template>
    <div id="sign" class="">
        <div class="header">
            <div class="main clearfix">
                <a href="http://www.cdtec.net/cn/" target="_blank" class="header-logo pull-left">{{ $t("message.login.name") }}</a>
            </div>
        </div>
        <div class="ng-scope">
            <div class="content">
                <div class="main">
                    <div class="mainWrap clearfix">
                        <!-- <div class="leftBox pull-left"></div> -->
                        <div class="rightBox pull-left" @keyup.enter="signin">
                            <div class="sign-flow signinBox">
                                <div class="title">
                                    <a class="cur signinBtn" href="javascript:void 0" @click="qrLogin">扫码登录</a>
                                    <div class="triangle-up" v-show="isQRLogin"></div>
                                    <a class="cur signinBtn" href="javascript:void 0" @click="isQRLogin=false">{{ $t("message.login.login") }}</a>
                                    
                                    <div class="triangle-up2" v-show="!isQRLogin"></div>
                                </div>
                                <div class="form-group firstNone" v-show="isQRLogin">
                                    <div class="qrcode">
                                        <div class="isOutTime" v-show="!qrcode.canCheck">您的二维码已经失效，请点击下方的刷新按钮</div>
                                        <img class="qrcode-img" v-show="qrcode.qrcodeImg" :src="qrcode.qrcodeImg" alt="">
                                        <div class="refreshQRCode">请使用蜂堡办公系统扫描二维码<span @click="qrLogin"><span>刷新</span></span></div>
                                    </div>
                                </div>
                                <div class="form-group firstNone" v-show="!isQRLogin">
                                    <input type="text" v-bind:placeholder='$t("message.login.username")' required class="form-control-my" name="userName" v-model="user.userName" id="username">
                                </div>
                                <div class="form-group" v-show="!isQRLogin">
                                    <input type="password" v-bind:placeholder='$t("message.login.password")' required class="form-control-my" name="passWord" v-model="user.passWord"  id="pwdIn">
                                </div>
                                <div class="form-group" v-show="!isQRLogin">
                                    <input type="tel" v-bind:placeholder='$t("message.login.cosNum")' required class="form-control-my" name="cosNum" v-model="user.cosNum"  id="cosNum" @keyup="validateCosNum">
                                    <p class="error-block" v-show="showPasswordError">{{passwordError}}</p>
                                </div>
                                <div class="button-wrapper form-group" v-show="!isQRLogin">
                                    <button class="sign-button submit" @click="signin">{{ $t("message.login.login") }}</button>
                                </div>
                                <!-- <div class="bot clearfix" v-show="!isQRLogin">
                                    <router-link class="pull-right" to="/mainpage">{{ $t("message.login.findPassword") }}</router-link>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>
                {{ $t("message.login.copyRight") }}<span><a target="_blank" href="http://www.cdtec.net/cn/">{{ $t("message.login.ICP") }}</a></span>
            </p>
        </div>
    </div>
</template>

<script>

// import Chatroom from '@/components/Chatroom'
// import main from '@/style/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import QRCode from 'qrcode';
import config from '@config';
import {aesEncrypt, aesDecrypt} from '@/config/AES';// AES加密解密算法
import {_setSession, _getSession,alertError } from '@/config/utils';
import {mapState, mapMutations} from 'vuex'
import { getCosByCosNum, login, getUUID, checkUUID, checkIP, getCosType,findAllStaffs,getPassword} from '@/js/api'


export default {
    name: 'Login',
    data :function() {
        return {
            showPasswordError: false,
            passwordError: '',
            user:{
                userName: "",
                passWord: "",
                cosNum: ""
            },
            isQRLogin:true,
            qrcode:{
                qrcodeImg:"",
                uuid:"",
                checkTime:60000,
                canCheck:true,
                timePicker:null
            },
            downloadButton:true
        }
    },
    mounted(){
        if(this.isQRLogin){
            this.qrLogin();
        }
    },
    computed:{
        // ...mapState([
        //     'userInfo',
        //     'login'
        // ])
    },
    methods:{
        ...mapMutations([
            'SAVE_USERINFO'
        ]),
        validateCosNum(){//验证cosNum为数字
            this.user.cosNum=this.user.cosNum.replace(/[^\d]/g,'');
        },
        // 获取UUID并生成二维码
        qrLogin(){
            this.isQRLogin = true;
            if(this.qrcode.timePicker){
                clearTimeout(this.qrcode.timePicker);
            }
            getUUID().then((result)=>{
                this.qrcode.uuid = result.data.uuid;
                QRCode.toDataURL("cosQRCodeLogin:"+this.qrcode.uuid,{rendererOpts:{quality:1}}, (err, url) => {
                    this.qrcode.qrcodeImg = url;
                });
            }).then(()=>{
                this.qrcode.canCheck = true;
                this.qrcode.timePicker = setTimeout(()=>{
                    this.qrcode.canCheck = false;
                },this.qrcode.checkTime);
                this.checkUUID();
            })
        },
        // 检测手机中是否已经确认登录
        checkUUID(){
            if(this.qrcode.canCheck&&this.isQRLogin){
                checkUUID(this.qrcode.uuid).then((response)=>{
                    if(response.data.ret==1){// 登录成功
                        this.checkIP(response);
                    }else if(response.data.ret=="0"){
                        this.checkUUID();
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            }
        },
        // 扫码登录成功后保存登录信息
        checkIP(response){
            let currCOSIP = response.data.CosUrl;
            let currProxy = "";
            let cosNum = response.data.CosNum;
            let proxyTables = config.dev.proxyTable;
            let password = '';

            for(let proxyTable in proxyTables){
                if(proxyTables[proxyTable].target==currCOSIP){
                    currProxy = proxyTable
                }
            }
            let staffInfo = null;
            // 外网二维码登录
            checkIP(currProxy,cosNum)
            .then((result)=>{
                response.data.currProxy = currProxy;
                response.data.currCOSIP = currCOSIP;
                response.data.currCOSImgIP = currCOSIP;
                response.data.cosNum = cosNum;
                response.data.portrait = response.data.imagePath;
                response.data.loginName = response.data.mobile;
                response.data.password = password;
                staffInfo = response.data;
                this.SAVE_USERINFO(staffInfo);
                let user_info = aesEncrypt(JSON.stringify(staffInfo));
                _setSession('user_info',user_info);
                return Promise.all([getCosType(),getPassword(response.data.userStaffID)]);
            }).then((result)=>{
                // 登录成功后再storage中添加cosType
                if(result){
                    staffInfo.cosType = result[0].data.costype;
                    staffInfo.password = result[1].data.Password;
                    this.SAVE_USERINFO(staffInfo);
                    let user_info = aesEncrypt(JSON.stringify(staffInfo));
                    _setSession('user_info',user_info);
                }
                this.$router.push("/mainpage");
            }).catch((err)=>{
                // this.$alert('错误码：1014', '错误', {
                //     confirmButtonText: '确定',
                //     closeOnClickModal: true,
                //     type:"error",
                //     callback: action => {
                //     }
                // });
            });
            // 公司内网二维码登录
            checkIP('/COS0IN',cosNum).then((result)=>{
                response.data.currProxy = "/COS0IN";
                response.data.currCOSIP = "http://172.16.1.100:888/";
                response.data.currCOSImgIP = "http://172.16.1.100:888/";
                response.data.cosNum = cosNum;
                response.data.portrait = response.data.imagePath;
                response.data.loginName = response.data.mobile;
                response.data.password = password;
                staffInfo = response.data;
                this.SAVE_USERINFO(staffInfo);
                let user_info = aesEncrypt(JSON.stringify(staffInfo));
                _setSession('user_info',user_info);
                return Promise.all([getCosType(),getPassword(response.data.userStaffID)]);
            }).then((result)=>{
                // 登录成功后再storage中添加cosType
                if(result){
                    staffInfo.cosType = result[0].data.costype;
                    staffInfo.password = result[1].data.Password;
                    this.SAVE_USERINFO(staffInfo);
                    let user_info = aesEncrypt(JSON.stringify(staffInfo));
                    _setSession('user_info',user_info);
                }
                this.$router.push("/mainpage");
            }).catch((err)=>{
                // this.$alert('错误码：1014', '错误', {
                //     confirmButtonText: '确定',
                //     closeOnClickModal: true,
                //     type:"error",
                //     callback: action => {
                //     }
                // });
            });
        },
        // 用户名密码登录
        signin(){
            if (!this.user.userName) {
                this.passwordError = this.$t("message.login.pleaseUsername");
                this.showPasswordError = true;
                return;
            }else if(!this.user.passWord){
                this.passwordError = this.$t("message.login.pleasePassword");
                this.showPasswordError = true;
                return;
            }else if(!this.user.cosNum){
                this.passwordError = this.$t("message.login.pleaseCOSNum");
                this.showPasswordError = true;
                return;
            }
            this.passwordError = '';
            this.showPasswordError = false;
            let currCOSIP = "";
            let currProxy = "";
            getCosByCosNum(this.user.cosNum).then((response) => {
                currCOSIP = response.data.F_CosUrl;
                let proxyTables = config.dev.proxyTable;
                console.log(proxyTables)
                console.log(currCOSIP)
                for(let proxyTable in proxyTables){
                    if(proxyTables[proxyTable].target==currCOSIP){
                        currProxy = proxyTable
                    }
                }
            })
            .then(() => {
                let staffInfo = null;
                console.log(currProxy,this.user.cosNum,this.user.userName,this.user.passWord)
                login(currProxy,this.user.cosNum,this.user.userName,this.user.passWord).then((response) => {
                    console.log(response)
                    if(response.data.ret == 1){
                        response.data.currProxy = currProxy;
                        response.data.currCOSIP = currCOSIP;
                        response.data.currCOSImgIP = currCOSIP;
                        response.data.cosNum = this.user.cosNum;
                        response.data.portrait = response.data.imagePath;
                        response.data.loginName = this.user.userName;
                        response.data.password = this.user.passWord;
                        staffInfo = response.data;
                        this.SAVE_USERINFO(staffInfo);
                        let user_info = aesEncrypt(JSON.stringify(staffInfo));
                        _setSession('user_info',user_info);
                        return getCosType();
                    }else{
                        this.passwordError = this.$t("message.login.passwordError");
                        this.showPasswordError = true;
                    }
                }).then((result)=>{
                    // 登录成功后再storage中添加cosType
                    if(result){
                        staffInfo.cosType = result.data.costype;
                        this.SAVE_USERINFO(staffInfo);
                        let user_info = aesEncrypt(JSON.stringify(staffInfo));
                        _setSession('user_info',user_info);
                        this.$router.push("/mainpage");
                    }
                }).catch((err)=>{
                    // alertError(this,"2001");
                    console.log('cos1');
                    console.log(err);
                    this.passwordError = this.$t("message.login.passwordError");
                    this.showPasswordError = true;
                });

                login('/COS0IN',this.user.cosNum,this.user.userName,this.user.passWord).then((response) => {
                    console.log(response);
                    if(response.data.ret == 1){
                        response.data.currProxy = "/COS0IN";
                        response.data.currCOSIP = "http://172.16.1.100:888/";
                        response.data.currCOSImgIP = "http://172.16.1.100:888/";
                        response.data.cosNum = this.user.cosNum;
                        response.data.portrait = response.data.imagePath;
                        response.data.loginName = this.user.userName;
                        response.data.password = this.user.passWord;
                        staffInfo = response.data;
                        
                        this.SAVE_USERINFO(staffInfo);
                        let user_info = aesEncrypt(JSON.stringify(staffInfo));
                        _setSession('user_info',user_info);
                        return getCosType();
                    }else{
                        this.passwordError = this.$t("message.login.passwordError");
                        this.showPasswordError = true;
                    }
                }).then((result)=>{
                    // 登录成功后再storage中添加cosType
                    if(result){
                        staffInfo.cosType = result.data.costype;
                        this.SAVE_USERINFO(staffInfo);
                        let user_info = aesEncrypt(JSON.stringify(staffInfo));
                        _setSession('user_info',user_info);
                        this.$router.push("/mainpage");
                    }
                }).catch((err)=>{
                    // alertError(this,"2001");
                    console.log(err);
                    this.passwordError = this.$t("message.login.passwordError");
                    this.showPasswordError = true;
                });
            })
            .catch((error) => {
                console.log(error);
                alertError(this,"1993");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* 登录 注册 */
#sign{
    min-height: 100vh;
    /* min-width: 1000px; */
    width: 100vw;
    position: relative;
    background: url(../../img/webBg.png) 0 0/10px 10px;
    display: flex;
    flex-direction: column;
}
#sign .header{
    width: 100%;
    height: 90px;
    line-height: 90px;
    display: flex;
    align-items: center;

}
#sign .ng-scope{
    display: flex;
    align-items: center;
    /* justify-content: center; */
    flex:1;
    padding: 30px 0;
}
#sign .header .main{
    /* width: 980px; */
    margin: 0 auto;
    display: inline-block;
}
#sign .header .main a{
    font-size: 15px;
    color: #fff;
}
#sign .header .main .signIn{
    font-size: 15px;
    color: #fff;
}
#sign .header .main .signIn a{
    text-decoration: underline;
}
.header-logo {
     /* text-indent: -9999px; */
     /* background: url(../../img/header-logo.png) no-repeat 0 0/auto 52px; */
     font-size: 36px !important;
     font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
             SimSun, sans-serif;
     height: 52px;
     width: 240px;
     margin: 19px 10px 19px 10px;
     text-align: center;
}
#sign .content{
    width: 100%;
    height: 100%;
    display: flex;
    margin: 0 auto;
}
#sign .content .main{
    /* width: 1000px; */
    margin: 0 auto;
}
#sign .content .main{
    /* width: 1000px; */
    margin: 0 auto;
}
#sign .content .main .mainWrap{
    /* width: 800px; */
    margin: 0 auto;
    height: 400px;
}
#sign .content .main .leftBox{
    width: 360px;
    height: 333px;
    /* background: url(../../img/signBg.png) no-repeat 0 0/auto 333px; */
    margin: 92px 0 0 0;
}
#sign .content .main .rightBox{
    /* margin: 130px 0 0 105px; */
}
.sign-flow {
    float: right;
    width: 280px;
}
.sign-flow .title{
    margin-bottom: 10px;
    position: relative;
}
.sign-flow .title a{
    display: inline-block;
    font-size: 16px;
    color: #a5dbff;
    min-width: 136px;
    height: 30px;
    line-height: 30px;
    padding-left: 2px;
    padding-right: 2px;
    text-align: center
}
.sign-flow .title a.cur{
    font-size: 16px;
    color: #fff;
}
.triangle-up {
    position: absolute;
    bottom: -10px;
    left: 60px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 7px solid #fff;
}

.triangle-up2{
    position: absolute;
    bottom: -10px;
    left: 202px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 7px solid #fff;
}

.signupBox .triangle-up {
    left: 77px;
}
.sign-flow .form-group{
    margin-top: 8px;
    margin-bottom: 8px;
    width: 100%;
    display: inline-block;
    vertical-align: middle;
}
.sign-flow .form-group.firstNone{
    margin-top: 0px;
}
.qrcode{
    width:280px;
    height: 280px;
    background: #ffffff;
    border-radius: 5px;
    overflow: hidden;
    padding:20px 40px 60px 40px;
    position: relative;
}
.qrcode-img{
    width: 100%;
    height: 100%;
    display: inline-block;
}
.isOutTime{
    width: 162px;
    height: 162px;
    top: 39px;
    left: 59px;
    position: absolute;
    z-index: 6;
    text-align: center;
    color: #a94442;
    display: flex;
    align-items: center;
    /* line-height: 200px; */
    background:rgba(255,255,255,.9)
}
.refreshQRCode{
    width:200px;
    bottom:20px;
    left: 40px;
    position: absolute;
    text-align: center
}
.refreshQRCode > span{
    color: #38adff;
    /* font-family: 'Avenir', Helvetica, Arial, sans-serif !important; */
    cursor: pointer;
    font-size: 14px;
}
.refreshQRCode > span > span{
    color: #38adff;
    cursor: pointer;
    font-size: 14px;
}
.form-control-my {
    width: 100%;
    padding: 6px 12px;
    font-size: 14px;
    color: #555;
    vertical-align: middle;
    background-color: #fff;
    background-image: none;
    border: 0;
    border-radius: 4px;
    outline: 0;
}

.sign-flow .form-group input{
    height: 38px;
    /*line-height: 38px;*/
    font-size: 14px;
}
.sign-flow .error-block{
    display: block;
    color: #ffffff;
    font-size: 12px;
    background: #ff7f7f;
    border-radius: 5px;
    padding: 6px 10px;
    float: left;
    margin-top: 8px;
    margin-bottom: 0px;
}
.sign-flow .error-none{
    display: none;
}
.sign-button {
    display: block;
    padding: 0;
    width: 100%;
    font-size: 16px;
    line-height: 38px;
    color: #fff;
    text-align: center;
    text-shadow: 0 1px 1px rgba(0,0,0,.2);
    background: #0085d4;
    border: 0;
    border-radius: 5px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.3),0 1px 1px rgba(50,50,50,.05);
    outline: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
.sign-flow .bot{
    height: 12px;
    line-height: 12px;
    margin-top: 2px;
}
.sign-flow .bot a{
    font-size: 12px;
    color: #a5dbff;
}
.footer{
    /* position: absolute;
    bottom: 0; */
    padding: 20px 0;
    width: 100%;
}
.footer p {
    clear: both;
    text-align: center;
    color: #fff;
    font-size: 14px;
}
.footer p span{
    padding-left: 50px;
    display: inline;
}
.footer p span a{
    color: #fff;
    text-decoration: none;
}
.msgCode .form-control-my{
    width: 65%;
    float: left;
}
.msgCode span{
    width: 33%;
    float: right;
    display: inline-block;
    height: 38px;
    line-height: 38px;
    text-align: center;
    font-size: 15px;
    border-radius: 4px;
    color: #fff;
}
.msgCode span.sec{
    background: #becdd6;
}
.msgCode span.sendCode{
    font-size: 14px;
    background: #0085d4;
    cursor: pointer;
}
.msgCode span.sendCode:hover{
    background: #0682cc;
}
.msgCode span.sendCode a{
    color: #fff;
}
.resetBox{
    padding-top: 50px;
}
.resetBox .resetInner{
    width: 320px;
    margin: 0 auto;
    text-align: center;
}
.resetBox .step1{

}
.resetBox .step1 h2,.resetBox .step2 h2{
    font-size: 17px;
    /*font-weight: bold;*/
    color: #000000;
}
.resetBox .step1 p{
    font-size: 13px;
    color: #a4a4a4;
    margin-top: 5px;
    margin-bottom: 10px;
}
.resetBox .form-group{
    position: relative;
}
.resetBox .form-group input{
    height: 38px;
    /*line-height: 38px;*/
    font-size: 14px;
}
.resetBox .step1 .msgCode .form-control{
    width: 65%;
    float: left;
}
.resetBox .step1 .msgCode .form-control span{
    width: 33%;
    float: right;
    display: inline-block;
    height: 38px;
    line-height: 38px;
    text-align: center;
    font-size: 15px;
    border-radius: 4px;
    color: #fff;
}
.resetBox .step1 .msgCode span.sec{
    background: #becdd6;
}
.resetBox .step1 .msgCode span.sendCode{
    font-size: 14px;
    background: #00a8ff;
    cursor: pointer;
}
.resetBox .step1 .msgCode span.sendCode:hover{
    background: #09a2f2;
}
.resetBox .step1 .sign-button,.resetBox .step2 .sign-button {
    margin-top: 16px;
    background: #00a8ff;
}
.resetBox .step1 .sign-button:hover,.resetBox .step2 .sign-button:hover{
    background: #09a2f2;
}
.formTips {
    width: 150px;
    height: 38px;
    line-height: 38px;
    position: absolute;
    top: 0;
    right: -170px;
    color: #999;
    font-size: 12px;
    text-align: left;
}
.onError {
    color: #ff0000;
}
.resetBox .step2 h2{
    margin-bottom: 30px;
}
.resetBox .step2 .formTips{
    width: 280px;
    right: -300px;
}
</style>