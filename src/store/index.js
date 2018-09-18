import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
	userInfo: {
		userBirthdy:"",
		firstChar:"",
		cosName:"",
		cosNum:"",
		currCOSIP:"",
		currProxy:"",
		currCOSImgIP:"",
		imagePath:"",
		mobile:"",
		ret:null,
		rongCloudToken:"",
		userName:"",
		userRole:"",
		userSex:"",
		userStaffID:"",
		userType:"",
	}, //用户信息
	totalUnreadCount: 0, //消息未读数
	appKey: "3argexb6rzspe",//appkey
	instance:null,// 融云初始化instance
	allStaffs:null,// 员工信息数组
	myGroups:null,// 我的群组数组
	currConversation:null,//当前聊天窗口
	currFriendList:null,//当前员工（群组）信息窗口
	currNewMessage:null,//接听到的新消息时当前窗口时
	uploadFile:null,//上传文件
	approveTabType:"first",
	browserImg:{
		imgPath:"",
	},//预览图片
	myDatabase:{
		knowledgeID:"-1",
		treeNode:{},
	},//我的资料库
	// latitude: '', // 当前位置纬度
	// longitude: '', // 当前位置经度
	// cartList: {}, // 加入购物车的商品列表
	// shopDetail: null, //商家详情信息
	// shopid: null,//商铺id
	// remarkText: null,//可选备注内容
	// inputText: '',//输入备注内容
	// invoice: false,//开发票
	// newAddress: [], //确认订单页新的地址
	// searchAddress: null,//搜索并选择的地址
	// geohash: '31.22299,121.36025',//地址geohash值
	// choosedAddress: null,//选择地址
	// addressIndex: null,//选择地址的索引值
	// needValidation: null,//确认订单时是否需要验证
	// cartId: null, //购物车id
	// sig: null,//购物车sig
	// orderParam: null,//订单的参数
	// orderMessage: null, //订单返回的信息
	// orderDetail: null, //订单详情
	// login: false,//是否登录
	// imgPath:null,//头像地址
	// removeAddress:[],//移除地址
	// addAddress:'',		//新增地址
	// question: null,//问题详情
	// cartPrice: null, //会员卡价格
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	// strict: process.env.NODE_ENV !== 'production'
})