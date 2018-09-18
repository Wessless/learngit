<template>
    <div class="childInfo">
        <chat-header :showBack="true" :title="title" :showRightBtn="false" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'"></chat-header>
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
                <!-- <el-form-item>
                    <el-radio v-model="formInline.radio" label="-1" style="margin-left:20px;" @change="getMonthPerformance">以园所为单位</el-radio>
                    <el-radio v-model="formInline.radio" label="0" style="margin-left:20px;" @change="getMonthPerformance">以班级为单位</el-radio>
                    <el-radio v-model="formInline.radio" label="-2" style="margin-left:20px;" @change="getMonthPerformance">以孩子为单位</el-radio>
                </el-form-item> -->
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
            <el-table-column prop="ID" align="center" label="ID" width="80"></el-table-column>
            <el-table-column prop="StaffName" align="center" label="发送人" width="100"></el-table-column>
            <el-table-column v-if="isClass" prop="CName" align="center" label="班级名称" width="100"></el-table-column>
            <el-table-column v-if="isChild" prop="CName" align="center" label="幼儿姓名" width="100"></el-table-column>
            <el-table-column v-if="isChild" prop="typeName" align="center" label="类型" width="100"></el-table-column>
            <el-table-column align="center" label="创建时间" width="100">
                <template slot-scope="scope">
                    <div>{{ scope.row.CreateTime.split(" ")[0] }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="Content" align="center" label="内容"></el-table-column>
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
            <!-- <el-table-column fixed align="center" :label="'姓名'" width="100">
                <template slot-scope="scope">
                    <div>{{ scope.row.name }}</div>
                </template>
            </el-table-column>
            <el-table-column v-for="(item,index) in columnList" :key="index" align="center" :label="item.name" min-width="40">
                <template slot-scope="scope">
                    <div>12</div>
                    <div class="clickColor" @click="dateClick(scope.row,item.name)">{{ scope.row[$route.params.month+"-"+item.name].text }}</div>
                </template>
            </el-table-column> -->
            <!-- <el-table-column prop="AttNum" fixed="right" align="center" label="出勤天数" width="100"></el-table-column> -->
        </el-table> 
    </div>
</template>

<script>

import { getHomeTong } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'PaymentSubjectList',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
                radio:"-1",
                data:""
            },
            title:"",
            isChild:false,
            isClass:false,
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
        // 园所通知:kindgargenNotice 园所照片:kindgargenImage 班级通知:classNotice 班级照片:classImage
        if(this.$route.params.typeID=="kindgargenNotice"){
            this.title = "园所通知";
            this.getHomeTong("-1","N","").then((result)=>{
                this.tableData = result.data;
            }).catch((err)=>{
                alertError(this,"1294")
            });
        }else if(this.$route.params.typeID=="kindgargenImage"){
            this.title = "园所照片";
            this.getHomeTong("-1","P","").then((result)=>{
                this.tableData = result.data;
            }).catch((err)=>{
                alertError(this,"1294")
            });
        }else if(this.$route.params.typeID=="classNotice"){
            this.title = "班级通知";
            this.isClass = true;
            this.getHomeTong("0","N","3").then((result)=>{
                this.tableData = result.data;
            }).catch((err)=>{
                alertError(this,"1294")
            });
        }else if(this.$route.params.typeID=="classImage"){
            this.title = "班级照片";
            this.isClass = true;
            this.getHomeTong("0","P","3").then((result)=>{
                this.tableData = result.data;
            }).catch((err)=>{
                alertError(this,"1294")
            });
        }else{
            this.title = "幼儿家园通";
            this.isChild = true;
            let promiseArray = [this.getHomeTong("-2","P",this.$route.params.typeID),this.getHomeTong("-2","L",this.$route.params.typeID)];
            Promise.all(promiseArray).then((result)=>{
                this.tableData = [];
                let result1 = result[0];
                let result2 = result[1];
                for(let i=0;i<result1.data.length;i++){
                    result1.data[i].typeName = "个人照片";
                    this.tableData.push(result1.data[i]);
                }
                for(let i=0;i<result2.data.length;i++){
                    result2.data[i].typeName = "老师的话";
                    this.tableData.push(result2.data[i]);
                }
            }).catch((err)=>{
                alertError(this,"1294")
            });
        }
        
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
            // let dataStr = this.$route.params.month+"-"+date;
            // console.log(obj,obj[dataStr].oldText,dataStr);
            // let type = 'kindgargenNotice';// 园所通知:kindgargenNotice 园所照片:kindgargenImage 班级通知:classNotice 班级照片:classImage
            // let router = '/mainpage/office/2/teacherEvaluation/notice/'+type+'/'+dataStr;
        },
        getHomeTong(type,typeName,corcID){
            let theDate = this.$route.params.date;
            let staffID = this.$route.params.staffID;
            return getHomeTong(type,typeName,theDate,staffID,corcID)
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