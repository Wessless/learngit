<template>
    <div class="addNewChild">
        <chat-header :showBack="true" :title="'新生入园缴费'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addPaymentDialog">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="childInfoList">
            <new-child-payment-item v-for="(item,index) in paymentList" :key="index" :item="item" @deletePayment="deletePayment" @paymentMoney="paymentMoney"></new-child-payment-item>
        </div>
        <scroll-top></scroll-top>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该缴费记录</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="人工收费" :visible.sync="paymentDialogVisible">
            <el-form :model="formInline">
                <el-form-item label="缴费时间" :label-width="inputWidth">
                    <el-radio v-model="formInline.paymentTimeStatus" label="1" @change="changeDate">现在</el-radio>
                    <el-radio v-model="formInline.paymentTimeStatus" label="2" @change="changeDate">输入时间</el-radio>
                    <el-date-picker
                        v-model="formInline.paymentTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        size="small"
                        placeholder="请选择日期"
                        style="margin-left:10px;"
                        :disabled="formInline.paymentTimeStatus!='2'">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="缴费方式" :label-width="inputWidth">
                    <el-radio v-model="formInline.paymentMethod" label="0">现金</el-radio>
                    <el-radio v-model="formInline.paymentMethod" label="2">刷卡</el-radio>
                    <el-radio v-model="formInline.paymentMethod" label="3">各种转账(银行转账/微信转账/支付宝转账等)</el-radio>
                </el-form-item>
            </el-form>
            <div style="padding-left:12px;color:#e51c23;">请您再核实本次收退费金额，请确保已经收钱再点击确定按钮。</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="paymentDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmPayment">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加缴费" :visible.sync="addDialogVisible" width="30%">
            <el-form :model="form">
                <el-form-item label="学生姓名" :label-width="inputWidth">
                    <el-input v-model="form.childName" :disabled="true" size="small"></el-input>
                </el-form-item>
                <el-form-item label="通知手机" :label-width="inputWidth">
                    <el-input v-model="form.phone" size="small"></el-input>
                </el-form-item>
                <el-form-item label="缴费金额" :label-width="inputWidth">
                    <el-input v-model="form.paymentMoney" size="small"></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="inputWidth">
                    <el-input type="textarea" v-model="form.remark" size="small" :autosize="{ minRows: 3, maxRows: 3}"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addPayment">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getNewChildBeeList,getChildByChildID,addOrUpdateBeecellPublish,delBeecellPublish,payBeecellList } from '@/js/api'
import { showLoading,closeLoading,PhoneNumValid,alertError,dateTimeFormatter} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'
import newChildPaymentItem from '@/page/office/addNewChild/NewChildPaymentItem'
import ScrollTop from '@/components/chat/ScrollTop'

export default {
    name: 'NewChildPayment',
    data(){
        return {
            isNoData:false,
            formInline:{
                paymentTimeStatus:"1",
                paymentMethod:"0",
                paymentTime:""
            },
            form:{
                childName:"",
                childID:"",
                childNum:"",
                phone:"",
                paymentMoney:"",
                remark:""
            },
            inputWidth:"80px",
            dialogVisible:false,// 删除弹框
            paymentDialogVisible:false,// 缴费弹框
            addDialogVisible:false,// 添加弹框
            clickItem:{},// 当前点击的幼儿相关信息
            paymentList:[],// 幼儿缴费信息
        }
    },
    components:{
        ChatHeader,
        ScrollTop,
        NoData,
        newChildPaymentItem
    },
    mounted(){
        this.reloadList();
        // 获取幼儿信息
        let childID = this.$route.params.childID;
        getChildByChildID(childID).then((result)=>{
            let childInfo = result.data.data[0];
            this.form.childNum = childInfo.ChildNum;
            this.form.childName = childInfo.ChildName;
            this.form.phone = childInfo.ConnectPhone;
        }).catch((err)=>{
            alertError(this,"1040");
        });
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
        getHeaderCellClass({row, column, rowIndex, columnIndex}){
            return "note-attendance-height note-attendance-bg-blue"
        },
        changeDate(){
            this.formInline.paymentTime = "";
        },
        // 重新加载列表
        reloadList(){
            let loading = showLoading();
            this.getNewChildBeeList(loading);
        },
        getNewChildBeeList(loading){
            let childID = this.$route.params.childID;
            getNewChildBeeList(1,100,childID).then((result)=>{
                if(loading){
                    closeLoading(loading);
                }
                this.paymentList = result.data.data;
            }).catch((err)=>{
                alertError(this,"1298");
            });
        },
        // 点击缴费弹出缴费框
        paymentMoney(item){
            this.formInline.paymentTime = "";
            this.formInline.paymentTimeStatus = "1";
            this.formInline.paymentMethod = "0"
            this.paymentDialogVisible = true;
            this.clickItem = item;
        },
        // 人工收费
        confirmPayment(){
            let ids = this.clickItem.ID;
            let paymentWay = this.formInline.paymentMethod;
            let payDate = this.formInline.paymentTimeStatus;
            if(payDate=="1"){
                let date = new Date();
                payDate = dateTimeFormatter(date,'yyyy-MM-dd');
            }else{
                payDate = this.formInline.paymentTime;
            }
            payBeecellList(ids,paymentWay,payDate).then((result)=>{
                if(result.data.Result=="1"){
                    this.$message({
                        type:"success",
                        message:"收费成功"
                    });
                    this.paymentDialogVisible = false;
                    this.reloadList();
                }else{
                    this.$message({
                        type:"error",
                        message:"收费失败"
                    });
                }
            }).catch((err)=>{
                alertError(this,"2186");
            });
        },
        // 添加幼儿弹出框
        addPaymentDialog(){
            this.addDialogVisible = true;
        },
        // 添加
        addPayment(){
            let staffID = this.userInfo.userStaffID;
            let childID = this.$route.params.childID;
            let childName = this.form.childName;
            let phoneNum = this.form.phone;
            let childNum = this.form.childNum;
            let price = this.form.paymentMoney;
            let remark = this.form.remark;
            let cosNum = this.userInfo.cosNum;
            if(phoneNum==""){
                this.$message.error({
                    message:'请输入手机号'
                });
                return;
            }
            if(!PhoneNumValid(phoneNum)){
                this.$message.error({
                    message:'手机号码格式不正确'
                });
                return;
            }
            addOrUpdateBeecellPublish('-1',staffID,childID,childName,phoneNum,childNum,'-100',price,remark,cosNum).then((result)=>{
                if(result.data.Result=="1"){
                    this.$message({
                        type:"success",
                        message:"添加成功"
                    });
                    this.reloadList();
                }else{
                    this.$message({
                        type:"error",
                        message:"添加失败"
                    });
                }
                this.addDialogVisible = false;
            }).catch((err)=>{
                alertError(this,"2184");
                this.addDialogVisible = false;
            });
        },
        // 点击删除弹出删除框
        deletePayment(item){
            this.dialogVisible = true;  
            this.clickItem = item;
        },
        // 删除
        confirmDelete(){
            this.dialogVisible = false;
            delBeecellPublish(this.clickItem.ID).then((result)=>{
                if(result.data.Result=="1"){
                    this.$message({
                        type:"success",
                        message:"删除成功"
                    });
                    this.reloadList();
                }else{
                    this.$message({
                        type:"error",
                        message:"删除失败"
                    });
                }
            }).catch((err)=>{
                alertError(this,"2185");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.addNewChild{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .staffInfo{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.childInfoList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.downloadTemplate{
    color: #38adff;
    cursor: pointer;
}
</style>