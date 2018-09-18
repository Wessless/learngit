<template>
    <div class="classManagementItem">
        <div class="headTitle">{{ item.ClassName }}</div>
        <div class="title">班级编号：{{ item.ClassNum }}</div>
        <div class="title">班级定员：{{ item.ClassSetNum }}</div>
        <div class="title" :title="item.TName">主班：{{ item.TName }}</div>
        <div class="title" :title="item.HName">配班：{{ item.HName }}</div>
        <div class="title" :title="item.NName">保育员：{{ item.NName }}</div>
        <div class="title">月出勤：<span class="clickColor" @click="monthAttendance">{{ item.MonthAtt }}人次</span></div>
        <div class="title">2.5岁以下出勤：<span class="clickColor" @click="childAttendance">{{ item.BabyAtt }}人次</span></div>
        <!-- <div class="bottomBtns">
            <div class="bottomBtn" @click="deleteClass">删除</div>
            <div class="bottomBtn" @click="changeClassInfo">修改</div>
            <div class="bottomBtn" @click="graduate">毕业</div>
            <div class="bottomBtn" @click="changeClassType">升班</div>
        </div> -->
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'ClassEvaluationItem',
    props: {
        item:{
            type:Object
        }
    },
    data(){
        return {
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
        monthAttendance(){
            this.$emit("monthAttendance",this.item);
        },
        childAttendance(){
            this.$emit("childAttendance",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .classManagementItem{
    display: block;
    position: relative;
    width:310px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 10px;
    margin-right: 20px;
    margin-bottom: 20px;
} */
.classManagementItem{
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
.createDate{
    font-size: 14px;
    color: #999999;
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
.detail{
    position: absolute;
    right:30px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.giveMoney{
    position: absolute;
    right:80px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.bottomBtns{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    margin-top:5px;
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
.clickColor{
    color: #38adff;
    cursor: pointer;
}
</style>