<template>
    <div class="holidayApplyDetail">
        <!-- <div class="redColor">*必填</div> -->
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="填表日期">
                <label class="labeleg" :disabled="true" style="font-weight:normal;">{{form.todayTime}}</label>
            </el-form-item>

            <el-form-item label="代申请人">
                <el-input v-model="userInfo.userName" size="small" style="width:200px;" disabled></el-input>
                <label style="color:#606266;margin:0 8px 0 43px;">加班申请人</label>
                <el-select v-model="form.extraWorkUserID" @change="loadInformation" filterable size="small" style="width:270px;" placeholder="请选择加班申请人">
                    <el-option
                        v-for="item in form.extraWorkUserArr"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="申请处理方法">
                <div class="radioDiv">
                    <el-radio v-model="form.handingMethod" @change="getOverHours" label="1">增加年假</el-radio>
                </div>
                <div class="radioDiv marginDiv">
                    <el-radio v-model="form.handingMethod" @change="getOverHours" label="2">加班费</el-radio>
                </div>
                <div class="radioDiv marginDiv">
                    <el-radio v-model="form.handingMethod" @change="getOverHours" label="4">抵消迟到</el-radio>
                </div>
                <el-select v-model="form.attrance" v-show="form.handingMethod=='4'" clearable filterable size="small" style="width:270px;" placeholder="请选择迟到记录">
                    <el-option
                        v-for="item in form.attranceArray"
                        :key="item.NGID"
                        :label="item.Msg"
                        :value="item.NGID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="项目编号">
                <el-select v-model="form.projectID" clearable size="small" style="width:200px;" placeholder="请选择项目编号">
                    <el-option
                        v-for="item in form.projectArr"
                        :key="item.ProjectID"
                        :label="item.ProjectCD"
                        :value="item.ProjectID">
                    </el-option>
                </el-select>
                <label style="color:#606266;margin:0 15px 0 50px;">项目名称</label>
                <el-select v-model="form.projectID" clearable size="small" style="width:270px;" placeholder="请选择项目名称">
                    <el-option
                        v-for="item in form.projectArr"
                        :key="item.ProjectID"
                        :label="item.ProjectName"
                        :value="item.ProjectID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="加班时间">
                <div style="width:600px;">
                    <el-select v-model="form.extraWorkDate" clearable size="small" @change="changeOuttime" style="width:260px;" placeholder="请选择加班时间">
                        <el-option
                            v-for="item in form.extraWorkDateArr"
                            :key="item.value"
                            :label="item.text"
                            :value="item.text">
                        </el-option>
                    </el-select>
                    <el-time-picker
                        size="small"
                        style="width:113px;"
                        @change="getOverHours"
                        format="HH:mm"
                        value-format="HH:mm"
                        :disabled="disabled"
                        v-model="form.overtimeStart"
                        placeholder="开始时间">
                    </el-time-picker>
                    至
                    <el-time-picker
                        size="small"
                        style="width:113px;"
                        @change="getOverHours"
                        format="HH:mm"
                        value-format="HH:mm"
                        :disabled="disabled"
                        v-model="form.overtimeEnd"
                        placeholder="结束时间">
                    </el-time-picker>
                    <span style="color:#c0c4cc;float:right">合计&nbsp;{{form.extraWorkTime+" "+form.dayORhour}}</span>
                </div>
            </el-form-item>

            <el-form-item label="当日出勤信息">
                <el-input v-model="form.attendance" size="small" style="width:600px;" disabled></el-input>
            </el-form-item>

            <el-form-item label="加班事由概述" class="ReceiveApplyDetail_signatory">
                <el-input v-model="form.extrWorkReason" size="small" type="textarea" :rows="4" style="width:600px;padding: 4px 0px 7px 0;" placeholder="请输入请假事由"></el-input>
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

import { addExamine,findStaffByStaffID,getVisiableProjects,getOverDateList,LoadALTData,getOverHours,getAllLowStaffs } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'BusinessTripApplyDetail',
    data(){
        return {
            title:"加班申请",
            form: {
                todayTime:"",
                projectID:"",
                projectArr:[],
                handingMethod:"2",
                attrance:"",
                attranceArray:[],
                extraWorkDate:"",
                extraWorkDateArr:[],
                overtimeStart:"",
                overtimeEnd:"",
                extraWorkTime:"0.0",
                dayORhour:"小时",
                attendance:"出勤信息",
                extrWorkReason:"",
                approvalUser1:"",
                approvalUser2:"",
                approvalUserName1:"",
                approvalUserName2:"",
                ccUser:"",
                ccUserArr:[],
                extraWorkUserID:"",
                extraWorkUserArr:[],
            },
            overtimeFrom:"",
            overtimeTo:"",
            // checked:false,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        this.form.ccUserArr = this.findAllstaffs;
        this.getAllLowStaffs();
        this.getNowFormatDate();
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
        disabled(){
            if (this.form.extraWorkDate == "") {
                return true;
            }else if (this.form.extraWorkDate != "") {
                return false;
            }
        },
        QuitsText(){
            if (this.form.attranceArray.length!=0) {
                let obj = this.form.attranceArray.find((item)=>{
                    return this.form.attrance === item.NGID;
                })
                return obj.Msg;
            }else{
                return "";
            }
        },
        projectNum(){
            if (this.form.projectArr.length!=0) {
                let obj = this.form.projectArr.find((item)=>{
                    return this.form.projectID === item.ProjectID;
                })
                return obj.ProjectCD;
            }else{
                return "";
            }
        },
        projectName(){
            if (this.form.projectArr.length!=0) {
                let obj = this.form.projectArr.find((item)=>{
                    return this.form.projectID === item.ProjectID;
                })
                return obj.ProjectName;
            }else{
                return "";
            }
        },
        extraWorkUserName(){
            if (this.form.extraWorkUserArr.length!=0) {
                let obj = this.form.extraWorkUserArr.find((item)=>{
                    return this.form.extraWorkUserID === item.StaffID;
                })
                return obj.StaffName;
            }else{
                return "";
            }
        }
    },
    watch:{
    },
    methods:{
        // 点击确认保存模板
        confirm(){
            let json = {
                cosNum : this.userInfo.cosNum,
                type : "14",
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

            if (this.form.extraWorkUserID == "") {
                this.$message.error({
                    message:"请选择加班申请人"
                });
                return;
            }
            if (this.form.extraWorkDate == "") {
                this.$message.error({
                    message:"请选择加班时间"
                });
                return;
            }
            if (this.form.handingMethod == "4"&&this.form.attrance == "") {
                this.$message.error({
                    message:"请选择迟到记录"
                });
                return;
            }
            if (this.form.extrWorkReason == "") {
                this.$message.error({
                    message:"请输入加班事由"
                });
                return;
            }

            let createDate = this.form.todayTime; 
            let currStaffName = this.userInfo.userName;
            let currStaffID = this.userInfo.userStaffID;
            let overtimeStaffName = this.extraWorkUserName;
            let method = this.form.handingMethod;
            let projectID = this.form.projectID?this.form.projectID:"-1";
            let projectNum = this.projectNum;
            let projectName = this.projectName;
            let overtimeStart = this.overtimeFrom;
            let overtimeEnd = this.overtimeTo;
            let explain = this.form.extrWorkReason;
            let QuitsID = this.form.attrance?this.form.attrance:"-1";
            let QuitsText = this.QuitsText;
            if(method!="4"){
				QuitsID = "-1";
				QuitsText = "";
			}
            let array = [{
				"name":"填表日期",
				"value":createDate
			},{
				"name":"代申请人",
				"value":currStaffName
			},{
				"name":"代申请人ID",
				"value":currStaffID
			},{
				"name":"加班申请人",
				"value":overtimeStaffName
			},{
				"name":"申请处理方法",
				"value":method
			},{
				"name":"项目ID",
				"value":projectID
			},{
				"name":"项目编号",
				"value":projectNum
			},{
				"name":"项目名称",
				"value":projectName
			},{
				"name":"加班时间始",
				"value":overtimeStart
			},{
				"name":"加班时间止",
				"value":overtimeEnd
			},{
				"name":"加班事由概述",
				"value":explain
			},{
				"name":"QuitsID",//迟到记录ID
				"value":QuitsID
			},{
				"name":"抵消迟到记录",//迟到记录ID
				"value":QuitsText
            }]
            json.content = JSON.stringify(array);
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
        getAllLowStaffs(){
            let staffID = this.userInfo.userStaffID;
            getAllLowStaffs(staffID).then((result)=>{
                this.form.extraWorkUserArr = result.data.data;
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"1220");
            });
        },
        //点击加班申请人后加载的信息
        loadInformation(staffID){
            let isNew = "1";
            this.form.projectID = "";
            this.form.extraWorkDate = "";
            this.form.overtimeStart = "";
            this.form.overtimeEnd = "";
            this.form.attendance = "";
            this.form.attrance = "";
            this.form.extrWorkReason = "";
            this.form.ccUser = "";
            let loading = showLoading();
            Promise.all([
                findStaffByStaffID(staffID),
                getVisiableProjects(staffID,isNew),
                getOverDateList(staffID),
                LoadALTData(staffID)
            ]).then((result) => {
                closeLoading(loading);
                this.form.approvalUser1 = result[0].data.data[0].TimeScheduleManager;
                this.form.approvalUser2 = result[0].data.data[0].TimeScheduleManager1;
                this.getApprovalUserName();
                this.form.projectArr = result[1].data.data;
                this.form.extraWorkDateArr = result[2].data.data;
                this.form.attranceArray = result[3].data.data;
            })
        },
        //改变加班时间项时获取加班信息
        changeOuttime(text){
            if (text != "") {
                let obj = this.form.extraWorkDateArr.find((item)=>{
                    return text === item.text;
                })
                this.overtimeFrom = obj.OvertimeFrom;
                this.overtimeTo = obj.OverTimeTo;
                this.form.overtimeStart = obj.OvertimeFrom.split(" ")[1];
                this.form.overtimeEnd = obj.OverTimeTo.split(" ")[1];
                this.form.attendance = obj.FirstActualTime.split(" ")[1] + "-" + obj.LastActualTime.split(" ")[1];
                this.getOverHours();
            }else{
                this.form.overtimeStart = "";
                this.form.overtimeEnd = "";
                this.form.extraWorkTime = "0.0";
            }
        },
        //获取加班时长和单位
        getOverHours(){
            let overTimeMethod = this.form.handingMethod;
            let overTimeFromHour = this.form.overtimeStart;
            let overTimeToHour = this.form.overtimeEnd;
            if (overTimeFromHour&&overTimeToHour) {
                getOverHours(overTimeMethod,overTimeFromHour,overTimeToHour).then((result)=>{
                    this.form.extraWorkTime = result.data.TotalTime;
                    this.form.dayORhour = result.data.OverUnit;
                })
                .catch((err)=>{
                    closeLoading(loading);
                    alertError(this,"1223");
                });
            }else{
                this.form.extraWorkTime = "0.0";
            }
        },
        //获取审批人姓名
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
        //获取当前时间
        getNowFormatDate() {
            let date = new Date();
		    let timeStr = date.getFullYear() + "-" + (Array(3).join(0) + (date.getMonth() + 1)).slice(-2) + "-" + (Array(3).join(0) + date.getDate()).slice(-2) + " " + (Array(3).join(0) + date.getHours()).slice(-2) + ":" + (Array(3).join(0) + date.getMinutes()).slice(-2) + ":" + (Array(3).join(0) + date.getSeconds()).slice(-2);
            this.form.todayTime = timeStr;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.holidayApplyDetail{
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
.radioDiv{
    float: left;
    width: 100px;
}
.marginDiv{
    margin-left: 14px;
}
</style>