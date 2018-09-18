<template>
    <div class="interertClassChild">
        <chat-header :showBack="true" :title="'兴趣班课程表'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-date-picker
                        v-model="formInline.yearMonth"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        size="medium"
                        @change="reloadList"
                        :clearable="false"
                        placeholder="请选择月份"
                        style="width:150px;">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <!-- <no-data :isShow="isNoData"></no-data> -->
        <Class-Schedule :curYear="formInline.year" :curMonth="formInline.month" :lessonData="tableData" :changeName="'changeDate'" :clickName="'addOrUpdate'" @changeDate="changeDate" @addOrUpdate="addOrUpdate"></Class-Schedule>
        <el-dialog
            title="添加或修改课程"
            :visible.sync="dialogVisible"
            width="50%">
            <el-table :data="lessonData" style="width:100%;display:block;" border max-height="600">
                <el-table-column  prop="classname" align="center"  label="课程名称">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classname" allow-create filterable clearable default-first-option size="small" placeholder="请选择课程">
                            <el-option
                                v-for="item in formInline.lesson"
                                :key="item.index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column  prop="classFrom" align="center"  label="开始时间"  width="160">
                    <template slot-scope="scope">
                        <el-time-picker
                            v-model="scope.row.ClassFrom"
                            size="small"
                            style="width:100%;"
                            format="HH:mm"
                            value-format="HH:mm"
                            placeholder="开始时间">
                        </el-time-picker>
                    </template>
                </el-table-column>
                <el-table-column prop="classTo" align="center"  label="结束时间"  width="160">
                    <template slot-scope="scope">
                        <el-time-picker
                            v-model="scope.row.ClassTo"
                            size="small"
                            style="width:100%;"
                            format="HH:mm"
                            value-format="HH:mm"
                            placeholder="结束时间">
                        </el-time-picker>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            style="width:70%;"
                            type="danger"
                            @click="delLesson(scope.row,scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" style="float:left;">
                <el-button type="primary" @click="addSchedule">添加</el-button> 
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmSchedule">确 定</el-button>
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

import { getCalendar,getPTDClist } from '@/js/api'
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
                yearMonth:"",
                year:0,
                month:0,
                lesson:[]
            },
            dialogVisible:false,
            isNoData:false,
            tableData:[],
            beginTime:"",
            endTime:"",
            innerVisible:false,
            clickItem:{},
            itemIndex:"",
            lessonData:[],
        }
    },
    components:{
        // NoData,
        ChatHeader,
        ClassSchedule
    },
    mounted(){
        // this.getNowFormatDate();
        this.getNowTime();
        this.reloadList();
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
    },
    watch:{
        
    },
    methods:{
        reloadList(){
            let year = this.formInline.yearMonth.split("-")[0];
            let month = this.formInline.yearMonth.split("-")[1];
            let strday = new Date(year,month,0).getDate();
            this.formInline.year = parseInt(year);
            this.formInline.month = parseInt(month);
            this.beginTime = this.formInline.yearMonth + "-" + "01";
            this.endTime = this.formInline.yearMonth + "-" + strday;
            let loading = showLoading();
            this.getCalendar(loading);
        },
        getCalendar(loading){
            let classID = this.$route.params.classID;
            getCalendar(classID,this.beginTime,this.endTime).then((result)=>{
                closeLoading(loading)
                this.tableData = result.data.data;
            })
            // .catch((err)=>{
            //     alertError(this,"1003");
            // });
        },
        changeDate(curYear,curMonth,curYearMonth){
            console.log(curYearMonth)
            if(curYear){
                this.formInline.year = curYear;
            }
            if(curMonth){
                this.formInline.month = curMonth;
            }
            if(curYearMonth){
                this.formInline.yearMonth = curYearMonth;
            }
            this.reloadList();
        },
        getNowTime(){
            let date = new Date();
            let year =  date.getFullYear();
            let month = date.getMonth() + 1;
            this.formInline.year = year;
            this.formInline.month = month;
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            this.formInline.yearMonth = year + "-" + month;
        },
        addOrUpdate(date){
            this.lessonData = [];
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
                    this.lessonData = this.tableData[i].CalendarTime;
                }
            }
            console.log(this.lessonData)
            this.dialogVisible = true;
        },
        confirmSchedule(){
            this.dialogVisible = false;
        },
        addSchedule(){
            let lessonObj = {
                classname:"",
                classFrom:"",
                classTo:""
            }
            this.lessonData.push(lessonObj);
        },
        delLesson(item,index){
            this.innerVisible = true;
            this.itemIndex = index;
            this.clickItem = item;
            // console.log(this.clickItem,this.itemIndex)
        },
        confirmDelete(){
            this.innerVisible = false;
            this.lessonData.splice(this.itemIndex,1);
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