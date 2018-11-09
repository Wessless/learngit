<template>
    <div class="AttendanceManageList">
        <router-view :item="clickItem" @backRefresh="backRefresh"></router-view>
        <chat-header :showBack="true" :title="title"></chat-header>
        <div style="width:100%;padding:54px 20px 20px 20px;">
            <el-tabs v-model="tabSelect" @tab-click="getNowTime" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;width:100%;" class="tuitionIncomeTabs">
                <el-tab-pane label="违规数据" name="first" >
                    <el-date-picker
                        v-model="yearMonth"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        :clearable="false"
                        style="width:160px;margin:10px 5px;"
                        @change="loadList"
                        size="medium">
                    </el-date-picker>
                    <el-button style="display:block;float:right;margin:10px 5px;" type="primary" size="medium" @click="refresh">刷新</el-button>
                    <el-button style="display:block;float:right;margin:10px 5px;" type="primary" size="medium" @click="setAttendance">设置</el-button>
                    <el-button style="display:block;float:right;margin:10px 5px;" type="primary" size="medium" @click="dialogVisibleNoAssess=true">不计考勤人员&nbsp;({{noAssessNum}}人)</el-button>
                    <el-button style="display:block;float:right;margin:10px 5px;" type="primary" size="medium" @click="dialogVisibleExcel=true">导出</el-button>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0px 5px 10px;">
                        <el-table :data="attendanceManageList" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="445">
                            <el-table-column prop="StaffName" align="center"  label="姓名"  width="180"></el-table-column>
                            <el-table-column align="center" label="违规" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.NGNUM}}条</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="已免扣" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.DELNUM}}条</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="120">
                                <template slot-scope="scope">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="showDetail(scope.row)">详情</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="出勤时间" name="second" >
                    <el-date-picker
                        v-model="yearMonthDate"
                        v-show="!isMonth"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        style="width:160px;margin:10px 5px;float:left;"
                        @change="getTimesBookByDay"
                        size="medium">
                    </el-date-picker>
                    <el-date-picker
                        v-model="yearMonthNoDate"
                        v-show="isMonth"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        :clearable="false"
                        style="width:160px;margin:10px 5px;float:left;"
                        @change="findStaffByStaffID"
                        :disabled="ignoreFlag=='true'"
                        size="medium">
                    </el-date-picker>

                    <el-button style="display:block;margin:10px 0;float:left;" type="primary" size="medium" @click="changeMonthOrDay">{{buttonName}}</el-button>

                    <el-select v-model="selectStaffsMonth" @change="findStaffByStaffID" v-show="isMonth" style="float:right;width:150px;margin:10px 5px 10px 5px" size="medium" filterable placeholder="请选择员工">
                        <el-option
                            v-for="item in allStaffs"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                    
                    <div class="midTableHeight" v-show="!isMonth" style="width:100%;display:block;padding:0px 5px 10px;">
                        <el-table :data="attendanceTimeList" :cell-class-name="tableCellClassName"  :row-class-name="tableRowClassName1" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="445">
                            <el-table-column prop="StaffName" align="center"  label="姓名"  width="150"></el-table-column>
                            <el-table-column align="center"  label="打卡签到时间"  >
                                <template slot-scope="scope">
                                    <span>{{scope.row.newFirstPunchTime==""?"无":scope.row.newFirstPunchTime+"-"+scope.row.newLastPunchTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="实际出勤时间"  >
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row.IsUpdateDate=='1'?'#fff':''}">{{scope.row.newFirstActualTime==""?"无":scope.row.newFirstActualTime+"-"+scope.row.newLastActualTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="操作"  width="80">
                                <template slot-scope="scope">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="updateActualTime(scope.row,'1')">修改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-show="isMonth&&ignoreFlag=='true'" class="width:100%">
                        <el-alert
                            title="你已被设定为不计考勤人员"
                            type="info"
                            center
                            :closable="false">   
                        </el-alert>
                    </div>
                    <div class="midTableHeight" v-show="isMonth&&ignoreFlag!='true'" style="width:100%;display:block;padding:0px 5px 10px;">
                        <el-table :data="attendanceMonthList" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="445">
                            <el-table-column prop="newDate" align="center"  label="时间"  width="85">
                                <template slot-scope="scope">
                                    <span :style="{color: scope.row.Flag == 'RED'?'#e51c23':''}">{{scope.row.newDate}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="打卡签到时间"  width="105">
                                <template slot-scope="scope">
                                    <span>{{scope.row.newFirstPunchTime==""?"无":scope.row.newFirstPunchTime+"-"+scope.row.newLastPunchTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="实际出勤时间"  width="105">
                                <template slot-scope="scope">
                                    <span>{{scope.row.newFirstActualTime==""?"无":scope.row.newFirstActualTime+"-"+scope.row.newLastActualTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label=""  width="162">
                                <template slot-scope="scope">
                                    <span class="bBtn" @click="showDailyDeatil(scope.row)" :style="scope.row.DailyID!='-1'?{color:'#fff',background:'#38adff',border:'1px solid #38adff',cursor:'pointer'}:''">日报</span>
                                    <span class="bBtn" :style="scope.row.IsHaveSign=='1'?{color:'#fff',background:'#38adff',border:'1px solid #38adff',cursor:'pointer'}:''">轨迹</span>
                                    <span class="bBtn" @click="showVisitorsRecord(scope.row)" :style="scope.row.VisitNum!='-1'?{color:'#fff',background:'#38adff',border:'1px solid #38adff',cursor:'pointer'}:''">{{scope.row.VisitNum!='-1'?"访客"+scope.row.VisitNum+"户":"未访客"}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="违规数据"  width="160">
                                <template slot-scope="scope">
                                    <div v-for="(item,index) in scope.row.ListMsg" :key="index">
                                        <div v-if="item.NgType!='-1'">
                                            <!-- <span style="display:inline-block;">早退480分钟</span> -->
                                            <span style="display:inline-block;">{{item.Title}}</span>
                                            <span :style="{background: item.color,cursor: item.TimeNGID!='-1'?'pointer':''}" class="approveStatus" @click="showIllegalDetail(item)">{{item.approveStatus}}</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column align="center"  label="详情">
                                <template slot-scope="scope">
                                    <div v-for="(item,index) in scope.row.newListMsg" :key="index">
                                        <span style="display:block;cursor:pointer;color:#38adff;line-height:18px;padding:4px 0;" @click="showNewListMsg(item)">{{item.Title}}</span>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column align="center"  label="操作"  width="80">
                                <template slot-scope="scope">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="updateActualTime(scope.row,'2')">修改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 考勤设置 -->
        <el-dialog
            title="考勤设置"
            class="workTimeSet"
            :visible.sync="dialogVisibleSet"
            width="500px">
            <el-form :model="form" label-width="160px">
                <el-form-item :label="'迟到忽略分钟'">
                    <el-input v-model="form.workIgnore" @keyup.native="judgeNum" size="mini" style="width:200px;" placeholder="迟到忽略分钟"></el-input>
                </el-form-item>
                <el-form-item :label="'加班开始时间'">
                    <el-time-picker
                        size="mini"
                        style="width:200px;"
                        format="HH:mm"
                        value-format="HH:mm"
                        v-model="form.workOverTime"
                        placeholder="加班开始时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item :label="'加班时间单位'">
                    <el-radio v-model="form.workUnit" label="0.5">0.5(小时)</el-radio>
                    <el-radio v-model="form.workUnit" label="1.0" style="margin-left:20px;">1.0(小时)</el-radio>
                </el-form-item>
                <el-form-item :label="'出勤时间设置'">
                    <el-radio v-model="form.timebookType" label="0">固定班制</el-radio>
                    <el-radio v-model="form.timebookType" label="2" style="margin-left:20px;">排班制</el-radio>
                </el-form-item>
                <el-form-item :label="'上午出勤时间'" v-show="isShowAmPm">
                    <el-time-picker
                        size="mini"
                        style="width:200px;"
                        format="HH:mm"
                        value-format="HH:mm"
                        v-model="form.amStartValue"
                        placeholder="上午出勤时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item :label="'上午退勤时间'" v-show="isShowAmPm">
                    <el-time-picker
                        size="mini"
                        style="width:200px;"
                        format="HH:mm"
                        value-format="HH:mm"
                        v-model="form.amEndValue"
                        placeholder="上午退勤时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item :label="'下午出勤时间'" v-show="isShowAmPm">
                    <el-time-picker
                        size="mini"
                        style="width:200px;"
                        format="HH:mm"
                        value-format="HH:mm"
                        v-model="form.pmStartValue"
                        placeholder="下午出勤时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item :label="'下午退勤时间'" v-show="isShowAmPm">
                    <el-time-picker
                        size="mini"
                        style="width:200px;"
                        format="HH:mm"
                        value-format="HH:mm"
                        v-model="form.pmEndValue"
                        placeholder="下午退勤时间">
                    </el-time-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleSet = false">取 消</el-button>
                <el-button type="primary" @click="confirmSet">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 导出 -->
        <el-dialog
            title="导出考勤相关数据"
            class="workTimeSet"
            :visible.sync="dialogVisibleExcel"
            width="500px">
            <el-form label-width="110px" style="margin-top:15px;">
                <el-form-item :label="'日期范围'">
                    <el-date-picker
                        style="width:300px;"
                        v-model="dateRange"
                        type="daterange"
                        range-separator="一"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        size="small"
                        unlink-panels 
                        :default-value="[new Date(beforeYearMonth),new Date(yearMonth)]"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleExcel = false">取 消</el-button>
                <el-button type="primary" @click="confirmExcel">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 不计考勤人员设置 -->
        <el-dialog
            title="不计考勤人员设置"
            :visible.sync="dialogVisibleNoAssess"
            width="500px">
            <el-form :model="form" label-width="120px">
                <el-form-item :label="'不计考勤人员'">
                    <el-select v-model="noAssessStaffArrChange" multiple size="mini" style="width:300px;" filterable placeholder="请选择不计考勤人员">
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
                <el-button @click="dialogVisibleNoAssess = false">取 消</el-button>
                <el-button type="primary" @click="noAssessStaffSet">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 外出 加班 出差等详情 -->
        <el-dialog
            :title="clickShowItem.newTitle"
            class="workTimeSet"
            :visible.sync="dialogVisibleNewListMsg"
            width="35%">
            <el-form :model="clickShowItem" label-width="80px">
                <el-form-item :label="'申请'">
                    <el-input v-model="clickShowItem.Apply" disabled size="mini" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item :label="'理由'">
                    <el-input v-model="clickShowItem.Reason" type="textarea" disabled row="2" size="mini" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item :label="'审批'" style="margin-top:3px;">
                    <el-select v-model="clickShowItem.Approve" size="mini" disabled style="width:200px;">
                    </el-select>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 违规详情 -->
        <el-dialog
            title="违规详情"
            class="workTimeSet"
            :visible.sync="dialogVisibleIllegal"
            width="636px">
            <el-form :model="IllegalDetail" label-width="120px">
                <el-form-item label="违规日期">
                    <el-date-picker
                        v-model="IllegalDetail.NGDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :disabled="true"
                        style="width:400px"
                        size="small">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="辩解人">
                    <el-select v-model="IllegalDetail.StaffID" :disabled="true" size="small" style="width:100px;" filterable placeholder="请选择辩解人">
                        <el-option
                            v-for="item in allStaffs"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                    <label style="color:#606266;margin:0 8px 0 28px;">辩解日期</label>
                    <el-date-picker
                        v-model="IllegalDetail.JustifyTime"
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
                    <el-radio v-model="IllegalDetail.type" :disabled="true" label="1">未打卡的理由</el-radio>
                    <el-radio style="margin-left:20px;" v-model="IllegalDetail.type" :disabled="true" label="2">迟到或者早退理由</el-radio>
                </el-form-item>
                <el-form-item label="辩解理由" style="transform:translateY(-8px)" class="ReceiveApplyDetail_signatory">
                    <el-input v-model="IllegalDetail.JustifyReason" :disabled="true" type="textarea" rows="4" style="width:400px;" placeholder="请输入辩解理由"></el-input>
                </el-form-item>
                <el-form-item label="审批人">
                    <el-select v-model="IllegalDetail.ApproveStaffID" :disabled="true" size="small" style="width:100px;" filterable placeholder="请选择积分分类">
                        <el-option
                            v-for="item in allStaffs"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                    <label style="color:#606266;margin:0 8px 0 28px;">审批日期</label>
                    <el-date-picker
                        v-model="IllegalDetail.ApprovedTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :disabled="true"
                        style="width:200px"
                        size="small">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审批意见" style="transform:translateY(-5px)">
                    <el-radio v-model="IllegalDetail.Status" :disabled="true" label="2">同意</el-radio>
                    <el-radio v-model="IllegalDetail.Status" :disabled="true" label="-1" style="margin-left:20px;">不同意</el-radio>
                    <el-radio v-model="IllegalDetail.Status" :disabled="true" label="1"  style="margin-left:20px;">暂不签字</el-radio>
                </el-form-item>
                <el-form-item label="补充理由" style="transform:translateY(-8px)" class="ReceiveApplyDetail_signatory">
                    <el-input v-model="IllegalDetail.ApprovedReason" :disabled="true" type="textarea" rows="4" style="width:400px;" placeholder="请输入补充理由"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 日报 -->
        <el-dialog
            :title="nowStaffName+'的日报'"
            class="workTimeSet"
            :visible.sync="dialogVisibleDaily"
            width="70%">
            <span>编号：{{DailyDeatil.ID}}</span>
            <div class="detailList">
                <div class="detailItem">
                    <div class="detailTitle">打卡时间</div>
                    <div class="detailContent">{{DailyDeatil.punchTime}}</div>
                    <div class="detailTitle">出勤时间</div>
                    <div class="detailContent">{{DailyDeatil.actualTime}}</div>
                </div>
                <div class="detailItem">
                    <!-- <div class="detailTitle">编号</div>
                    <div class="detailContent">{{DailyDeatil.ID}}</div> -->
                    <div class="detailTitle">日报日期</div>
                    <div class="detailContent">{{DailyDeatil.dailyDate}}</div>
                    <div class="detailTitle">编写时间</div>
                    <div class="detailContent">{{DailyDeatil.CreateDate}}</div>
                </div>
                <div class="detailItem">
                    <div class="detailTitle">今日完成</div>
                    <div class="detailContent1">{{DailyDeatil.todayDone}}</div>
                </div>
                <!-- dailyDate todayDone visitorsRecord tomorrowPlan reportSummary -->
                <div class="detailItem">
                    <div class="detailTitle">访客记录</div>
                    <div class="detailContent1">{{DailyDeatil.visitorsRecord}}</div>
                </div>
                <div class="detailItem">
                    <div class="detailTitle">明日计划</div>
                    <div class="detailContent1">{{DailyDeatil.tomorrowPlan}}</div>
                </div>
                <div class="detailItem">
                    <div class="detailTitle">汇报总结</div>
                    <div class="detailContent1">{{DailyDeatil.reportSummary}}</div>
                    <!-- <div class="detailTitle">提醒谁看</div>
                    <div class="detailContent">{{DailyDeatil.CreateDate}}</div> -->
                </div>

                <div class="detailItem">
                    <div class="detailTitle">图片</div>
                    <div class="detailContent">
                        <div class="image" v-for="item in DailyDeatil.Images" :key="item"><image-proxy :canBrowse="true" :imagePath="item"></image-proxy></div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 访客记录 -->
        <el-dialog
            title="访客记录"
            :visible.sync="dialogVisibleVisitor"
            width="70%">
            <div class="midTableHeight" style="width:100%;display:block;padding:0 20px 20px 20px;">
                <el-table :data="VisitorsRecord" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="300">
                    <el-table-column prop="DateTime" align="center"  label="访问时间"  width="155"></el-table-column>
                    <el-table-column prop="SaleActivityID" align="center"  label="机构编号"  width="85"></el-table-column>
                    <el-table-column label="机构名称"  width="350">
                        <template slot-scope="scope">
                            <span class="spanTitle" :title="scope.row.CompanyTitle+'('+scope.row.CompanyID+')'">{{scope.row.CompanyTitle+'('+scope.row.CompanyID+')'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="访问详情">
                        <template slot-scope="scope">
                            <span class="spanTitle" :title="scope.row.DataFlag!='1'?scope.row.Content:scope.row.Address">{{scope.row.DataFlag!='1'?scope.row.Content:scope.row.Address}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label=""  width="50">
                        <template slot-scope="scope">
                            <span class="spanTitle">{{scope.row.OutFlag=="1"?"外勤":""}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 修改出勤时间 -->
        <el-dialog
            title="修改出勤时间"
            :visible.sync="dialogVisibleUpdate"
            width="384px">
            <el-form :model="form1" label-width="100px">
                <el-form-item :label="'出勤时间'">
                    <el-time-picker
                        size="mini"
                        style="width:200px;"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        v-model="form1.updateFirstTime"
                        placeholder="请选择出勤时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item :label="'退勤时间'">
                    <el-time-picker
                        size="mini"
                        style="width:200px;"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        v-model="form1.updateLastTime"
                        placeholder="请选择退勤时间">
                    </el-time-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleUpdate = false">取 消</el-button>
                <el-button type="primary" @click="updateTimeBook">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getNGNum,getWorkTimeSetting,modifyWorkTime,getSettingValue,setSettingValue,getTimesBookByDay,findAllStaffs,
         setIgnorePunchStaffs,setIgnorePunchStaffsByStaffID,updateTimeBookNG,getJustifyByID,getStaffTimesBook,
         findStaffByStaffID,getSaleactivityByApplyCompanyID,getSaleActivityByStaffID,updateTimeBook,
         getTimeBookStatisticByDate,getCosByCosNum } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import imageProxy from '@/components/chat/ImageProxy'
import NoData from '@/components/chat/NoData'
import { export_json_to_excel,data2Workbook } from '@/js/exportToXlxs'

export default {
    name: 'AttendanceManageList',
    data(){
        return {
            // title:"违规数据",
            cosName:"",
            beforeYearMonth:"",
            yearMonth:"",
            beginDate:"",
            endDate:"",

            tabSelect:"first",
            dialogVisibleSet:false,
            dialogVisibleNoAssess:false,
            dateRange:"",
            excelData:[],
            dialogVisibleExcel:false,

            clickItem:{},
            attendanceManageList:[],//违规数据
            pageSize:10,
            currentPage:1,
            itemNum:0,

            dialogVisibleUpdate:false,
            //单日模式
            yearMonthDate:"",
            attendanceTimeList:[], 
            //全月模式
            yearMonthNoDate:"",
            selectStaffsMonth:"",
            ignoreFlag:"",
            redDate:{},
            attendanceMonthList:[],
            clickShowItem:{},
            dialogVisibleNewListMsg:false,
            IllegalDetail:{},  
            dialogVisibleIllegal:false,
            DailyDeatil:{},  
            dialogVisibleDaily:false,
            VisitorsRecord:[],
            dialogVisibleVisitor:false,

            isMonth:false,

            form:{
                workIgnore:"",
                workOverTime:"",
                workUnit:"",
                timebookType:"",
                timebookAuto:"",
                amStartValue:"",
                amEndValue:"",
                pmStartValue:"",
                pmEndValue:""
            },
            form1:{
                clickUpdateItem:{},
                updateFirstTime:"",
                updateLastTime:"",
            },
            noAssessStaffArr:[],
            noAssessStaffArrChange:[],
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
                }],
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
        }
    },
    components:{
        NoData,
        ChatHeader,
        imageProxy,
    },
    mounted(){
        this.getNowTime();
        this.getCosByCosNum();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        isShowAmPm(){
            if (this.form.timebookType == "0") {
                return true;
            }else{
                return false;
            }
        },
        noAssessNum(){
            if (this.noAssessStaffArr.length!=0) {
                return this.noAssessStaffArr.length;
            }else{
                return "";
            }
        },
        title(){
            if (this.tabSelect == "first") {
                return "违规数据"
            }else{
                return "出勤时间"
            }
        },
        buttonName(){
            if (this.isMonth) {
                return "切换到单日模式"
            }else{
                return "切换到全月模式"
            }
        },
        nowStaffName(){
            for (let i = 0; i < this.allStaffs.length; i++) {
                if (this.selectStaffsMonth == this.allStaffs[i].StaffID) {
                    return this.allStaffs[i].StaffName;
                }
            }
        }
    },
    methods:{
        ...mapMutations([
            'SET_ALLSTAFFS',
        ]),
        backRefresh(){
            if (this.tabSelect == "first") {
                this.getNGNum();
            }
        },
        loadList(){
            if (this.tabSelect == "first") {
                this.isMonth = false;
                this.findAllStaffs();
                this.getNGNum();
            }else if (this.tabSelect == "second") {
                this.getTimesBookByDay();
            }
        },
        //违规数据
        getNGNum(){
            this.attendanceManageList = [];

            let year = this.yearMonth.split("-")[0];
            let month = this.yearMonth.split("-")[1];
            let strday = new Date(year,month,0).getDate();//获取当月最后一天是几号
            this.beginDate = this.yearMonth + "-" + "01";
            this.endDate = this.yearMonth + "-" + strday;

            let loading = showLoading();
            getNGNum(this.beginDate,this.endDate).then((result)=>{
                closeLoading(loading);
                console.log(result);
                this.attendanceManageList = result.data.data;
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1137");
            });
        },
        //出勤时间
        getTimesBookByDay(){
            this.attendanceTimeList = [];
            let queryDay = this.yearMonthDate;
            // this.attendanceTimeList =  [{"StaffName":"王浩1","FirstPunchTime":"09:00","LastPunchTime":"18:00","FirstActualTime":"09:00","LastActualTime":"18:00"}];
            let loading = showLoading();
            getTimesBookByDay(queryDay).then((result)=>{
                closeLoading(loading);
                console.log(result.data);
                let arr = result.data.data;
                for (let i = 0; i < arr.length; i++) {
                    arr[i].newFirstActualTime = this.getTimeMinute(arr[i].FirstActualTime);
                    arr[i].newFirstPunchTime = this.getTimeMinute(arr[i].FirstPunchTime);
                    arr[i].newLastActualTime = this.getTimeMinute(arr[i].LastActualTime);
                    arr[i].newLastPunchTime = this.getTimeMinute(arr[i].LastPunchTime);
                }
                this.attendanceTimeList = arr;
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1327");
            });
        },
        //全月显示员工出勤
        getStaffTimesBook(){
            this.attendanceMonthList = [];
            let staffID = this.selectStaffsMonth;
            let year = parseInt(this.yearMonthNoDate.split("-")[0]);
            let month = parseInt(this.yearMonthNoDate.split("-")[1]);

            let strday = new Date(year,month,0).getDate();//获取当月最后一天是几号
            let beginDate = this.yearMonthNoDate + "-" + "01";
            let endDate = this.yearMonthNoDate + "-" + strday;

            let loading = showLoading();
            getStaffTimesBook(staffID,beginDate,endDate).then((result)=>{
                closeLoading(loading);
                let arr = result.data.data;
                // let arr = [
                //     {"AttDate":"2018-09-01","StaffID":"198","Flag":"RED","FirstPunchTime":"","LastPunchTime":"","FirstActualTime":"","LastActualTime":"","BellStatus":"-1","DailyID":"-1","IsHaveSign":"0","VisitNum":"-1","PatternName":"","ListMsg":[]},
                //     {"AttDate":"2018-09-02","StaffID":"198","Flag":"RED","FirstPunchTime":"","LastPunchTime":"","FirstActualTime":"","LastActualTime":"","BellStatus":"-1","DailyID":"-1","IsHaveSign":"0","VisitNum":"-1","PatternName":"","ListMsg":[]},
                //     {"AttDate":"2018-09-03","StaffID":"198","Flag":"BLACK","FirstPunchTime":"2018-09-03 08:53:37","LastPunchTime":"2018-09-03 18:05:48","FirstActualTime":"2018-09-03 08:53:37","LastActualTime":"2018-09-03 18:05:48","BellStatus":"-1","DailyID":"6963","IsHaveSign":"0","VisitNum":"-1","PatternName":"","ListMsg":[]},
                //     {"AttDate":"2018-09-04","StaffID":"198","Flag":"BLACK","FirstPunchTime":"2018-09-04 08:56:40","LastPunchTime":"2018-09-04 18:04:25","FirstActualTime":"2018-09-04 08:56:40","LastActualTime":"2018-09-04 18:04:25","BellStatus":"-1","DailyID":"7001","IsHaveSign":"0","VisitNum":"-1","PatternName":"","ListMsg":[{"Title":"外出 : ID=2729 (已审批)","Apply":"王浩1 (09-04 10:18)","Reason":"测试","Approve":"赵志宏 (09-04 10:23)","Update":"","FootStatus":"-1","TimeNGID":"-1","NgType":"-1","IsNGDel":""},{"Title":"出差 : ID=2731 (已审批)","Apply":"王浩1 (09-04 10:18)","Reason":"测试1","Approve":"赵志宏 (09-04 10:23)","Update":"","FootStatus":"-1","TimeNGID":"-1","NgType":"-1","IsNGDel":""}]},
                //     {"AttDate":"2018-09-08","StaffID":"198","Flag":"RED","FirstPunchTime":"2018-09-08 08:57:58","LastPunchTime":"2018-09-08 14:10:49","FirstActualTime":"2018-09-08 08:57:58","LastActualTime":"2018-09-08 14:10:49","BellStatus":"-1","DailyID":"-1","IsHaveSign":"0","VisitNum":"-1","PatternName":"","ListMsg":[{"Title":"加班0.5天","Apply":"王浩1 (09-26 13:16)","Reason":"增加年假编写站内信模块","Approve":"陈平","Update":"","FootStatus":"-1","TimeNGID":"-1","NgType":"-1","IsNGDel":"0"}]},
                //     {"AttDate":"2018-09-11","StaffID":"198","Flag":"BLACK","FirstPunchTime":"","LastPunchTime":"","FirstActualTime":"","LastActualTime":"","BellStatus":"-1","DailyID":"-1","IsHaveSign":"0","VisitNum":"-1","PatternName":"","ListMsg":[{"Title":"下午请假","Apply":"王浩1 (09-27 14:43)","Reason":"病假生病未到","Approve":"陈平","Update":"","FootStatus":"-1","TimeNGID":"-1","NgType":"-1","IsNGDel":"0"},{"Title":"旷工0.5天","Apply":"","Reason":"","Approve":"","Update":"","FootStatus":"-1","TimeNGID":"-1","NgType":"3","IsNGDel":"0"}]},
                //     {"AttDate":"2018-09-14","StaffID":"104","Flag":"BLACK","FirstPunchTime":"","LastPunchTime":"","FirstActualTime":"","LastActualTime":"","BellStatus":"-1","DailyID":"7272","IsHaveSign":"0","VisitNum":"2","PatternName":"","ListMsg":[{"Title":"旷工1天","Apply":"","Reason":"","Approve":"","Update":"吴可嘉 (09-28 11:42)","FootStatus":"1","TimeNGID":"2018091401043","NgType":"3","IsNGDel":"1"},{"Title":"外出 : ID=2848 (已审批)","Apply":"曲张 (09-13 18:05)","Reason":"北京谈代理、老园转介绍","Approve":"易莎莉 (09-14 14:57)","Update":"","FootStatus":"-1","TimeNGID":"-1","NgType":"-1","IsNGDel":""}]}
                // ];
                for (let i = 0; i < arr.length; i++) {
                    // if(arr[i].UpdateName!=""){
                    //     arr[i].isChange = "red";
                    // }else{
                    //     arr[i].isChange = "";
                    // }
                    let attDate = new Date(arr[i].AttDate);
                    let dayList = ["日","一","二","三","四","五","六"];
                    arr[i].newDate = (Array(3).join(0) + (attDate.getMonth() + 1)).slice(-2) + "-" + (Array(3).join(0) + attDate.getDate()).slice(-2)+"("+dayList[attDate.getDay()]+")";

                    arr[i].newFirstActualTime = this.getTimeMinute(arr[i].FirstActualTime);
                    arr[i].newFirstPunchTime = this.getTimeMinute(arr[i].FirstPunchTime);
                    arr[i].newLastActualTime = this.getTimeMinute(arr[i].LastActualTime);
                    arr[i].newLastPunchTime = this.getTimeMinute(arr[i].LastPunchTime);
                    
                    let listMsg = arr[i].ListMsg;
                    let newListMsg = [];
                    for (let j = 0; j < listMsg.length; j++) {
                        arr[i].ListMsg[j].approveStatus = "";
                        arr[i].ListMsg[j].color = "";
                        if (listMsg[j].NgType!="-1") {
                            if (listMsg[j].FootStatus=="-1"&&listMsg[j].NgType!="-1") {
                                arr[i].ListMsg[j].approveStatus = "尚未申辩"
                            }
                            if (listMsg[j].TimeNGID!="-1") {
                                if (listMsg[j].FootStatus=="0") {
                                arr[i].ListMsg[j].approveStatus = "待审批" 
                                arr[i].ListMsg[j].color = "#FF9D00"
                                }else if (listMsg[j].FootStatus=="1") {
                                    arr[i].ListMsg[j].approveStatus = "审批通过" 
                                    arr[i].ListMsg[j].color = "#38adff"
                                }else if (listMsg[j].FootStatus=="2") {
                                    arr[i].ListMsg[j].approveStatus = "审批拒绝" 
                                    arr[i].ListMsg[j].color = "#e51c23"
                                }
                            }
                        }else{
                            newListMsg.push(arr[i].ListMsg[j]);
                        }
                    }
                    arr[i].newListMsg = newListMsg;
                }
                this.attendanceMonthList = arr;
                console.log(this.attendanceMonthList);
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1327");
            });
        },
        //判断是否是不计考勤人员
        findStaffByStaffID(){
            this.attendanceMonthList = [];
            let loading = showLoading();
            findStaffByStaffID(this.selectStaffsMonth).then((result)=>{
                this.ignoreFlag = result.data.data[0].IgnorePuncherData.toLowerCase();
                if (this.ignoreFlag!='true') {
                    this.getStaffTimesBook();
                }else{
                    closeLoading(loading);
                }
            }).catch((err)=>{
                alertError(this,"1015");
            });
        },
        //显示详情栏数据
        showNewListMsg(item){
            this.clickShowItem = item;
            this.clickShowItem.newTitle = item.Title.split(":")[0].trim();
            this.dialogVisibleNewListMsg = true;
        },
        //显示审批详情页
        showIllegalDetail(item){
            if (item.TimeNGID!="-1"&&item.TimeNGID) {
                this.IllegalDetail = {};
                let justifyID = item.TimeNGID;
                let type = "2";
                this.dialogVisibleIllegal = true;
                let loading = showLoading();
                getJustifyByID(justifyID,type).then((result)=>{
                    closeLoading(loading);
                    let obj = result.data;
                    obj.Status = obj.Status.toString();
                    obj.ApproveStaffID = obj.ApproveStaffID.toString();
                    obj.StaffID = obj.StaffID.toString();
                    obj.type = type;
                    this.IllegalDetail = obj;
                }).catch((err)=>{
                    console.log(err)
                    closeLoading(loading);
                    alertError(this,"1134");
                });
            }
        },
        //显示日报信息
        showDailyDeatil(item){
            let applyCompanyID = item.DailyID;
            
            if (applyCompanyID!="-1") {
                this.DailyDeatil = {};
                let punchTime = item.newFirstPunchTime==""?"无":item.newFirstPunchTime+"-"+item.newLastPunchTime;
                let actualTime = item.newFirstActualTime==""?"无":item.newFirstActualTime+"-"+item.newLastActualTime;
                // let date = item.AttDate;
                this.dialogVisibleDaily = true;

                let loading = showLoading();
                getSaleactivityByApplyCompanyID(1,10,applyCompanyID).then((result)=>{
                    closeLoading(loading);
                    let obj = result.data;
                    obj.punchTime = punchTime;
                    obj.actualTime = actualTime;
                    // obj.attDate = date;
                    let arr = JSON.parse(result.data.Content);
                    // let obj = {};
                    // let Content = "[{\"name\":\"日期\",\"value\":\"2018-10-08\"},{\"name\":\"今日完成\",\"value\":\"修改兴趣班等模块bug和界面问题\"},{\"name\":\"访客记录\",\"value\":\"\"},{\"name\":\"明日计划\",\"value\":\"\"},{\"name\":\"汇报总结\",\"value\":\"\"}]"
                    // let arr = JSON.parse(Content);
                    // obj.CreateDate = "2018-10-18 18:09:16";
                    // obj.punchTime = punchTime;
                    // obj.actualTime = actualTime;
                    // obj.ID = "7984";
                    // obj.attDate = date;
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].name == "日期") {
                            obj.dailyDate = arr[i].value;
                        }
                        if (arr[i].name == "今日完成") {
                            obj.todayDone = arr[i].value;
                        }
                        if (arr[i].name == "访客记录") {
                            obj.visitorsRecord = arr[i].value;
                        }
                        if (arr[i].name == "明日计划") {
                            obj.tomorrowPlan = arr[i].value;
                        }
                        if (arr[i].name == "汇报总结") {
                            obj.reportSummary = arr[i].value;
                        }
                    }
                    
                    obj.Images = [];
                    if(obj.Img1){
                        obj.Images.push(obj.Img1.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                    }
                    if(obj.Img2){
                        obj.Images.push(obj.Img2.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                    }
                    if(obj.Img3){
                        obj.Images.push(obj.Img3.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                    }
                    if(obj.Img4){
                        obj.Images.push(obj.Img4.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                    }
                    if(obj.Img5){
                        obj.Images.push(obj.Img5.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                    }
                    if(obj.Img6){
                        obj.Images.push(obj.Img6.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                    }
                    if(obj.Img7){
                        obj.Images.push(obj.Img7.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                    }
                    if(obj.Img8){
                        obj.Images.push(obj.Img8.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                    }

                    this.DailyDeatil = obj;
                }).catch((err)=>{
                    closeLoading(loading);
                    alertError(this,"1113");
                });
            }
        },
        //显示访客信息
        showVisitorsRecord(item){
            if (item.VisitNum!="-1") {
                this.VisitorsRecord = [];
                let staffID = this.selectStaffsMonth;
                let visitDateFrom = item.AttDate;
                let visitDateTo = item.AttDate;
                console.log(visitDateFrom,visitDateTo)
                this.dialogVisibleVisitor = true;
                let loading = showLoading();
                getSaleActivityByStaffID(1,1000,staffID,visitDateFrom,visitDateTo).then((result)=>{
                    closeLoading(loading);
                    this.VisitorsRecord = result.data.data;
                    // this.VisitorsRecord = [ { "SaleActivityID": "5797", "CompanyID": "1334", "Content": "回访使用效果、送了礼物拜托转介绍 (09/14) ", "StaffID": "104", "DateTime": "2018-09-14 16:07:26", "Lon": "", "Lat": "", "Address": "", "TimeStamp": "", "Heading": "", "DataFlag": "0", "CompanyTitle": "北京丰台区意馨艺术幼儿园新发地教学点", "CustomerNum": "3250", "OutFlag": "1", "RelationID": "-1", "CompanyID1": "-1", "Content1": "回访使用效果、送了礼物拜托转介绍 (09/14) ", "StaffID1": "104", "DateTime1": "2018-09-14 16:07:26", "Lon1": "", "Lat1": "", "Address1": "", "TimeStamp1": "", "Heading1": "" }, { "SaleActivityID": "5796", "CompanyID": "3860", "Content": "做幼儿园收购的，签了代理商合同、介绍了一些投资人的资源 (09/14) ", "StaffID": "104", "DateTime": "2018-09-14 16:05:45", "Lon": "", "Lat": "", "Address": "", "TimeStamp": "", "Heading": "", "DataFlag": "0", "CompanyTitle": "深圳尚慧国际教育科技有限公司", "CustomerNum": "5764", "OutFlag": "1", "RelationID": "-1", "CompanyID1": "-1", "Content1": "做幼儿园收购的，签了代理商合同、介绍了一些投资人的资源 (09/14) ", "StaffID1": "104", "DateTime1": "2018-09-14 16:05:45", "Lon1": "", "Lat1": "", "Address1": "", "TimeStamp1": "", "Heading1": "" } ]
                }).catch((err)=>{
                    closeLoading(loading);
                    alertError(this,"1328");
                });
            }
        },
        //切换单日和全月
        changeMonthOrDay(){
            this.isMonth = !this.isMonth;
            if (this.isMonth) {
                this.selectStaffsMonth = this.userInfo.userStaffID;
                this.findStaffByStaffID();
            }else{
                this.getTimesBookByDay();
            }
        },
        //时间转换为00:00模式
        getTimeMinute(time){
            if (time!="") {
                let hour = time.split(" ")[1].split(":")[0];
                let minute = time.split(" ")[1].split(":")[1];
                return hour+":"+minute;
            }else{
                return ""
            }
        },
        //刷新违规数据
        refresh(){
            let loading = showLoading();
            updateTimeBookNG(this.beginDate).then((result)=>{
                closeLoading(loading);
                if(result.data.result=="1"){
                    this.$message({
                        message: '刷新成功',
                        type: 'success'
                    });
                    this.loadList();
                }else{
                    this.$message({
                        message: '刷新失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2079");
            });
        },
        //考勤设置
        setAttendance(){
            this.dialogVisibleSet = true;
            Promise.all([
                getWorkTimeSetting(),
                getSettingValue("WORK_TIME_AM_START,WORK_TIME_AM_END,WORK_TIME_PM_START,WORK_TIME_PM_END")
            ]).then((result)=>{
                this.form.workIgnore = result[0].data.workIgnore;
                this.form.workOverTime = result[0].data.workOverTime;
                this.form.workUnit = result[0].data.workUnit;
                this.form.timebookType = result[0].data.timebookType;
                this.form.timebookAuto = result[0].data.timebookAuto;

                this.form.amStartValue = result[1].data.WORK_TIME_AM_START;
                this.form.amEndValue = result[1].data.WORK_TIME_AM_END;
                this.form.pmStartValue = result[1].data.WORK_TIME_PM_START;
                this.form.pmEndValue = result[1].data.WORK_TIME_PM_END;
            }).catch((err)=>{
                alertError(this,"1138/1211");
            });
        },
        confirmSet(){
            // workIgnore:迟到几分钟忽略不计（例如：3） 
            // workOverTime:加班开始时间从几点开始计算（例如 18:30，注意冒号必须是半角）
            // workUnit:加班时间以几小时为单位(1.0，0.5)
            // timebookType:考勤界面类型(0:长虹立川需求;1:百年树人需求;2:按人按天排班制企业考勤系统;)
            // timebookAuto:对排班制企业（TIMEBOOK_TYPE=2）是否自动分析违规数据(0:否;1:是)
            let workIgnore = this.form.workIgnore;
            let workOverTime = this.form.workOverTime;
            let workUnit = this.form.workUnit;
            let timebookType = this.form.timebookType;
            let timebookAuto = this.form.timebookAuto;

            let amStartValue = this.form.amStartValue;
            let amEndValue = this.form.amEndValue;
            let pmStartValue = this.form.pmStartValue;
            let pmEndValue = this.form.pmEndValue;
            let settingKey = "WORK_TIME_AM_START,WORK_TIME_AM_END,WORK_TIME_PM_START,WORK_TIME_PM_END";
            let settingValue = amStartValue+","+amEndValue+","+pmStartValue+","+pmEndValue;

            let promise = [modifyWorkTime(workIgnore,workOverTime,workUnit,timebookType,timebookAuto)];
            if (timebookType == "0") {
                promise.push(setSettingValue(settingKey,settingValue))
            }
            this.dialogVisibleSet = false;

            let loading = showLoading();
            Promise.all(promise).then((result)=>{
                closeLoading(loading);
                if(result[0].data.result=="1"){
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
                alertError(this,"2084/2139");
            });
        },
        //不计考勤
        // noAssessStaff(){
        //     this.dialogVisibleNoAssess = true;
        // },
        noAssessStaffSet(){
            let arr = new Set(this.noAssessStaffArr);
            let arr1 = new Set(this.noAssessStaffArrChange);
            let removeStaffIDs = [];
            //删除不计考勤人员的数组
            for (let i = 0; i < this.noAssessStaffArr.length; i++) {
                if (!arr1.has(this.noAssessStaffArr[i])) {
                    let jsonRemove = {};
                    jsonRemove.StaffID = this.noAssessStaffArr[i];
                    jsonRemove.IsIgnore = "0";
                    removeStaffIDs.push(jsonRemove);
                }
            }
            let promise = [];
            if (this.noAssessStaffArrChange.length!=0) {
                let staffIdsAdd = this.noAssessStaffArrChange.join(",");
                promise.push(setIgnorePunchStaffs(staffIdsAdd))
            }
            if (removeStaffIDs.length!=0) {
                promise.push(setIgnorePunchStaffsByStaffID(removeStaffIDs))
            }
            if (promise.length=="") {
                this.dialogVisibleNoAssess = false;
            }else{
                let loading = showLoading();
                Promise.all(promise).then((result)=>{
                    this.dialogVisibleNoAssess = false;
                    closeLoading(loading);
                    if(result[0].data.result=="1"){
                        this.$message({
                            message: '设置成功',
                            type: 'success'
                        });
                        this.loadList();
                    }else{
                        this.$message({
                            message: '设置失败',
                            type: 'error'
                        });
                    }
                }).catch((err)=>{
                    closeLoading(loading);
                    alertError(this,"2082/2083");
                });
            }
        },
        //加载员工
        findAllStaffs(){
            this.noAssessStaffArr = [];
            // let loading = showLoading();
            findAllStaffs().then((result)=>{
                // closeLoading(loading);
                this.SET_ALLSTAFFS(result.data.data); //刷新
                let arr = result.data.data;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].IgnorePuncherData == "True") {
                        this.noAssessStaffArr.push(arr[i].StaffID);
                        this.noAssessStaffArrChange = this.noAssessStaffArr;
                    }
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1014");
            });
        },
        //查看详情
        showDetail(item){
            this.clickItem = item;
            this.clickItem.yearMonth = this.yearMonth;
            this.$router.push(this.$route.fullPath+"/illegalManage");
        },
        //修改出勤时间
        updateActualTime(item,type){
            this.form1.updateFirstTime = item.FirstActualTime.split(" ")[1];
            this.form1.updateLastTime = item.LastActualTime.split(" ")[1];

            this.form1.clickUpdateItem = item;
            this.form1.clickUpdateItem.type = type;
            console.log(this.form1.clickUpdateItem);
            this.dialogVisibleUpdate = true;
        },
        updateTimeBook(){
            let theDate,staffID,firstActualTime,lastActualTime;
            let updateStaffID = this.userInfo.userStaffID;
            if (this.form1.clickUpdateItem.type=="1") {
                staffID = this.form1.clickUpdateItem.StaffID;
                theDate = this.yearMonthDate;
            }else{
                staffID = this.selectStaffsMonth;
                theDate = this.form1.clickUpdateItem.AttDate;
            }
            // console.log(this.form1.updateLastTime==""||this.form1.updateLastTime==null);
            let firstTime = (this.form1.updateFirstTime==""||this.form1.updateFirstTime==null)?"":this.form1.updateFirstTime.split(":")[0]+this.form1.updateFirstTime.split(":")[1]+this.form1.updateFirstTime.split(":")[2];
            let lastTime = (this.form1.updateLastTime==""||this.form1.updateLastTime==null)?"":this.form1.updateLastTime.split(":")[0]+this.form1.updateLastTime.split(":")[1]+this.form1.updateLastTime.split(":")[2];

            if(firstTime == ''){
                this.$message.error({
                    message:"请输入出勤时间"
                });
                return;
            }
            if(lastTime == ''){
                this.$message.error({
                    message:"请输入退勤时间"
                });
                return;
            }
            if(parseInt(firstTime)>parseInt(lastTime)){
                this.$message.error({
                    message:"出勤时间不能大于退勤时间"
                });
                return;
            }
            firstActualTime = theDate +" "+ this.form1.updateFirstTime;
            lastActualTime = theDate +" "+ this.form1.updateLastTime;
            // console.log(theDate,staffID,firstActualTime,lastActualTime,updateStaffID)
            // return
            this.dialogVisibleUpdate = false;
            let loading = showLoading();
            updateTimeBook(theDate,staffID,firstActualTime,lastActualTime,updateStaffID,"").then((result)=>{
                closeLoading(loading);
                if(result.data.result=="1"){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    if (this.form1.clickUpdateItem.type=="1") {
                        this.getTimesBookByDay();
                    }else{
                        this.getStaffTimesBook();
                    }
                }else{
                    this.$message({
                        message: '修改失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2080");
            });
        },
        //导出Excel
        confirmExcel(){
            if(!this.dateRange){
                this.$message.error({
                    message: '请选择日期范围'
                });
                return;
            }
            let beginDate = this.dateRange[0];
            let endDate = this.dateRange[1];
            // this.export2Excel(beginDate,endDate);
            // return
            let loading = showLoading();
            getTimeBookStatisticByDate(beginDate,endDate).then((result)=>{
                closeLoading(loading);
                // console.log(result.data.data);
                this.excelData = result.data.data;
                this.export2Excel(beginDate,endDate);
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1330");
            });
        },
        export2Excel(beginDate,endDate){
            let data = [];
            let excelTitle = this.cosName + beginDate + "至" + endDate + "员工考勤数据";
            data.push([
                {
                    value:excelTitle,
                    type:"header",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"},
                            sz:14
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                    } 
                }
            ]);
            data.push([
                {
                    value:"导出日期："+this.yearMonthDate,
                    type:"time",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"},
                            sz:10
                        },
                        alignment:{
                            horizontal:"right",
                            vertical:"center"
                        }
                    } 
                }
            ]);
            let titleArray = [];
            titleArray.push({ 
                value:"序号",
                type:"title",
                style:{
                    font:{
                        color:{ rgb: "FF000000"}
                    },
                    alignment:{
                        horizontal:"center",
                        vertical:"center"
                    },
                    border:{
                        top:{ style: "thin", color: { rgb: "FF000000"} },
                        bottom:{ style: "thin", color: { rgb: "FF000000"} },
                        left:{ style: "thin", color: { rgb: "FF000000"} },
                        right:{ style: "thin", color: { rgb: "FF000000"} }
                    }
                }
            });
            let obj = this.excelData[0];
            for(let k in obj){
                let json = {
                    value:"",
                    type:"title",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                        border:{
                            top:{ style: "thin", color: { rgb: "FF000000"} },
                            bottom:{ style: "thin", color: { rgb: "FF000000"} },
                            left:{ style: "thin", color: { rgb: "FF000000"} },
                            right:{ style: "thin", color: { rgb: "FF000000"} }
                        }
                    }
                };
                if (k == "StaffID") {
                    continue;
                }else if (k == "StaffNum") {
                    json.value = "编号";
                }else if (k == "StaffName") {
                    json.value = "姓名";
                }else if (k == "IgnorePuncherData") {
                    // json.value = "计算考勤";
                    continue;
                }else if (k == "DailyNGSum") {
                    json.value = "不合格日报";
                }else if (k == "VisitSum") {
                    json.value = "访客";
                }else if (k == "BusinessSum") {
                    json.value = "出差";
                }else if (k == "OutsideSum") {
                    json.value = "外出";
                }else if (k == "NGSum") {
                    json.value = "违规";
                }else if (k == "NGDelSum") {
                    json.value = "已免扣";
                }else if (k == "HolidaySum") {
                    json.value = "请假";
                }else if (k == "OverTimeSum") {
                    json.value = "加班";
                }
                titleArray.push(json);
            }
            let arrS = titleArray.splice(9,2);
            arrS.unshift(5,0)
            Array.prototype.splice.apply(titleArray, arrS);
            data.push(titleArray);
            let length = this.excelData.length;
            for (let n = 0; n < length; n++) {
                let contentArray = [];
                let obj1 = this.excelData[n];
                let index = n+1;
                contentArray.push({
                    value:index,
                    type:"content",
                    style:{
                        // fill:{},
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                        border:{
                            top:{ style: "thin", color: { rgb: "FF000000"} },
                            bottom:{ style: "thin", color: { rgb: "FF000000"} },
                            left:{ style: "thin", color: { rgb: "FF000000"} },
                            right:{ style: "thin", color: { rgb: "FF000000"} }
                        }
                    }
                })
                for(let l in obj1){
                    let json1 = {
                        value:"",
                        type:"content",
                        style:{
                            // fill:{},
                            font:{
                                color:{ rgb: "FF000000"}
                            },
                            alignment:{
                                horizontal:"center",
                                vertical:"center"
                            },
                            border:{
                                top:{ style: "thin", color: { rgb: "FF000000"} },
                                bottom:{ style: "thin", color: { rgb: "FF000000"} },
                                left:{ style: "thin", color: { rgb: "FF000000"} },
                                right:{ style: "thin", color: { rgb: "FF000000"} }
                            }
                        }
                    };
                    if (l == "StaffID") {
                        continue;
                    }else if (l == "StaffNum") {
                        json1.value = obj1.StaffNum;
                    }else if (l == "StaffName") {
                        json1.value = obj1.StaffName;
                    }else if (l == "IgnorePuncherData") {
                        // json1.value = obj1.IgnorePuncherData=="1"?"○":"√";
                        continue;
                    }else if (l == "DailyNGSum") {
                        json1.value = parseInt(obj1.DailyNGSum)?obj1.DailyNGSum:"";
                    }else if (l == "VisitSum") {
                        json1.value = parseInt(obj1.VisitSum)?obj1.VisitSum:"";
                    }else if (l == "NGSum") {
                        json1.value = parseInt(obj1.NGSum)?obj1.NGSum:"";
                    }else if (l == "NGDelSum") {
                        json1.value = parseInt(obj1.NGDelSum)?obj1.NGDelSum:"";
                    }else if (l == "HolidaySum") {
                        json1.value = parseInt(obj1.HolidaySum)?obj1.HolidaySum:"";
                    }else if (l == "OverTimeSum") {
                        json1.value = parseInt(obj1.OverTimeSum)?obj1.OverTimeSum:"";
                    }else if (l == "BusinessSum") {
                        if (obj1.IgnorePuncherData=="1") {
                            json1.value = "不计考勤";
                            json1.style.fill = { fgColor:{ rgb: "AAAAAA" } };
                        }else{
                            json1.value = parseInt(obj1.BusinessSum)?obj1.BusinessSum:"";
                        }
                    }else if (l == "OutsideSum") {
                        json1.value = parseInt(obj1.OutsideSum)?obj1.OutsideSum:"";
                    }
                    contentArray.push(json1);
                }
                let arrSp = contentArray.splice(9,2);
                arrSp.unshift(5,0)
                Array.prototype.splice.apply(contentArray, arrSp);
                data.push(contentArray); 
            }
            // let remark = '说明：“√”为计算考勤，“○”为不计考勤';
            // data.push([
            //     {
            //         value:remark,
            //         type:"remark",
            //         style:{
            //             font:{
            //                 color:{ rgb: "FF000000"},
            //                 sz:10
            //             },
            //             alignment:{
            //                 horizontal:"left",
            //                 vertical:"center"
            //             },
            //         } 
            //     }
            // ]);
            let len = data[2].length;
            let merges = [ 
                {s:{c:0, r:0}, e:{c:len-1, r:0}},
                {s:{c:0, r:1}, e:{c:len-1, r:1}},
            ];
            for (let aIndex = 3; aIndex < data.length; aIndex++) {
                if (data[aIndex][5].value == "不计考勤") {
                    let jsonMerges = {s:{c:5, r:aIndex}, e:{c:len-1, r:aIndex}}
                    merges.push(jsonMerges);
                }
            }
            let cols = [];
            for (let cIndex = 0; cIndex < len-1; cIndex++) {
                if (cIndex == 0) {
                    cols.push({ wpx: 50 });
                }else if (cIndex == 1) {
                    cols.push({ wpx: 65 });
                }else if (cIndex == 3) {
                    cols.push({ wpx: 110 });
                }else{
                    cols.push({ wpx: 79});
                }
            }
            
            let pageSetup = {scale: '94', orientation: 'landscape'};
            let Sheets = {
                'Sheet1':data2Workbook(data,merges,cols,pageSetup)
            };
            export_json_to_excel(['Sheet1'],Sheets,excelTitle);
            this.dialogVisibleExcel = false;
        },

        handleSizeChange(val){
            this.pageSize = val;
        },
        handleCurrentChange(val){
            this.currentPage = val;
        },
        //获取当前时间
        getNowTime(){
            let date = new Date();
            let year =  date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            let beforeMonth = month - 1;
            let beforeYear = year;
            if (beforeMonth == 0) {
                beforeMonth = 12;
                beforeYear = year - 1;
            }else if (beforeMonth >= 1 && beforeMonth <= 9) {
                beforeMonth = "0" + beforeMonth;
            }
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            this.beforeYearMonth = beforeYear + "-" + beforeMonth;
            this.yearMonth = year + "-" + month;
            this.yearMonthDate = year + "-" + month + "-" + strDate;
            this.yearMonthNoDate = year + "-" + month;
            this.loadList();
        },
        // handleClick(){
        //     this.loadList();
        // },
        //整数判断
        judgeNum(){
            // console.log(obj.target._value)
            let value = this.form.workIgnore;
            value = value.replace(/[^\d]/g,"").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0");
            this.form.workIgnore = value;
        },
        //获取当前登录cosName
        getCosByCosNum(){
            let cosNum = this.userInfo.cosNum;
            getCosByCosNum(cosNum).then((result)=>{
                this.cosName = result.data.F_CosName;
            }).catch((err)=>{
                alertError(this,"1993");
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
        },
        tableRowClassName1({row, rowIndex}) {
            if (row.IsUpdateDate == "1"||row.IsNGDate == "1") {
                return 'otherhover';
            } 
            return '';
        },
        tableCellClassName({row, column, rowIndex, columnIndex}) {
            if (columnIndex == "1") {
                if (row.IsNGDate == "1") {
                    return "orangeRow"
                }
            }else if (columnIndex == "2") {
                if (row.IsUpdateDate == "1") {
                    return "redRow"
                }
            }
            return ""
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.AttendanceManageList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .attendanceManageList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.attendanceManageList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .attendanceManageList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .attendanceManageList{
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
.bBtn{
    display: inline-block;
    /* margin-left: 3px; */
    font-size: 14px;
    font-weight: normal;
    padding: 2px;
    line-height: 14px;
    border-radius: 12%;
    border: 1px solid #ddd;
    /* cursor: pointer; */
    /* color: #999; */
}
.approveStatus{
    display: inline-block;
    margin-left: 3px;
    font-size: 12px;
    font-weight: normal;
    padding: 1.5px;
    line-height: 12px;
    border-radius: 8%;
    background: #aaa;
    color: #fff;
    height: 100%;
    transform: translateY(-1.5px);
}

.detailList{
    width:100%;
    border-left:1px solid #999;
    border-top:1px solid #999;
}
.detailItem{
    display: flex;
    flex-direction: row;
}
.detailTitle{
    width:130px;
    border-bottom:1px solid #999;
    border-right:1px solid #999;
    padding:10px;
    display: flex;
    align-items: center;
}
.detailContent{
    flex:1;
    border-bottom:1px solid #999;
    border-right:1px solid #999;
    padding:10px;
    color: #999;
    min-height: 41px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.detailContent1{
    flex:1;
    border-bottom:1px solid #999;
    border-right:1px solid #999;
    padding:10px;
    color: #999;
    min-height: 41px;
}
.detailContent > .image{
    width:50px;
    height:50px;
    margin-right: 40px;
    display: inline-block;
    overflow: hidden;
}
.flexItemCenter{
    display: flex;
    align-items: center;
}
.createDate{
    padding-top:54px;
    padding-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.file{
    color:#38adff;
    margin-right: 30px;
    cursor: pointer;
}
</style>