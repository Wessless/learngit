<template>
    <div class="cal-wrapper">
        <div class="cal-header">
            <div class="l" @click="preMonth"><div class="arrow-left icon">&nbsp;</div></div>
            <div class="title">{{curYear+'年'+curMonth+'月'}}</div>
            <div class="r" @click="nextMonth"><div class="arrow-right icon">&nbsp;</div></div>
        </div>
        <div class="cal-body">
            <div class="weeks">
                <span
                v-for="dayName in weekNames"
                class="item"
                :key="dayName"
                >
                {{dayName}}
                </span>
            </div>
            <div class="dates" >
                <div 
                    v-for="item in dayList"
                    class="item"
                    :class="[{
                        today: item.status==1 ? (today == item.date) : false,
                        thisMonth: item.status==1 ? true : false,
                    }]"
                    :key="item.date"
                >
                    <div 
                        class="date-num"
                        :style="{color: item.Flag == 'BLACK'?'':'#e51c23'}"
                    >{{item.status==1 ? item.date.split('-')[2] : '&nbsp;'}}</div>
                    <!-- <div v-for="(justifyItem , index) in item.attData" :key="index">
                        {{justifyItem.ClassName}}<br>{{justifyItem.ClassFrom}}{{justifyItem.ClassTo}}
                    </div> -->
                    <div class="date-data" v-for="(justifyItem , index) in item.attData" v-show="item.attData.length!=0" :key="index">
                        <span style="font-size:12px;display:block;" v-show="justifyItem.NGMsg!=''">{{justifyItem.NGMsg}}</span>
                        <span style="color:#38ADFF;font-size:12px;display:block;">
                            {{justifyItem.JustifyMsg}}
                            <b class="apBtn iconfont" 
                                    :style="{color: justifyItem.JustifyButton == 'Y'?'':'#8f8f94'}" 
                                    v-show="justifyItem.JustifyButton!='N'"
                                    @click="item.status==1?APchangeCurday(item.date,justifyItem):false">
                                    &#xe69e;
                            </b>
                        </span>
                    </div>
                    <div v-show="item.PlusButton=='Y'" @click="item.status==1?ADchangeCurday(item.date,item.attData):false" class="addBtn iconfont">&#xe6b9;</div>
                    <!-- <el-popover
                        width="140"
                        placement="auto-end"
                        trigger="hover">
                        <div class="attendanceData" slot="reference" v-show="item.attData!=''&&item.status==1">
                            <p v-for="(justifyItem , index) in item.attData" :key="index">
                            {{justifyItem.ClassName}}<br>{{justifyItem.ClassFrom}}{{justifyItem.ClassTo}}
                            <span v-show="index=='1'">...</span>
                            </p>
                        </div>
                    </el-popover> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default { 
    name: 'ClassSchedule',
    data(){
        return {
            weekNames: ["日", "一", "二", "三", "四", "五", "六"],
            // curYear : "",
            // curMonth : "",
            // attendanceData:[
            //     {
            //         AttDate:"2018-08-03",
            //         FirstPunchTime:"13:00",
            //         LastPunchTime:"14:00",
            //         Justify:[
            //             {
            //                 NGMsg:"早退480分钟",
            //                 JustifyID: "-1",
            //                 JustifyMsg: "甘愿受罚",
            //                 JustifyButton: "",
            //                 JustifyStatus: "-1",
            //                 JustifyType: ""
            //             },
            //         ]
            //     }
            // ]
        }
    },
    props: {
        curYear: {
            type: Number,
            default : new Date().getFullYear()
        },
        curMonth: {
            type: Number,
            default : new Date().getMonth()+1
        },
        attendanceData: {
            type: Array,
            default : ""
        },
        clickName1:{
            type:String,
            default:""
        },
        clickName2:{
            type:String,
            default:""
        },
        changeName:{
            type:String,
            default:""
        },
        red:{
            type:Object
        }
    },
    computed: {
        dayList () {
            let firstDay = new Date(this.curYear, this.curMonth-1, 1)
            let dayOfWeek = firstDay.getDay()
            let startDate = new Date(firstDay)
            startDate.setDate(firstDay.getDate() - dayOfWeek)
            let item, tempArr = [], tempItem;
            for (let i = 0 ;  i < 42 ; i++) {
                item = new Date(startDate);
                item.setDate(startDate.getDate() + i);
                if (this.curMonth-1 === item.getMonth()) {
                    status = 1
                } else {
                    status = 0
                }
                tempItem = {
                    date: `${item.getFullYear()}-${item.getMonth()+1}-${item.getDate()}`,
                    status: status,
                    attData:[],
                    Flag: this.red[`${item.getFullYear()}-${item.getMonth()+1}-${item.getDate()}`]?'RED':'BLACK',
                    PlusButton:"",
                }
                this.attendanceData.forEach((event) => {
                    if (this.isEqualDateStr(event.AttDate, tempItem.date)) {
                        tempItem.attData = tempItem.attData.concat(event.Justify);
                        tempItem.PlusButton = event.PlusButton;
                    }
                })
                tempArr.push(tempItem)
                if(tempArr.length == 36&&status == 0){
                    tempArr.pop();
                    break;
                }
            }
            return tempArr
        },
        today(){
            let dateObj = new Date()
            return `${dateObj.getFullYear()}-${dateObj.getMonth()+1}-${dateObj.getDate()}`
        },
    },
    methods:{
        preMonth(){
            let curMonth = this.curMonth;
            let curYear = this.curYear;
            curMonth--;
            if(curMonth < 1){
                curMonth = 12;
                curYear--;
            } 
            if (curMonth >= 0 && curMonth <= 9) {
                curMonth = "0" + curMonth;
            }
            let curYearMonth = curYear + "-" + curMonth;
            this.$emit(this.changeName,curYear,curMonth,curYearMonth);
        },
        nextMonth(){
            let curMonth = this.curMonth;
            let curYear = this.curYear;
            curMonth++;
            if(curMonth > 12){
                curMonth = 1;
                curYear++;
            }
            if (curMonth >= 0 && curMonth <= 9) {
                curMonth = "0" + curMonth;
            }
            let curYearMonth = curYear + "-" + curMonth;
            this.$emit(this.changeName,curYear,curMonth,curYearMonth);
        },
        isEqualDateStr (dateStr1, dateStr2) {
            let dateArr1 = dateStr1.split('-')
            let dateArr2 = dateStr2.split('-')
            if (parseInt(dateArr1[0], 10) !== parseInt(dateArr2[0], 10)) {
                return false
            }
            if (parseInt(dateArr1[1], 10) !== parseInt(dateArr2[1], 10)) {
                return false
            }
            if (parseInt(dateArr1[2], 10) !== parseInt(dateArr2[2], 10)) {
                return false
            }
            return true
        },
        ADchangeCurday(clickDate,Justify){
            let dateStr,NGtypes;
            for (let i = 0; i < Justify.length; i++) {
                NGtypes = NGtypes?NGtypes + Justify[i].NGType+",":Justify[i].NGType+",";
            }
            let dateArr = clickDate.split("-");
            if (dateArr[1] >= 1 && dateArr[1] <= 9) {
                dateArr[1] = "0" + dateArr[1];
            }
            if (dateArr[2] >= 0 && dateArr[2] <= 9) {
                dateArr[2] = "0" + dateArr[2];
            }
            dateStr = dateArr.join("-");
            this.$emit(this.clickName1,dateStr,NGtypes);
        },
        APchangeCurday(clickDate,justifyItem){
            let dateStr;
            let dateArr = clickDate.split("-");
            if (dateArr[1] >= 1 && dateArr[1] <= 9) {
                dateArr[1] = "0" + dateArr[1];
            }
            if (dateArr[2] >= 0 && dateArr[2] <= 9) {
                dateArr[2] = "0" + dateArr[2];
            }
            dateStr = dateArr.join("-");
            this.$emit(this.clickName2,dateStr,justifyItem);
        }
    },
    mounted() {
        
    },
    watch:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

@media screen and (min-width: 768px){
    .cal-wrapper{
        width: 100%;
        background-color: #ffffff;
        /* background: #aaa; */
    }
}

@media screen and (max-width: 767px) {
    .cal-wrapper{ 
        width: 100%;
        background-color: #ffffff;
        /* background: rgb(167, 179, 134); */
    }
}
.cal-wrapper .cal-header {
    position: relative;
    width: 100%;
    font-weight: 500;
    overflow: hidden;
    font-size: 20px;
    border-left: 2px solid #dddddd;
    border-right: 2px solid #dddddd;
    border-top: 2px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    
}
.cal-wrapper .cal-header .l {
    text-align: left;
    width: 20%;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.arrow-left.icon {
    color: #000;
    position: absolute;
    left: 6%;
    margin-top: 10px;
}
.arrow-left.icon:before {
    content: '';
    position: absolute;
    left: 1px;
    top: -5px;
    width: 10px;
    height: 10px;
    border-top: solid 1px currentColor;
    border-right: solid 1px currentColor;
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
}
.cal-wrapper .cal-header .r {
    text-align: right;
    width: 20%;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.arrow-right.icon {
    color: #000;
    position: absolute;
    right: 6%;
    margin-top: 10px;
}
.arrow-right.icon:before {
    content: '';
    position: absolute;
    right: 1px;
    top: -5px;
    width: 10px;
    height: 10px;
    border-top: solid 1px currentColor;
    border-right: solid 1px currentColor;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
}
.cal-wrapper .cal-header .title {
    width: 60%;
    text-align: center;
}
.cal-wrapper .cal-header > div {
    float: left;
    line-height: 20px;
    padding: 15px;
}
.cal-wrapper .cal-body {
    width: 100%;
}
.cal-wrapper .cal-body .weeks {
    width: 100%;
    overflow: hidden;
    text-align: center;
    background: #38ADFF;
    font-size: 16px;
    border-left: 0.5px solid #dddddd;
    border-right: 0.5px solid #dddddd;
}
.cal-wrapper .cal-body .weeks .item {
    line-height: 50px;
    float: left;
    width: 14.285%;
    border: 0.5px solid #dddddd;
    color: #ffffff;
}
.cal-wrapper .cal-body .dates {
    width: 100%;
    overflow: hidden;
    font-size: 16px;
    border-left: 0.5px solid #dddddd;
    border-right: 0.5px solid #dddddd;
    border-bottom: 0.5px solid #dddddd;
}
.cal-wrapper .cal-body .dates .item {
    position: relative;
    float: left;
    display: block;
    width: 14.285%;
    height: 110px;
    cursor: default;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    border: 0.5px solid #dddddd;
    /* white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: none; */
    /* overflow: hidden; */
}
.cal-wrapper .cal-body .dates .item .date-num{
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: 60px;
    line-height: 110px;
    text-align: center;
    opacity: 0.1;
    z-index: 1;
    user-select: none;
}
/* .cal-wrapper .cal-body .dates .thisMonth{
    cursor: pointer;
} */
/* .cal-wrapper .cal-body .dates .thisMonth:hover{
    background: #38ADFF;
} */
/* .cal-wrapper .cal-body .dates .today{
    background: #90EE90;
} */
.cal-wrapper .cal-body .dates .item .attendanceData{
    max-height: 70px;
    /* white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: none; */
    overflow: hidden;
}
.cal-wrapper .cal-body .dates .item .attendanceData p{
    margin-bottom: 5px;
    font-size: 15px;
    font-weight: normal;
    line-height: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: none;
    overflow: hidden;
}
.cal-wrapper .cal-body .dates .item .date-data{
    position: relative;
    z-index: 3;
}
.addBtn{
    position: relative;
    text-align: center;
    width: 18px;
    height: 18px;
    font-size: 14px;
    line-height: 16px;
    color:#38ADFF;
    border-radius: 50%;
    border: 1px solid #38ADFF;
    cursor: pointer; 
    z-index: 8;
    user-select: none;
}
.apBtn{
    position: absolute;
    right: 2px;
    text-align: center;
    width: 18px;
    height: 18px;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer; 
    z-index: 8;
    font-weight: normal;
    user-select: none;
}
</style>