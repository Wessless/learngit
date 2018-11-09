<template>
    <div class="IllegalManageList">
        <chat-header :fixIndex="10" :isgoBack="true" :gobackName="'goback'" @goback="goback" :showBack="true" :title="title"></chat-header>
        <div style="width:100%;padding:54px 20px 20px 20px;">
            <el-tabs v-model="tabSelect" @tab-click="handleClick" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;width:100%;" class="tuitionIncomeTabs">
                <el-tab-pane label="未免扣" name="first" >
                    <el-select v-model="selectStaff" @change="changeStaff('1')" style="float:left;width:150px;margin:10px 5px 10px 5px" size="medium" filterable placeholder="请选择员工">
                        <el-option
                            v-for="item in allStaffs"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                    <el-button style="display:block;float:right;margin:10px 5px 10px 5px;" type="primary" size="medium" @click="clickInsert">设为免扣</el-button>
                    <div class="midTableHeight" style="width:100%;display:block;padding:10px 5px;" v-if="tabSelect=='first'">
                        <el-table :data="illegalManageList" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" :cell-class-name="cellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="445">
                            <el-table-column type="selection" align="center" width="40"></el-table-column>
                            <el-table-column prop="newDate" align="center"  label="时间"  width="100"></el-table-column>
                            <el-table-column align="center"  label="打卡签到时间"  width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.FirstPunchTime==""?"无":scope.row.FirstPunchTime+"-"+scope.row.LastPunchTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="实际出勤时间"  width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.FirstActualTime==""?"无":scope.row.FirstActualTime+"-"+scope.row.LastActualTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="违规记录" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.Time=="0"?scope.row.Type:scope.row.Type+scope.row.Time+scope.row.Unit}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="status" align="center"  label="详情"  width="110">
                                <template slot-scope="scope">
                                    <!-- <span @click="showDetail(scope.row)" style="color:#38adff;cursor:pointer;line-height:14px;">申辩通过<br>(2018-10-08)</span> -->
                                    <span @click="showDetail(scope.row)" style="color:#38adff;cursor:pointer;">{{scope.row.status}}<br>{{scope.row.status!=""?'('+scope.row.JustifyTwoTime.split(" ")[0]+')':""}}</span>
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
                                :total="itemNum">
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="已免扣" name="second" >
                    <el-select v-model="selectStaff" @change="changeStaff('2')" style="float:left;width:150px;margin:10px 5px 10px 5px" size="medium" filterable placeholder="请选择员工">
                        <el-option
                            v-for="item in allStaffs"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                    <el-button style="display:block;float:right;margin:10px 5px 10px 5px;" type="primary" size="medium" @click="clickDelete">取消免扣</el-button>
                    <div class="midTableHeight" style="width:100%;display:block;padding:10px 5px;" v-if="tabSelect=='second'">
                        <el-table :data="illegalManageList1" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="445">
                            <el-table-column type="selection" align="center" width="38"></el-table-column>
                            <el-table-column prop="newDate" label="时间"  width="85"></el-table-column>
                            <el-table-column align="center"  label="打卡签到时间"  width="105">
                                <template slot-scope="scope">
                                    <span>{{scope.row.FirstPunchTime==""?"无":scope.row.FirstPunchTime+"-"+scope.row.LastPunchTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="实际出勤时间"  width="105">
                                <template slot-scope="scope">
                                    <span>{{scope.row.FirstActualTime==""?"无":scope.row.FirstActualTime+"-"+scope.row.LastActualTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="违规记录" width="103">
                                <template slot-scope="scope">
                                    <!-- <span>早退480分钟</span> -->
                                    <span>{{scope.row.Time=="0"?scope.row.Type:scope.row.Type+scope.row.Time+scope.row.Unit}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="DeleteName" align="center"  label="免扣操作"  width="77"></el-table-column>
                            <el-table-column label="操作时间"  width="96">
                                <template slot-scope="scope">
                                    <span>{{scope.row.DeleteTime.substring(5,16)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="免扣理由" >
                                <template slot-scope="scope">
                                    <span class="spanTitle" :title="scope.row.DeleteReason">{{scope.row.DeleteReason}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="status" align="center"  label="详情"  width="100">
                                <template slot-scope="scope">
                                    <span @click="showDetail(scope.row)" style="color:#38adff;cursor:pointer;">{{scope.row.status}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div>
                            <el-pagination
                                style="float:left;"
                                @size-change="handleSizeChange1"
                                @current-change="handleCurrentChange1"
                                :current-page="currentPage1"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="pageSize1"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="itemNum1">
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog
            title="设为免扣"
            class="workTimeSet"
            :visible.sync="dialogVisibleSet1"
            width="450px">
            <div style="color:#e51c23;font-weight:bold;margin:0 0 10px 60px;">请选择免予扣除的理由</div>
                <div style="margin-left:80px;">
                    <el-radio class="radioReason" v-model="form.deleteReason" label="迟到早退理由申辩获得通过">迟到早退理由申辩获得通过</el-radio>
                    <el-radio class="radioReason" v-model="form.deleteReason" label="休假申请获得审批通过">休假申请获得审批通过</el-radio>
                    <el-radio class="radioReason" v-model="form.deleteReason" label="属于有情可原的未打卡情况">属于有情可原的未打卡情况</el-radio>
                    <el-radio class="radioReason" v-model="form.deleteReason" label="属于系统错误导致的错误数据">属于系统错误导致的错误数据</el-radio>
                    <el-radio class="radioReason" v-model="form.deleteReason" label="按照公司特别规定统一进行的删除">按照公司特别规定统一进行的删除</el-radio>
                    <el-radio class="radioReason" v-model="form.deleteReason" label="elseReason">其他理由</el-radio>
                    <el-input v-model="form.elseReason" :disabled="disabledElse" type="textarea" rows="4" style="width:240px;" placeholder="请输入理由"></el-input>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleSet1 = false">取 消</el-button>
                <el-button type="primary" @click="insertTimeBookNGDel">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="取消免扣"
            :visible.sync="dialogVisibleSet2"
            width="500px">
            <span>您确定要取消免扣吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleSet2 = false">取 消</el-button>
                <el-button type="primary" @click="cancelDelete">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="违规详情"
            class="workTimeSet"
            :visible.sync="dialogVisibleShow"
            width="50%">
            <el-form ref="detail" :model="detail" label-width="120px">
                <el-form-item label="违规日期">
                    <el-date-picker
                        v-model="detail.NGDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :disabled="true"
                        style="width:400px"
                        size="small">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="辩解人">
                    <el-select v-model="detail.StaffID" :disabled="true" size="small" style="width:100px;" filterable placeholder="请选择积分分类">
                        <el-option
                            v-for="item in allStaffs"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                    <label style="color:#606266;margin:0 8px 0 28px;">辩解日期</label>
                    <el-date-picker
                        v-model="detail.JustifyTime"
                        size="small"
                        :disabled="true"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        style="width:200px;"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :placeholder="'请选择日期'">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="辩解种类" style="transform:translateY(-5px)">
                    <el-radio v-model="type" :disabled="true" label="1">未打卡的理由</el-radio>
                    <el-radio style="margin-left:20px;" v-model="type" :disabled="true" label="2">迟到或者早退理由</el-radio>
                </el-form-item>
                <el-form-item label="辩解理由" style="transform:translateY(-8px)" class="ReceiveApplyDetail_signatory">
                    <el-input v-model="detail.JustifyReason" :disabled="true" type="textarea" rows="4" style="width:400px;" placeholder="请输入辩解理由"></el-input>
                </el-form-item>
                <el-form-item label="审批人">
                    <el-select v-model="detail.ApproveStaffID" :disabled="true" size="small" style="width:100px;" filterable placeholder="请选择积分分类">
                        <el-option
                            v-for="item in allStaffs"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                    <label style="color:#606266;margin:0 8px 0 28px;">审批日期</label>
                    <el-date-picker
                        v-model="detail.ApprovedTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :disabled="true"
                        style="width:200px"
                        size="small">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审批意见" style="transform:translateY(-5px)">
                    <el-radio v-model="detail.Status" :disabled="true" label="2">同意</el-radio>
                    <el-radio v-model="detail.Status" :disabled="true" label="-1" style="margin-left:20px;">不同意</el-radio>
                    <el-radio v-model="detail.Status" :disabled="true" label="1"  style="margin-left:20px;">暂不签字</el-radio>
                </el-form-item>
                <el-form-item label="补充理由" style="transform:translateY(-8px)" class="ReceiveApplyDetail_signatory">
                    <el-input v-model="detail.ApprovedReason" :disabled="true" type="textarea" rows="4" style="width:400px;" placeholder="请输入补充理由"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>

import { getAllNGMessage,getAllNGDelMessage,findStaffByStaffID,insertTimeBookNGDel,cancelDelete,getJustifyByID } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'IllegalManageList',
    data(){
        return {
            title:"违规数据",

            yearMonth:"",
            beginDate:"",
            endDate:"",

            selectStaff:"",
            staffName:"",
            tabSelect:"first",
            dialogVisibleSet1:false,
            dialogVisibleSet2:false,
            dialogVisibleShow:false,

            clickItem:{},
            illegalManageList:[],
            illegalManageList1:[],

            pageSize:10,
            currentPage:1,
            itemNum:0,

            pageSize1:10,
            currentPage1:1,
            itemNum1:0,

            form:{
                scheduleID:"",
                scheduleIDArr:[],
                deleteReason:"迟到早退理由申辩获得通过",
                elseReason:"",
            },
            detail:{},
            type:"",
        }
    },
    props: {
        item:{
            type:Object
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.selectStaff = this.item.StaffID;
        findStaffByStaffID(this.selectStaff).then((result)=>{
            this.staffName = result.data.data[0].StaffName;
        }).catch((err)=>{
            alertError(this,"1015");
        });
        this.yearMonth = this.item.yearMonth;
        this.getAllNGMessage();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        disabledElse(){
            if (this.form.deleteReason == "elseReason") {
                return false;
            }else{
                this.form.elseReason = "";
                return true;
            }
        }
    },
    methods:{
        goback(){
            this.$emit("backRefresh");
            window.history.go(-1);
        },
        changeStaff(type){
            if (type == "1") {
                this.pageSize = 10;
                this.currentPage = 1;
                this.getAllNGMessage();
            }else{
                this.pageSize1 = 10;
                this.currentPage1 = 1;
                this.getAllNGDelMessage();
            }
        },
        getAllNGMessage(){
            this.illegalManageList = [];
            let year = this.yearMonth.split("-")[0];
            let month = this.yearMonth.split("-")[1];
            let strday = new Date(year,month,0).getDate();//获取当月最后一天是几号
            this.beginDate = this.yearMonth + "-" + "01";
            this.endDate = this.yearMonth + "-" + strday;

            let loading = showLoading();
            getAllNGMessage(this.currentPage,this.pageSize,this.selectStaff,this.beginDate,this.endDate).then((result)=>{
                closeLoading(loading);
                let arr = result.data.data;
                // console.log(arr);
                for (let i = 0; i < arr.length; i++) {
                    let attDate = new Date(arr[i].Date);
                    let dayList = ["日","一","二","三","四","五","六"];
                    arr[i].newDate = (Array(3).join(0) + (attDate.getMonth() + 1)).slice(-2) + "-" + (Array(3).join(0) + attDate.getDate()).slice(-2)+" ("+dayList[attDate.getDay()]+")";
                    // actualTime
                    // punchTime
                    arr[i].FirstActualTime = this.getTimeMinute(arr[i].FirstActualTime);
                    arr[i].FirstPunchTime = this.getTimeMinute(arr[i].FirstPunchTime);
                    arr[i].LastActualTime = this.getTimeMinute(arr[i].LastActualTime);
                    arr[i].LastPunchTime = this.getTimeMinute(arr[i].LastPunchTime);

                    if(arr[i].JustifyOne!="-1"||arr[i].JustifyTwo!="-1"){
                        if(arr[i].JustifyOneStatus=="1"||arr[i].JustifyTwoStatus=="1"){
                            arr[i].status = "待审批";
                        }else if(arr[i].JustifyOneStatus=="-1"||arr[i].JustifyTwoStatus=="-1"){
                            arr[i].status = "辩解未通过";
                        }else if(arr[i].JustifyOneStatus=="2"||arr[i].JustifyTwoStatus=="2"){
                            arr[i].status = "辩解已通过";
                        }else{
                            arr[i].status = "其他";
                        }
                    }else{
                        arr[i].status = "";
                    }
                }
                this.illegalManageList = arr;
                this.itemNum = result.data.totalCount;
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1131");
            });
            
        },
        getAllNGDelMessage(){
            this.illegalManageList1 = [];
            let year = this.yearMonth.split("-")[0];
            let month = this.yearMonth.split("-")[1];
            let strday = new Date(year,month,0).getDate();//获取当月最后一天是几号
            this.beginDate = this.yearMonth + "-" + "01";
            this.endDate = this.yearMonth + "-" + strday;

            let loading = showLoading();
            getAllNGDelMessage(this.currentPage1,this.pageSize1,this.selectStaff,this.beginDate,this.endDate).then((result)=>{
                closeLoading(loading);
                let arr = result.data.data;
                // console.log(arr);
                for (let i = 0; i < arr.length; i++) {
                    let attDate = new Date(arr[i].Date);
                    let dayList = ["日","一","二","三","四","五","六"];
                    arr[i].newDate = (Array(3).join(0) + (attDate.getMonth() + 1)).slice(-2) + "-" + (Array(3).join(0) + attDate.getDate()).slice(-2)+" ("+dayList[attDate.getDay()]+")";
                    // actualTime
                    // punchTime
                    arr[i].FirstActualTime = this.getTimeMinute(arr[i].FirstActualTime);
                    arr[i].FirstPunchTime = this.getTimeMinute(arr[i].FirstPunchTime);
                    arr[i].LastActualTime = this.getTimeMinute(arr[i].LastActualTime);
                    arr[i].LastPunchTime = this.getTimeMinute(arr[i].LastPunchTime);

                    if(arr[i].JustifyOne!="-1"||arr[i].JustifyTwo!="-1"){
                        if(arr[i].JustifyOneStatus=="1"||arr[i].JustifyTwoStatus=="1"){
                            arr[i].status = "待审批";
                        }else if(arr[i].JustifyOneStatus=="-1"||arr[i].JustifyTwoStatus=="-1"){
                            arr[i].status = "辩解未通过";
                        }else if(arr[i].JustifyOneStatus=="2"||arr[i].JustifyTwoStatus=="2"){
                            arr[i].status = "辩解已通过";
                        }else{
                            arr[i].status = "其他";
                        }
                    }else{
                        arr[i].status = "";
                    }
                }
                this.illegalManageList1 = arr;
                this.itemNum1 = result.data.totalCount;
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1132");
            });
        },
        getTimeMinute(time){
            if (time!="") {
                let hour = time.split(" ")[1].split(":")[0];
                let minute = time.split(" ")[1].split(":")[1];
                return hour+":"+minute;
            }else{
                return ""
            }
        },
        handleSelectionChange(val){
            this.form.scheduleIDArr = val;
        },
        //设为免扣
        clickInsert(){
            if (this.form.scheduleIDArr.length != "0") {
                this.dialogVisibleSet1 = true;
            }else{
                this.$message({
                    message: '请选择设为免扣的记录',
                });
            }
        },
        insertTimeBookNGDel(){
            // deletePersonID:执行免扣员工ID
            // deleteReason:原因
            // scheduleID:违规出勤ID，以","分隔
            let deletePersonID = this.userInfo.userStaffID;
            let deleteReason = this.form.deleteReason;
            if (deleteReason == "elseReason") {
                deleteReason = this.form.elseReason;
            }
            let arr = [];
            for (let i = 0; i < this.form.scheduleIDArr.length; i++) {
                arr.push(this.form.scheduleIDArr[i].ID);
            }
            let scheduleID = arr.join(",");
            this.dialogVisibleSet1 = false;

            let loading = showLoading();
            insertTimeBookNGDel(deletePersonID, deleteReason, scheduleID).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        message: '设为免扣成功',
                        type: 'success'
                    });
                    this.getAllNGMessage();
                }else{
                    this.$message({
                        message: '设为免扣失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2076");
            });
        },
        //取消免扣
        clickDelete(){
            if (this.form.scheduleIDArr.length != "0") {
                this.dialogVisibleSet2 = true;
            }else{
                this.$message({
                    message: '请选择取消免扣的记录',
                });
            }
        },
        cancelDelete(){
            let arr = [];
            for (let i = 0; i < this.form.scheduleIDArr.length; i++) {
                arr.push(this.form.scheduleIDArr[i].ID);
            }
            let IDs = arr.join(",");
            this.dialogVisibleSet2 = false;
            
            let loading = showLoading();
            cancelDelete(IDs).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        message: '取消免扣成功',
                        type: 'success'
                    });
                    this.getAllNGDelMessage();
                }else{
                    this.$message({
                        message: '取消免扣失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2077");
            });
        },
        
        handleClick(tab, event) {
            if (tab.label == "未免扣") {
                this.form.scheduleIDArr = [];
                this.getAllNGMessage();
            }else if (tab.label == "已免扣") {
                this.form.scheduleIDArr = [];
                this.getAllNGDelMessage();
            }
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.getAllNGMessage();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getAllNGMessage();
        },
        handleSizeChange1(val){
            this.pageSize1 = val;
            this.getAllNGDelMessage();
        },
        handleCurrentChange1(val){
            this.currentPage1 = val;
            this.getAllNGDelMessage();
        },
        //查看详情
        showDetail(item){
            this.clickItem = item;
            this.dialogVisibleShow = true;
            this.getJustifyByID();
            // this.$router.push(this.$route.fullPath+"/examine");
        },
        getJustifyByID(){
            let justifyID;
            if(this.clickItem.JustifyOne!="-1"||this.clickItem.JustifyTwo!="-1"){
                if(this.clickItem.JustifyOne!="-1"){
                    justifyID = this.clickItem.JustifyOne;
                    this.type = "1";
                }
                if(this.clickItem.JustifyTwo!="-1"){
                    justifyID = this.clickItem.JustifyTwo;
                    this.type = "2";
                }
            }
            let loading = showLoading();
            getJustifyByID(justifyID,this.type).then((result)=>{
                closeLoading(loading);
                let obj = result.data;
                obj.Status = obj.Status.toString();
                obj.ApproveStaffID = obj.ApproveStaffID.toString();
                obj.StaffID = obj.StaffID.toString();
                this.detail = obj;
            }).catch((err)=>{
                console.log(err)
                closeLoading(loading);
                alertError(this,"1134");
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
        cellClassName({ row, column, rowIndex, columnIndex }){
            if (columnIndex == 5) {
				return "lineHeight16"
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
.IllegalManageList{
    padding:20px;
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap;  */
    height: 100vh;
    width: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .illegalManageList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.illegalManageList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .illegalManageList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .illegalManageList{
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
    display: block;
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
.staffName{
    width:100%;
    /* padding:60px 0 5px 0; */
    position: absolute;
    top: 36px;
    left: 0;
    /* background-color: #FFFACD; */
    text-align: center;
    color: #38ADFF;
    z-index: 10;
    font-size: 12px;
    padding-left: 8px;
}
.radioReason{
    display:block;
    margin-left:0px;
    padding: 5px 0;
}
</style>