<template>
    <div class="childInfo">
        <chat-header :showBack="true" :title="'本月家园通'" :showRightBtn="false" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <!-- <el-form-item>
                    <el-select v-model="formInline.classID" filterable size="medium" placeholder="请选择班级" @change="reloadList">
                        <el-option
                        v-for="item in formInline.classList"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-radio v-model="formInline.radio" label="-1" style="margin-left:20px;" @change="getMonthPerformance">以园所为单位</el-radio>
                    <el-radio v-model="formInline.radio" label="0" style="margin-left:20px;" @change="getMonthPerformance">以班级为单位</el-radio>
                    <el-radio v-model="formInline.radio" label="-2" style="margin-left:20px;" @change="getMonthPerformance">以孩子为单位</el-radio>
                </el-form-item>
                <!-- <el-form-item v-show="formInline.radio=='0'">
                    <el-date-picker
                        v-model="formInline.date"
                        size="medium"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        @change="reloadList">
                    </el-date-picker>
                </el-form-item> -->
                <!-- <el-form-item>
                    <el-button type="primary" size="medium" v-show="canSetPaymentSubject" @click="setPaymentSubject">缴费科目:cell-class-name="getCellClass"</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <el-table :data="tableData" border max-height="600" style="width:100%;display:block;" :header-cell-class-name="getHeaderCellClass">
            <!-- <el-table-column fixed prop="ChildNum" align="center" label="学号" width="100"></el-table-column> -->
            <!-- <el-table-column fixed prop="ChildName" align="center" :label="'姓名'" width="100"></el-table-column> -->
            <!-- <el-table-column align="center" label="保育费缴费科目" width="200">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.TuitionTypeID" filterable size="medium">
                        <el-option
                        v-for="item in tuitionType"
                            :key="item.ID"
                            :label="item.PaymentName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column> -->
            <el-table-column fixed align="center" :label="'姓名'" width="100">
                <template slot-scope="scope">
                    <!-- <div v-show="!scope.row.AttData[index].number&&scope.row.AttData[index].number!=0">
                        <el-checkbox style="margin-bottom:0px;" v-model="scope.row.AttData[index].selected" :disabled="scope.row.AttData[index].disabled" @change="changeChildAttendance(scope,index)"></el-checkbox>
                    </div> -->
                    <div>{{ scope.row.name }}</div>
                    <!-- <div>{{ scope.row[] }}</div> -->
                </template>
            </el-table-column>
            <el-table-column v-for="(item,index) in columnList" :key="index" align="center" :label="item.name" min-width="40">
                <template slot-scope="scope">
                    <!-- <div v-show="!scope.row.AttData[index].number&&scope.row.AttData[index].number!=0">
                        <el-checkbox style="margin-bottom:0px;" v-model="scope.row.AttData[index].selected" :disabled="scope.row.AttData[index].disabled" @change="changeChildAttendance(scope,index)"></el-checkbox>
                    </div> -->
                    <!-- <div>12</div> -->
                    <div class="clickColor" @click="dateClick(scope.row,item.name)">{{ scope.row[$route.params.month+"-"+item.name].text }}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="AttNum" fixed="right" align="center" label="出勤天数" width="100"></el-table-column> -->
        </el-table> 
    </div>
</template>

<script>

import { getMonthPerformance } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'TeacherEvaluationMonth',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
                radio:"-1",
                data:""
            },
            tableData:[],
            columnList:[
                { name:"01" }
            ],
        }
    },
    components:{
        NoData,
        ChatHeader
    },
    mounted(){
        // let date = new Date();
        
        this.getMonthPerformance();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    watch:{
        
    },
    methods:{
        getHeaderCellClass({row, column, rowIndex, columnIndex}) {
            return "note-attendance-height note-attendance-bg-blue"
        },
        // 其他tablecell样式
        getCellClass({row, column, rowIndex, columnIndex}) {
            // console.log(row, column, rowIndex, columnIndex);
            if(columnIndex==2||columnIndex==3||columnIndex==4){
                return "note-attendance-bg-red"
            }
            if(columnIndex==5||columnIndex==6||columnIndex==7){
                return "note-attendance-bg-green"
            }
        },
        dateClick(obj,date){
            let dataStr = this.$route.params.month+"-"+date;
            let staffID = this.$route.params.staffID;
            console.log(obj,obj[dataStr].oldText,dataStr);
            let type = '';// 园所通知:kindgargenNotice 园所照片:kindgargenImage 班级通知:classNotice 班级照片:classImage
            if(obj.name=="园所通知"){
                type = 'kindgargenNotice';
            }else if(obj.name=="园所照片"){
                type = 'kindgargenImage';
            }else if(obj.name=="班级通知"){
                type = 'classNotice';
            }else if(obj.name=="班级照片"){
                type = 'classImage';
            }else{
                type = obj.childID;
            }
            let router = '/mainpage/office/2/teacherEvaluation/notice/'+staffID+'/'+type+'/'+dataStr;
            this.$router.push(router);
        },
        getMonthPerformance(){
            let staffID = this.$route.params.staffID;
            let month = this.$route.params.month.split("-").join("");
            let currYear = new Date().getFullYear();
            let currMonth = new Date().getMonth();
            // 如果是当月
            if(this.$route.params.month.split("-")[0]==currYear&&parseInt(this.$route.params.month.split("-")[1])-1==currMonth){
                let currDate = new Date().getDate();
                this.columnList = [];
                for(let i=0;i<currDate;i++){
                    let json = {
                        name:(Array(3).join(0)+(i+1)).slice(-2)
                    }
                    this.columnList.push(json);
                }
            }else{
                let firstDate = new Date(this.$route.params.month.split("-")[0],parseInt(this.$route.params.month.split("-")[1])-1,1);
                firstDate.setMonth(firstDate.getMonth()+1);
                firstDate.setDate(firstDate.getDate()-1);
                let currDate = firstDate.getDate();
                for(let i=0;i<currDate;i++){
                    let json = {
                        name:(Array(3).join(0)+(i+1)).slice(-2)
                    }
                    this.columnList.push(json);
                }
            }
            getMonthPerformance(staffID,month,this.formInline.radio).then((result)=>{
                
                let tableData = result.data.data;
                let table = [];
                for(let i=0;i<tableData.length;i++){
                    let json = {};
                    if(this.formInline.radio=="-1"){// 园所
                        for(let key in tableData[i]){
                            
                            if(key=="TypeName"){
                                json.name = tableData[i].TypeName;
                            }else{
                                json[key] = { text:tableData[i][key],oldText:tableData[i][key] };
                            }
                        }
                    }
                    if(this.formInline.radio=="0"){// 班级
                        for(let key in tableData[i]){
                            if(key=="TypeName"){
                                json.name = tableData[i].TypeName;
                            }else{
                                if(tableData[i][key]){
                                    let dateJSON = {};
                                    let dataStrArray = tableData[i][key].split("|");
                                    let num = 0;
                                    for(let j=0;j<dataStrArray.length;j++){
                                        num += parseInt(dataStrArray[j].split(";")[2]);
                                    }
                                    dateJSON.text = num;
                                    dateJSON.oldText = tableData[i][key];
                                    json[key] = dateJSON;
                                }else{
                                    let dateJSON = { text:"",oldText:"" };
                                    json[key] = dateJSON;
                                }
                            }
                        }
                    }
                    if(this.formInline.radio=="-2"){// 幼儿
                        for(let key in tableData[i]){
                            if(key=="TypeName"){
                                json.childID = tableData[i].TypeName.split("|")[0];
                                json.name = tableData[i].TypeName.split("|")[1];
                            }else{
                                if(tableData[i][key]){
                                    let dateJSON = {};
                                    let dataStrArray = tableData[i][key].split("|");
                                    let num = 0;
                                    for(let j=0;j<dataStrArray.length;j++){
                                        num += parseInt(dataStrArray[j].split(";")[1]);
                                    }
                                    dateJSON.text = num;
                                    dateJSON.oldText = tableData[i][key];
                                    json[key] = dateJSON;
                                }else{
                                    let dateJSON = { text:"",oldText:"" };
                                    json[key] = dateJSON;
                                }
                            }
                        }
                    }
                    table.push(json);
                }
                this.tableData = table;
            })
            .catch((err)=>{
                alertError(this,"1000")
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.childInfo{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .staffInfo{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.childInfoList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.clickColor{
    color:#38adff;
    cursor: pointer;
}
</style>