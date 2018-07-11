<template>
    <div class="noteAttendance">
        <chat-header :showBack="true" :title="'幼儿出勤'" :showRightBtn="!isMonth"  :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="formInline.classID" filterable size="medium" placeholder="请选择班级">
                        <el-option
                        v-for="item in formInline.classList"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID"
                            @change="reloadList">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="isMonth">
                    <el-date-picker
                        v-model="formInline.month"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        size="medium"
                        @change="reloadList"
                        :picker-options="pickerBeginDateBefore"
                        placeholder="请选择月份"
                        style="width:150px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-show="!isMonth">
                    <el-date-picker
                        v-model="formInline.date"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        size="medium"
                        @change="reloadList"
                        :picker-options="pickerBeginDateBefore"
                        placeholder="请选择日期"
                        style="width:150px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="medium" type="primary" @click="changeMonthAndMonth">{{changeMonthBtn}}</el-button>
                </el-form-item>
                <el-form-item style="float:right;margin-right:0;" v-show="isMonth">
                    <el-button size="medium" @click="isSelectedFlag(false)">取消全选并保存</el-button>
                </el-form-item>
                <el-form-item style="float:right;" v-show="isMonth">
                    <el-button size="medium" type="primary" @click="isSelectedFlag(true)">全选并保存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table v-show="isMonth" :data="tableData" border max-height="600" style="width:100%;display:block;" :cell-class-name="getCellClass" :header-cell-class-name="getHeaderCellClass">
            <el-table-column fixed prop="ChildName" align="center" label="姓名" width="120"></el-table-column>
            <el-table-column v-for="(item,index) in columnList" :key="index" align="center" :label="item.name" min-width="40">
                <template slot-scope="scope">
                    <div v-show="!scope.row.AttData[index].number&&scope.row.AttData[index].number!=0">
                        <!-- {{ scope.row.AttData[index].selected }} -->
                        
                        <el-checkbox style="margin-bottom:0px;" v-model="scope.row.AttData[index].selected" :disabled="scope.row.AttData[index].disabled" @change="changeChildAttendance(scope,index)"></el-checkbox>
                    </div>
                    <div v-show="scope.row.AttData[index].number||scope.row.AttData[index].number==0">{{ scope.row.AttData[index].number }}</div>
                </template>
            </el-table-column>
            
            <el-table-column prop="AttNum" fixed="right" align="center" label="出勤天数" width="100"></el-table-column>
        </el-table> 
        <div class="computedAttendance" v-show="!isMonth">
            1） 班级总人数={{ totalNum }} 出勤人数={{ attendanceNum }} 缺勤人数={{ unAttendanceNum }}<br/>
            2） 凡是未标记为未出勤的，系统都视为已出勤
        </div>
        <el-table v-show="!isMonth" :data="tableDateData" border max-height="550" style="width:100%;display:block;" :header-cell-class-name="getHeaderCellClass">
            <el-table-column prop="ChildID" align="center" label="学号" width="120"></el-table-column>
            <el-table-column prop="ChildName" align="center" label="姓名" width="120"></el-table-column>
            <el-table-column align="center" label="出勤状况">
                <template slot-scope="scope">
                    <div class="attendance">
                        <div class="attendanceItem" v-bind:class="{attendanceItemSelected: scope.row.Type=='0'}" @click="clickAttendanceType(scope,'0')">出勤</div>
                        <div class="attendanceItem" v-bind:class="{attendanceItemSelected: scope.row.Type=='3'}" @click="clickAttendanceType(scope,'3')">未出勤</div>
                        <div class="attendanceItem" v-bind:class="{attendanceItemSelected: scope.row.Type=='4'}" @click="clickAttendanceType(scope,'4')">病假</div>
                        <div class="attendanceItem" v-bind:class="{attendanceItemSelected: scope.row.Type=='5'}" @click="clickAttendanceType(scope,'5')">事假</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="出勤时间" width="200">
                <template slot-scope="scope" >
                    <div class="attendance" v-if="scope.row.BeginTime">
                        {{scope.row.BeginTime.split(" ")[1]}} - {{ scope.row.EndTime.split(" ")[1] }}
                    </div>
                    <div class="attendance" v-if="!scope.row.BeginTime">
                        暂无打卡时间
                    </div>
                </template>
            </el-table-column>
            <!-- <el-table-column v-for="(item,index) in columnList" :key="index" align="center" :label="item.name" min-width="40">
                <template slot-scope="scope">
                    <div v-show="!scope.row.AttData[index].number&&scope.row.AttData[index].number!=0">
                        <el-checkbox style="margin-bottom:0px;" v-model="scope.row.AttData[index].selected" :disabled="scope.row.AttData[index].disabled" @change="changeChildAttendance(scope,index)"></el-checkbox>
                    </div>
                    <div v-show="scope.row.AttData[index].number||scope.row.AttData[index].number==0">{{ scope.row.AttData[index].number }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="AttNum" fixed="right" align="center" label="出勤天数" width="100"></el-table-column> -->
        </el-table> 
        <!-- <el-table :data="totalList" :show-header="false" border style="width:100%;display:block;margin-top:-1px;" :cell-class-name="getTotalCellClass">
            <el-table-column fixed prop="ChildName" align="center" width="120"></el-table-column>
            <el-table-column v-for="(item,index) in columnList" :key="index" align="center" min-width="50">
                <template slot-scope="scope">
                    <div>
                        {{ scope.row.AttData[index].number }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="AttNum" fixed="right" align="center" label="出勤天数" width="100"></el-table-column>
        </el-table>  -->
    </div>
</template>

<script>

import { getClasses,getChildAttsByDate,updateChilAtts,getClassChildAtts } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'NoteAttendance',
    data(){
        return {
            isMonth:true,
            formInline:{
                classID:"",
                classList:[],
                month:"",
                date:"",
            },
            tableData: [
                // {
                //     ChildID:"8",
                //     ChildName:"张小一",
                //     totalDate:1,
                //     AttData:[
                //         {AttDate:"2018-06-01",Type:"0",disabled:false,selected:true},
                //         {AttDate:"2018-06-02",Type:"3",disabled:false,selected:false},
                //         {AttDate:"2018-06-03",Type:"-100",disabled:true,selected:false},
                //         {AttDate:"2018-06-04",Type:"-1",disabled:true,selected:false},
                //     ]
                // }
            ],
            tableDateData:[],
            totalList:[
                {
                    ChildName:"总人数",
                    AttNum:"",
                    AttData:[
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0}
                        // {AttDate:"2018-06-01",Type:"0",disabled:false,selected:true},
                        // {AttDate:"2018-06-02",Type:"3",disabled:false,selected:false},
                        // {AttDate:"2018-06-03",Type:"-100",disabled:true,selected:false},
                        // {AttDate:"2018-06-04",Type:"-1",disabled:true,selected:false},
                    ]
                },{
                    ChildName:"出勤人数",
                    AttNum:"",
                    AttData:[
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0},
                        {number:0}
                        // {AttDate:"2018-06-01",Type:"0",disabled:false,selected:true},
                        // {AttDate:"2018-06-02",Type:"3",disabled:false,selected:false},
                        // {AttDate:"2018-06-03",Type:"-100",disabled:true,selected:false},
                        // {AttDate:"2018-06-04",Type:"-1",disabled:true,selected:false},
                    ]
                }
            ],
            changeTableObj:{},
            columnList:[
                { name:"01" }
            ],
            pickerBeginDateBefore:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            }
        }
    },
    components:{
        ChatHeader,
    },
    mounted(){
        // this.formInline.classID = "1";
        let date = new Date();
        this.formInline.month = date.getFullYear()+"-"+(Array(3).join(0)+(date.getMonth()+1)).slice(-2);
        this.formInline.date = date.getFullYear()+"-"+(Array(3).join(0)+(date.getMonth()+1)).slice(-2)+"-"+(Array(3).join(0)+date.getDate()).slice(-2);
        let staffID = this.userInfo.userStaffID;
        let loading = showLoading();
        getClasses(staffID).then((result)=>{
            this.formInline.classList = result.data.data;
            console.log(result.data.data)
            if(result.data.data.length>0){
                console.log(result.data.data.length)
                this.formInline.classID = result.data.data[0].ID;
                this.loadList(loading);
            }else{
                closeLoading(loading);
            }
        });
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        totalNum(){
            return this.tableDateData.length;
        },
        attendanceNum(){
            let number = 0;
            for(let i=0;i<this.tableDateData.length;i++){
                if(this.tableDateData[i].Type=="0"){
                    number++;
                }
            }
            return number;
        },
        unAttendanceNum(){
            return this.totalNum - this.attendanceNum;
        },
        changeMonthBtn(){
            if(this.isMonth){
                return "切换到单日模式";
            }else{
                return "切换到全月模式";
            }
        }
    },
    watch:{
        
    },
    methods:{
        // 初始化totalList（重置总人数、出勤人数）
        totalListInit(){
            for(let i=0;i<this.totalList[0].AttData.length;i++){
                this.totalList[0].AttData[i].number = 0;
            }
            for(let i=0;i<this.totalList[1].AttData.length;i++){
                this.totalList[1].AttData[i].number = 0;
            }
            this.changeTableObj = {};
            this.tableData = [
                {
                    ChildName:"总人数",
                    AttNum:"",
                    AttData:[
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'}
                    ]
                },{
                    ChildName:"出勤人数",
                    AttNum:"",
                    AttData:[
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'},
                        {number:'0'}
                    ]
                }
            ]
        },
        changeMonthAndMonth(){
            this.isMonth = !this.isMonth;
            this.reloadList();
        },
        // 加载全月模式列表
        loadList(loading){
            let staffID = this.userInfo.userStaffID;
            let classID = this.formInline.classID;
            let month = this.formInline.month;
            if(classID==""){
                this.$message({
                    message: '该员工没有班级'
                });
                closeLoading(loading);
                return;
            }
            if(month==""){
                this.$message({
                    message: '没有选择月份'
                });
                closeLoading(loading);
                return;
            }
            let beginDate = month+"-01";
            let endDate = "";
            let endDateObj = new Date(parseInt(month.split("-")[0]),parseInt(month.split("-")[1])-1,1);
            endDateObj.setMonth(endDateObj.getMonth()+1);
            let endTimePicker = endDateObj.setDate(endDateObj.getDate()-1);
            let currTimePicker = new Date().getTime();
            if(currTimePicker>endTimePicker){
                endDate = endDateObj.getFullYear() + "-" + (Array(3).join(0)+(endDateObj.getMonth()+1)).slice(-2) + "-" + (Array(3).join(0)+(endDateObj.getDate())).slice(-2);
            }else{
                let date = new Date();
                endDate = date.getFullYear() + "-" + (Array(3).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(3).join(0)+(date.getDate())).slice(-2);
            }
            this.totalListInit();
            getChildAttsByDate(staffID,beginDate,endDate,classID)
            .then((result)=>{
                closeLoading(loading);
                let array = result.data.data;
                if(array.length>0){
                    let attDateArr = array[0].AttData;
                    this.columnList = [];
                    for(let i=0;i<attDateArr.length;i++){
                        let json = {
                            name:attDateArr[i].AttDate.slice(-2)
                        }
                        this.columnList.push(json);
                    }
                }
                for(let i=0;i<array.length;i++){
                    let attData = array[i].AttData;
                    for(let j=0;j<attData.length;j++){
                        if(attData[j].Type=="-1"||attData[j].Type=="-100"){
                            attData[j].disabled = true;
                            attData[j].selected = false;
                            if(attData[j].Type=="-1"){
                                this.totalList[0].AttData[j].number = "--";
                                this.totalList[1].AttData[j].number = "--";
                            }
                        }else if(attData[j].Type=="0"){
                            attData[j].disabled = false;
                            attData[j].selected = true;
                            this.totalList[0].AttData[j].number++;
                            this.totalList[1].AttData[j].number++;
                        }else if(attData[j].Type=="3"||attData[j].Type=="4"||attData[j].Type=="5"){
                            attData[j].disabled = false;
                            attData[j].selected = false;
                            this.totalList[0].AttData[j].number++;
                            // totalList[1].AttData[j].number++;
                        }
                    }
                }
                array.push(this.totalList[0]);
                array.push(this.totalList[1]);
                this.tableData = array;
            }).catch((err)=>{
                closeLoading(loading);
            });
        },
        // 加载单日模式列表
        loadDateList(loading){
            let staffID = this.userInfo.userStaffID;
            let classID = this.formInline.classID;
            let date = this.formInline.date;
            this.tableDateData = [];
            if(date==""){
                this.$message({
                    message: '没有选择日期'
                });
                closeLoading(loading);
                return;
            }
            if(classID==""){
                this.$message({
                    message: '该员工没有班级'
                });
                closeLoading(loading);
                return;
            }
            getClassChildAtts("1","200",date,staffID,classID)
            .then((result)=>{
                closeLoading(loading);
                let array = result.data.data;
                // if(array.length>0){
                //     let attDateArr = array[0].AttData;
                //     this.columnList = [];
                //     for(let i=0;i<attDateArr.length;i++){
                //         let json = {
                //             name:attDateArr[i].AttDate.slice(-2)
                //         }
                //         this.columnList.push(json);
                //     }
                // }
                // for(let i=0;i<array.length;i++){
                //     let attData = array[i].AttData;
                //     for(let j=0;j<attData.length;j++){
                //         if(attData[j].Type=="-1"||attData[j].Type=="-100"){
                //             attData[j].disabled = true;
                //             attData[j].selected = false;
                //             if(attData[j].Type=="-1"){
                //                 this.totalList[0].AttData[j].number = "--";
                //                 this.totalList[1].AttData[j].number = "--";
                //             }
                //         }else if(attData[j].Type=="0"){
                //             attData[j].disabled = false;
                //             attData[j].selected = true;
                //             this.totalList[0].AttData[j].number++;
                //             this.totalList[1].AttData[j].number++;
                //         }else if(attData[j].Type=="3"||attData[j].Type=="4"||attData[j].Type=="5"){
                //             attData[j].disabled = false;
                //             attData[j].selected = false;
                //             this.totalList[0].AttData[j].number++;
                //             // totalList[1].AttData[j].number++;
                //         }
                //     }
                // }
                this.tableDateData = array;
            }).catch((err)=>{
                closeLoading(loading);
            });
        },
        reloadList(){
            if(this.isMonth){
                let loading = showLoading();
                this.loadList(loading);
            }else{
                let loading = showLoading();
                this.loadDateList(loading);
            }
        },
        // 其他tablecell样式
        getCellClass({row, column, rowIndex, columnIndex}) {
            // console.log(row, column, rowIndex, columnIndex);
            let length = this.tableData.length;
            if(rowIndex==(length-1)||rowIndex==(length-2)){
                return "note-attendance-height note-attendance-bg-yellow"
            }
            if(columnIndex==0||columnIndex==(row.AttData.length+1)){
                if(columnIndex==(row.AttData.length+1)){
                    return "note-attendance-height note-attendance-bg-yellow"
                }
                return "note-attendance-height";
            }else{
                let type = this.tableData[rowIndex].AttData[columnIndex-1].Type;
                let selected = this.tableData[rowIndex].AttData[columnIndex-1].selected;
                if(type=="-1"){// 红日子
                    return "note-attendance-height note-attendance-bg-black"
                }else if(type=="-100"){// 尚未入班或者已经退班
                    return "note-attendance-height note-attendance-bg-gray"
                }else{
                    if(selected){
                        return "note-attendance-height note-attendance-bg-green"
                    }else{
                        return "note-attendance-height note-attendance-bg-red"
                    }
                }
            }
        },
        // 全月模式标题样式
        getHeaderCellClass({row, column, rowIndex, columnIndex}) {
            return "note-attendance-height note-attendance-bg-blue"
        },
        // 修改幼儿出勤状态时提交出勤状态
        changeChildAttendance(scope,index){
            let childID = scope.row.ChildID;
            let attDate = scope.row.AttData[index].AttDate;
            let selected = scope.row.AttData[index].selected;
            if(scope.row.AttData[index].selected){
                scope.row.AttNum++;
                this.totalList[1].AttData[index].number++;
            }else{
                scope.row.AttNum--;
                this.totalList[1].AttData[index].number--;
            }
            let attDateArr = [
                {
                    childID,
                    attDate,
                    Type:scope.row.AttData[index].selected?"0":"3"
                }
            ];
            updateChilAtts(JSON.stringify(attDateArr)).then((result)=>{
                if(result.data.Result=="1"){
                    // this.reloadList();
                }else{
                    // 修改失败时出勤人数退回到未修改时
                    this.$message.error({
                        message:"修改失败"
                    });
                    if(scope.row.AttData[index].selected){
                        scope.row.AttNum--;
                        this.totalList[1].AttData[index].number--;
                    }else{
                        scope.row.AttNum++;
                        this.totalList[1].AttData[index].number++;
                    }
                }
            });
        },
        // 修改单日出勤状态
        clickAttendanceType(scope,Type){
            let childID = scope.row.ID;
            let attDate = scope.row.AttDate;
            // let attDateArr = [
            //     {
            //         childID,
            //         attDate,
            //         Type
            //     }
            // ];
            // console.log(JSON.stringify(attDateArr))
            // updateChilAtts(JSON.stringify(attDateArr)).then((result)=>{
            //     console.log(result)
            //     if(result.data.Result=="1"){
            //         scope.row.Type = Type;
            //     }else{
            //         // 修改失败时出勤人数退回到未修改时
            //         this.$message.error({
            //             message:"修改失败"
            //         });
            //     }
            // });
            scope.row.Type = Type;
            this.changeTableObj[childID+"|"+attDate] = Type;
        },
        // 全选或取消全选数据提交
        isSelectedFlag(flag){
            let attDateArr = [];
            for(let i=0;i<this.tableData.length-2;i++){
                let childID = this.tableData[i].ChildID;
                let attDates = this.tableData[i].AttData;
                for(let j=0;j<attDates.length;j++){
                    if(flag!=attDates[j].selected&&!attDates[j].disabled){
                        let json = {
                            childID:childID,
                            attDate:attDates[j].AttDate,
                            Type:flag?"0":"3"
                        }
                        attDateArr.push(json);
                    }
                }
            }
            if(attDateArr.length==0){
                return;
            }
            let loading = showLoading();
            updateChilAtts(JSON.stringify(attDateArr)).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message:"修改成功",
                        type:"success"
                    });
                    this.reloadList();
                }else{
                    // 修改失败时出勤人数退回到未修改时
                    this.$message.error({
                        message:"修改失败"
                    });
                }
            });
        },
        confirm(){
            let attDateArr = [];
            for(let attr in this.changeTableObj){
                console.log(attr,this.changeTableObj[attr])
                let json = {
                    childID:attr.split("|")[0],
                    attDate:attr.split("|")[1],
                    Type:this.changeTableObj[attr]
                }
                attDateArr.push(json);
            }
            updateChilAtts(JSON.stringify(attDateArr)).then((result)=>{
                console.log(result)
                if(result.data.Result=="1"){
                    this.$message({
                        message:"保存成功",
                        type:"success"
                    });
                }else{
                    // 修改失败时出勤人数退回到未修改时
                    this.$message.error({
                        message:"保存失败"
                    });
                }
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.noteAttendance{
    padding:20px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .noteAttendance{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.checkbox{
    margin:0;
}
.el-form-item {
    margin-bottom: 0px !important;
}
.listTable{
    position: relative;
    /* width:100%; */
}
.listTable > tr{
    display: flex;
    flex-wrap: no-wrap;
    padding-left:100px;
    padding-right:100px;
}
.listTable > tr >td{
    display: block;
    width: 30px;
}
.listTable > tr >td:first-child{
    display: block;
    width: 100px;
    position:absolute;
    left:0;
}
.listTable > tr >td:last-child{
    display: block;
    width: 100px;
    position:absolute;
    right:0;
}
.attendance{
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.attendanceItem{
    display: flex;
    width:60px;
    text-align: center;
    border:1px solid #dddddd;
    border-right: 0px;
    align-items: center;
    justify-content: center;
    /* font-size: 16px; */
    height:30px;
}
.attendanceItem:first-child{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
.attendanceItem:last-child{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border-right:1px solid #dddddd;
}
.attendanceItemSelected{
    background:#38adff;
    color: #fff;
    border:0;
}
.computedAttendance{
    height:50px;
    width: 100%;
    padding-bottom:10px; 
}
</style>