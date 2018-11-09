export default () => {
    let officeMenu = {
        "1001": {
            router:"/calendarView",
            modulesNum:"1",
            sortNum:1
        },
        // "1002": {// 检索
        //     router:""
        // },
        "1003": {
            router:"/examineApprove",
            modulesNum:"1",
            sortNum:3
        },
        "1008": {
            router:"",
            modulesNum:"1",
            sortNum:8
        },
        // "1009": {// 签到
        //     router:""
        // },
        "1010": {
            router:"",
            modulesNum:"1",
            sortNum:10
        },
        "1011": {
            router:"/examineScore",
            modulesNum:"1",
            sortNum:11
        },
        "1012": {
            router:"/pointsScore",
            modulesNum:"1",
            sortNum:12
        },
        "1013": {
            router:"/commandTask",
            modulesNum:"1",
            sortNum:13
        },
        "1014": {
            router:"/myDatabase",
            modulesNum:"1",
            sortNum:14
        },
        "1015": {
            router:"",
            modulesNum:"1",
            sortNum:15
        },
        "1016": {
            router:"",
            modulesNum:"1",
            sortNum:16
        },
        "1022": {
            router:"",
            modulesNum:"1",
            sortNum:22
        },
        "1023": {
            router:"/goodsApplyTab",
            modulesNum:"1",
            sortNum:23
        },
        "1024": {
            router:"/goodsPurchaseTab",
            modulesNum:"1",
            sortNum:24
        },
        "1025": {
            router:"/setSchedule/examine",
            modulesNum:"1",
            sortNum:25
        },
        "1026": {
            router:"/coursePlanPerfectManage/examine",
            modulesNum:"1",
            sortNum:26
        },
        "1027": {
            router:"/coursePlanManage",
            modulesNum:"1",
            sortNum:27
        },
        "1029": {
            router:"/internalEmail",
            modulesNum:"1",
            sortNum:29
        },
        "2001": {
            router:"/staffInfo",
            modulesNum:"2",
            sortNum:1
        },
        "2011": {
            router:"/attendanceManage",
            modulesNum:"2",
            sortNum:11
        },
        "2012": {
            router:"/examineManage",
            modulesNum:"2",
            sortNum:12
        },
        "2013": {
            router:"/pointsManage",
            modulesNum:"2",
            sortNum:13
        },
        // 离职人员在员工信息中
        // "2014": {
        //     router:""
        // },
        // 审批设定在员工信息中
        // "2015": {
        //     router:""
        // },
        "2016": {
            router:"/yearHoliday",
            modulesNum:"2",
            sortNum:16
        },
        "2017": {
            router:"/desertEntry",
            modulesNum:"2",
            sortNum:17
        },
        "2018": {
            router:"",
            modulesNum:"2",
            sortNum:18
        },
        "2019": {
            router:"/examineTemplate",
            modulesNum:"2",
            sortNum:19
        },
        "2020": {
            router:"/classEvaluation",
            MenuName:"业绩评定-按班级",
            modulesNum:"2",
            sortNum:20
        },
        "2021": {
            router:"/teacherEvaluation",
            MenuName:"业绩评定-按教师",
            modulesNum:"2",
            sortNum:21
        },
        //trainingManage
        "2022":{
            router:"",
            modulesNum:"2",
            sortNum:22
        },
        "2023": {
            router:"/roleSetting",
            modulesNum:"2",
            sortNum:23
        },
        "3001": {
            router:"/expenseFind",
            modulesNum:"3",
            sortNum:1
        },
        "3002": {
            router:"/borrowFind",
            modulesNum:"3",
            sortNum:4
        },
        "3003": {
            router:"/bankAccount",
            modulesNum:"3",
            sortNum:15
        },
        "3004": {
            router:"/expensePayment",
            modulesNum:"3",
            sortNum:2
        },
        "3005": {
            router:"/borrowPayment",
            modulesNum:"3",
            sortNum:5
        },
        "3006": {
            router:"/setTuitionSubject",
            modulesNum:"3",
            sortNum:16
        },
        "3008": {
            router:"/borrowRepayment",
            modulesNum:"3",
            sortNum:7
        },
        "3009": {
            router:"/borrowCertificate",
            modulesNum:"3",
            sortNum:6
        },
        "3010": {
            router:"/expenseCertificate",
            modulesNum:"3",
            sortNum:3
        },
        "3011": {
            router:"/duePayment",
            modulesNum:"3",
            sortNum:11
        },
        "3012": {
            router:"/dueStop",
            modulesNum:"3",
            sortNum:14
        },
        "3013": {
            router:"/dueCertificate",
            modulesNum:"3",
            sortNum:13
        },
        "3014": {
            router:"/dueFind",
            modulesNum:"3",
            sortNum:8
        },
        "3015": {
            router:"/expenseAccount",
            modulesNum:"3",
            sortNum:17
        },
        "3016": {
            router:"/borrowAccount",
            modulesNum:"3",
            sortNum:18
        },
        "3017": {
            router:"/dueAccount",
            modulesNum:"3",
            sortNum:19
        },
        "4001": {
            router:"",
            modulesNum:"4",
            sortNum:1
        },
        "4002": {
            router:"",
            modulesNum:"4",
            sortNum:2
        },
        "4003": {
            router:"/orderformFind",
            modulesNum:"4",
            sortNum:3
        },
        "4004": {
            router:"",
            modulesNum:"4",
            sortNum:4
        },
        "4005": {
            router:"",
            modulesNum:"4",
            sortNum:5
        },
        "4006": {
            router:"",
            modulesNum:"4",
            sortNum:6
        },
        "5001": {
            router:"/calendarEdit",
            modulesNum:"5",
            sortNum:1
        },
        "5002": {
            router:"",
            modulesNum:"5",
            sortNum:2
        },
        "5003": {
            router:"",
            modulesNum:"5",
            sortNum:3
        },
        "5004": {
            router:"",
            modulesNum:"5",
            sortNum:4
        },
        // "5005": {
        //     router:"/receiveApply"
        // },
        // "5006": {
        //     router:"/applyExamine"
        // },
        // "5007": {
        //     router:"/applyOutstorage"
        // },
        // "5008": {
        //     router:"/applyInstorage"
        // },
        "5005": {
            router:"/applyFind",
            modulesNum:"5",
            sortNum:5
        },
        // "5010": {
        //     router:"/purchaseApply"
        // },
        // "5011": {
        //     router:"/purchaseSign"
        // },
        // "5012": {
        //     router:"/purchaseEntering"
        // },
        // "5013": {
        //     router:"/purchaseInstorage"
        // },
        "5006": {
            router:"/purchaseFind",
            modulesNum:"5",
            sortNum:6
        },
        "5008": {
            router:"/intelligentDevice",
            modulesNum:"5",
            sortNum:8
        },
        "6004": {
            router:"/classManagement",
            modulesNum:"6",
            sortNum:4
        },
        "6010": {
            router:"/noteAttendance",
            modulesNum:"6",
            sortNum:19.1
        },
        "6019": {
            router:"/childInfo",
            MenuName:"幼儿信息",
            modulesNum:"6",
            sortNum:19
        },
        "7002": {
            router:"/setSchedule",
            modulesNum:"7",
            sortNum:2
        },
        "7003": {
            router:"/coursePlanExamine",
            modulesNum:"7",
            sortNum:3
        },
        "7004": {
            router:"/coursePlanPerfectManage",
            modulesNum:"7",
            sortNum:4
        },
        "9001": {
            router:"/interestClassTeacher",
            modulesNum:"9",
            sortNum:1
        },
        "9002": {
            router:"/interestClassManage",
            modulesNum:"9",
            sortNum:2
        },  
        "9003": {
            router:"/interestClassChild",
            modulesNum:"9",
            sortNum:3
        },  
        "9004": {
            router:"/interestClassAttendance",
            modulesNum:"9",
            sortNum:4
        },  
        "9005": {
            router:"/interestClassExpense",
            modulesNum:"9",
            sortNum:5
        },  
        "9006": {
            router:"/interestClassOperation",
            modulesNum:"9",
            sortNum:6
        },  
        "9007": {
            router:"/interestClassExpense/examine",
            modulesNum:"9",
            sortNum:7
        },  
        "9008": {
            router:"/interestClassTexpend",
            modulesNum:"9",
            sortNum:8
        },
        "6002": {
            router:"/schoolInform",
            modulesNum:"8",
            sortNum:1
        },
        "6008": {
            router:"/parentschoolContact",
            MenuName:"家校联络",
            modulesNum:"8",
            sortNum:2
        },
        "6001": {
            router:"/schoolPhotoes",
            modulesNum:"8",
            sortNum:3
        },
        "6007": {
            router:"/parentschoolPhotoes",
            modulesNum:"8",
            sortNum:4
        },
        "6012": {
            router:"/childPhotoes",
            modulesNum:"8",
            sortNum:5
        },
        "6013": {
            router:"/teacherWord",
            modulesNum:"8",
            sortNum:6
        },
        
    }
    return officeMenu
}