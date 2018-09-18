<template>
    <div class="interertClassExpense">
        <chat-header :showBack="true" :title="title"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addCharge" style="transform:translateX(10px);">生成</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" style="width:100%;display:block;" border max-height="600">
            <el-table-column  prop="ClassName" align="center" label="所在班级" width="100"></el-table-column>
            <el-table-column  prop="ChildNum" align="center" label="学号" width="80"></el-table-column>
            <el-table-column  prop="ChildName" align="center" label="姓名" width="90"></el-table-column>
            <el-table-column  prop="Charge" align="center"  label="兴趣班学费" width="100">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.Charge" size="small"></el-input>
                </template>
            </el-table-column>
            <el-table-column  prop="PlusCharge" align="center" label="兴趣班附加费" width="110">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.PlusCharge" size="small"></el-input>
                </template>
            </el-table-column>
            <el-table-column  prop="Remark" align="center" label="备注"></el-table-column>
        </el-table>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否生成缴费任务</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getChargeMessionByIClassID ,addIClassCharge } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
// import InterestClassChildItem from '@/page/office/interestClassChild/InterestClassChildItem'

export default {
    name: 'interertClassExpense',
    data(){
        return {
            title:"生成缴费任务",
            pageNo:1,
            pageSize:1000,
            tableData:[],
            chargeDataArr:[],
            dialogVisible:false,
        }
    },
    components:{
        ChatHeader,
    },
    mounted(){
        this.getChargeMessionByIClassID();
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
    },
    watch:{
        
    },
    methods:{
        getChargeMessionByIClassID(){
            let staffID = this.userInfo.userStaffID;
            let data = this.$route.params.data.split("&");
            let iClassID = data[0];
            let startDate = data[1];
            let endDate = data[2];
            let status = 2;
            let loading = showLoading();
            // staffID,pageNo,pageSize,classID,calendarID
            getChargeMessionByIClassID(this.pageNo,this.pageSize,iClassID,startDate,endDate,status).then((result)=>{
                closeLoading(loading)
                this.tableData = result.data.data;
                console.log(this.tableData)
            })
        },
        addCharge(){
            this.dialogVisible = true; 
            this.chargeDataArr = [];
            for (let i in this.tableData) {
                this.chargeDataArr.push({
                    childID : this.tableData[i].ChildID,
                    charge : this.tableData[i].Charge,
                    plusCharge : this.tableData[i].PlusCharge,
                    remark : this.tableData[i].Remark
                })
            }
        },
        confirmAdd(){
            this.dialogVisible = false; 
            let data = this.$route.params.data.split("&");
            let staffID = this.userInfo.userStaffID;
            let classID = data[0];
            let startDate = data[1];
            let endDate = data[2];
            console.log(staffID,classID,startDate,endDate,this.chargeDataArr)
            let loading = showLoading();
            addIClassCharge(staffID,classID,startDate,endDate,this.chargeDataArr).then((result)=>{
                closeLoading(loading);
                if(result.data.Result==1){
                    this.$message({
                        message: '生成缴费任务成功',
                        type: 'success'
                    });
                    window.history.go(-1);
                }else{
                    this.$message({
                        message: '生成缴费任务失败',
                        type: 'error'
                    });
                }
            })
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
.interertClassExpense{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .interertClassExpense{
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
.startClass_label{
    transform: translateX(10px);
    color: #c0c4cc;
    font-weight: normal;
}
</style>