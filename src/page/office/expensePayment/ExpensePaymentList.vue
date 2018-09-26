<template>
    <div class="expense">
        <chat-header :showBack="true" :title="'报销支付'" :showRightBtn="true" :rightBtnTitle="'提示'" :rightBtnName="'showInfo'" @showInfo="showInfo"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <!-- <el-form-item label="">
                    <el-input v-model="formInline.fileName" placeholder="请输入文件名"></el-input>
                </el-form-item> -->
                <el-form-item label="">
                    <el-select v-model="formInline.staffID" filterable placeholder="请选择同事">
                        <el-option
                        v-for="item in formInline.staffs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadList(true)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="expenseList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <expense-payment-item v-for="item in expenseList" :key="item.num" :item="item" @clickPayMoney="clickPayMoney"></expense-payment-item>
        </div>
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item :label="'支付日期'" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="form.payDate"
                        type="date"
                        :disabled="form.isSettingDate"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :placeholder="'选择日期'">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <el-checkbox label="设定为填表日期" v-model="form.isSettingDate" @change="inputChange" ></el-checkbox>
                    <el-checkbox label="设定为延期付款（进入应付款账目）" v-model="form.isDeferPayment" @change="inputChange"></el-checkbox>
                </el-form-item>
                <el-form-item :label="'银行账号'" :label-width="formLabelWidth">
                    <el-select v-model="form.bankAccount" :disabled="form.isDeferPayment" filterable :placeholder="'请选择银行账号'">
                        <el-option
                        v-for="item in bankList"
                            :key="item.BankAccountID"
                            :label="item.BankTitle"
                            :value="item.BankAccountID">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmPayment">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import { getChargeBill,getBankAccount,payChargeBill } from '@/js/api'
import { showLoading,closeLoading ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import expensePaymentItem from '@/page/office/expensePayment/ExpensePaymentItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'ExpensePayment',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[]
            },
            isNoData:false,
            expenseList:[],
            bankList:[],
            pageSize:15,
            currentPage:1,
            isDisabled:false,
            dialogFormVisible: false,
            form: {
                payDate:'',
                bankAccount:'',
                isSettingDate:false,
                isDeferPayment:false,
            },
            formLabelWidth: '120px',
            currChargeBillID:''
        }
    },
    components:{
        NoData,
        ChatHeader,
        expensePaymentItem
    },
    mounted(){
        this.showInfo();
        this.loadBank();
        // 加载员工
        var staffs = [{
            value:'-1',
            label:'全部'
        }];
        for(var i=0;i<this.allStaffs.length;i++){
            var json = {
                value:this.allStaffs[i].StaffID,
                label:this.allStaffs[i].StaffName
            }
            staffs.push(json);
        }
        this.formInline.staffs = staffs;

    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ])
    },
    watch:{
    },
    methods:{
        showInfo(){
            this.$notify.info({
                title: '说明',
                message: '1）财务负责人有权限按下按钮。<br/>2）按下按钮之后，如果是支票，则将支票交给申请人，如果是汇款等，则由财务进行实际汇款操作。',
                dangerouslyUseHTMLString:true,
                duration: 0
            });
        },
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            // staffID = "0";
            let fillStaffID = this.formInline.staffID ? this.formInline.staffID : "-1";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getChargeBill(this.currentPage,this.pageSize,staffID,'-1','-1','-1','-1','-1','-1','-1','-1','-1','-1','-1',fillStaffID,'1','-1','-1','-1','-1','-1').then((result)=>{
                    if(reload){
                        this.expenseList = [];
                    }
                    console.log(result)
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        this.expenseList.push(result.data.data[i]);
                    }
                    if(this.expenseList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                }).catch((err)=>{
                    alertError(this,"1174");
                    closeLoading(loading);
            }   );
            }
        },
        loadBank(){
            getBankAccount().then((result)=>{
                this.bankList = result.data.data;
            }).catch((err)=>{
                alertError(this,"1164");
            });
        },
        clickPayMoney(item){
            this.form.payDate = '';
            this.form.bankAccount = '';
            this.form.isSettingDate = false;
            this.form.isDeferPayment = false;
            this.dialogFormVisible = true;
            this.currChargeBillID = item.ChargeBillID;
        },
        inputChange(){
            if(this.form.isSettingDate){
                this.form.payDate = '';
            }
            if(this.form.isDeferPayment){
                this.form.bankAccount = '';
            }
        },
        confirmPayment(){
            let payDate = this.form.isSettingDate?"":this.form.payDate;
            let bankAccount = this.form.isDeferPayment?"":this.form.bankAccount;
            if(payDate==""&&this.form.isSettingDate==false){
                this.$message.error({
                    message: '请选择支付日期',
                });
            }else if(bankAccount==""&&this.form.isDeferPayment==false){
                this.$message.error({
                    message: '请选择银行账号',
                });
            }else{
                payChargeBill(this.currChargeBillID,payDate,this.form.isSettingDate?"1":"0",this.form.isDeferPayment?"1":"0",bankAccount).then((result)=>{
                    if(result.data.Result==1){
                        this.$message({
                            message: '付款成功',
                            type: 'success'
                        });
                        this.loadList(true);
                    }else{
                        this.$message.error('付款失败');
                    }
                });
                this.dialogFormVisible = false;
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.expense{
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
/* .expenseList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.expenseList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .expenseList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .expenseList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>