<template>
    <div class="interestClassTeacher">
        <chat-header :showBack="true" :title="'查看缴费信息'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addTeacher" v-show="this.$route.meta.type!='examined'">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="employTeacherList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Examine-Expense-item v-for="item in employTeacherList" :key="item.num" :item="item" @clickDelete="clickDelete" @clickIssue="clickIssue"></Examine-Expense-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该缴费信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible1"
            width="30%">
            <span>是否发布该缴费信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="confirmIssue">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getChargeMessionByIClassID,deleteIClassCharge } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ExamineExpenseItem from '@/page/office/interestClassExpense/ExamineExpenseItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'interestClassTeacher',
    data(){
        return {
            isDisabled:false,
            employTeacherList:[],
            currentPage:1,      
            pageNO:1,     
            pageSize:10,
            dialogVisible:false,
            dialogVisible1:false,
            clickItem:{},
            isNoData:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
        ExamineExpenseItem
    },
    mounted(){
        
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
    },
    watch:{
        
    },
    methods:{
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            let data = this.$route.params.data.split("&");
            let iClassID = data[0];
            let startDate = data[1];
            let endDate = data[2];
            let status = 1;
            // staffID = "0";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getChargeMessionByIClassID(this.currentPage,this.pageSize,iClassID,startDate,endDate,status).then((result)=>{
                    if(reload){
                        this.employTeacherList = [];
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
                        this.employTeacherList.push(result.data.data[i]);
                    }
                    if(this.employTeacherList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                });
            }
        },
        addTeacher(){
            this.$router.push(this.$route.fullPath+"/add/");
        },
        clickDelete(item){
            this.dialogVisible = true;
            this.clickItem = item;
            console.log(item)
        },
        clickIssue(item){
            this.dialogVisible1 = true;
            this.clickItem = item;
        },
        confirmDelete(){
            this.dialogVisible = false;
            let chargeInterestChildID = this.clickItem.ID;
            let loading = showLoading();
            deleteIClassCharge(chargeInterestChildID).then((result)=>{
                closeLoading(loading);
                if(result.data.Result==1){
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
            })
            // .catch((err)=>{
            //     closeLoading(loading);
            //     alertError(this,"2156");
            // });
        },
        confirmIssue(){
            this.dialogVisible1 = false;
            let id = this.clickItem.ID;
            // .catch((err)=>{
            //     closeLoading(loading);
            //     alertError(this,"2156");
            // });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interestClassTeacher{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .interestClassTeacher{
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

</style>