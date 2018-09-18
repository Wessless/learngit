<template>
    <div class="teacherItem" :class="{isSelect:item.selected}">
        <div class="headTitle">{{ item.ChildName }}</div>
        <div class="title">学号：{{ item.ChildNum }}</div>
        <div class="title">所在班级:{{ item.ChildNum }}</div>
        <div class="title">兴趣班学费：{{ item.Charge }}</div>
        <div class="title">兴趣班附加费：{{ item.PlusCharge }}</div>
        <div class="title">缴费任务ID：{{ item.ChargeID }}</div>
        <div class="title" :title="item.Remark">备注：{{ item.Remark }}</div>
        <div class="title" style="color:#e51c23;">状态：{{ status }}</div>
        <div class="issueExpense" @click.stop="issueExpense" v-show="item.Status!='1'&&this.$route.meta.type!='examined'">发布</div>
        <div class="deleteExpense" @click.stop="deleteTeacher" v-show="this.$route.meta.type!='examined'">删除</div>
        <div class="changeExpense" @click.stop="changeTeacher" v-show="this.$route.meta.type!='examined'">修改</div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'InterestClassTeacherItem',
    props: {
        item:{
            type:Object
        },
    },
    data(){
        return {
            // teacherName:"张舞蹈",
            // teacherSex:"0",
            // IDnumber:"12345678912344",
            // mobilephone:"18888888888",
            // shoufeibiaozhun:"按出勤人次提成",
            // shoufeijiage:"50元/出勤人次",
            // other:"",
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
        status(){
            if(this.item.Status=="1"){
                return '未收费';
            }else{
                return '未发布';
            }
        },
    },
    watch:{
    },
    methods:{
        // 修改
        changeTeacher(){
            let ID = this.item.ID;
            this.$router.push(this.$route.fullPath+"/update/"+ID);
        },
        // 删除
        deleteTeacher(){
            this.$emit("clickDelete",this.item);
        },
        //发布
        issueExpense(){
            this.$emit("clickIssue",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .teacherItem{
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
.teacherItem{
    display: block;
    position: relative;
    justify-self: center;
    width: 94%;
    background-color: #fff;
    border-radius: 6px;
    border:1px solid #999;
    /* box-shadow: 0 4px 8px rgba(0,0,0,.12); */
    padding: 15px 10px 25px 10px;
    margin: 20px 3% 20px 3%;
}
.headTitle{
    padding-left: 10px;
    font-size:18px;
    font-weight: 500;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    text-align:center;
}
.sortblock{
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    padding:5px 0;
    height:40px;
    align-items: center;
}
.sortblock > .item{
    padding-left: 4px;
    padding-right: 8px;
    border-left: 1px solid #999;
    color: #999;

}
.sortblock > .item:nth-child(1){
    border-left: 0px solid #999;
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
.deleteExpense{
    position: absolute;
    right:13px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.changeExpense{
    position: absolute;
    right:63px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.issueExpense{
    position: absolute;
    right:113px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
</style>