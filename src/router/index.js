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
import ChildInfoList from '@/page/office/childInfo/ChildInfoList'
import ChildInfoDetail from '@/page/office/childInfo/ChildInfoDetail'
import EditFamilyMember from '@/page/office/childInfo/EditFamilyMember'
import FamilyMemberInfo from '@/page/office/childInfo/FamilyMemberInfo'
import AddNewChildList from '@/page/office/addNewChild/AddNewChildList'
import AssignChildList from '@/page/office/assignChild/AssignChildList'
import ClassManagementList from '@/page/office/classManagement/ClassManagementList'

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
      children: [
        {
          path: '/',
          redirect: 'conversation',
        },
        {
          path: "conversation",
          meta: { pageType: "conversation" }
        },
        {
          path: "friendList",
          meta: { pageType: "friendList" }
        },
        {// 创建群组
          path: "friendList/createGroup",
          meta: { pageType: "friendList" },
          component: CreateGroup
        },
        {// 员工信息
          path: "friendList/staffInfo",
          meta: { pageType: "friendList" },
          component: StaffInfo
        },
        {// 群组信息
          path: "friendList/groupInfo",
          meta: { pageType: "friendList" },
          component: GroupInfo
        },
        {
          path: "cloudDisk",
          meta: { pageType: "cloudDisk" }
        },
        {
          path: "cloudDisk/mydisk",
          redirect: 'cloudDisk/mydisk/-1',
        },
        {
          path: "cloudDisk/mydisk/:id",
          meta: { pageType: "cloudDisk", childCompName: "mydisk" },
          component: MyCloud
        },
        {
          path: "cloudDisk/business",
          meta: { pageType: "cloudDisk", childCompName: "business" },
          component: BusinessFile
        },
        {
          path: "office",
          meta: { pageType: "office" }
        },
        {
          path: "office/:id",
          meta: { pageType: "office" },
          component: OfficeContent
        },
        {
          path: "office/:id/expensePayment",
          meta: { pageType: "office" },
          component: ExpensePaymentList
        },
        {
          path: "office/:id/expensePayment/:expenseID",
          meta: { pageType: "office" },
          component: ExpensePaymentDetail
        },
        {
          path: "office/:id/borrowPayment",
          meta: { pageType: "office" },
          component: BorrowPaymentList
        },
        {
          path: "office/:id/borrowPayment/:borrowID",
          meta: { pageType: "office" },
          component: BorrowPaymentDetail
        },
        // 考核模板
        {
          path: "office/:id/examineTemplate",
          meta: { pageType: "office" },
          component: ExamineTemplateList
        },
        {
          path: "office/:id/examineTemplate/add",
          meta: { pageType: "office", type: "add" },
          component: ExamineTemplateDetail
        },
        {
          path: "office/:id/examineTemplate/update/:templateID",
          meta: { pageType: "office", type: "update" },
          component: ExamineTemplateDetail
        },
        {
          path: "office/:id/examineTemplate/detail/:templateID",
          meta: { pageType: "office", type: "detail" },
          component: ExamineTemplateDetail
        },
        // 员工信息
        {
          path: "office/:id/staffInfo",
          meta: { pageType: "office" },
          component: StaffInfoList
        },
        {
          path: "office/:id/staffInfo/add",
          meta: { pageType: "office", type: "add" },
          component: StaffInfoDetail
        },
        {
          path: "office/:id/staffInfo/update/:staffID",
          meta: { pageType: "office", type: "update" },
          component: StaffInfoDetail
        },
        // 幼儿出勤
        {
          path: "office/:id/noteAttendance",
          meta: { pageType: "office" },
          component: NoteAttendanceList
        },
        // 幼儿管理
        {
          path: "office/:id/childInfo",
          meta: { pageType: "office" },
          component: ChildInfoList
        },
        {
          path: "office/:id/childInfo/update/:childID",
          meta: { pageType: "office", type: "update" },
          component: ChildInfoDetail
        },
        {
          path: "office/:id/childInfo/familyMember/:childID",
          meta: { pageType: "office" },
          component: EditFamilyMember
        },
        {
          path: "office/:id/childInfo/familyMember/:childID/addFamilyMember/",
          meta: { pageType: "office", type: "add" },
          component: FamilyMemberInfo
        },
        {
          path: "office/:id/childInfo/familyMember/:childID/updateFamilyMember/:familyMemberID",
          meta: { pageType: "office", type: "update" },
          component: FamilyMemberInfo
        },
        // 新生录入
        {
          path: "office/:id/addNewChild",
          meta: { pageType: "office" },
          component: AddNewChildList
        },
        {
          path: "office/:id/addNewChild/add",
          meta: { pageType: "office", type: "add" },
          component: ChildInfoDetail
        },
        {
          path: "office/:id/addNewChild/update/:childID",
          meta: { pageType: "office", type: "update" },
          component: ChildInfoDetail
        },
        {
          path: "office/:id/addNewChild/familyMember/:childID",
          meta: { pageType: "office" },
          component: EditFamilyMember
        },
        {
          path: "office/:id/addNewChild/familyMember/:childID/addFamilyMember/",
          meta: { pageType: "office", type: "add" },
          component: FamilyMemberInfo
        },
        {
          path: "office/:id/addNewChild/familyMember/:childID/updateFamilyMember/:familyMemberID",
          meta: { pageType: "office", type: "update" },
          component: FamilyMemberInfo
        },
        // 新生分班
        {
          path: "office/:id/assignChild",
          meta: { pageType: "office" },
          component: AssignChildList
        },
        // 班级管理
        {
          path: "office/:id/classManagement",
          meta: { pageType: "office" },
          component: ClassManagementList
        },
      ]
    }
  ]
})