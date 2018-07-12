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
export const findAllStaffs = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findAllStaffs'
        }
    });
}

// 获取所有离职员工
export const findAllRetiredStaffs = () => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'findAllRetiredStaffs'
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
export const geFileByTreeID = (pageNo,pageSize,staffID,treeID,fileName,connectStaffID) => {
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
            connectStaffID
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
export const getBookCharge = (pageNo,pageSize,staffID,startID,endID,fillDateFrom,fillDateTo,chargeDateFrom,chargeDateTo,payDateFrom,payDateTo ,hasInvoice,payType,departmentID,fillStaffID,status,bankAccountID,outBillType,outBillID,includeProject) => {
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
export const getChildsByClassID = (classID) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getChildsByClassID',
            classID
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

// 获取不同状态的班级
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

/**
 * 根据specialFeeType获得缴费科目
 * @param specialFeeType 
 * MEAL_FEE：餐费,
 * TUITION：保育费,
 * TUITION_REFUND：保育费退费,
 * MEAL_FEE_REFUND：餐费退费
 */
export const getPaymentsByType = (specialFeeType) => {
    return axios({
        urlTo:"CosApp",
        method:"get",
        params: {
            method: 'getPaymentsByType',
            specialFeeType
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