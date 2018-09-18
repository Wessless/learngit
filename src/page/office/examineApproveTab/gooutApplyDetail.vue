<template>
    <div class="commonApplyDetail">
        <!-- <div class="redColor">*必填</div> -->
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="开始时间">
                <el-date-picker
                    v-model="form.beginDateTime"
                    size="small"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    style="width:600px;"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="'请选择开始时间'"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker
                    v-model="form.endDateTime"
                    size="small"
                    type="datetime"
                    style="width:600px;"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="'请选择结束时间'"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="外出时间">
                <el-input placeholder="请输入内容" v-model="form.outOfTime" size="small" style="width:600px;">
                    <template slot="append">小时</template>
                </el-input>
            </el-form-item>
            <el-form-item label="外出事由" class="ReceiveApplyDetail_signatory">
                <el-input v-model="form.goReason" size="small" type="textarea" :rows="4" style="width:600px;padding: 4px 0px 7px 0;" placeholder="请输入外出事由"></el-input>
            </el-form-item>
            <el-form-item label="审批人">
                <div>
                    <label class="labeleg" :disabled="true">{{form.approvalUserName1}}</label>
                </div>
                <div>
                    <label class="labeleg" :disabled="true">{{form.approvalUserName2}}</label>
                </div>
            </el-form-item>
            <el-form-item label="抄送人">
                    <el-select v-model="form.ccUser" multiple size="small" style="width:600px;" placeholder="请选择抄送人">
                        <el-option
                            v-for="item in form.ccUserArr"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                    <!-- <el-checkbox v-model="checked" style="margin-left:10px;" @change="changeCcUserAr">显示离职员工</el-checkbox> -->
                </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { findAllRetiredStaffs,addExamine,findStaffByStaffID } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'commonApplyDetail',
    data(){
        return {
            title:"外出申请",
            form: {
                beginDateTime:"",
                endDateTime:"",
                outOfTime:"",
                goReason:"",
                approvalUser1:"",
                approvalUser2:"",
                approvalUserName1:"",
                approvalUserName2:"",
                ccUser:"",
                ccUserArr:[]
            },
            checked1:false,
            checked:false,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        this.form.ccUserArr = this.findAllstaffs;
        this.findStaffByStaffID();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        findAllstaffs(){
            let staffs = [];
            for(let i=0;i<this.allStaffs.length;i++){
                let json = {  
                    StaffID:this.allStaffs[i].StaffID,
                    StaffName:this.allStaffs[i].StaffName
                }
                staffs.push(json);
            }
            return staffs;
        },
    },
    watch:{
    },
    methods:{
        // 点击确认保存模板
        confirm(){
            let json = {
                cosNum : this.userInfo.cosNum,
                type : "6",
                applyUser : this.userInfo.userStaffID,
                approvalUser : "",
                ccUser : this.form.ccUser?this.form.ccUser.join(","):"",
                content : "",
                flag : "1"
            }
            if (this.form.approvalUser1!="-1") {
                json.approvalUser = this.form.approvalUser1;
            }
            if (this.form.approvalUser2!="-1") {
                json.approvalUser += ","+this.form.approvalUser2;
            }
            let obj = {name:"开始时间",value:this.form.beginDateTime};
            let obj1 = {name:"结束时间",value:this.form.endDateTime};
            let obj2 = {name:"外出时间",value:this.form.outOfTime};
            let obj3 = {name:"外出事由",value:this.form.goReason};
            let array = [];
            array.push(obj);
            array.push(obj1);
            array.push(obj2);
            array.push(obj3);
            json.content = JSON.stringify(array);
            console.log(this.form.outOfTime)
            let newBeginTime = new Date(this.form.beginDateTime.replace(/-/g,'/')).getTime();
            let newEndTime = new Date(this.form.endDateTime.replace(/-/g,'/')).getTime();
            if(this.form.beginDateTime == ""){
                this.$message.error({
                    message:"请选择开始时间"
                });
				return false;
            }
            if(this.form.endDateTime == ""){
                this.$message.error({
                    message:"请选择结束时间"
                });
				return false;
            }
            if(newBeginTime>newEndTime){
                this.$message.error({
                    message:"请选择正确的时间段！"
                });
				return false;
            }
            if (this.form.outOfTime == "") {
                this.$message.error({
                    message:"请输入外出时间"
                });
                return;
            }
            if (this.form.goReason == "") {
                this.$message.error({
                    message:"请输入外出事由"
                });
                return;
            }
            console.log(json)
            let loading = showLoading();
            addExamine(json).then((result)=>{
                closeLoading(loading);
                if(result.data.ExamineID!=''){
                    this.$message({
                        message:"添加成功",
                        type:"success"
                    });
                    window.history.go(-1);
                }else{
                    this.$message({
                        message:"添加失败",
                    });
                }
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"2050");
            });
        },
        //显示离职员工
        changeCcUserAr(){
            if(this.checked){
                this.findAllRetiredStaffs();
            }
        },
        //离职员工列表
        findAllRetiredStaffs(){
            let AllRetiredStaffsArr = [];
            findAllRetiredStaffs().then((result)=>{
                if(result){
                    if(result.data.data.length>0){
                        for(let i=0;i<result.data.data.length;i++){
                            let json = {
                                StaffID:result.data.data[i].StaffID,
                                StaffName:result.data.data[i].StaffName
                            }
                            AllRetiredStaffsArr.push(json);
                        }
                        this.form.ccUserArr = this.form.ccUserArr.concat(AllRetiredStaffsArr);
                    }
                }
            }).catch((err)=>{
                alertError(this,"1053");
            });
        },
        findStaffByStaffID(){
            let staffID = this.userInfo.userStaffID;
            let loading = showLoading();
            findStaffByStaffID(staffID).then((result)=>{
                closeLoading(loading);
                this.form.approvalUser1 = result.data.data[0].TimeScheduleManager;
                this.form.approvalUser2 = result.data.data[0].TimeScheduleManager1;
                this.getApprovalUserName();
            })
        },
        getApprovalUserName(){
            for (let i = 0; i < this.allStaffs.length; i++) {
                if (this.form.approvalUser1 == this.allStaffs[i].StaffID) {
                    this.form.approvalUserName1 = this.allStaffs[i].StaffName;
                    continue;
                }else if (this.form.approvalUser2 == this.allStaffs[i].StaffID) {
                    this.form.approvalUserName2 = this.allStaffs[i].StaffName; 
                    continue;
                }
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.commonApplyDetail{
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
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.el-table th, .el-table tr {
    background-color: #38ADFF;
}
.el-table .cell{
    color: #fff;
}
.uploadDiv div{
    display: flex;
    width:600px;
    height: 27px;
    margin-bottom:10px;
}
.uploadDiv div .name{
    margin-left: 10px;
    width: 150px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    line-height: 27px;
}
.uploadDiv div .del{
    margin-left: 10px;
    width: 40px;
    line-height: 27px;
    color:#38ADFF;
    cursor: pointer;
}
.uploadDiv img{  
    width:27px;
    height: 27px;
}
.labeleg{
    text-align: left;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.labeleg[disabled=disabled]{
    color:#c0c4cc;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>