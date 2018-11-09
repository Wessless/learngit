<template>
    <div class="interertClassChild">
        <chat-header :showBack="true" :title="title" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-select v-model="formInline.ClassID" @change="reloadList" filterable size="medium" placeholder="请选择班级">
                    <el-option
                    v-for="item in formInline.allClass"
                    :key="item.ID"
                    :label="item.ClassName"
                    :value="item.ID">
                    </el-option>
                </el-select>
                <el-form-item label="学期" style="margin-left:10px;">
                    <el-select v-model="formInline.termName" @change="getMonthArr" filterable size="medium" placeholder="请选择学期">
                        <el-option
                        v-for="item in formInline.termArr"
                            :key="item.index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-date-picker
                        v-model="formInline.yearMonth"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        size="medium"
                        @change="reloadList"
                        :picker-options="pickerBeginDateBefore"
                        :clearable="false"
                        placeholder="请选择月份"
                        style="width:150px;">
                    </el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="月份">
                    <el-select v-model="formInline.month" @change="reloadList" filterable size="medium" placeholder="请选择月份">
                        <el-option
                        v-for="item in formInline.monthArr"
                            :key="item.index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item> -->
            </el-form>
        </div>
        <!-- <no-data :isShow="isNoData"></no-data> -->
        <Class-Schedule :curYear="year" :curMonth="formInline.month" :lessonData="CalendarData" :changeName="'changeDate'" :clickName="'addOrUpdate'" @changeDate="changeDate" @addOrUpdate="addOrUpdate"></Class-Schedule>
        <el-dialog
            title="课程详情"
            :visible.sync="dialogVisible"
            width="70%">
            <el-table :data="lessonData" style="width:100%;display:block;" border max-height="600">
                <el-table-column  prop="CalendarDate" align="center"  label="日期"  width="120"></el-table-column>
                <el-table-column  prop="ClassName" align="center"  label="科目"></el-table-column>
                <el-table-column  prop="ClassFrom" align="center"  label="开始时间"  width="100"></el-table-column>
                <el-table-column prop="ClassTo" align="center"  label="结束时间"  width="100"></el-table-column>
                <el-table-column  prop="TeacherName" align="center"  label="教师"  width="140">    </el-table-column>
                <el-table-column  prop="ThemeID" align="center"  label="主题教案"  width="100">
                    <template slot-scope="scope">
                        <span style="color: #e51c23;">{{scope.row.ThemeID}}</span>
                    </template>
                </el-table-column>
                <el-table-column  prop="PTDCID" align="center"  label="课程类型" width="100"></el-table-column>
                <el-table-column label="操作" align="center"  width="150"  v-if="$route.meta.type!='examine'">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="updateLesson(scope.row)">修改</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="delLesson(scope.row,scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" style="float:left;">
                <el-button type="primary" @click="addSchedule" v-show="$route.meta.type!='examine'">添加</el-button> 
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            <el-dialog
                width="30%"
                title="提示"
                :visible.sync="innerVisible"
                append-to-body>
                <span>确定要删除此课程吗</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmDelete">确 定</el-button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>

import { getClasses,getCourseTableSetDetail,deleteCourseTable,findCourseTable } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ClassSchedule from '@/components/chat/ClassSchedule'
// import NoData from '@/components/chat/NoData'

export default {
    name: 'interertClassChild',
    data(){
        return {
            formInline:{
                radio:"0",
                yearMonth:"",
                termName:"0",
                month:0,
                termArr:[],
                lesson:["舞蹈","唱歌"],
                ClassID:"",
                allClass:[],
            },
            pageNo:1,
            pageSize:1000,
            dateStr:"",
            dialogVisible:false,
            isNoData:false,
            CalendarData:[],
            tableData:[],
            lessonData:[],
            innerVisible:false,
            innerVisible1:false,
            clickItem:{},
            itemIndex:"",
            pickerBeginDateBefore:this.disabledDate(),
        }
    },
    components:{
        // NoData,
        ChatHeader,
        ClassSchedule
    },
    mounted(){
        this.getClasses();
        this.getNowTime();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        year(){
            return parseInt(this.formInline.termName);
        },
        title(){
            if (this.$route.meta.type!='examine') {
                return "课程表设定"
            }else{
                return "课程表查询"
            }
        }
    },
    watch:{
        
    },
    methods:{
        reloadList(){
            this.tableData = [];
            let loading = showLoading();
            let month = this.formInline.yearMonth.split("-")[1];
            this.formInline.month = parseInt(month);
            this.findCourseTable(loading,month);
        },
        findCourseTable(loading,month){
            let classID = this.formInline.ClassID;
            let termName = this.formInline.termName;
            findCourseTable(classID,parseInt(termName),month).then((result)=>{
                closeLoading(loading)
                let objArr = result.data.data;
                for (let i = 0; i < objArr.length; i++) {
                    let obj = {CalendarDate:"",CalendarTime:[]};
                    obj.CalendarDate = objArr[i].CalendarDate;
                    let CalendarClass = JSON.parse(objArr[i].CalendarClass);
                    if (CalendarClass.length!="") {
                        for (let j = 0; j < CalendarClass.length; j++) {
                            let json = {ClassName:"",ClassFrom:"",ClassTo:""}
                            json.ClassName = CalendarClass[j].CourseName;
                            json.ClassFrom = CalendarClass[j].CourseFrom.split(" ")[1].substring(0,5);
                            json.ClassTo = CalendarClass[j].CourseTo.split(" ")[1].substring(0,5);
                            json.ID = CalendarClass[j].ID;
                            json.ThemeID = CalendarClass[j].ThemeID==-1?'尚未提交':'';
                            json.PTDCID = CalendarClass[j].PTDCID=='undefined'?'普通课程':'拼图道场';
                            json.TeacherName = CalendarClass[j].StaffName;
                            json.CalendarDate = CalendarClass[j].CourseDate.split(" ")[0];
                            obj.CalendarTime.push(json)
                        }
                        this.tableData = this.tableData.concat(obj.CalendarTime); 
                    }
                    obj.Flag = objArr[i].Flag;
                    this.CalendarData.push(obj);
                }
            });
            // .catch((err)=>{
            //     alertError(this,"1003");
            // });
        },
        getClasses(){
            let staffID = this.userInfo.userStaffID;
            let loading = showLoading()
            getClasses(staffID).then((result)=>{
                // console.log(result.data.data);
                this.formInline.allClass = result.data.data
                if(result.data.data.length>0){
                    this.formInline.ClassID = result.data.data[0].ID;
                    this.tableData = [];
                    closeLoading(loading);
                    this.reloadList();
                }else{
                    closeLoading(loading);
                    this.formInline.ClassID = "";
                    this.tableData = [];
                }
            })
        }, 
        changeDate(curYear,curMonth,curYearMonth){
            if(curYear){
                let str;
                if (curMonth<=7&&curMonth>=2) {
                    str = "年春季学期";
                }else if(curMonth>7||curMonth<2){
                    str = "年秋季学期";
                }
                this.formInline.termName = curYear + str;
            }if (curYearMonth) {
                this.formInline.yearMonth = curYearMonth;
                this.reloadList();
            }
        },
        disabledDate(){
            let self = this;
            return {
                disabledDate(time){
                    if(self.formInline.termName.indexOf('年春季学期')!=-1){
                        return new Date(parseInt(self.formInline.termName),6,1).getTime() < time.getTime()||new Date(parseInt(self.formInline.termName),1,1).getTime() > time.getTime()
                    }else if(self.formInline.termName.indexOf('年秋季学期')!=-1){
                        return new Date(parseInt(self.formInline.termName),7,1).getTime() > time.getTime()||new Date(parseInt(self.formInline.termName)+1,0,1).getTime() < time.getTime()
                    }
                }
            }
        },
        getNowTime(){
            let date = new Date();
            let year = date.getFullYear();
            let str;
            this.formInline.month = date.getMonth() + 1;
            if (this.formInline.month<=7&&this.formInline.month>=2) {
                str = "年春季学期";
            }else if(this.formInline.month>7||this.formInline.month<2){
                str = "年秋季学期";
            }
            this.formInline.termName = year + str;
            this.getTermArr(year);
        },
        getTermArr(year){
            let str1 = "年春季学期";
            let str2 = "年秋季学期";
            this.formInline.termArr = [year-1+str1,year-1+str2,year+str1,year+str2,year+1+str1]
            this.getMonthArr();
        },
        getMonthArr(value){
            if(this.formInline.termName.indexOf('年春季学期')!=-1){
                this.formInline.yearMonth = parseInt(this.formInline.termName) + "-" + "02";
            }else{
                this.formInline.yearMonth = parseInt(this.formInline.termName) + "-" + "08";
            }
            if (value) {
                this.reloadList();
            }
        },
        addOrUpdate(date){
            let dateArr = date.split("-");
            this.lessonData = [];
            if (dateArr[1] >= 1 && dateArr[1] <= 9) {
                dateArr[1] = "0" + dateArr[1];
            }
            if (dateArr[2] >= 0 && dateArr[2] <= 9) {
                dateArr[2] = "0" + dateArr[2];
            }
            this.dateStr = dateArr.join("-");
            for (let i = 0; i < this.tableData.length; i++) {
                if(this.tableData[i].CalendarDate == this.dateStr){
                    this.lessonData.push(this.tableData[i]);
                }
            }
            this.dialogVisible = true;
        },
        addSchedule(){
            this.$router.push(this.$route.fullPath+"/add/"+this.formInline.ClassID+'&'+this.dateStr);
        },
        updateLesson(item){
            this.$router.push(this.$route.fullPath+"/update/"+this.formInline.ClassID+'&'+item.ID);
        },
        delLesson(item,index){
            this.innerVisible = true;
            this.clickItem = item;
            this.itemIndex = index;
        },
        confirmDelete(){
            this.innerVisible = false;
            // console.log(this.clickItem.ID);
            let loading = showLoading();
            deleteCourseTable(this.clickItem.ID).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.lessonData.splice(this.itemIndex,1);
                    this.dialogVisible = true;
                    this.reloadList();
                }else{
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                }
            })
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
</style>