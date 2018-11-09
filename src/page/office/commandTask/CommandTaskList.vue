<template>
    <div class="CommandTaskList">
        <router-view :item="clickItem" :state="state"></router-view>
        <chat-header :showBack="true" :title="'交办任务'" :showRightBtn="true" :rightBtnTitle="'发布'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="issueTask"></chat-header>
        <div style="width:100%;padding:54px 20px 20px 20px;overflow:scroll;">
            <el-tabs v-model="tabSelect" @tab-click="handleClick" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;width:100%;" class="commandTaskTabs">
                <el-tab-pane label="我收到的" name="first" >
                    <div style="margin:0 0px 10px 10px;">
                        <el-radio v-model="state" label="0" @change="changeState">进行中的</el-radio>
                        <el-radio v-model="state" label="1" @change="changeState">已结束的</el-radio>
                    </div>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 10px;">
                        <el-table :data="commandTaskList" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="455">
                            <el-table-column prop="CreateUser" align="center"  label="姓名"  width="140"></el-table-column>
                            <el-table-column label="任务内容" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.Content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="创建时间"  width="160">
                                <template slot-scope="scope">
                                    <span>{{scope.row.CreateDate}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" :width="state=='0'?'150':'80'">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        @click="showDetail(scope.row)">详情</el-button>
                                    <el-button
                                        type="danger"
                                        size="mini"
                                        v-show="state=='0'"
                                        @click="endDetail(scope.row)">结束</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="margin-bottom:50px;">
                            <el-pagination
                                style="float:left;"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="itemNum">
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="我发布的" name="second" >
                    <div style="margin:0 0px 10px 10px;">
                        <el-radio v-model="state" label="0" @change="loadList">进行中的</el-radio>
                        <el-radio v-model="state" label="1" @change="loadList">已结束的</el-radio>
                    </div>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 10px;">
                        <el-table :data="commandTaskList" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="455">
                            <el-table-column prop="CreateUser" align="center"  label="姓名"  width="140"></el-table-column>
                            <el-table-column label="交办内容" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.Content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="创建时间"  width="160">
                                <template slot-scope="scope">
                                    <span>{{scope.row.CreateDate}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" :width="state=='0'?'150':'80'">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        @click="showDetail(scope.row)">详情</el-button>
                                    <el-button
                                        type="danger"
                                        size="mini"
                                        v-show="state=='0'"
                                        @click="endDetail(scope.row)">结束</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="margin-bottom:50px;">
                            <el-pagination
                                style="float:left;"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="itemNum">
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="抄送我的" name="third" >
                    <div style="margin:0 0px 10px 10px;">
                        <el-radio v-model="state" label="0" @change="loadList">进行中的</el-radio>
                        <el-radio v-model="state" label="1" @change="loadList">已结束的</el-radio>
                    </div>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 10px;">
                        <el-table :data="commandTaskList" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="455">
                            <el-table-column prop="CreateUser" align="center"  label="姓名"  width="140"></el-table-column>
                            <el-table-column label="任务内容" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.Content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="创建时间"  width="160">
                                <template slot-scope="scope">
                                    <span>{{scope.row.CreateDate}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" :width="state=='0'?'150':'80'">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        @click="showDetail(scope.row)">详情</el-button>
                                    <el-button
                                        type="danger"
                                        size="mini"
                                        v-show="state=='0'"
                                        @click="endDetail(scope.row)">结束</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="margin-bottom:50px;">
                            <el-pagination
                                style="float:left;"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="itemNum">
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog
            title="发布交办任务"
            :visible.sync="dialogVisibleIssue"
            width="500px">
            <el-form :model="form" label-width="140px">
                <el-form-item label="到期时间">
                    <el-date-picker
                        v-model="form.endDate"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="请选择截止日期"
                        style="width:230px"
                        size="small">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="提醒时间">
                    <el-select v-model="form.remindTime" size="small" style="width:230px;" placeholder="请选择提醒时间">
                        <el-option
                            v-for="item in form.remindTimeArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交办内容">
                    <el-input v-model="form.content" style="width:230px;margin:5px 0 8px 0" type="textarea" rows="4" size="small" placeholder="请输入交办内容"></el-input>
                </el-form-item>
                <el-form-item label="接受人" :style="form.receiveStaffs.length!=0?{margin:'5px 0 8px 0'}:''">
                    <el-select v-model="form.receiveStaffs" multiple size="small" style="width:230px;" filterable placeholder="请选择接受人">
                        <el-option
                            v-for="item in allStaffs"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="抄送人" :style="form.ccStaffs.length!=0?{margin:'5px 0 0 0'}:''">
                    <el-select v-model="form.ccStaffs" multiple size="small" style="width:230px;" filterable placeholder="请选择抄送人">
                        <el-option
                            v-for="item in allStaffs"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleIssue = false">取 消</el-button>
                <el-button type="primary" @click="confirmIssue">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="提示"
            :visible.sync="dialogVisibleEnd"
            width="500px">
            <span>您确定处理结束了吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleEnd = false">取 消</el-button>
                <el-button type="primary" @click="confirmEnd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getCommands,updateCommandByID,addCommand } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'CommandTaskList',
    data(){
        return {
            form:{
                endDate:"",
                content:"",
                receiveStaffs:[],
                ccStaffs:[],
                remindTime:"",
                remindTimeArr:[
                    {value:"-1",label:"不提醒"},
                    {value:"0.25",label:"截止前15分钟"},
                    {value:"1",label:"截止前1小时"},
                    {value:"3",label:"截止前3小时"},
                    {value:"24",label:"截止前1天"},
                ]
            },
            tabSelect:"first",

            commandTaskList:[],
            currentPage:1,
            pageSize:10,
            itemNum:0,
            status:"1",
            state:"0",

            clickItem:{},
            dialogVisibleEnd:false,
            dialogVisibleIssue:false,
        }
    },
    components:{
        NoData,
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
        loadList(){
            this.commandTaskList = [];
            let staffID = this.userInfo.userStaffID;
            let loading = showLoading();
            getCommands(this.currentPage,this.pageSize,staffID,this.status,this.state).then((result)=>{
                closeLoading(loading);
                this.commandTaskList = result.data.data;
                this.itemNum = parseInt(result.data.totalCount);
                console.log(this.commandTaskList);
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1186");
            });
        },
        //发布按钮
        issueTask(){
            this.form.endDate = "";
            this.form.ccStaffs = [];
            this.form.receiveStaffs = [];
            this.form.content = "";
            this.form.remindTime = "";
            this.dialogVisibleIssue = true;
        },
        confirmIssue(){
            let staffID = this.userInfo.userStaffID;
            let staffName = this.userInfo.userName;
            let endDate = this.form.endDate;
            let receiveStaffs = this.form.receiveStaffs;
            let ccStaffs = this.form.ccStaffs;
            let content = this.form.content;
            let remindTime = this.form.remindTime;
            if(content==""){
                this.$message.error({
                    message:"请输入交办内容"
                });
                return;
            }
            if(remindTime==""){
                this.$message.error({
                    message:"请选择提醒时间"
                });
                return;
            }
            if(receiveStaffs==""){
                this.$message.error({
                    message:"请选择接收人"
                });
                return;
            }
            
            this.dialogVisibleIssue = false;
            let loading = showLoading();
            addCommand(staffID,staffName,endDate,receiveStaffs,ccStaffs,content,remindTime).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.loadList();
                }else{
                    this.$message({
                        message: '添加失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"2118");
            });
        },
        //详情按钮
        showDetail(item){
            this.clickItem = item;
            this.$router.push(this.$route.fullPath+"/examine");
        },
        //结束按钮
        endDetail(item){
            this.clickItem = item;
            this.dialogVisibleEnd = true;
        },
        confirmEnd(){
            let id = this.clickItem.CommandID;
            this.dialogVisibleEnd = false;
            let loading = showLoading();
            updateCommandByID(id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.loadList();
                }else{
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2117");
            });
        },
        handleClick(tab, event) {
            this.state = "0";
            this.currentPage = 1;
            this.pageSize = 10;
            if (tab.label == "我收到的") {
                this.status = "1";
            }else if (tab.label == "我发布的") {
                this.status = "0";
            }else if (tab.label == "抄送我的") {
                this.status = "3";
            }
            this.loadList();
        },
        changeState(){
            this.currentPage = 1;
            this.pageSize = 10;
            this.loadList();
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.loadList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.loadList();
        },
        //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0) {
                // if (columnIndex == 0) {
				//     return 'padding-bottom:7px;background:#38ADFF;color:#fff;'
                // }
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
        tableCellClassName({ row, column, rowIndex, columnIndex }) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.CommandTaskList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .commandTaskList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.commandTaskList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .commandTaskList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .commandTaskList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.bBtn{
    display: inline-block;
    margin-left: 5px;
    font-size: 12px;
    font-weight: normal;
    padding: 2px 2px 0 2px;
    line-height: 13px;
    border-radius: 12%;
    color:#fff;
    background:#38adff;
    border:1px solid #38adff;
    /* cursor: pointer; */
    /* color: #999; */
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.spanTitle{
    display: inline-block;
    height: 22px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.orangeButton{
    background: #FF9D00;
    border-color: #FF9D00;
    color: #fff;
}
.orangeButton:hover{
    background: rgb(255, 179, 56);
    border-color: rgb(255, 179, 56);
    color: #fff;
}
.iconStyle{
    font-family: "iconfont" !important;
    font-size: 13px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0px;
    color: #38adff;
    cursor: pointer;
}
.imgS{
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    transform: translateY(-1px);
}
</style>