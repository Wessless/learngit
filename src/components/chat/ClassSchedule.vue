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
                    @click="item.status==1?handleChangeCurday(item.date):false"
                >
                    <div 
                        class="date-num"
                        :style="{color: item.Flag == 'BLACK'?'':'#e51c23'}"
                    >{{item.status==1 ? item.date.split('-')[2] : '&nbsp;'}}</div>
                    <el-popover
                        width="140"
                        placement="auto-end"
                        trigger="hover">
                        <div v-for="(lessonItem , index) in item.lesson" :key="index">{{lessonItem.ClassName}}<br>{{lessonItem.ClassFrom}}-{{lessonItem.ClassTo}}</div>
                        <div class="lessonData" slot="reference" v-show="item.lesson!=''&&item.status==1">
                            <p v-for="(lessonItem , index) in item.lesson" :key="index">
                            {{lessonItem.ClassName}}<br>{{lessonItem.ClassFrom}}-{{lessonItem.ClassTo}}
                            <span v-show="index=='1'">...</span>
                            </p>
                        </div>
                    </el-popover>
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
            // lessonData:[
            //     {
            //         CalendarDate:"2018-08-03",
            //         CalendarTime:[
            //             {
            //                 ClassName:"语文文文文文",
            //                 ClassFrom:"13:00",
            //                 ClassTo:"14:00"
            //             },
            //             {
            //                 ClassName:"数学学学学学",
            //                 ClassFrom:"15:00",
            //                 ClassTo:"16:00"
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
        lessonData: {
            type: Array,
            default : ""
        },
        clickName:{
            type:String,
            default:""
        },
        changeName:{
            type:String,
            default:""
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
                    lesson:[],
                    Flag:""
                }
                this.lessonData.forEach((event) => {
                    if (this.isEqualDateStr(event.CalendarDate, tempItem.date)) {
                        tempItem.lesson = tempItem.lesson.concat(event.CalendarTime)
                        tempItem.Flag = event.Flag
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
        handleChangeCurday(clickDate){
            this.$emit(this.clickName,clickDate);
        },
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
    padding-bottom: 10px;
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
    cursor: default;
    height: 100px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    border: 0.5px solid #dddddd;
    /* white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: none; */
    /* overflow: hidden; */
}
.cal-wrapper .cal-body .dates .thisMonth{
    cursor: pointer;
}
/* .cal-wrapper .cal-body .dates .thisMonth:hover{
    background: #38ADFF;
} */
.cal-wrapper .cal-body .dates .today{
    background: #90EE90;
}
.cal-wrapper .cal-body .dates .item .lessonData{
    max-height: 70px;
    /* white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: none; */
    overflow: hidden;
}
.cal-wrapper .cal-body .dates .item .lessonData p{
    margin-bottom: 5px;
    font-size: 15px;
    font-weight: normal;
    line-height: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: none;
    overflow: hidden;
}
</style>