<template>
    <div class="SchoolInformList">
        <chat-header :showBack="true" :title="'家校联络'"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="" style="transform:translateX(-10px);">
                    <el-radio style="margin-left:10px;" @change="loadList" v-model="type" label="0">班级通知</el-radio>
                    <el-radio style="margin-left:5px;" @change="loadList" v-model="type" label="1">班级作业</el-radio>
                    <el-radio style="margin-left:5px;" @change="loadList" v-model="type" label="2">今日所学</el-radio>
                </el-form-item>

                <el-form-item label="班级" style="margin-left:10px;">
                    <el-select v-model="form.classID" filterable @change="loadList" size="medium" style="width:150px;" placeholder="请选择班级">
                        <el-option
                            v-for="item in form.classArr"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="" style="float:right;transform:translateX(10px);">
                    <el-date-picker
                        style="width:250px;"
                        v-model="form.dateRange"
                        type="daterange"
                        range-separator="一"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        size="medium"
                        @change="changeDateRange"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                    <el-button type="primary" style="margin-left:5px;" size="medium" @click="loadList()">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="midTableHeight" style="width:100%;display:block;transform:translateY(-10px);">
            <el-table :data="schoolInformList" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="485">
                <el-table-column prop="ID" align="center"  label="ID"  width="60"></el-table-column>
                <el-table-column prop="Promulgator" align="center"  label="发布人"  width="80"></el-table-column>
                <el-table-column prop="PromulgateTime" align="center" label="发布时间"  width="160"></el-table-column>
                <el-table-column label="文字内容" width="">
                    <template slot-scope="scope">
                        <el-popover width="500" trigger="hover" placement="bottom">
                            <div v-html="scope.row.NoticeContent"></div>
                            <div slot="reference">
                                <span class="spanTitle" v-show="!scope.row.ellipsis" @click="examineNotice(scope.row)" v-html="scope.row.NoticeContent"></span>
                                <span class="spanTitle" v-show="scope.row.ellipsis" @click="examineNotice(scope.row)" v-html="scope.row.ellipsisContent"></span>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="hasImage" align="center"  label="图片"  width="60">
                    <template slot-scope="scope">
                        <span class="imageSpan" :style="{color:scope.row.hasImage=='有'?'#4DC060':'#e51c23'}" @click="examineNotice(scope.row)">{{scope.row.hasImage}}</span>
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

import { getNotices,getAllClasses } from '@/js/api'
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
            },
            // dialogVisible:false,
            type:"0",
            clickItem:{},
            schoolInformList:[],
            pageSize:10,
            currentPage:1,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
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

    },
    methods:{
        loadList(){
            this.schoolInformList = [];
            let classID = this.form.classID;
            let type = this.type;
            let loading = showLoading();
            getNotices(this.currentPage,this.pageSize,classID,type,this.form.startDate,this.form.endDate).then((result)=>{
                closeLoading(loading);
                let resultData = result.data;
                let obj = resultData.data;
                console.log(obj)
                for(let i=0;i<obj.length;i++){
                    if (obj[i].NoticeContent.indexOf('<br />')!="-1") {
                        obj[i].ellipsis = true;
                        obj[i].ellipsisContent = obj[i].NoticeContent.split("<br />")[0]+' ...';
                    }else{
                        obj[i].ellipsis = false;
                    }
                    if (obj[i].Img1!='') {
                        obj[i].hasImage = "有";
                    }else{
                        obj[i].hasImage = "";
                    }
                    this.schoolInformList.push(obj[i]);
                }
                console.log(this.schoolInformList)
                this.form.informNum = parseInt(resultData.totalCount);
                if(this.schoolInformList.length==0){
                    this.form.informNum = 0;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1004");
            });
        },
        getAllClasses(){
            let classStatus = "-1";
            getAllClasses(classStatus).then((result)=>{
                // console.log(result.data)
                this.form.classArr = result.data.data;
                this.form.classID = this.form.classArr[0].ID;
                this.loadList();
            }).catch((err)=>{
                alertError(this,"1039");
            });
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
/* .schoolInformList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.schoolInformList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .schoolInformList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .schoolInformList{
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
.imageSpan{
    cursor: pointer;
}
</style>