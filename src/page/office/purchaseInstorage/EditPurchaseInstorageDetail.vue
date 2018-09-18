<template>
    <div class="PurchaseApplyDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="$route.meta.type!='detail'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="100px" style="width:100%;">
            <el-form-item label="物品名称">
                <el-input v-model="form.GoodsName" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="物品类别">
                <el-select v-model="form.GoodsSortName" filterable :placeholder="'请选择物品类别'" :disabled="true" size="small" style="width:400px;padding-top:3px;padding-bottom:5px;">
                    <!-- <el-option
                        v-for="item in goodsSortsArr"
                        :key="item.SortID"
                        :label="item.SortName"
                        :value="item.SortName">
                    </el-option> -->
                </el-select>
            </el-form-item>
            <el-form-item label="采购担当">
                <el-input v-model="form.Purchaser" size="small" style="width:400px;" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="采购日期">
                <el-date-picker
                    v-model="form.PurchaseDate"
                    size="small"
                    :disabled="true"
                    type="date"
                    format="yyyy-MM-dd"
                    style="width:400px;"
                    value-format="yyyy-MM-dd"
                    :placeholder="'选择日期'"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="采购价格">
                <el-input v-model="form.PurchasePrice" size="small" :disabled="true" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="物品状态">
                 <el-select v-model="form.Status" filterable :placeholder="'请选择物品类别'" size="small" style="width:400px;padding-top:3px;padding-bottom:5px;">
                    <el-option
                        v-for="item in goodsStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="固定资产编号">
                <el-input v-model="form.StabilizeAssetsNum" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="现有数量">
                <el-input v-model="form.Sum" size="small" style="width:400px;" :disabled="false"></el-input>
            </el-form-item>
            <el-form-item label="部门">
                <el-input v-model="form.Department" size="small" style="width:400px;" :disabled="false"></el-input>
            </el-form-item>
            <el-form-item label="位置">
                <el-input v-model="form.Location" size="small" style="width:400px;" :disabled="false"></el-input>
            </el-form-item>
        </el-form>
        <el-form ref="form" :model="form" label-width="100px" style="width:100%;">
            <el-form-item label="详细描述" class="ReceiveApplyDetail_signatory">
                <el-input
                    class="input_padding"
                    style="width:400px;"
                    type="textarea"
                    :rows="5"
                    :disabled="false"
                    placeholder="请输入内容"
                    v-model="form.Detail">
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import {getPurchaseApplyInInfoById,addGoodsInfo,updateGoodsInfo } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'PurchaseApplyDetail',
    data(){
        return {
            title:"",
            detail:{},
            goodsStatus:[
                    {
                        value:'1',
                        label:'可用'
                    },
                    {
                        value:'0',
                        label:'报废'
                    },
                ],
            goodsSortsArr:[],
            form: {
                GoodsID:"",
                GoodsName:"",
                PurchaseDate:"",
                Purchaser:"",
                GoodsSortName:"",
                GoodsSortId:"",
                Status:"",
                Sum:1,
                StabilizeAssetsNum:"",
                Location:"",
                PurchasePrice:"",
                Department:"",
                attr:"",
                Detail:"",
                PurchaserStaffID:""
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
            this.title = "添加入库信息";
            this.loadAddPurchaseApplyDetail();
        }else if(this.$route.meta.type=="update"){
            this.title = "修改入库信息";
            this.loadUpdatePurchaseApplyDetail();
        }
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
                stabilizeAssetsNum : this.form.StabilizeAssetsNum,
                goodssort : this.form.GoodsSortId,       
                status : this.form.Status,       
                masterID : this.userInfo.userStaffID,       
                detail : this.form.Detail,
                purchaseDate : this.form.PurchaseDate,
                purchasePrice : this.form.PurchasePrice,
                purchaserStaffID : this.form.PurchaserStaffID,
                department : this.form.Department,
                location : this.form.Location,
                sum : this.form.Sum,
                attr : "",
            }
            if(json.goodsName==""){
                this.$message.error({
                    message:"请填写物品名称"
                });
                return;
            }
            if(json.status==""){
                this.$message.error({
                    message:"请选择物品状态"
                });
                return;
            }
            if(json.sum==""){
                this.$message.error({
                    message:"请填写现有数量"
                });
                return;
            }
            if (this.$route.meta.type=="update") {
                // console.log(json);
                json.goodsID = this.$route.params.Id;
                let loading = showLoading();
                updateGoodsInfo(json).then((result)=>{
                    closeLoading(loading);
                    if(result.data.ret=='1'){
                        this.$message({
                            message:"修改成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"修改失败"
                        });
                    }
                }).catch((err)=>{
                    alertError(this,"2159");
                });
            } 
            if (this.$route.meta.type=="add") {
                // console.log(json);
                let loading = showLoading();
                console.log(json);
                addGoodsInfo(json).then((result)=>{
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
                    alertError(this,"2158");
                });
            } 
        },
        //加载修改
        loadUpdatePurchaseApplyDetail(){
            let Id = this.$route.params.Id;
            // let loading = showLoading();
            getPurchaseApplyInInfoById(Id)
            .then((result)=>{
                let obj = result.data.data;
                // console.log(obj)
                this.form.GoodsName = obj[0].GoodsName?obj[0].GoodsName:"";
                this.form.PurchaseDate = obj[0].PurchaseDate?obj[0].PurchaseDate:"";
                this.form.Purchaser = obj[0].Purchaser?obj[0].Purchaser:"";
                this.form.GoodsSortName = obj[0].GoodsSortName?obj[0].GoodsSortName:"";
                this.form.GoodsSortId = obj[0].GoodsSortId?obj[0].GoodsSortId:"";
                this.form.Status = obj[0].Status?obj[0].Status:"";
                this.form.Sum = obj[0].Sum?obj[0].Sum:"";
                this.form.PurchasePrice = obj[0].PurchasePrice?obj[0].PurchasePrice:"";
                this.form.StabilizeAssetsNum = obj[0].StabilizeAssetsNum?obj[0].StabilizeAssetsNum:"";
                this.form.PurchaserStaffID = obj[0].PurchaserStaffID?obj[0].PurchaserStaffID:"";
                this.form.Location = obj[0].Location?obj[0].Location:"";
                this.form.Department = obj[0].Department?obj[0].Department:"";        
                this.form.Detail = obj[0].Detail?obj[0].Detail:"";        
            }).catch((err)=>{
                alertError(this,"1243");
            });
        },
        //加载添加
        loadAddPurchaseApplyDetail(){
            let Id = this.$route.params.Id;
            getPurchaseApplyInInfoById(Id)
            .then((result)=>{
                let obj = result.data.data;
                this.form.GoodsName = obj[0].GoodsName?obj[0].GoodsName:"";
                this.form.PurchaseDate = obj[0].PurchaseDate?obj[0].PurchaseDate:"";
                this.form.Purchaser = obj[0].Purchaser?obj[0].Purchaser:"";
                this.form.GoodsSortName = obj[0].GoodsSortName?obj[0].GoodsSortName:"";
                this.form.GoodsSortId = obj[0].GoodsSortId?obj[0].GoodsSortId:"";
                this.form.Status = obj[0].Status?obj[0].Status:"";
                this.form.PurchasePrice = obj[0].PurchasePrice?obj[0].PurchasePrice:"";
                this.form.PurchaserStaffID = obj[0].PurchaserStaffID?obj[0].PurchaserStaffID:"";   
            }).catch((err)=>{
                alertError(this,"1243");
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
.redColor{
    padding-left: 10px;
    color: red;
    font-weight: normal;
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