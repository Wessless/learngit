<template>
    <div class="PurchaseFindList">
        <chat-header :showBack="true" :title="'采购查询'"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="">
                    <el-select v-model="form.GoodsSortID" filterable :placeholder="'请选择物品类别'">
                        <el-option
                            v-for="item in goodsSortsArr"
                            :key="item.SortID"
                            :label="item.SortName"
                            :value="item.SortID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="goodsName" placeholder="请输入物品名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="form.applyManagerID" filterable placeholder="请选择实际申请人">
                        <el-option
                        v-for="item in formInline.staffs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="checked" @change="changeStaffs" style="margin-right:10px;">显示离职员工</el-checkbox>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="form.actualID" filterable placeholder="请选择代申请人">
                        <el-option
                        v-for="item in StaffNameArr"
                            :key="item.Value"
                            :label="item.Text"
                            :value="item.Value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="checked1" @change="getAllapplyManager" style="margin-right:10px;">显示离职员工</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadList(true)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- <div style="width:30%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                
            </el-form>
        </div> -->
        <div class="receiveApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Purchase-Find-item v-for="item in receiveApplyList" :key="item.num" :item="item"></Purchase-Find-item>
        </div>
    </div>
</template>

<script>

import { findAllPurchaseGoods,findAllRetiredStaffs,getGoodsSortMessage,getAllapplyManager} from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import PurchaseFindItem from '@/page/office/purchaseFind/PurchaseFindItem'

export default {
    name: 'PurchaseFindList',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[],
                sortID:"",
                sort:[],
            },
            form: {
                GoodsSortName : "",
                StabilizeAssetsNum : "",
                GoodsName : "",
                GoodsSortID:"",
                actualID:"",
                applyManagerID:"",
            },
            dialogVisible:false,
            clickItem:{},
            pageNo : "1",
            receiveApplyList:[],
            pageSize:10,
            currentPage:1,
            isDisabled:false,
            checked:false,
            checked1:false,
            goodsSortsArr:[],
            goodsName:"",
            StaffNameArr:[],
        }
    },
    components:{
        ChatHeader,
        PurchaseFindItem
    },
    mounted(){
        this.findAllstaffs();
        this.loadGoodsSort();
        this.getAllapplyManager();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ])
    },
    methods:{
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            // staffID = "0";
            let GoodsSortID = this.form.GoodsSortID!="" ? this.form.GoodsSortID : "-1";
            let applyManagerID = this.form.applyManagerID!="" ? this.form.applyManagerID : "-1";
            let actualID = this.form.actualID!="" ? this.form.actualID : "-1";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();

                // console.log(staffID,GoodsSortID,this.goodsName,actualID,applyManagerID,this.pageSize,this.pageNo)
                // staffID,order,pageNo,pageSize,sortID,selectedStaffID
                findAllPurchaseGoods(staffID,GoodsSortID,this.goodsName,actualID,applyManagerID,this.pageSize,this.currentPage).then((result)=>{
                    if(reload){
                        this.receiveApplyList = [];
                    }
                    console.log(result);
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        this.receiveApplyList.push(result.data.data[i]);
                    }
                }).catch((err)=>{
                    alertError(this,"1244");
                });
            }
        },
        loadGoodsSort(){
            let cosNum = this.userInfo.cosNum;
            let staffID = this.userInfo.userStaffID;
            let json = {
                SortID:'-1',
                SortName:'全部'
            }
            getGoodsSortMessage(cosNum,this.pageNo,1000,staffID).then((result)=>{
                this.goodsSortsArr = result.data.data;
                this.goodsSortsArr.unshift(json);
            }).catch((err)=>{
                alertError(this,"1188");
            });
        },
        handleChange(){

        },
        changeStaffs(){
            if(this.checked){
                this.findAllRetiredStaffs();
            }else{
                this.findAllstaffs();
            }
        },
        findAllstaffs(){
            let staffs = [{
                value:'-1',
                label:'全部'
            }];
            for(let i=0;i<this.allStaffs.length;i++){
                let json = {  
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
                        console.log(this.formInline.staffs);
                    }
                }
            }).catch((err)=>{
                alertError(this,"1053");
            });
        },
        getAllapplyManager(){
            let staffs = {
                Value:'-1',
                Text:'全部'
            };
            let staffID = this.userInfo.userStaffID;
            let isOut = "0";
            if(this.checked1){
                isOut = "1";
            }else{
                isOut = "0";
            }
            getAllapplyManager(staffID,isOut).then((result)=>{
                console.log(result.data)
                this.StaffNameArr = result.data.data;
                this.StaffNameArr.unshift(staffs);
            }).catch((err)=>{
                alertError(this,"1245");
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.PurchaseFindList{
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
/* .receiveApplyList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.receiveApplyList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .receiveApplyList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .receiveApplyList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.addbtn{
    float: right;
}
</style>