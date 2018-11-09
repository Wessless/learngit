<template>
    <div class="CommonExamineDetail">
        <chat-header :fixIndex="10" :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;padding-top:54px;">
            <el-form-item label="被考核人" :style="form.evaluationStaffID.length!=0?{margin:'0 0 10px 0'}:''">
                <el-select v-model="form.evaluationStaffID" size="small" multiple style="width:400px" filterable placeholder="请选择被考核人">
                    <el-option
                        v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="有效日期">
                <el-date-picker
                    style="width:400px;"
                    v-model="form.dateRange"
                    type="daterange"
                    range-separator="一"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    size="small"
                    unlink-panels
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="考核模板">
                <el-select v-model="form.templateID" size="small" style="width:400px;" filterable placeholder="请选择考核模板">
                    <el-option
                        v-for="item in form.templateArr"
                        :key="item.TemplateID"
                        :label="item.TemplateName"
                        :value="item.TemplateID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="考核名称">
                <el-input v-model="form.tempName" size="small" clearable style="width:400px;" placeholder="请输入考核名称"></el-input>
            </el-form-item>

            <el-form-item label="是否自我考核">
                <el-radio v-model="form.needSelfCheck" label="1">是</el-radio>
                <el-radio style="margin-left:20px;" v-model="form.needSelfCheck" label="0">否</el-radio>
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

import { getOtherEvaluationTemplate,addCreditSubject,addEvaluationTemplate,getOtherEvaluationSet } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'CommonExamineDetail',
    data(){
        return {
            title:"",
            form: {
                evaluationStaffID:[],
                dateRange:[],
                templateID:"",
                templateArr:[],
                tempName:"",
                needSelfCheck:"1",
                staffID1:"",
                staffID2:"",
                staffID3:"",
            },

            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }],
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
        this.getOtherEvaluationTemplate();
        if(this.$route.meta.type=="add"){
            this.getNowTime();
            this.title = "添加绩效考核";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改绩效考核";
            this.loadList();
        }
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
            let id;
            let staffID = this.userInfo.userStaffID;
            let evaluationStaffID = this.form.evaluationStaffID.join(",");
            let beginDate = this.form.dateRange[0];
            let endDate = this.form.dateRange[1];
            let tempName = this.form.tempName;
            let needSelfCheck = this.form.needSelfCheck;
            let templateID = this.form.templateID;
            let staffID1 = this.form.staffID1;
            let staffID2 = this.form.staffID2;
            let staffID3 = this.form.staffID3;
            if (this.$route.meta.type=="add") {
                id = "-1";
            }else if (this.$route.meta.type=="update") {
                id = this.item.ResultID;
            }

            if(evaluationStaffID == ''){
                this.$message.error({
                    message:"请选择被考核人"
                });
                return;
            }
            if(beginDate == ''){
                this.$message.error({
                    message:"请选择有效日期"
                });
                return;
            }
            if(templateID == ''){
                this.$message.error({
                    message:"请选择考核模板"
                });
                return;
            }
            if(tempName == ''){
                this.$message.error({
                    message:"请输入考核名称"
                });
                return;
            }
            let loading = showLoading();
            addEvaluationTemplate(id,staffID,evaluationStaffID,beginDate,endDate,
                tempName,needSelfCheck,templateID,staffID1,staffID2,staffID3).then((result)=>{
                closeLoading(loading);
                if(this.$route.meta.type=="update"){
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"修改成功",
                            type:"success"
                        });
                        this.$emit("refresh","update");
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"修改失败"
                        });
                    }
                }else{
                     if(result.data.Result=='1'){
                        this.$message({
                            message:"添加成功",
                            type:"success"
                        });
                        this.$emit("refresh","add");
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"添加失败"
                        });
                    }
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2131");
            });
        },
        loadList(){
            let resultID = this.item.ResultID;
            let loading = showLoading();
            getOtherEvaluationSet(resultID).then((result)=>{
                closeLoading(loading);
                let obj = result.data;
                console.log(obj);
                this.form.dateRange = [obj.BeginDate,obj.EndDate];
                this.form.tempName = obj.Name;
                this.form.needSelfCheck = obj.NeedSelfCheck;
                this.form.evaluationStaffID.push(obj.StaffID.toString());
                this.form.staffID1 = obj.StaffID1=="-1"?"":obj.StaffID1;
                this.form.staffID2 = obj.StaffID2=="-1"?"":obj.StaffID2;
                this.form.staffID3 = obj.StaffID3=="-1"?"":obj.StaffID3;
                this.form.templateID = obj.TemplateID;
            }).catch((err)=>{
                console.log(err);
                alertError(this,"1197");
                closeLoading(loading);
            });
        },
        getOtherEvaluationTemplate(){
            let loading = showLoading();
            getOtherEvaluationTemplate().then((result)=>{
                closeLoading(loading);
                this.form.templateArr = result.data.data;
                if (this.$route.meta.type=='add') {
                    this.form.templateID = this.form.templateArr[0].TemplateID;
                }
            }).catch((err)=>{
                console.log(err);
                alertError(this,"1197");
                closeLoading(loading);
            });
        },
        //获取当前时间
        getNowTime(){
            let date = new Date();
            let year =  date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            let yearMonthDate = year + "-" + month + "-" + strDate;
            this.form.dateRange = [yearMonthDate,yearMonthDate];
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