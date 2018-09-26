<template>
    <div class="borrow">
        <chat-header :showBack="true" :title="'应付款支付'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <!-- <el-form-item label="">
                    <el-input v-model="formInline.fileName" placeholder="请输入文件名"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="">
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
                    <el-button type="primary" @click="loadList">查询</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="dueList">
            <due-payment-item v-for="item in dueList" :key="item.num" :item="item" @clickPayMoney="clickPayMoney"></due-payment-item>
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

import { PaymentChargePayList,getBankAccount,setPaymentChargePay } from '@/js/api'
import { showLoading,closeLoading ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import DuePaymentItem from '@/page/office/duePayment/DuePaymentItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'BorrowPayment',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[]
            },
            isNoData:false,
            dueList:[],
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
            clickItem:{}
        }
    },
    components:{
        NoData,
        ChatHeader,
        DuePaymentItem
    },
    mounted(){
        this.loadList();
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
        loadList(){
            let staffID = this.userInfo.userStaffID;
            // staffID = "0";
            
                let loading = showLoading();
                PaymentChargePayList(staffID).then((result)=>{
                    this.dueList = [];
                    closeLoading(loading);
                    for(let i=0;i<result.data.data.length;i++){
                        this.dueList.push(result.data.data[i]);
                    }
                    if(this.dueList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                }).catch((err)=>{
                    alertError(this,"1319");
                    closeLoading(loading);
                });
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
            this.clickItem = item;
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
            let isNow = this.form.isSettingDate?'1':'0';
            let bankAccount = this.form.isDeferPayment?"":this.form.bankAccount;
            let isMoney = this.clickItem.PayType=='现金'?'1':'0';
            if((payDate||this.form.isSettingDate)&&bankAccount){
                let loading = showLoading();
                setPaymentChargePay(this.clickItem.ChargeBillID,isMoney,isNow,payDate,bankAccount).then((result)=>{
                    if(result.data.Result==1){
                        this.$message({
                            message: '付款成功',
                            type: 'success'
                        });
                        this.loadList();
                        this.dialogFormVisible = false;
                    }else{
                        this.$message.error('付款失败');
                    }
                    closeLoading(loading);
                }).catch(()=>{
                    alertError(this,'2211');
                    closeLoading(loading);
                });
            }else if(payDate==""){
                this.$message.error({
                    message: '请选择支付日期',
                });
            }else if(bankAccount==""){
                this.$message.error({
                    message: '请选择银行账号',
                });
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.borrow{
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
/* .dueList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.dueList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .dueList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .dueList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>