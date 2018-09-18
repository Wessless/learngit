<template>
    <div class="coursePlanManage" :class="{isSelect:item.selected}">
        <div class="headTitle">{{item.ThemeName}}</div>
        <div class="title">教师：{{ item.ID }}</div>
        <div class="title">ID：{{ item.ID }}</div>
        <div class="title">课件：{{ item.ID }}</div>
        <div class="title">教学要点：{{ item.ThemePoint!=""?"有":"" }}</div>
        <div class="title">家长指南：{{ item.ParentGuide!=""?"有":"" }}</div>
        <div class="bottomBtns">
            <div class="bottomBtn" @click.stop="instorageCoursePlan">放入主题库</div>
            <div class="bottomBtn" @click.stop="approverCoursePlan">审批</div>
            <div class="bottomBtn" @click.stop="examineCoursePlan">查看</div>
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
    },
    watch:{
    },
    methods:{
        // 审批
        approverCoursePlan(){
            let Id = this.item.ID;
            this.$router.push(this.$route.fullPath+"/approver/"+Id);
        },
        //放入主题库
        instorageCoursePlan(){
            this.$emit("clickInstorage",this.item);
        },
        //查看
        examineCoursePlan(){
            let Id = this.item.ID;
            this.$router.push(this.$route.fullPath+"/examineApprover/"+Id);
        },
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