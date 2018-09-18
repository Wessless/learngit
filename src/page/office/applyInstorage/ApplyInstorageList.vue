<template>
    <div class="ApplyExamineList">
        <!-- <chat-header :showBack="true" :title="'申领归还'"></chat-header> -->
        <div style="width:100%;padding-bottom:10px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="">
                <el-select v-model="formInline.sortID" filterable placeholder="请选择类别">
                    <el-option
                    v-for="item in formInline.sortName"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
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
                    <el-button type="primary" @click="loadList(true)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="receiveApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="12">
            <Apply-Instorage-item v-for="item in receiveApplyList" :key="item.num" :item="item" @clickInStorage="clickInStorage"></Apply-Instorage-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>您确定要归还吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmInstorage">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getAllinByStaffId, getGoodsSortMessage, inGoods} from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ApplyInstorageItem from '@/page/office/applyInstorage/ApplyInstorageItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'ApplyInstorageList',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[],
                sortID:"",
                sortName:[]
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
            order:'out',
            receiveApplyList:[],
            pageSize:10,
            currentPage:1,
            isDisabled:false,
            goodsSortsArr:[],
        }
    },
    components:{
        NoData,
        ChatHeader,
        ApplyInstorageItem
    },
    mounted(){
        this.LoadGoodsSortMessage();
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
        ])
    },
    methods:{
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            // staffID = "0";
            let fillStaffID = this.formInline.staffID ? this.formInline.staffID : "-1";
            let fillSortID = this.formInline.sortID ? this.formInline.sortID : "-1";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                // staffID,order,pageNo,pageSize,sortID,selectedStaffID
                getAllinByStaffId(staffID,this.order,this.currentPage,this.pageSize,fillSortID,fillStaffID).then((result)=>{
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
                    alertError(this,"1228");
                });
            }
        },
        LoadGoodsSortMessage(){
            let cosNum = this.userInfo.cosNum;
            let staffID = this.userInfo.userStaffID;
            getGoodsSortMessage(cosNum,this.pageNo,this.pageSize,staffID).then((result)=>{
                this.goodsSortsArr = result.data.data;
                var sortName = [{
                    value:'-1',
                    label:'全部'
                }];
                for(var i=0;i<this.goodsSortsArr.length;i++){
                    var json = {
                        value:this.goodsSortsArr[i].SortID,
                        label:this.goodsSortsArr[i].SortName
                    }
                    sortName.push(json);
                }
                this.formInline.sortName = sortName;
            }).catch((err)=>{
                alertError(this,"1188");
            });
        },
        clickInStorage(item){
            this.dialogVisible = true;
            this.clickItem = item;
        },
        confirmInstorage(){
            this.dialogVisible = false;
            let applyIds = this.clickItem.ApplyID;
            let loading = showLoading();
            inGoods(applyIds).then((result)=>{
                closeLoading(loading);
                if(result.data.ret==1){
                    this.$message({
                        message: '归还成功',
                        type: 'success'
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message: '归还失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2150");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.ApplyExamineList{
    /* padding:20px; */
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