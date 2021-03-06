import {
	SAVE_USERINFO,
	SET_INSTANCE,
	SET_ALLSTAFFS,
	SET_MYGROUPS,
	SET_CURRCONVERSATION,
	SET_CURRNEWMESSAGE,
	SET_CURRFRIENDLIST,
	SET_TOTALUNREADCOUNT,
	SET_UPLOADFILE,
	SET_BROWSERIMG,
	SET_APPROVETABTYPE,
	SET_SELFIMAGEPATH,
	SET_KNOWLEDGEID,
	SET_TREENODEID,
	SET_CLOSELEFT,
} from './mutation-types.js'

export default {

	// 保存登录信息
	[SAVE_USERINFO](state, userInfo) {
		state.userInfo = userInfo;
		state.login = true;
	},
	// 保存融云instance
	[SET_INSTANCE](state, instance){
		state.instance = instance;
	},
	// 保存员工信息
	[SET_ALLSTAFFS](state, allStaffs){
		state.allStaffs = allStaffs;
	},
	// 保存我的群组信息
	[SET_MYGROUPS](state, myGroups){
		state.myGroups = myGroups;
	},
	// 保存当前聊天窗口
	[SET_CURRCONVERSATION](state, currConversation){
		state.currConversation = currConversation;
	},
	[SET_CURRNEWMESSAGE](state, currNewMessage){
		state.currNewMessage = currNewMessage;
	},
	// 保存当前用户信息窗口
	[SET_CURRFRIENDLIST](state, currFriendList){
		state.currFriendList = currFriendList;
	},
	// 设置总未读数
	[SET_TOTALUNREADCOUNT](state, totalUnreadCount){
		state.totalUnreadCount = totalUnreadCount;
	},
	// 设置上传文件
	[SET_UPLOADFILE](state, uploadFile){
		state.uploadFile = uploadFile;
	},
	// 设置预览图片
	[SET_BROWSERIMG](state, browserImg){
		state.browserImg = browserImg;
	},
	// 设置审批tab栏
	[SET_APPROVETABTYPE](state, approveTabType){
		state.approveTabType = approveTabType;
	},
	// 设置员工头像
	[SET_SELFIMAGEPATH](state, imagePath){
		state.userInfo.imagePath = imagePath;
		state.userInfo.portrait = imagePath;
	},
	[SET_KNOWLEDGEID](state, knowledgeID){
		state.myDatabase.knowledgeID = knowledgeID;
	},
	[SET_TREENODEID](state, treeNode){
		state.myDatabase.treeNode = treeNode;
	},
	[SET_CLOSELEFT](state, closeLeft){
		state.closeLeft = closeLeft;
	},
	// [RECORD_SHOPDETAIL](state, detail) {
	// 	state.shopDetail = detail;
	// },
	// // 加入购物车
	// [ADD_CART](state, {
	// 	shopid,
	// 	category_id,
	// 	item_id,
	// 	food_id,
	// 	name,
	// 	price,
	// 	specs,
	// 	packing_fee,
	// 	sku_id,
	// 	stock
	// }) {
	// 	let cart = state.cartList;
	// 	let shop = cart[shopid] = (cart[shopid] || {});
	// 	let category = shop[category_id] = (shop[category_id] || {});
	// 	let item = category[item_id] = (category[item_id] || {});
	// 	if (item[food_id]) {
	// 		item[food_id]['num']++;
	// 	} else {
	// 		item[food_id] = {
	// 				"num" : 1,
	// 				"id" : food_id,
	// 				"name" : name,
	// 				"price" : price,
	// 				"specs" : specs,
	// 				"packing_fee" : packing_fee,
	// 				"sku_id" : sku_id,
	// 				"stock" : stock
	// 		};
	// 	}
	// 	state.cartList = {...cart};
	// 	//存入localStorage
	// 	setStore('buyCart', state.cartList);
	// },
	// // 移出购物车
	// [REDUCE_CART](state, {
	// 	shopid,
	// 	category_id,
	// 	item_id,
	// 	food_id,
	// 	name,
	// 	price,
	// 	specs,
	// }) {
	// 	let cart = state.cartList;
	// 	let shop = (cart[shopid] || {});
	// 	let category = (shop[category_id] || {});
	// 	let item = (category[item_id] || {});
	// 	if (item && item[food_id]) {
	// 		if (item[food_id]['num'] > 0) {
	// 			item[food_id]['num']--;
	// 			state.cartList = {...cart};
	// 			//存入localStorage
	// 			setStore('buyCart', state.cartList);
	// 		} else {
	// 			//商品数量为0，则清空当前商品的信息
	// 			item[food_id] = null;
	// 		}
	// 	}
	// },
	// //网页初始化时从本地缓存获取购物车数据
	// [INIT_BUYCART](state) {
	// 	let initCart = getStore('buyCart');
	// 	if (initCart) {
	// 		state.cartList = JSON.parse(initCart);
	// 	}
	// },
	// //清空当前商品的购物车信息
	// [CLEAR_CART](state, shopid) {
	// 	state.cartList[shopid] = null;
	// 	state.cartList = {...state.cartList};
	// 	setStore('buyCart', state.cartList);
	// },
	// // 记录用户信息
	// [RECORD_USERINFO](state, info) {
	// 	state.userInfo = info;
	// 	state.login = true;
	// 	setStore('user_id', info.user_id);
	// },
	// //获取用户信息存入vuex
	// [GET_USERINFO](state, info) {
	// 	if (state.userInfo && (state.userInfo.username !== info.username)) {
	// 		return;
	// 	};
	// 	if (!state.login) {
	// 		return
	// 	}
	// 	if (!info.message) {
	// 		state.userInfo = {...info};
	// 	} else {
	// 		state.userInfo = null;
	// 	}
	// },
	// //修改用户名
	// [RETSET_NAME](state,username) {
	// 	state.userInfo = Object.assign({}, state.userInfo,{username})
	// },
	// //保存商铺id
	// [SAVE_SHOPID](state, shopid) {
	// 	state.shopid = shopid;
	// },
	// //记录订单页面用户选择的备注, 传递给订单确认页面
	// [CONFIRM_REMARK](state, {
	// 	remarkText,
	// 	inputText
	// }) {
	// 	state.remarkText = remarkText;
	// 	state.inputText = inputText;
	// },
	// //是否开发票
	// [CONFIRM_INVOICE](state, invoice) {
	// 	state.invoice = invoice;
	// },
	// //选择搜索的地址
	// [CHOOSE_SEARCH_ADDRESS](state, place) {
	// 	state.searchAddress = place;
	// },
	// //保存geohash
	// [SAVE_GEOHASH](state, geohash) {
	// 	state.geohash = geohash;
		
	// },
	// //确认订单页添加新的的地址
	// [CONFIRM_ADDRESS](state, newAddress) {
	// 	state.newAddress.push(newAddress);
	// },
	// //选择的地址
	// [CHOOSE_ADDRESS](state, {
	// 	address,
	// 	index
	// }) {
	// 	state.choosedAddress = address;
	// 	state.addressIndex = index;
	// },
	// //保存下单需要验证的返回值
	// [NEED_VALIDATION](state, needValidation) {
	// 	state.needValidation = needValidation;
	// },
	// //保存下单后购物id 和 sig
	// [SAVE_CART_ID_SIG](state, {
	// 	cart_id,
	// 	sig
	// }) {
	// 	state.cart_id = cart_id;
	// 	state.sig = sig;
	// },
	// //保存下单参数，用户验证页面调用
	// [SAVE_ORDER_PARAM](state, orderParam) {
	// 	state.orderParam = orderParam;
	// },
	// //修改下单参数
	// [CHANGE_ORDER_PARAM](state, newParam) {
	// 	state.orderParam = Object.assign({}, state.orderParam, newParam);
	// },
	// //下单成功，保存订单返回信息
	// [ORDER_SUCCESS](state, order) {
	// 	state.cartPrice = null;
	// 	state.orderMessage = order;
	// },
	// //进入订单详情页前保存该订单信息
	// [SAVE_ORDER](state, orderDetail) {
	// 	state.orderDetail = orderDetail;
	// },
	// //退出登录
	// [OUT_LOGIN](state) {
	// 	state.userInfo = {};
	// 	state.login = false;
	// },
	// //保存图片
	// [SAVE_AVANDER](state, imgPath) {
	// 	state.imgPath = imgPath;
	// },
	// //删除地址列表
	// [SAVE_ADDRESS](state, newAdress) {
	// 	state.removeAddress = newAdress
	// },
	// //添加地址name
	// [SAVE_ADDDETAIL](state, addAddress){
	// 	state.addAddress=addAddress;
	// },
	// //保存所选问题标题和详情
	// [SAVE_QUESTION](state, question) {
	// 	state.question = {...question};
	// },
	// //增加地址
	// [ADD_ADDRESS](state, obj) {
	// 	state.removeAddress = [obj, ...state.removeAddress];
	// },
	// //会员卡价格纪录
	// [BUY_CART](state, price) {
	// 	state.cartPrice = price;
	// },

}
