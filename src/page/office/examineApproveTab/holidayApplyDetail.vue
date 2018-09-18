<template>
    <div class="holidayApplyDetail">
        <!-- <div class="redColor">*必填</div> -->
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="剩余年假">
                <label class="labeleg" :disabled="true">{{form.LeftHolidays}}天</label>
            </el-form-item>

            <el-form-item label="请假种类">
                <div class="radioDiv">
                    <el-radio v-model="form.holiType" label="1">病假</el-radio>
                </div>
                <div class="radioDiv marginDiv">
                    <el-radio v-model="form.holiType" label="2">事假</el-radio>
                </div>
                <div class="radioDiv marginDiv">
                    <el-radio v-model="form.holiType" label="4">工伤假</el-radio>
                </div>
                <div class="radioDiv marginDiv">
                    <el-radio v-model="form.holiType" label="5">产假/婚假/丧假等</el-radio>
                </div>
            </el-form-item>

            <el-form-item label="处理方法">
                <div class="radioDiv">
                    <el-radio v-model="form.handingMethod" label="1">使用年假</el-radio>
                </div>
                <div class="radioDiv marginDiv">
                    <el-radio v-model="form.handingMethod" label="3">倒休</el-radio>
                </div>
                <div class="radioDiv marginDiv">
                    <el-radio v-model="form.handingMethod" label="2">薪金扣除</el-radio>
                </div>
            </el-form-item>

            <el-form-item label="请假时间">
                <el-date-picker
                    v-model="form.holiDate"
                    size="small"
                    type="date"
                    style="width:250px;"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :placeholder="'请选择请假时间'"
                    >
                </el-date-picker>
                <label style="color:#606266;margin:0 15px 0 36px;">请假时长</label>
                <el-radio v-model="form.holiDuration" label="上午" style="margin-left:10px;">上午</el-radio>
                <el-radio v-model="form.holiDuration" label="下午">下午</el-radio>
                <el-radio v-model="form.holiDuration" label="全天">全天</el-radio>
            </el-form-item>

            <el-form-item label="倒休时间" v-show="isShowOffDetail">
                <el-date-picker
                    v-model="form.offDate"
                    size="small"
                    type="date"
                    style="width:250px;"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :placeholder="'请选择倒休时间'"
                    >
                </el-date-picker>
                <label style="color:#606266;margin:0 15px 0 36px;">倒休时长</label>
                <el-radio v-model="form.offDuration" label="上午" style="margin-left:10px;">上午</el-radio>
                <el-radio v-model="form.offDuration" label="下午">下午</el-radio>
                <el-radio v-model="form.offDuration" label="全天">全天</el-radio>
            </el-form-item>

            <el-form-item label="请假事由" class="ReceiveApplyDetail_signatory">
                <el-input v-model="form.holiReason" size="small" type="textarea" :rows="4" style="width:600px;padding: 4px 0px 7px 0;" placeholder="请输入请假事由"></el-input>
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

import { addExamine,findStaffByStaffID } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'BusinessTripApplyDetail',
    data(){
        return {
            title:"请假申请",
            form: {
                LeftHolidays:"",
                holiType:"1",
                holiDate:"",
                holiDuration:"上午",
                handingMethod:"1",
                offDate:"",
                offDuration:"上午",
                holiReason:"",
                approvalUser1:"",
                approvalUser2:"",
                approvalUserName1:"",
                approvalUserName2:"",
                ccUser:"",
                ccUserArr:[]
            },
            // checked:false,
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
        isShowOffDetail(){
            if (this.form.handingMethod == "3") {
                return true;
            }else{
                return false;
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
                type : "8",
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
            let obj = {name:"请假种类",value:this.form.holiType}; 
            let obj1 = {name:"请假时长",value:this.form.holiDuration};
            let obj2 = {name:"请假时间",value:this.form.holiDate};
            let obj3 = {name:"处理方法",value:this.form.handingMethod};
            let obj4 = {name:"请假事由",value:this.form.holiReason};
            let array = [];
            array.push(obj);
            array.push(obj1);
            array.push(obj2);
            array.push(obj3);
            array.push(obj4);
            if (this.form.handingMethod == "3") {
                let obj5 = {name:"倒休时间",value:this.form.offDate}
                let obj6 = {name:"倒休时长",value:this.form.offDuration}
                array.push(obj5);
                array.push(obj6);
            }
            json.content = JSON.stringify(array);
            if (this.form.holiDate == "") {
                this.$message.error({
                    message:"请选择请假日期"
                });
                return;
            }
            if (this.form.handingMethod == "3"&&this.form.offDate == "") {
                this.$message.error({
                    message:"请选择倒休日期"
                });
                return;
            }
            if (this.form.handingMethod == "3"&&this.form.offDuration == "") {
                this.$message.error({
                    message:"请选择倒休时长"
                });
                return;
            }
            if (this.form.handingMethod == "3") {
                if(this.form.holiDuration == "全天" && (this.form.offDuration == "上午" || this.form.offDuration == "下午")){ 
                    this.$message.error({
                        message:"倒休时长选择有误"
                    });
                    return;
                }
            }
            if (this.form.holiReason == "") {
                this.$message.error({
                    message:"请输入请假事由"
                });
                return;
            }
            if(this.form.handingMethod == "1"){
				if(this.form.holiDuration == "上午" || this.form.holiDuration == "下午"){
					if(this.form.LeftHolidays < 0.5){		
                        this.$message.error({
                            message:"剩余年假不足"
                        });   
                        return;
					}						
				}else if(this.form.holiDuration == "全天"){
					if(this.form.LeftHolidays < 1){	
                        this.$message.error({
                            message:"剩余年假不足"
                        });  
                        return; 
					}
				}
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
        findStaffByStaffID(){
            let staffID = this.userInfo.userStaffID;
            let loading = showLoading();
            findStaffByStaffID(staffID).then((result)=>{
                closeLoading(loading);
                this.form.LeftHolidays = result.data.data[0].LeftHolidays;
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
    margin-left: 56px;
}
</style>