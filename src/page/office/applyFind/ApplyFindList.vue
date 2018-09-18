<template>
    <div class="ApplyExamineList">
        <chat-header :showBack="true" :title="'申领查询'"></chat-header>
        <div style="width:70%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
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
                    <el-checkbox v-model="checked" @change="changeStaffs" style="margin-right:10px;">显示离职员工</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadList(true)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="width:30%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="" style="float:right">
                <el-select v-model="formInline.sortID" filterable placeholder="物品分类" @change="loadList(true)">
                    <el-option
                    v-for="item in formInline.sort"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="receiveApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Apply-Find-item v-for="item in receiveApplyList" :key="item.num" :item="item"></Apply-Find-item>
        </div>
    </div>
</template>

<script>

import { findApplyQuery,findAllRetiredStaffs} from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ApplyFindItem from '@/page/office/applyFind/ApplyFindItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'ApplyFindList',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[],
                sortID:"",
                sort:[
                        {
                            value:'1',
                            label:'物品分类'
                        },
                        {
                            value:'2',
                            label:'开始时间'
                        },
                        {
                            value:'3',
                            label:'结束时间'
                        },
                        {
                            value:'4',
                            label:'单号'
                        }
                    ]
            },
            form: {
                GoodsSortName : "",
                StabilizeAssetsNum : "",
                GoodsName : ""
            },
            isNoData:false,
            dialogVisible:false,
            clickItem:{},
            pageNo : "1",
            receiveApplyList:[],
            pageSize:10,
            currentPage:1,
            isDisabled:false,
            checked:false
        }
    },
    components:{
        NoData,
        ChatHeader,
        ApplyFindItem
    },
    mounted(){
        this.findAllstaffs();
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
            let fillStaffID = this.formInline.staffID ? this.formInline.staffID : "-1";
            let fillSortID = this.formInline.sortID ? this.formInline.sortID : "1";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                // staffID,order,pageNo,pageSize,sortID,selectedStaffID
                findApplyQuery(fillStaffID,fillSortID,this.currentPage,this.pageSize).then((result)=>{
                    if(reload){
                        this.receiveApplyList = [];
                    }
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
                    if(this.receiveApplyList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                }).catch((err)=>{
                    alertError(this,"1230");
                });
            }
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
                alertError(this,"");
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.ApplyExamineList{
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