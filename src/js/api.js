import axios from '@/config/axios'

/**
 * CosApp接口
 */

// 登录
export const login = (currProxy,cosNum,userName,passWord) => {
    return axios({
        currProxy,
        cosNum,
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'login'
        },
        data:{
            userName,
            passWord
        }
    })
}

// 登录IP地址
export const checkIP = (currProxy,cosNum) => {
    return axios({
        currProxy,
        cosNum,
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findAllStaffs'
        }
    })
}

// 获取cosType
export const getCosType = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCosType'
        }
    });
}

// 获取所有员工
export const findAllStaffs = (content) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findAllStaffs',
            content
        }
    });
}

// 获取所有离职员工
export const findAllRetiredStaffs = (content) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findAllRetiredStaffs',
            content
        }
    });
}

// 获取某人的所有群组
export const getGroupsByStaffID = (staffID,cosNum) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getGroupsByStaffID',
            staffID,
            cosNum
        }
    });
}

// 根据staffID获取员工信息
export const findStaffsByStaffIDs = (staffIDs) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findStaffsByStaffIDs',
            staffIDs
        }
    });
}

// 根据childID获取孩子信息
export const findChildrenByChildIDs = (childIDs) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findChildrenByChildIDs',
            childIDs
        }
    });
}

// 根据ID获取群组信息
export const getGroupsByID = (ids,cosNum) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getGroupsByID',
            ids,
            cosNum
        }
    });
}

// 融云发送图片或文件消息
export const uploadImg = (file,cancelToken,callback) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addChatPhoto'
        },
        cancelToken,
        onUploadProgress:(progressEvent) => {
            // 对原生进度事件的处理
            callback(progressEvent);
        },
        uploadFile:{
            file:file
        }
    });
}

// 创建群组
export const createGroup = (id,groupName,staffID,groupUserIDs,cosNum,file) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'createGroup'
        },
        data:{
            id,
            groupName,
            staffID,
            groupUserIDs,
            cosNum
        },
        uploadFile:{
            file:file
        }
    });
}

// 根据文件夹ID获取内容
export const geFileByTreeID = (pageNo,pageSize,staffID,treeID,fileName,connectStaffID,connectType) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'geFileByTreeID',
            pageNo,
            pageSize,
            staffID,
            treeID,
            orderBy:"CreateDate",
            fileName,
            connectStaffID,
            connectType
        }
    });
}

// 根据文件夹ID获取目录
export const getAllParentDocument = (treeID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllParentDocument',
            treeID
        }
    });
}

// 蜂盘上传文件
export const addMyDocumentFile = (staffID,documentTreeID,fileName,fileSize,file,callback) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addMyDocumentFile'
        },
        data:{
            staffID,
            documentTreeID,
            fileName,
            fileSize
        },
        onUploadProgress:(progressEvent) => {
            // 对原生进度事件的处理
            callback(progressEvent);
        },
        uploadFile:{
            file:file
        }
    });
}

// 蜂盘新建文件夹
export const addMyDocument = (staffID,parentID,documentName) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addMyDocument'
        },
        data:{
            staffID,
            parentID,
            documentName
        }
    });
}

// 删除文件和文件夹
export const delDocumentOrFile = (staffID,treeIDs,fileIDs) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'delDocumentOrFile'
        },
        data:{
            staffID,
            treeIDs,
            fileIDs
        }
    });
}

// 下载文件
export const downloadFile = (url) => {
    // return axios({
    //     urlTo:"CosApp",
    //     method:"post",
    //     params: {
    //         method: 'delDocumentOrFile'
    //     },
    //     data:{
    //         staffID,
    //         treeIDs,
    //         fileIDs
    //     }
    // });
    // const form = this.getSearchForm() // 要发送到后台的数据
    return axios({ // 用axios发送post请求
        method: 'get',
        url: url, // 请求地址
        // data: form, // 参数
        responseType: 'arraybuffer' // 表明返回服务器返回的数据类型
    })
    
}

// 根据权限获取全部菜单列表
export const getMenusByStaffID = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getMenusByStaffID',
            staffID,
            isNew:"1"
        }
    });
}

// 报销查询列表
export const getChargeBill = (pageNo,pageSize,staffID,startID,endID,fillDateFrom,fillDateTo,chargeDateFrom,chargeDateTo,payDateFrom,payDateTo ,hasInvoice,payType,departmentID,fillStaffID,status,bankAccountID,outBillType,outBillID,includeProject,defer) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChargeBill',
            pageNo,
            pageSize,
            staffID,
            startID,
            endID,
            fillDateFrom,
            fillDateTo,
            chargeDateFrom,
            chargeDateTo,
            payDateFrom,
            payDateTo ,
            hasInvoice,
            payType,
            departmentID,
            fillStaffID,
            status,
            bankAccountID,
            outBillType,
            outBillID,
            includeProject,
            defer
        }
    });
}

// 根据ID获取报销详情
export const getChargeBillByID = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChargeBillByID',
            id
        }
    });
}

// 获取所有银行账户
export const getBankAccount = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getBankAccount'
        }
    });
}

// 报销支付
export const payChargeBill = (chargeBillID,payDate,isSetFillDate,isSetDelayPay,bankAccountID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'payChargeBill'
        },
        data:{
            chargeBillID,
            payDate,
            isSetFillDate,
            isSetDelayPay,
            bankAccountID
        }
    });
}

// 借款查询列表
export const getBookCharge = (pageNo,pageSize,staffID,startID,endID,fillDateFrom,fillDateTo,chargeDateFrom,chargeDateTo,payDateFrom,payDateTo,returnDateFrom,returnDateTo,hasInvoice,payType,departmentID,fillStaffID,status,bankAccountID,outBillType,outBillID,includeProject) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getBookCharge',
            pageNo,
            pageSize,
            staffID,
            startID,
            endID,
            fillDateFrom,
            fillDateTo,
            chargeDateFrom,
            chargeDateTo,
            payDateFrom,
            payDateTo ,
            returnDateFrom,
            returnDateTo ,
            hasInvoice,
            payType,
            departmentID,
            fillStaffID,
            status,
            bankAccountID,
            outBillType,
            outBillID,
            includeProject
        }
    });
}

// 根据ID获取借款详情
export const getBookChargeByID = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getBookChargeByID',
            id
        }
    });
}

// 借款支付
export const payBookCharge = (bookChargeID,payDate,bankAccountID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'payChargeBill'
        },
        data:{
            bookChargeID,
            payDate,
            bankAccountID
        }
    });
}

// 获取考核模板
export const getTemplate = (pageNo,pageSize,pointType,isValid) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getTemplate',
            pageNo,
            pageSize,
            pointType,
            isValid
        }
    });
}

// 根据ID获取考核详情
export const getTemplateByID = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getTemplateByID',
            id
        }
    });
}

// 设为有效/失效模板
export const setTemplateInvalid = (id,isValid) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'setTemplateInvalid'
        },
        data:{
            id,
            isValid
        }
    });
}

// 添加绩效考核模板
export const editTemplate = (id,editType,templateName,description,pointType,type,detailString) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'editTemplate'
        },
        data:{
            id,
            editType,
            templateName,
            description,
            pointType,
            type,
            detailString
        }
    });
}

// 是否显示员工菜单
export const couldSeeStaffMessage = (staffID1,staffID2) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'couldSeeStaffMessage',
            staffID1,
            staffID2
        }
    });
}

// 删除员工
export const delStaff = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'delStaff'
        },
        data:{
            staffID
        }
    });
}

// 获取所有角色
export const getAllRoles = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllRoles',
        }
    });
}

// 添加或修改员工
export const addOrUpdateStaffDetail = ({
        staffID,
        staffName,
        staffNum,
        sex,
        identityNumber,
        cardID,
        departmentID,
        roleID,
        beStaff,
        notBeStaff,
        turnDate,
        mobile,
        birthday,
        nation,
        identityValidity,
        isSalaryNotIncluded,
        salaryBank,
        salaryCardNum,
        resumeNum,
        address,
        distance,
        tel,
        telephoneExtension,
        mailBox,
        personEmail,
        QQ,
        wechat,
        otherNo,
        urgencyTelNo,
        political,
        isMarry,
        hometown,
        homeNature,
        fileTurnInDate,
        filePersonName,
        insuranceTurnInDate,
        turnInPlace,
        bodyHight,
        bodyWeight,
        sight,
        bloodType,
        isHealth,
        degree,
        graduateSchool,
        jobName,
        jobInTime,
        note,
        spouse,
        spouseWorkSpace,
        spouseWorkAddress,
        spouseTel,
        childName1,
        sexManChild1,
        childBirthday1,
        childGrade1,
        childSchool1,
        childName2,
        sexManChild2,
        childBirthday2,
        childGrade2,
        childSchool2,
        childName3,
        sexManChild3,
        childBirthday3,
        childGrade3,
        childSchool3,
        thesisList,
        languagesList,
        financeSignManager1,
        financeSignManager2,
        financeSignManager3,
        timeScheduleManager,
        dailyManager,
        isSaveSup,
        file,
        callback
    }) => {
    let json = {
        staffID,
        staffName,
        staffNum,
        sex,
        identityNumber,
        cardID,
        departmentID,
        roleID,
        beStaff,
        notBeStaff,
        turnDate,
        mobile,
        birthday,
        nation,
        identityValidity,
        isSalaryNotIncluded,
        salaryBank,
        salaryCardNum,
        resumeNum,
        address,
        distance,
        tel,
        telephoneExtension,
        mailBox,
        personEmail,
        QQ,
        wechat,
        otherNo,
        urgencyTelNo,
        political,
        isMarry,
        hometown,
        homeNature,
        fileTurnInDate,
        filePersonName,
        insuranceTurnInDate,
        turnInPlace,
        bodyHight,
        bodyWeight,
        sight,
        bloodType,
        isHealth,
        degree,
        graduateSchool,
        jobName,
        jobInTime,
        note,
        spouse,
        spouseWorkSpace,
        spouseWorkAddress,
        spouseTel,
        childName1,
        sexManChild1,
        childBirthday1,
        childGrade1,
        childSchool1,
        childName2,
        sexManChild2,
        childBirthday2,
        childGrade2,
        childSchool2,
        childName3,
        sexManChild3,
        childBirthday3,
        childGrade3,
        childSchool3,
        thesisList,
        languagesList,
        financeSignManager1,
        financeSignManager2,
        financeSignManager3,
        timeScheduleManager,
        dailyManager,
        isSaveSup
    };
    console.log(JSON.stringify(json))
    if(file){
        return axios({
            urlTo:"CosApp",
            method:"post",
            params: {
                method: 'addOrUpdateStaffDetail'
            },
            data:json,
            onUploadProgress:(progressEvent) => {
                // 对原生进度事件的处理
                callback(progressEvent);
            },
            uploadFile:{
                file:file
            }
        });
    }else{
        return axios({
            urlTo:"CosApp",
            method:"post",
            params: {
                method: 'addOrUpdateStaffDetail'
            },
            data:json
        });
    }
}

// 添加证书
export const addCertifications = (staffID,certificationList,delCertificationID,file) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addCertifications'
        },
        data:{
            staffID,
            certificationList,
            delCertificationID
        },
        uploadFile:{
            file:file
        }
    });
}

// 获得某人的所有信息
export const findStaffByStaffID = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findStaffByStaffID',
            staffID
        }
    });
}


// 该员工是否可以删除
export const isStaffDeleteOK = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'isStaffDeleteOK',
            staffID
        }
    });
}

// 获取所有部门
export const getDepartmentsByFact = (flag) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getDepartmentsByFact',
            flag
        }
    });
}

// 获取所有班级
export const getClasses = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getClasses',
            staffID
        }
    });
}

// 获取所有班级
export const getChildAttsByDate = (staffID,beginDate,endDate,classID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChildAttsByDate',
            staffID,
            beginDate,
            endDate,
            classID
        }
    });
}

// 获得班级下一天幼儿的出勤
export const getClassChildAtts = (pageNo,pageSize,attDate,staffID,classID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getClassChildAtts',
            pageNo,
            pageSize,
            attDate,
            staffID,
            classID
        }
    });
}

// 按月划考勤
export const updateChilAtts = (attData) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'updateChilAtts'
        },
        data:{
            attData
        }
    });
}

// 根据classID获取班级下的所有幼儿
export const getChildsByClassID = (classID,content) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChildsByClassID',
            classID,
            content:content?content:''
        }
    });
}

// 根据childID获取幼儿信息
export const getChildByChildID = (childID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChildByChildID',
            childID
        }
    });
}

// 根据childID获取幼儿家庭成员
export const getParentsByChildID = (childID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getParentsByChildID',
            childID
        }
    });
}

// 根据状态得到某人能看见的班级
export const getClassesByStatus = (staffID,status) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getClassesByStatus',
            staffID,
            status
        }
    });
}

// 获取家长信息
export const findParentByID = (ID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findParentByID',
            ID
        }
    });
}

// 添加或修改家庭成员
export const addOrUpdateParent = ({id,staffID,childID,parentName,sex,relation,address,phoneNum,mobileNum,qq,career,cardID,email,remark}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateParent'
        },
        data:{
            id,
            staffID,
            childID,
            parentName,
            sex,
            relation,
            address,
            phoneNum,
            mobileNum,
            qq,
            career,
            cardID,
            email,
            remark
        }
    });
}

// 删除家庭成员
export const delParent = (staffID,parentID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'delParent'
        },
        data:{
            staffID,
            parentID
        }
    });
}

// 新增幼儿时获取childNum
export const getChildNum = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChildNum'
        }
    });
}

// 添加幼儿（新生录入）
export const addNewChild = ({
        // childID,
        childNum,
        childName,
        sexStatus,
        birthday,
        connectPeople,
        phoneNum,
        remark,
        discountUntil,
        mealFeeTypeID,
        tuitionTypeID,
        mealFeeRefundTypeID,
        tuitionRefundTypeID,
        discountMealFee,
        discountTuition,
        insuranceExpiryDate,
        openBankId,
        carsNO,
        usrName,
        certType,
        certId,
        childNation,
        childHuji,
        identityType,
        identityCard
    }) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addNewChild'
        },
        data:{
            // childID,
            childNum:childNum?childNum:"",
            childName:childName?childName:"",
            sexStatus:sexStatus?sexStatus:"0",
            birthday:birthday?birthday:"",
            connectPeople:connectPeople?connectPeople:"",
            phoneNum:phoneNum?phoneNum:"",
            remark:remark?remark:"",
            discountUntil:discountUntil?discountUntil:"",
            mealFeeTypeID:mealFeeTypeID?mealFeeTypeID:"",
            tuitionTypeID:tuitionTypeID?tuitionTypeID:"",
            mealFeeRefundTypeID:mealFeeRefundTypeID?mealFeeRefundTypeID:"",
            tuitionRefundTypeID:tuitionRefundTypeID?tuitionRefundTypeID:"",
            discountMealFee:discountMealFee?discountMealFee:"",
            discountTuition:discountTuition?discountTuition:"",
            insuranceExpiryDate:insuranceExpiryDate?insuranceExpiryDate:"",
            openBankId:openBankId?openBankId:"",
            carsNO:carsNO?carsNO:"",
            usrName:usrName?usrName:"",
            certType:certType?certType:"",
            certId:certId?certId:"",
            childNation:childNation?childNation:"",
            childHuji:childHuji?childHuji:"",
            identityType:identityType?identityType:"",
            identityCard:identityCard?identityCard:""
        }
    });
}

// 修改幼儿信息
export const updateChild = ({
        childID,
        childNum,
        childName,
        sexStatus,
        birthday,
        connectPeople,
        phoneNum,
        remark,
        discountUntil,
        mealFeeTypeID,
        tuitionTypeID,
        mealFeeRefundTypeID,
        tuitionRefundTypeID,
        discountMealFee,
        discountTuition,
        insuranceExpiryDate,
        openBankId,
        carsNO,
        usrName,
        certType,
        certId,
        childNation,
        childHuji,
        identityType,
        identityCard
    }) => {

    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'updateChild'
        },
        data:{
            childID,
            childNum,
            childName,
            sexStatus,
            birthday,
            connectPeople,
            phoneNum,
            remark,
            discountUntil,
            mealFeeTypeID,
            tuitionTypeID,
            mealFeeRefundTypeID,
            tuitionRefundTypeID,
            discountMealFee,
            discountTuition,
            insuranceExpiryDate,
            openBankId,
            carsNO,
            usrName,
            certType,
            certId,
            childNation,
            childHuji,
            identityType,
            identityCard
        }
    });
}

// 删除幼儿
export const delChild = (staffID,childID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'delChild'
        },
        data:{
            staffID,
            childID
        }
    });
}

// 幼儿上传头像
export const addChildPhoto = (childID,file) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addChildPhoto'
        },
        data:{
            childID
        },
        uploadFile:{
            file:file
        }
    });
}

// 查看幼儿学籍
export const getChildRecord = (childID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChildRecord',
            childID
        }
    });
}

// 幼儿转班
export const changeClass = (childID,nowClassID,changeClassID,turnDate) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'changeClass'
        },
        data:{
            childID,
            nowClassID,
            changeClassID,
            turnDate
        }
    });
}

// 幼儿退学
export const quitSchool = (childID,classID,turnDate,remark) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'quitSchool'
        },
        data:{
            childID,
            classID,
            turnDate,
            remark
        }
    });
}

// 幼儿新生分班
export const newKindergartenChildrenToClass = (childIDs,classID,dataFrom,remark) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'newKindergartenChildrenToClass'
        },
        data:{
            childIDs,
            classID,
            dataFrom,
            remark
        }
    });
}

// 根据ID查询班级信息
export const findClassByID = (classID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findClassByID',
            classID
        }
    });
}

// 添加或修改班级信息
export const addOrUpdateClass = (id,classNum,className,classSetNum,classDate,classStatus,classType,classTeacher,remark,assistant,nurse) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateClass'
        },
        data:{
            id,
            classNum,
            className,
            classSetNum,
            classDate,
            classStatus,
            classType,
            classTeacher,
            remark,
            assistant,
            nurse
        }
    });
}

// 添加时获取classNum
export const getClassNum = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getClassNum'
        }
    });
}

// 根据ID删除班级
export const deleteClassByID = (classID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteClassByID'
        },
        data:{
            classID
        }
    });
}

// 升班
export const setClassType = (classID,ClassName) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'setClassType'
        },
        data:{
            classID,
            ClassName
        }
    });
}

// 毕业
export const setClassStatus = (classID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'setClassStatus'
        },
        data:{
            classID
        }
    });
}

// 获得蜂堡绑定页
export const getRegisterChildren = (pageNo,pageSize,staffID,classID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getRegisterChildren',
            pageNo,
            pageSize,
            staffID,
            classID
        }
    });
}

// 蜂堡绑定_发短信
export const sendRegisterChildren = (childID,classID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'sendRegisterChildren'
        },
        data:{
            childID,
            classID
        }
    });
}

// 教职工考核_按班级评定   yearMonth:201807
export const getClassPerformance = (pageNo,pageSize,staffID,yearMonth) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getClassPerformance',
            pageNo,
            pageSize,
            staffID,
            yearMonth
        }
    });
}

// 按班级评定_班级出勤   yearMonth:201807
export const getMonthAttPerformance = (staffID,classID,yearMonth) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getMonthAttPerformance',
            classID,
            staffID,
            yearMonth
        }
    });
}

// 按班级评定_2.5岁以下出勤   yearMonth:201807
export const getBabyAttPerformance = (staffID,classID,yearMonth) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getBabyAttPerformance',
            classID,
            staffID,
            yearMonth
        }
    });
}

// 教职工考核_按教工评定   yearMonth:201807
export const getWorkPerformance = (pageNo,pageSize,staffID,yearMonth) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getWorkPerformance',
            pageNo,
            pageSize,
            staffID,
            yearMonth
        }
    });
}

// 教职工考核_本日家园通   theDate:2018-07-13
export const getDayPerformance = (staffID,theDate) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getDayPerformance',
            staffID,
            theDate
        }
    });
}

// 教职工考核_本日家园通   type:-2：以孩子为单位，-1：以园所为单位，0：以班级为单位
export const getMonthPerformance = (staffID,yearMonth,type) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getMonthPerformance',
            staffID,
            yearMonth,
            type
        }
    });
}

// 根据specialFeeType获得缴费科目 specialFeeType: MEAL_FEE：餐费, TUITION：保育费, TUITION_REFUND：保育费退费, MEAL_FEE_REFUND：餐费退费
export const getPaymentsByType = (specialFeeType,deleteFlag) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getPaymentsByType',
            specialFeeType,
            deleteFlag:deleteFlag?deleteFlag:"0"
        }
    });
}

// 根据员工Id获取所有的申领申请
export const getAllapplyByStaffId = (staffID,order,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllapplyByStaffId',
            staffID,
            order,
            pageNo,
            pageSize
        }
    });
}

// 根据申请Id获取申请详细信息
export const getApplyDetailByAplyId = (applyId) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getApplyDetailByAplyId',
            applyId
        }
    });
}

// 获取物品分类一览
export const getGoodsSortMessage = (cosNum,pageNo,pageSize,staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getGoodsSortMessage',
            cosNum,
            pageNo,
            pageSize,
            staffID,
        }
    });
}

// 获取物品台帐一览
export const getGoodsMessage = (cosNum,pageNo,pageSize,staffID,sortID,useStatus,status) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getGoodsMessage',
            cosNum,
            pageNo,
            pageSize,
            staffID,
            sortID,
            useStatus,
            status,
        }
    });
}

//获取指定时间段可用物品数量
export const getCanUseGoods = (applyID,goodsID,date1,date2) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCanUseGoods',
            applyID,
            goodsID,
            date1,
            date2
        }
    });
}

//申请领用详细
export const applyUseDetail = (goodsID,masterID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'applyUseDetail',
            goodsID,
            masterID
        }
    });
}

//物品领用情况
export const getOccupyList = (goodsID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getOccupyList',
            goodsID
        }
    });
}

// 添加申领信息
export const addApplyInfo = ({masterID,goodsID,beginDate,beginTime,endDate,endTime,reason,applyCount}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addApplyInfo'
        },
        data:{
            masterID,
            goodsID,
            beginDate,
            beginTime,
            endDate,
            endTime,
            reason,
            applyCount
        }
    });
}

// 添加申领信息
export const updateApplyInfo = ({applyID,goodsID,beginDate,beginTime,endDate,endTime,reason,applyCount}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'updateApplyInfo'
        },
        data:{
            applyID,
            goodsID,
            beginDate,
            beginTime,
            endDate,
            endTime,
            reason,
            applyCount
        }
    });
}

//根据申请ID删除申请信息
export const deleteApplyInfo = (applyID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteApplyInfo'
        },
        data:{
            applyID
        }
    });
}

//根据员工Id获取所有待签字项
export const getAllsignByStaffId = (staffID,order,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllsignByStaffId',
            staffID,
            order,
            pageNo,
            pageSize
        }
    });
}

//进行签字操作
export const signApplyByApplyId = ({applyID,masterID,singer,goodsID,status,note}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'signApplyByApplyId',
        },
        data:{
            applyID,
            masterID,
            singer,
            goodsID,
            status,
            note
        }
    });
}

//根据员工Id获取所有待出库项
export const getAlloutByStaffId = (staffID,order,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAlloutByStaffId',
            staffID,
            order,
            pageNo,
            pageSize
        }
    });
}

//进行出库操作
export const outGoods = (staffId,applyIds) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'outGoods'
        },
        data:{
            staffId,
            applyIds
        }
    });
}

//根据员工Id获取所有待入库项
export const getAllinByStaffId = (staffID,order,pageNo,pageSize,sortID,selectedStaffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllinByStaffId',
            staffID,
            order,
            pageNo,
            pageSize,
            sortID,
            selectedStaffID
        }
    });
}

//进行出库操作
export const inGoods = (applyIds) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'inGoods'
        },
        data:{
            applyIds
        }
    });
}

//申领中物品查询
export const findApplyQuery = (ddlApplyName,ddlSort,page,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findApplyQuery',
            ddlApplyName,
            ddlSort,
            page,
            pageSize
        }
    });
}

//根据员工Id获取所有的采购申请
export const getAllPurchaseApplyByStaffId = (staffID,order,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllPurchaseApplyByStaffId',
            staffID,
            order,
            pageNo,
            pageSize
        }
    });
}

//根据采购Id获取采购申请详细信息
export const getPurchaseApplyDetailByAplyId = (applyId) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getPurchaseApplyDetailByAplyId',
            applyId
        }
    });
}

//根据采购Id修改采购申请信息
export const updatePurchaseApplyInfo = ({applyID,masterID,goodsName,ddlGoodsSort,count,size,reason,possiblePrice, ddlSequenceNo, hidActualstaffID}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'updatePurchaseApplyInfo',
        },
        data:{
            applyID,
            masterID,
            goodsName,
            ddlGoodsSort,
            count,
            size,
            reason,
            possiblePrice, 
            ddlSequenceNo, 
            hidActualstaffID
        }
    });
}

//添加采购信息
export const addPurchaseApplyInfo = ({masterID,goodsName,ddlGoodsSort,count,size,reason,possiblePrice,ddlSequenceNo,hidActualstaffID}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addPurchaseApplyInfo',
        },
        data:{
            masterID,
            goodsName,
            ddlGoodsSort,
            count,
            size,
            reason,
            possiblePrice,
            ddlSequenceNo,
            hidActualstaffID
        }
    });
}

//根据采购Id删除采购信息
export const deletePurchaseApplyInfo = (applyID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deletePurchaseApplyInfo'
        },
        data:{
            applyID
        }
    });
}

//根据员工Id获取所有的采购待签字项
export const getAllPurchaseSignByStaffId = (staffID,order,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllPurchaseSignByStaffId',
            staffID,
            order,
            pageNo,
            pageSize
        }
    });
}

//进行采购签字操作
export const signPurchaseApply = ({applyID,masterID,singer,status,note}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'signPurchaseApply',
        },
        data:{
            applyID,
            masterID,
            singer,
            status,
            note
        }
    });
}

//根据员工Id获取所有的采购信息入库项
export const getAllPurchaseInByStaffId = (staffID,order,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllPurchaseInByStaffId',
            staffID,
            order,
            pageNo,
            pageSize
        }
    });
}

//根据员工Id获取所有的采购信息出库项
export const getAllPurchaseOutByStaffId = (staffID,order,pageNo,pageSize,sequenceNo) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllPurchaseOutByStaffId',
            staffID,
            order,
            pageNo,
            pageSize,
            sequenceNo
        }
    });
}

//根据采购Id获取采购信息
export const getPurchaseDetailOutByAplyId = (applyId) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getPurchaseDetailOutByAplyId',
            applyId
        }
    });
}

//采购信息录入
export const PurchaseInput = ({applyID,goodsName,goodsSrot, purchaserstaffID,purchaseDate, purchaseCount,purchasePrice,explain}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'PurchaseInput',
        },
        data:{
            applyID,
            goodsName,
            goodsSrot, 
            purchaserstaffID,
            purchaseDate, 
            purchaseCount,
            purchasePrice,
            explain
        }
    });
}

//修改采购信息
export const updatePurchaseOutInfo = ({applyID,goodsName,goodsSrot, purchaserstaffID,purchaseDate, purchaseCount,purchasePrice,explain}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'updatePurchaseOutInfo',
        },
        data:{
            applyID,
            goodsName,
            goodsSrot, 
            purchaserstaffID,
            purchaseDate, 
            purchaseCount,
            purchasePrice,
            explain
        }
    });
}

//删除采购信息录入
export const deletePurchaseApplyInfoOut = (applyID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deletePurchaseApplyInfoOut'
        },
        data:{
            applyID
        }
    });
}

//获取所有采购批次号
export const getAllSequenceNo = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllSequenceNo',
        }
    });
}

//获得采购信息的入库信息
export const getPurchaseApplyAllInInfo = (applyID,sortID,isValid,hdmode,keyword,stabilizeAssetsNum,dep,position,userID,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getPurchaseApplyAllInInfo',
            applyID,
            sortID,
            isValid,
            hdmode,
            keyword,
            stabilizeAssetsNum,
            dep,
            position,
            userID,
            pageNo,
            pageSize
        }
    });
}

//入库信息添加
export const addGoodsInfo = ({applyID,goodsName,stabilizeAssetsNum,goodssort,status,masterID,detail,purchaseDate,
                              purchasePrice,purchaserStaffID,department,location,sum,attr}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addGoodsInfo',
        },
        data:{
            applyID,
            goodsName,
            stabilizeAssetsNum,
            goodssort,
            status,
            masterID,
            detail,
            purchaseDate,
            purchasePrice,
            purchaserStaffID,
            department,
            location,
            sum,
            attr
        }
    });
}

//入库信息修改
export const updateGoodsInfo = ({applyID,goodsID,goodsName,stabilizeAssetsNum,goodssort,status,masterID,detail,purchaseDate,
                              purchasePrice,purchaserStaffID,department,location,sum,attr}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'updateGoodsInfo',
        },
        data:{
            applyID,
            goodsID,
            goodsName,
            stabilizeAssetsNum,
            goodssort,
            status,
            masterID,
            detail,
            purchaseDate,
            purchasePrice,
            purchaserStaffID,
            department,
            location,
            sum,
            attr
        }
    });
}

//删除入库信息
export const deleteGoodsInfo = (ID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteGoodsInfo'
        },
        data:{
            ID
        }
    });
}

//执行入库操作
export const doInApply = (applyID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'doInApply'
        },
        data:{
            applyID
        }
    });
}

//根据Id获得采购入库详细信息
export const getPurchaseApplyInInfoById = (Id) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getPurchaseApplyInInfoById',
            Id
        }
    });
}

//获得代申请人
export const getAllapplyManager = (staffID,isOut) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllapplyManager',
            staffID,
            isOut
        }
    });
}

//采购物品查询
export const findAllPurchaseGoods = (staffID,sort,goodName,actualID,applyManagerID,pageSize,pageNo) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findAllPurchaseGoods',
            staffID,
            sort,
            goodName,
            actualID,
            applyManagerID,
            pageSize,
            pageNo
        }
    });
}

//获取所有外聘教师
export const getAllExternalTeacher = (pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllExternalTeacher',
            pageNo,
            pageSize
        }
    });
}

//根据ID得到外聘教师详情
export const getExternalTeacherByID = (ID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getExternalTeacherByID',
            ID
        }
    });
}

//添加或修改外聘教师
export const addOrUpdateExternalTeacher = ({id,teacherName,sex,teacherIdentityNo,teacherCallNum,teacherPhoneNum,teacherQQ,teacherEmail,teacherClass,teacherPayWay,teacherPay,remark}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateExternalTeacher',
        },
        data:{
            id,
            teacherName,
            sex,
            teacherIdentityNo,
            teacherCallNum,
            teacherPhoneNum,
            teacherQQ,
            teacherEmail,
            teacherClass,
            teacherPayWay,
            teacherPay,
            remark,
        }
    });
}

//删除兴趣班外聘教师
export const deleteExternalTeacher = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteExternalTeacher',
        },
        data:{
            id,
        }
    });
}

//获取用户可以看到的所有兴趣班
export const getIClass = (pageNo,pageSize,staffID,endFlag) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getIClass',
            pageNo,
            pageSize,
            staffID,
            endFlag
        }
    });
}

//根据兴趣班ID得到班级详情
export const getIClassByID = (classID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getIClassByID',
            classID
        }
    });
}

//删除兴趣班
export const deleteIClass = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteIClass',
        },
        data:{
            id,
        }
    });
}

//兴趣班 标记为结束
export const endClass = (classID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'endClass',
        },
        data:{
            classID,
        }
    });
}

//添加或修改兴趣班
export const addOrUpdateIClass = ({id,className,eachClassPay,eachHourPay,externalTeacher,teacher,endFlag,beginDate,endDate,isPTDC}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateIClass',
        },
        data:{
            id,
            className,
            eachClassPay,
            eachHourPay,
            externalTeacher,
            teacher,
            endFlag,
            beginDate,
            endDate,
            isPTDC
        }
    });
}

//获得兴趣班级下的所有幼儿
export const getChildrenByIClassID = (pageNo,pageSize,staffID,classID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChildrenByIClassID',
            pageNo,
            pageSize,
            staffID,
            classID
        }
    });
}

//删除兴趣班学员
export const deleteIClassChild = (classID,childID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteIClassChild',
        },
        data:{
            classID,
            childID
        }
    });
}

//兴趣班 幼儿退班
export const quitClass = (classID,childID,quitDate) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'quitClass',
        },
        data:{
            classID,
            childID,
            quitDate,
        }
    });
}

//获得幼儿参加的全部兴趣班
export const getIClassByChildID = (childID,outFlag) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getIClassByChildID',
            childID,
            outFlag,
        }
    });
}

//将幼儿添加到兴趣班
export const addChildInIClass = (childID,iClassID,inDate) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addChildInIClass',
        },
        data:{
            childID,
            iClassID,
            inDate,
        }
    });
}

//根据时间、兴趣班ID得到课程表
export const getCalendar = (classID,beginTime,endTime) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCalendar',
            classID,
            beginTime,
            endTime
        }
    });
}

//兴趣班 得到缴费任务
export const getChargeMessionByIClassID = (pageNo,pageSize,iClassID,startDate,endDate,status) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChargeMessionByIClassID',
            pageNo,
            pageSize,
            iClassID,
            startDate,
            endDate,
            status
        }
    });
}

//兴趣班 根据ID得到缴费详情
export const getIClassChargeByID = (ID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getIClassChargeByID',
            ID
        }
    });
}

//兴趣班 得到教师课时费
export const getChargeTeacher = (pageNo,pageSize,iClassID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChargeTeacher',
            pageNo,
            pageSize,
            iClassID
        }
    });
}

//得到兴趣班收费列表
export const getChildChargeMessage = (classID,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChildChargeMessage',
            classID,
            pageNo,
            pageSize
        }
    });
}

//兴趣班 计算教师支出
export const insertChargeTeacher = (iClassID,startDate,endDate) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'insertChargeTeacher',
        },
        data:{
            iClassID,
            startDate,
            endDate
        }
    });
}

//兴趣班 删除教师支出
export const deleteIChargeTeacher = (chargeTeacherID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteIChargeTeacher',
        },
        data:{
            chargeTeacherID
        }
    });
}

//得到课程出勤详情
export const getCalendarDetail = (pageNo,pageSize,classID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCalendarDetail',
            pageNo,
            pageSize,
            classID
        }
    });
}

//得到兴趣班收费操作列表
export const getPaymentTaskForCashier = (staffID,classID,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getPaymentTaskForCashier',
            staffID,
            classID,
            pageNo,
            pageSize
        }
    });
}

//删除兴趣班缴费任务
export const deleteIClassCharge = (chargeInterestChildID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteIClassCharge',
        },
        data:{
            chargeInterestChildID
        }
    });
}

//添加或修改缴费
export const addOrUpdatChildChargee = ({iClassID, StartDate,EndDate,ID,childID,charge,plusCharge,remark,staffID}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdatChildChargee',
        },
        data:{
            iClassID, 
            StartDate,
            EndDate,
            ID,
            childID,
            charge,
            plusCharge,
            remark,
            staffID
        }
    });
}

//获得兴趣班下幼儿详情
export const getIclassChildDetail = (childId,interestClassId) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getIclassChildDetail',
            childId,
            interestClassId
        }
    });
}

//手动缴费
export const paymentTaskByHand = (paymentTaskID,staffID,paymentDate,paymentWay) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'paymentTaskByHand',
        },
        data:{
            paymentTaskID,
            staffID,
            paymentDate,
            paymentWay
        }
    });
}

//添加或修改任课教师/陪班教师界面
export const addOrUpdateTeacherDetail = (classId,calendarID,turn,status) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'addOrUpdateTeacherDetail',
            classId,
            calendarID,
            turn,
            status
        }
    });
}

//添加或修改任课教师/陪班教师
export const addOrUpdateTeacher = ({calendarID,turn,status,teacherID,teacherName}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateTeacher',
        },
        data:{
            calendarID,
            turn,
            status,
            teacherID,
            teacherName
        }
    });
}

//添加或修改出勤人员详细
export const addOrUpdateAttrChildDetail = (staffID,pageNo,pageSize,classID,calendarID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'addOrUpdateAttrChildDetail',
            staffID,
            pageNo,
            pageSize,
            classID,
            calendarID
        }
    });
}

//添加或修改出勤人员
export const addOrUpdateAttrChild = (calendarId,childIds,types) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateAttrChild',
        },
        data:{
            calendarId,
            childIds,
            types
        }
    });
}

//查看考勤
export const attendMessageForOnePerson = (interestClassID, personType,pageSize,personID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'attendMessageForOnePerson',
            interestClassID, 
            personType,
            pageSize,
            personID
        }
    });
}

//删除缴费
export const deletetask = (chargeMissionID,interestClassID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deletetask',
        },
        data:{
            chargeMissionID, 
            interestClassID
        }
    });
}

//添加兴趣班缴费任务
export const addIClassCharge = (staffID,classID,startDate,endDate,chargeData) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addIClassCharge',
        },
        data:{
            staffID,
            classID,
            startDate,
            endDate,
            chargeData
        }
    });
}

//获得课程表设定列表
export const getCourseTableSet = (classID,termName,courseMonth,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCourseTableSet',
            classID,
            termName,
            courseMonth,
            pageNo,
            pageSize
        }
    });
}

//获得课程表设定详情
export const getCourseTableSetDetail = (entry,Id,classId) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCourseTableSetDetail',
            entry,
            Id,
            classId
        }
    });
}

//课程表查询
export const findCourseTable = (classID,year,month) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findCourseTable',
            classID,
            year,
            month
        }
    });
}

//添加或修改课程表设定
export const addOrUpdateCourseTable = ({ID,ptdcID,ddlClassID,CourseDate,CourseFrom,CourseTo,Teacher,CourseName}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateCourseTable',
        },
        data:{
            ID,
            ptdcID,
            ddlClassID,
            CourseDate,
            CourseFrom,
            CourseTo,
            Teacher,
            CourseName
        }
    });
}

//删除课程表设定
export const deleteCourseTable = (Id) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteCourseTable',
        },
        data:{
            Id
        }
    });
}

//教案管理列表
export const getCoursePlanList = (staffId,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCoursePlanList',
            staffId,
            pageNo,
            pageSize
        }
    });
}

//查看教学审批
export const getCourseTheme = (Id,staffId,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCourseTheme',
            Id,
            staffId,
            pageNo,
            pageSize
        }
    });
}

//获得下拉框列表
export const getCourseList = (value) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCourseList',
            value
        }
    });
}

//从川迪课件库获得课件列表
export const getCourseFromLibrary = (ddlCours,pageSize,pageNo) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCourseFromLibrary',
            ddlCours,
            pageSize,
            pageNo
        }
    });
}

//编辑/创建/复制教学主题(1,-1,2)
export const addCourseTheme = ({Id,staffId,status,tableID,ThemeName,ThemePoint,ParentGuide,links}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addCourseTheme',
        },
        data:{
            Id,
            staffId,
            status,
            tableID,
            ThemeName,
            ThemePoint,
            ParentGuide,
            links
        }
    });
}

//提交教案
export const confirmCourse = (ID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'confirmCourse',
        },
        data:{
            ID
        }
    });
}

//再提交教案
export const reconfirmCourse = (ID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'reconfirmCourse',
        },
        data:{
            ID
        }
    });
}

//清空教学主题
export const cleanCourseTheme = (CourseID,ThemeID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'cleanCourseTheme'
        },
        data:{
            CourseID,
            ThemeID
        }
    });
}

//提交选中课件
export const addSelectCourse = ({Ids,CoursewareNames,ThemeId,data}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addSelectCourse',
        },
        data:{
            Ids,
            CoursewareNames,
            ThemeId,
            data
        }
    });
}

//得到教案审批列表
export const getCourseThemeMessage = (staffId,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCourseThemeMessage',
            staffId,
            pageNo,
            pageSize
        }
    });
}

//添加审批
export const addSignTheme = (staffId,Id,text) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addSignTheme',
        },
        data:{
            staffId,
            Id,
            text
        }
    });
}

//添加到资料库
export const addToDataBase = (CourseThemeID,ddlThemeDataType) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addToDataBase',
        },
        data:{
            CourseThemeID,
            ddlThemeDataType
        }
    });
}

//得到精品教案库列表
export const getThemeDatabase = (pageNo,pageSize,sort) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getThemeDatabase',
            pageNo,
            pageSize,
            sort
        }
    });
}

//得到分类管理列表
export const getCategoryList = (pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCategoryList',
            pageNo,
            pageSize,
        }
    });
}

//添加分类
export const addCategory = (ThemeDataType) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addCategory',
        },
        data:{
            ThemeDataType
        }
    });
}

//删除分类
export const deleteCategory = (cid) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteCategory',
        },
        data:{
            cid
        }
    });
}

//得到精品教案库详情
export const getThemeDatabaseDetail = (staffId,Id,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getThemeDatabaseDetail',
            staffId,
            Id,
            pageNo,
            pageSize
        }
    });
}

//添加或修改精品教案库
export const addOrUpdateThemeDatabase = ({Id,staffId,ThemeName,ThemePoint,ParentGuide,TeachVideo,ThemeDataType,data}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateThemeDatabase',
        },
        data:{
            Id,
            staffId,
            ThemeName,
            ThemePoint,
            ParentGuide,
            TeachVideo,
            ThemeDataType,
            data
        }
    });
}

//删除精品教案库
export const deleteThemeDatabase = (Id) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteThemeDatabase',
        },
        data:{
            Id
        }
    });
}

//显示拼图道场列表
export const getPTDClist = (classID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getPTDClist',
            classID
        }
    });
}

// 获取Setting表的值
export const getSettingValue = (settingKey) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getSettingValue',
            settingKey
        }
    });
}

// 幼儿缴费科目管理一览
export const getChildSpecialFee = (classID,ageBaseDate) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChildSpecialFee',
            classID,
            ageBaseDate
        }
    });
}

// 幼儿缴费科目管理确认
export const setChildSpecialFee = (feeData) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'setChildSpecialFee'
        },
        data:{
            feeData
        }
    });
}

// 根据条件得到家园通
export const getHomeTong = (type,typeName,theDate,staffID,corcID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getHomeTong',
            type,
            typeName,
            theDate,
            staffID,
            corcID
        }
    });
}

// 教职工考核_按教工评定获得导出数据
export const getHomeTongExport = (staffID,yearMonth) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getHomeTongExport',
            staffID,
            yearMonth
        }
    });
}

// 得到工作日
export const getWorkDate = (year,month) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getWorkDate',
            year,
            month
        }
    });
}

// 得到休息日
export const getVacDate = (year,month) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getVacDate',
            year,
            month
        }
    });
}

// 根据新生ID获取缴费详情
export const getNewChildBeeList = (pageNo,pageSize,childID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getNewChildBeeList',
            pageNo,
            pageSize,
            childID
        }
    });
}

// 新生添加修改缴费任务
export const addOrUpdateBeecellPublish = (id,staffID,childID,childName,phoneNum,childNum,beeCellID,price,remark,cosNum) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateBeecellPublish'
        },
        data:{
            id,
            staffID,
            childID,
            childName,
            phoneNum,
            childNum,
            beeCellID,
            price,
            remark,
            cosNum
        }
    });
}

// 删除新生缴费任务
export const delBeecellPublish = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'delBeecellPublish'
        },
        data:{
            id
        }
    });
}

// 根据ID获取缴费任务详情
export const getBeeCellListByID = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getBeeCellListByID',
            id
        }
    });
}

// 获取二维码
export const getQRCode = (cosNum) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getQRCode',
            cosNum
        }
    });
}

// 人工收费
export const payBeecellList = (ids,paymentWay,payDate) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'payBeecellList'
        },
        data:{
            ids,
            paymentWay,
            payDate
        }
    });
}

// 修改红日子黑日子
export const updateDate = (year,month,workDate,vacDate) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'updateDate'
        },
        data:{
            year,
            month,
            workDate,
            vacDate
        }
    });
}

//获取所有货币单位
export const GetRateSets = (cosNum) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'GetRateSets',
            cosNum
        }
    });
}

//获取所有财务所属公司
export const getCompany = (cosNum) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCompany',
            cosNum
        }
    });
}

//获取所有资金分类
export const getAllBigType = (cosNum) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllBigType',
            cosNum
        }
    });
}

//获取所有资金小类
export const getSmallType = (cosNum,bigTypeID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getSmallType',
            cosNum,
            bigTypeID
        }
    });
}

//获取所有资金科目
export const getSubject = (cosNum,bigTypeID,smallTypeID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getSubject',
            cosNum,
            bigTypeID,
            smallTypeID
        }
    });
}

//获得资金出处信息
export const getOutBill = (cosNum,bigTypeID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getOutBill',
            cosNum,
            bigTypeID
        }
    });
}

//获得出处详细
export const getOutBillDetail = (cosNum,outBill) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getOutBillDetail',
            cosNum,
            outBill
        }
    });
}

//获取某人所有未还款额
export const getMarginMoneySumByStaffID = (cosNum,staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getMarginMoneySumByStaffID',
            cosNum,
            staffID
        }
    });
}

//查询企业客户维护信息
export const getCustomerManage = (cosNum,pageNo,pageSize,customerType,searchText,param,customProvince) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCustomerManage',
            cosNum,
            pageNo,
            pageSize,
            customerType,
            searchText,
            param,
            customProvince
        }
    });
}

//添加报销申请
export const addChargeBill = ({
            staffID,
            id,
            hasInvoice,
            payType,
            chargeStaffID,
            money,
            rateID,
            rateName,
            companyID,
            bigType,
            bigTypeID,
            smallType,
            smallTypeID,
            subject,
            subjectID,
            sidAdditionalSigner1,
            sidAdditionalSigner2,
            billCount,
            warrantNumber,
            receiverTitle,
            customerID,
            bank,
            bankAccount,
            chargeBillType,
            note,
            transformCapital,
            returnCash,
            summary,
            billOutsList,
            ccUser,
            signUser,
            path,
            photoList,
            examineID,
            attachment,
            attachmentID
    }) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addChargeBill'
        },
        data:{
            staffID,
            id,
            hasInvoice,
            payType,
            chargeStaffID,
            money,
            rateID,
            rateName,
            companyID,
            bigType,
            bigTypeID,
            smallType,
            smallTypeID,
            subject,
            subjectID,
            sidAdditionalSigner1,
            sidAdditionalSigner2,
            billCount,
            warrantNumber,
            receiverTitle,
            customerID,
            bank,
            bankAccount,
            chargeBillType,
            note,
            transformCapital,
            returnCash,
            summary,
            billOutsList,
            ccUser,
            signUser,
            path,
            photoList,
            examineID,
            attachment,
            attachmentID
        }
    });
}

// 添加附件
export const addChargeAttachment = (file) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addChargeAttachment'
        },
        uploadFile:{
            file:file
        }
    });
}

//根据条件查询（我发起的/待我审批/我的抄送）审批
export const getExamineByFactor = (cosNum,pageNo,pageSize,createDateStart,createDateEnd,
    type,applyUser,approvalUser,ccUser,result) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getExamineByFactor',
            cosNum,
            pageNo,
            pageSize,
            createDateStart,
            createDateEnd,
            type,
            applyUser,
            approvalUser,
            ccUser,
            result
        }
    });
}

//撤销审批
export const delExamine = (cosNum,id) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'delExamine'
        },
        data:{
            cosNum,
            id
        }
    });
}

//审批
export const signExamine = (cosNum,id,approvalID,result,remark) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'signExamine'
        },
        data:{
            cosNum,
            id,
            approvalID,
            result,
            remark
        }
    });
}

//添加借款申请
export const addBookCharge = ({
            staffID,
            id,
            hasInvoice,
            payType,
            chargeStaffID,
            money,
            rateID,
            rateName,
            companyID,
            bigType,
            bigTypeID,
            smallType,
            smallTypeID,
            subject,
            subjectID,
            sidAdditionalSigner1,
            sidAdditionalSigner2,
            warrantNumber,
            receiverTitle,
            customerID,
            bank,
            bankAccount,
            chargeBillType,
            note,
            transformCapital,
            summary,
            billOutsList,
            ccUser,
            signUser,
            path,
            photoList,
            examineID,
            attachment,
            attachmentID
        }) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addBookCharge'
        },
        data:{
            staffID,
            id,
            hasInvoice,
            payType,
            chargeStaffID,
            money,
            rateID,
            rateName,
            companyID,
            bigType,
            bigTypeID,
            smallType,
            smallTypeID,
            subject,
            subjectID,
            sidAdditionalSigner1,
            sidAdditionalSigner2,
            warrantNumber,
            receiverTitle,
            customerID,
            bank,
            bankAccount,
            chargeBillType,
            note,
            transformCapital,
            summary,
            billOutsList,
            ccUser,
            signUser,
            path,
            photoList,
            examineID,
            attachment,
            attachmentID
        }
    });
}

//修改报销/借款内容_删图片
export const delChargeBillImg = (examineID,imgUr) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'delChargeBillImg'
        },
        data:{
            examineID,
            imgUr
        }
    });
}

//得到用户有权限看到的所有部门
export const getDepartments = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getDepartments',
            staffID,
            isNew:'1'
        }
    });
}

// 得到学杂费科目列表 flag:1已删除，0使用中 1300
export const getPaymentManageList = (staffId,pageNo,pageSize,flag) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getPaymentManageList',
            staffId,
            pageNo,
            pageSize,
            flag
        }
    });
}

// 新增或修改学杂费科目 
export const addPayment = ({
        paymentID,
        PaymentName,
        PaymentPrice,
        PaymentPriceUnit,
        Note,
        SpecialFeeType,
        rbMethod,
        ddlRefundMethodIndex,
        line1,
        line2,
        line3,
        Continuous1,
        Continuous2,
        Continuous3,
        ddlDays1,
        ddlDays2,
        ddlDays3,
        ddlStatus1,
        ddlStatus2,
        ddlStatus3,
        ddlCompare1,
        ddlCompare2,
        ddlCompare3,
        txtX1,
        txtX2,
        txtX3,
        txtAdministration1,
        txtAdministration2,
        txtAdministration3,
        txtAdministrationY1,
        txtAdministrationY2,
        txtAdministrationY3,
        ddlCalculationMethod1,
        ddlCalculationMethod2,
        ddlCalculationMethod3,
        ddlFlag31,
        ddlFlag32,
        ddlFlag33
    }) => {
        console.log({
            paymentID,
            PaymentName,
            PaymentPrice,
            PaymentPriceUnit,
            Note,
            SpecialFeeType,
            rbMethod,
            ddlRefundMethodIndex,
            line1,
            line2,
            line3,
            Continuous1,
            Continuous2,
            Continuous3,
            ddlDays1,
            ddlDays2,
            ddlDays3,
            ddlStatus1,
            ddlStatus2,
            ddlStatus3,
            ddlCompare1,
            ddlCompare2,
            ddlCompare3,
            txtX1,
            txtX2,
            txtX3,
            txtAdministration1,
            txtAdministration2,
            txtAdministration3,
            txtAdministrationY1,
            txtAdministrationY2,
            txtAdministrationY3,
            ddlCalculationMethod1,
            ddlCalculationMethod2,
            ddlCalculationMethod3,
            ddlFlag31,
            ddlFlag32,
            ddlFlag33
        });
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addPayment'
        },
        data:{
            paymentID,
            PaymentName,
            PaymentPrice,
            PaymentPriceUnit,
            Note,
            SpecialFeeType,
            rbMethod,
            ddlRefundMethodIndex,
            line1,
            line2,
            line3,
            Continuous1,
            Continuous2,
            Continuous3,
            ddlDays1,
            ddlDays2,
            ddlDays3,
            ddlStatus1,
            ddlStatus2,
            ddlStatus3,
            ddlCompare1,
            ddlCompare2,
            ddlCompare3,
            txtX1,
            txtX2,
            txtX3,
            txtAdministration1,
            txtAdministration2,
            txtAdministration3,
            txtAdministrationY1,
            txtAdministrationY2,
            txtAdministrationY3,
            ddlCalculationMethod1,
            ddlCalculationMethod2,
            ddlCalculationMethod3,
            ddlFlag31,
            ddlFlag32,
            ddlFlag33
        }
    });
}

// 删除学杂费
export const deletePayment = (paymentID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deletePayment'
        },
        data:{
            paymentID
        }
    });
}

// 得到学杂费科目详情
export const getPaymentManageDetail = (paymentID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getPaymentManageDetail',
            paymentID
        }
    });
}

// 得到所有角色
export const roleList = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'roleList'
        }
    });
}

// 新增角色
export const addRoleSet = (PostNm,Num,cbCopyRole,roleSelectId) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addRoleSet'
        },
        data:{
            PostNm,
            Num,
            cbCopyRole,
            roleSelectId
        }
    });
}

// 删除角色
export const deleteRoleSet = (roleSelectId) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteRoleSet'
        },
        data:{
            roleSelectId
        }
    });
}

// 添加或修改角色
export const addOrUpdateRoleSet = (id,roleName) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateRoleSet'
        },
        data:{
            id,
            roleName
        }
    });
}

// 得到角色详情 
export const findRoleByID = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findRoleByID',
            id
        }
    });
}

// 修改员工头像
export const addStaffPhoto = (staffID,file) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addStaffPhoto'
        },
        data:{
            staffID
        },
        uploadFile:{
            file:file
        }
    });
}

//发起审批
export const addExamine = ({cosNum,type,applyUser,approvalUser,ccUser,content,flag}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addExamine'
        },
        data:{
            cosNum,
            type,
            applyUser,
            approvalUser,
            ccUser,
            content,
            flag
        }
    });
}

//获取项目信息
export const getVisiableProjects = (staffID,isNew) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getVisiableProjects',
            staffID,
		    isNew
        }
    });
}

//获取加班时间
export const getOverDateList = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getOverDateList',
            staffID
        }
    });
}

//获取加班时长和单位
export const getOverHours = (overTimeMethod,overTimeFromHour,overTimeToHour) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getOverHours',
            overTimeMethod,
            overTimeFromHour,
            overTimeToHour
        }
    });
}

//获取迟到记录
export const LoadALTData = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'LoadALTData',
            staffID
        }
    });
}

//获取加班申请人列表
export const getAllLowStaffs = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllLowStaffs',
            staffID
        }
    });
}

//获取所有产品分类
export const getAllCommoditySort = (cosNum,sortID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getAllCommoditySort',
            cosNum,
            sortID
        }
    });
}

//根据分类获取相应的产品列表
export const getDataSetBySortID = (cosNum,pageNo,pageSize,staffID,sortID,searchText) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getDataSetBySortID',
            cosNum,
            pageNo,
            pageSize,
            staffID,
            sortID,
            searchText
        }
    });
}

//添加或修改订单
export const addOrUpdateCommodityorderApply = ({cosNum,id,sortID,staffID,actualName,sumMoney,
    constructionFee,transportationFee,tax,otherFee,orderTotalAmount,decimals,discountPercent,
    dealerID,userID,applyDetailList,ccUser,attachment,delAttachmentID,delImg}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdateCommodityorderApply'
        },
        data:{
            cosNum,
            id,
            sortID,
            staffID,
            actualName,
            sumMoney,
            constructionFee,
            transportationFee,
            tax,
            otherFee,
            orderTotalAmount,
            decimals,
            discountPercent,
            dealerID,
            userID,
            applyDetailList,
            ccUser,
            attachment,
            delAttachmentID,
            delImg,
        }
    });
}

//获得某人某时间段内的所有考勤记录
export const getTimesBook = (cosNum,staffID,beginDate,endDate) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getTimesBook',
            cosNum,
            staffID,
            beginDate,
            endDate
        }
    });
}

//迟到早退理由说明
export const updateJustify = ({cosNum,staffID,justifyDate,justifyReason,type,examineID}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'updateJustify'
        },
        data:{
            cosNum,
            staffID,
            justifyDate,
            justifyReason,
            type,
            examineID
        }
    });
}

//根据ID查询迟到早退理由
export const getJustifyTwo = (cosNum,justifyID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getJustifyTwo',
            cosNum,
            justifyID
        }
    });
}

//手动添加违规数据_针对考勤数据尚未读入的日期和“今天”的处理
export const addTimeBookNG = ({cosNum,date,staffID,type,reason}) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addTimeBookNG'
        },
        data:{
            cosNum,
            date,
            staffID,
            type,
            reason
        }
    });
}

//删除迟到早退辩解
export const delJustify = (cosNum,justifyID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'delJustify'
        },
        data:{
            cosNum,
            justifyID
        }
    });
}

//当天外出申请状况
export const getTheOutsideByStaffID = (cosNum,staffID,writeDate,status) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getTheOutsideByStaffID',
            cosNum,
            staffID,
            writeDate,
            status
        }
    });
}

//当天出差状况
export const getTheOnBusinessByStaffID = (cosNum,staffID,writeDate,status) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getTheOnBusinessByStaffID',
            cosNum,
            staffID,
            writeDate,
            status
        }
    });
}

//根据ID得到审批信息
export const getExamineByID = (cosNum,examineID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getExamineByID',
            cosNum,
            examineID
        }
    });
}

//查询订单
export const getCommodityOrderApplyMessage = (pageNo,pageSize,staffID,userName,userNum,actualName,signBeginDate,
        signEndDate,stockoutBeginDate,stockoutEndDate,status,dealer,chargeBeginDate,
        chargeEndDate,bankAccountID,searchText) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCommodityOrderApplyMessage',
            pageNo,
            pageSize,
            staffID,
            userName,
            userNum,
            actualName,
            signBeginDate,
            signEndDate,
            stockoutBeginDate,
            stockoutEndDate,
            status,
            dealer,
            chargeBeginDate,
            chargeEndDate,
            bankAccountID,
            searchText
        }
    });
}

//上传附件
export const addAttachment = (file,type) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addAttachment'
        },
        data:{
            type
        },
        uploadFile:{
            file:file
        }
    });
}

//根据ID获取订单详情
export const getCommodityorderApplyByID = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getCommodityorderApplyByID',
            id
        }
    });
}

// 根据StaffID得到资料库
export const getBaseByStaffID = (pageNo,pageSize,staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getBaseByStaffID',
            pageNo,
            pageSize,
            staffID,
            isNew: '1'
        }
    });
}

// 添加修改资料库内容 2123
export const addKnowledgeArticle = (id,staffID,staffName,treeNodeID,articleTitle,articleText,knowledgeBaseID,path,delID,attachment,delImgUrl) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addKnowledgeArticle'
        },
        data:{
            id,
            staffID,
            staffName,
            treeNodeID,
            articleTitle,
            articleText,
            knowledgeBaseID,
            path,// 手机上关联文件
            delID,// 要删除的附件ID，以,分隔
            attachment,// PC上上传文件，文件名:路径 以","分隔
            delImgUrl,// 要删除的图片路径,以,分隔
        }
    });
}

// 删除资料库内容 2124
export const deleteKnowledgeArticle = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteKnowledgeArticle'
        },
        data:{
            id
        }
    });
}

// 根据ID获取资料库内容详情 1192
export const getArticleDetail = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getArticleDetail',
            id
        }
    });
}

// 添加或修改资料库节点 2125
export const addKnowledgeTree = (id,treeNodeName,parentID,knowledgeBaseID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addKnowledgeTree'
        },
        data:{
            id,
            treeNodeName,
            parentID,
            knowledgeBaseID
        }
    });
}

// 删除资料库节点 2126
export const deleteKnowledgeTree = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteKnowledgeTree'
        },
        data:{
            id
        }
    });
}

// 根据父节点ID得到下面的内容 1193
export const getBaseTreeByParentID = (pageNo, pageSize, parentID, knowledgeBaseID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getBaseTreeByParentID',
            pageNo,
            pageSize,
            parentID,
            knowledgeBaseID
        }
    });
}

// 添加或修改资料库 2127
export const addKnowledgeBase = (id,staffID,staffName,baseName,relationType,relationID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addKnowledgeBase'
        },
        data:{
            id,
            staffID,
            staffName,
            baseName,
            relationType,
            relationID
        }
    });
}

// 删除资料库 2128
export const deleteKnowledgeBase = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteKnowledgeBase'
        },
        data:{
            id
        }
    });
}

// 修改资料库内容_删图片 2129
export const delKnowledgeArticleImg = (id,imgUrl) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'delKnowledgeArticleImg'
        },
        data:{
            id,
            imgUrl
        }
    });
}

// 获取用户可以看到的所有产品 1195
export const getVisiableProducts = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getVisiableProducts',
            staffID
        }
    });
}

// 根据ID获取资料库详情 1196
export const getknowledgebase = (id) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getknowledgebase',
            id
        }
    });
}

// 设置资料库权限 2130
export const setknowledgebase = (baseID,enBrowse,enModify) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'setknowledgebase'
        },
        data:{
            baseID,
            enBrowse,
            enModify
        }
    });
}

// 获取员工编号 1034
export const getStaffNum = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getStaffNum'
        }
    });
}

// 根据资料库ID得到树形结构 1304
export const getKnowledgeTree = (baseID, type) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getKnowledgeTree',
            baseID,
            type
        }
    });
}

// 添加资料库附件 2194
export const addKnowledgeAttachment = (file) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addKnowledgeAttachment'
        },
        uploadFile:{
            file:file
        }
    });
}

// 根据节点ID得到所有文章 1305
export const getArticleTreeNodeID = (pageNo,pageSize,treeNodeID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getArticleTreeNodeID',
            pageNo,
            pageSize,
            treeNodeID
        }
    });
}

// 取得所有新员工 1307
export const findAllNewStaffs = (content) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findAllNewStaffs',
            content
        }
    });
}

// 重置密码 2197
export const setPasswordOriginal = (staffID) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'setPasswordOriginal'
        },
        data:{
            staffID
        }
    });
}

//获取邮件列表
export const localMailList = (flag,staffId,searchType,searchText,pageNo,pageSize) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'localMailList',
            flag,
            staffId,
            searchType,
            searchText,
            pageNo,
            pageSize
        }
    });
}

//删除邮件
export const deleteLocalMail = (staffId,Ids) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deleteLocalMail'
        },
        data:{
            staffId,
            Ids
        }
    });
}

//标记为未读或已读
export const unReadOrReadLocalMail = (Ids,flag) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'unReadOrReadLocalMail'
        },
        data:{
            Ids,
            flag
        }
    });
}

//读邮件
export const readLocalMail = (staffId,Id,cosNum,ip) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'readLocalMail',
            staffId,
            Id,
            cosNum,
            ip
        }
    });
}

//写/回复/回复所有/转发邮件界面
export const showLocalMailInfo = (WriteType,staffId,Id,cosNum,ip) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'showLocalMailInfo',
            WriteType,
            staffId,
            Id,
            cosNum,
            ip
        }
    });
}

//发送邮件
export const sendLocalMail = ({staffId,mailAttachmentIDs,Id,Receivers,CCs,BCCs,Title,
        cbOnlyText,MailContent,FCKeditorBody,EncodingValue},files) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'sendLocalMail'
        },
        data:{
            staffId,
            mailAttachmentIDs,
            Id,
            Receivers,
            CCs,
            BCCs,
            Title,  
            cbOnlyText,
            MailContent,
            FCKeditorBody,
            EncodingValue,
        },
        uploadFile:{
            file:files
        }
    });
}

// 获取园所二维码
export const getQRPng = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getQRPng'
        }
    });
}

// 得到借款列表 1308
export const FinanceBookChargeList = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'FinanceBookChargeList',
        }
    });
}

// 得到借款详情 1309
export const FinanceBookChargeDetail = (bookChargeId) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'FinanceBookChargeDetail',
            bookChargeId,
        }
    });
}

// 查看费用统计或费用记录 1310
export const chargCheckList = (userName,type,projectid,cbChargeBill,cbBookCharge,cbNoSign) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'chargCheckList',
            userName,
            type,
            projectid,
            cbChargeBill,
            cbBookCharge,
            cbNoSign
        }
    });
}

// 设置成已还款 2199
export const setFinanceBookCharge = (ids,ReturnDate) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'setFinanceBookCharge'
        },
        data:{
            ids,
            ReturnDate
        }
    });
}

// 查询借款凭证 1311
export const bookChargeCheckList = (StartDate,EndDate,sort) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'bookChargeCheckList',
            StartDate,
            EndDate,
            sort
        }
    });
}

// 记账日期更改 2200
export const chargeDateInput = (bookChargeIDs,isNow,ChargeDate) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'chargeDateInput'
        },
        data:{
            bookChargeIDs,
            isNow,
            ChargeDate
        }
    });
}

// 凭证号录入 2201
export const addChargeNo = (bookChargeId,WarrantNumber) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addChargeNo'
        },
        data:{
            bookChargeId,
            WarrantNumber
        }
    });
}

// 查询报销凭证 1312
export const chargeCheckList = (StartDate,EndDate,sort) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'chargeCheckList',
            StartDate,
            EndDate,
            sort
        }
    });
}

// 记账日期更改（报销） 2202
export const bchargeDateInput = (chargeBillIDs,isNow,ChargeDate) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'bchargeDateInput'
        },
        data:{
            chargeBillIDs,
            isNow,
            ChargeDate
        }
    });
}

// 凭证号录入（报销）2203
export const addbChargeNo = (chargeBillId,WarrantNumber) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addbChargeNo'
        },
        data:{
            chargeBillId,
            WarrantNumber
        }
    });
}

// 获得应付款申请或签字、终止列表 ChangeFlag:1签字，2申请  1316
export const paymentChargeList = (staffId,ChangeFlag) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'paymentChargeList',
            staffId,
            ChangeFlag
        }
    });
}

// 延期支付列表 flag：1添加列表，2签字列表  1317
export const yqPaymentChargeList = (flag,staffId,belongChargeBillID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'yqPaymentChargeList',
            flag,
            staffId,
            belongChargeBillID
        }
    });
}

// 添加或修改应付款申请 state：-1添加，1修改  2209
export const addOrUpdatePaymentChargeDetail = (state,staffId,ChargeBillID,belongChargeBillID,currentMoney,Signer1,Signer2,signers,note,examineID,files) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'addOrUpdatePaymentChargeDetail'
        },
        data:{
            state,
            staffId,
            ChargeBillID,
            belongChargeBillID,
            currentMoney,
            Signer1,
            Signer2,
            signers,
            note,
            examineID
        },
        uploadFile:{
            file:files
        }
    });
}

// 获得应付款详情  1318
export const paymentChargeDetailForm = (state,fillStaffId,chargeBillId,belongChargeBillId) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'paymentChargeDetailForm',
            state,
            fillStaffId,
            chargeBillId,
            belongChargeBillId
        }
    });
}

// 删除应付款 2210
export const deletePaymentChargeDetail = (chargeBillIDs) => {
    return axios({
        urlTo:"CosApp",
        method:"post",
        params: {
            method: 'deletePaymentChargeDetail'
        },
        data:{
            chargeBillIDs
        }
    });
}

/**
 * CosCenter接口
 */

// 根据cosNum获取cos信息
export const getCosByCosNum = (cosNum) => {
    return axios({
        urlTo:"CosCenter",
        method:"get",
        params: {
            method: 'getCosByCosNum',
            cosNum,
        }
    })
}

// 获取扫码登录UUID
export const getUUID = () => {
    return axios({
        urlTo:"CosCenter",
        method:"get",
        params: {
            method: 'getUUID',
            // cosNum,
        }
    })
}

// 检查UUID是否登录
export const checkUUID = (uuid) => {
    return axios({
        urlTo:"CosCenter",
        method:"get",
        params: {
            method: 'checkUUID',
            uuid
        }
    });
}