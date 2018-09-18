<template>
    <div class="expense">
        <!-- <chat-header :showBack="true" :title="'申领申请'" :showRightBtn="false" :rightBtnTitle="'确认'" :rightBtnName="'showInfo'" :rightBtnType="'btn'" @showInfo="showInfo"></chat-header> -->
        <div style="width:100%;padding-bottom:10px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item  class="addbtn">
                    <el-button type="primary" size="medium" @click.stop="clickReceiveApply">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="receiveApplyList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Receive-Apply-item v-for="item in receiveApplyList" :key="item.num" :item="item" @clickDelete="clickDelete"></Receive-Apply-item>
        </div>
        <el-dialog title="物品申领" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="form" label-width="70px">
               <el-form-item :label="'物品分类'">
                    <el-select v-model="form.GoodsSortName" filterable :placeholder="'请选择物品类别'" style="width:100%" @change="handleChange">
                        <el-option
                        v-for="item in goodsSortsArr"
                            :key="item.SortID"
                            :label="item.SortName"
                            :value="item.SortName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="'物品名称'">
                    <el-select v-model="form.GoodsName" filterable :placeholder="'请选择物品'" style="width:100%" @change="handleChange1">
                        <el-option
                        v-for="item in GoodsMessage"
                            :key="item.GoodsID"
                            :label="item.GoodsName"
                            :value="item.GoodsName">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">申请领用</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该申请信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getAllapplyByStaffId ,getGoodsSortMessage ,getGoodsMessage,deleteApplyInfo } from '@/js/api'
import { showLoading,closeLoading ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ReceiveApplyItem from '@/page/office/receiveApply/ReceiveApplyItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'ReceiveApply',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[]
            },
            form: {
                GoodsSortName : "",
                StabilizeAssetsNum : "",
                GoodsName : ""
            },
            isNoData:false,
            dialogVisible:false,
            clickItem:{},
            optionValue:"",
            pageNo : "1",
            order:'apply',
            receiveApplyList:[],
            pageSize:10,
            currentPage:1,
            isDisabled:false,
            sortID:"",
            goodsID:"",
            dialogFormVisible: false,
            goodsSortsArr:[],
            GoodsMessage:[],
        }
    },
    components:{
        NoData,
        ChatHeader,
        ReceiveApplyItem
    },
    mounted(){
        this.loadGoodsSort();
        this.showInfo();
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
        ...mapMutations([
            'SET_RECEIVEAPPLY'
        ]),
        showInfo(){
            
        },
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            // staffID = "0";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getAllapplyByStaffId(staffID,this.order,this.currentPage,this.pageSize).then((result)=>{
                    if(reload){
                        this.receiveApplyList = [];
                    }
                    // console.log(result)
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
                    alertError(this,"1225");
                });
            }
        },
        clickReceiveApply(item){
            this.dialogFormVisible = true;
        },
        clickDelete(item){
            this.dialogVisible = true;
            this.clickItem = item;
        },
        confirmDelete(){
            this.dialogVisible = false;  
            let applyID = this.clickItem.ApplyID;
            let loading = showLoading();
            deleteApplyInfo(applyID).then((result)=>{
                closeLoading(loading);
                if(result.data.ret==1){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2147");
            });
        },
        confirm(){
            if(this.goodsID){
                this.$router.push(this.$route.fullPath+"/receiveApply/add/"+this.goodsID);
            }else if(this.optionValue!=""&&!this.goodsID){
                this.$message.error('请选择物品名称！');
            }
            else{
                this.$message.error('请选择物品分类！');
            }
        },
        loadGoodsSort(){
            let cosNum = this.userInfo.cosNum;
            let staffID = this.userInfo.userStaffID;
            getGoodsSortMessage(cosNum,this.pageNo,1000,staffID).then((result)=>{
                this.goodsSortsArr = result.data.data;
            }).catch((err)=>{
                alertError(this,"1188");
            });
        },
        handleChange(value) {
            let cosNum = this.userInfo.cosNum;
            let staffID = this.userInfo.userStaffID;
            console.log(value);
            this.optionValue = value;
            for (let i = 0; i < this.goodsSortsArr.length; i++) {
                if(this.goodsSortsArr[i].SortName==value){
                    this.sortID = this.goodsSortsArr[i].SortID;
                }
            }
            getGoodsMessage(cosNum,this.pageNo,1000,staffID,this.sortID,-1,1).then((result)=>{
                this.GoodsMessage = result.data.data;
            }).catch((err)=>{
                alertError(this,"1190");
            });
        }, 
        handleChange1(value){
            for (let i = 0; i < this.GoodsMessage.length; i++) {
                if(this.GoodsMessage[i].GoodsName==value){
                    this.goodsID = this.GoodsMessage[i].GoodsID;
                    // console.log(this.goodsID);
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.expense{
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