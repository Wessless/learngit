<template>
    <div class="interertClassExpense">
        <chat-header :showBack="true" :title="title"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="saveAttendance" style="transform:translateX(10px);">保存</el-button>
                </el-form-item>
                <el-form-item  style="float:right;">
                    <el-checkbox v-model="checked" @change="changeAllAttendance" style="margin-right:10px;">标记为全部出勤</el-checkbox>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" style="width:100%;display:block;" border max-height="600">
            <el-table-column :label="label1" align="center">
                <el-table-column  prop="ClassName" align="center"  label="所在班级"  width="100"></el-table-column>
                <el-table-column  prop="ChildNum" align="center"  label="学号"  width="120"></el-table-column>
                <el-table-column  prop="ChildName" align="center"  label="姓名"  width="100"></el-table-column>
                <el-table-column  prop="ChildSex" align="center"  label="性别"  width="100"></el-table-column>
                <el-table-column  prop="ClassInDate" align="center"  label="入班日期" ></el-table-column>
                <el-table-column  prop="ClassOutDate" align="center"  label="退班日期" ></el-table-column>
                <el-table-column prop="AttendFlag" align="center"  label="出勤状况" width="110">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.AttendFlag" size="small" placeholder="请选择">
                            <el-option
                                v-for="item in form"
                                :key="item.value"
                                :label="item.status"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否保存</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmSave">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { addOrUpdateAttrChildDetail,getIClassByID,addOrUpdateAttrChild } from '@/js/api'
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
            form:[
                {
                    value:"0",
                    status:"未出勤"
                },
                {
                    value:"1",
                    status:"已出勤"
                }
            ],
            CalendarID:"",
            allChildID:[],
            allTypes:[],
            label1:"",
            iClassName:"",
            status:"",
            checked:"",
            pageNo:1,
            pageSize:1000,
            tableData:[],
            dialogVisible:false,
        }
    },
    components:{
        ChatHeader,
    },
    mounted(){
        if(this.$route.meta.type=="change"){
            this.title = "设定出勤学员"
        }else if(this.$route.meta.type=="update"){
            this.title = "修改出勤学员"
        }
        this.addOrUpdateAttrChildDetail();
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
    },
    watch:{
        
    },
    methods:{
        addOrUpdateAttrChildDetail(){
            let staffID = this.userInfo.userStaffID;
            let classID = this.$route.params.data.split("&")[0];
            let calendarID = this.$route.params.data.split("&")[1];
            let loading = showLoading();
            // staffID,pageNo,pageSize,classID,calendarID
            addOrUpdateAttrChildDetail(staffID,this.pageNo,this.pageSize,classID,calendarID).then((result)=>{
                closeLoading(loading)
                this.tableData = result.data.data;
                this.CalendarID = result.data.data[0].CalendarID;
                for (let i = 0; i < this.tableData.length; i++) {
                    this.allChildID.push(this.tableData[i].ChildID)
                }
                this.getIClassByID(this.tableData[0].ClassID);
            })
        },
        getIClassByID(ClassID){
            getIClassByID(ClassID).then((result)=>{
                this.iClassName = result.data.ClassName;
                this.label1 = this.iClassName+"("+this.tableData[0].CLASSTIME+")";
            })
        },
        changeAllAttendance(){
            if (this.checked) {
                for (let i = 0; i < this.tableData.length; i++) {
                    this.tableData[i].AttendFlag = "1";
                }
            }else{
                for (let i = 0; i < this.tableData.length; i++) {
                    this.tableData[i].AttendFlag = "0";
                }
            }
        },
        saveAttendance(){
            this.dialogVisible = true; 
            for (let i = 0; i < this.tableData.length; i++) {
                this.allTypes.push(this.tableData[i].AttendFlag);
            }
        },
        confirmSave(){
            this.dialogVisible = false; 
            let calendarId = this.CalendarID;
            let childIds = this.allChildID.join(",");
            let types = this.allTypes.join(",");
            console.log(calendarId,childIds,types);
            let loading = showLoading();
            addOrUpdateAttrChild(calendarId,childIds,types).then((result)=>{
                closeLoading(loading);
                if(result.data.Result==1){
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    window.history.go(-1);
                }else{
                    this.$message({
                        message: '保存失败',
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