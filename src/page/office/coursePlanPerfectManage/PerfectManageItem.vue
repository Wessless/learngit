<template>
    <div class="coursePlanManage" :class="{isSelect:item.selected}">
        <div class="headTitle">{{item.ThemeName}}</div>
        <div class="title">分类：{{ sort }}</div>
        <div class="title">教师：{{ item.CreaterID }}</div>
        <div class="title">ID：{{ item.ID }}</div>
        <div class="title">教学视频：{{ item.TeachVideo!=""?"有":"" }}</div>
        <div class="title">入库时间：{{ item.ThemeDataTime }}</div>
        <div class="bottomBtns">
            <div class="bottomBtn" @click.stop="delCoursePlan" v-show="$route.meta.type!='examine'">删除</div>
            <div class="bottomBtn" @click.stop="updateCoursePlan" v-show="$route.meta.type!='examine'">修改</div>
            <div class="bottomBtn" @click.stop="examineCoursePlan" v-show="$route.meta.type=='examine'">查看</div>
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
        sortArr:{
            type:Array
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
        sort(){
            for (let i = 0; i < this.sortArr.length; i++) {
                if (this.item.ThemeDataType == this.sortArr[i].ID) {
                    return this.sortArr[i].ThemeType
                }
            }
        }
    },
    watch:{
    },
    methods:{
        // 修改
        updateCoursePlan(){
            let Id = this.item.ID;
            this.$router.push(this.$route.fullPath+"/update/"+Id+"&"+this.item.ThemeDataType);
        },
        //查看
        examineCoursePlan(){
            let Id = this.item.ID;
            this.$router.push(this.$route.fullPath+"/examined/"+Id+"&"+this.item.ThemeDataType);
        },
        //删除
        delCoursePlan(){
            this.$emit("clickDelete",this.item);
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