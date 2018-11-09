<template>
    <div class="PurchaseApplyDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="this.$route.meta.type!='purchaseFindEnter'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="90px" style="width:100%;">
            <el-form-item label="物品名称">
                <el-input v-model="form.GoodsName" size="small" style="width:400px;" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="物品类别">
                <el-select v-model="form.GoodsSortName" filterable :placeholder="'请选择物品类别'" :disabled="true" size="small" style="width:400px;padding-top:3px;padding-bottom:5px;">
                    <el-option
                        v-for="item in goodsSortsArr"
                        :key="item.SortID"
                        :label="item.SortName"
                        :value="item.SortName">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="采购担当">
                <el-form-item label="">
                    <el-select v-model="formInline.staffID" filterable :disabled="this.$route.meta.type=='purchaseFindEnter'" size="small" placeholder="请选择同事" style="width:288px;padding-top:3px;padding-bottom:5px;">
                        <el-option
                        v-for="item in formInline.staffs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-checkbox v-model="checked" @change="changeStaffs" style="margin-right:10px;">显示离职员工</el-checkbox>
                </el-form-item>
            </el-form-item>
            <el-form-item label="采购日期">
                <el-date-picker
                    v-model="form.PurchaseDate"
                    @change="getData"
                    size="small"
                    :disabled="this.$route.meta.type=='purchaseFindEnter'"
                    type="date"
                    format="yyyy-MM-dd"
                    style="width:400px;"
                    value-format="yyyy-MM-dd"
                    :placeholder="'请选择采购日期'"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="采购价格">
                <el-input v-model="form.PurchasePrice" @keyup.native="changeMoney" size="small" :disabled="this.$route.meta.type=='purchaseFindEnter'" :placeholder="'请输入采购价格'" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="采购数量">
                <el-input v-model="form.PurchaseCount" size="small" style="width:400px;" :disabled="this.$route.meta.type=='purchaseFindEnter'" :placeholder="'请输入采购数量'"></el-input>
            </el-form-item>
        </el-form>
        <el-form ref="form" :model="form" label-width="90px" style="width:100%;">
            <el-form-item label="补充说明" class="ReceiveApplyDetail_signatory">
                <el-input
                    class="input_padding"
                    style="width:400px;"
                    type="textarea"
                    :rows="5"
                    :disabled="this.$route.meta.type=='purchaseFindEnter'"
                    placeholder="请输入内容"
                    v-model="form.Explain">
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import {getPurchaseDetailOutByAplyId,getGoodsSortMessage,getPurchaseApplyDetailByAplyId,PurchaseInput,updatePurchaseOutInfo,findAllRetiredStaffs} from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'PurchaseApplyDetail',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[],
            },
            title:"采购录入",
            title1:"",
            detail:{
                
            },
            goodsSortsArr:[],
            pageNo:1,
            pageSize:1000,
            checked:false,
            form: {
                GoodsName:"",
                GoodsSortID:"",
                GoodsSortName:"",
                PurchaseCount:"",
                PurchaseDate:"",
                PurchasePrice:"",
                Explain:"",
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
        this.loadEnterPurchaseApplyDetail();
        this.findAllstaffs();
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
                applyID : this.$route.params.applyId,
                goodsName : this.form.GoodsName, 
                goodsSrot : this.form.GoodsSortID,
                purchaserstaffID : this.formInline.staffID,       
                purchaseDate : this.form.PurchaseDate,       
                purchaseCount : this.form.PurchaseCount,       
                purchasePrice : this.form.PurchasePrice,
                explain : this.form.Explain,
            }
            if(this.formInline.staffID==""){
                this.$message.error({
                    message:"请填写采购担当"
                });
                return;
            }
            if(this.form.PurchaseDate==""){
                this.$message.error({
                    message:"请填写采购日期"
                });
                return;
            }
            if(json.possiblePrice==""){
                this.$message.error({
                    message:"请填写采购价格"
                });
                return;
            }
            if(json.purchaseCount==""){
                this.$message.error({
                    message:"请填写采购数量"
                });
                return;
            }
            if(this.$route.meta.type=="update"){
                console.log(json);
                let loading = showLoading();
                updatePurchaseOutInfo(json).then((result)=>{
                    closeLoading(loading);
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
                    alertError(this,"2157");
                });
            }
            if (this.$route.meta.type=="enter") {
                console.log(json);
                let loading = showLoading();
                PurchaseInput(json).then((result)=>{
                    closeLoading(loading);
                    if(result.data.ret=='1'){
                        this.$message({
                            message:"录入成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"录入失败"
                        });
                    }
                }).catch((err)=>{
                    alertError(this,"2155");
                });
            }
        },
        //加载修改采购申请
        loadEnterPurchaseApplyDetail(meta){
            let ApplyID = this.$route.params.applyId;
            let loading = showLoading();
            if(this.$route.meta.type=="enter") {
                getPurchaseApplyDetailByAplyId(ApplyID)
                .then((result)=>{
                    let obj = result.data.data;
                    this.form.GoodsName = obj[0].GoodsName?obj[0].GoodsName:"";
                    this.form.GoodsSortID = obj[0].GoodsSortID?obj[0].GoodsSortID:"";
                    this.loadGoodsSort(this.form.GoodsSortID,loading);
                }).catch((err)=>{
                    alertError(this,"1235");
                })
            }else if(this.$route.meta.type=="update"||this.$route.meta.type=="purchaseFindEnter"){
                getPurchaseDetailOutByAplyId(ApplyID)
                .then((result)=>{
                    let obj = result.data.data;
                    this.form.GoodsName = obj[0].GoodsName?obj[0].GoodsName:"";
                    this.form.GoodsSortID = obj[0].GoodsSrot?obj[0].GoodsSrot:"";
                    this.form.PurchaseCount = obj[0].PurchaseCount?obj[0].PurchaseCount:"";
                    this.formInline.staffID = obj[0].PurchaserstaffID?obj[0].PurchaserstaffID:"";
                    this.form.PurchaseDate = obj[0].PurchaseDate&&obj[0].PurchaseDate!='1900-01-01'?obj[0].PurchaseDate:"";
                    this.form.PurchasePrice = obj[0].PurchasePrice?obj[0].PurchasePrice:"";
                    this.form.Explain = obj[0].Explain?obj[0].Explain:"";
                    this.loadGoodsSort(this.form.GoodsSortID,loading);
                }).catch((err)=>{
                    alertError(this,"1236");
                })  
            }
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
        changeMoney(){
            let value = this.form.PurchasePrice;
            value = value.replace(/[^\d\.]/g,"").replace(/(\.\d{2}).+$/,"$1").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0");
            if(value.indexOf(".")< 0 && value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                value= parseFloat(value); 
            } 
            value = money(value)
            this.form.PurchasePrice = value;
        },
        getData(value){
            this.form.PurchaseDate = value;
        },
        changeStaffs(){
            if(this.checked){
                this.findAllRetiredStaffs();
            }else{
                this.findAllstaffs();
            }
        },
        findAllstaffs(){
            let staffs = [];
            for(var i=0;i<this.allStaffs.length;i++){
                var json = {
                    value:this.allStaffs[i].StaffID,
                    label:this.allStaffs[i].StaffName
                }
                staffs.push(json);
            }
        this.formInline.staffs = staffs;
        },
        findAllRetiredStaffs(){
            let AllRetiredStaffs;
            let AllRetiredStaffsArr = [];
            let loading = showLoading();
            findAllRetiredStaffs().then((result)=>{
                closeLoading(loading);
                if(result){
                    if(result.data.data.length>0){
                        AllRetiredStaffs = result.data.data;
                        for(var i=0;i<AllRetiredStaffs.length;i++){
                            var json = {
                                value:AllRetiredStaffs[i].StaffID,
                                label:AllRetiredStaffs[i].StaffName
                            }
                            AllRetiredStaffsArr.push(json);
                        }
                        // console.log(this.formInline.AllRetiredStaffs);
                        this.formInline.staffs = this.formInline.staffs.concat(AllRetiredStaffsArr);

                    }
                }
            }).catch((err)=>{
                alertError(this,"1053");
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