<template>
    <div class="toolbar pull-left">
        <div class="bar LeftNav">
            <div class="LeftNav-item" :title="$t('message.mainHeader.my')">
                <div class="user">
                    <div id="loginuser" class="portrait" :odd-even="loginUser.userStaffID%2" :data-sex="loginUser.userSex%2" v-show="!imagePath">
                    {{firstChar}}
                    </div>
                    <!-- <img class="userPic Avatar--22"  v-show="imagePath" v-bind:src="imagePath||'../img/barBg.png'" /> -->
                    <div class="userPic Avatar--22" v-show="imagePath"><image-proxy :imagePath="userInfo.imagePath"></image-proxy></div>
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
            <div class="LeftNav-item iconfont-add bottomBtn"  addbtn @click.stop="changeFlag">
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
            <div class="LeftNav-item iconfont-more bottomBtn"  addbtn @click.stop="changeMoreFlag">
                <div>
                    <a class="iconfont">add</a>
                    <ul class="addPanel" v-bind:class="{hide:hideMoreflag}">
                        <li @click="downloadAPP"><a >{{ '下载手机版' }}</a></li>
                        <!-- <li id="addFriends"><a>添加好友</a></li> -->
                        <!-- <li id="addDiscussion"><a  ui-sref="main.discussionaddmember({iscreate: 'true', idorname: ''})">发起聊天</a></li> -->
                        <!-- <li id="addGroup"><a href="javascript:void (0)" ui-sref="main.searchgroup">加入群组</a></li> -->
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
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
            }
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
            return this.userInfo.imagePath.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/");
        },
        loginUser(){
            return this.userInfo;
        }
    },
    mounted(){
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
        changeFlag(){
            this.$emit("changeFlag",!this.hideflag);
            this.$emit("changeMoreFlag",true);
        },
        changeMoreFlag(){
            this.$emit("changeFlag",true);
            this.$emit("changeMoreFlag",!this.hideMoreflag);
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
    bottom: 85px;
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
    bottom: 15px;
    left: 0;
}
.iconfont-more div> a:after {
    content: "\E729";
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
    right: -76px;
    width: 100px;
    background: #fff;
    border-radius: 5px;
    display: flex;
    bottom:66px;
    flex-direction: column;
    z-index: 99;
    overflow: hidden;
}

.addPanel li {
    width: 100px;
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    display: block;
}

.addPanel li a {
    display: block;
    padding: 0 16px;
    color: #444444;

}

.addPanel li:not(:last-child) a {
    border-bottom: 1px solid #e1e9f1;
}

.addPanel li:hover {
    background: #e1e9f1;
}

</style>