<template>
    <div class="expense">
        <chat-header :showBack="true" :title="'月出勤'" :showRightBtn="true" :rightBtnTitle="'提示'" :rightBtnName="'showInfo'" @showInfo="showInfo"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <!-- <el-form-item>
                    <el-date-picker
                        v-model="formInline.month"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        size="medium"
                        placeholder="请选择月份">
                    </el-date-picker>
                </el-form-item> -->
            </el-form>
        </div>
        <div class="classEvaluationList">
            <el-table :data="monthArray" border max-height="550" :cell-class-name="getCellClass" :header-cell-class-name="getHeaderCellClass">
                <el-table-column prop="TheDate" label="日期" width="100" align="center"></el-table-column>
                <el-table-column prop="TotalNum" label="班级总人数" width="100" align="center"></el-table-column>
                <el-table-column prop="OutAttendNum" label="超出定额数" width="100" align="center"></el-table-column>
                <el-table-column prop="AttendNum" label="出勤儿童数" width="100" align="center"></el-table-column>
                <el-table-column prop="AttendPercent1" label="出勤率1（基于总人数）" align="center"></el-table-column>
                <el-table-column prop="AttendPercent2" label="出勤率2（基于定额人数）" align="center"></el-table-column>
            </el-table>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该班级</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getMonthAttPerformance } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'ClassEvaluationMonth',
    data(){
        return {
            formInline: {
                radio:"0",
                month:""
            },
            monthArray:[],
            dialogVisible: false,
            clickItem:null,
            pageNo:1,
            pageSize:100,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        this.showInfo();
        this.getMonthAttPerformance();
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
        showInfo(){
            this.$notify.info({
                title: '说明',
                message: '1）出勤率1 = 出勤人数 / 班级总人数<br/>2）出勤率2 = 班级总人数超出定额人数时，以定额人数为分母，否则以班级总人数为分母。',
                dangerouslyUseHTMLString:true,
                duration: 0
            });
        },
        getHeaderCellClass({row, column, rowIndex, columnIndex}) {
            return "note-attendance-height note-attendance-bg-blue"
        },
        getCellClass({row, column, rowIndex, columnIndex}) {
            let length = this.monthArray.length;
            if(rowIndex==(length-1)){
                return "note-attendance-height note-attendance-bg-yellow"
            }
            if(columnIndex==0&&row.Flag=="RED"){
                return "note-attendance-height note-attendance-color-red"
            }
        },
        getMonthAttPerformance(){
            let staffID = this.userInfo.userStaffID;
            let classID = this.$route.params.classID;
            let yearMonth = this.$route.params.month;
            let loading = showLoading();
            getMonthAttPerformance(staffID,classID,yearMonth).then((result)=>{
                closeLoading(loading);
                let array = result.data.data;
                array.push({
                    TheDate:"合计",
                    TotalNum:result.data.TotalCountAll,
                    OutAttendNum:result.data.OutAll,
                    AttendNum:result.data.AttendCountAll,
                    AttendPercent1:result.data.PercentPAll1,
                    AttendPercent2:result.data.PercentPAll2,
                });
                this.monthArray = array;
            });
        },
        // 确认删除
        confirmDelete(){
            this.dialogVisible = false;  
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.expense{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
.classEvaluationList{
    width:100%;
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>