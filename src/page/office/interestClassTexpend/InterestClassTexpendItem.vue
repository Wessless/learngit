<template>
    <div class="interestClass">
        <div class="headTitle">第{{ index+1 }}回</div>
        <div class="title">教师姓名：{{ item.TeacherName }}</div>
        <div class="title">计费开始日期：{{ item.StartDate.split(" ")[0] }}</div>
        <div class="title">计费截止日期：{{ item.EndDate=="1900-01-01"?"":item.EndDate.split(" ")[0] }}</div>
        <div class="title">课时费方式：{{ item.TeacherPayWay }}</div>
        <div class="title">课时费单价：{{ item.TeacherPrice }}</div>
        <div class="title">教师考勤：{{ item.StrAttend }}</div>
        <div class="title">本次应发合计：{{ item.Pay }}</div>
        <div class="bottomBtns">
            <div class="bottomBtn" @click.stop="delTeacherExpend" v-show="item.status=='删除'">删除</div>
            <div class="bottomBtn" @click.stop="countTeacherExpend" v-show="item.status=='计算'">计算</div>
            <div class="bottomBtn" @click.stop="examineExpend" v-show="item.ID!='-1'">查看详情</div>
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
        index:{
            type:Number
        }
    },
    data(){
        return {
            empty:"",
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
        // 删除
        delTeacherExpend(){
            this.$emit("clickDelete",this.item);
        },
        //计算
        countTeacherExpend(){
            this.$emit("clickCount",this.item);
        },
        examineExpend(){
            this.$router.push(this.$route.fullPath+"/examine/"+this.index+'&'+this.item.InterestClassID);
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
    height: 15px;
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
</style>