<template>
    <div class="SchoolInformList">
        <router-view @showDialog="showDialog"></router-view>
        <chat-header :showBack="true" :title="'园所通知'"></chat-header>
        <div style="overflow:scroll;width:100%;height:100vh;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" style="padding-bottom:10px;" :model="form" class="demo-form-inline">
                <el-form-item label="通知期间">
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
                    <el-button type="primary" style="margin-left:20px;" size="medium" @click="loadList()">查询</el-button>
                </el-form-item>
                <el-form-item label="" style="float:right;transform:translateX(10px)">
                    <el-button type="primary" size="medium" @click="addNotice">发布</el-button>
                </el-form-item>
            </el-form>
            <div class="midTableHeight" style="width:100%;display:block;">
                <el-table :data="schoolInformList" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="485">
                    <el-table-column prop="ID" align="center"  label="ID"  width="80"></el-table-column>
                    <el-table-column prop="Promulgator" align="center"  label="发布人"  width="80"></el-table-column>
                    <el-table-column prop="PromulgateTime" align="center" label="发布时间"  width="160"></el-table-column>
                    <el-table-column label="文字内容" width="">
                        <template slot-scope="scope">
                            <el-popover width="500" trigger="hover" placement="bottom">
                                <div v-html="scope.row.NoticeContent" style="word-break:break-all;"></div>
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
                    <el-table-column label="操作" align="center"  width="80">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="danger"
                                @click="deleteNotice(scope.row,scope.$index)">删除</el-button>
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
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
                <span>是否删除该相册</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmDelete">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>

import { getNotices,deleteNoteByID } from '@/js/api'
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
            },
            dialogVisible:false,
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
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    methods:{
        showDialog(v){
            // this.isTodayDate = v;
            if (v) {
                this.currentPage = 1;
                this.pageSize = 10;
                this.form.dateRange = "";
                this.form.startDate = "";
                this.form.endDate = "";
                this.loadList();
            }
        },
        loadList(){
            this.schoolInformList = [];
            let classID = "0";
            let type = "0";
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
            this.currentPage = 1;
            this.loadList();
        },
        examineNotice(item){
            let id = item.ID;
            this.$router.push(this.$route.fullPath+"/examine/"+id);
        },
        addNotice(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        deleteNotice(item){
            console.log(item);
            this.clickItem = item;
            this.dialogVisible = true;
        },
        confirmDelete(){
            this.dialogVisible = false;
            let loading = showLoading();
            deleteNoteByID(this.clickItem.ID).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        type:"success",
                        message:"删除成功"
                    });
                    this.loadList();
                }else{
                    this.$message({
                        type:"error",
                        message:"删除失败"
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2011");
            });
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
    /* display: flex;
    flex-direction: row; */
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .schoolInformList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
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