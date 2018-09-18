<template>
    <div class="expense">
        <chat-header :showBack="true" :title="'借款凭证'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="">
                    <el-date-picker
                        v-model="formInline.daterange"
                        type="daterange"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width:400px;"
                        :clearable="false"
                        @change="loadList">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="排序方式">
                    <el-select v-model="formInline.sort" @change="loadList" :placeholder="'请选择'">
                        <el-option
                        v-for="item in formInline.sorts"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="loadList">查询</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="borrowList">
            <borrow-certificate-item v-for="item in borrowList" :key="item.num" :item="item" @clickChangeChargeDate="clickChangeChargeDate"></borrow-certificate-item>
        </div>
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item :label="'记账日期'" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="form.chargeDate"
                        type="date"
                        :disabled="form.isToday"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :placeholder="'选择日期'">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <el-checkbox label="设定为今天" v-model="form.isToday" @change="inputChange" ></el-checkbox>
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

import { chargeDateInput,bookChargeCheckList } from '@/js/api'
import { showLoading,closeLoading,alertError,dateTimeFormatter} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import borrowCertificateItem from '@/page/office/borrowCertificate/BorrowCertificateItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'BorrowCertificate',
    data(){
        return {
            formInline: {
                daterange: [],
                sorts:[{
                    id:'StaffName',
                    title:'填表人姓名'
                },{
                    id:'FillDate',
                    title:'填表日期'
                },{
                    id:'PayDate',
                    title:'支付日期'
                },{
                    id:'ChargeDate',
                    title:'记账日期'
                },
                {
                    id:'ReturnDate',
                    title:'还款日期'
                },
                {
                    id:'State',
                    title:'任务状态'
                }],
                sort:'FillDate'
            },
            isNoData:false,
            borrowList:[],
            isDisabled:false,
            dialogFormVisible: false,
            form: {
                chargeDate:'',
                isToday:false,
            },
            formLabelWidth: '120px',
            currBookChargeID:'',
        }
    },
    components:{
        NoData,
        ChatHeader,
        borrowCertificateItem
    },
    mounted(){
        let date = new Date();
        let startDate = new Date();
        startDate.setDate(1);
        this.formInline.daterange = [dateTimeFormatter(startDate,'yyyy-MM-dd'),dateTimeFormatter(date,'yyyy-MM-dd')];
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
            bookChargeCheckList(this.formInline.daterange[0],this.formInline.daterange[1],this.formInline.sort).then((result)=>{
                closeLoading(loading);
                this.borrowList = result.data.data;
                if(this.borrowList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                alertError(this,"1311");
                closeLoading(loading);
            });
        },
        clickChangeChargeDate(item){
            this.form.chargeDate = '';
            this.form.isToday = false;
            this.dialogFormVisible = true;
            this.currBookChargeID = item.BookChargeID;
        },
        inputChange(){
            if(this.form.isToday){
                this.form.chargeDate = '';
            }
        },
        confirmPayment(){
            let chargeDate = this.form.isToday?"":this.form.chargeDate;
            if(payDate==""&&this.form.isToday==false){
                this.$message.error({
                    message: '请选择记账日期',
                });
            }else{
                chargeDateInput(this.currBookChargeID,this.form.isToday?'1':'0',ChargeDate).then((result)=>{
                    if(result.data.Result==1){
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.loadList();
                    }else{
                        this.$message.error('修改失败');
                    }
                }).catch((err)=>{
                    alertError(this,"2200");
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