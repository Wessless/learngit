<template>
    <div class="interertClassChild">
        <chat-header :showBack="true" :title="'兴趣班出勤管理'" :showRightBtn="false"></chat-header>
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
                <el-form-item>
                   <label class="startClass_label" style="margin-left:20px;">开班日期：{{BeginDate}}</label>
                </el-form-item>
                <el-form-item>
                    <label class="startClass_label" style="margin-left:15px;">总课时数：{{classNum}}</label>
                </el-form-item>
                <el-form-item>
                    <label class="startClass_label" style="margin-left:15px;">总出勤人数：{{allNum}}</label>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="examineAttendance" style="transform:translateX(10px);">查看考勤</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- <no-data :isShow="isNoData"></no-data> -->
        <el-table :data="tableData" style="width:100%;display:block;" border max-height="600">
            <el-table-column  prop="CLASSDATE" align="center"  label="日期"  width="120"></el-table-column>
            <el-table-column  prop="CLASSTIME" align="center"  label="时间段"  width="140"></el-table-column>
            <el-table-column  prop="ETNAME" align="center"  label="任课教师"  width="280">
                <template slot-scope="scope">
                    <div v-show="scope.row.ETNAME!=null">
                        {{scope.row.ETNAME}}
                        <label class="handleAttendance" @click.stop="updateETeacher(scope.row)">修改</label>
                    </div>
                    <label class="handleAttendance" v-show="scope.row.ETNAME==null" @click.stop="changeETeacher(scope.row)">设定</label>
                </template>
            </el-table-column>
            <el-table-column  prop="TNAME" align="center"  label="陪班教师">
                <template slot-scope="scope">
                    <div v-show="scope.row.TNAME!=null">
                        {{scope.row.TNAME}}
                        <label class="handleAttendance" @click.stop="updateTeacher(scope.row)">修改</label>
                    </div>
                    <label class="handleAttendance" v-show="scope.row.TNAME==null" @click.stop="changeTeacher(scope.row)">设定</label>
                </template>
            </el-table-column>
            <el-table-column  prop="ATTENDCHILD" align="center"  label="出勤学员"  width="120">
                <template slot-scope="scope">
                    <div v-show="scope.row.ATTENDCHILD!='0'">
                        共{{scope.row.ATTENDCHILD}}人
                        <label class="handleAttendance" @click.stop="updateChild(scope.row)">修改</label>
                    </div>
                    <label class="handleAttendance" v-show="scope.row.ATTENDCHILD=='0'" @click.stop="changeChild(scope.row)">设定</label>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

import { getChildrenByIClassID,getIClass,getIClassByID,getCalendarDetail } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import InterestClassChildItem from '@/page/office/interestClassChild/InterestClassChildItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'interertClassChild',
    data(){
        return {
            formInline:{
                InterestClassArr:[],
                classID:"",
                radio:"0",
            },
            isDisabled:false,
            employTeacherList:[],
            isNoData:false,
            pageNo:1,
            pageSize:1000,
            item:"",
            BeginDate:"",
            // EndDate:"",
            tableData:[],
            classNum:"",
        }
    },
    components:{
        NoData,
        ChatHeader,
        InterestClassChildItem
    },
    mounted(){
        this.getIClass();
        // this.getNowFormatDate();
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
        allNum(){
            let allNum = 0;
            for (let i = 0; i < this.tableData.length; i++) {
                allNum = allNum + this.tableData[i].ATTENDCHILD;
            }
            return allNum;
        },
    },
    watch:{
        
    },
    methods:{
        reloadList(){
            let loading = showLoading();
            this.getIClassByID(loading);
        },
        getIClassByID(loading){
            getIClassByID(this.formInline.classID).then((result)=>{
                let BeginDate = result.data.BeginDate.split(" ")[0];
                this.BeginDate = BeginDate;
                this.tableData = [];
                this.getCalendarDetail(loading);
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
                    closeLoading(loading);
                    this.formInline.classID = "";
                    this.BeginDate = "";
                    this.tableData = [];
                }
            })
        },
        getCalendarDetail(loading){
            getCalendarDetail(this.pageNo,this.pageSize,this.formInline.classID).then((result)=>{
                this.tableData = result.data.data;
                console.log(this.tableData);
                // for (let i = 0; i < this.tableData.length; i++) {
                //     let timeSlot = this.tableData[i].ClassFrom.split(" ")[1]+"-"+this.tableData[i].ClassTo.split(" ")[1]
                //     this.tableData[i].timeSlot = timeSlot;
                // }
                // console.log(this.tableData);
                this.classNum = this.tableData.length;
                closeLoading(loading);
            })
        },
        examineAttendance(){
            let classId = this.formInline.classID;
            this.$router.push(this.$route.fullPath+"/examineAttendance/"+classId);
        },
        updateETeacher(item){
            let classId = item.ClassID;
            let calendarID = item.ID;
            let turn = 1;
            this.$router.push(this.$route.fullPath+"/updateTeacher/"+classId+'&'+calendarID+'&'+turn);
        },
        changeETeacher(item){
            let classId = item.ClassID;
            let calendarID = item.ID;
            let turn = 1;
            this.$router.push(this.$route.fullPath+"/changeTeacher/"+classId+'&'+calendarID+'&'+turn);
        },
        updateTeacher(item){
            let classId = item.ClassID;
            let calendarID = item.ID;
            let turn = 2;
            this.$router.push(this.$route.fullPath+"/updateTeacher/"+classId+'&'+calendarID+'&'+turn);
        },
        changeTeacher(item){
            let classId = item.ClassID;
            let calendarID = item.ID;
            let turn = 2;
            this.$router.push(this.$route.fullPath+"/changeTeacher/"+classId+'&'+calendarID+'&'+turn);
        },
        updateChild(item){
            let classId = item.ClassID;
            let calendarID = item.ID;
            this.$router.push(this.$route.fullPath+"/updateStudent/"+classId+'&'+calendarID);
        },
        changeChild(item){
            let classId = item.ClassID;
            let calendarID = item.ID;
            this.$router.push(this.$route.fullPath+"/changeStudent/"+classId+'&'+calendarID);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interertClassChild{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .interertClassChild{
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
    color: #c0c4cc;
    font-weight: normal;
}
.handleAttendance{
    color: #38adff;
    cursor: pointer;
    font-weight: normal;
}
</style>