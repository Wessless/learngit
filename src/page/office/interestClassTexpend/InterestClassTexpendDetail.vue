<template>
    <div class="interestClassTeacherDetail">
        <chat-header :showBack="true" :title="title"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="教师姓名" :disabled="true">
                <el-input v-model="form.TeacherName" :disabled="true" size="small" style="width:400px;" placeholder="空"></el-input>
            </el-form-item>
            <el-form-item label="课时费方式">
                <el-input v-model="form.TeacherPayWay" :disabled="true" size="small" style="width:400px;" placeholder="空"></el-input>
            </el-form-item>
            <el-form-item label="课时费单价">
                <el-input v-model="form.TeacherPrice" :disabled="true" size="small" style="width:400px;" placeholder="空"></el-input>
            </el-form-item>
            <el-form-item label="计费开始日期">
                <el-input v-model="form.StartDate" :disabled="true" size="small" style="width:400px;" placeholder="空"></el-input>
            </el-form-item>
            <el-form-item label="计费截止日期">
                <el-input v-model="form.EndDate" :disabled="true" size="small" style="width:400px;" placeholder="空"></el-input>
            </el-form-item>
            <el-form-item label="本次应发合计">
                <el-input v-model="form.Pay" size="small" :disabled="true" style="width:400px;" placeholder="空"></el-input>
            </el-form-item>
            <el-form-item label="教师考勤" style="margin-top:5px;">
                <el-input v-model="form.StrAttend" size="small" type="textarea" :rows="4" style="width:400px;" readonly="readonly" placeholder="空"></el-input>
            </el-form-item> 
        </el-form>
    </div>
</template>

<script>

import { getChargeTeacher } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'InterestClassTeacherDetail',
    data(){
        return {
            title:"教师支出详情",
            form: {
                TeacherName:"",
                StartDate:"",
                EndDate:"",
                TeacherPrice:"",
                TeacherPayWay:"",
                Pay:"",
                StrAttend:"",       
            },
            pageNo:1,
            pageSize:1000
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        this.getChargeTeacher();
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
        getChargeTeacher(){
            let index = this.$route.params.data.split("&")[0];
            let iClassID = this.$route.params.data.split("&")[1];
            getChargeTeacher(this.pageNo,this.pageSize,iClassID).then((result)=>{
                let chargeInfo = result.data.data[index];
                // console.log(chargeInfo)、
                this.form.TeacherName = chargeInfo.TeacherName
                this.form.TeacherPayWay = chargeInfo.TeacherPayWay
                this.form.TeacherPrice = chargeInfo.TeacherPrice
                this.form.StartDate = chargeInfo.StartDate;
                this.form.EndDate = chargeInfo.EndDate;
                this.form.Pay = chargeInfo.Pay;
                this.form.StrAttend = chargeInfo.StrAttend;
            })
            // .catch((err)=>{
            //     alertError(this,"1040");
            // });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interestClassTeacherDetail{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    padding-top:74px;
    position: relative;
}
.el-form-item {
    margin-bottom: 0px;
}
.el-input__inner:disabled{
    color:#606266 !important;
}
.redColor{
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: red;
    display: inline-block;
}
.interestClassTeacher_label{
    /* color:#c0c4cc; */
    font-weight: lighter;
}
</style>