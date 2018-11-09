<template>
    <div class="interestClass" :class="{isSelect:item.selected}">
        <div class="headTitle">{{ item.ClassName }}</div>
        <div class="title">每节课收费标准：{{ item.EachClassPay }}</div>
        <div class="title">每节课课时费标准：{{ item.EachHourPay }}</div>
        <div class="title">预定任课教师：{{ item.ExternalTeacherID }}</div>
        <div class="title">预定跟班教师：{{ item.FollowTeacher }}</div>
        <div class="title">开始时间：{{ item.BeginDate }}</div>
        <div class="title">结束时间：{{ item.EndDate=='1900-01-01 00:00:00'?'':item.EndDate }}</div>
        <div class="title">课程表：
            <label class="edit" @click.stop="editSchedule">编辑</label>
        </div>
        <div class="bottomBtns">
            <div class="bottomBtn" @click.stop="deleteClass">删除</div>
            <div class="bottomBtn" @click.stop="changeClass">修改</div>
            <div class="bottomBtn" v-show="item.EndDate==''||item.EndDate=='1900-01-01 00:00:00'" @click.stop="changeEnd">标记为结束</div>
        </div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'InterestClassManageItem',
    props: {
        item:{
            type:Object
        },
    },
    data(){
        return {
            // className:"小小主持人",
            // tuition:"100",
            // keshishoufeibiaozhun:"100",
            // teacherName:"张舞蹈",
            // AttendantName:"陆云",
            // startTime:"2015-10-01",
            // endTime:"2015-11-30",
        }
    },
    components:{
    },
    mounted(){
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    watch:{
    },
    methods:{
        //编辑课程表
        editSchedule(){
            let classID = this.item.ID
            this.$router.push(this.$route.fullPath+"/edit/"+classID);
        },
        // 修改
        changeClass(){
            let classID = this.item.ID
            this.$router.push(this.$route.fullPath+"/update/"+classID);
        },
        // 删除
        deleteClass(){
            this.$emit("clickDelete",this.item);
        },
        //标记未结束
        changeEnd(){
            this.$emit("clickEnd",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .interestClass{
    display: block;
    position: relative;
    width:310px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 5px 10px 10px 10px;
    margin-right: 20px;
    margin-bottom: 20px;
    border:1px solid #ffffff;
} */
.interestClass{
    display: block;
    position: relative;
    justify-self: center;
    width: 94%;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 5px 10px 10px 10px;
    margin-right: 3%;
    margin-left: 3%;
    margin-bottom: 20px; 
    border:1px solid #ffffff;
}
.headTitle{
    font-size:20px;
    font-weight: 500;
}
.title{
    /* width:49%; */
    display: block;
    color: #999999;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.edit{
    color: #38adff;
    font-weight: normal;
    cursor: pointer;
}
.bottomBtns{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    height: 10px;
    transform: translateY(-5px);
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
</style>