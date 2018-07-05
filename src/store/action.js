import {
	rong_init,
	rong_getTotalUnreadCount,
} from '@/js/rongCloud'
import {
	RONG_INIT,
	SET_TOTALUNREADCOUNT,
	SET_ALLSTAFFS,
	SET_MYGROUPS,
} from './mutation-types.js'
import {
	findAllStaffs,
	getGroupsByStaffID,
} from '@/js/api'


export default {
	rong_init({commit,state}){
		return new Promise((resolve, reject) => {
			let params = {
				appKey : state.appKey,
				token : state.userInfo.rongCloudToken
			};
			//公有云初始化
			let config = {
				//protobuf: './local-sdk/protobuf-2.2.7.min.js' //支持http(s)网络路径、本地相对路径
			};
			var callbacks = {
				getInstance : function(_instance){
					commit('SET_INSTANCE',_instance);
					// instance = _instance;
				},
				receiveNewMessage : function(message){
					console.log("新消息: " + message.targetId);
					console.log("messageUId:" + message.messageUId + ",   messageId:" + message.messageId);
					console.log(message);
					// if(message.messageType!="CommandMessage"&&message.messageType!="SyncReadStatusMessage"){
					// 	if(state.currConversation){
					// 		if(state.currConversation.targetId != message.targetId){
					// 			state.totalUnreadCount++;
					// 		}
					// 	}else{
					// 		state.totalUnreadCount++;
					// 	}
					// }
					commit('SET_CURRNEWMESSAGE',message);
					// state.currNewMessage = message;
				},
				getCurrentUser : function(userInfo){
					console.log("链接成功 用户id：" + userInfo.userId);
					resolve(userInfo.userId);
					// userId = userInfo.userId;
					// afterConnected();
				}
			};
			rong_init(params,callbacks,config);
		});
		
	},
	rong_getTotalUnreadCount({commit,state}){
		rong_getTotalUnreadCount((count) => {
			commit(SET_TOTALUNREADCOUNT, count);
		});
	},
	// 重新加载员工列表
	reloadAllStaffs({commit,state}){
		findAllStaffs().then((response) => {
			if(response.data.data.length>0){
				commit(SET_ALLSTAFFS, response.data.data);
			}
		});
	},
	// 重新加载群组列表
	reloadMyGroups({commit,state}){
		let staffID = state.userInfo.cosNum+"_"+state.userInfo.userStaffID;
		let cosNum = state.userInfo.cosNum;
		getGroupsByStaffID(staffID,cosNum).then((response) => {
			commit(SET_MYGROUPS, response.data.data);
		});
	}
	// async getUserInfo({
	// 	commit,
	// 	state
	// }) {
	// 	let res = await getUser();
	// 	commit(GET_USERINFO, res)
	// },
	// async saveAddress({
	// 	commit,
	// 	state
	// }) {

	// 	if(state.removeAddress.length > 0) return;

	// 	let addres = await getAddressList(state.userInfo.user_id);
	// 	commit(SAVE_ADDRESS, addres);	
	// },
}