<template>
    <div class="classManagementItem">
        <div class="headTitle">{{ item.ClassName }}</div>
        <div class="title">班级编号：{{ item.ClassNum }}</div>
        <!-- <div class="title" style="color:#FF9D00;">金额：</div> -->
        <div class="title">创建日期：{{ createDate }}</div>
        <!-- <div class="title">类别：{{ type }}</div>
        <div class="title">状态：{{ status }}</div> -->
        <div class="title" :title="item.Teacher">教师：{{ item.Teacher }}</div>
        <div class="title" :title="item.Assistant">助教：{{ item.Assistant }}</div>
        <div class="title" :title="item.Nursery">保育员：{{ item.Nursery }}</div>
        <div style="flex:1;"></div>
        <div class="bottomBtns">
            <div class="bottomBtn" v-show="item.ClassStatus=='1'" @click="classDetail">查看</div>
            <div class="bottomBtn" v-show="item.ClassStatus=='1'" @click="changeClassName">修改班级名称</div>
            <div class="bottomBtn" v-show="item.ClassStatus=='0'" @click="deleteClass">删除</div>
            <div class="bottomBtn" v-show="item.ClassStatus=='0'" @click="changeClassInfo">修改</div>
            <div class="bottomBtn" v-show="item.ClassType=='4'&&item.ClassStatus=='0'" @click="graduate">毕业</div>
            <div class="bottomBtn" v-show="item.ClassType!='4'&&item.ClassStatus=='0'" @click="changeClassType">升班</div>
        </div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'ClassManagementItem',
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
        createDate(){
            if(this.item.ClassDate){
                return this.item.ClassDate.split(" ")[0];
            }else{
                return '';
            }
        },
        type(){
            if(this.item.ClassType=="1"){
                return "托班";
            }else if(this.item.ClassType=="2"){
                return "小班";
            }else if(this.item.ClassType=="3"){
                return "中班";
            }else if(this.item.ClassType=="4"){
                return "大班";
            }
            return "";
        },
        status(){
            if(this.item.ClassStatus=="0"){
                return "进行中";
            }else if(this.item.ClassStatus=="1"){
                return "已毕业";
            }
        }
    },
    watch:{
    },
    methods:{
        changeClassInfo(){
            this.$router.push(this.$route.fullPath+"/update/"+this.item.ID);
        },
        changeClassName(){
            this.$emit("changeClassName",this.item);
        },
        deleteClass(){
            this.$emit("clickDelete",this.item);
        },
        changeClassType(){
            this.$emit("changeClassType",this.item);
        },
        graduate(){
            this.$emit("graduate",this.item);
        },
        classDetail(){
            this.$router.push(this.$route.fullPath+"/detail/"+this.item.ID);
        },
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
    display: flex;
    flex-direction: column;
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
}.bottomBtns{
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
</style>