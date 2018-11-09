<template>
    <div class="YearHolidayList">
        <!-- <router-view></router-view> -->
        <chat-header :showBack="true" :title="'年假管理'"></chat-header>
        <div style="width:100%;padding:74px 20px 20px 20px;">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item>
                    <el-input size="medium" v-model="selectContent" clearable style="width:300px;" placeholder="请输入姓名\手机号\员工编号\考勤卡号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" @click="loadList">查询</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="setHoliday">设置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="midTableHeight" style="width:100%;display:block;padding:0 20px 20px 20px;">
            <el-table :data="yearHolidayList" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="470">
                <el-table-column prop="StaffName" align="center"  label="姓名"  width="150"></el-table-column>
                <el-table-column prop="StaffNum" align="center"  label="员工编号"  width="120"></el-table-column>
                <el-table-column align="center"  label="剩余年假"  width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.LeftHolidays+" 天"}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="自动增加年假时间" >
                    <template slot-scope="scope">
                        <span style="color:#38adff;cursor:pointer;" @click="updateInc(scope.row)">{{scope.row.AutoIncreamentTime=="0001-01-01 00:00:00"?"未设置":scope.row.AutoIncreamentTime.split(" ")[0]}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="updateDetail(scope.row)">修改</el-button>
                        <el-button
                            class="orangeButton"
                            size="mini"
                            @click="showDetail(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog
                title="自动增加年假设置"
                :visible.sync="dialogVisible"
                width="35%">
                <div style="color:#606266;font-weight:bold;margin-left:30px;">自动增加年假时的周期</div>
                <div style="margin-left:50px;">
                    <el-radio v-model="form.autoDayCycleValue" label="0">入职每满1年</el-radio>
                    <el-radio style="margin-left:5px;" v-model="form.autoDayCycleValue" label="1">转正每满1年</el-radio>
                    <el-radio style="margin-left:5px;" v-model="form.autoDayCycleValue" label="2">每年
                        <el-date-picker
                            popper-class="setYearHoliday"
                            :disabled="disabledAutoDay"
                            style="width:100px;"
                            size="mini"
                            format="MM-dd"
                            value-format="MM-dd"
                            v-model="form.monthday"
                            type="date">
                        </el-date-picker>
                    </el-radio>
                </div>
                <div style="margin:10px 0 20px 30px;color:#606266;font-weight:bold;">每次自动增加&nbsp;&nbsp;<el-input v-model="form.autoAddNum" size="mini" style="width:50px;"></el-input>&nbsp;&nbsp;天年假</div>
                <div style="color:#606266;font-weight:bold;margin-left:30px;">自动增加年假时的天数上限</div>
                <div style="margin-left:50px;">
                    <el-radio v-model="form.maxDaysValueChecked" label="-1">无上限</el-radio>
                    <el-radio style="margin-left:42px;" v-model="form.maxDaysValueChecked" label="1">
                        <el-input :disabled="disabledMaxDays" v-model="form.maxDaysValue" size="mini" style="width:50px;"></el-input>&nbsp;&nbsp;天
                    </el-radio>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmSet">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                :title="clickStaffName+'剩余年假'"
                :visible.sync="dialogVisibleUpdate"
                width="35%">
                <el-form label-width="120px">
                    <el-form-item :label="'修改前'">
                        <el-input v-model="beforeUpdateDay" size="small" disabled style="width:206px;" placeholder="请输入天数">
                            <template slot="append">天</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="'修改后'">
                        <el-input v-model="afterUpdateDay" size="small" clearable style="width:206px;" placeholder="请输入天数">
                            <template slot="append">天</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="'修改理由'" style="margin-top:5px;">
                        <el-input v-model="reasonUpdateDay" type="textarea" rows="4" style="width:206px;" placeholder="请输入理由"></el-input>
                    </el-form-item>
                </el-form>  
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleUpdate = false">取 消</el-button>
                    <el-button type="primary" @click="confirmUpdate">确 定</el-button>
                </span>
            </el-dialog>
            
            <el-dialog
                :title="clickStaffName"
                :visible.sync="dialogVisibleInc"
                width="35%">
                <el-form label-width="130px" style="margin-left:30px;">
                    <el-form-item :label="'下次自动增加时间'">
                        <el-date-picker
                            style="width:206px;"
                            size="mini"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            v-model="updateAutoIncreamentTime"
                            type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-form>  
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleInc = false">取 消</el-button>
                    <el-button type="primary" @click="confirmInc">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                :title="clickStaffName+'年假详情'"
                :visible.sync="dialogVisibleShow"
                width="50%">
                <span>剩余：{{detailValue.LeftHolidays}}天　下次自动增加时间：{{detailValue.AutoIncreamentTime==""?"未设置":detailValue.AutoIncreamentTime}}</span>
                <el-table :data="yearHolidayDetail" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="470">
                    <el-table-column prop="HolidayChangeTime" align="center"  label="修改时间"  width="180"></el-table-column>
                    <el-table-column align="center"  label="变更前"  width="80">
                        <template slot-scope="scope">
                            <span>{{scope.row.HolidayBefore+" 天"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center"  label="变更后"  width="80">
                        <template slot-scope="scope">
                            <span>{{scope.row.HolidayAfter+" 天"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="修改理由">
                        <template slot-scope="scope">
                            <div v-show="scope.row.HolidayReason!=''">
                                <el-popover width="500" trigger="hover" placement="bottom">
                                    <div v-html="scope.row.HolidayReason"></div>
                                    <div slot="reference">
                                        <span class="spanTitle" v-show="!scope.row.ellipsis" v-html="scope.row.HolidayReason"></span>
                                        <span class="spanTitle" v-show="scope.row.ellipsis" v-html="scope.row.ellipsisHolidayReason"></span>
                                    </div>
                                </el-popover>
                            </div>
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
            </el-dialog>
        </div>
    </div>
</template>

<script>

import { findAllStaffs,getSettingValue,setSettingValue,updateStaffAutoTime,updateHolidayChange,getHolidayChangeRecordList } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'YearHolidayList',
    data(){
        return {
            form:{
                autoAddNum:"",
                maxDaysValue:"",
                maxDaysValueChecked:"",
                autoDayCycleValue:"",
                monthday:"",
            },
            beforeUpdateDay:"",
            afterUpdateDay:"",
            reasonUpdateDay:"",

            clickStaffName:"",
            updateAutoIncreamentTime:"",

            dialogVisible:false,
            dialogVisibleInc:false,
            dialogVisibleShow:false,
            dialogVisibleUpdate:false,
            clickItem:{},
            yearHolidayList:[],
            yearHolidayDetail:[],
            detailValue:{},
            pageSize:10,
            currentPage:1,
            itemNum:0,
            selectContent:"",
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
        disabledMaxDays(){
            if (this.form.maxDaysValueChecked == "-1") {
                this.form.maxDaysValue = "";
                return true;
            }else{
                return false;
            }
        },
        disabledAutoDay(){
            if (this.form.autoDayCycleValue == "2") {
                return false;
            }else{
                this.form.monthday = "";
                return true;
            }
        },
    },
    methods:{
        loadList(){
            this.yearHolidayList = [];
            let loading = showLoading();
            findAllStaffs(this.selectContent).then((result)=>{
                closeLoading(loading);
                this.yearHolidayList = result.data.data;
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1014");
            });
        },
        // handleSizeChange(val){
        //     this.pageSize = val;
        //     this.loadList();
        // },
        // handleCurrentChange(val){
        //     this.currentPage = val;
        //     this.loadList();
        // },
        setHoliday(){
            this.dialogVisible = true;
            let maxDays = "MAX_HOLIDAYS";
            let autoDays = "AUTOINCREAMENT_HOLIDAYS";
            let autoDayCycle = "AUTO_INCREASE_HOLIDAY_CYCLE";
            let loading = showLoading();
            getSettingValue(maxDays+","+autoDays+","+autoDayCycle).then((result)=>{
                closeLoading(loading);
                this.form.autoAddNum = result.data.AUTOINCREAMENT_HOLIDAYS;
                this.form.maxDaysValue = result.data.MAX_HOLIDAYS;
                if (result.data.MAX_HOLIDAYS == "-1") {
                    this.form.maxDaysValueChecked = "-1"
                }else{
                    this.form.maxDaysValueChecked = "1"
                }
                // this.form.autoDayCycleValue = result.data.AUTO_INCREASE_HOLIDAY_CYCLE;
                if (result.data.AUTO_INCREASE_HOLIDAY_CYCLE == "0") {
                    this.form.autoDayCycleValue = "0";
                }else if (result.data.AUTO_INCREASE_HOLIDAY_CYCLE == "1") {
                    this.form.autoDayCycleValue = "1";
                }else{
                    this.form.autoDayCycleValue = "2";
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1211");
            });
        },
        confirmSet(){
            let maxDays = "MAX_HOLIDAYS";
            let autoDays = "AUTOINCREAMENT_HOLIDAYS";
            let autoDayCycle = "AUTO_INCREASE_HOLIDAY_CYCLE";
            let settingKey = maxDays+","+autoDays+","+autoDayCycle;

            let maxDaysValue,autoDaysValue,autoDayCycleValue;

            if (this.form.autoDayCycleValue == "0") {
                autoDayCycleValue = "0"
            }else if (this.form.autoDayCycleValue == "1") {
                autoDayCycleValue = "1"
            }else{
                autoDayCycleValue = this.form.monthday;
            }
            autoDaysValue = parseFloat(this.form.autoAddNum);
            
            if (this.form.maxDaysValueChecked == "-1") {
                maxDaysValue = "-1";
            }else{
                maxDaysValue = parseFloat(this.form.maxDaysValue);
            }

            if(autoDayCycleValue==""){
                this.$message.error({
                    message:"请选择年假增加日期"
                });
                return;
            }
            if(autoDaysValue==""){
                this.$message.error({
                    message:"请输入每次自动增加天数"
                });
                return;
            }
            if(maxDaysValue==""){
                this.$message.error({
                    message:"请输入上限天数"
                });
                return;
            }

            // console.log(maxDaysValue);
            // console.log(autoDaysValue);
            // console.log(autoDayCycleValue);

            let settingValue = maxDaysValue+","+autoDaysValue+","+autoDayCycleValue;
            this.dialogVisible = false;

            let loading = showLoading();
            setSettingValue(settingKey,settingValue).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: '设置失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2139");
            });
        },
        updateDetail(item){
            this.dialogVisibleUpdate = true;
            this.clickItem = item;
            this.clickStaffName = item.StaffName;
            this.beforeUpdateDay = item.LeftHolidays;
        },
        confirmUpdate(){
            let staffID = this.clickItem.StaffID;
            let updateStaffID = this.userInfo.userStaffID;
            let leftHolidays = this.afterUpdateDay;
            let reason = this.reasonUpdateDay;
            if(leftHolidays==""){
                this.$message.error({
                    message:"请输入修改后的天数"
                });
                return;
            }
            if(leftHolidays==this.beforeUpdateDay){
                this.$message.error({
                    message:"修改前和修改后的天数一致"
                });
                return;
            }
            this.dialogVisibleUpdate = false;
            let loading = showLoading();
            updateHolidayChange(staffID,updateStaffID,leftHolidays,reason).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.loadList();
                }else{
                    this.$message({
                        message: '修改失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2105");
            });
        },
        updateInc(item){
            this.dialogVisibleInc = true;
            this.clickItem = item;
            this.clickStaffName = item.StaffName;
            this.updateAutoIncreamentTime = item.AutoIncreamentTime=="0001-01-01 00:00:00"?"":item.AutoIncreamentTime.split(" ")[0];
        },
        confirmInc(){
            this.dialogVisibleInc = false;
            let staffID = this.clickItem.StaffID;
            let autoTime = this.updateAutoIncreamentTime;
            let loading = showLoading();
            updateStaffAutoTime(staffID,autoTime).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.loadList();
                }else{
                    this.$message({
                        message: '修改失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2217");
            });
        },
        showDetail(item){
            this.dialogVisibleShow = true;
            this.clickItem = item;
            this.clickStaffName = item.StaffName;
            this.currentPage = 1;
            this.pageSize = 10;
            this.getHolidayChangeRecordList();
        },
        getHolidayChangeRecordList(){
            this.yearHolidayDetail = [];
            let staffID = this.clickItem.StaffID;
            getHolidayChangeRecordList(this.currentPage,this.pageSize,staffID).then((result)=>{
                let obj = result.data.data;
                this.detailValue = result.data;
                console.log(result);
                for(let i=0;i<obj.length;i++){
                     if (obj[i].HolidayReason.indexOf('<br />')!="-1") {
                        obj[i].ellipsis = true;
                        obj[i].ellipsisHolidayReason = obj[i].HolidayReason.split("<br />")[0]+' ...';
                    }else{
                        obj[i].ellipsis = false;
                    }
                    this.yearHolidayDetail.push(obj[i]);
                }
                this.itemNum = parseInt(result.data.totalCount);
                if(this.yearHolidayDetail.length==0){
                    this.itemNum = 0;
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1166");
            });
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.getHolidayChangeRecordList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getHolidayChangeRecordList();
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
.YearHolidayList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .yearHolidayList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.yearHolidayList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .yearHolidayList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .yearHolidayList{
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
</style>