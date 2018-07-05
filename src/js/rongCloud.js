export const rong_init = (params, callbacks, modules) => {	
	var appKey = params.appKey;
	var token = params.token;
	var navi = params.navi || "";

	modules = modules || {};
	var RongIMLib = modules.RongIMLib || window.RongIMLib;
	var RongIMClient = RongIMLib.RongIMClient;
	var protobuf = modules.protobuf || null;

	var config = {};

	//私有云切换navi导航，私有云格式 '120.92.10.214:8888'
	if(navi !== ""){
		config.navi = navi;
	}

	//私有云切换api,私有云格式 '172.20.210.38:81:8888'
	var api = params.api || "";
	if(api !== ""){
		config.api = api;
	}

	//support protobuf url + function
	if(protobuf != null){
		config.protobuf = protobuf;
	};

	console.time("rong_init");

	RongIMLib.RongIMClient.init(appKey,null,config);

	var instance = RongIMClient.getInstance();

	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
			// console.log(status);
		    switch (status) {
		        case RongIMLib.ConnectionStatus["CONNECTED"]:
		        case 0:
					console.log("连接成功");
					console.timeEnd("rong_init");
		            callbacks.getInstance && callbacks.getInstance(instance);
		            break;
					
		        case RongIMLib.ConnectionStatus["CONNECTING"]:
		        case 1:
		        	console.log("连接中")
		            break;

		        case RongIMLib.ConnectionStatus["DISCONNECTED"]:
		        case 2:
		        	console.log("当前用户主动断开链接")
		            break;

		        case RongIMLib.ConnectionStatus["NETWORK_UNAVAILABLE"]:
		        case 3:
		        	console.log("网络不可用")
		            break;

		        case RongIMLib.ConnectionStatus["CONNECTION_CLOSED"]:
		        case 4:
		        	console.log("未知原因，连接关闭")
		            break;

		        case RongIMLib.ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"]:
		        case 6:
		        	console.log("用户账户在其他设备登录，本机会被踢掉线")
		            break;

		        case RongIMLib.ConnectionStatus["DOMAIN_INCORRECT"]:
		        case 12:
		        	console.log("当前运行域名错误，请检查安全域名配置")
		            break;
		    }
		}
	});

	/*
	文档：http://www.rongcloud.cn/docs/web.html#3、设置消息监听器

	注意事项：
		1：为了看到接收效果，需要另外一个用户向本用户发消息
		2：判断会话唯一性 ：conversationType + targetId
		3：显示消息在页面前，需要判断是否属于当前会话，避免消息错乱。
		4：消息体属性说明可参考：http://rongcloud.cn/docs/api/js/index.html
	*/
	RongIMClient.setOnReceiveMessageListener({
		// 接收到的消息
		onReceived: function (message) {
		    // 判断消息类型
			callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
		}
	});

	//开始链接
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			callbacks.getCurrentUser && callbacks.getCurrentUser({userId:userId});
			// console.log("链接成功，用户id：" + userId);
		},
		onTokenIncorrect: function() {
			console.log('token无效');
		},
		onError:function(errorCode){
			console.log(errorCode);
		}
	});
}

// 获取全部会话列表
export const rong_getConversationList = (instance,callback) => {	
	/*
	文档：http://www.rongcloud.cn/docs/web_api_demo.html#会话接口
		http://www.rongcloud.cn/docs/web.html#5_2、同步会话列表
		http://www.rongcloud.cn/docs/api/js/Conversation.html

	历史消息云存储开通位置：https://developer.rongcloud.cn/service/roam/rXxI4IAJjxRAD72SpQ==

	注意事项：
		1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
		2：只有发过消息才能生成会话
	*/


	var conversationTypes = [RongIMLib.ConversationType.PRIVATE,RongIMLib.ConversationType.GROUP];  //具体格式设置需要补充
	var limit = 150; //获取会话的数量，不传或传null为全部，暂不支持分页
	var start = new Date().getTime();
	// var instance = RongIMClient.getInstance();

	instance.getConversationList({
		onSuccess: function(list) {
			// list.sort(function(a,b){
			// 	return a.sentTime > b.sentTime;
			// });
			
			callback(list);
		},
		onError: function(error) {
			console.log("获取会话失败");
            // showResult("获取会话失败",error,start);
		}
    }, conversationTypes, limit);
}

// 获取会话信息
export const rong_getConversation = (conversationType, targetId, callback) => {
	//需在 getConversationList 方法执行之后执行，否则返回null
	
	var instance = RongIMClient.getInstance();
	instance.getConversation(conversationType, targetId, { 
		onSuccess:function(result){ 
            callback(result);
		}, 
		onError:function(error){ 
		    console.log(error);
		}
	});
}

// 获取总未读数
export const rong_getTotalUnreadCount = (callback) => {
	/*
		阅读时间戳缓存在 localStorage 中，消息状态根据发送时间和阅读时间戳对比判断
		每次接受新消息后通过重新调用此方法计算
	 */
	var instance = RongIMClient.getInstance();
	instance.getTotalUnreadCount({
	  onSuccess:function(count){
		  callback(count);
	    //    showResult("获取总未读数成功", count, start);
	  },
	  onError:function(error){
	    //   showResult("获取总未读数失败", error, start);
	  }
	});
}

// 获取会话历史消息
export const rong_getHistroyMessage = ( conversationType, targetId, timestrap, callback) => {
	/*
	文档：http://www.rongcloud.cn/docs/web_api_demo.html#获取历史消息

	注意事项：
		1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
		2：登录开发者后台可以直接开启 https://developer.rongcloud.cn/app
		2：timestrap第二次拉取必须为null才能实现循环拉取
	*/

	var count = 10;  // 2 <= count <= 20
	var instance = RongIMClient.getInstance();
	instance.getHistoryMessages(conversationType, targetId, timestrap, count, {
		onSuccess: function(list, hasMsg) {
			//可通过sort订制其他顺序
			list.sort(function(a,b){
				return a.sentTime < b.sentTime;
			});
			callback(list, hasMsg);
		},
		onError: function(error) {
            console.log("获取历史消息失败",error);
		}
	});
	
}

// 会话置顶（官方接口有问题，无法使用）
export const rong_setConversationToTop = (conversationType, targetId, isTop, callback) => {
	//需在 getConversationList 方法执行之后执行，否则返回null
	
	var instance = RongIMClient.getInstance();
	console.log(conversationType, targetId, isTop, callback);
	instance.setConversationToTop(conversationType, targetId, isTop, { 
		onSuccess:function(result){ 
            callback(result);
		}, 
		onError:function(error){ 
		    console.log(error);
		}
	});
}

// 发送文本消息
export const rong_sendTextMessage = (content, conversationType, targetId, callback) => {
	/*
	文档： http://www.rongcloud.cn/docs/web.html#5_1、发送消息
		   http://rongcloud.cn/docs/api/js/TextMessage.html
	1: 单条消息整体不得大于128K
	2: conversatinType 类型是 number，targetId 类型是 string
	*/

	/*
		1、不要多端登陆，保证所有端都离线
		2、接收 push 设备设置:
			（1）打开系统通知提醒
			（2）小米设置 “授权管理” －> “自己的应用” 为自启动
			（3）应用内不要屏蔽新消息通知
		3、内置消息类型，默认 push，自定义消息类型需要
		   pushData 显示逻辑顺序：自定义 > 默认
		4、发送其他消息类型与发送 TextMessage 逻辑、方式一致
	*/
	var pushData = "pushData" + Date.now();

	var isMentioned = false;

	var instance = RongIMClient.getInstance();

	// var content = {
	// 	content: "消息",
	// 	user : {
	// 		"id" : "this-is-a-test-id",	//不支持中文及特殊字符
	// 		"name" : "张三",
	// 		"portrait" : "http://rongcloud.cn/images/newVersion/log_wx.png"
	// 	},
	// 	extra: "{\"key\":\"value\", \"key2\" : 12, \"key3\":true}"
	// };

	var msg = new RongIMLib.TextMessage(content);

	instance.sendMessage(conversationType, targetId, msg, {
        onSuccess: function (message) {
			callback(message);
        	// markMessage(message);
            // showResult("发送文字消息 成功",message,start);
        },
        onError: function (errorCode,message) {
            // showResult("发送文字消息 失败",message,start);
        }
    }, isMentioned, pushData);
}

// 发送图片消息
export const rong_sendImageMessage = (content, conversationType, targetId, callback) => {
	/*
	文档：http://www.rongcloud.cn/docs/api/js/ImageMessage.html

	需自行解决文件上传
	上传插件（含获取缩略图方法）: https://github.com/rongcloud/rongcloud-web-im-upload
	
	缩略图必须是base64码的jpg图，而且不带前缀"data:image/jpeg;base64,"，不得超过100K
	压缩：https://github.com/rongcloud/rongcloud-web-im-upload/blob/master/resize.html
	*/

	// var content = {
	// 	imageUri: "http://rongcloud.cn/images/newVersion/log_wx.png", 
	// 	content: getBase64Image()
	// };

	var msg = new RongIMLib.ImageMessage(content);

	var instance = RongIMClient.getInstance();
	instance.sendMessage(conversationType, targetId, msg, {
        onSuccess: function (message) {
        	callback(message);
        },
        onError: function (errorCode,message) {
            console.log(errorCode,message)
        }
    });	
}

// 发送文件消息
export const rong_sendFileMessage = (content, conversationType, targetId, callback) => {
	/*
	文档：http://www.rongcloud.cn/docs/api/js/ImageMessage.html

	upload组件：https://github.com/rongcloud/rongcloud-web-im-upload
	上传插件文档: http://rongcloud.cn/docs/web.html#上传插件

	单条消息整体不得大于128K

	文件消息分两步：
		1、上传文件至文件服务器
		2、发送文件信息和文件 URL
	*/

	// var content = {
	//     name: 'log_wx', // 文件名称
	//     size: '20k', // 文件大小，单位自己约定
	//     type: 'png', // 文件的后缀名，例如 png、js、doc ...
	//     fileUrl: 'http://rongcloud.cn/images/newVersion/log_wx.png' // 文件地址
	// };

	var msg = new RongIMLib.FileMessage(content);

	var instance = RongIMClient.getInstance();
	instance.sendMessage(conversationType, targetId, msg, {
        onSuccess: function (message) {
        	callback(message);
        },
        onError: function (errorCode,message) {
            console.log(errorCode,message)
        }
    });	
}

//发送自定义消息
function registerMessage(type,propertys){
	var messageName = type; // 消息名称。
	var objectName = "RC:CmdMsg"; // 消息内置名称，请按照此格式命名 *:* 。
	var MessageTag = new RongIMLib.MessageTag(false,false); //true true 保存且计数，false false 不保存不计数。
	RongIMLib.RongIMClient.registerMessageType(messageName,objectName,MessageTag,propertys);
}
export const rong_sendCommandMessage = (conversationType, targetId) => {
	/*
	文档：http://www.rongcloud.cn/docs/web_api_demo.html#自定义消息

	注意事项：
		1：init之前注册新消息类型
		2：对应接收 onReceived: function (message) {}
			message.messageType == "PersonMessage"
		3：需要自己做解析实现
	*/
	var propertys = ["data","extra","messageName","name"]; // 消息类中的属性名。
	registerMessage("CommandMessage",propertys);
	var content = {
		data:{name:"setRead"},
		extra:undefined,
		messageName:"CommandMessage",
		name:"setRead",
	};

	var msg = new RongIMClient.RegisterMessage.CommandMessage(content);
	var instance = RongIMClient.getInstance();
	instance.sendMessage(conversationType, targetId, msg, {
        onSuccess: function (message) {
			console.log("发送自定义消息成功");
        	console.log(message);
            
        },
        onError: function (errorCode,message) {
            console.log("发送自定义消息失败");
        }
    });
}

// 删除会话
export const rong_removeConversation = (conversationType, targetId, callback) => {
	var instance = RongIMClient.getInstance();
	instance.removeConversation(conversationType, targetId, { 
		onSuccess:function(result){ 
            callback({ result:true });
		}, 
		onError:function(error){ 
			// error => 清除会话错误码。 
			callback({ result:false });
		} 
	});
}

// 清除会话未读
export const rong_clearUnreadCount = (conversationType, targetId, callback) => {
	/*
	 	此方法清除当前端的未读数，并不会多端同步，
	 	多端同步需要发送 SyncReadStatusMessage：http://support.rongcloud.cn/kb/NjE0
	 */
	var instance = RongIMClient.getInstance();
	
	instance.clearUnreadCount(conversationType,targetId,{
	    onSuccess:function(){
			//清除未读数成功
			callback({ result:true });
	    },
	    onError:function(error){
			//清除未读数失败
			callback({ result:false });
	    }
	});
}

// 其他端接受并做同步更新
export const rong_SendSyncReadStatusMessage = (conversationType, targetId, sentTime) => {
	/*
	一端发送，其他端接受并做同步更新
	具体处理说明文档： http://support.rongcloud.cn/kb/NjE0
	sentTime：最后一条消息的sentTime
	*/ 
	var content = {
		lastMessageSendTime: sentTime
	};
	var msg = new RongIMLib.SyncReadStatusMessage(content);
	var instance = RongIMClient.getInstance();

	instance.sendMessage(conversationType, targetId, msg, {
        onSuccess: function (message) {
            console.log("发送同步消息成功");
        },
        onError: function (errorCode,message) {
            console.log("发送同步消息失败");
        }
    });	
}