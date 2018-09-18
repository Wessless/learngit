<template>
    <div class="cal-wrapper">
        <div class="cal-header">
            <div class="l" @click="preMonth"><div class="arrow-left icon">&nbsp;</div></div>
            <div class="title">{{curYearMonth}}</div>
            <div class="r" @click="nextMonth"><div class="arrow-right icon">&nbsp;</div></div>
        </div>
        <div class="cal-body">
            <div class="weeks">
                <span class="item" v-for="(dayName, dayIndex) in dayNames" :key="dayIndex">
                    {{dayNames[(dayIndex + options.weekStartOn) % 7]}}
                </span>
            </div>
            <div class="dates">
                <div v-for="date in dayList" :key="date.date" class="item" :class="{hoverGrayBg:date.status?true:false}" @click="clickDate(date)">
                    <p class="date-num" :class="{isRed:date.isRed}">
                        {{date.status ? date.date.split('/')[2] : '&nbsp;'}}
                    </p>
                    <span v-if="date.status ? (today == date.date) : false" class="is-today" ></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {dateTimeFormatter} from '@/config/utils'
export default { 
    name: 'Calendar',
    props: {
        calendar:{
            type:Object
        },
        red:{
            type:Object
        }
    },
    data() {
        return {
            options:{
                weekStartOn:0,//显示是从从周几开始
            },
            dayNames:["日", "一", "二", "三", "四", "五", "六"]
        }
    },
    mounted() {
    },
    computed:{
        dayList () {
            let firstDay = new Date(this.calendar.params.curYear, this.calendar.params.curMonth, 1);
            let dayOfWeek = firstDay.getDay();
            // 根据当前日期计算偏移量 // Calculate the offset based on the current date
            if (this.options.weekStartOn > dayOfWeek) {
                dayOfWeek = dayOfWeek - this.options.weekStartOn + 7;
            } else {
                dayOfWeek = dayOfWeek - this.options.weekStartOn;
            }

            let startDate = new Date(firstDay);
            startDate.setDate(firstDay.getDate() - dayOfWeek);
            // 计算显示多少天
            let endDate = new Date(firstDay);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(endDate.getDate() - 1);
            let length = endDate.getDate()+dayOfWeek;

            let item, status, tempArr = [], tempItem
            for (let i = 0 ; i < length ; i++) {
                item = new Date(startDate);
                item.setDate(startDate.getDate() + i);

                if (this.calendar.params.curMonth === item.getMonth()) {
                    status = 1
                } else {
                    status = 0
                }
                tempItem = {
                    date: `${item.getFullYear()}/${item.getMonth()+1}/${item.getDate()}`,
                    isRed: this.red[`${item.getFullYear()}/${item.getMonth()+1}/${item.getDate()}`]?true:false,
                    status: status,
                    customClass: []
                }
                // this.events.forEach((event) => {
                //     if (isEqualDateStr(event.date, tempItem.date)) {
                //         tempItem.title = event.title
                //         tempItem.desc = event.desc || ''
                //         if (event.customClass) tempItem.customClass.push(event.customClass)
                //     }
                // })
                tempArr.push(tempItem)
            }
            return tempArr
        },
        today () {
            let dateObj = new Date()
            return `${dateObj.getFullYear()}/${dateObj.getMonth()+1}/${dateObj.getDate()}`
        },
        curYearMonth () {
            let tempDate = new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth+1}/01`)
            // return tempDate.getFullYear()+"年"+(tempDate.getMonth()+1)+"月";
            // let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth+1}/01`))
            return dateTimeFormatter(tempDate, "yyyy年MM月")
        }
    },
    watch:{
        
    },
    methods:{
        nextMonth () {
            // this.$EventCalendar.nextMonth()
            this.$emit('month-changed', 1)
        },
        preMonth () {
            this.$emit('month-changed', -1)
            // this.$EventCalendar.preMonth()
            // this.$emit('month-changed', this.curYearMonth)
        },
        clickDate (date) {
            if(date.status==1){
                this.$emit('clickDate', date)
            }
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
*{
    box-sizing: border-box;
}
.cal-wrapper{
    width: 100%;
    min-width: 300px;
    background-color: #ffffff;
}
.cal-header{
    position: relative;
    width: 100%;
    
    font-weight: 500;
    overflow: hidden;
    padding-bottom: 10px;
}
.cal-wrapper .cal-header > div{
    float: left;
    line-height: 20px;
    padding: 15px;
}
.cal-wrapper .cal-header .title{
    width: 60%;
    text-align: center;
    font-size: 16px;
}
.cal-wrapper .cal-header .l{
    text-align: left;
    width: 20%;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.cal-wrapper .cal-header .r{
    text-align: right;
    width: 20%;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.cal-wrapper .arrow-left.icon{
    color: #000;
    position: absolute;
    left: 6%;
    margin-top: 10px;
}
.cal-wrapper .arrow-left.icon:before{
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
.cal-wrapper .arrow-right.icon{
    color: #000;
    position: absolute;
    right: 6%;
    margin-top: 10px;
}
.cal-wrapper .arrow-right.icon:before{
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
.cal-wrapper .cal-body{
    width: 100%;
}
.cal-wrapper .cal-body .weeks{
    width: 100%;
    overflow: hidden;
    text-align: center;
    font-size: 16px;
}
.cal-wrapper .cal-body .weeks .item{
    float: left;
    width: 14.285%;
    font-size: 16px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.cal-wrapper .cal-body .dates{
    width: 100%;
    overflow: hidden;
    text-align: center;
    font-size: 16px;
}
.cal-wrapper .cal-body .dates .item{
    position: relative;
    float: left;
    display: block;
    width: 14.285%;
    cursor: default;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.cal-wrapper .cal-body .dates .item .date-num{
    position: relative;
    z-index: 3;
}
/* .is-today{
    content: '';
    background-color: #38adff;
    border-radius: 50%;
    opacity: .8;
    width: 12px;
    height: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2;
    margin-left: -6px;
    margin-top: 8px;
} */
.is-today{
    content: '';
    border: 1px solid #38adff;
    /* background-color: #fff; */
    border-radius: 50%;
    width: 44px;
    height: 44px;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
}
.isRed{
    color:red !important;
}
/* .hoverGrayBg:hover{
    background: #eeeeee;
} */
</style>