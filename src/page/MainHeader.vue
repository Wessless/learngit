<template>
    <div class="toolbar pull-left">
        <div class="bar LeftNav">
            <div class="LeftNav-item" :title="$t('message.mainHeader.my')" @click="showCurrUserInfo">
                <div class="user">
                    <div id="loginuser" class="portrait" :odd-even="loginUser.userStaffID%2" :data-sex="loginUser.userSex%2" v-show="!imagePath">
                    {{firstChar}}
                    </div>
                    <!-- <img class="userPic Avatar--22"  v-show="imagePath" v-bind:src="imagePath||'../img/barBg.png'" /> -->
                    <!-- <div class="userPic Avatar--22" v-show="imagePath"><image-proxy :imagePath="userInfo.imagePath"></image-proxy></div> -->
                    <div class="userPic Avatar--22" v-show="imagePath"><img :src="imagePath" alt=""></div>
                    <!-- <i class="Presence Presence--stacked Presence--toolbar"></i> -->
                </div>
            </div>
            <router-link class="LeftNav-item iconfont-single"  :title="$t('message.mainHeader.conversation')" v-bind:class="{ 'cur': ($route.meta.pageType=='conversation') }" :to="'/mainpage/conversation'">
                <div class="singleChat">
                    <a >chat</a>
                    <i class="badge bg-tred" v-show="totalUnreadCount>0">{{totalUnreadCount>99 ? "99+" : totalUnreadCount}}</i>
                </div>
            </router-link>
            <router-link class="LeftNav-item iconfont-group"  :title="$t('message.mainHeader.contacts')" v-bind:class="{ 'cur': $route.meta.pageType=='friendList' }" :to="'/mainpage/friendList'">
                <div class="groupChat">
                    <a>friend list</a>
                    <i class="Presence Presence--stacked" v-show="mainData.notification.hasNewNotification"></i>
                </div>
            </router-link>
            <router-link class="LeftNav-item iconfont iconfont-cloud"  :title="$t('message.mainHeader.cloudDisk')" v-bind:class="{ 'cur': $route.meta.pageType=='cloudDisk' }" @click="removeChat" :to="'/mainpage/cloudDisk/mydisk/-1'">
                <div class="groupChat" v-show="$route.meta.pageType!='cloudDisk'" @click="removeChat">
                    &#xe655;
                </div>
                <div class="groupChat" v-show="$route.meta.pageType=='cloudDisk'" @click="removeChat">
                    &#xe654;
                </div>
            </router-link>
            <router-link class="LeftNav-item iconfont iconfont-office"  :title="$t('message.mainHeader.office')" v-bind:class="{ 'cur': $route.meta.pageType=='office' }" @click="removeChat" :to="'/mainpage/office'">
                <div class="groupChat" v-show="$route.meta.pageType!='office'" @click="removeChat">
                    &#xe720;
                </div>
                <div class="groupChat" v-show="$route.meta.pageType=='office'" @click="removeChat">
                    &#xe71f;
                </div>
            </router-link>
            <router-link class="LeftNav-item iconfont iconfont-group iconfont-add" style="font-size: 32px;" v-show="userInfo.mobile" :title="'集团'" v-bind:class="{ 'cur': $route.meta.pageType=='group' }" @click="removeChat" :to="'/mainpage/group'">
                <div class="groupChat groupItem" v-show="$route.meta.pageType!='group'" @click="removeChat">
                    &#xe805;
                </div>
                <div class="groupChat groupItem" v-show="$route.meta.pageType=='group'" @click="removeChat">
                    &#xe807;
                </div>
                <!-- <div class="groupItem">集团</div> -->
                <!-- <div class="allItem" @click="removeChat">
                    <div class="groupItem" :class="{'selected':$route.meta.pageType=='group'}">集团</div>
                </div> -->
            </router-link>

            <div class="LeftNav-item iconfont-add bottomBtn hide"  addbtn @click.stop="changeFlag">
                <div>
                    <a class="iconfont">add</a>
                    <ul class="addPanel" v-bind:class="{hide:hideflag}">
                        <li id="createGroup" @click="createGroup"><a >{{ $t("message.mainHeader.createGroup") }}</a></li>
                        <!-- <li id="addFriends"><a>添加好友</a></li> -->
                        <!-- <li id="addDiscussion"><a  ui-sref="main.discussionaddmember({iscreate: 'true', idorname: ''})">发起聊天</a></li> -->
                        <!-- <li id="addGroup"><a href="javascript:void (0)" ui-sref="main.searchgroup">加入群组</a></li> -->
                    </ul>
                </div>
            </div>
            <div class="LeftNav-item iconfont-more bottomBtn" :title="cosName" addbtn @click.stop="changeMoreFlag">
                <div>
                    <a class="iconfont textShow">{{ cosNum }}</a>
                    <ul class="addPanel" v-bind:class="{hide:hideMoreflag}">
                        <li style="background:#ffd700;"><div class="text">{{ cosName }}</div></li>
                        <li @click="linkToKindgarden" v-show="userInfo.cosType!='0'&&kindgardenURL"><a >{{ '幼儿园官网' }}</a></li>
                        <li @click="showKindgardenQRCode" v-show="userInfo.cosType!='0'&&kindgardenQRCode.length>0"><a >{{ '园所二维码' }}</a></li>
                        <li @click="downloadAddNewChild" v-show="userInfo.cosType!='0'&&addNewChildQRCode"><a >{{ '招生二维码' }}</a></li>
                        <li @click="downloadAPP"><a >{{ '手机版下载' }}</a></li>
                        <li @click="quitLogin"><a >{{ '退出登录' }}</a></li>
                        <!-- <li id="addFriends"><a>添加好友</a></li> -->
                        <!-- <li id="addDiscussion"><a  ui-sref="main.discussionaddmember({iscreate: 'true', idorname: ''})">发起聊天</a></li> -->
                        <!-- <li id="addGroup"><a href="javascript:void (0)" ui-sref="main.searchgroup">加入群组</a></li> -->
                    </ul>
                </div>
            </div>
            <!-- <div class="cosType">
                <div class="type">{{cosTypeName}}</div>
                <div class="status">{{cosStatusName}}</div>
            </div> -->
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import {getQRCode,getSettingValue,getQRPng,getTableName} from '@/js/api'
import { showLoading,closeLoading ,alertError} from '@/config/utils'
import imageProxy from '@/components/chat/ImageProxy'

export default {
    name: 'MainHeader',
    props: {
        hideflag:{
            type:Boolean,
            default:true
        },
        hideMoreflag:{
            type:Boolean,
            default:true
        },
        emit:{
            type:String
        }
    },
    data(){
        return {
            // addBtnHide:true,
            mainData:{
                notification:{
                    hasNewNotification:false
                }
            },
            kindgardenURL: '',
            addNewChildQRCode:'',
            kindgardenQRCode:[],
            cosStatusName:"",
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'login',
            'totalUnreadCount',
        ]),
        firstChar(){
            let userName = this.userInfo.userName;
            return userName.substr(userName.length-2<0?0:userName.length-2,userName.length);
        },
        imagePath(){
            return this.userInfo.imagePath.replace("../../../",this.userInfo.currProxy+'/COS'+this.userInfo.cosNum+'/');
        },
        loginUser(){
            return this.userInfo;
        },
        cosNum(){
            if(this.userInfo.cosNum){
                return this.userInfo.cosNum;
            }else{
                return "";
            }
        },
        cosName(){
            if(this.userInfo.cosName){
                return this.userInfo.cosName;
            }else{
                return "";
            }
        },
        cosTypeName(){
            if(this.userInfo.cosType=='1'){
                return '幼儿园';
            }else if(this.userInfo.cosType=='2'){
                return '培训学校';
            }else if(this.userInfo.cosType=='3'){
                return '学校';
            }else{
                return '';
            }
        }
    },
    mounted(){
        this.getKindgardenURL();
        this.getAddNewChildQRCode();
        this.getQRPng();
        
    },
    components:{
        imageProxy
    },
    methods:{
        ...mapMutations([
            'SET_CURRCONVERSATION',
            'SET_CURRFRIENDLIST',
            'SET_BROWSERIMG'
        ]),
        showCurrUserInfo(){
            this.$emit("clickUserInfo",true);
        },
        changeFlag(){
            this.$emit("changeFlag",!this.hideflag);
            this.$emit("changeMoreFlag",true);
        },
        changeMoreFlag(){
            this.$emit("changeFlag",true);
            this.$emit("changeMoreFlag",!this.hideMoreflag);
        },
        quitLogin(){
            this.$emit("quitLogin",true);
        },
        createGroup(){
            // 显示消息组件
            this.SET_CURRCONVERSATION(null);
            // 隐藏员工（群组）信息组件
            this.SET_CURRFRIENDLIST({type:"creatGroup"});
            // 路由跳转到员工路由
            this.$router.push('/mainpage/friendList/createGroup');
        },
        removeChat(){
            // 显示消息组件
            this.SET_CURRCONVERSATION(null);
            // 隐藏员工（群组）信息组件
            this.SET_CURRFRIENDLIST(null);
        },
        downloadAPP(){
            this.SET_BROWSERIMG({
                imgPath:"static/images/cos_qrcode.png",
                styleObject:{
                    width:"300px",
                    height:"300px"
                }
            });
        },
        getAddNewChildQRCode(){
            getQRCode().then((result)=>{
                this.addNewChildQRCode = result.data.result;
                
            }).catch((err)=>{
                // alertError(this,"1064")
                console.log('err:1064')
                console.log(err)
            });
        },
        downloadAddNewChild(){
            let url = this.addNewChildQRCode;
            this.SET_BROWSERIMG({
                imgPath : url,//"http://101.200.0.8:8060/COS"+this.userInfo.cosNum+"/Data/system_release/kindergarten_qrcode.png",
                styleObject : {
                    width:"300px",
                    height:"300px"
                },
                download:{
                    url:this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/Data/system_release/enrollment/enrollment.zip",
                    text:"下载二维码"
                }
            });
        },
        getKindgardenURL(){
            let setting = 'HOME_PAGE';
            getSettingValue(setting).then((result)=>{
                let settingValue = result.data[setting];
                if(settingValue&&settingValue!='null'){
                    this.kindgardenURL = settingValue;//'http://www.baidu.com';
                }
            }).catch((err)=>{
                // alertError(this,"1211");
                console.log('err:1211')
                console.log(err)
            });
        },
        getQRPng(){
            getQRPng()
            .then((result)=>{
                if(result.data.result){
                    let strArr = result.data.result.split(',');
                    let objArr = [];
                    for(let i=0;i<strArr.length;i++){
                        let nameArr = strArr[i].split('|');
                        if(nameArr[0]=='public_number'){
                            objArr.push({
                                url:nameArr[1],
                                name:'公众号二维码'
                            });
                        }
                        if(nameArr[0]=='life_number'){
                            objArr.push({
                                url:nameArr[1],
                                name:'生活号二维码'
                            });
                        }
                        if(nameArr[0]=='school_number'){
                            objArr.push({
                                url:nameArr[1],
                                name:'校园号二维码'
                            });
                        }
                    }
                    this.kindgardenQRCode = objArr;
                }
            })
            .catch((err)=>{
                console.log('err:1306')
                console.log(err)
            });
        },
        showKindgardenQRCode(){
            this.$emit("showKindgardenQRCode",this.kindgardenQRCode);
        },
        linkToKindgarden(){
            window.open(this.kindgardenURL);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.bg-tred {
    background-color: #ff5b5b;
}
.user .portrait{
  height: 40px;
  width: 40px;
  font-size: 14px;
  line-height: 40px;
  margin-top: 18px;
}
/*  toolbar  */
.toolbar {
    width: 70px;
    height: 100vh;
    position: fixed;
    z-index: 9;
    left:0;
    top:0;
}

.LeftNav {
    float: left;
    width: 70px;
    height: 100%;
    position: relative;
    text-align: center;
    background: url(../img/barBg.png) repeat-y;
}

/*.LeftNav .LeftNav-item:first-child{ margin-top: 20px;}*/
.LeftNav-item {
    color: #444;
    width: 70px;
    height: 70px;
    display: block;
    cursor: pointer;
    font-size: 26px;
    transition: background .2s linear;
    line-height: 75px;
}

.LeftNav-item div> a {
    float: left;
    width: 70px;
    height: 36px;
    text-indent: -9999px;
    margin-top: 17px;
}

.LeftNav-item div> .textShow{
    color:#fff;
    line-height: 38px;
    text-indent: 0px;
    display: block;
}

.LeftNav-item div> .textShow:after{
    display: block;
    position: absolute;
    width:50px;
    height:50px;
    border-radius: 50%;
    border:2px solid #ffffff;
    content:"";
    left:50%;
    top:50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
}

.allItem{
    width: 100%;
    height: 100%;
    position: relative;
}

.groupItem{
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width:50px;
    height:50px;
    border-radius: 50%;
    border:2px solid #ffffff;
    content:"";
    left:50%;
    top:50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    color: #ffffff;
    font-size: 30px;
}

.selected{
    background: #ffffff;
    color: #38adff;
}

.iconfont-single a {
    background: url(../img/icons.png) 17px 0/108px auto no-repeat;

}
.iconfont-single a:hover,.iconfont-single.cur a {
    background-position: -42px 0;
    background-size: 100px auto;
}

.iconfont-group a {
    background: url(../img/icons.png) 17px -36px/100px auto no-repeat;
}

.iconfont-group a:hover,.iconfont-group.cur a {
    background-position: -43px -36px;
}

.bottomBtn div> a:after {
    font-size: 30px;
    color: #ffffff;
    position: absolute;
    left:0;
    top:0;
    width: 70px;
    height: 70px;
    display: block;
    text-indent: 0px !important;
}

.iconfont-add {
    position: absolute;
    bottom: 105px;
    left: 0;
}
/* .iconfont-add div> a {
    background: url(../img/icons.png) 23px -70px/100px auto no-repeat;
} */
.iconfont-add div> a:after {
    content: "\E6b9";
}
.iconfont-more{
    position: absolute;
    bottom: 35px;
    left: 0;
}
.iconfont-more div> a:after {
    /* content: "\E729"; */
}
.LeftNav-item:active, .LeftNav-item:focus, .LeftNav-item:hover {
    background: rgba(55, 55, 55, 0.1);
}
.LeftNav-item.cur {
    background: rgba(55, 55, 55, 0.1);
}

.LeftNav-item.is-active {
    /*color: #fff;
    background: #82c547*/
}

.LeftNav-item .Presence {
    border-color: #00a0ff
}

.LeftNav-item.is-active .Presence {
    display: none
}

.userPic {
    border-radius: 50%;
    background-size: cover;
    width: 40px;
    height: 40px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    position: relative;
}

.userPic > img{
    width:100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.Presence--toolbar {
    left: 16px;
    top: 18px;
}

.RightNav-item .Presence {
    border-color: #fff;
}

.user,.singleChat,.groupChat {
    position: relative !important;
    color: #ffffff;
}

.singleChat .badge {
    position: absolute;
    margin: 0;
    top: 8px;
    left: 36px;
    padding: 3px 5px;
    font-size: 12px;
    font-style: normal;
    font-weight: normal;
}
.groupChat .Presence{
    background: #ff5b5b;
    top: 20px;
    right: 14px;
}
/*添加按钮*/
.addPanel {
    position: absolute;
    left: 50px;
    /* width: 100px; */
    background: #fff;
    border-radius: 5px;
    display: flex;
    bottom:66px;
    flex-direction: column;
    z-index: 99;
    overflow: hidden;
}

.addPanel li {
    /* width: 100px; */
    /* height: 40px; */
    line-height: 40px;
    font-size: 13px;
    display: block;
}

.addPanel li a {
    display: block;
    padding: 0 16px;
    color: #444444;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}

.addPanel li .text {
    display: block;
    padding: 0 16px;
    color: #444444;
    height: 40px;
    border-bottom: 1px solid #e1e9f1;
    line-height: 40px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}

.addPanel li:not(:last-child) a {
    border-bottom: 1px solid #e1e9f1;
}

.addPanel li:hover {
    background: #e1e9f1;
}
.currUserInfo{
    width:100%;
    height: 100%;
    background:#38adff;
}
.cosType{
    position:absolute;
    height: 35px;
    width:100%;
    /* background:#FF9D00; */
    bottom:0;
    font-size: 12px;
    text-align: center;
    color: #FF9D00;
}
</style>