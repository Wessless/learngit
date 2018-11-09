<template>
    <div class="BorrowFindList">
        <chat-header :showBack="true" :title="'应付款查询'"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item>
                    <!-- <span style="color:#999;margin-left:10px;">共{{ this.itemNum }}条，总金额：{{ this.itemMoney }}元</span> -->
                    <span style="color:#999;margin-left:10px;">{{ this.Summary }}</span>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" @click="dialogVisible=true">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="dueFindList">
            <Due-Find-item v-for="item in dueFindList" :key="item.num" :item="item"></Due-Find-item>
        </div>
        <el-dialog title="查询条件" :visible.sync="dialogVisible" width="55%">
            <el-form :model="form" label-width="120px">
                <el-form-item :label="'应付款单号'">
                    <el-input v-model="form.startID" size="small" style="width:240px;" placeholder="请输入起始单号"></el-input>
                    至
                    <el-input v-model="form.endID" size="small" style="width:240px;" placeholder="请输入截止单号"></el-input>
                </el-form-item>

                <el-form-item :label="'所属报销单号'">
                    <el-input v-model="form.expenseStartID" size="small" style="width:240px;" placeholder="请输入起始单号"></el-input>
                    至
                    <el-input v-model="form.expenseEndID" size="small" style="width:240px;" placeholder="请输入截止单号"></el-input>
                </el-form-item>

                <el-form-item style="padding:0px;margin:0px;">
                    <div style="width:502px;">
                        <el-radio v-model="form.dateType" label="0">填表日期</el-radio>
                        <el-radio v-model="form.dateType" label="1">费用发生日期</el-radio>
                        <el-radio v-model="form.dateType" label="2">支付日期</el-radio>
                        
                        <!-- <el-radio v-model="form.dateType" label="4">还款日期</el-radio> -->
                    </div>
                </el-form-item>

                <!-- <el-form-item :label="dateTypeName">
                    <el-date-picker
                        v-model="form.startDate"
                        type="date"
                        size="small"
                        style="width:240px;"
                        placeholder="开始日期">
                    </el-date-picker>
                    至
                    <el-date-picker
                        v-model="form.endDate"
                        type="date"
                        size="small"
                        style="width:240px;"
                        placeholder="结束日期">
                    </el-date-picker>
                </el-form-item> -->

                <el-form-item :label="dateTypeName">
                    <el-date-picker
                        style="width:501px;"
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
                
                <el-form-item :label="'支付方式'">
                    <el-radio v-model="form.payType" label="-1">全部</el-radio>
                    <el-radio v-model="form.payType" label="0" style="margin-left:10px;">现金</el-radio>
                    <el-radio v-model="form.payType" label="1" style="margin-left:10px;">支票</el-radio>
                    <el-radio v-model="form.payType" label="2" style="margin-left:10px;">银行汇款</el-radio>
                    <el-radio v-model="form.payType" label="3" style="margin-left:10px;">汇票</el-radio>
                    <el-radio v-model="form.payType" label="4" style="margin-left:10px;">虚拟账户</el-radio>
                    <el-radio v-model="form.payType" label="5" style="margin-left:10px;">其它</el-radio>
                </el-form-item>

                <el-form-item :label="'填表人所在部门'">
                    <!-- <el-radio v-model="form.hasInvoice" label="-1">全部</el-radio>
                    <el-radio v-model="form.hasInvoice" style="margin-left:10px;" label="1">有</el-radio>
                    <el-radio v-model="form.hasInvoice" style="margin-left:10px;" label="0">无</el-radio> -->
                    <el-select v-model="form.departmentID" size="small" filterable :placeholder="'请选择填表人所在部门'" style="width:200px;">
                        <el-option
                            v-for="item in form.departmentArr"
                            :key="item.DepID"
                            :label="item.DepName"
                            :value="item.DepID">
                        </el-option>
                    </el-select>
                    <label style="color:#606266;margin:0 8px 0 32px;">排序方式</label>
                    <el-select v-model="form.sortID" size="small" filterable :placeholder="'请选择排序方式'" style="width:200px;">
                        <el-option
                            v-for="item in form.sortArr"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'填表人姓名'">
                    <el-select v-model="form.fillStaffID" size="small" filterable :placeholder="'请选择填表人所在部门'" style="width:390px;">
                        <el-option
                            v-for="item in form.fillStaff"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-checkbox v-model="checked" @change="changeStaffs" style="margin-right:10px;">显示离职员工</el-checkbox>
                </el-form-item>

                <el-form-item :label="'银行账户'">
                    <el-select v-model="form.bankAccountID" size="small" filterable :placeholder="'请选择银行账户'" style="width:250px;">
                        <el-option
                        v-for="item in form.bankArr"
                            :key="item.BankAccountID"
                            :label="item.BankTitle"
                            :value="item.BankAccountID">
                        </el-option>
                    </el-select>
                    <label style="color:#606266;margin:0 8px 0 32px;">任务状态</label>
                    <el-select v-model="form.status" size="small" filterable :placeholder="'请选择任务状态'" style="width:148px;">
                        <el-option
                        v-for="item in form.statusArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item :label="'资金出处'" class="smallTableHeight">
                    <el-select v-model="form.outBillType" size="small" @change="changeOutBillType" filterable :placeholder="'请选择资金出处'" style="width:140px;">
                        <el-option
                            v-for="item in form.outBillList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="form.outBillID" size="small" :disabled="outBillIDDisabled" filterable :placeholder="'请选择资金出处详情'" style="width:205px;">
                        <el-option
                            v-for="item in form.outBillDetailList"
                            :key="item.DetailID"
                            :label="item.DetailName"
                            :value="item.DetailID">
                        </el-option>
                    </el-select>
                    <el-checkbox v-model="form.includeProject" :disabled="includeProjectDisabled" style="margin-right:10px;">包含部门下所有项目</el-checkbox>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import { findPaymentChargecheck,getDepartments,findAllRetiredStaffs,getOutBill,getOutBillDetail,getBankAccount } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import DueFindItem from '@/page/office/dueFind/DueFindItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'BorrowFindList',
    data(){
        return {
            form: {
                startID:"",
                endID:"",
                expenseStartID:"",
                expenseEndID:"",
                fillDateFrom:"",
                fillDateTo:"",
                chargeDateFrom:"",
                chargeDateTo:"",
                payDateFrom:"",
                payDateTo :"",
                returnDateFrom:"",
                returnDateTo:"",
                hasInvoice:"-1",
                payType:"-1",
                departmentID:"-1",
                fillStaffID:"",
                status:"",
                bankAccountID:"",
                outBillType:"-1",
                outBillID:"-1",
                includeProject:false,
                fillStaff:[],
                dateType:"0",
                outBillList:[],
                outBillDetailList:[{"DetailID":'-1',"DetailName":'全部'}],
                bankArr:[],
                departmentArr:[],
                statusArr:[
                    {value:"-2",label:"全部"},
                    {value:"0",label:"待签字"},
                    {value:"1",label:"待支付"},
                    {value:"2",label:"处理完毕"},
                    {value:"-1",label:"未通过审批"},
                ],
                sortID:"ChargeDate",
                sortArr:[{
                    id:"StaffName",
                    name:"填表人姓名"
                },{
                    id:"FillDate",
                    name:"填表日期"
                },{
                    id:"ChargeDate",
                    name:"费用发生日期"
                },{
                    id:"PayDate",
                    name:"支付日期"
                },{
                    id:"State",
                    name:"任务状态"
                }],
                dateRange:"",
            },
            isNoData:false,
            dialogVisible:false,
            clickItem:{},
            pageNo : 1,
            dueFindList:[],
            pageSize:15,
            currentPage:1,
            isDisabled:false,
            checked:false,
            outBillIDDisabled:false,
            includeProjectDisabled:true,
            itemNum:0,
            itemMoney:0,
            Summary:"",
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
                }]
            },
        }
    },
    components:{
        NoData,
        ChatHeader,
        DueFindItem
    },
    mounted(){
        this.findAllstaffs();
        this.getOutBill();
        this.getBankAccount();
        this.getDepartments();
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        dateTypeName(){
            if (this.form.dateType=="0") {
                return "填表日期"
            }else if (this.form.dateType=="1") {
                return "费用发生日期"
            }else if (this.form.dateType=="2") {
                return "支付日期"
            }
        },
    },
    methods:{
        confirm(){
            this.dialogVisible = false;
            this.dueFindList = [];
            this.loadList(true);
        },
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            let startID = this.form.startID!=""?this.form.startID:"-1";
            let endID = this.form.endID!=""?this.form.endID:"-1";
            let expenseStartID = this.form.expenseStartID!=""?this.form.expenseStartID:"-1";
            let expenseEndID = this.form.expenseEndID!=""?this.form.expenseEndID:"-1";
            let returnDateFrom = this.form.returnDateFrom!=""?this.form.returnDateFrom:"-1";
            let returnDateTo = this.form.returnDateTo!=""?this.form.returnDateTo:"-1";
            let hasInvoice = this.form.hasInvoice!=""?this.form.hasInvoice:"-1";
            let payType = this.form.payType!=""?this.form.payType:"-1";
            let departmentID = this.form.departmentID!=""?this.form.departmentID:"-1";
            let fillStaffID = this.form.fillStaffID!=""?this.form.fillStaffID:"-1";
            let status = this.form.status!=""?this.form.status:"-2";
            let bankAccountID = this.form.bankAccountID!=""?this.form.bankAccountID:"-2";
            let outBillType = this.form.outBillType!=""?this.form.outBillType:"-1";
            let outBillID = this.form.outBillID!=""?this.form.outBillID:"-1";
            let includeProject = this.form.includeProject?"1":"0";
            let sort = this.form.sortID;
            let startDate = this.form.dateRange?this.form.dateRange[0]:"";
            let endDate = this.form.dateRange?this.form.dateRange[1]:"";
            let dateType = this.form.dateType;

            // staffID,startDate,endDate,payType,departmentId,fillStaffId,startID,endID,expenseStartID,expenseEndID,status,bankAccountID,dateType,sort
            let loading = showLoading();
            findPaymentChargecheck(staffID,startDate,endDate,payType,departmentID,fillStaffID,startID,endID,expenseStartID,expenseEndID,status,bankAccountID,dateType,sort).then((result)=>{
                closeLoading(loading);
                this.dueFindList = result.data.data;
                this.Summary = result.data.Summary;
                this.itemNum = result.data.totalCount;
                this.itemMoney = result.data.TotalMoney?result.data.TotalMoney:"0";
                if(this.dueFindList.length==0){
                    this.isNoData = true;
                    this.itemNum = 0;
                    this.itemMoney = 0;
                }else{
                    this.isNoData = false;
                }
            })
            .catch((err)=>{
                console.log(err)
                alertError(this,"1174");
                closeLoading(loading);
            });
        },
        getOutBill(){
            let cosNum = this.userInfo.cosNum;
            let obj = {value:'-1',label:'全部'};
            this.form.outBillList.push(obj);
            getOutBill(cosNum,2).then((result)=>{
                for (let i = 0; i < result.data.data.length; i++) {
                    let obj1 = {value:"",label:""}
                    obj1.value = result.data.data[i].OutBill;
                    obj1.label = result.data.data[i].OutBill;
                    this.form.outBillList.push(obj1);
                }
            }).catch((err)=>{
                alertError(this,"1172");
            });
        },
        changeOutBillType(){
            let value = this.form.outBillType;
            this.form.outBillDetailList = [];
            let obj = {"DetailID":'-1',"DetailName":'全部'};
            this.form.outBillID = "-1";
            this.form.outBillDetailList.push(obj);
            if (value=="业务部门成本") {
                this.includeProjectDisabled = false;
                this.form.includeProject = 1;
            }else{
                this.includeProjectDisabled = true;
                this.form.includeProject = 0;
            }
            if (value == "-1") {
                this.outBillIDDisabled = false;
            }else if (value == "企业成本") {
                this.outBillIDDisabled = true;
            }else{
                this.outBillIDDisabled = false;
                this.getOutBillDetail(value);
            }
        },
        getOutBillDetail(value){
            let cosNum = this.userInfo.cosNum;
            let outBill = value;
            getOutBillDetail(cosNum,outBill).then((result)=>{
                for (let i = 0; i < result.data.data.length; i++) {
                    let obj1 = {"DetailID":"","DetailName":""}
                    obj1.DetailID = result.data.data[i].DetailID;
                    obj1.DetailName = result.data.data[i].DetailName;
                    this.form.outBillDetailList.push(obj1);
                }
            }).catch((err)=>{
                alertError(this,"1172");
            });
        },
        getBankAccount(){
            let obj = {"BankAccountID":'-2',"BankTitle":'全部'};
            this.form.bankArr.push(obj);
            getBankAccount().then((result)=>{
                let arr = result.data.data
                for (let i = 0; i < result.data.data.length; i++) {
                    let obj1 = {"BankAccountID":"","BankTitle":""}
                    obj1.BankAccountID = result.data.data[i].BankAccountID;
                    obj1.BankTitle = result.data.data[i].BankTitle;
                    this.form.bankArr.push(obj1);
                }
            }).catch((err)=>{
                alertError(this,"1164");
            });
        },
        getDepartments(){
            let staffID = this.userInfo.userStaffID;
            let obj = {"DepID":'-1',"DepName":'全部'};
            this.form.departmentArr.push(obj);
            getDepartments(staffID).then((result)=>{
                let arr = result.data.data
                for (let i = 0; i < result.data.data.length; i++) {
                    let obj1 = {"DepID":"","DepName":""}
                    obj1.DepID = result.data.data[i].DepID;
                    obj1.DepName = result.data.data[i].DepName;
                    this.form.departmentArr.push(obj1);
                }
            }).catch((err)=>{
                alertError(this,"1176");
            });
        },
        changeStaffs(){
            if(this.checked){
                this.findAllRetiredStaffs();
            }else{
                this.findAllstaffs();
            }
        },
        findAllstaffs(){
            let staffs = [{
                value:'-1',
                label:'全部'
            }];
            for(let i=0;i<this.allStaffs.length;i++){
                let json = {  
                    value:this.allStaffs[i].StaffID,
                    label:this.allStaffs[i].StaffName
                }
                staffs.push(json);
            }
            this.form.fillStaff = staffs;
        },
        findAllRetiredStaffs(){
            let AllRetiredStaffs;
            let AllRetiredStaffsArr = [];
            let loading = showLoading();
            findAllRetiredStaffs().then((result)=>{
                closeLoading(loading);
                if(result){
                    if(result.data.data.length>0){
                        AllRetiredStaffs = result.data.data;
                        for(var i=0;i<AllRetiredStaffs.length;i++){
                            var json = {
                                value:AllRetiredStaffs[i].StaffID,
                                label:AllRetiredStaffs[i].StaffName
                            }
                            AllRetiredStaffsArr.push(json);
                        }
                        this.form.fillStaff = this.form.fillStaff.concat(AllRetiredStaffsArr);
                    }
                }
            }).catch((err)=>{
                alertError(this,"1053");
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.BorrowFindList{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .dueFindList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.dueFindList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .dueFindList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .dueFindList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.addbtn{
    float: right;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>