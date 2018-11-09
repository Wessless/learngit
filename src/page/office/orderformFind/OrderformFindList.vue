<template>
    <div class="OrderformFindList">
        <chat-header :showBack="true" :title="'订单查询'"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item>
                    <span style="color:#999;margin-left:10px;">共{{ this.itemNum }}条</span>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" @click="dialogVisible=true">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="orderformFindList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Orderform-Find-item v-for="item in orderformFindList" :key="item.num" :item="item"></Orderform-Find-item>
        </div>
        <el-dialog title="查询条件" :visible.sync="dialogVisible" width="55%">

            <el-form :model="form" label-width="120px">
                <el-form-item :label="'用户名称'">
                    <el-input v-model="form.userName" size="small" clearable style="width:206px;" placeholder="请输入用户名称"></el-input>
                    <label style="color:#606266;margin:0 8px 0 32px;">销售员</label>
                    <el-input v-model="form.actualName" size="small" clearable style="width:206px;" placeholder="请输入销售员"></el-input>
                </el-form-item>

                <el-form-item :label="'订单状态'">
                    <el-select v-model="form.status" size="small" filterable :placeholder="'请选择订单状态'" style="width:206px;">
                        <el-option
                            v-for="item in statusArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <label style="color:#606266;margin:0 8px 0 32px;">经销商</label>
                    <el-input v-model="form.dealer" size="small" clearable style="width:206px;" placeholder="请输入经销商"></el-input>
                </el-form-item>

                <el-form-item style="padding:0px;margin:0px;">
                    <div style="width:502px;">
                        <el-radio v-model="form.dateType" label="1">审批时间</el-radio>
                        <el-radio v-model="form.dateType" label="2">出库时间</el-radio>
                        <el-radio v-model="form.dateType" label="3">收费时间</el-radio>
                    </div>
                </el-form-item>

                <!-- <el-form-item :label="dateTypeName">
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

                <el-form-item :label="'银行账户'">
                    <el-select v-model="form.bankAccountID" :disabled="bankDisabled" size="small" filterable :placeholder="'请选择银行账户'" style="width:501px;">
                        <el-option
                        v-for="item in form.bankArr"
                            :key="item.BankAccountID"
                            :label="item.BankTitle"
                            :value="item.BankAccountID">
                        </el-option>
                    </el-select>
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

import { getCommodityOrderApplyMessage,getBankAccount } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import OrderformFindItem from '@/page/office/orderformFind/OrderformFindItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'OrderformFindList',
    data(){
        return {
            form: {
                userName:"",
                userNum:"",
                actualName:"",
                status:"-1",
                dealer:"",
                signBeginDate:"",
                signEndDate:"",
                stockoutBeginDate:"",
                stockoutEndDate:"",
                chargeBeginDate:"",
                chargeEndDate:"",
                bankAccountID:"-1",
                bankArr:[],
                dateType:"1",
                dateRange:"",
            },
            isNoData:false,
            dialogVisible:false,
            orderformFindList:[],
            pageSize:10,
            currentPage:1,
            isDisabled:false,
            itemNum:"",
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
        OrderformFindItem
    },
    mounted(){
        this.getBankAccount();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        dateTypeName(){
            if (this.form.dateType=="1") {
                return "审批时间"
            }else if (this.form.dateType=="2") {
                return "出库时间"
            }else if (this.form.dateType=="3") {
                return "收费时间"
            }
        },
        statusArr(){
            let arr;
            arr = [
                    {value:"-1",label:"全部"},
                    {value:"1",label:"待审批"},
                    {value:"2",label:"待费用收取"},
                    {value:"3",label:"已处理完毕"},
                    {value:"6",label:"待出库"},
                  ]
            return arr
        },
        bankDisabled(){
            if (this.form.dateType=="1") {
                return false
            }else{
                this.form.bankAccountID = "-1";
                return true
            }
        },
        
    },
    methods:{
        confirm(){
            this.dialogVisible = false;
            this.orderformFindList = [];
            this.loadList(true);
        },
        loadList(reload){
        // "staffID":登陆人ID
        // "userName":用户名称，-1表示全部
        // "userNum":用户编号，-1表示全部
        // "actualName":销售员，-1表示全部
        // "signBeginDate":审批时间起，-1表示全部，格式：2017-01-01
        // "signEndDate":审批时间止，-1表示全部，格式：2017-01-01
        // "stockoutBeginDate":出库时间起，-1表示全部，格式：2017-01-01
        // "stockoutEndDate":出库时间止，-1表示全部，格式：2017-01-01
        // "status":订单状态，-1表示全部，1：待审批，2：待费用收取，3：已处理完毕，6：待出库
        // "dealer":经销商名称，-1表示全部
        // "chargeBeginDate":收费时间起，-1表示全部，格式：2017-01-01
        // "chargeEndDate":收费时间止，-1表示全部，格式：2017-01-01
        // "bankAccountID":银行账户ID，-1表示全部
        // "searchText"：检索，查询的话不传即可。查询范围：用户名称、ID、订单号
            let staffID = this.userInfo.userStaffID;
            let userName = this.form.userName!=""?this.form.userName:"-1";
            let userNum = this.form.userNum!=""?this.form.userNum:"-1";
            let actualName = this.form.actualName!=""?this.form.actualName:"-1";
            let signBeginDate = "-1";
            let signEndDate = "-1";
            let stockoutBeginDate = "-1";
            let stockoutEndDate = "-1";
            let status = this.form.status!=""?this.form.status:"-1";
            let dealer = this.form.dealer!=""?this.form.dealer:"-1";
            let chargeBeginDate = "-1";
            let chargeEndDate = "-1";
            let bankAccountID = this.form.bankAccountID!=""?this.form.bankAccountID:"-1";
            let searchText = "";
            
            if (this.form.dateType=="1") {
                signBeginDate = this.form.dateRange?this.form.dateRange[0]:"";
                signEndDate = this.form.dateRange?this.form.dateRange[1]:"";
            }else if (this.form.dateType=="2") {
                stockoutBeginDate = this.form.dateRange?this.form.dateRange[0]:"";
                stockoutEndDate = this.form.dateRange?this.form.dateRange[1]:"";
            }else if (this.form.dateType=="3") {
                chargeBeginDate = this.form.dateRange?this.form.dateRange[0]:"";
                chargeEndDate = this.form.dateRange?this.form.dateRange[1]:"";
            }

            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getCommodityOrderApplyMessage(this.currentPage,this.pageSize,staffID,userName,userNum,
                actualName,signBeginDate,signEndDate,stockoutBeginDate,stockoutEndDate,
                status,dealer,chargeBeginDate,chargeEndDate,bankAccountID,searchText).then((result)=>{
                    // return;
                    if(reload){
                        this.orderformFindList = [];
                    }
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        this.orderformFindList.push(result.data.data[i]);
                    }
                    this.itemNum = result.data.totalCount;
                    if(this.orderformFindList.length==0){
                        this.isNoData = true;
                        this.itemNum = 0;
                    }else{
                        this.isNoData = false;
                    }
                }).catch((err)=>{
                    alertError(this,"1149");
                });
            }
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
        // changeStartDate(value){
        //     // signBeginDate:"",
        //     // signEndDate:"",
        //     // stockoutBeginDate:"",
        //     // stockoutEndDate:"",
        //     // chargeBeginDate:"",
        //     // chargeEndDate:"",
        //     if (this.form.dateType=="1") {
        //         this.form.signBeginDate = value;
        //     }else if (this.form.dateType=="2") {
        //         this.form.stockoutBeginDate = value;
        //     }else if (this.form.dateType=="3") {
        //         this.form.chargeBeginDate = value;
        //     }
        // },
        // changeEndDate(value){
        //     if (this.form.dateType=="1") {
        //         this.form.signEndDate = value;
        //     }else if (this.form.dateType=="2") {
        //         this.form.stockoutEndDate = value;
        //     }else if (this.form.dateType=="3") {
        //         this.form.chargeEndDate = value;
        //     }
        // },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.OrderformFindList{
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
/* .orderformFindList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.orderformFindList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .orderformFindList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .orderformFindList{
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