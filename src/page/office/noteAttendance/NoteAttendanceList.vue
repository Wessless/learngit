<template>
    <div class="noteAttendance">
        <chat-header :showBack="true" :title="'幼儿出勤'" :showRightBtn="false"></chat-header>
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
                <el-form-item>
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
                <el-form-item>
                    <el-button size="medium" type="primary">切换到单日模式</el-button>
                </el-form-item>
                <el-form-item style="float:right;margin-right:0;">
                    <el-button size="medium">取消全选并保存</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button size="medium" type="primary">全选并保存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border max-height="600" style="width:100%;display:block;" :cell-class-name="getCellClass" :header-cell-class-name="getHeaderCellClass">
            <el-table-column fixed prop="ChildName" align="center" label="姓名" width="120"></el-table-column>
            <el-table-column v-for="(item,index) in columnList" :key="index" align="center" :label="item.name" min-width="40">
                <template slot-scope="scope">
                    <div v-show="!scope.row.AttData[index].number">
                        <!-- {{ scope.row.AttData[index].selected }} -->
                        
                        <el-checkbox style="margin-bottom:0px;" v-model="scope.row.AttData[index].selected" :disabled="scope.row.AttData[index].disabled" @change="changeChildAttendance(scope,index)"></el-checkbox>
                    </div>
                    <div v-show="scope.row.AttData[index].number">{{ scope.row.AttData[index].number }}</div>
                </template>
            </el-table-column>
            
            <el-table-column prop="AttNum" fixed="right" align="center" label="出勤天数" width="100"></el-table-column>
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

import { getClasses,getChildAttsByDate,updateChilAtts } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'NoteAttendance',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
                month:""
            },
            tableData: [
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
            totalList:[{
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
            }],
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
        totalList1(){
            this.tableData
        }
    },
    watch:{
        
    },
    methods:{
        totalListInit(){
            for(let i=0;i<this.totalList[0].AttData.length;i++){
                this.totalList[0].AttData[i].number = 0;
            }
            for(let i=0;i<this.totalList[1].AttData.length;i++){
                this.totalList[1].AttData[i].number = 0;
            }
            this.changeTableObj = {};
        },
        loadList(loading){
            let staffID = this.userInfo.userStaffID;
            let classID = this.formInline.classID;
            let month = this.formInline.month;
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
            if(classID==""){
                this.$message({
                    message: '该员工没有班级'
                });
                closeLoading(loading);
                return;
            }
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
                console.log(array)
                array.push(this.totalList[0]);
                array.push(this.totalList[1]);
                this.tableData = array;
            }).catch((err)=>{
                closeLoading(loading);
            });
            
        },
        reloadList(){
            let loading = showLoading();
            this.loadList(loading);
        },
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
        // getTotalCellClass({row, column, rowIndex, columnIndex}) {
        //     return "note-attendance-height note-attendance-bg-yellow"
        // },
        getHeaderCellClass({row, column, rowIndex, columnIndex}) {
            return "note-attendance-height note-attendance-bg-blue"
        },
        changeChildAttendance(scope,index){
            console.log(scope,index);
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
            if(this.changeTableObj[childID+"|"+attDate]==undefined){
                this.changeTableObj[childID+"|"+attDate] = selected;
            }else{
                this.changeTableObj[childID+"|"+attDate] = undefined;
            }
            
        },
        confirm(){

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
</style>