<template>
    <div class="borrow">
        <chat-header :showBack="true" :title="'应付款'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;" :style="{bottom20:$route.meta.type=='stop'}">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <!-- <el-form-item style="color:#8f8f94;">
                    延期支付报销记录
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
                </el-form-item> -->
                <!-- <el-form-item>
                    <el-button type="primary" size="medium" @click="loadExpenseDetail">查看报销信息</el-button>
                </el-form-item> -->
                <el-form-item style="float:right" v-show="$route.meta.type!='stop'">
                    <el-button type="primary" size="medium" @click="addDueExpenseID" style="margin-bottom:10px;">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="dueExpenseList">
            <due-expense-id-item v-for="item in dueExpenseList" :key="item.num" :item="item" @deleteDueExpenseID="deleteDueExpenseID"></due-expense-id-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogFormVisible"
            width="30%">
            <span>是否删除该延期支付</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { yqPaymentChargeList } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import dueExpenseIdItem from '@/page/office/dueExpense/DueExpenseIdItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'DueExpenseIdList',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[]
            },
            isNoData:false,
            dueExpenseList:[],
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
            currBookChargeID:''
        }
    },
    components:{
        NoData,
        ChatHeader,
        dueExpenseIdItem
    },
    mounted(){
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
        loadExpenseDetail(){
            this.$router.push(this.$route.fullPath+"/detail");
        },
        addDueExpenseID(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        loadList(){
            let staffID = this.userInfo.userStaffID;
            let loading = showLoading();
            yqPaymentChargeList('1',staffID,this.$route.params.expenseID).then((result)=>{
                this.dueExpenseList = [];
                closeLoading(loading);
                for(let i=0;i<result.data.data.length;i++){
                    this.dueExpenseList.push(result.data.data[i]);
                }
                if(this.dueExpenseList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                alertError(this,"1317");
                closeLoading(loading);
            });
        },
        deleteDueExpenseID(item){
            this.dialogFormVisible = true;
            this.clickItem = item;
        },
        confirmDelete(){
            
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
/* .dueExpenseList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.dueExpenseList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .dueExpenseList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .dueExpenseList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.bottom20{
    padding-bottom:20px;
}
</style>