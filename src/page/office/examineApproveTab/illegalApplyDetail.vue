<template>
    <div class="interertClassChild">
        <chat-header :showBack="true" :title="'出勤违规申辩'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item style="width:100%;">
                    <el-date-picker
                        v-model="form.yearMonth"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        size="medium"
                        @change="reloadList"
                        :clearable="false"
                        v-show="ignoreFlag!='true'"
                        placeholder="请选择月份"
                        style="width:150px;">
                    </el-date-picker>
                    <span v-show="ignoreFlag!='true'" style="margin-left:20px;color:#c0c4cc;">休假审批获得通过时不会出现在违规数据中</span>
                </el-form-item>
            </el-form>
            <div v-show="ignoreFlag=='true'" class="noAttendenceData">
                <el-alert
                    title="你已被设定为不计考勤人员"
                    type="info"
                    center
                    :closable="false">   
                </el-alert>
            </div>
        </div>
        <!-- <no-data :isShow="isNoData"></no-data> -->
        <Attendance-Calendar v-show="ignoreFlag!='true'"
                             :curYear="form.year" :curMonth="form.month"
                             :attendanceData="tableData" 
                             :changeName="'changeDate'" 
                             :clickName1="'addTimeBookNG'" 
                             :clickName2="'updateJustify'" 
                             :red="redDate"
                             @changeDate="changeDate" 
                             @addTimeBookNG="addTimeBookNG"
                             @updateJustify="updateJustify">
        </Attendance-Calendar>
        <el-dialog
            title=""
            :visible.sync="dialogVisibleADD"
            width="35%">
            <el-radio-group v-for="item in radioArr" v-model="radio" :key="item.type">
                <el-radio :label="item.type" style="margin:0 30px 10px 0">{{item.text}}</el-radio>
            </el-radio-group>
            <el-input
                class="input_padding"
                style="width:400px;"
                type="textarea"
                :rows="4"
                placeholder="请在此处输入理由"
                v-model="reason">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleADD = false">取 消</el-button>
                <el-button type="primary" @click="confirmTimeBookNG">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="迟到早退理由申辩"
            :visible.sync="dialogVisibleUP"
            width="35%">
            <el-input
                class="input_padding"
                style="width:400px;"
                type="textarea"
                :rows="4"
                placeholder="请在此处输入理由"
                v-model="clickItem.justifyReason">
            </el-input>

            <div style="margin-top:10px;" v-show="outsideArr.length!=0">
                <span style="display:block;margin-bottom:10px;">我的出差</span>
                <el-radio-group style="display:block;margin-left:20px;" v-for="item in outsideArr" v-model="radio1" :key="item.id">
                    <el-radio :label="item.id" style="margin-bottom:10px;">{{item.reason}}</el-radio>
                </el-radio-group>
            </div>

            <div>
                <span style="display:block;margin-bottom:10px;" v-show="outsideArr.length!=0">我的外出</span>
                <el-radio-group style="display:block;margin-left:20px;" v-for="item in businessArr" v-model="radio1" :key="item.id">
                    <el-radio :label="item.id" style="margin-bottom:10px;">{{item.reason}}</el-radio>
                </el-radio-group>
            </div>

            <span slot="footer" style="float:left;">
                <el-button type="danger" @click="delDialogVisible=true" v-show="clickItem.justifyReason!=''">删除</el-button> 
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleUP = false">取 消</el-button>
                <el-button type="primary" @click="confirmJustify">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="delDialogVisible"
            width="30%">
            <span>是否撤销该申请</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getTimesBook,findStaffByStaffID,getVacDate,updateJustify,getJustifyTwo,
        addTimeBookNG,delJustify,getTheOutsideByStaffID,getTheOnBusinessByStaffID } from '@/js/api'
import { showLoading,closeLoading,alertError,dateTimeFormatter } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import AttendanceCalendar from '@/components/chat/AttendanceCalendar'
// import NoData from '@/components/chat/NoData'

export default {
    name: 'interertClassChild',
    data(){
        return {
            form:{
                yearMonth:"",
                year:0,
                month:0,
            },
            // isNoData:true,
            ignoreFlag:"",
            dialogVisibleADD:false,
            dialogVisibleUP:false,
            delDialogVisible:false,
            tableData:[],
            beginDate:"",
            endDate:"",
            redDate:{},
            clickItem:{},
            NGtypeArr:[],
            dateStr:"",
            radio:"",
            radioArr:[],
            radio1:"",   //外出或出差ID
            outsideArr:[],
            businessArr:[],
            reason:"",
        }
    },
    components:{
        // NoData,
        ChatHeader,
        AttendanceCalendar
    },
    mounted(){
        this.getNowTime();
        this.findStaffByStaffID();
        if (this.ignoreFlag!='true') {
            this.reloadList();
        }
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
    },
    watch:{
        
    },
    methods:{
        reloadList(){
            let year = this.form.yearMonth.split("-")[0];
            let month = this.form.yearMonth.split("-")[1];
            let strday = new Date(year,month,0).getDate();//获取当月最后一天是几号
            this.form.year = parseInt(year);
            this.form.month = parseInt(month);
            this.beginDate = this.form.yearMonth + "-" + "01";
            this.endDate = this.form.yearMonth + "-" + strday;
            let loading = showLoading();
            this.getTimesBook(loading);
        },
        getTimesBook(loading,month){
            let cosNum = this.userInfo.cosNum;
            let staffID = this.userInfo.userStaffID;
            getTimesBook(cosNum,staffID,this.beginDate,this.endDate).then((result)=>{
                this.tableData = result.data.data;
                let length = new Date(this.form.year , this.form.month - 1 + 1 , 0).getDate() - this.tableData.length;
                for (let i = 1; i <= length; i++) {
                    let obj = {}
                    let dateObj = new Date(this.form.year,this.form.month,this.tableData.length+i);
                    obj.AttDate = dateTimeFormatter(dateObj,'yyyy-MM-dd');
                    obj.PlusButton = "";
                    obj.Flag = "";
                    obj.Justify = [];
                    this.tableData.push(obj);
                }
                this.getVacDate(loading);
            })
            .catch((err)=>{
                alertError(this,"1126");
            });
        },
        //判断是否是不计考勤人员
        findStaffByStaffID(){
            let staffID = this.userInfo.userStaffID;
            findStaffByStaffID(staffID).then((result)=>{
                this.ignoreFlag = result.data.data[0].IgnorePuncherData.toLowerCase();
            }).catch((err)=>{
                alertError(this,"1015");
            });
        },
        //加载未添加的红日子
        getVacDate(loading){
            getVacDate(this.form.year,this.form.month).then((result)=>{
                closeLoading(loading)
                let array = result.data.data.split(";");
                let obj = {};
                for(let i=0;i<array.length-1;i++){
                    let thisDate = new Date(array[i].split("-")[0],array[i].split("-")[1]-1,array[i].split("-")[2]);
                    obj[thisDate.getFullYear()+"-"+(thisDate.getMonth()+1)+"-"+thisDate.getDate()] = "isRed";
                }
                this.redDate = obj;
            })
            .catch((err)=>{
                alertError(this,"1052");
            });
        },
        changeDate(curYear,curMonth,curYearMonth){
            if(curYear){
                this.form.year = curYear;
            }
            if(curMonth){
                this.form.month = curMonth;
            }
            if(curYearMonth){
                this.form.yearMonth = curYearMonth;
            }
            this.reloadList();
        },
        getNowTime(){
            let date = new Date();
            let year =  date.getFullYear();
            let month = date.getMonth() + 1;
            this.form.year = year;
            this.form.month = month;
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            this.form.yearMonth = year + "-" + month;
        },
        addTimeBookNG(date,NGtypes){
            this.dialogVisibleADD = true;
            this.dateStr = date;
            this.NGtypeArr = NGtypes?NGtypes.split(","):[];
			let array = [
				{
					type : '1',
					text : "迟到",
				},{
					type : '2',
					text : "早退",
				},{
					type : '3',
					text : "旷工",
				}
			];
			if(this.NGtypeArr.length>0){
				for(var j=0;j<this.NGtypeArr.length;j++){
					if(this.NGtypeArr[j]=="1"){
						array.splice(2,1);
						array.splice(0,1);
					}else if(this.NGtypeArr[j]=="2"){
						array.splice(1,2);
					}
				}
                this.radioArr = array;
            }
        },
        confirmTimeBookNG(){
            let json = {
                cosNum:this.userInfo.cosNum,
                date:this.dateStr,
                staffID:this.userInfo.userStaffID,
                type:this.radio,
                reason:this.reason,
            }
            if (json.type == "") {
                this.$message.error({
                    message:"请选择类别"
                });
                return;
            }
            if (json.reason == "") {
                this.$message.error({
                    message:"请输入理由"
                });
                return;
            }
            let loading = showLoading();
            addTimeBookNG(json).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        message:"提交成功",
                        type:"success"
                    });
                    this.dialogVisibleADD = false;
                    this.reloadList();
                }else{
                    this.$message({
                        message:"提交失败",
                    });
                }
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"2071");
            });
        },
        updateJustify(date,item){
            this.radio1 = "";
            this.outsideArr = [];
            this.businessArr = [];
            this.clickItem = item;
            this.dateStr = date;
            this.getOutsideAndBusiness();
            if (this.clickItem.JustifyID!="-1") {
                let cosNum = this.userInfo.cosNum;
                let justifyID = this.clickItem.JustifyID;
                getJustifyTwo(cosNum,justifyID).then((result)=>{
                    this.clickItem.justifyReason = result.data.JustifyReason;
                    this.dialogVisibleUP = true;
                })
                .catch((err)=>{
                    alertError(this,"1127");
                }); 
            }else{
                this.clickItem.justifyReason = "";
                this.dialogVisibleUP = true;
            }
        },
        confirmJustify(){
            // cosNum,
            // staffID,
            // justifyDate,
            // justifyReason,
            // type,
            // examineID
            let json = {
                cosNum:this.userInfo.cosNum,
                staffID:this.userInfo.userStaffID,
                justifyDate:this.dateStr,
                justifyReason:this.clickItem.justifyReason,
                type:this.clickItem.NGType,
                examineID:this.radio1!=""?this.radio1:"-1",
            }
            if (json.justifyReason == "") {
                this.$message.error({
                    message:"请输入理由"
                });
                return;
            }
            if (this.clickItem.JustifyStatus == '2') {
                this.$message({
                    message:"已审批，无法提交",
                });
                return;
            }
            let loading = showLoading();
            updateJustify(json).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        message:"提交成功",
                        type:"success"
                    });
                    this.dialogVisibleUP = false;
                    this.reloadList();
                }else{
                    this.$message({
                        message:"提交失败",
                    });
                }
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"2074");
            });
        },
        confirmDelete(){
            let cosNum = this.userInfo.cosNum;
            let justifyID = this.clickItem.JustifyID;
            this.delDialogVisible = false;
            let loading = showLoading();
            delJustify(cosNum,justifyID).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        message:"撤销成功",
                        type:"success"
                    });
                    this.dialogVisibleUP = false;
                    this.reloadList();
                }else{
                    this.$message({
                        message:"撤销失败",
                    });  
                }
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"2072");
            });
        },
        getOutsideAndBusiness(){
            let cosNum = this.userInfo.cosNum;
            let staffID = this.userInfo.userStaffID;
            let status = "1";
            Promise.all([getTheOutsideByStaffID(cosNum,staffID,this.dateStr,status),
                         getTheOnBusinessByStaffID(cosNum,staffID,this.dateStr,status)])
            .then((result)=>{
                for (let i = 0; i < result[0].data.data.length; i++) {
                    let obj = {};
                    let content = JSON.parse(result[0].data.data[i].Content);
                    obj.id = result[0].data.data[i].ID;
                    for(let j=0;j<content.length;j++){
						if(content[j].name=="外出事由"){
							obj.reason = content[j].value;
						}
                    }
                    this.outsideArr.push(obj);
                }
                for (let m = 0; m < result[1].data.data.length; m++) {
                    let obj1 = {};
                    let content1 = JSON.parse(result[1].data.data[m].Content);
                    obj1.id = result[1].data.data[m].ID;
                    for(let n=0;n<content1.length;n++){
						if(content1[n].name=="出差事由"){
							obj1.reason = content1[n].value;
						}
                    }
                    this.businessArr.push(obj1);
                }
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interertClassChild{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .interertClassChild{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.employTeacherList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .employTeacherList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .employTeacherList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.startClass_label{
    color: #c0c4cc;
    font-weight: normal;
}
.noAttendenceData{
    width:100%;
}
</style>