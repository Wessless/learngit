<template>
    <div class="classManagementItem">
        <div class="headTitle">{{ item.ClassName }}</div>
        <div class="title">班级识别号：{{ item.ClassNum }}</div>
        <!-- <div class="title" style="color:#FF9D00;">金额：</div> -->
        <div class="title">创建日期：{{ createDate }}</div>
        <div class="title">类别：{{ type }}</div>
        <div class="title">状态：{{ status }}</div>
        <div class="title">教师：张大三、张大三、张大三、张大三、张大三、张大三、张大三、张大三</div>
        <div class="title">助教：张大三、张大三、张大三、张大三、张大三、张大三、张大三、张大三</div>
        <div class="title">保育员：张大三、张大三、张大三、张大三、张大三、张大三、张大三、张大三</div>
        <div class="detail">修改</div>
        <div class="giveMoney"></div>
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
        // paymoney(){
        //     this.$emit("clickPayMoney",this.item);
        // },
        // showDetail(){
        //     let expenseID = this.item.ChargeBillID;
        //     this.$router.push(this.$route.fullPath+"/"+expenseID);
        // }
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
</style>