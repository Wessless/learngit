<template>
    <div class="expense">
        <div style="width:100%;padding-top:10px;padding-bottom:5px;">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="">
                    <el-select v-model="form.typeID" @change="loadList" filterable placeholder="请选择类别">
                        <el-option
                        v-for="item in form.typeArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="examineApproveTabList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Examine-Approve-Tab-item v-for="item in examineApproveTabList" :key="item.num" :item="item" :tabType="tabType" @clickDeleteExpense="clickDeleteExpense"></Examine-Approve-Tab-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisibleExpense"
            width="30%">
            <span>是否撤销该申请信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleExpense = false">取 消</el-button>
                <el-button type="primary" @click="confirmDeleteExpense">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getExamineByFactor,delExamine } from '@/js/api'
import { showLoading,closeLoading ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ExamineApproveTabItem from '@/page/office/examineApproveTab/ExamineApproveTabItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'ReceiveApply',
    data(){
        return {
            isNoData:false,
            pageNo:1,
            examineApproveTabList:[],
            pageSize:10,
            currentPage:1,
            isDisabled:false,
            clickItem:{},
            dialogVisibleExpense:false,
            tabType:"",
            applyType:[],
            form:{
                typeID:"-1",
                typeArr:[
                    {value:"-1",label:"全部"},
                    {value:"1",label:"通用"},
                    {value:"6",label:"外出"},
                    {value:"7",label:"出差"},
                    {value:"8",label:"请假"},
                    {value:"9",label:"订单"},
                    {value:"10",label:"报销"},
                    {value:"11",label:"借款"},
                    {value:"14",label:"加班"},
                    {value:"12",label:"违规"},
                ]
            }
        }
    },
    props: {
        clickTabName:{
            type:String
        }
    },
    components:{
        NoData,
        ChatHeader,
        ExamineApproveTabItem
    },
    mounted(){
        
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
        loadList(reload){
            let cosNum,pageNo,pageSize,createDateStart,createDateEnd,type,applyUser,approvalUser,ccUser,result;
            cosNum = this.userInfo.cosNum;
            type = this.form.typeID;
            // type = -1;
            if (this.clickTabName == "待我审批的") {
				// 待我审批：传approvalUser、result="0"
				approvalUser = this.userInfo.userStaffID;
                result = "0";
                this.tabType = "0"
			}
			// 我已审批的
			else if (this.clickTabName == "我已审批的") {
				// 我已审批：传approvalUser、result="1,2"
				approvalUser = this.userInfo.userStaffID;
                result = "1,2";
                this.tabType = "1"
			}
			// 我发起的
			else if (this.clickTabName == "我发起的") {
				// 我发起的：只传applyUser即可
                applyUser =  this.userInfo.userStaffID;
                this.tabType = "2"
			}
			// 抄送我的
			else if (this.clickTabName == "抄送我的") {
				// 我的抄送：传ccUser、result="1,2"
				ccUser = this.userInfo.userStaffID;
				// ccUser = 42;
                result = "1,2";
                this.tabType = "3"
			}
            // staffID = "0";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getExamineByFactor(cosNum,this.currentPage,this.pageSize,createDateStart,createDateEnd,
                    type,applyUser,approvalUser,ccUser,result).then((result)=>{
                    if(reload){
                        this.examineApproveTabList = [];
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
                        this.examineApproveTabList.push(result.data.data[i]);
                    }
                    if(this.examineApproveTabList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                })
                .catch((err)=>{
                    alertError(this,"1087");
                });
                console.log(1)
            }
        },
        clickDeleteExpense(item){
            this.dialogVisibleExpense = true;
            this.clickItem = item;
        },
        confirmDeleteExpense(){
            this.dialogVisibleExpense = false;
            let cosNum = this.userInfo.cosNum;
            let id = this.clickItem.ID;
            let loading = showLoading();
            delExamine(cosNum,id).then((result)=>{
                console.log(result);
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        message: '撤销成功',
                        type: 'success'
                    });
                    this.loadList(true);    
                }else{
                    this.$message({
                        message: '撤销失败',
                        type: 'error'
                    });
                }
            })
            .catch((err)=>{
                alertError(this,"2049");
                closeLoading(loading);
            });
        },
    },
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
    overflow: hidden;
    background: #fafafa;
    position: relative;
}
/* .examineApproveTabList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.examineApproveTabList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .examineApproveTabList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .examineApproveTabList{
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