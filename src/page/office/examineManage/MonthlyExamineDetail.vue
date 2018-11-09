<template>
    <div class="CommonExamineDetail">
        <chat-header :fixIndex="10" :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;padding-top:54px;">
            <el-form-item label="员工姓名">
                <el-select v-model="form.staffID" disabled size="small" style="width:400px" filterable placeholder="请选择被考核人">
                    <el-option
                        v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="考核模板">
                <el-select v-model="form.templateID" size="small" style="width:400px;" filterable placeholder="请选择考核模板">
                    <el-option
                        v-for="item in form.templateArr"
                        :key="item.TemplateID"
                        :label="item.Name"
                        :value="item.TemplateID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="第一考核人">
                <el-select v-model="form.staffID1" size="small" clearable  style="width:400px;" filterable placeholder="请选择第一考核人">
                    <el-option
                        v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="第二考核人">
                <el-select v-model="form.staffID2" size="small" :disabled="disabledStaff2" clearable style="width:400px;" filterable placeholder="请选择第二考核人">
                    <el-option
                        v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="第三考核人">
                <el-select v-model="form.staffID3" size="small" :disabled="disabledStaff3" clearable style="width:400px;" filterable placeholder="请选择第三考核人">
                    <el-option
                        v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getEvaluationTemplate,saveEvaluationTemplateForStaff } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'CommonExamineDetail',
    data(){
        return {
            title:"",
            form: {
                staffID:"",
                templateID:"",
                templateArr:[],
                staffID1:"",
                staffID2:"",
                staffID3:"",
            },
        }
    },
    components:{
        ChatHeader
    },
    props: {
        item:{
            type:Object
        }
    },
    mounted(){
        this.getEvaluationTemplate();
        this.title = "月度考核详情";
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        disabledStaff2(){
            if (this.form.staffID1 != "") {
                return false;
            }else{
                return true;
            }
        },
        disabledStaff3(){
            if (this.form.staffID1 != ""&&this.form.staffID2 != "") {
                return false;
            }else{
                return true;
            }
        }
    },
    watch:{
    },
    methods:{
        // 点击确认保存模板
        confirm(){
            let staffID = this.item.StaffID;
            let templateID = this.form.templateID;
            let staffID1 = this.form.staffID1==""?"-1":this.form.staffID1;
            let staffID2 = this.form.staffID2==""?"-1":this.form.staffID2;
            let staffID3 = this.form.staffID3==""?"-1":this.form.staffID3;
            if(templateID == ''){
                this.$message.error({
                    message:"请选择考核模板"
                });
                return;
            }
            let loading = showLoading();
            saveEvaluationTemplateForStaff(staffID,templateID,staffID1,staffID2,staffID3).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=='1'){
                    this.$message({
                        message:"修改成功",
                        type:"success"
                    });
                    this.$emit("refresh");
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message:"修改失败"
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2108");
            });
        },
        loadList(){
            console.log(this.item)
            this.form.staffID = this.item.StaffID;
            this.form.templateID = this.item.TemplateID;
            console.log(this.form.templateID)
            this.form.staffID1 = this.item.EvaluationManager1=="-1"?"":this.item.EvaluationManager1;
            this.form.staffID2 = this.item.EvaluationManager2=="-1"?"":this.item.EvaluationManager2;
            this.form.staffID3 = this.item.EvaluationManager3=="-1"?"":this.item.EvaluationManager3;
        },
        getEvaluationTemplate(){
            let loading = showLoading();
            getEvaluationTemplate().then((result)=>{
                closeLoading(loading);
                this.form.templateArr = result.data.data;
            }).catch((err)=>{
                console.log(err);
                alertError(this,"1197");
                closeLoading(loading);
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.CommonExamineDetail{
    padding:20px;
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap;  */
    height: 100vh;
    width: 100%;
    overflow: scroll;
    background: #fafafa;
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
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0px 12px 0 0;
    vertical-align: middle;
    position: relative;
}
</style>