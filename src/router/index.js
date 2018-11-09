import Vue from 'vue'
import Router from 'vue-router'
let MainPage = (resolve) => require(['@/page/MainPage'],resolve);//
let IndexLogin = (resolve) => require(['@/page/login/Index'],resolve);//
let Login = (resolve) => require(['@/page/login/Login'],resolve);//
let MyCloud = (resolve) => require(['@/page/cloudDisk/MyCloud'],resolve);//
let BusinessFile = (resolve) => require(['@/page/cloudDisk/BusinessFile'],resolve);//
let CreateGroup = (resolve) => require(['@/page/user/CreateGroup'],resolve);//
let StaffInfo = (resolve) => require(['@/page/user/StaffInfo'],resolve);//
let GroupInfo = (resolve) => require(['@/page/user/GroupInfo'],resolve);//
let OfficeContent = (resolve) => require(['@/page/office/OfficeContent'],resolve);//
let ExpensePaymentList = (resolve) => require(['@/page/office/expensePayment/ExpensePaymentList'],resolve);//
let ExpensePaymentDetail = (resolve) => require(['@/page/office/expensePayment/ExpensePaymentDetail'],resolve);//
let BorrowPaymentList = (resolve) => require(['@/page/office/borrowPayment/BorrowPaymentList'],resolve);//
let BorrowPaymentDetail = (resolve) => require(['@/page/office/borrowPayment/BorrowPaymentDetail'],resolve);//
let ExamineTemplateList = (resolve) => require(['@/page/office/examineTemplate/ExamineTemplateList'],resolve);//
let ExamineTemplateDetail = (resolve) => require(['@/page/office/examineTemplate/ExamineTemplateDetail'],resolve);//
let StaffInfoList = (resolve) => require(['@/page/office/staffInfo/StaffInfoList'],resolve);//
let StaffInfoDetail = (resolve) => require(['@/page/office/staffInfo/StaffInfoDetail'],resolve);//
let NoteAttendanceList = (resolve) => require(['@/page/office/noteAttendance/NoteAttendanceList'],resolve);//
let ChildInfoList = (resolve) => require(['@/page/office/childInfo/ChildInfoList'],resolve);//
let ChildInfoDetail = (resolve) => require(['@/page/office/childInfo/ChildInfoDetail'],resolve);//
let PaymentSubjectList = (resolve) => require(['@/page/office/childInfo/PaymentSubjectList'],resolve);//
let EditFamilyMember = (resolve) => require(['@/page/office/childInfo/EditFamilyMember'],resolve);//
let FamilyMemberInfo = (resolve) => require(['@/page/office/childInfo/FamilyMemberInfo'],resolve);//
let AddNewChildList = (resolve) => require(['@/page/office/addNewChild/AddNewChildList'],resolve);//
let NewChildPayment = (resolve) => require(['@/page/office/addNewChild/NewChildPayment'],resolve);//
let AssignChildList = (resolve) => require(['@/page/office/assignChild/AssignChildList'],resolve);//
let ClassManagementList = (resolve) => require(['@/page/office/classManagement/ClassManagementList'],resolve);//
let ClassManagementDetail = (resolve) => require(['@/page/office/classManagement/ClassManagementDetail'],resolve);//
let BeeBindList = (resolve) => require(['@/page/office/beeBind/BeeBindList'],resolve);//
let ClassEvaluationList = (resolve) => require(['@/page/office/classEvaluation/ClassEvaluationList'],resolve);//
let ClassEvaluationMonth = (resolve) => require(['@/page/office/classEvaluation/ClassEvaluationMonth'],resolve);//
let ClassEvaluationChild = (resolve) => require(['@/page/office/classEvaluation/ClassEvaluationChild'],resolve);//
let TeacherEvaluationList = (resolve) => require(['@/page/office/teacherEvaluation/TeacherEvaluationList'],resolve);//
let TeacherEvaluationDay = (resolve) => require(['@/page/office/teacherEvaluation/TeacherEvaluationDay'],resolve);//
let TeacherEvaluationMonth = (resolve) => require(['@/page/office/teacherEvaluation/TeacherEvaluationMonth'],resolve);//
let TeacherEvaluationNotice = (resolve) => require(['@/page/office/teacherEvaluation/TeacherEvaluationNotice'],resolve);//
// 物品申领
let ReceiveApplyDetail = (resolve) => require(['@/page/office/ReceiveApply/ReceiveApplyDetail'],resolve);//
let ApplyExamineDetail = (resolve) => require(['@/page/office/applyExamine/ApplyExamineDetail'],resolve);//
let ApplyOutstorageDetail = (resolve) => require(['@/page/office/applyOutstorage/ApplyOutstorageDetail'],resolve);//
let ApplyInstorageDetail = (resolve) => require(['@/page/office/applyInstorage/ApplyInstorageDetail'],resolve);//
let ApplyFindList = (resolve) => require(['@/page/office/applyFind/ApplyFindList'],resolve);//
let ApplyFindDetail = (resolve) => require(['@/page/office/applyFind/ApplyFindDetail'],resolve);//
// 物品采购
let PurchaseApplyList = (resolve) => require(['@/page/office/purchaseApply/PurchaseApplyList'],resolve);// 采购申请
let PurchaseApplyDetail = (resolve) => require(['@/page/office/purchaseApply/PurchaseApplyDetail'],resolve);//
let PurchaseSignList = (resolve) => require(['@/page/office/purchaseSign/PurchaseSignList'],resolve);// 采购审批
let PurchaseSignDetail = (resolve) => require(['@/page/office/purchaseSign/PurchaseSignDetail'],resolve);//
let PurchaseEnteringList = (resolve) => require(['@/page/office/purchaseEntering/PurchaseEnteringList'],resolve);// 采购录入
let PurchaseEnteringDetail = (resolve) => require(['@/page/office/purchaseEntering/PurchaseEnteringDetail'],resolve);//
let PurchaseInstorageList = (resolve) => require(['@/page/office/purchaseInstorage/PurchaseInstorageList'],resolve);//采购入库
let EditPurchaseInstorage = (resolve) => require(['@/page/office/purchaseInstorage/EditPurchaseInstorage'],resolve);//
let EditPurchaseInstorageDetail = (resolve) => require(['@/page/office/purchaseInstorage/EditPurchaseInstorageDetail'],resolve);//
let PurchaseFindList = (resolve) => require(['@/page/office/purchaseFind/PurchaseFindList'],resolve);//
// 兴趣班
let InterestClassTeacherList = (resolve) => require(['@/page/office/interestClassTeacher/InterestClassTeacherList'],resolve);//
let CalendarView = (resolve) => require(['@/page/office/calendarView/CalendarView'],resolve);//
let SetTuitionSubjectList = (resolve) => require(['@/page/office/setTuitionSubject/SetTuitionSubjectList'],resolve);//
let SetTuitionSubjectDetail = (resolve) => require(['@/page/office/setTuitionSubject/SetTuitionSubjectDetail'],resolve);//
let InterestClassTeacherDetail = (resolve) => require(['@/page/office/interestClassTeacher/InterestClassTeacherDetail'],resolve);//
let InterestClassManageList = (resolve) => require(['@/page/office/interestClassManage/InterestClassManageList'],resolve);//
let InterestClassManageDetail = (resolve) => require(['@/page/office/interestClassManage/InterestClassManageDetail'],resolve);//
let EditSchedule = (resolve) => require(['@/page/office/interestClassManage/EditSchedule'],resolve);//
let InterestClassChildList = (resolve) => require(['@/page/office/interestClassChild/InterestClassChildList'],resolve);//
let InterestClassChildDetail = (resolve) => require(['@/page/office/interestClassChild/InterestClassChildDetail'],resolve);//
let InterestClassAttendanceList = (resolve) => require(['@/page/office/interestClassAttendance/InterestClassAttendanceList'],resolve);//
let InterestClassAttendanceDetail = (resolve) => require(['@/page/office/interestClassAttendance/InterestClassAttendanceDetail'],resolve);//
let TeacherAttendanceList = (resolve) => require(['@/page/office/interestClassAttendance/TeacherAttendanceList'],resolve);//
let StudentAttendanceList = (resolve) => require(['@/page/office/interestClassAttendance/StudentAttendanceList'],resolve);//
let InterestClassExpenseList = (resolve) => require(['@/page/office/interestClassExpense/InterestClassExpenseList'],resolve);//
let ExamineExpenseList = (resolve) => require(['@/page/office/interestClassExpense/ExamineExpenseList'],resolve);//
let ExamineExpenseDetail = (resolve) => require(['@/page/office/interestClassExpense/ExamineExpenseDetail'],resolve);//
let IssueExpenseList = (resolve) => require(['@/page/office/interestClassExpense/IssueExpenseList'],resolve);//
let InterestClassOperationList = (resolve) => require(['@/page/office/interestClassOperation/InterestClassOperationList'],resolve);//
let InterestClassTexpendList = (resolve) => require(['@/page/office/interestClassTexpend/InterestClassTexpendList'],resolve);//
let InterestClassTexpendDetail = (resolve) => require(['@/page/office/interestClassTexpend/InterestClassTexpendDetail'],resolve);//
let SetScheduleList = (resolve) => require(['@/page/office/setSchedule/SetScheduleList'],resolve);//
let SetScheduleDetail = (resolve) => require(['@/page/office/setSchedule/SetScheduleDetail'],resolve);//
let CoursePlanManageList = (resolve) => require(['@/page/office/coursePlanManage/CoursePlanManageList'],resolve);//
let CoursePlanManageDetail = (resolve) => require(['@/page/office/coursePlanManage/CoursePlanManageDetail'],resolve);//
let CoursePlanExamineList = (resolve) => require(['@/page/office/coursePlanExamine/CoursePlanExamineList'],resolve);//
let PerfectManageList = (resolve) => require(['@/page/office/coursePlanPerfectManage/PerfectManageList'],resolve);//
let PerfectManageDetail = (resolve) => require(['@/page/office/coursePlanPerfectManage/PerfectManageDetail'],resolve);//
let examineApproveList = (resolve) => require(['@/page/office/examineApprove/examineApproveList'],resolve);//
let expenseApplyDetail = (resolve) => require(['@/page/office/examineApproveTab/expenseApplyDetail'],resolve);//
let borrowApplyDetail = (resolve) => require(['@/page/office/examineApproveTab/borrowApplyDetail'],resolve);//
let ExpenseFindList = (resolve) => require(['@/page/office/expenseFind/ExpenseFindList'],resolve);//
let RoleSettingList = (resolve) => require(['@/page/office/roleSetting/RoleSettingList'],resolve);//
let RoleSettingDetail = (resolve) => require(['@/page/office/roleSetting/RoleSettingDetail'],resolve);//
let BorrowFindList = (resolve) => require(['@/page/office/borrowFind/BorrowFindList'],resolve);//
let commonApplyDetail = (resolve) => require(['@/page/office/examineApproveTab/commonApplyDetail'],resolve);//
let gooutApplyDetail = (resolve) => require(['@/page/office/examineApproveTab/gooutApplyDetail'],resolve);//
let businessTripApplyDetail = (resolve) => require(['@/page/office/examineApproveTab/businessTripApplyDetail'],resolve);//
let holidayApplyDetail = (resolve) => require(['@/page/office/examineApproveTab/holidayApplyDetail'],resolve);//
let extraWorkApplyDetail = (resolve) => require(['@/page/office/examineApproveTab/extraWorkApplyDetail'],resolve);//
let orderformApplyDetail = (resolve) => require(['@/page/office/examineApproveTab/orderformApplyDetail'],resolve);//
let illegalApplyDetail = (resolve) => require(['@/page/office/examineApproveTab/illegalApplyDetail'],resolve);//
let commonApproveDetail = (resolve) => require(['@/page/office/otherApprove/commonApproveDetail'],resolve);//
let outsideApproveDetail = (resolve) => require(['@/page/office/otherApprove/outsideApproveDetail'],resolve);//
let businessApproveDetail = (resolve) => require(['@/page/office/otherApprove/businessApproveDetail'],resolve);//
let holidayApproveDetail = (resolve) => require(['@/page/office/otherApprove/holidayApproveDetail'],resolve);//
let extraWorkApproveDetail = (resolve) => require(['@/page/office/otherApprove/extraWorkApproveDetail'],resolve);//
let illegalApproveDetail = (resolve) => require(['@/page/office/otherApprove/illegalApproveDetail'],resolve);//
let orderformApproveDetail = (resolve) => require(['@/page/office/otherApprove/orderformApproveDetail'],resolve);//
let OrderformFindList = (resolve) => require(['@/page/office/orderformFind/OrderformFindList'],resolve);//
let OrderformFindDetail = (resolve) => require(['@/page/office/orderformFind/OrderformFindDetail'],resolve);//
let MyDatabaseList = (resolve) => require(['@/page/office/myDatabase/MyDatabaseList'],resolve);//
let MyDatabaseManager = (resolve) => require(['@/page/office/myDatabase/MyDatabaseManager'],resolve);//
let MyDatabaseBrowse = (resolve) => require(['@/page/office/myDatabase/MyDatabaseBrowse'],resolve);//
let MyDatabaseMaintenance = (resolve) => require(['@/page/office/myDatabase/MyDatabaseMaintenance'],resolve);//
let MyDatabaseArticleDetail = (resolve) => require(['@/page/office/myDatabase/MyDatabaseArticleDetail'],resolve);//
let InternalEmailList = (resolve) => require(['@/page/office/internalEmail/InternalEmailList'],resolve);//
let InternalEmailDetail = (resolve) => require(['@/page/office/internalEmail/InternalEmailDetail'],resolve);//
let ExamineEmailDetail = (resolve) => require(['@/page/office/internalEmail/ExamineEmailDetail'],resolve);//
let GoodsApplyTabList = (resolve) => require(['@/page/office/goodsApply/GoodsApplyTabList'],resolve);//
let GoodsPurchaseTabList = (resolve) => require(['@/page/office/goodsPurchase/GoodsPurchaseTabList'],resolve);//
let BorrowRepaymentList = (resolve) => require(['@/page/office/borrowRepayment/BorrowRepaymentList'],resolve);//
let ExpenseCertificateList = (resolve) => require(['@/page/office/expenseCertificate/ExpenseCertificateList'],resolve);//
let BorrowCertificateList = (resolve) => require(['@/page/office/borrowCertificate/BorrowCertificateList'],resolve);//
let DueExpenseList = (resolve) => require(['@/page/office/dueExpense/DueExpenseList'],resolve);//
let DueExpenseIdList = (resolve) => require(['@/page/office/dueExpense/DueExpenseIdList'],resolve);//
let DueExpenseIdDetail = (resolve) => require(['@/page/office/dueExpense/DueExpenseIdDetail'],resolve);//
let SchoolInformList = (resolve) => require(['@/page/office/schoolInform/SchoolInformList'],resolve);//
let SchoolInformDetail = (resolve) => require(['@/page/office/schoolInform/SchoolInformDetail'],resolve);//
let ParentschoolContactList = (resolve) => require(['@/page/office/parentschoolContact/ParentschoolContactList'],resolve);//
let ParentschoolContactDetail = (resolve) => require(['@/page/office/parentschoolContact/ParentschoolContactDetail'],resolve);//
let SchoolPhotoesList = (resolve) => require(['@/page/office/schoolInform/SchoolPhotoesList'],resolve);//
let SchoolPhotoesDetail = (resolve) => require(['@/page/office/schoolInform/SchoolPhotoesDetail'],resolve);//
let ParentschoolPhotoesList = (resolve) => require(['@/page/office/parentschoolContact/ParentschoolPhotoesList'],resolve);//
let ParentschoolPhotoesDetail = (resolve) => require(['@/page/office/parentschoolContact/ParentschoolPhotoesDetail'],resolve);//
let ChildPhotoesList = (resolve) => require(['@/page/office/childPhotoes/ChildPhotoesList'],resolve);//
let ChildPhotoesDetail = (resolve) => require(['@/page/office/childPhotoes/ChildPhotoesDetail'],resolve);//
let teacherWordList = (resolve) => require(['@/page/office/teacherWord/teacherWordList'],resolve);//
let teacherWordDetail = (resolve) => require(['@/page/office/teacherWord/teacherWordDetail'],resolve);//
let ChargeExpendList = (resolve) => require(['@/page/group/chargeExpend/ChargeExpendList'],resolve);//
let ChargeExpendDetail = (resolve) => require(['@/page/group/chargeExpend/ChargeExpendDetail'],resolve);//
let StaffDataList = (resolve) => require(['@/page/group/staffData/StaffDataList'],resolve);//
let StudentDataList = (resolve) => require(['@/page/group/studentData/StudentDataList'],resolve);//
let GroupStudentAttendanceList = (resolve) => require(['@/page/group/studentAttendance/StudentAttendanceList'],resolve);//
let TuitionIncomeList = (resolve) => require(['@/page/group/tuitionIncome/TuitionIncomeList'],resolve);//
let DuePaymentList = (resolve) => require(['@/page/office/duePayment/DuePaymentList'],resolve);//
let DuePaymentDetail = (resolve) => require(['@/page/office/duePayment/DuePaymentDetail'],resolve);//
let DueCertificateList = (resolve) => require(['@/page/office/dueCertificate/DueCertificateList'],resolve);//
let DueFindList = (resolve) => require(['@/page/office/dueFind/DueFindList'],resolve);//
let BankAccountList = (resolve) => require(['@/page/office/bankAccount/BankAccountList'],resolve);//
let BankAccountDetail = (resolve) => require(['@/page/office/bankAccount/BankAccountDetail'],resolve);//
let YearHolidayList = (resolve) => require(['@/page/office/yearHoliday/YearHolidayList'],resolve);//
let ExpenseAccountDetail = (resolve) => require(['@/page/office/expenseAccount/ExpenseAccountDetail'],resolve);//
let BorrowAccountDetail = (resolve) => require(['@/page/office/borrowAccount/BorrowAccountDetail'],resolve);//
let DueAccExpenseList = (resolve) => require(['@/page/office/dueAccount/DueAccExpenseList'],resolve);//
let DueAccExpenseIdList = (resolve) => require(['@/page/office/dueAccount/DueAccExpenseIdList'],resolve);//
let DueAccExpenseIdDetail = (resolve) => require(['@/page/office/dueAccount/DueAccExpenseIdDetail'],resolve);//

//积分管理
let PointsManageList = (resolve) => require(['@/page/office/pointsManage/PointsManageList'],resolve);//
let PointsClassifyList = (resolve) => require(['@/page/office/pointsManage/PointsClassifyList'],resolve);//
let PointsClassifyDetail = (resolve) => require(['@/page/office/pointsManage/PointsClassifyDetail'],resolve);//
let PointsSubjectList = (resolve) => require(['@/page/office/pointsManage/PointsSubjectList'],resolve);//
let PointsSubjectDetail = (resolve) => require(['@/page/office/pointsManage/PointsSubjectDetail'],resolve);//
//考勤管理
let AttendanceManageList = (resolve) => require(['@/page/office/attendanceManage/AttendanceManageList'],resolve);//
let IllegalManageList = (resolve) => require(['@/page/office/attendanceManage/IllegalManageList'],resolve);//
//智能设备
let IntelligentDeviceList = (resolve) => require(['@/page/office/intelligentDevice/IntelligentDeviceList'],resolve);//
//积分评分
let PointsScoreList = (resolve) => require(['@/page/office/pointsScore/PointsScoreList'],resolve);//
let PointsScoreDetail = (resolve) => require(['@/page/office/pointsScore/PointsScoreDetail'],resolve);//
//考核管理
let ExamineManageList = (resolve) => require(['@/page/office/examineManage/ExamineManageList'],resolve);//
let CommonExamineList = (resolve) => require(['@/page/office/examineManage/CommonExamineList'],resolve);//
let CommonExamineDetail = (resolve) => require(['@/page/office/examineManage/CommonExamineDetail'],resolve);//
let MonthlyExamineList = (resolve) => require(['@/page/office/examineManage/MonthlyExamineList'],resolve);//
let MonthlyExamineDetail = (resolve) => require(['@/page/office/examineManage/MonthlyExamineDetail'],resolve);//
//考核评分
let ExamineScoreList = (resolve) => require(['@/page/office/examineScore/ExamineScoreList'],resolve);//
let CommonScoreDetail = (resolve) => require(['@/page/office/examineScore/CommonScoreDetail'],resolve);//
let MonthlyScoreDetail = (resolve) => require(['@/page/office/examineScore/MonthlyScoreDetail'],resolve);//
//赏罚管理
let DesertEntryList = (resolve) => require(['@/page/office/desertEntry/DesertEntryList'],resolve);//
let RewardSubjectList = (resolve) => require(['@/page/office/desertEntry/RewardSubjectList'],resolve);//
//交办任务
let CommandTaskList = (resolve) => require(['@/page/office/commandTask/CommandTaskList'],resolve);//
let CommandTaskDetail = (resolve) => require(['@/page/office/commandTask/CommandTaskDetail'],resolve);//
//培训管理
let TrainingManageList = (resolve) => require(['@/page/office/trainingManage/TrainingManageList'],resolve);//




Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      name: 'Index',
      component: IndexLogin
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
          meta: { pageType: "office",keepAlive:true },
          component: ChildInfoList
        },
        {
          name:"ChildInfoUpdate",
          path: "office/:id/childInfo/update/:childID",
          meta: { pageType: "office", type: "update" },
          component: ChildInfoDetail
        },
        {
          name:"PaymentSubjectList",
          path: "office/:id/childInfo/paymentSubject",
          meta: { pageType: "office" },
          component: PaymentSubjectList
        },
        {
          name:"EditFamilyMember",
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
          component: ExpenseFindList,
          children:[
            {
              path:":expenseID",
              meta: { pageType: "office" ,type:"find"},
              component: ExpensePaymentDetail
            },
          ]
        },
        //借款查询
        {
          path:"office/:id/borrowFind",
          meta: { pageType: "office" },
          component: BorrowFindList,
          children:[
            {
              path:":borrowID",
              meta: { pageType: "office" ,type:"find"},
              component: BorrowPaymentDetail
            },
          ]
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
          component: SchoolInformList,
          children:[
            {
              path:"examine/:noticeID",
              meta: { pageType: "office" ,type:"examine"},
              component: SchoolInformDetail
            },
            {
              path:"add",
              meta: { pageType: "office" ,type:"add"},
              component: SchoolInformDetail
            },
          ]
        },
        //家校联络
        {
          path:"office/:id/parentschoolContact",
          meta: { pageType: "office" },
          component: ParentschoolContactList,
          children:[
            {
              path:"examine/:noticeID",
              meta: { pageType: "office" ,type:"examine"},
              component: ParentschoolContactDetail
            },
            {
              path:"add",
              meta: { pageType: "office" ,type:"add"},
              component: ParentschoolContactDetail
            },
          ]
        },
        //园所相册
        {
          path:"office/:id/schoolPhotoes",
          meta: { pageType: "office" },
          component: SchoolPhotoesList,
          children:[
            {
              path:"examine/:noticeID",
              meta: { pageType: "office" ,type:"examine"},
              component: SchoolPhotoesDetail
            },
            {
              path:"add",
              meta: { pageType: "office" ,type:"add"},
              component: SchoolPhotoesDetail
            },
          ]
        },
        //班级相册
        {
          path:"office/:id/parentschoolPhotoes",
          meta: { pageType: "office" },
          component: ParentschoolPhotoesList,
          children:[
            {
              path:"examine/:noticeID",
              meta: { pageType: "office" ,type:"examine"},
              component: ParentschoolPhotoesDetail
            },
            {
              path:"add",
              meta: { pageType: "office" ,type:"add"},
              component: ParentschoolPhotoesDetail
            },
          ]
        },
        //个人相册
        {
          path:"office/:id/childPhotoes",
          meta: { pageType: "office" },
          component: ChildPhotoesList,
          children:[
            {
              path:"examine/:photoesID",
              meta: { pageType: "office" ,type:"examine"},
              component: ChildPhotoesDetail
            },
            {
              path:"add",
              meta: { pageType: "office" ,type:"add"},
              component: ChildPhotoesDetail
            },
          ]
        },
        //老师的话
        {
          path:"office/:id/teacherWord",
          meta: { pageType: "office" },
          component: teacherWordList,
          children:[
            {
              path:"examine/:wordID",
              meta: { pageType: "office" ,type:"examine"},
              component: teacherWordDetail
            },
            {
              path:"add",
              meta: { pageType: "office" ,type:"add"},
              component: teacherWordDetail
            },
          ]
        },
        //年假管理
        {
          path:"office/:id/yearHoliday",
          meta: { pageType: "office" },
          component: YearHolidayList
        },
        //报销记账
        {
          path:"office/:id/expenseAccount",
          meta: { pageType: "office" ,type:"add"},
          component: ExpenseAccountDetail
        },
        //借款记账
        {
          path:"office/:id/borrowAccount",
          meta: { pageType: "office" ,type:"add"},
          component: BorrowAccountDetail
        },
        //应付款记账
        {
          path:"office/:id/dueAccount",
          meta: { pageType: "office" },
          component: DueAccExpenseList
        },
        {
          path:"office/:id/dueAccount/:expenseID",
          meta: { pageType: "office" },
          component: DueAccExpenseIdList
        },
        {
          path: "office/:id/dueAccount/:expenseID/detail",// 报销详情
          meta: { pageType: "office" },
          component: ExpensePaymentDetail
        },
        {
          path:"office/:id/dueAccount/:expenseID/dueDetail/:staffID/:dueID/:isAccount",
          meta: { pageType: "office" },
          component: DuePaymentDetail
        },
        {
          path: "office/:id/dueAccount/:expenseID/add",// 添加审批
          meta: { pageType: "office", type:"add" },
          component: DueAccExpenseIdDetail
        },
        //积分管理
        {
          path:"office/:id/pointsManage",
          meta: { pageType: "office" },
          component: PointsManageList
        },
        {
          path:"office/:id/pointsManage/pointsClassify",
          meta: { pageType: "office" },
          component: PointsClassifyList
        },
        {
          path:"office/:id/pointsManage/pointsClassify/add",
          meta: { pageType: "office" ,type:"add"},
          component: PointsClassifyDetail
        },
        {
          path:"office/:id/pointsManage/pointsClassify/update/:classifyID",
          meta: { pageType: "office" ,type:"update"},
          component: PointsClassifyDetail
        },
        {
          path:"office/:id/pointsManage/pointsSubject",
          meta: { pageType: "office" },
          component: PointsSubjectList,
          children:[
            {
              path:"update",
              meta: { pageType: "office" ,type:"update"},
              component: PointsSubjectDetail
            },
            {
              path:"add",
              meta: { pageType: "office" ,type:"add"},
              component: PointsSubjectDetail
            },
          ]
        },
        //考勤管理
        {
          path:"office/:id/attendanceManage",
          meta: { pageType: "office" },
          component: AttendanceManageList,
          children:[
            {
              path:"illegalManage",
              meta: { pageType: "office"},
              component: IllegalManageList
            },
          ]
        },
        //智能设备
        {
          path:"office/:id/intelligentDevice",
          meta: { pageType: "office" },
          component: IntelligentDeviceList
        },
        //积分评分
        {
          path:"office/:id/pointsScore",
          meta: { pageType: "office" },
          component: PointsScoreList,
          children:[
            {
              path:"add",
              meta: { pageType: "office" ,type:"add"},
              component: PointsScoreDetail
            }
          ]
        },
        //考核管理
        {
          path:"office/:id/examineManage",
          meta: { pageType: "office" },
          component: ExamineManageList,
          children:[
            {
              path:"showCommonDetail",
              meta: { pageType: "office" ,type:"show"},
              component: CommonScoreDetail
            },
            {
              path:"showMonthDetail",
              meta: { pageType: "office" ,type:"show"},
              component: MonthlyScoreDetail
            }
          ]
        },
        {
          path:"office/:id/examineManage/commonExamine",
          meta: { pageType: "office" },
          component: CommonExamineList,
          children:[
            {
              path:"add",
              meta: { pageType: "office" ,type:"add"},
              component: CommonExamineDetail
            },
            {
              path:"update",
              meta: { pageType: "office" ,type:"update"},
              component: CommonExamineDetail
            }
          ]
        },
        {
          path:"office/:id/examineManage/monthlyExamine",
          meta: { pageType: "office" },
          component: MonthlyExamineList,
          children:[
            {
              path:"update",
              meta: { pageType: "office" ,type:"update"},
              component: MonthlyExamineDetail
            }
          ]
        },
        //考核评分
        {
          path:"office/:id/examineScore",
          meta: { pageType: "office" },
          component: ExamineScoreList,
          children:[
            {
              path:"commonScore",
              meta: { pageType: "office" ,type:"update"},
              component: CommonScoreDetail
            },
            {
              path:"monthlyScore",
              meta: { pageType: "office" ,type:"update"},
              component: MonthlyScoreDetail
            },
            {
              path:"showCommonDetail",
              meta: { pageType: "office" ,type:"show"},
              component: CommonScoreDetail
            },
            {
              path:"showMonthDetail",
              meta: { pageType: "office" ,type:"show"},
              component: MonthlyScoreDetail
            },
          ]
        },
        //赏罚管理
        {
          path:"office/:id/desertEntry",
          meta: { pageType: "office" },
          component: DesertEntryList
        },
        {
          path:"office/:id/desertEntry/rewardSubject",
          meta: { pageType: "office" },
          component: RewardSubjectList
        },
        //交办任务
        {
          path:"office/:id/commandTask",
          meta: { pageType: "office" },
          component: CommandTaskList,
          children:[
            {
              path:"examine",
              meta: { pageType: "office" },
              component: CommandTaskDetail
            },
          ]
        },
        //培训管理
        {
          path:"office/:id/trainingManage",
          meta: { pageType: "office" },
          component: TrainingManageList
        },
        

        //集团
        {
          path: "group",
          meta: { pageType: "group" }
        },
        //费用支出
        {
          path: "group/:cosNum/:isGroup/chargeExpend",
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
          path: "group/:cosNum/:isGroup/staffData",
          meta: { pageType: "group" },
          component: StaffDataList,
        },
        //学员数据
        {
          path: "group/:cosNum/:isGroup/studentData",
          meta: { pageType: "group" },
          component: StudentDataList,
        },
        //学员出勤
        {
          path: "group/:cosNum/:isGroup/studentAttendance",
          meta: { pageType: "group" },
          component: GroupStudentAttendanceList,
        },
        //学费收入
        {
          path: "group/:cosNum/0/tuitionIncome",
          meta: { pageType: "group" },
          component: TuitionIncomeList,
        },
        {
          path: "group/:cosNum/1/tuitionIncome",
          meta: { pageType: "group" },
          component: TuitionIncomeList,
        },
      ]
    }
  ]
})