import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/page/MainPage'
import Login from '@/page/login/Login'
import chatBox from '@/page/chat/ChatBox'
import MyCloud from '@/page/cloudDisk/MyCloud'
import BusinessFile from '@/page/cloudDisk/BusinessFile'
import CreateGroup from '@/page/user/CreateGroup'
import StaffInfo from '@/page/user/StaffInfo'
import GroupInfo from '@/page/user/GroupInfo'
import OfficeContent from '@/page/office/OfficeContent'
import ExpensePaymentList from '@/page/office/expensePayment/ExpensePaymentList'
import ExpensePaymentDetail from '@/page/office/expensePayment/ExpensePaymentDetail'
import BorrowPaymentList from '@/page/office/borrowPayment/BorrowPaymentList'
import BorrowPaymentDetail from '@/page/office/borrowPayment/BorrowPaymentDetail'
import ExamineTemplateList from '@/page/office/examineTemplate/ExamineTemplateList'
import ExamineTemplateDetail from '@/page/office/examineTemplate/ExamineTemplateDetail'
import StaffInfoList from '@/page/office/staffInfo/StaffInfoList'
import StaffInfoDetail from '@/page/office/staffInfo/StaffInfoDetail'
import NoteAttendanceList from '@/page/office/noteAttendance/NoteAttendanceList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/mainpage',
      name: 'MainPage',
      component: MainPage,
      children:[
        {
          path: '/',
          redirect: 'conversation',
        },
        {
          path:"conversation",
          meta: { pageType: "conversation" }
        },
        {
          path:"friendList",
          meta: { pageType: "friendList" }
        },
        {// 创建群组
          path:"friendList/createGroup",
          meta: { pageType: "friendList" },
          component: CreateGroup
        },
        {// 员工信息
          path:"friendList/staffInfo",
          meta: { pageType: "friendList" },
          component: StaffInfo
        },
        {// 群组信息
          path:"friendList/groupInfo",
          meta: { pageType: "friendList" },
          component: GroupInfo
        },
        {
          path:"cloudDisk",
          meta: { pageType: "cloudDisk" }
        },
        {
          path:"cloudDisk/mydisk",
          redirect: 'cloudDisk/mydisk/-1',
        },
        {
          path:"cloudDisk/mydisk/:id",
          meta: { pageType: "cloudDisk", childCompName:"mydisk"},
          component: MyCloud
        },
        {
          path:"cloudDisk/business",
          meta: { pageType: "cloudDisk", childCompName:"business"},
          component: BusinessFile
        },
        {
          path:"office",
          meta: { pageType: "office" }
        },
        {
          path:"office/:id",
          meta: { pageType: "office" },
          component: OfficeContent
        },
        {
          path:"office/:id/expensePayment",
          meta: { pageType: "office" },
          component: ExpensePaymentList
        },
        {
          path:"office/:id/expensePayment/:expenseID",
          meta: { pageType: "office" },
          component: ExpensePaymentDetail
        },
        {
          path:"office/:id/borrowPayment",
          meta: { pageType: "office" },
          component: BorrowPaymentList
        },
        {
          path:"office/:id/borrowPayment/:borrowID",
          meta: { pageType: "office" },
          component: BorrowPaymentDetail
        },
        {
          path:"office/:id/examineTemplate",
          meta: { pageType: "office" },
          component: ExamineTemplateList
        },
        {
          path:"office/:id/examineTemplate/add",
          meta: { pageType: "office",type:"add" },
          component: ExamineTemplateDetail
        },
        {
          path:"office/:id/examineTemplate/update/:templateID",
          meta: { pageType: "office",type:"update" },
          component: ExamineTemplateDetail
        },
        {
          path:"office/:id/examineTemplate/detail/:templateID",
          meta: { pageType: "office",type:"detail" },
          component: ExamineTemplateDetail
        },
        {
          path:"office/:id/staffInfo",
          meta: { pageType: "office" },
          component: StaffInfoList
        },
        {
          path:"office/:id/staffInfo/add",
          meta: { pageType: "office",type:"add" },
          component: StaffInfoDetail
        },
        {
          path:"office/:id/staffInfo/update/:staffID",
          meta: { pageType: "office",type:"update" },
          component: StaffInfoDetail
        },
        {
          path:"office/:id/noteAttendance",
          meta: { pageType: "office" },
          component: NoteAttendanceList
        },
      ]
    }
  ]
})