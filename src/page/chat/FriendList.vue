<template>
    <div class="mainBox pull-left">
        <vue-context-menu :contextMenuData="contextMenuData" @deleteConversation="deleteConversation" @setTop="setTop"></vue-context-menu>
        <div id="search-friend" v-show="$route.meta.pageType!='cloudDisk'&&$route.meta.pageType!='office'">
            <search-input :placeholder="$t('message.friendList.search')"></search-input>
        </div>
        <div id="chatArea" class="chatArea" v-show="$route.meta.pageType=='conversation'&&!switchbtn.issearchList">
            <p class="withoutFriends" style="text-align:center;margin-top: 200px;" v-show="!mainData.conversation.conversations||!mainData.conversation.conversations.length">{{ $t("message.friendList.withoutFriends") }}</p>
            <conversation v-for="(item,index) in mainData.conversation.conversations" :key="index" :item="item" :friendList="friendArray" @childRightClick="childRightClick"></conversation>
        </div>
        <div class="communicateList" v-show="$route.meta.pageType=='friendList'&&!switchbtn.issearchList">
            <!-- <div class="noticeBar">
                <div class="noticeBarHeader">新消息</div>
                <div class="noticeBarBody">
                    <div class="noticeBarList">
                        <div class="notice_item ">
                            <div class="photo">
                                <img class="img" src="../../img/noticeIcon.png" alt="通知">
                            </div>
                            <div class="info" ng-click="tonotification()">
                                <h3 class="nickname">
                                    <span class="nickname_text">新通知</span>
                                </h3>
                            </div>
                            <i class="Presence Presence--noticeBar unread" v-show="mainData.notification.hasNewNotification"></i>
                        </div>
                    </div>
                </div>
            </div> -->
            <div class="groupArea">
                <div class="groupAreaHeader" @click="showgroups=!showgroups">{{ $t('message.friendList.group') }}<span class="caret" v-bind:class="{'open':showgroups}"></span></div>
                <div class="groupAreaBody" v-show="showgroups">
                    <group-item v-for="(item,index) in groupArray" :key="index" :item="item" :friendList="friendArray" class="noticeBarList"></group-item>
                </div>
            </div>
            <div class="membersArea">
                <div class="membersAreaHeader" @click="showfriends=!showfriends">{{ $t('message.friendList.contacts') }}<span class="caret" v-bind:class="{'open':showfriends}"></span></div>
                <div class="membersAreaBody" v-show="showfriends">
                    <friend-item v-for="(item,index) in friendArray" :key="index" :item="item" class="members_item"></friend-item>
                </div>
            </div>
        </div>
        <div v-show="$route.meta.pageType=='cloudDisk'">
            <cloud-disk-item v-for="(item,index) in mainData.cloudDiskList" :key="index" :item="item"></cloud-disk-item>
        </div>
        <div v-show="$route.meta.pageType=='office'">
            <office-item v-for="(item,index) in mainData.officeList" :key="index" :item="item"></office-item>
        </div>
    </div>
</template>

<script>

import searchInput from '@/components/chat/SearchInput'
import vueContextMenu from '@/components/chat/VueContextMenu'
import conversation from '@/page/chat/Conversation'
import groupItem from '@/page/chat/GroupItem'
import friendItem from '@/page/chat/FriendItem'
import cloudDiskItem from '@/page/cloudDisk/CloudDiskItem'
import officeItem from '@/page/office/OfficeItem'
import {mapState, mapMutations, mapActions} from 'vuex'
import { rong_getConversationList,rong_getConversation,rong_removeConversation,rong_setConversationToTop,rong_clearUnreadCount,rong_SendSyncReadStatusMessage } from '@/js/rongCloud'
import { findAllStaffs,getGroupsByStaffID,findStaffsByStaffIDs,findChildrenByChildIDs,getGroupsByID } from '@/js/api'

export default {
    name: 'FriendList',
    data :function() {
        return {
            showfriends:false,//是否显示联系人
            showgroups:false,//是否显示群组
            switchbtn: {
                isFriendList:true,
                issearchList: false
            },
            mainData:{
                conversation:{
                    conversations: []
                },
                notification:{
                    hasNewNotification:true
                },
                contactsList:{
                    subgroupList:[],
                    groupList:[],
                    friendList:[]
                },
                cloudDiskList:[
                    {
                        title:"我的文件",
                        imagePath:"&#xe83c;",
                        content:"",
                        name:"mydisk",
                        url:"/mainpage/cloudDisk/mydisk"
                    },{
                        title:"业务文件",
                        imagePath:"&#xe6a2;",
                        content:"",
                        name:"business",
                        url:"/mainpage/cloudDisk/business"
                    }
                ],
                officeList:[
                    {
                        title:"常用",
                        content:"",
                        name:"1",
                        url:"/mainpage/office/1",
                        imgUrl:"static/images/office/common.png",
                        styleObj:{
                            background:"#38adff"
                        }
                    },{
                        title:"人事管理",
                        content:"",
                        name:"2",
                        url:"/mainpage/office/2",
                        imgUrl:"static/images/office/personnel.png",
                        styleObj:{
                            background:"#4dc060"
                        }
                    },{
                        title:"财务管理",
                        content:"",
                        name:"3",
                        url:"/mainpage/office/3",
                        imgUrl:"static/images/office/financial.png",
                        styleObj:{
                            background:"#ff9d00"
                        }
                    },{
                        title:"市场管理",
                        content:"",
                        name:"4",
                        url:"/mainpage/office/4",
                        imgUrl:"static/images/office/market.png",
                        styleObj:{
                            background:"#e51c23"
                        }
                    },{
                        title:"行政管理",
                        content:"",
                        name:"5",
                        url:"/mainpage/office/5",
                        imgUrl:"static/images/office/administrative.png",
                        styleObj:{
                            background:"#932cd8"
                        }
                    }
                ]
            },
            // contextmenu data (菜单数据)
            contextMenuData: {
                menuName: 'conversation',
                // The coordinates of the display(菜单显示的位置)
                axios: {
                    x: null,
                    y: null
                },
                // Menu options (菜单选项)
                menulists: [
                    {
                        fnHandler: 'deleteConversation', // Binding events(绑定事件)
                        btnName: '删除会话' // The name of the menu option (菜单名称)
                    },
                    // {
                    //     fnHandler: 'setTop',
                    //     btnName: '设为置顶'
                    // }
                ],
                menuData:null
            },
            setTopInfo:{
                targetId:null,
                conversationType:null,
                isTop:false
            }
        }
    },
    mounted(){
        this.rong_init().then((userId) => {
            this.getConversationList();
        })
        // this.findAllStaffs();
        this.getGroupsByStaffID();
        if(this.userInfo.cosType=="1"){
            this.mainData.officeList.push({
                title:"幼儿管理",
                content:"",
                name:"6",
                url:"/mainpage/office/6",
                imgUrl:"static/images/office/childAdmin.png",
                styleObj:{
                    background:"#42CBFA"
                }
            });
        }
    },
    components:{
        searchInput,
        vueContextMenu,
        conversation,
        groupItem,
        friendItem,
        cloudDiskItem,
        officeItem
    },
    computed:{
        ...mapState([
            'userInfo',
            'totalUnreadCount',
            'allStaffs',
            'currConversation',
            'currNewMessage',
            'myGroups',
        ]),
        friendArray(){
            if(this.allStaffs){
                return this.allStaffs;
            }else{
                return [];
            }
        },
        groupArray(){
            if(this.myGroups){
                return this.myGroups;
            }else{
                return [];
            }
        },
        listenCurrConversation() {  
            return this.currConversation;  
        },
        listenCurrNewMessage() {  
            return this.currNewMessage;  
        },
    },
    watch:{
        listenCurrConversation(newVal,oldVal){// 监听store中currConversation变化切换消息列表选中值
            if(newVal){
                let targetId = newVal.targetId;
                let conversations = this.mainData.conversation.conversations;
                for(let i=0;i<conversations.length;i++){
                    if(conversations[i].targetId == targetId){
                        // 清除当前未读数
                        conversations[i].unreadMessageCount = 0;
                        rong_clearUnreadCount(conversations[i].conversationType, conversations[i].targetId, (data) => {
                            if(data){
                                rong_SendSyncReadStatusMessage(conversations[i].conversationType, conversations[i].targetId, conversations[i].latestMessage.sentTime);
                                this.setTotalUnreadCount();
                            }
                        });
                    }
                }
            }
        },
        listenCurrNewMessage(newVal,oldVal){
            if(newVal){
                if(newVal.messageType == "CommandMessage"){// 已读消息
                    if(newVal.senderUserId==this.userInfo.cosNum+"_"+this.userInfo.userStaffID){
                        rong_clearUnreadCount(newVal.conversationType, newVal.targetId, (data) => {
                            if(data){
                                this.setTotalUnreadCount();
                            }
                        });
                    }
                }else if(newVal.messageType == "SyncReadStatusMessage"){// 同步未读数消息:RC:SRSMsg

                }else{// 会话消息
                    if(this.currConversation&&this.currConversation.targetId==newVal.targetId){

                    }else{
                        this.SET_TOTALUNREADCOUNT(this.totalUnreadCount+1);
                    }
                    let conversations = this.mainData.conversation.conversations;
                    let isNewConversation = true;
                    let toTopConversation = null;
                    for(let i=0;i<conversations.length;i++){
                        if(conversations[i].targetId==newVal.targetId){
                            isNewConversation = false;
                            toTopConversation = { index: i, data: conversations[i] };
                        }
                    }
                    if(isNewConversation){
                        this.newConversationLoad(newVal);
                    }else{
                        conversations.splice(toTopConversation.index,1);
                        conversations.splice(0,0,toTopConversation.data);
                    }
                }
                // message.type = "message";
                // this.conversationMsgList.splice(0, 0, message);
            }
        },
    },
    methods:{
        ...mapMutations([
            'SET_TOTALUNREADCOUNT',
            'SET_CURRCONVERSATION',
            'SET_ALLSTAFFS',
            'SET_MYGROUPS',
        ]),
        ...mapActions([
            'rong_init',
            'rong_getTotalUnreadCount'
        ]),
        // 加载会话列表
        getConversationList(){
            let instance = RongIMClient.getInstance();
            rong_getConversationList(instance,(data) => {
                let childArr = [],staffArr = [],groupArr = [],childObjArr = [],staffObjArr = [],groupObjArr = [];
                // 获取未读数
                this.rong_getTotalUnreadCount();
                
                for(let i=0;i<data.length;i++){
                    let childID = JSON.parse(data[i].latestMessage.content.extra).childID;
                    if(childID){// 幼儿
                        childArr.push(childID);
                        childObjArr.push(data[i]);
                    }else{
                        if(data[i].targetId.split("_")[0]=="g"){// 群组
                            groupArr.push(data[i].targetId.split("_")[2]);
                            groupObjArr.push(data[i]);
                        }else{// 员工
                            staffArr.push(data[i].targetId.split("_")[1]);
                            staffObjArr.push(data[i]);
                        }
                    }
                }
                
                let staffs = findStaffsByStaffIDs(staffArr.toString());
                let groups = getGroupsByID(groupArr.toString(),this.userInfo.cosNum);
                let childs = findChildrenByChildIDs(childArr.toString());
                
                Promise.all([staffs,groups,childs]).then(([staffData,groupData,childData]) => {
                    let staffList = staffData.data.data;
                    let groupList = groupData.data.data;
                    let childList = childData.data.data;
                    let newData = [];
                    // 获取到数据并加入到消息列表数据中
                    for(let i=0;i<staffList.length;i++){
                        let staffID = staffList[i].StaffID;
                        for(let j=0;j<staffObjArr.length;j++){
                            if(staffObjArr[j].targetId.split("_")[1]==staffID){
                                staffObjArr[j].chatInfo = staffList[i];
                                staffObjArr[j].chatInfo.chatType = "staff";
                                newData.push(staffObjArr[j]);
                            }
                        }
                    }
                    for(let i=0;i<groupList.length;i++){
                        let groupID = groupList[i].ID.toString();
                        for(let j=0;j<groupObjArr.length;j++){
                            if(groupObjArr[j].targetId.split("_")[2]==groupID){
                                groupObjArr[j].chatInfo = {
                                    StaffID: groupList[i].ID,
                                    StaffName: groupList[i].GroupName,
                                    ImagePath: groupList[i].Portraiturl,
                                    Staffs: groupList[i].Staffs,
                                    length: groupList[i].Staffs.split(",").length,
                                    chatType:"group",
                                };
                                newData.push(groupObjArr[j]);
                            }
                        }
                    }
                    for(let i=0;i<childList.length;i++){
                        let childID = childList[i].Id;
                        for(let j=0;j<childObjArr.length;j++){
                            if(JSON.parse(childObjArr[j].latestMessage.content.extra).childID==childID){
                                childObjArr[j].chatInfo = childList[i];
                                // let connectPeople = childList[i].ConnectPeople?childList[i].ConnectPeople:'家长';
                                let connectPeople = '家长';
                                childObjArr[j].chatInfo = {
                                    StaffID: childList[i].Id,
                                    StaffName: childList[i].ChildName + connectPeople,
                                    ImagePath: childList[i].ImagePath,
                                    Sex: childList[i].ChildSex,
                                    chatType:"child",
                                }
                                newData.push(childObjArr[j]);
                            }
                        }
                    }
                    // 排序并渲染列表
                    data.sort(function(a,b){
                        return (b.sentTime?b.sentTime:b.receivedTime) - (a.sentTime?a.sentTime:a.receivedTime);
                    });
                    this.mainData.conversation.conversations = data;
                });
            });
        },
        // 设置未读总数
        setTotalUnreadCount(){
            let totalUnreadCount = 0;
            let data = this.mainData.conversation.conversations;
            for(let i=0;i<data.length;i++){
                totalUnreadCount = totalUnreadCount + data[i].unreadMessageCount;
            }
            this.SET_TOTALUNREADCOUNT(totalUnreadCount);
        },
        // 会话右键事件，显示右键菜单
        childRightClick(data){
            if(data.isTop){
                this.contextMenuData.menulists[1] = {
                    fnHandler: 'setTop',
                    btnName: '取消置顶'
                }
                this.setTopInfo.isTop = true;
            }else{
                this.contextMenuData.menulists[1] = {
                    fnHandler: 'setTop',
                    btnName: '设为置顶'
                }
                this.setTopInfo.isTop = false;
            }
            this.contextMenuData.axios = data.axios;
            this.contextMenuData.menuData = data.menuData;
            this.setTopInfo.targetId = data.menuData.targetId;
            this.setTopInfo.conversationType = data.menuData.conversationType;
        },
        // 删除会话
        deleteConversation(conversation){
            rong_removeConversation(conversation.conversationType,conversation.targetId,(result) => {
                if(result.result){
                    let data = this.mainData.conversation.conversations;
                    for(let i=0;i<data.length;i++){
                        if(data[i].targetId == conversation.targetId){
                            data.splice(i,1);
                            if(this.currConversation.targetId == conversation.targetId){
                                this.SET_CURRCONVERSATION(null);
                            }
                        }
                    }
                }
            });
        },
        // 会话置顶（已废弃）
        setTop(){
            rong_setConversationToTop(this.setTopInfo.conversationType,this.setTopInfo.targetId,!this.setTopInfo.isTop,(result)=>{
                if(result){
                    let data = this.mainData.conversation.conversations;
                    for(let i=0;i<data.length;i++){
                        if(data[i].targetId==this.setTopInfo.targetId){
                            data[i].isTop = !this.setTopInfo.isTop;
                        }
                    }
                }
            });
        },
        newConversationLoad(msgObj){
            if(msgObj.objectName == "RC:CmdMsg") return;
            if(msgObj.objectName == "RC:SRSMsg") return;
            rong_getConversation(msgObj.conversationType,msgObj.targetId,(data) => {
                let extraJSON=JSON.parse(msgObj.content.extra);
                if(extraJSON.childID==null){
                    if(msgObj.targetId.split('_')[0]=="g"){//群组
                        let groupID = msgObj.targetId.split('_')[2];
                        getGroupsByID(groupID,this.userInfo.cosNum).then((response) => {
                            if(response){
                                if(response.data.data.length>0){
                                    var info = response.data.data[0];
                                    data.chatInfo = {
                                        StaffID: info.ID,
                                        StaffName: info.GroupName,
                                        ImagePath: info.Portraiturl,
                                        Staffs: info.Staffs,
                                        length: info.Staffs.split(",").length,
                                        chatType:"group",
                                    };
                                    this.mainData.conversation.conversations.splice(0,0,data);
                                }
                            }
                        });
                    }else{// 员工
                        let staffID = msgObj.targetId.split('_')[1];
                        findStaffsByStaffIDs(staffID).then((response) => {
                            if(response){
                                if(response.data.data.length>0){
                                    data.chatInfo = response.data.data[0];
                                    data.chatInfo.chatType = "staff";
                                    this.mainData.conversation.conversations.splice(0,0,data);
                                }
                            }
                        });
                    }
                }else{// 如果是幼儿时
                    findChildrenByChildIDs(extraJSON.childID).then((response) => {
                        if(response){
                            if(response.data.data.length>0){
                                let info = response.data.data[0];
                                let connectPeople = '家长';
                                data.chatInfo = {
                                    StaffID: info.Id,
                                    StaffName: info.ChildName + connectPeople,
                                    ImagePath: info.ImagePath,
                                    Sex: info.ChildSex,
                                    chatType:"child",
                                };
                                this.mainData.conversation.conversations.splice(0,0,data);
                            }
                        }
                    });
                }
            });
        },
        // cosapp接口
        getGroupsByStaffID(){
            let staffID = this.userInfo.cosNum+"_"+this.userInfo.userStaffID;
            let cosNum = this.userInfo.cosNum;
            Promise.all([getGroupsByStaffID(staffID,cosNum),findAllStaffs()]).then((result) => {
                let response = result[0];
                let allStaffs = result[1];
                if(allStaffs){
                    if(allStaffs.data.data.length>0){
                        this.SET_ALLSTAFFS(allStaffs.data.data)
                    }
                }
                if(response){
                    if(response.data.data.length>0){
                        this.SET_MYGROUPS(response.data.data);
                    }
                }
            })
            
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* @import '../../style/main.css'; */

#search-friend{
    position: fixed;
    width:314px;
    top:0;
    z-index:8;
}
#chatArea{
    margin-top: 54px;
}
.chatArea {
    border-top: 1px solid #e1e9f1;
    overflow-y: auto;
}
/*  mainBox  */
.mainBox {
    /*width: 230px;*/
    width: 314px;
    height: 100vh;
    position: fixed;
    background-color: #F4F8FC;
    overflow: hidden;
    display:flex;
    flex-direction: column;
    z-index: 6;
    left:70px;
    top:0;
}
/**/ 
.withoutFriends{
    color: #c1cdda;
    font-size: 14px;
    padding-left: 40px;
}
#chatArea .withoutFriends{
    padding-left:0!important;
}
/* .communicateList */
.communicateList {
    margin-top: 54px;
    flex:1;
    height:100%;
    overflow: auto;
}
.communicateList .cur{
    background: #dde7f0;
}
.communicateList .noticeBar, .communicateList .groupArea, .communicateList .membersArea , .communicateList .publicArea{
    /*width: 90%;
    margin: 0 auto;*/
    position: relative;
}

.communicateList .noticeBar .noticeBarHeader, .communicateList .groupArea .groupAreaHeader, .communicateList .membersArea .membersAreaHeader {
    background: #e9f0f8;
    height: 36px;
    line-height: 36px;
    padding-left: 24px;
    cursor: pointer;
}
.communicateList .noticeBar .noticeBarHeader:hover, .communicateList .groupArea .groupAreaHeader:hover, .communicateList .membersArea .membersAreaHeader:hover{
  color: #0099ff;
}

.notice_item, .members_item {
    /*overflow: hidden;*/
    padding: 12px 12px 5px;
    cursor: pointer;
    position: relative;
}
.noticeBarBody .notice_item{
    padding: 12px 30px 0 26px;
    /*background: #dde7f0;*/
}
.noticeBarBody .notice_item .Presence--noticeBar{
    display: none;
    position: absolute;
    top: 25px;
    right: 18px;
    width: 10px;
    height: 10px;
    background-color: #ff5b5b;
}
.noticeBarBody .notice_item .Presence--noticeBar.unread{
    display: block;
}
.groupAreaBody .notice_item{
    /* padding: 12px 30px 0 26px; */
}
.publicAreaBody .notice_item{
    padding: 12px 30px 0 26px;
}
.groupAreaBody .notice_item:last-child .botDivider{
    display: none;
}
.membersAreaBody .members_item{
    /* padding: 12px 30px 0 26px; */
}
.membersAreaBody .namesortWrap .members_item:last-child .botDivider{
    display: none;
}
.membersAreaBody .namesortHd{
    background: #e9f0f8;
    height: 36px;
    line-height: 36px;
    padding-left: 24px;
}
.membersAreaBody .namesortWrap:first-child{
    margin-top: 8px;
}

.notice_item .photo, .members_item .photo {
    float: left;
    margin-right: 10px;
    position: relative;
}

.notice_item .photo .img, .members_item .photo .img {
    display: block;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
}

.notice_item .info, .members_item .info{
    padding-bottom: 8px;
}
.notice_item .info span, .members_item .info span {
    height: 35px;
    line-height: 35px;
    font-weight: normal;
}

.nickname .nickname_text{
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.communicateList .caret.open{
    float: right;
    margin-right: 18px;
    margin-top: 15px;
    color: #bbd3ee;
    border-bottom: 5px solid;
    border-top: 0;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
.communicateList .caret{
    float: right;
    margin-right: 18px;
    margin-top: 15px;
    color: #bbd3ee;
    border-top: 5px solid;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

</style>