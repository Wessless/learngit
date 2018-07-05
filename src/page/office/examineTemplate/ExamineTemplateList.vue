<template>
    <div class="expense">
        <chat-header :showBack="true" :title="'考核模板'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="">
                    <el-radio v-model="formInline.pointType" label="5" @change="loadList(true)">五分制模板</el-radio>
                    <el-radio v-model="formInline.pointType" label="100" @change="loadList(true)">百分制模板</el-radio>
                    <el-checkbox v-model="formInline.showLoseTemplate" @change="loadList(true)" style="margin-left:30px;margin-right:20px;">显示已失效模板</el-checkbox>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addTemplate">添加</el-button>
                    <!-- <el-button type="danger" size="medium">删除</el-button> -->
                    <el-button size="medium" @click="setFlag">{{btnName}}</el-button>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="loadList(true)">查询</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <div class="templateList" v-infinite-scroll="loadList" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
            <examine-template-item v-for="item in templateList" :key="item.TemplateID" :item="item"></examine-template-item>
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

import { getChargeBill,getBankAccount,payChargeBill,getTemplate,setTemplateInvalid } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import examineTemplateItem from '@/page/office/examineTemplate/ExamineTemplateItem'

export default {
    name: 'ExamineTemplate',
    data(){
        return {
            formInline: {
                pointType:'5',
                showLoseTemplate:false,
            },
            templateList:[],
            bankList:[],
            pageSize:21,
            currentPage:1,
            hasData:true,
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
        ChatHeader,
        examineTemplateItem
    },
    mounted(){
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
        ]),
        btnName(){
            if(this.formInline.showLoseTemplate){
                return "标记为有效";
            }else{
                return "标记为失效";
            }
        }
    },
    watch:{
    },
    methods:{
        loadList(reload){
            let pointType = this.formInline.pointType;
            let isValid = this.formInline.showLoseTemplate ? "0" : "1";
            if(reload){
                this.currentPage = 1;
                this.hasData = true;
            }
            if(this.hasData){
                let loading = showLoading();
                getTemplate(this.currentPage,this.pageSize,pointType,isValid).then((result)=>{
                    if(reload){
                        this.templateList = [];
                    }
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.hasData = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        result.data.data[i].selected = false;
                        this.templateList.push(result.data.data[i]);
                    }
                });
            }
        },
        loadBank(){
            getBankAccount().then((result)=>{
                this.bankList = result.data.data;
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
        },
        addTemplate(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        setFlag(){
            let ids = [];
            for(let i=0;i<this.templateList.length;i++){
                if(this.templateList[i].selected){
                    ids.push(this.templateList[i].TemplateID);
                }
            }
            if(ids.length==0){
                this.$message({
                    message: '请选择模板'
                });
                return;
            }
            let id = ids.join(",");
            let isValid = this.formInline.showLoseTemplate?"1":"0";
            setTemplateInvalid(id,isValid).then((result)=>{
                if(result.data.Result=="1"){
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                    this.loadList(true);
                }else{
                    this.$message.error({
                        message: '设置失败'
                    });
                }
                
            });
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
}
/* .templateList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.templateList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .templateList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .templateList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>