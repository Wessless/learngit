<template>
    <div class="borrow">
        <chat-header :showBack="true" :title="'借款还款'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;">
            <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
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
            </el-form> -->
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="borrowList">
            <borrow-repayment-item v-for="item in borrowList" :key="item.num" :item="item" @clickPayMoney="clickPayMoney"></borrow-repayment-item>
        </div>
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item :label="'还款日期'" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="form.payDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :placeholder="'选择日期'">
                    </el-date-picker>
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

import { FinanceBookChargeList,setFinanceBookCharge } from '@/js/api'
import { showLoading,closeLoading,alertError,dateTimeFormatter} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import borrowRepaymentItem from '@/page/office/borrowRepayment/BorrowRepaymentItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'BorrowRepayment',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[]
            },
            isNoData:false,
            borrowList:[],
            pageSize:15,
            currentPage:1,
            dialogFormVisible: false,
            form: {
                payDate:'',
                bankAccount:'',
                isSettingDate:false,
                isDeferPayment:false,
            },
            formLabelWidth: '120px',
            currBookChargeID:''
        }
    },
    components:{
        NoData,
        ChatHeader,
        borrowRepaymentItem
    },
    mounted(){
        // 加载员工
        // var staffs = [{
        //     value:'-1',
        //     label:'全部'
        // }];
        // for(var i=0;i<this.allStaffs.length;i++){
        //     var json = {
        //         value:this.allStaffs[i].StaffID,
        //         label:this.allStaffs[i].StaffName
        //     }
        //     staffs.push(json);
        // }
        // this.formInline.staffs = staffs;
        this.loadList();
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
            let loading = showLoading();
            FinanceBookChargeList().then((result)=>{
                closeLoading(loading);
                this.borrowList = result.data.data;
                if(this.borrowList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
                console.log(result)
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1308");
            });
        },
        // 点击还款
        clickPayMoney(item){
            let date = new Date();
            this.form.payDate = dateTimeFormatter(date,'yyyy-MM-dd');
            // this.form.bankAccount = '';
            // this.form.isSettingDate = false;
            // this.form.isDeferPayment = false;
            this.dialogFormVisible = true;
            this.currBookChargeID = item.BookChargeID;
        },
        confirmPayment(){
            let payDate = this.form.payDate;
            if(payDate){
                setFinanceBookCharge(this.currBookChargeID,payDate).then((result)=>{
                    if(result.data.Result==1){
                        this.$message({
                            message: '标记成功',
                            type: 'success'
                        });
                        this.loadList();
                    }else{
                        this.$message.error('标记失败');
                    }
                });
                this.dialogFormVisible = false;
            }else if(payDate==""){
                this.$message.error({
                    message: '请选择还款日期',
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
/* .borrowList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.borrowList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .borrowList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .borrowList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>