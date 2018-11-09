<template>
    <div class="interertClassExpense">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'提示'" :rightBtnName="'showInfo'" @showInfo="showInfo"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="formInline.classID" @change="reloadList" filterable size="medium" placeholder="请选择兴趣班">
                        <el-option
                        v-for="item in formInline.InterestClassArr"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-radio v-model="formInline.radio" label="0" @change="getIClass" style="margin-left:20px;">进行中</el-radio>
                    <el-radio v-model="formInline.radio" label="1" @change="getIClass" style="margin-left:20px;">已结束</el-radio>
                </el-form-item>
                <el-form-item style="float:right;">
                   <label class="startClass_label">开班日期：{{BeginDate}}</label>
                </el-form-item>
            </el-form>
        </div>
        <!-- <no-data :isShow="isNoData"></no-data> -->
        <el-table :data="tableData" style="width:100%;display:block;" border max-height="600">
            <el-table-column  prop="No" align="center"  label="No"  width="120"></el-table-column>
            <el-table-column  prop="StartDate" align="center"  label="计费开始日期"  width="350"></el-table-column>
            <el-table-column prop="EndDate" align="center"  label="计费截止日期"  width="350">
                <template slot-scope="scope">
                    <div v-show="scope.row.EndDate!='1900-01-01'">{{scope.row.EndDate}}</div>
                    <el-date-picker
                        v-model="endTime"
                        v-show="scope.row.EndDate=='1900-01-01'"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        size="small"
                        placeholder="请选择计费截止日期">
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column  label="缴费任务" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary" 
                        v-show="scope.row.Status.indexOf('查看')!='-1'"
                        @click="examineExpense(scope.row)">查看</el-button>
                        <!-- <el-button type="primary" size="medium" @click="addTeacher">添加</el-button> -->
                    <el-button
                        size="mini"
                        type="danger"
                        v-show="$route.meta.type!='examine'&&scope.row.Status.indexOf('删除')!='-1'"
                        @click="delExpense(scope.row)">删除</el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        style="margin-left:0px;"
                        v-show="scope.row.Status.indexOf('生成')!='-1'"
                        @click="buildExpense(scope.row)">生成</el-button>
                </template>
            </el-table-column>
        </el-table>
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
    </div>
</template>

<script>

import { getIClass,getIClassByID,getChildChargeMessage,deletetask } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
// import InterestClassChildItem from '@/page/office/interestClassChild/InterestClassChildItem'

export default {
    name: 'interertClassExpense',
    data(){
        return {
            title:"",
            formInline:{
                InterestClassArr:[],
                classID:"",
                radio:"0",
            },
            endTime:"",
            isDisabled:false,
            isNoData:false,
            pageNo:1,
            pageSize:1000,
            item:"",
            BeginDate:"",
            tableData:[],
            delItem:{},
            dialogVisible:false,
        }
    },
    components:{
        ChatHeader,
    },
    mounted(){
        this.showInfo();
        this.getIClass();
        if (this.$route.meta.type=="examine") {
            this.title = '兴趣班收费查询'
        }else{
            this.title = '兴趣班收费设定'
        }
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
        // allNum(){
        //     let num = this.employTeacherList.length;
        //     return "总人数："+num+"人";
        // },
    },
    watch:{
        
    },
    methods:{
        showInfo(){
            this.$notify.info({
                title: '说明',
                message: '1）计算收费时，会考虑学员的中途入退班时间，但是不会与学员的出勤状态联动。<br/>2）如需退费，需手动设定缴费任务，该程序无法处理退费的情况。',
                dangerouslyUseHTMLString:true,
                duration: 0
            });
        },
        reloadList(){
            let loading = showLoading();
            this.getIClassByID(loading);
        },
        getIClassByID(loading){
            
            getIClassByID(this.formInline.classID).then((result)=>{
                let BeginDate = result.data.BeginDate.split(" ")[0];
                this.BeginDate = BeginDate;
            })
            getChildChargeMessage(this.formInline.classID,this.pageNo,this.pageSize).then((result)=>{       
                this.tableData = [];   
                if(this.$route.meta.type=="examine"){
                    for (let i = 0; i < result.data.data.length; i++) {
                        if (result.data.data[i].EndDate!='1900-01-01') {
                            this.tableData.push(result.data.data[i]);
                        }
                    }
                }else{
                    this.tableData = result.data.data;
                }
                if(loading){
                    closeLoading(loading);
                }
                console.log(this.tableData)
                if(this.tableData.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            })
            // .catch((err)=>{
            //     alertError(this,"1003");
            // });
        },
        //获取兴趣班
        getIClass(){
            let staffID = this.userInfo.userStaffID;
            let endFlag = this.formInline.radio;
            let loading = showLoading();
            getIClass(this.pageNo,this.pageSize,staffID,endFlag).then((result)=>{
                this.formInline.InterestClassArr = result.data.data;
                if(result.data.data.length>0){
                    this.formInline.classID = result.data.data[0].ID;
                    let BeginDate = result.data.data[0].BeginDate.split(" ")[0];
                    this.BeginDate = BeginDate;
                    this.getIClassByID(loading);
                }else{
                    this.formInline.classID = "";
                    this.BeginDate = "";
                    this.tableData = [];
                    closeLoading(loading);
                }
            })
        },
        examineExpense(data){
            let iclassID = this.formInline.classID;
            let startDate = data.StartDate;
            let endDate = data.EndDate;
            if (this.$route.meta.type!='examine') {
                this.$router.push(this.$route.fullPath+"/examine/"+iclassID+'&'+startDate+'&'+endDate);
            }else{
                this.$router.push(this.$route.fullPath+"/examined/"+iclassID+'&'+startDate+'&'+endDate);
            }
        },
        delExpense(item){
            this.dialogVisible = true;
            this.delItem = item;
        },
        confirmDelete(){
            this.dialogVisible = false; 
            let chargeMissionID = this.delItem.ID;
            let interestClassID = this.delItem.InterestClassID;
            // chargeMissionID 
            // interestClassID
            let loading = showLoading();
            deletetask(chargeMissionID,interestClassID).then((result)=>{
                closeLoading(loading);
                if(result.data.Result==1){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getIClassByID();
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
        buildExpense(data){
            if (this.endTime=="") {
                 this.$message({
                    message: '请输入正确的截止日期！',
                    type: 'error'
                });
                return false;
            }
            let iclassID = this.formInline.classID;
            let startDate = data.StartDate;
            let endDate = this.endTime;
            this.$router.push(this.$route.fullPath+"/issue/"+iclassID+'&'+startDate+'&'+endDate);
        }
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