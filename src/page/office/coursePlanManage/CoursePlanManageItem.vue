<template>
    <div class="coursePlanManage" :class="{isSelect:item.selected}">
        <div class="headTitle">{{item.CourseName}}</div>
        <div class="title">日期：{{ item.CourseDate }}</div>
        <div class="title">时间段：{{ time }}</div>
        <div class="title">班级名称：{{ item.ClassName }}</div>
        <div class="title">教学主题：{{ item.ThemeName }}</div>
        <div class="title">教学要点：{{ item.ThemePoint }}</div>
        <div class="title">家长指南：{{ item.ParentGuide }}</div>
        <div class="bottomBtns">
            <div class="bottomBtn" @click.stop="submitCoursePlan" v-show="item.UploadTime=='提交'">提交</div>
            <div class="bottomBtn" @click.stop="examineCoursePlan" v-show="item.UploadTime=='再提交;查看'">查看</div>
            <div class="bottomBtn" @click.stop="resubmitCoursePlan" v-show="item.UploadTime=='再提交;查看'">再提交</div>
        </div>
        <div class="bottomBtns">
            <div class="bottomBtn" @click.stop="clearCourseTheme">清空教学主题</div>
            <div class="bottomBtn" @click.stop="editCourseTheme" >编辑教学主题</div>
        </div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'CoursePlanManageItem',
    props: {
        item:{
            type:Object
        },
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
        time(){
            let timeFrom = this.item.CourseFrom.split(" ")[1];
            let timeTo = this.item.CourseTo.split(" ")[1];
            return timeFrom.substring(0,5) + '-' + timeTo.substring(0,5);
        }
    },
    watch:{
    },
    methods:{
        // 提交
        submitCoursePlan(){
            this.$emit("clickSubmit",this.item);
        },
        resubmitCoursePlan(){
            this.$emit("clickReSubmit",this.item);
        },
        //查看
        examineCoursePlan(){
            let Id = this.item.ID;
            this.$router.push(this.$route.fullPath+"/examine/"+Id);
        },
        //编辑教学主题
        editCourseTheme(){
            // this.$router.push(this.$route.fullPath+"/edit/"+Id);
            this.$emit("clickEdit",this.item);
        },
        //清空教学主题
        clearCourseTheme(){
            this.$emit("clickClear",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .coursePlanManage{
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
.coursePlanManage{
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
    transform: translateY(-10px);
    margin-top: 10px;
}
.bottomBtn{
    margin-left:14px;
    color: #38adff;
    cursor: pointer;
}
</style>