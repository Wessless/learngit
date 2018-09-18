<template>
    <div class="teacherItem" :class="{isSelect:item.selected}">
        <div class="headTitle">
            {{ item.TeacherName }}
            <span class="sex iconfont" v-if="sex=='1'" style="color:#f817a6">&#xe72c;</span>
            <span class="sex iconfont" v-if="sex=='0'" style="color:#38adff">&#xe72b;</span>
        </div>
        <div class="title">身份证号：{{ item.TeacherIdentityNo }}</div>
        <div class="title">手机号：{{ item.TeacherPhoneNum }}</div>
        <div class="title">收费价格：{{ item.TeacherPay }}</div>
        <div class="title">课时收费标准：{{ item.TeacherPayWay }}</div>
        <div class="title">其他：{{ item.Remark }}</div>
        <div class="deleteTeacher" @click.stop="deleteTeacher">删除</div>
        <div class="changeTeacher" @click.stop="changeTeacher">修改</div>
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
        sex(){
            if(this.item.TeacherSex=="男"){
                // return "男";
                return '0';
            }else{
                // return "女";
                return '1';
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
    margin-bottom: 5px;
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
.deleteTeacher{
    position: absolute;
    right:13px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.changeTeacher{
    position: absolute;
    right:63px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.sex{
    padding-left:5px;
    font-size:20px;
}
.moneyIcon{
    padding-right:5px;
}
.personIcon{
    padding-right: 5px;
}
.selected{
    color: #38adff;
}
.isSelect{
    border-color: #38adff !important;
}
</style>