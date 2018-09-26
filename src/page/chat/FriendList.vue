<template>
    <div class="mainBox pull-left">
        <vue-context-menu :contextMenuData="contextMenuData" @deleteConversation="deleteConversation" @setTop="setTop"></vue-context-menu>
        <div id="search-friend" v-show="$route.meta.pageType!='cloudDisk'&&$route.meta.pageType!='office'&&$route.meta.pageType!='group'">
            <search-input style="flex:1;" :placeholder="$t('message.friendList.search')"></search-input>
            <div class="createGroupBtn iconfont" @click="createGroup">&#xe6b9;</div>
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
        <div v-show="$route.meta.pageType=='group'" class="groupcompanyList">
            <div class="companyBody" @click="showcompany=!showcompany">
                <group-company-item v-if="mainData.groupcompanyList.data" :item="mainData.groupcompanyList.data" :showcompany="showcompany" :isGroup="true" @changeIsShowGroup="changeIsShowGroup" @changeLogin="changeLogin"></group-company-item>
            </div>
            <div class="companyBody" v-show="showcompany">
                <group-company-item v-for="(item,index) in mainData.groupcompanyList.child" :key="index" :item="item.data" @changeIsShowGroup="changeIsShowGroup" @changeLogin="changeLogin"></group-company-item>
            </div>
            <!-- <div class="companyBody" @click="showcompany=!showcompany">
                <group-company-item :item="mainData.groupFirstData" :isGroup="true" @changeIsShowGroup="changeIsShowGroup"></group-company-item>
            </div>
            <div class="companyBody" v-show="showcompany">
                <group-company-item v-for="(item,index) in mainData.groupcompanyList" :key="index" :item="item" @changeIsShowGroup="changeIsShowGroup"></group-company-item>
            </div> -->
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
import groupCompanyItem from '@/page/group/GroupCompanyItem'

import {mapState, mapMutations, mapActions} from 'vuex'
import { _setSession,_getSession,_removeSession,alertError } from '@/config/utils'
import {aesEncrypt, aesDecrypt} from '@/config/AES';// AES加密解密算法
import config from '@config';
import { rong_getConversationList,rong_getConversation,rong_removeConversation,rong_setConversationToTop,rong_clearUnreadCount,rong_SendSyncReadStatusMessage } from '@/js/rongCloud'
import { findAllStaffs,getGroupsByStaffID,findStaffsByStaffIDs,findChildrenByChildIDs,getGroupsByID,getMenusByStaffID,getGroupAllCos,getCosByCosNum,login,getCosType } from '@/js/api'
import officeMenu from '@/js/officeMenu'

export default {
    name: 'FriendList',
    data :function() {
        return {
            showfriends:false,//是否显示联系人
            showgroups:false,//是否显示群组
            showcompany:true,//是否显示集团下内容
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
                    friendList:[],
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
                menusArray:[],
                officeList:[
                    // {
                    //     title:"常用",
                    //     content:"",
                    //     name:"1",
                    //     url:"/mainpage/office/1",
                    //     imgUrl:"static/images/office/common.png",
                    //     styleObj:{
                    //         background:"#38adff"
                    //     }
                    // },{
                    //     title:"人事管理",
                    //     content:"",
                    //     name:"2",
                    //     url:"/mainpage/office/2",
                    //     imgUrl:"static/images/office/personnel.png",
                    //     styleObj:{
                    //         background:"#4dc060"
                    //     }
                    // },{
                    //     title:"财务管理",
                    //     content:"",
                    //     name:"3",
                    //     url:"/mainpage/office/3",
                    //     imgUrl:"static/images/office/financial.png",
                    //     styleObj:{
                    //         background:"#ff9d00"
                    //     }
                    // },{
                    //     title:"市场管理",
                    //     content:"",
                    //     name:"4",
                    //     url:"/mainpage/office/4",
                    //     imgUrl:"static/images/office/market.png",
                    //     styleObj:{
                    //         background:"#e51c23"
                    //     }
                    // },{
                    //     title:"行政管理",
                    //     content:"",
                    //     name:"5",
                    //     url:"/mainpage/office/5",
                    //     imgUrl:"static/images/office/administrative.png",
                    //     styleObj:{
                    //         background:"#932cd8"
                    //     }
                    // }
                ],
                groupObj:{},
                groupFirstData:{},
                groupcompanyList:{},
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
        this.getMenusByStaffID();
        this.getGroupAllCos();
    },
    components:{
        searchInput,
        vueContextMenu,
        conversation,
        groupItem,
        friendItem,
        cloudDiskItem,
        officeItem,
        groupCompanyItem
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
            'SET_CURRFRIENDLIST',
            'SET_ALLSTAFFS',
            'SET_MYGROUPS',
            'SAVE_USERINFO',
        ]),
        ...mapActions([
            'rong_init',
            'rong_getTotalUnreadCount'
        ]),
        createGroup(){
            // 显示消息组件
            this.SET_CURRCONVERSATION(null);
            // 隐藏员工（群组）信息组件
            this.SET_CURRFRIENDLIST({type:"creatGroup"});
            // 路由跳转到员工路由
            this.$router.push('/mainpage/friendList/createGroup');
        },
        getMenusByStaffID(){
            if(this.userInfo.userStaffID){
                getMenusByStaffID(this.userInfo.userStaffID).then((result)=>{
                    this.menusArray = result.data.data;
                    let menus = officeMenu();
                    let menu1 = false;
                    let menu2 = false;
                    let menu3 = false;
                    let menu4 = false;
                    let menu5 = false;
                    let menu6 = false;
                    let menu9 = false;
                    let menu7 = false;
                    let menu8 = false;
                    for(let i=0;i<this.menusArray.length;i++){
                        if(menus[this.menusArray[i].Num]&&menus[this.menusArray[i].Num].modulesNum=='1'){
                            menu1 = true;
                        }
                        if(menus[this.menusArray[i].Num]&&menus[this.menusArray[i].Num].modulesNum=='2'){
                            menu2 = true;
                        }
                        if(menus[this.menusArray[i].Num]&&menus[this.menusArray[i].Num].modulesNum=='3'){
                            menu3 = true;
                        }
                        if(menus[this.menusArray[i].Num]&&menus[this.menusArray[i].Num].modulesNum=='4'){
                            menu4 = true;
                        }
                        if(menus[this.menusArray[i].Num]&&menus[this.menusArray[i].Num].modulesNum=='5'){
                            menu5 = true;
                        }
                        if(menus[this.menusArray[i].Num]&&menus[this.menusArray[i].Num].modulesNum=='6'){
                            menu6 = true;
                        }
                        if(menus[this.menusArray[i].Num]&&menus[this.menusArray[i].Num].modulesNum=='7'){
                            menu7 = true;
                        }
                        if(menus[this.menusArray[i].Num]&&menus[this.menusArray[i].Num].modulesNum=='8'){
                            menu8 = true;
                        }
                        if(menus[this.menusArray[i].Num]&&menus[this.menusArray[i].Num].modulesNum=='9'){
                            menu9 = true;
                        }
                    }
                    if(menu1){
                        this.mainData.officeList.push({
                            title:"常用",
                            content:"",
                            name:"1",
                            url:"/mainpage/office/1",
                            imgUrl:"static/images/office/common.png",
                            styleObj:{
                                background:"#38adff"
                            }
                        });
                    }
                    if(menu2){
                        this.mainData.officeList.push({
                            title:"人事管理",
                            content:"",
                            name:"2",
                            url:"/mainpage/office/2",
                            imgUrl:"static/images/office/personnel.png",
                            styleObj:{
                                background:"#4dc060"
                            }
                        });
                    }
                    if(menu3){
                        this.mainData.officeList.push({
                            title:"财务管理",
                            content:"",
                            name:"3",
                            url:"/mainpage/office/3",
                            imgUrl:"static/images/office/financial.png",
                            styleObj:{
                                background:"#ff9d00"
                            }
                        });
                    }
                    if(menu4){
                        this.mainData.officeList.push({
                            title:"市场管理",
                            content:"",
                            name:"4",
                            url:"/mainpage/office/4",
                            imgUrl:"static/images/office/market.png",
                            styleObj:{
                                background:"#e51c23"
                            }
                        });
                    }
                    if(menu5){
                        this.mainData.officeList.push({
                            title:"行政管理",
                            content:"",
                            name:"5",
                            url:"/mainpage/office/5",
                            imgUrl:"static/images/office/administrative.png",
                            styleObj:{
                                background:"#932cd8"
                            }
                        });
                    }
                    if(menu6){
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
                    if(menu9){
                        this.mainData.officeList.push({
                            title:"兴趣班管理",
                            content:"",
                            name:"9",
                            url:"/mainpage/office/9",
                            imgUrl:"static/images/office/interestClass.png",
                            styleObj:{
                                background:"#FF9999"
                            }
                        });
                    }
                    if(menu7){
                        this.mainData.officeList.push({
                            title:"教学管理",
                            content:"",
                            name:"7",
                            url:"/mainpage/office/7",
                            imgUrl:"static/images/office/teachManager.png",
                            styleObj:{
                                background:"#a0522d"
                            }
                        });
                    }
                    if(menu8){
                        this.mainData.officeList.push({
                            title:"家园通管理",
                            content:"",
                            name:"8",
                            url:"/mainpage/office/8",
                            imgUrl:"static/images/office/homesteadManager.png",
                            styleObj:{
                                background:"#008000"
                            }
                        });
                    }
                }).catch((err)=>{
                    alertError(this,"1016");
                    console.log(err)
                });
            }
        },
        //获取所有集团幼儿园
        getGroupAllCos(){
            let cosNum = this.userInfo.cosNum;
            let acctID = this.userInfo.mobile;
            if(acctID){
                getGroupAllCos(cosNum,acctID).then((result)=>{
                    // console.log(result.data)
                    let data = result.data;
                    let firstCosNum = "";
                    firstCosNum = data[0].F_CosNum;
                    for(let i=0;i<data.length;i++){
                        data[i].isShowGroup = false;
                        this.mainData.groupObj[data[i].F_CosNum] = data[i];
                    }
                    this.mainData.groupcompanyList = this.concatChild({},data[0]);
                    console.log(this.mainData.groupcompanyList);
                }).catch((err)=>{
                    alertError(this,"1991");
                    console.log(err)
                });
            }
        },
        concatChild(firstData,dataObj){
			firstData.data = dataObj;
			firstData.child = [];
			let childCosNums = dataObj.F_Child?dataObj.F_Child.split(","):[];
			for(let m=0;m<childCosNums.length;m++){
				let childObj = {};
				if(this.mainData.groupObj[childCosNums[m]]){
					this.concatChild(childObj,this.mainData.groupObj[childCosNums[m]]);
					firstData.child.push(childObj);
				}
            };
            return firstData;
		},
        changeIsShowGroup(cosNum){
            if (this.mainData.groupcompanyList.data.F_CosNum==cosNum) {
                if(this.mainData.groupcompanyList.data.isShowGroup){
                    this.mainData.groupcompanyList.data.isShowGroup = false;
                }else{
                    this.mainData.groupcompanyList.data.isShowGroup = true;
                }
            }else{
                this.mainData.groupcompanyList.data.isShowGroup = false;
            }
            for (let i = 0; i < this.mainData.groupcompanyList.child.length; i++) {
                let item = this.mainData.groupcompanyList.child[i];
                if (item.data.F_CosNum==cosNum) {
                    if(item.data.isShowGroup){
                        item.data.isShowGroup = false;
                    }else{
                        item.data.isShowGroup = true;
                    }
                }else{
                    item.data.isShowGroup = false;
                }
                if(item.child&&item.child.length>0){
                    for (let j = 0; j < item.child.length; j++) {
                        let itemElse = item.child[j];
                        if (itemElse.data.F_CosNum==cosNum) {
                            if(itemElse.data.isShowGroup){
                                itemElse.data.isShowGroup = false;
                            }else{
                                itemElse.data.isShowGroup = true;
                            }
                        }else{
                            itemElse.data.isShowGroup = false;
                        }
                    }
                }
            }
        },
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
                        }).catch((err)=>{
                            alertError(this,"1097");
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
                        }).catch((err)=>{
                            alertError(this,"1038");
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
                    }).catch((err)=>{
                        alertError(this,"1065");
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
        changeLogin(item){
            // console.log(item);
            this.$alert('你确定要切换到【'+item.F_CosName+'】吗？', '温馨提示', {
                confirmButtonText: '确定',
                callback: action => {
                    if(action=='confirm'){
                        this.signin({
                            cosNum: item.F_CosNum,
                            userName: this.userInfo.mobile?this.userInfo.mobile:this.userInfo.loginName,
                            passWord: this.userInfo.password
                        });
                    }
                }
            });
        },
        loginError(){
            this.$alert('用户名密码错误，是否退出到登录页面？', '温馨提示', {
                confirmButtonText: '确定',
                showCancelButton: true,
                callback: action => {
                    if(action=='confirm'){
                        _removeSession('user_info');
                        this.$router.push('/login');
                    }
                }
            });
        },
        reloadPage(){
            window.location.reload([true]);
        },
        // 用户名密码登录
        signin(user){
            // if (!this.user.userName) {
            //     this.passwordError = this.$t("message.login.pleaseUsername");
            //     this.showPasswordError = true;
            //     return;
            // }else if(!this.user.passWord){
            //     this.passwordError = this.$t("message.login.pleasePassword");
            //     this.showPasswordError = true;
            //     return;
            // }else if(!this.user.cosNum){
            //     this.passwordError = this.$t("message.login.pleaseCOSNum");
            //     this.showPasswordError = true;
            //     return;
            // }
            // this.passwordError = '';
            // this.showPasswordError = false;
            let currCOSIP = "";
            let currProxy = "";
            getCosByCosNum(user.cosNum).then((response) => {
                currCOSIP = response.data.F_CosUrl;
                let proxyTables = config.dev.proxyTable;
                console.log(currCOSIP)
                for(let proxyTable in proxyTables){
                    if(proxyTables[proxyTable].target==currCOSIP){
                        currProxy = proxyTable
                    }
                }
            })
            .then(() => {
                let staffInfo = null;
                console.log(currProxy,user.cosNum,user.userName,user.passWord)
                login(currProxy,user.cosNum,user.userName,user.passWord).then((response) => {
                    console.log(response)
                    if(response.data.ret == 1){
                        response.data.currProxy = currProxy;
                        response.data.currCOSIP = currCOSIP;
                        response.data.currCOSImgIP = currCOSIP;
                        response.data.cosNum = user.cosNum;
                        response.data.portrait = response.data.imagePath;
                        response.data.loginName = user.userName;
                        response.data.password = user.passWord;
                        staffInfo = response.data;
                        this.SAVE_USERINFO(staffInfo);
                        let user_info = aesEncrypt(JSON.stringify(staffInfo));
                        _setSession('user_info',user_info);
                        return getCosType();
                    }else{
                        this.loginError();
                    }
                }).then((result)=>{
                    // 登录成功后再storage中添加cosType
                    if(result){
                        staffInfo.cosType = result.data.costype;
                        this.SAVE_USERINFO(staffInfo);
                        let user_info = aesEncrypt(JSON.stringify(staffInfo));
                        _setSession('user_info',user_info);
                        this.reloadPage();
                    }
                }).catch((err)=>{
                    // alertError(this,"2001");
                    console.log('cos1');
                    console.log(err);
                });
                console.log('/COS0IN');
                login('/COS0IN',user.cosNum,user.userName,user.passWord).then((response) => {
                    console.log(response);
                    if(response.data.ret == 1){
                        response.data.currProxy = "/COS0IN";
                        response.data.currCOSIP = "http://172.16.1.100:888/";
                        response.data.currCOSImgIP = "http://172.16.1.100:888/";
                        response.data.cosNum = user.cosNum;
                        response.data.portrait = response.data.imagePath;
                        response.data.loginName = user.userName;
                        response.data.password = user.passWord;
                        staffInfo = response.data;
                        
                        this.SAVE_USERINFO(staffInfo);
                        let user_info = aesEncrypt(JSON.stringify(staffInfo));
                        _setSession('user_info',user_info);
                        return getCosType();
                    }else{
                        this.loginError();
                    }
                }).then((result)=>{
                    // 登录成功后再storage中添加cosType
                    if(result){
                        staffInfo.cosType = result.data.costype;
                        this.SAVE_USERINFO(staffInfo);
                        let user_info = aesEncrypt(JSON.stringify(staffInfo));
                        _setSession('user_info',user_info);
                        this.reloadPage();
                    }
                }).catch((err)=>{
                    // alertError(this,"2001");
                    console.log('cos0in');
                    console.log(err);
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
/* @import '../../style/main.css'; */

#search-friend{
    position: fixed;
    width:314px;
    top:0;
    z-index:8;
    display: flex;
    flex-direction: row;
    height: 54px;
}
#chatArea{
    margin-top: 54px;
}
.chatArea {
    border-top: 1px solid #e1e9f1;
    overflow-y: auto;
}
.createGroupBtn{
    width:20px;
    height:54px;
    color:#38adff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-right: 12px;
    cursor: pointer;
    position: relative;
}
.createGroupBtn:after{
    content: "";
    display: block;
    width: 24px;
    height: 24px;
    position: absolute;
    left: 50%;
    top:50%;
    border: 1px solid #38adff;
    border-radius: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
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
.groupcompanyList{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 100%;
    overflow: auto;
    font-size: 15px;
}
</style>