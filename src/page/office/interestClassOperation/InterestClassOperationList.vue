<template>
    <div class="interertClassChild">
        <chat-header :showBack="true" :title="'兴趣班收费操作'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="form.ClassID" style="margin-left:10px;" @change="reloadList" filterable size="medium" placeholder="请选择班级">
                        <el-option
                        v-for="item in form.allClass"
                        :key="item.ID"
                        :label="item.ClassName"
                        :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="float:right;">
                   <label class="startClass_label">共{{AllNum}}条记录</label>
                </el-form-item>
                <el-form-item style="float:right;">
                   <label class="startClass_label">合计{{form.allPaymentNums}}元</label>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="employTeacherList">
            <Interest-Class-Operation-item v-for="item in employTeacherList" :key="item.num" :item="item" @clickBuild="clickBuild" @clickCharge="clickCharge"></Interest-Class-Operation-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>确定要对该缴费信息生成收据吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBuild">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="statusDialogVisible" width="32%">
            <el-form :model="form" label-width="70px">
               <el-form-item :label="'缴费时间'">
                    <el-date-picker
                        v-model="form.dateTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        size="small"
                        style="margin-left:20px;"
                        placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="'缴费方式'">
                    <el-radio v-model="form.radio" label="0" style="margin-left:20px;">现金</el-radio>
                    <el-radio v-model="form.radio" label="2" style="margin-left:20px;">刷卡</el-radio>
                    <el-radio v-model="form.radio" label="3" style="margin-left:20px;">转账</el-radio>
                </el-form-item>
                <label class="startClass_label1">请您再次核实本次的收退费金额，请确保已经收钱再点击确定按钮。</label>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="statusDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmCharge">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getPaymentTaskForCashier,getClasses,paymentTaskByHand } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import InterestClassOperationItem from '@/page/office/interestClassOperation/InterestClassOperationItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'interertClassChild',
    data(){
        return {
            form:{
                radio:"0",
                ClassID:"",
                allClass:[],
                dateTime:"",
                allPaymentNums:"",
            },
            employTeacherList:[],
            pageNo:1,
            pageSize:1000,
            isNoData:false,
            dialogVisible:false,
            statusDialogVisible:false,
            clickItem:{},
        }
    },
    components:{
        NoData,
        ChatHeader,
        InterestClassOperationItem
    },
    mounted(){
        this.getClasses();
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
        AllNum(){
            let AllNum = this.employTeacherList.length;
            return AllNum;
        },
    },
    watch:{
        
    },
    methods:{
        reloadList(){
            let loading = showLoading();
            this.getPaymentTaskForCashier(loading);
        },
        getPaymentTaskForCashier(loading){
            let staffID = this.userInfo.userStaffID;
            getPaymentTaskForCashier(staffID,this.form.ClassID,this.pageNo,this.pageSize).then((result)=>{
                if(loading){
                    closeLoading(loading);
                }
                this.employTeacherList = result.data.data;
                this.form.allPaymentNums = result.data.totalnums;
                // console.log(this.form.allPaymentNums);
                if(this.employTeacherList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            })
            // .catch((err)=>{
            //     alertError(this,"1003");
            // });
        },
        getClasses(){
            let staffID = this.userInfo.userStaffID;
            let loading = showLoading();
            getClasses(staffID).then((result)=>{
                // console.log(result.data.data);
                this.form.allClass = result.data.data
                if(result.data.data.length>0){
                    this.form.ClassID = result.data.data[0].ID;
                    this.employTeacherList = [];
                    this.getPaymentTaskForCashier(loading);
                }else{
                    closeLoading(loading);
                    this.form.ClassID = "";
                    this.employTeacherList = [];
                }
            })
        }, 
        clickBuild(item){
            this.dialogVisible = true;
            this.clickItem = item;
        },
        clickCharge(item){
            this.statusDialogVisible = true;
            this.clickItem = item
        },
        confirmBuild(){
            this.dialogVisible = false;
        },
        confirmCharge(){
            this.statusDialogVisible = false;
            let paymentTaskID = this.clickItem.ID;
            let staffID = this.userInfo.userStaffID;
            let paymentDate = this.form.dateTime;
            let paymentWay = this.form.radio;
            let loading = showLoading();
            paymentTaskByHand(paymentTaskID,staffID,paymentDate,paymentWay).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message: '提交失败',
                        type: 'error'
                    });
                }
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interertClassChild{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .interertClassChild{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.employTeacherList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .employTeacherList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .employTeacherList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.startClass_label{
    color: #c0c4cc;
    font-weight: normal;
    margin-left: 10px;
}
.startClass_label1{
    color: #e51c23;
    font-weight: normal;
    transform: translateY(15px)
    /* margin-left: 10px; */
}
</style>