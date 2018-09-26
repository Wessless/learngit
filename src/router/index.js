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
import PaymentSubjectList from '@/page/office/childInfo/PaymentSubjectList'
import EditFamilyMember from '@/page/office/childInfo/EditFamilyMember'
import FamilyMemberInfo from '@/page/office/childInfo/FamilyMemberInfo'
import AddNewChildList from '@/page/office/addNewChild/AddNewChildList'
import NewChildPayment from '@/page/office/addNewChild/NewChildPayment'
import AssignChildList from '@/page/office/assignChild/AssignChildList'
import ClassManagementList from '@/page/office/classManagement/ClassManagementList'
import ClassManagementDetail from '@/page/office/classManagement/ClassManagementDetail'
import BeeBindList from '@/page/office/beeBind/BeeBindList'
import ClassEvaluationList from '@/page/office/classEvaluation/ClassEvaluationList'
import ClassEvaluationMonth from '@/page/office/classEvaluation/ClassEvaluationMonth'
import ClassEvaluationChild from '@/page/office/classEvaluation/ClassEvaluationChild'
import TeacherEvaluationList from '@/page/office/teacherEvaluation/TeacherEvaluationList'
import TeacherEvaluationDay from '@/page/office/teacherEvaluation/TeacherEvaluationDay'
import TeacherEvaluationMonth from '@/page/office/teacherEvaluation/TeacherEvaluationMonth'
import TeacherEvaluationNotice from '@/page/office/teacherEvaluation/TeacherEvaluationNotice'
// 物品申领
// import ReceiveApplyList from '@/page/office/ReceiveApply/ReceiveApplyList'// 申领申请
import ReceiveApplyDetail from '@/page/office/ReceiveApply/ReceiveApplyDetail'
// import ApplyExamineList from '@/page/office/applyExamine/ApplyExamineList'// 申领审批
import ApplyExamineDetail from '@/page/office/applyExamine/ApplyExamineDetail'
// import ApplyOutstorageList from '@/page/office/applyOutstorage/ApplyOutstorageList'// 申领出库
import ApplyOutstorageDetail from '@/page/office/applyOutstorage/ApplyOutstorageDetail'
// import ApplyInstorageList from '@/page/office/applyInstorage/ApplyInstorageList'// 申领归还
import ApplyInstorageDetail from '@/page/office/applyInstorage/ApplyInstorageDetail'
import ApplyFindList from '@/page/office/applyFind/ApplyFindList'
import ApplyFindDetail from '@/page/office/applyFind/ApplyFindDetail'
// 物品采购
import PurchaseApplyList from '@/page/office/purchaseApply/PurchaseApplyList'// 采购申请
import PurchaseApplyDetail from '@/page/office/purchaseApply/PurchaseApplyDetail'
import PurchaseSignList from '@/page/office/purchaseSign/PurchaseSignList'// 采购审批
import PurchaseSignDetail from '@/page/office/purchaseSign/PurchaseSignDetail'
import PurchaseEnteringList from '@/page/office/purchaseEntering/PurchaseEnteringList'// 采购录入
import PurchaseEnteringDetail from '@/page/office/purchaseEntering/PurchaseEnteringDetail'
import PurchaseInstorageList from '@/page/office/purchaseInstorage/PurchaseInstorageList'//采购入库
import EditPurchaseInstorage from '@/page/office/purchaseInstorage/EditPurchaseInstorage'
import EditPurchaseInstorageDetail from '@/page/office/purchaseInstorage/EditPurchaseInstorageDetail'
import PurchaseFindList from '@/page/office/purchaseFind/PurchaseFindList'
// 兴趣班
import InterestClassTeacherList from '@/page/office/interestClassTeacher/InterestClassTeacherList'
import CalendarView from '@/page/office/calendarView/CalendarView'
import SetTuitionSubjectList from '@/page/office/setTuitionSubject/SetTuitionSubjectList'
import SetTuitionSubjectDetail from '@/page/office/setTuitionSubject/SetTuitionSubjectDetail'
import InterestClassTeacherDetail from '@/page/office/interestClassTeacher/InterestClassTeacherDetail'
import InterestClassManageList from '@/page/office/interestClassManage/InterestClassManageList'
import InterestClassManageDetail from '@/page/office/interestClassManage/InterestClassManageDetail'
import EditSchedule from '@/page/office/interestClassManage/EditSchedule'
import InterestClassChildList from '@/page/office/interestClassChild/InterestClassChildList'
import InterestClassChildDetail from '@/page/office/interestClassChild/InterestClassChildDetail'
import InterestClassAttendanceList from '@/page/office/interestClassAttendance/InterestClassAttendanceList'
import InterestClassAttendanceDetail from '@/page/office/interestClassAttendance/InterestClassAttendanceDetail'
import TeacherAttendanceList from '@/page/office/interestClassAttendance/TeacherAttendanceList'
import StudentAttendanceList from '@/page/office/interestClassAttendance/StudentAttendanceList'
import InterestClassExpenseList from '@/page/office/interestClassExpense/InterestClassExpenseList'
import ExamineExpenseList from '@/page/office/interestClassExpense/ExamineExpenseList'
import ExamineExpenseDetail from '@/page/office/interestClassExpense/ExamineExpenseDetail'
import IssueExpenseList from '@/page/office/interestClassExpense/IssueExpenseList'
import InterestClassOperationList from '@/page/office/interestClassOperation/InterestClassOperationList'
import InterestClassTexpendList from '@/page/office/interestClassTexpend/InterestClassTexpendList'
import InterestClassTexpendDetail from '@/page/office/interestClassTexpend/InterestClassTexpendDetail'
import SetScheduleList from '@/page/office/setSchedule/SetScheduleList'
import SetScheduleDetail from '@/page/office/setSchedule/SetScheduleDetail'
import CoursePlanManageList from '@/page/office/coursePlanManage/CoursePlanManageList'
import CoursePlanManageDetail from '@/page/office/coursePlanManage/CoursePlanManageDetail'
import CoursePlanExamineList from '@/page/office/coursePlanExamine/CoursePlanExamineList'
import PerfectManageList from '@/page/office/coursePlanPerfectManage/PerfectManageList'
import PerfectManageDetail from '@/page/office/coursePlanPerfectManage/PerfectManageDetail'
import examineApproveList from '@/page/office/examineApprove/examineApproveList'
import expenseApplyDetail from '@/page/office/examineApproveTab/expenseApplyDetail'
import borrowApplyDetail from '@/page/office/examineApproveTab/borrowApplyDetail'
import ExpenseFindList from '@/page/office/expenseFind/ExpenseFindList'
import RoleSettingList from '@/page/office/roleSetting/RoleSettingList'
import RoleSettingDetail from '@/page/office/roleSetting/RoleSettingDetail'
import BorrowFindList from '@/page/office/borrowFind/BorrowFindList'
import commonApplyDetail from '@/page/office/examineApproveTab/commonApplyDetail'
import gooutApplyDetail from '@/page/office/examineApproveTab/gooutApplyDetail'
import businessTripApplyDetail from '@/page/office/examineApproveTab/businessTripApplyDetail'
import holidayApplyDetail from '@/page/office/examineApproveTab/holidayApplyDetail'
import extraWorkApplyDetail from '@/page/office/examineApproveTab/extraWorkApplyDetail'
import orderformApplyDetail from '@/page/office/examineApproveTab/orderformApplyDetail'
import illegalApplyDetail from '@/page/office/examineApproveTab/illegalApplyDetail'
import commonApproveDetail from '@/page/office/otherApprove/commonApproveDetail'
import outsideApproveDetail from '@/page/office/otherApprove/outsideApproveDetail'
import businessApproveDetail from '@/page/office/otherApprove/businessApproveDetail'
import holidayApproveDetail from '@/page/office/otherApprove/holidayApproveDetail'
import extraWorkApproveDetail from '@/page/office/otherApprove/extraWorkApproveDetail'
import illegalApproveDetail from '@/page/office/otherApprove/illegalApproveDetail'
import orderformApproveDetail from '@/page/office/otherApprove/orderformApproveDetail'
import OrderformFindList from '@/page/office/orderformFind/OrderformFindList'
import OrderformFindDetail from '@/page/office/orderformFind/OrderformFindDetail'
import MyDatabaseList from '@/page/office/myDatabase/MyDatabaseList'
import MyDatabaseManager from '@/page/office/myDatabase/MyDatabaseManager'
import MyDatabaseBrowse from '@/page/office/myDatabase/MyDatabaseBrowse'
import MyDatabaseMaintenance from '@/page/office/myDatabase/MyDatabaseMaintenance'
import MyDatabaseArticleDetail from '@/page/office/myDatabase/MyDatabaseArticleDetail'
import InternalEmailList from '@/page/office/internalEmail/InternalEmailList'
import InternalEmailDetail from '@/page/office/internalEmail/InternalEmailDetail'
import ExamineEmailDetail from '@/page/office/internalEmail/ExamineEmailDetail'
import GoodsApplyTabList from '@/page/office/goodsApply/GoodsApplyTabList'
import GoodsPurchaseTabList from '@/page/office/goodsPurchase/GoodsPurchaseTabList'
import BorrowRepaymentList from '@/page/office/borrowRepayment/BorrowRepaymentList'
import ExpenseCertificateList from '@/page/office/expenseCertificate/ExpenseCertificateList'
import BorrowCertificateList from '@/page/office/borrowCertificate/BorrowCertificateList'
import DueExpenseList from '@/page/office/dueExpense/DueExpenseList'
import DueExpenseIdList from '@/page/office/dueExpense/DueExpenseIdList'
import DueExpenseIdDetail from '@/page/office/dueExpense/DueExpenseIdDetail'
import SchoolInformList from '@/page/office/schoolInform/SchoolInformList'
import SchoolInformDetail from '@/page/office/schoolInform/SchoolInformDetail'
import ParentschoolContactList from '@/page/office/parentschoolContact/ParentschoolContactList'
import ParentschoolContactDetail from '@/page/office/parentschoolContact/ParentschoolContactDetail'
import SchoolPhotoesList from '@/page/office/schoolInform/SchoolPhotoesList'
import SchoolPhotoesDetail from '@/page/office/schoolInform/SchoolPhotoesDetail'
import ParentschoolPhotoesList from '@/page/office/parentschoolContact/ParentschoolPhotoesList'
import ParentschoolPhotoesDetail from '@/page/office/parentschoolContact/ParentschoolPhotoesDetail'
import ChildPhotoesList from '@/page/office/childPhotoes/ChildPhotoesList'
import ChildPhotoesDetail from '@/page/office/childPhotoes/ChildPhotoesDetail'
import teacherWordList from '@/page/office/teacherWord/teacherWordList'
import teacherWordDetail from '@/page/office/teacherWord/teacherWordDetail'
import ChargeExpendList from '@/page/group/chargeExpend/ChargeExpendList'
import ChargeExpendDetail from '@/page/group/chargeExpend/ChargeExpendDetail'
import StaffDataList from '@/page/group/staffData/StaffDataList'
import StudentDataList from '@/page/group/studentData/StudentDataList'
import DuePaymentList from '@/page/office/duePayment/DuePaymentList'
import DuePaymentDetail from '@/page/office/duePayment/DuePaymentDetail'
import DueCertificateList from '@/page/office/dueCertificate/DueCertificateList'
import DueFindList from '@/page/office/dueFind/DueFindList'
import BankAccountList from '@/page/office/bankAccount/BankAccountList'
import BankAccountDetail from '@/page/office/bankAccount/BankAccountDetail'

Vue.use(Router);

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
          redirect: 'office/1',
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
          meta: { pageType: "office",isoffice:true }
        },
        {
          path: "office/:id",
          meta: { pageType: "office" },
          component: OfficeContent
        },
        // 日历查看
        {
          path: "office/:id/calendarView",
          meta: { pageType: "office", type:"detail"},
          component: CalendarView
        },
        // 日历设定
        {
          path: "office/:id/calendarEdit",
          meta: { pageType: "office", type:"update"},
          component: CalendarView
        },
        // 报销支付
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
        // 借款支付
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
          path: "office/:id/childInfo/paymentSubject",
          meta: { pageType: "office" },
          component: PaymentSubjectList
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
        {
          path: "office/:id/addNewChild/newChildPayment/:childID",
          meta: { pageType: "office" },
          component: NewChildPayment
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
        {
          path: "office/:id/classManagement/add",
          meta: { pageType: "office", type: "add" },
          component: ClassManagementDetail
        },
        {
          path: "office/:id/classManagement/update/:classID",
          meta: { pageType: "office", type: "update" },
          component: ClassManagementDetail
        },
        {
          path: "office/:id/classManagement/detail/:classID",
          meta: { pageType: "office", type: "detail" },
          component: ClassManagementDetail
        },
        // 蜂堡绑定
        {
          path: "office/:id/beeBind",
          meta: { pageType: "office" },
          component: BeeBindList
        },
        // 按班级评定
        {
          path: "office/:id/classEvaluation",
          meta: { pageType: "office" },
          component: ClassEvaluationList
        },
        {
          path: "office/:id/classEvaluation/month/:classID/:month",
          meta: { pageType: "office" },
          component: ClassEvaluationMonth
        },
        {
          path: "office/:id/classEvaluation/child/:classID/:month",
          meta: { pageType: "office" },
          component: ClassEvaluationChild
        },
        // 按教工评定
        {
          path: "office/:id/teacherEvaluation",
          meta: { pageType: "office" },
          component: TeacherEvaluationList
        },
        {
          path: "office/:id/teacherEvaluation/day/:staffID",
          meta: { pageType: "office", type:"day"},
          component: TeacherEvaluationDay
        },
        {
          path: "office/:id/teacherEvaluation/month/:staffID/:month",
          meta: { pageType: "office", type:"month"},
          component: TeacherEvaluationMonth
        },
        {
          path: "office/:id/teacherEvaluation/notice/:staffID/:typeID/:date",
          meta: { pageType: "office", type:"month"},
          component: TeacherEvaluationNotice
        },
        // 申领申请
        // {
        //   path:"office/:id/receiveApply",
        //   meta: { pageType: "office" },
        //   component: ReceiveApplyList
        // },
        {
          path:"office/:id/goodsApplyTab/receiveApply/update/:applyId",
          meta: { pageType: "office",type:"update" },
          component: ReceiveApplyDetail
        },
        {
          path:"office/:id/goodsApplyTab/receiveApply/add/:goodsID",
          meta: { pageType: "office",type:"add" },
          component: ReceiveApplyDetail
        },
        //
        // {
        //   path:"office/:id/applyExamine",
        //   meta: { pageType: "office" },
        //   component: ApplyExamineList
        // },
        {
          path:"office/:id/goodsApplyTab/applyExamine/signature/:applyId",
          meta: { pageType: "office" ,type:"signature"},
          component: ApplyExamineDetail
        },
        //
        // {
        //   path:"office/:id/applyOutstorage",
        //   meta: { pageType: "office" },
        //   component: ApplyOutstorageList
        // },
        {
          path:"office/:id/goodsApplyTab/applyOutstorage/examine/:applyId",
          meta: { pageType: "office" ,type:"examine"},
          component: ApplyOutstorageDetail
        },
        //
        // {
        //   path:"office/:id/applyInstorage",
        //   meta: { pageType: "office" },
        //   component: ApplyInstorageList
        // },
        {
          path:"office/:id/goodsApplyTab/applyInstorage/examine/:applyId",
          meta: { pageType: "office" ,type:"examine"},
          component: ApplyInstorageDetail
        },
        //
        {
          path:"office/:id/applyFind",
          meta: { pageType: "office" },
          component: ApplyFindList
        },
        {
          path:"office/:id/applyFind/examine/:applyId",
          meta: { pageType: "office" ,type:"examine"},
          component: ApplyFindDetail
        },
        {
          path:"office/:id/purchaseApply",
          meta: { pageType: "office" },
          component: PurchaseApplyList
        },
        {
          path:"office/:id/goodsPurchaseTab/purchaseApply/update/:applyId",
          meta: { pageType: "office" ,type:"update"},
          component: PurchaseApplyDetail
        },
        {
          path:"office/:id/goodsPurchaseTab/purchaseApply/add",
          meta: { pageType: "office" ,type:"add"},
          component: PurchaseApplyDetail
        },
        {
          path:"office/:id/purchaseSign",
          meta: { pageType: "office" },
          component: PurchaseSignList
        },
        {
          path:"office/:id/goodsPurchaseTab/purchaseSign/signature/:applyId",
          meta: { pageType: "office" ,type:"signature"},
          component: PurchaseSignDetail
        },
        {
          path:"office/:id/purchaseEntering",
          meta: { pageType: "office" },
          component: PurchaseEnteringList
        },
        {
          path:"office/:id/goodsPurchaseTab/purchaseEntering/enter/:applyId",
          meta: { pageType: "office" ,type:"enter"},
          component: PurchaseEnteringDetail
        },
        {
          path:"office/:id/goodsPurchaseTab/purchaseEntering/update/:applyId",
          meta: { pageType: "office" ,type:"update"},
          component: PurchaseEnteringDetail
        },
        {
          path:"office/:id/purchaseInstorage",
          meta: { pageType: "office" },
          component: PurchaseInstorageList
        },
        {
          path:"office/:id/goodsPurchaseTab/purchaseInstorage/edit/:applyId",
          meta: { pageType: "office" ,type:"edit"},
          component: EditPurchaseInstorage
        },
        {
          path:"office/:id/goodsPurchaseTab/purchaseInstorage/edit/:applyId/update/:Id",
          meta: { pageType: "office" ,type:"update"},
          component: EditPurchaseInstorageDetail
        },
        {
          path:"office/:id/goodsPurchaseTab/purchaseInstorage/edit/:applyId/add/:Id",
          meta: { pageType: "office" ,type:"add"},
          component: EditPurchaseInstorageDetail
        },
        {
          path:"office/:id/purchaseFind",
          meta: { pageType: "office" },
          component: PurchaseFindList
        },
        //采购
        {
          path:"office/:id/purchaseFind/enter/:applyId",
          meta: { pageType: "office" ,type:"purchaseFindEnter"},
          component: PurchaseEnteringDetail
        },
        //入库
        {
          path:"office/:id/purchaseFind/edit/:applyId",
          meta: { pageType: "office" ,type:"purchaseFindEdit"},
          component: EditPurchaseInstorage
        },
        //兴趣班外聘教师
        {
          path:"office/:id/interestClassTeacher",
          meta: { pageType: "office" },
          component: InterestClassTeacherList
        },
        {
          path:"office/:id/interestClassTeacher/update/:ID",
          meta: { pageType: "office" ,type:"update"},
          component: InterestClassTeacherDetail
        },
        {
          path:"office/:id/interestClassTeacher/add",
          meta: { pageType: "office" ,type:"add"},
          component: InterestClassTeacherDetail
        },
        //兴趣班班级管理
        {
          path:"office/:id/interestClassManage",
          meta: { pageType: "office" },
          component: InterestClassManageList
        },
        {
          path:"office/:id/interestClassManage/update/:classID",
          meta: { pageType: "office" ,type:"update"},
          component: InterestClassManageDetail
        },
        {
          path:"office/:id/interestClassManage/add",
          meta: { pageType: "office" ,type:"add"},
          component: InterestClassManageDetail
        },
        {
          path:"office/:id/interestClassManage/edit/:classID",
          meta: { pageType: "office" ,type:"edit"},
          component: EditSchedule
        },
        //兴趣班幼儿管理
        {
          path:"office/:id/interestClassChild",
          meta: { pageType: "office" },
          component: InterestClassChildList
        },
        {
          path:"office/:id/interestClassChild/update/:ID",
          meta: { pageType: "office" ,type:"update"},
          component: InterestClassChildDetail
        },
        {
          path:"office/:id/interestClassChild/add/:classID",
          meta: { pageType: "office" ,type:"add"},
          component: InterestClassChildDetail
        },
        //兴趣班出勤管理
        {
          path:"office/:id/interestClassAttendance",
          meta: { pageType: "office" },
          component: InterestClassAttendanceList
        },
        {
          path:"office/:id/interestClassAttendance/examineAttendance/:classId",
          meta: { pageType: "office" ,type:"examine"},
          component: InterestClassAttendanceDetail
        },
        {
          path:"office/:id/interestClassAttendance/updateTeacher/:data",
          meta: { pageType: "office" ,type:"update"},
          component: TeacherAttendanceList
        },
        {
          path:"office/:id/interestClassAttendance/changeTeacher/:data",
          meta: { pageType: "office" ,type:"change"},
          component: TeacherAttendanceList
        },
        {
          path:"office/:id/interestClassAttendance/updateStudent/:data",
          meta: { pageType: "office" ,type:"update"},
          component: StudentAttendanceList
        },
        {
          path:"office/:id/interestClassAttendance/changeStudent/:data",
          meta: { pageType: "office" ,type:"change"},
          component: StudentAttendanceList
        },
        //兴趣班收费设定
        {
          path:"office/:id/interestClassExpense",
          meta: { pageType: "office" },
          component: InterestClassExpenseList
        },
        {
          path:"office/:id/interestClassExpense/examine/:data",
          meta: { pageType: "office" ,type:"examine"},
          component: ExamineExpenseList
        },
        {
          path:"office/:id/interestClassExpense/examine/:data/update/:ID",
          meta: { pageType: "office" ,type:"update"},
          component: ExamineExpenseDetail
        },
        {
          path:"office/:id/interestClassExpense/examine/:data/add",
          meta: { pageType: "office" ,type:"add"},
          component: ExamineExpenseDetail
        },
        {
          path:"office/:id/interestClassExpense/issue/:data",
          meta: { pageType: "office" ,type:"issue"},
          component: IssueExpenseList
        },
        //兴趣班收费操作
        {
          path:"office/:id/interestClassOperation",
          meta: { pageType: "office" },
          component: InterestClassOperationList
        },
        //兴趣班收费查询
        {
          path:"office/:id/interestClassExpense/examine",
          meta: { pageType: "office" ,type:"examine"},
          component: InterestClassExpenseList
        },
        {
          path:"office/:id/interestClassExpense/examine/examined/:data",
          meta: { pageType: "office" ,type:"examined"},
          component: ExamineExpenseList
        },
        //兴趣班教师支出
        {
          path:"office/:id/interestClassTexpend",
          meta: { pageType: "office" },
          component: InterestClassTexpendList
        },
        {
          path:"office/:id/interestClassTexpend/examine/:data",
          meta: { pageType: "office" ,type:"examine"},
          component: InterestClassTexpendDetail
        },
        //教职工教学
        //课程表设定
        {
          path:"office/:id/setSchedule",
          meta: { pageType: "office" },
          component: SetScheduleList
        },
        {
          path:"office/:id/setSchedule/update/:data",
          meta: { pageType: "office" ,type:"update"},
          component: SetScheduleDetail
        },
        {
          path:"office/:id/setSchedule/add/:data",
          meta: { pageType: "office" ,type:"add"},
          component: SetScheduleDetail
        },
        //课程表查询
        {
          path:"office/:id/setSchedule/examine",
          meta: { pageType: "office" ,type:"examine"},
          component: SetScheduleList
        },
        //教案管理
        {
          path:"office/:id/coursePlanManage",
          meta: { pageType: "office" },
          component: CoursePlanManageList
        },
        {
          path:"office/:id/coursePlanManage/edit/:ID",
          meta: { pageType: "office" ,type:"edit"},
          component: CoursePlanManageDetail
        },
        {
          path:"office/:id/coursePlanManage/add/:ID",
          meta: { pageType: "office" ,type:"add"},
          component: CoursePlanManageDetail
        },
        {
          path:"office/:id/coursePlanManage/examine/:ID",
          meta: { pageType: "office" ,type:"examine"},
          component: CoursePlanManageDetail
        },
        {
          path:"office/:id/coursePlanManage/:Id",
          meta: { pageType: "office" ,type:"copy"},
          component: PerfectManageList
        },
        {
          path:"office/:id/coursePlanManage/:Id/copy/:ID",
          meta: { pageType: "office" ,type:"copy"},
          component: PerfectManageDetail
        },
        //教案审批
        {
          path:"office/:id/coursePlanExamine",
          meta: { pageType: "office" },
          component: CoursePlanExamineList
        },
        {
          path:"office/:id/coursePlanExamine/examineApprover/:ID",
          meta: { pageType: "office" ,type:"examineApprover"},
          component: CoursePlanManageDetail
        },
        {
          path:"office/:id/coursePlanExamine/approver/:ID",
          meta: { pageType: "office" ,type:"approver"},
          component: CoursePlanManageDetail
        },
        //精品教案库管理
        {
          path:"office/:id/coursePlanPerfectManage",
          meta: { pageType: "office" },
          component: PerfectManageList
        },
        {
          path:"office/:id/coursePlanPerfectManage/update/:ID",
          meta: { pageType: "office" ,type:"update"},
          component: PerfectManageDetail
        },
        {
          path:"office/:id/coursePlanPerfectManage/add",
          meta: { pageType: "office" ,type:"add"},
          component: PerfectManageDetail
        },
        //精品教案库管理浏览
        {
          path:"office/:id/coursePlanPerfectManage/examine",
          meta: { pageType: "office" ,type:"examine"},
          component: PerfectManageList
        },
        {
          path:"office/:id/coursePlanPerfectManage/examine/examined/:ID",
          meta: { pageType: "office" ,type:"examined"},
          component: PerfectManageDetail
        },
        // 学杂费科目设定
        {
          path:"office/:id/setTuitionSubject",
          meta: { pageType: "office" },
          component: SetTuitionSubjectList
        },
        {
          path:"office/:id/setTuitionSubject/add",
          meta: { pageType: "office",type:"add" },
          component: SetTuitionSubjectDetail
        },
        {
          path:"office/:id/setTuitionSubject/update/:subjectID",
          meta: { pageType: "office",type:"update" },
          component: SetTuitionSubjectDetail
        },
        //审批
        {
          path:"office/:id/examineApprove",
          meta: { pageType: "office" },
          component: examineApproveList
        },
        //报销
        {
          path:"office/:id/examineApprove/expenseApply",
          meta: { pageType: "office" ,type:"add"},
          component: expenseApplyDetail
        },
        {
          path:"office/:id/examineApprove/updateExpense/:ChargeID",
          meta: { pageType: "office" ,type:"update"},
          component: expenseApplyDetail
        },
        {
          path:"office/:id/examineApprove/examineExpense/:expenseID",
          meta: { pageType: "office" ,type:"examine"},
          component: ExpensePaymentDetail
        },
        {
          path:"office/:id/examineApprove/approveExpense/:expenseID",
          meta: { pageType: "office" ,type:"approve"},
          component: ExpensePaymentDetail
        },
        //借款
        {
          path:"office/:id/examineApprove/borrowApply",
          meta: { pageType: "office" ,type:"add"},
          component: borrowApplyDetail
        },
        {
          path:"office/:id/examineApprove/updateBorrow/:ChargeID",
          meta: { pageType: "office" ,type:"update"},
          component: borrowApplyDetail
        },
        {
          path:"office/:id/examineApprove/examineBorrow/:borrowID",
          meta: { pageType: "office" ,type:"examine"},
          component: BorrowPaymentDetail
        },
        {
          path:"office/:id/examineApprove/approveBorrow/:borrowID",
          meta: { pageType: "office" ,type:"approve"},
          component: BorrowPaymentDetail
        },
        //报销查询
        {
          path:"office/:id/expenseFind",
          meta: { pageType: "office" },
          component: ExpenseFindList
        },
        {
          path:"office/:id/expenseFind/:expenseID",
          meta: { pageType: "office" ,type:"find"},
          component: ExpensePaymentDetail
        },
        //借款查询
        {
          path:"office/:id/borrowFind",
          meta: { pageType: "office" },
          component: BorrowFindList
        },
        {
          path:"office/:id/borrowFind/:borrowID",
          meta: { pageType: "office" ,type:"find"},
          component: BorrowPaymentDetail
        },
        //通用
        {
          path:"office/:id/examineApprove/commonApply",
          meta: { pageType: "office" ,type:"add"},
          component: commonApplyDetail
        },
        {
          path:"office/:id/examineApprove/examineCommon/:commonID",
          meta: { pageType: "office" ,type:"examine"},
          component: commonApproveDetail
        },
        {
          path:"office/:id/examineApprove/approveCommon/:commonID",
          meta: { pageType: "office" ,type:"approve"},
          component: commonApproveDetail
        },

        //外出
        {
          path:"office/:id/examineApprove/gooutApply",
          meta: { pageType: "office" ,type:"add"},
          component: gooutApplyDetail
        },
        {
          path:"office/:id/examineApprove/examineOutside/:outsideID",
          meta: { pageType: "office" ,type:"examine"},
          component: outsideApproveDetail
        },
        {
          path:"office/:id/examineApprove/approveOutside/:outsideID",
          meta: { pageType: "office" ,type:"approve"},
          component: outsideApproveDetail
        },
        
        //出差
        {
          path:"office/:id/examineApprove/businessTripApply",
          meta: { pageType: "office" ,type:"add"},
          component: businessTripApplyDetail
        },
        {
          path:"office/:id/examineApprove/examineBusiness/:businessID",
          meta: { pageType: "office" ,type:"examine"},
          component: businessApproveDetail
        },
        {
          path:"office/:id/examineApprove/approveBusiness/:businessID",
          meta: { pageType: "office" ,type:"approve"},
          component: businessApproveDetail
        },

        //请假
        {
          path:"office/:id/examineApprove/holidayApply",
          meta: { pageType: "office" ,type:"add"},
          component: holidayApplyDetail
        },
        {
          path:"office/:id/examineApprove/examineHoliday/:holidayID",
          meta: { pageType: "office" ,type:"examine"},
          component: holidayApproveDetail
        },
        {
          path:"office/:id/examineApprove/approveHoliday/:holidayID",
          meta: { pageType: "office" ,type:"approve"},
          component: holidayApproveDetail
        },

        //加班
        {
          path:"office/:id/examineApprove/extraWorkApply",
          meta: { pageType: "office" ,type:"add"},
          component: extraWorkApplyDetail
        },
        {
          path:"office/:id/examineApprove/examineExtrawork/:extraworkID",
          meta: { pageType: "office" ,type:"examine"},
          component: extraWorkApproveDetail
        },
        {
          path:"office/:id/examineApprove/approveExtrawork/:extraworkID",
          meta: { pageType: "office" ,type:"approve"},
          component: extraWorkApproveDetail
        },
        
        //订单
        {
          path:"office/:id/examineApprove/orderformApply",
          meta: { pageType: "office" ,type:"add"},
          component: orderformApplyDetail
        },
        {
          path:"office/:id/examineApprove/updateOrderform/:orderformID",
          meta: { pageType: "office" ,type:"update"},
          component: orderformApplyDetail
        },
        {
          path:"office/:id/examineApprove/examineOrderform/:orderformID",
          meta: { pageType: "office" ,type:"examine"},
          component: orderformApproveDetail
        },
        {
          path:"office/:id/examineApprove/approveOrderform/:orderformID",
          meta: { pageType: "office" ,type:"approve"},
          component: orderformApproveDetail
        },

        //违规
        {
          path:"office/:id/examineApprove/illegalApply",
          meta: { pageType: "office" ,type:"add"},
          component: illegalApplyDetail
        },
        {
          path:"office/:id/examineApprove/examineIllegal/:illegalID",
          meta: { pageType: "office" ,type:"examine"},
          component: illegalApproveDetail
        },
        {
          path:"office/:id/examineApprove/approveIllegal/:illegalID",
          meta: { pageType: "office" ,type:"approve"},
          component: illegalApproveDetail
        },

        //订单查询
        {
          path:"office/:id/orderformFind",
          meta: { pageType: "office" },
          component: OrderformFindList
        },
        {
          path:"office/:id/orderformFind/:orderformID",
          meta: { pageType: "office" ,type:"find"},
          component: OrderformFindDetail
        },
        // 角色定义
        {
          path:"office/:id/roleSetting",
          meta: { pageType: "office" },
          component: RoleSettingList
        },
        {
          path:"office/:id/roleSetting/add",
          meta: { pageType: "office", type:"add"},
          component: RoleSettingDetail
        },
        {
          path:"office/:id/roleSetting/update/:roleID",
          meta: { pageType: "office", type:"update"},
          component: RoleSettingDetail
        },
        // 我的资料库
        {
          path:"office/:id/myDatabase",
          meta: { pageType: "office"},
          component: MyDatabaseList
        },
        {
          path:"office/:id/myDatabase/add",
          meta: { pageType: "office",type:"add"},
          component: MyDatabaseManager
        },
        {
          path:"office/:id/myDatabase/update/:KnowledgeBaseID",
          meta: { pageType: "office",type:"update"},
          component: MyDatabaseManager
        },
        {
          path:"office/:id/myDatabase/browse",
          meta: { pageType: "office"},
          component: MyDatabaseBrowse,
        },
        {
          path:"office/:id/myDatabase/maintenance",
          meta: { pageType: "office"},
          component: MyDatabaseMaintenance
        },
        {
          path:"office/:id/myDatabase/maintenance/articleUpdate/:articleID",
          meta: { pageType: "office",type:"update"},
          component: MyDatabaseArticleDetail
        },
        {
          path:"office/:id/myDatabase/maintenance/articleAdd",
          meta: { pageType: "office" ,type:"add"},
          component: MyDatabaseArticleDetail
        },
        //站内邮件
        {
          path:"office/:id/internalEmail",
          meta: { pageType: "office"},
          component: InternalEmailList
        },
        {
          path:"office/:id/internalEmail/examine/:emailID",
          meta: { pageType: "office" ,type:"examine"},
          component: ExamineEmailDetail
        },
        {
          path:"office/:id/internalEmail/add",
          meta: { pageType: "office" ,type:"add"},
          component: InternalEmailDetail
        },
        {
          path:"office/:id/internalEmail/transpond/:emailID",
          meta: { pageType: "office" ,type:"transpond"},
          component: InternalEmailDetail
        },
        {
          path:"office/:id/internalEmail/writeback/:emailID",
          meta: { pageType: "office" ,type:"writeback"},
          component: InternalEmailDetail
        },
        {
          path:"office/:id/internalEmail/allWriteback/:emailID",
          meta: { pageType: "office" ,type:"allWriteback"},
          component: InternalEmailDetail
        },
        // 物品申领
        {
          path:"office/:id/goodsApplyTab",
          meta: { pageType: "office" },
          component: GoodsApplyTabList
        },
        // 物品采购
        {
          path:"office/:id/goodsPurchaseTab",
          meta: { pageType: "office" },
          component: GoodsPurchaseTabList
        },
        // 借款还款
        {
          path:"office/:id/borrowRepayment",
          meta: { pageType: "office" },
          component: BorrowRepaymentList
        },
        {
          path: "office/:id/borrowRepayment/:borrowID",
          meta: { pageType: "office" },
          component: BorrowPaymentDetail
        },
        // 报销凭证
        {
          path:"office/:id/expenseCertificate",
          meta: { pageType: "office" },
          component: ExpenseCertificateList
        },
        {
          path: "office/:id/expenseCertificate/:expenseID",
          meta: { pageType: "office" ,type:"certificate"},
          component: ExpensePaymentDetail
        },
        // 借款凭证
        {
          path:"office/:id/borrowCertificate",
          meta: { pageType: "office" },
          component: BorrowCertificateList
        },
        {
          path: "office/:id/borrowCertificate/:borrowID",
          meta: { pageType: "office" ,type:"certificate"},
          component: BorrowPaymentDetail
        },
        //应付款申请
        {
          path:"office/:id/examineApprove/dueApply",
          meta: { pageType: "office" },
          component: DueExpenseList
        },
        {
          path:"office/:id/examineApprove/dueApply/:expenseID",
          meta: { pageType: "office" },
          component: DueExpenseIdList
        },
        {
          path:"office/:id/examineApprove/dueApply/:expenseID/dueDetail/:staffID/:dueID",
          meta: { pageType: "office" },
          component: DuePaymentDetail
        },
        {
          path: "office/:id/examineApprove/dueApply/:expenseID/detail",// 报销详情
          meta: { pageType: "office" },
          component: ExpensePaymentDetail
        },
        {
          path: "office/:id/examineApprove/dueApply/:expenseID/add",// 添加审批
          meta: { pageType: "office", type:"add" },
          component: DueExpenseIdDetail
        },
        {
          path: "office/:id/examineApprove/updateDue/:expenseID/:staffID/:examineID/:dueID",// 修改审批
          meta: { pageType: "office", type:"update" },
          component: DueExpenseIdDetail
        },
        // 应付款审批
        {
          path:"office/:id/examineApprove/examineDue/:expenseID/:staffID/:examineID/:dueID",// 详情
          meta: { pageType: "office" ,type:"examine"},
          component: DuePaymentDetail
        },
        {
          path:"office/:id/examineApprove/approveDue/:expenseID/:staffID/:examineID/:dueID",// 审批
          meta: { pageType: "office" ,type:"approve"},
          component: DuePaymentDetail
        },
        // 应付款支付
        {
          path:"office/:id/duePayment",
          meta: { pageType: "office" },
          component: DuePaymentList
        },
        {
          path:"office/:id/duePayment/:expenseID/:staffID/:dueID",
          meta: { pageType: "office", type:"detail" },
          component: DuePaymentDetail
        },
        // 应付款终止
        {
          path:"office/:id/dueStop",
          meta: { pageType: "office",type:"stop" },
          component: DueExpenseList
        },
        {
          path:"office/:id/dueStop/:expenseID",
          meta: { pageType: "office",type:"stop" },
          component: DueExpenseIdList
        },
        {
          path: "office/:id/dueStop/:expenseID/dueDetail/:staffID/:dueID",
          meta: { pageType: "office" },
          component: DuePaymentDetail
        },
        {
          path: "office/:id/dueStop/:expenseID/detail",
          meta: { pageType: "office" },
          component: ExpensePaymentDetail
        },
        // 应付款凭证
        {
          path:"office/:id/dueCertificate",
          meta: { pageType: "office" },
          component: DueCertificateList
        },
        {
          path: "office/:id/dueCertificate/certificate/:expenseID/:staffID/:dueID",
          meta: { pageType: "office", type:"certificate" },
          component: DuePaymentDetail
        },
        // 应付款查询
        {
          path:"office/:id/dueFind",
          meta: { pageType: "office" },
          component: DueFindList
        },
        {
          path:"office/:id/dueFind/:expenseID/:staffID/:dueID",
          meta: { pageType: "office" },
          component: DuePaymentDetail
        },
        // 银行账户
        {
          path:"office/:id/bankAccount",
          meta: { pageType: "office" },
          component: BankAccountList
        },
        {
          path:"office/:id/bankAccount/add",
          meta: { pageType: "office", type:"add" },
          component: BankAccountDetail
        },
        {
          path:"office/:id/bankAccount/update/:bankID",
          meta: { pageType: "office", type:"update" },
          component: BankAccountDetail
        },
        //园所通知
        {
          path:"office/:id/schoolInform",
          meta: { pageType: "office" },
          component: SchoolInformList
        },
        {
          path:"office/:id/schoolInform/examine/:noticeID",
          meta: { pageType: "office" ,type:"examine"},
          component: SchoolInformDetail
        },
        //家校联络
        {
          path:"office/:id/parentschoolContact",
          meta: { pageType: "office" },
          component: ParentschoolContactList
        },
        {
          path:"office/:id/parentschoolContact/examine/:noticeID",
          meta: { pageType: "office" ,type:"examine"},
          component: ParentschoolContactDetail
        },
        //园所相册
        {
          path:"office/:id/schoolPhotoes",
          meta: { pageType: "office" },
          component: SchoolPhotoesList
        },
        {
          path:"office/:id/schoolPhotoes/examine/:noticeID",
          meta: { pageType: "office" ,type:"examine"},
          component: SchoolPhotoesDetail
        },
        //班级相册
        {
          path:"office/:id/parentschoolPhotoes",
          meta: { pageType: "office" },
          component: ParentschoolPhotoesList
        },
        {
          path:"office/:id/parentschoolPhotoes/examine/:noticeID",
          meta: { pageType: "office" ,type:"examine"},
          component: ParentschoolPhotoesDetail
        },
        //个人相册
        {
          path:"office/:id/childPhotoes",
          meta: { pageType: "office" },
          component: ChildPhotoesList
        },
        {
          path:"office/:id/childPhotoes/examine/:photoesID",
          meta: { pageType: "office" ,type:"examine"},
          component: ChildPhotoesDetail
        },
        //老师的话
        {
          path:"office/:id/teacherWord",
          meta: { pageType: "office" },
          component: teacherWordList
        },
        {
          path:"office/:id/teacherWord/examine/:wordID",
          meta: { pageType: "office" ,type:"examine"},
          component: teacherWordDetail
        },
        //集团
        {
          path: "group",
          meta: { pageType: "group" }
        },
        //费用支出
        {
          path: "group/:cosNum/chargeExpend",
          meta: { pageType: "group" },
          component: ChargeExpendList,
          children:[
            {
              path:"expense/:expenseID",
              meta: { pageType: "group" ,type:"find"},
              component: ChargeExpendDetail
            },
          ]
        },
        //员工数据
        {
          path: "group/:cosNum/staffData",
          meta: { pageType: "group" },
          component: StaffDataList,
        },
        //学员数据
        {
          path: "group/:cosNum/studentData",
          meta: { pageType: "group" },
          component: StudentDataList,
        },

      ]
    }
  ]
})