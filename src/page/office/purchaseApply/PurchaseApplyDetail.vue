<template>
    <div class="PurchaseApplyDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="$route.meta.type!='detail'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="90px" style="width:100%;">
            <el-form-item label="代申请人">
                <el-input v-model="form.ApplyerName" size="small" style="width:465px;" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="实际申请人">
                <el-input v-model="form.ActualName" size="small" style="width:465px;"></el-input>
            </el-form-item>
            <el-form-item label="物品名称">
                <el-input v-model="form.GoodsName" size="small" style="width:465px;"></el-input>
                <b class="redColor">*必填</b>
            </el-form-item>
            <el-form-item label="物品类别">
                <el-select v-model="form.GoodsSortName" filterable :placeholder="'请选择物品类别'" @change="handleChange" size="small" style="width:465px;padding-top:3px;padding-bottom:5px;">
                    <el-option
                        v-for="item in goodsSortsArr"
                        :key="item.SortID"
                        :label="item.SortName"
                        :value="item.SortName">
                    </el-option>
                </el-select>
                <b class="redColor">*必填</b>
            </el-form-item>
            <el-form-item label="预期价格">
                <el-input v-model="form.PossiblePrice" :placeholder="0" size="small" style="width:465px;"></el-input>
            </el-form-item>
            <el-form-item label="采购数量">
                <el-input v-model="form.Count" size="small" style="width:465px;"></el-input>
                <b class="redColor">*必填</b>
            </el-form-item>
        </el-form>
        <!-- <el-form ref="form" :model="form" label-width="300px" style="width:100%;">
            
        </el-form> -->
        <el-form ref="form" :model="form" label-width="90px" style="width:100%;">
            <el-form-item label="型号规格" class="ReceiveApplyDetail_signatory">
                <el-input
                    class="input_padding"
                    style="width:465px;"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="form.Size">
                </el-input>
            </el-form-item>
            <el-form-item label="采购理由" class="ReceiveApplyDetail_signatory">
                <el-input
                    class="input_padding"
                    style="width:465px;"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="form.Reason">
                </el-input>
            </el-form-item>
            <el-form-item label="批次号" class="ReceiveApplyDetail_signatory">
                <el-select v-model="form.SequenceNo" :placeholder="form.SequenceNo" size="small" style="width:140px;">
                    <el-option
                    v-for="item in form.SequenceNoArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" size="small" style="margin-left:10px;" @click="createSequenceNo()">生成新的批次号</el-button>
                <b class="labeleg1">同一批次号将于同批进行采购</b>
            </el-form-item>
             <el-form-item label="签字人" style="width:480px;" class="signature">
                <div>
                    <label class="labeleg" :disabled="true">{{this.form.PurchaseSigner1Name}}</label>
                </div>
                <div>
                    <label class="labeleg" :disabled="true">{{this.form.PurchaseSigner2Name}}</label>
                </div>
                <div>
                    <label class="labeleg" :disabled="true">{{this.form.PurchaseSigner3Name}}</label>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import {getPurchaseApplyDetailByAplyId,getGoodsSortMessage,updatePurchaseApplyInfo,addPurchaseApplyInfo,getAllSequenceNo} from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'PurchaseApplyDetail',
    data(){
        return {
            title:"",
            title1:"",
            detail:{},
            recordDialogVisible:false,
            goodsSortsArr:[],
            pageNo:1,
            pageSize:1000,
            form: {
                ApplyerName:"",
                ActualName:"",
                GoodsName:"",
                GoodsSortID:"",
                GoodsSortName:"",
                Count:"",
                Size:"",
                Reason:"",
                PossiblePrice:"",
                SequenceNo:"",
                hidActualstaffID:"",
                PurchaseSigner1Name:"",
                PurchaseSigner2Name:"",
                PurchaseSigner3Name:"",
                SequenceNoArr:[],
            },
        }
    },
    // props: {
    //     item:{
    //         type:Object
    //     }
    // },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="add"){
            this.title = "添加采购申请";
            this.loadAddPurchaseApplyDetail();
        }else if(this.$route.meta.type=="update"){
            this.title = "修改采购申请";
            this.loadUpdatePurchaseApplyDetail();
        }
    },      
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        dialogTitle(){
            return '物品 '+this.title1+' 的被申领情况为：'
        }
    },
    watch:{
    },
    methods:{ 
        // 点击确认提交申领申请
        confirm(){
            let json = {
                masterID : this.userInfo.userStaffID,
                goodsName : this.form.GoodsName, 
                ddlGoodsSort : this.form.GoodsSortID,
                count : this.form.Count,       
                size : this.form.Size,       
                reason : this.form.Reason,       
                possiblePrice : this.form.PossiblePrice,
                ddlSequenceNo : this.form.SequenceNo,
                hidActualstaffID : this.form.hidActualstaffID
            }
            if (this.form.ActualName=="") {
               json.hidActualstaffID = -1;
            }
            if (this.form.PossiblePrice=="") {
               json.possiblePrice = 0;
            }
            if(json.goodsName==""){
                this.$message.error({
                    message:"请填写物品名称"
                });
                return;
            }
            if(json.ddlGoodsSort==""){
                this.$message.error({
                    message:"请选择物品类别"
                });
                return;
            }
            if(json.count==""){
                this.$message.error({
                    message:"请填写采购数量"
                });
                return;
            }
            //修改
            if(this.$route.meta.type=="update"){
                json.applyID = this.$route.params.applyId;
                let loading = showLoading();
                updatePurchaseApplyInfo(json).then((result)=>{
                    closeLoading(loading);
                    console.log(result)
                    if(result.data.ret=='1'){
                        this.$message({
                            message:"修改成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else if(result.data.ret=='0'){
                        this.$message({
                            message:"修改失败",
                        });
                    }
                }).catch((err)=>{
                    closeLoading(loading);
                    alertError(this,"2152");
                });
            }
            //添加
            if (this.$route.meta.type=="add") {
                let loading = showLoading();
                console.log(json);
                addPurchaseApplyInfo(json).then((result)=>{
                    closeLoading(loading);
                    if(result.data.ret=='1'){
                        this.$message({
                            message:"添加成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"添加失败"
                        });
                    }
                }).catch((err)=>{
                    alertError(this,"2151");
                });
            }
        },
        //加载修改
        loadUpdatePurchaseApplyDetail(){
            let ApplyID = this.$route.params.applyId;
            // let loading = showLoading();
            getPurchaseApplyDetailByAplyId(ApplyID)
            .then((result)=>{
                let obj = result.data.data;
                console.log(obj)
                this.form.GoodsID = obj[0].GoodsId?obj[0].GoodsId:"";
                this.form.ApplyerName = obj[0].ApplyerName?obj[0].ApplyerName:"";
                this.form.ActualName = obj[0].ActualName?obj[0].ActualName:"";
                this.form.GoodsName = obj[0].GoodsName?obj[0].GoodsName:"";
                this.form.GoodsSortID = obj[0].GoodsSortID?obj[0].GoodsSortID:"";
                this.loadGoodsSort(this.form.GoodsSortID);
                this.form.Count = obj[0].Count?obj[0].Count:"";
                this.form.Size = obj[0].Size?obj[0].Size:"";
                this.form.Reason = obj[0].Reason?obj[0].Reason:"";
                this.form.PossiblePrice = obj[0].PossiblePrice?obj[0].PossiblePrice:"";
                this.form.SequenceNo = obj[0].SequenceNo?obj[0].SequenceNo:"";
                this.form.hidActualstaffID = obj[0].hidActualstaffID?obj[0].hidActualstaffID:"";
                this.form.PurchaseSigner1Name = obj[0].PurchaseSigner1Name?obj[0].PurchaseSigner1Name:"";
                this.form.PurchaseSigner2Name = obj[0].PurchaseSigner2Name?obj[0].PurchaseSigner2Name:"";
                this.form.PurchaseSigner3Name = obj[0].PurchaseSigner3Name?obj[0].PurchaseSigner3Name:"";
            }).catch((err)=>{
                alertError(this,"1235");
            });
            this.getAllSequenceNo();
        },
        //加载添加
        loadAddPurchaseApplyDetail(){
            this.form.ApplyerName = this.userInfo.userName;
            this.loadGoodsSort();
            this.getAllSequenceNo();
        },
        loadGoodsSort(GoodsSortID){
            let cosNum = this.userInfo.cosNum;
            let staffID = this.userInfo.userStaffID;
            getGoodsSortMessage(cosNum,this.pageNo,this.pageSize,staffID).then((result)=>{
                this.goodsSortsArr = result.data.data;
                //
                if(GoodsSortID!=""){
                    for (let i = 0; i < this.goodsSortsArr.length; i++) {
                        if(this.goodsSortsArr[i].SortID==GoodsSortID){
                            this.form.GoodsSortName = this.goodsSortsArr[i].SortName;
                        }
                    }
                }
            }).catch((err)=>{
                alertError(this,"1188");
            });
        },
        handleChange(value) {
            let staffID = this.userInfo.userStaffID;
            for (let i = 0; i < this.goodsSortsArr.length; i++) {
                if(this.goodsSortsArr[i].SortName==value){
                    this.form.GoodsSortID = this.goodsSortsArr[i].SortID;
                }
            }
        }, 
        createSequenceNo(){
            let date = new Date()
            let year = date.getFullYear().toString().substring(2,4);
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            let strHours = date.getHours();
            let strMinutes = date.getMinutes();
            let strSeconds = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (strHours >= 0 && strHours <= 9) {
                strHours = "0" + strHours;
            }
            if (strMinutes >= 0 && strMinutes <= 9) {
                strMinutes = "0" + strMinutes;
            }
            if (strSeconds >= 0 && strSeconds <= 9) {
                strSeconds = "0" + strSeconds;
            }
            this.form.SequenceNo = year + month + strDate + strHours + strMinutes + strSeconds;
        },
        getAllSequenceNo(){
            getAllSequenceNo().then((result)=>{
                let Arr = result.data.data;
                let sequenceNo = [{
                    value:"",
                    label:"空"
                }];
                for(var i=1;i<Arr.length;i++){
                    let json = {
                        value:Arr[i],
                        label:Arr[i]
                    }
                    sequenceNo.push(json);
                }
                this.form.SequenceNoArr = sequenceNo;
            }).catch((err)=>{
                alertError(this,"1242");
            }) 
        }  
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.PurchaseApplyDetail{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    padding-top:74px;
    position: relative;
}
.el-form-item {
    margin-bottom: 0px;
}
.el-input__inner:disabled{
    color:#606266 !important; 
}
.labeleg{
    text-align: left;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.labeleg1{
    margin-left: 11px;
    color:#c0c4cc;
}
.redColor{
    padding-left: 10px;
    color: red;
    font-weight: normal;
}
.labeleg[disabled=disabled]{
    color:#c0c4cc;
}
@media screen and (max-width: 1030px) {
    .labeleg1{
        float: left;
    }
}
.information{
    width: 90px;
    height: 40px;
    color:#38ADFF;
    margin-left: 10px;
    font-weight: normal;
    cursor: pointer;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0px 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.input_move{
    transform: translateY(-15px);
}
.input_padding{
    padding: 5px 0 8px 0;
}
.signature div:not(:first-child){
    float: left;
    margin-left: 40px;
}

</style>