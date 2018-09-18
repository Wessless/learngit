<template>
    <div class="BorrowFindList">
        <chat-header :showBack="true" :title="'借款查询'"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item>
                    <span style="color:#999;margin-left:10px;">共{{ this.itemNum }}条，总金额：{{ this.itemMoney }}元</span>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" @click="dialogVisible=true">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="borrowFindList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Borrow-Find-item v-for="item in borrowFindList" :key="item.num" :item="item"></Borrow-Find-item>
        </div>
        <el-dialog title="查询条件" :visible.sync="dialogVisible" width="55%">
            <el-form :model="form" label-width="120px">
                <el-form-item :label="'单号'">
                    <el-input v-model="form.startID" size="small" style="width:240px;" placeholder="请输入起始单号"></el-input>
                    至
                    <el-input v-model="form.endID" size="small" style="width:240px;" placeholder="请输入截止单号"></el-input>
                </el-form-item>

                <el-form-item style="padding:0px;margin:0px;">
                    <div style="width:502px;">
                        <el-radio v-model="form.dateType" label="1">填表日期</el-radio>
                        <el-radio v-model="form.dateType" label="2">支付日期</el-radio>
                        <el-radio v-model="form.dateType" label="3">记账日期</el-radio>
                        <el-radio v-model="form.dateType" label="4">还款日期</el-radio>
                    </div>
                </el-form-item>

                <el-form-item :label="dateTypeName">
                    <el-date-picker
                        v-model="form.startDate"
                        type="date"
                        size="small"
                        style="width:240px;"
                        @change="changeStartDate"
                        placeholder="开始日期">
                    </el-date-picker>
                    至
                    <el-date-picker
                        v-model="form.endDate"
                        type="date"
                        size="small"
                        style="width:240px;"
                        @change="changeEndDate"
                        placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                
                <el-form-item :label="'预计是否有发票'">
                    <el-radio v-model="form.hasInvoice" label="-1">全部</el-radio>
                    <el-radio v-model="form.hasInvoice" style="margin-left:10px;" label="1">有</el-radio>
                    <el-radio v-model="form.hasInvoice" style="margin-left:10px;" label="0">无</el-radio>
                    <label style="color:#606266;margin:0 8px 0 32px;">填表人所在部门</label>
                    <el-select v-model="form.departmentID" size="small" filterable :placeholder="'请选择填表人所在部门'" style="width:200px;">
                        <el-option
                            v-for="item in form.departmentArr"
                            :key="item.DepID"
                            :label="item.DepName"
                            :value="item.DepID">
                        </el-option>
                    </el-select>
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

                <el-form-item :label="'资金出处'" class="smallTableHeight">
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
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import { getBookCharge,getDepartments,findAllRetiredStaffs,getOutBill,getOutBillDetail,getBankAccount } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import BorrowFindItem from '@/page/office/borrowFind/BorrowFindItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'BorrowFindList',
    data(){
        return {
            form: {
                startID:"",
                endID:"",
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
                dateType:"1",
                startDate:"",
                endDate:"",
                outBillList:[],
                outBillDetailList:[{"DetailID":'-1',"DetailName":'全部'}],
                bankArr:[],
                departmentArr:[],
                statusArr:[
                        {value:"-2",label:"全部"},
                        {value:"0",label:"待签字"},
                        {value:"1",label:"待支付"},
                        {value:"2",label:"待还款"},
                        {value:"3",label:"处理完毕"},
                        {value:"-1",label:"未通过审批"},
                      ],
            },
            isNoData:false,
            dialogVisible:false,
            clickItem:{},
            pageNo : 1,
            borrowFindList:[],
            pageSize:15,
            currentPage:1,
            isDisabled:false,
            checked:false,
            outBillIDDisabled:false,
            includeProjectDisabled:true,
            itemNum:0,
            itemMoney:0,
        }
    },
    components:{
        NoData,
        ChatHeader,
        BorrowFindItem
    },
    mounted(){
        this.findAllstaffs();
        this.getOutBill();
        this.getBankAccount();
        this.getDepartments();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        dateTypeName(){
            if (this.form.dateType=="1") {
                return "填表日期"
            }else if (this.form.dateType=="2") {
                return "支付日期"
            }else if (this.form.dateType=="3") {
                return "记账日期"
            }else if (this.form.dateType=="4") {
                return "还款日期"
            }
        },
    },
    methods:{
        confirm(){
            this.dialogVisible = false;
            this.borrowFindList = [];
            this.loadList(true);
        },
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            let startID = this.form.startID!=""?this.form.startID:"-1";
            let endID = this.form.endID!=""?this.form.endID:"-1";
            let fillDateFrom = this.form.fillDateFrom!=""?this.form.fillDateFrom:"-1";
            let fillDateTo = this.form.fillDateTo!=""?this.form.fillDateTo:"-1";
            let chargeDateFrom = this.form.chargeDateFrom!=""?this.form.chargeDateFrom:"-1";
            let chargeDateTo = this.form.chargeDateTo!=""?this.form.chargeDateTo:"-1";
            let payDateFrom = this.form.payDateFrom!=""?this.form.payDateFrom:"-1";
            let payDateTo = this.form.payDateTo!=""?this.form.payDateTo:"-1";
            let returnDateFrom = this.form.returnDateFrom!=""?this.form.returnDateFrom:"-1";
            let returnDateTo = this.form.returnDateTo!=""?this.form.returnDateTo:"-1";
            let hasInvoice = this.form.hasInvoice!=""?this.form.hasInvoice:"-1";
            let payType = this.form.payType!=""?this.form.payType:"-1";
            let departmentID = this.form.departmentID!=""?this.form.departmentID:"-1";
            let fillStaffID = this.form.fillStaffID!=""?this.form.fillStaffID:"-1";
            let status = this.form.status!=""?this.form.status:"-2";
            let bankAccountID = this.form.bankAccountID!=""?this.form.bankAccountID:"-1";
            let outBillType = this.form.outBillType!=""?this.form.outBillType:"-1";
            let outBillID = this.form.outBillID!=""?this.form.outBillID:"-1";
            let includeProject = this.form.includeProject?"1":"0";
            
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getBookCharge(this.currentPage,this.pageSize,staffID,startID,endID,
                fillDateFrom,fillDateTo,chargeDateFrom,chargeDateTo,payDateFrom,payDateTo,returnDateFrom,returnDateTo,hasInvoice,
                payType,departmentID,fillStaffID,status,bankAccountID,outBillType,
                outBillID,includeProject).then((result)=>{
                    if(reload){
                        this.borrowFindList = [];
                    }
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        this.borrowFindList.push(result.data.data[i]);
                    }
                    this.itemNum = result.data.totalCount;
                    this.itemMoney = result.data.TotalMoney?result.data.TotalMoney:"0";
                    if(this.borrowFindList.length==0){
                        this.isNoData = true;
                        this.itemNum = 0;
                        this.itemMoney = 0;
                    }else{
                        this.isNoData = false;
                    }
                })
                .catch((err)=>{
                    alertError(this,"1174");
                });
            }
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
            let obj = {"BankAccountID":'-1',"BankTitle":'全部'};
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
        changeStartDate(value){
            if (this.form.dateType=="1") {
                this.form.fillDateFrom = value;
            }else if (this.form.dateType=="2") {
                this.form.chargeDateFrom = value;
            }else if (this.form.dateType=="3") {
                this.form.payDateFrom = value;
            }else if (this.form.dateType=="4") {
                this.form.returnDateFrom = value;
            }
        },
        changeEndDate(value){
            if (this.form.dateType=="1") {
                this.form.fillDateTo = value;
            }else if (this.form.dateType=="2") {
                this.form.chargeDateTo = value;
            }else if (this.form.dateType=="3") {
                this.form.payDateTo = value;
            }else if (this.form.dateType=="4") {
                this.form.returnDateTo = value;
            }
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
/* .borrowFindList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.borrowFindList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .borrowFindList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .borrowFindList{
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