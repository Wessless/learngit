<template>
    <div class="PurchaseApplyDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="$route.meta.type!='detail'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="90px" style="width:100%;">
            <el-form-item label="代申请人">
                <el-input v-model="form.ApplyerName" size="small" style="width:465px;" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="实际申请人">
                <el-input v-model="form.ActualName" size="small" style="width:465px;" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="物品名称">
                <el-input v-model="form.GoodsName" size="small" style="width:465px;" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="物品类别">
                <el-select v-model="form.GoodsSortName" filterable :placeholder="'请选择物品类别'" :disabled="true" size="small" style="width:465px;padding-top:3px;padding-bottom:5px;">
                    <el-option
                        v-for="item in goodsSortsArr"
                        :key="item.SortID"
                        :label="item.SortName"
                        :value="item.SortName">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预期价格">
                <el-input v-model="form.PossiblePrice" :placeholder="0" size="small" :disabled="true" style="width:465px;"></el-input>
            </el-form-item>
            <el-form-item label="采购数量">
                <el-input v-model="form.Count" size="small" style="width:465px;" :disabled="true"></el-input>
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
                    :disabled="true"
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
                    :disabled="true"
                    placeholder="请输入内容"
                    v-model="form.Reason">
                </el-input>
            </el-form-item>
            <el-form-item label="批次号" class="ReceiveApplyDetail_signatory">
                <el-select v-model="form.SequenceNo" filterable :placeholder="form.SequenceNo" :disabled="true" size="small" style="width:140px;">
                    <!-- <el-option
                    v-for="item in GoodsMessage"
                        :key="item.GoodsID"
                        :label="item.GoodsName"
                        :value="item.GoodsName">
                    </el-option> -->
                </el-select>
                <el-button type="primary" size="small" style="margin-left:10px;" :disabled="true">生成新的批次号</el-button>
                <b class="labeleg1">同一批次号将于同批进行采购</b>
            </el-form-item>
            <!-- <el-form-item label="签字人" style="width:480px;" class="signature">
                <div>
                    <label class="labeleg" :disabled="true">{{this.form.PurchaseSigner1Name}}</label>
                </div>
                <div>
                    <label class="labeleg" :disabled="true">{{this.form.PurchaseSigner2Name}}</label>
                </div>
                <div>
                    <label class="labeleg" :disabled="true">{{this.form.PurchaseSigner3Name}}</label>
                </div>
            </el-form-item> -->
            <el-form-item label="签字人" style="width:500px;" class="ReceiveApplyDetail_signatory">
                <div v-show="this.form.PurchaseSigner1Name!=''"> 
                    <label class="labeleg" :disabled="true">{{this.form.PurchaseSigner1Name}}</label>
                    <el-radio v-model="radio1" label="1">同意</el-radio>
                    <el-radio v-model="radio1" label="0">不同意</el-radio>
                    <el-input class="input_move" v-model="form.note1" size="small" style="width:465px;"></el-input>
                </div>
                <div v-show="this.form.PurchaseSigner2Name!=''">
                    <label class="labeleg" :disabled="true">{{this.form.PurchaseSigner2Name}}</label>
                    <el-radio v-model="radio2" label="1">同意</el-radio>
                    <el-radio v-model="radio2" label="0">不同意</el-radio>
                    <el-input class="input_move" v-model="form.note2" size="small" style="width:465px;"></el-input>
                </div>
                <div v-show="this.form.PurchaseSigner3Name!=''">
                    <label class="labeleg" :disabled="true">{{this.form.PurchaseSigner3Name}}</label>
                    <el-radio v-model="radio3" label="1">同意</el-radio>
                    <el-radio v-model="radio3" label="0">不同意</el-radio>
                    <el-input class="input_move" v-model="form.note3" size="small" style="width:465px;"></el-input>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import {getPurchaseApplyDetailByAplyId,getGoodsSortMessage,signPurchaseApply} from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'PurchaseApplyDetail',
    data(){
        return {
            title:"采购审批",
            detail:{
                
            },
            goodsSortsArr:[],
            pageNo:1,
            pageSize:1000,
            optionValue:"",
            radio1:"1",
            radio2:"1",
            radio3:"1",
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
                PurchaseSigner1:"",
                PurchaseSigner2:"",
                PurchaseSigner3:"",
                note1:"",
                note2:"",
                note3:"",
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
        this.loadUpdatePurchaseApplyDetail();
    },      
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    watch:{
    },
    methods:{ 
        // 点击确认提交申领申请
        confirm(){
            let json = {
                applyID:this.$route.params.applyId,
                masterID:this.userInfo.userStaffID,
                status:this.radio1,
            }
            if (this.form.PurchaseSigner1.indexOf(json.masterID)!=-1&&this.form.PurchaseSigner1Name.indexOf(this.userInfo.userName)!=-1) {
                json.singer = this.form.PurchaseSigner1;
                json.note = this.form.note1;
            }else if(this.form.PurchaseSigner2.indexOf(json.masterID)!=-1&&this.form.PurchaseSigner2Name.indexOf(this.userInfo.userName)!=-1){
                json.singer = this.form.PurchaseSigner2;
                json.note = this.form.note2;
            }else if(this.form.PurchaseSigner3.indexOf(json.masterID)!=-1&&this.form.PurchaseSigner3Name.indexOf(this.userInfo.userName)!=-1){
                json.singer = this.form.PurchaseSigner3;
                json.note = this.form.note3;
            }
            if(json.note==""){
                this.$message.error({
                    message:"请签字"
                });
                return;
            }
            let loading = showLoading();
            signPurchaseApply(json).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=='1'){
                    this.$message({
                        message:"签字成功",
                        type:"success"
                    });
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message:"签字失败"
                    });
                }
            }).catch((err)=>{
                alertError(this,"2154");
            });
        },
        //加载修改
        loadUpdatePurchaseApplyDetail(){
            let ApplyID = this.$route.params.applyId;
            let loading = showLoading();
            getPurchaseApplyDetailByAplyId(ApplyID)
            .then((result)=>{
                let obj = result.data.data;
                this.form.GoodsID = obj[0].GoodsId?obj[0].GoodsId:"";
                this.form.ApplyerName = obj[0].ApplyerName?obj[0].ApplyerName:"";
                this.form.ActualName = obj[0].ActualName?obj[0].ActualName:"";
                this.form.GoodsName = obj[0].GoodsName?obj[0].GoodsName:"";
                this.form.GoodsSortID = obj[0].GoodsSortID?obj[0].GoodsSortID:"";
                this.loadGoodsSort(this.form.GoodsSortID,loading);
                this.form.Count = obj[0].Count?obj[0].Count:"";
                this.form.Size = obj[0].Size?obj[0].Size:"";
                this.form.Reason = obj[0].Reason?obj[0].Reason:"";
                this.form.PossiblePrice = obj[0].PossiblePrice?obj[0].PossiblePrice:"";
                this.form.SequenceNo = obj[0].SequenceNo?obj[0].SequenceNo:"";
                this.form.hidActualstaffID = obj[0].hidActualstaffID?obj[0].hidActualstaffID:"";
                this.form.PurchaseSigner1Name = obj[0].PurchaseSigner1Name?obj[0].PurchaseSigner1Name:"";
                this.form.PurchaseSigner2Name = obj[0].PurchaseSigner2Name?obj[0].PurchaseSigner2Name:"";
                this.form.PurchaseSigner3Name = obj[0].PurchaseSigner3Name?obj[0].PurchaseSigner3Name:"";
                this.form.PurchaseSigner1 = obj[0].PurchaseSigner1?obj[0].PurchaseSigner1:"";
                this.form.PurchaseSigner2 = obj[0].PurchaseSigner2?obj[0].PurchaseSigner2:"";
                this.form.PurchaseSigner3 = obj[0].PurchaseSigner3?obj[0].PurchaseSigner3:"";
            }).catch((err)=>{
                alertError(this,"1235");
            })  
        },
        loadGoodsSort(GoodsSortID,loading){
            let cosNum = this.userInfo.cosNum;
            let staffID = this.userInfo.userStaffID;
            getGoodsSortMessage(cosNum,this.pageNo,this.pageSize,staffID).then((result)=>{
                this.goodsSortsArr = result.data.data;
                if(GoodsSortID!=""){
                    for (let i = 0; i < this.goodsSortsArr.length; i++) {
                        if(this.goodsSortsArr[i].SortID==GoodsSortID){
                            this.form.GoodsSortName = this.goodsSortsArr[i].SortName;
                            closeLoading(loading);
                        }
                    }
                }
            }).catch((err)=>{
                alertError(this,"1188");
            });
        },
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