<template>
    <div class="SchoolInformList">
        <chat-header :showBack="true" :title="'老师的话'"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="班级" style="margin-left:10px;">
                    <el-select v-model="form.classID" filterable size="medium" @change="getChildsByClassID" style="width:150px;" placeholder="请选择班级">
                        <el-option
                            v-for="item in form.classArr"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="findType" style="margin-left:10px;">
                    <el-select v-model="form.childID" v-show="radio=='name'" size="medium" @change="loadList" filterable style="width:150px;" placeholder="请选择幼儿">
                        <el-option
                            v-for="item in form.childArr"
                            :key="item.Id"
                            :label="item.ChildName"
                            :value="item.Id">
                        </el-option>
                    </el-select>
                    <el-date-picker
                        v-model="form.date"
                        v-show="radio=='date'"
                        @change="loadList"
                        style="width:150px;"
                        type="date"
                        size="medium"
                        :clearable="false"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="" style="margin-left:10px;">
                    <el-radio v-model="radio" label="name" @change="clickName">按姓名</el-radio>
                    <el-radio v-model="radio" label="date" @change="clickDate">按日期</el-radio>
                </el-form-item>

                <!-- <el-form-item label="" style="float:right;transform:translateX(10px);">
                    <el-date-picker
                        style="width:250px;"
                        v-model="form.dateRange"
                        type="daterange"
                        range-separator="一"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        @change="changeDateRange"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                    <el-button type="primary" style="margin-left:5px;" @click="loadList()">查询</el-button>
                </el-form-item> -->
            </el-form>
        </div>

        <div class="midTableHeight" style="width:100%;display:block;transform:translateY(-10px);">
            <el-table :data="teacherWordList" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="485">
                <el-table-column prop="WriteDate" v-if="radio=='name'" align="center" label="日期"  width="160"></el-table-column>
                <el-table-column prop="ChildName" v-if="radio=='date'" align="center" label="姓名"  width="160"></el-table-column>
                <el-table-column label="文字内容" width="">
                    <template slot-scope="scope">
                        <el-popover width="500" trigger="hover" v-show="scope.row.Note!=''" placement="bottom">
                            <div v-html="scope.row.Note"></div>
                            <div slot="reference">
                                <span class="spanTitle" v-show="!scope.row.ellipsis" @click="examineNotice(scope.row)" v-html="scope.row.Note"></span>
                                <span class="spanTitle" v-show="scope.row.ellipsis" @click="examineNotice(scope.row)" v-html="scope.row.ellipsisContent"></span>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <div>
                <el-pagination
                    style="float:left;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="form.informNum">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>

import { getChildEveryDayLives,getAllClasses,getChildsByClassID } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import NoData from '@/components/chat/NoData'
import ChatHeader from '@/components/chat/ChatHeader'
// import InternalEmailItem from '@/page/office/internalEmail/InternalEmailItem'

export default {
    name: 'SchoolInformList',
    data(){
        return {
            form: {
                informNum:0,
                dateRange:"",
                startDate:"",
                endDate:"",
                classID:"",
                classArr:[],
                childID:"",
                childArr:[],
                date:"",
            },
            // dialogVisible:false,
            radio:"name",
            clickItem:{},
            teacherWordList:[],
            pageSize:10,
            currentPage:1,
        }
    },
    components:{
        ChatHeader,
    },
    mounted(){
        this.getAllClasses();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        findType(){
            if (this.radio=='name') {
                return '幼儿'
            }else{
                return '日期'
            }
        },
    },
    methods:{
        loadList(){
            this.teacherWordList = [];
            // pageNo
            // pageSize
            // staffID  传0即可
            // childID
            let childID;
            let classID;
            if (this.radio == "date") {
                classID = this.form.classID;
                childID = "-1";
            }else{
                classID = "-1";
                childID = this.form.childID;
            }
            let startDate = this.form.date;
            let endDate = this.form.date;
            let loading = showLoading();
            getChildEveryDayLives(this.currentPage,this.pageSize,"0",classID,childID,startDate,endDate).then((result)=>{
                closeLoading(loading);
                let resultData = result.data;
                let obj = resultData.data;
                for(let i=0;i<obj.length;i++){
                    if (obj[i].Note.indexOf('<br />')!="-1") {
                        obj[i].ellipsis = true;
                        obj[i].ellipsisContent = obj[i].Note.split("<br />")[0]+' ...';
                    }else{
                        obj[i].ellipsis = false;
                    }
                    this.teacherWordList.push(obj[i]);
                }
                this.form.informNum = parseInt(resultData.totalCount);
                if(this.teacherWordList.length==0){
                    this.form.informNum = 0;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1008");
            });
        },
        getAllClasses(){
            this.form.classArr = [];
            let classStatus = "-1";
            getAllClasses(classStatus).then((result)=>{
                // console.log(result.data)
                this.form.classArr = result.data.data;
                this.form.classID = this.form.classArr[0].ID;
                this.getChildsByClassID();
                // this.loadList();
            }).catch((err)=>{
                alertError(this,"1039");
            });
        },
        getChildsByClassID(){
            this.form.childArr = [];
            if (this.radio == "name") {
                getChildsByClassID(this.form.classID).then((result)=>{
                    this.form.childArr = result.data.data;
                    // this.form.childID = this.form.childArr[0].Id;
                    // this.loadList();
                    if (this.form.childArr.length!='0') {
                        this.form.childID = this.form.childArr[0].Id;
                        this.loadList();
                    }else{
                        this.form.childID = "";
                        this.teacherWordList = [];
                    }
                }).catch((err)=>{
                    alertError(this,"1003");
                });
            }else if (this.radio == "date") {
                this.loadList();
            }
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.loadList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.loadList();
        },
        changeDateRange(){
            this.form.startDate = this.form.dateRange?this.form.dateRange[0]:"";
            this.form.endDate = this.form.dateRange?this.form.dateRange[1]:"";
        },
        examineNotice(item){
            let id = item.ID;
            this.$router.push(this.$route.fullPath+"/examine/"+id);
        },
        getNowDate() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            let currentdate = year + "-" + month;
            this.form.date = currentdate + "-" + strDate;
        },
        clickName(){
            // this.form.classID = this.form.classArr[0].ID;
            // this.form.childID = this.form.childArr[0].Id;
            this.getAllClasses();
            this.form.date = '';
            this.loadList();
        },
        clickDate(){
            this.getNowDate();
            this.loadList();
        },
        //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0) {
                if (columnIndex == 0) {
				    return 'padding-bottom:7px;background:#38ADFF;color:#fff;'
                }
                return 'background:#38ADFF;color:#fff;text-align:center;'
            }
        },
        getColStyle({ row, column, rowIndex, columnIndex }){
            if (columnIndex == 0) {
				return 'padding-bottom:7px;text-align:center;'
			} else {
				return ''
            }
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
            return '';
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.SchoolInformList{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .teacherWordList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.teacherWordList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .teacherWordList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .teacherWordList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.addbtn{
    float: right;
}
.spanTitle{
    display: block;
    height: 22px;
    color:#38ADFF;
    cursor: pointer;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.iconfont{
    font-weight: normal;
    font-size: 20px;
}
</style>