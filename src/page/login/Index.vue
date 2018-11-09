<template>
    <div id="sign" class="">
		<div id="particles"></div>
        <div class="SignCenter">
			<div class="beginerDesk">
				<div class="allOpen">
					<div class="openUp" @click="goAddKindergarten">申请开通</div>
					<div class="openSplit">|</div>
					<div class="openUp" @click="goQRcode">手机版下载</div>
					<div class="openSplit">|</div>
					<div class="openUp" @click="qrCodeFB">联系客服</div>
				</div>
				<div class="AddKindergartenQRcode iconfont" @click="qRcodeAddKindergarten">
					&#xe73c;
					<div class="before"></div>
				</div>
			</div>
            <div class="beginerDesk1">
                <img src="static/images/title.png" class="title" />
            </div>
            <div id="beginerDesk2" class="beginerDesk2">
				<div class="teacherIdLogoBOX">
					<div class="teacherTitleBox" id="teacherTitleBox" @click="goLogin('teacher')">
						<div class="teacherIn">
							蜂堡办公
						</div>
						<img id="teacherIdLogo" class="teacherPhotos" src="static/images/teacherIdLogo.png">
						<div id="titleNameA" class="titleNameA">
							历经十年打造的<br />教育机构业务管理平台
						</div>
						<!-- <img id="mafinanceB" class="teacherPhotos" src="img/APP.png" style="display: none;">
						<div id="maWords" class="titleNameA" style="display: none;">
							扫描二维码<br /> 下载蜂堡办公系统手机版
						</div> -->
					</div>
					<div class="titleWordsA" @click="goLogin('teacher')">教师登录</div>
					<div class="titleWordsBack" style="display: none;">&#160;&#160;&#160;点我返回&#160;&#160;↑</div>
				</div>
			</div>
			<div class="beginerDesk3">
				<div class="FinanceIdLogoBOX">
					<div class="FinanceTitleBox" @click="goLogin('accountant')">
						<div class="FinanceIn">聚合学费</div>
						<img class="FinancePhotos" src="static/images/FinanceIdLogo.png">
						<div class="titleNameB">最适合教育机构的<br />收学费解决方案</div>

					</div>
					<div class="titleWordsB" @click="goLogin('accountant')">会计登录</div>
				</div>
			</div>
			
        </div>
		<div class="footer">
				<p>{{ $t("message.login.copyRight") }}</p>
				<p>{{ $t("message.login.ICP") }}</p>
			</div>
		<el-dialog :visible.sync="browserImg.imgPath!=''" :fullscreen="true" :show-close="true">
            <div class="browser" @click="hideBrowserImg">
                <div class="browserImg">
                    <img class="browserImg" :style="browserImg.styleObject" :src="browserImg.imgPath" alt="">
                    <div class="downloadQRCode" v-if="browserImg.download">
                        <div v-html="browserImg.download.text" style="text-align:center;"></div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>

// import Chatroom from '@/components/Chatroom'
// import main from '@/style/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import reset from '@/style/reset.css'
import common from '@/style/common.css'
import QRCode from 'qrcode';
import config from '@config';
import {aesEncrypt, aesDecrypt} from '@/config/AES';// AES加密解密算法
import {_setSession, _getSession,alertError } from '@/config/utils';
import {mapState, mapMutations} from 'vuex'
import { getCosByCosNum, login, getUUID, checkUUID, checkIP, getCosType,findAllStaffs,getPassword} from '@/js/api'
import particles from 'particles.js'

export default {
    name: 'Login',
    data :function() {
        return {
            
        }
    },
    mounted(){
		document.title = '蜂堡机构登录';
		// document.getElementById("titleIcon").href = 'static/cos.ico';
        let option = {
            "particles": {
                "number": {
                    "value": 60,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    // "image": {
                    //     "src": "img/github.svg",
                    //     "width": 100,
                    //     "height": 100
                    // }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 4,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 100,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "Window",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                        "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        }
        // console.log(particlesJS)
        particlesJS('particles',option);
    },
    computed:{
        ...mapState([
            'userInfo',
			'login',
			'browserImg'
        ])
    },
    methods:{
        ...mapMutations([
			'SAVE_USERINFO',
			'SET_BROWSERIMG'
		]),
		goLogin(type){
			if (type=="teacher") {
				// this.$router.push('/login');
				window.open(window.location.href.replace('index','login'));
			}else if (type=="accountant") {
				// window.location = "http://101.200.0.8:8060/COS888";
				window.open("http://101.200.0.8:8060/COS888");
			}
		},
		goQRcode(){
			this.SET_BROWSERIMG({
                imgPath:"static/images/cos_qrcode.png",
                styleObject:{
                    width:"300px",
                    height:"300px"
				},
				download:{
					text:"扫描二维码下载手机版蜂堡办公系统"
				}
            });
		},
		hideBrowserImg(){
            this.SET_BROWSERIMG({imgPath:""});
		},
		goAddKindergarten(){
			window.open("http://www.beehome.vip/addKindergarten/addKindergarten.html");
		},
		qRcodeAddKindergarten(){
			this.SET_BROWSERIMG({
                imgPath:"static/images/addKindergarten_qrcode.png",
                styleObject:{
                    width:"300px",
                    height:"300px"
				},
				download:{
					text:"扫描二维码申请开通园所"
				}
            });
		},
		qrCodeFB(){
			this.SET_BROWSERIMG({
                imgPath:"static/images/qrcode_fb.jpg",
                styleObject:{
                    width:"300px",
                    height:"300px"
				},
				download:{
					text:"微信扫一扫关注客服公众号“蜂堡”<br/>全国免费服务热线：400-101-0019 （工作日 08:00-19:00）"
				}
            });
		}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* 登录 注册 */
#sign{
    height: 100vh;
    /* min-width: 1000px; */
    width: 100vw;
	overflow:hidden;
    position: relative;
    /* background: url(../../img/webBg.png) 0 0/10px 10px; */
    display: flex;
	flex-direction: column;
	font-family: 'Montserrat', sans-serif;
	color: #fff;
	line-height: 1.3;
	-webkit-font-smoothing: antialiased;
	font-size: 16px;
}
.SignCenter{
    display: block;
	position: absolute;
	background-color: #fff;
	top:50%;
	left:50%;
	-webkit-transform: translateX(-50%) translateY(-50%);
	transform: translateX(-50%) translateY(-50%);
	/*border: 2px solid #ccc;*/
	width: 860px;
	height: 470px;
	-webkit-border-radius: 10px;
	border-radius: 10px;
	box-shadow: 2px 35px 20px -15px rgba( 102, 102, 102, 0.35);
	z-index: 2;
}
.beginerDesk{
	display: inline-block;
	width: 100%;
	height: 40px;
	overflow: hidden;
}
.allOpen{
	position: absolute;
	height: 15;
	display:flex;
	top: 16px;
	left: 50px;
}
.openUp {
	cursor: pointer;
	display: inline-block;
	height: 15;
	font-size: 12px;
	color: #38adff;
	z-index: 2;
}
.openSplit{
	display: inline-block;
	height: 15;
	font-size: 12px;
	line-height: 15px;
	margin:0 8px;
	color: #dddddd;
	z-index: 2;
}
.beginerDesk1 {
	/* margin-top: 40px; */
	display: inline-block;
	width: 100%;
	height: 72px;
}

.beginerDesk2 {
	margin-top: 12px;
	display: inline-block;
	width: 49.5%;
	height: 300px;
}
.title {
	display: block;
	width: 46%;
	margin-left: 27%;
	margin-top: 15px;
	text-align: center;
}
.teacherIdLogoBOX {
	margin-top: 4px;
	display: inline-block;
	height: 300px;
	width: 60%;
	margin-left: 31%;
}
.teacherTitleBox {
	padding-top: 24px;
	height: 230px;
	margin-left: 15%;
	width: 70%;
	background-color: rgb(97, 158, 249);
	-webkit-border-radius: 10px;
	border-radius: 10px;
	cursor: pointer;
}
.teacherIn {
	text-align: center;
	/* font-size: 16px; */
}
.teacherPhotos {
	margin-top: 20px;
	width: 54%;
	margin-left: 23%;
}
.titleNameA {
	margin-top: 10px;
	text-align: center;
	font-size: 13px;
	color: #dbebf7;
}
.titleWordsA {
	cursor: pointer;
	margin-top: 10px;
	font-size: 16px;
	color: #38afdd;
	text-align: center;
}
.beginerDesk3 {
	margin-top:12px;
	display: inline-block;
	width: 49.5%;
	height: 300px;
}
.FinanceIdLogoBOX {
	margin-top: 4px;
	display: inline-block;
	height: 300px;
	width: 60%;
	margin-left: 9%;
}
.FinanceTitleBox {
	padding-top: 24px;
	height: 230px;
	margin-left: 15%;
	width: 70%;
	background-color: rgb(87, 220, 175);
	-webkit-border-radius: 10px;
	border-radius: 10px;
	cursor: pointer;
}
.FinanceIn {
	text-align: center;
}
.FinancePhotos {
	margin-top: 22px;
	width: 52%;
	margin-left: 24%;
}
.titleNameB {
	padding-top: 14px;
	text-align: center;
	font-size: 13px;
	color: #e0f9ef;
}
.titleWordsB {
	cursor: pointer;
	margin-top: 10PX;
	font-size: 16px;
	color: #2adb94;
	text-align: center;
}
/* .footer{
	position: relative;
	bottom: 50px;
	width: 100%;
	padding: 20px 0;
} */
.footer{
	/* margin-top:135px; */
	display: inline-block;
	width: 100vw;
	position: fixed;
	bottom:10px;
	left:0;
	z-index: 3;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
	/* height: 85px; */
}
.footer p {
    clear: both;
    text-align: center;
    color: #000;
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
.downloadQRCode{
    padding-top:20px;
    display: flex;
    justify-content: center;
}
.downloadQRCode > div{
    display: inline-block;
    color:#fff;
    cursor: pointer;
}
.AddKindergartenQRcode{
	position: relative;
	width: 40px;
	height: 40px;
	font-size: 30px;
	line-height: 40px;
	text-align:center;
	color: #aaa;
	cursor: pointer;
}
.AddKindergartenQRcode .before{
	position: absolute;
	top: 0px;
	width: 0;
	height: 0;
	border-width:0 0 40px 40px;
	border-color: #fff transparent;
	border-style: solid;
}
#particles{
    position: absolute;
    width: 100%;
    height: 100%;
    left:0;
    top:0;
    background-color: #bbb;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    z-index:1;
}
</style>