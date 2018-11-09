<template>
    <div class="TrainingManageList">
        <!-- <router-view></router-view> -->
        <chat-header :showBack="true" :title="'培训管理'"></chat-header>
        <div style="width:100%;padding:54px 20px 10px 20px;">
            <!-- <label style="margin-left:10px;">被考核人</label> -->
            <!-- <el-select v-model="sleStaffID" @change="loadList" style="width:150px;margin:10px;" size="medium" filterable placeholder="请选择员工">
                <el-option
                    v-for="item in staffsList"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                </el-option>
            </el-select> -->
            <el-button style="display:block;float:right;margin:10px 10px 10px 5px;" type="primary" size="medium" @click="addTraining">添加</el-button>
            <div class="midTableHeight" style="width:100%;display:block;padding:0 10px;">
                <el-table :data="trainingManageList" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="470">
                    <el-table-column prop="StaffName" align="center"  label="名称"  width="100"></el-table-column>
                    <el-table-column prop="Title" align="center"  label="开始时间"></el-table-column>
                    <el-table-column prop="OnceMoney" align="center"  label="结束时间"  width="160"></el-table-column>
                    <el-table-column prop="Times" align="center"  label="创建者"  width="150"></el-table-column>
                    <el-table-column align="center" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="primary"
                                @click="showDetail(scope.row)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <div>
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
                </div> -->
            </div>
        </div>
        <!-- 添加或修改赏罚 -->
        <!-- <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisibleAdd"
            width="500px">
            <el-form :model="form" label-width="150px">
                <el-form-item label="工资计算月份">
                    <el-date-picker
                        v-model="form.recordDate"
                        type="date"
                        :clearable='false'
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        style="width:200px"
                        size="small"
                        placeholder="请选择工资计算月份">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="赏罚科目">
                    <el-select v-model="form.rewardSortID" @change="getOnceMoney" size="small" style="width:200px;" filterable placeholder="请选择赏罚科目">
                        <el-option
                            v-for="item in form.rewardSortArr"
                            :key="item.RewardPunishmentSortID"
                            :label="item.Title"
                            :value="item.RewardPunishmentSortID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发生回数">
                    <el-input v-model="form.times" size="small" @keyup.native="changeNum" style="width:200px;" placeholder="请输入次数(数字)"></el-input>
                </el-form-item>
                <el-form-item label="单次赏罚金额">
                    <el-input v-model="form.onceMoney" disabled size="small" style="width:200px;" placeholder="请输入金额"></el-input>
                </el-form-item>
                <el-form-item label="赏罚人员" :style="form.staffIDs.length!=0?{margin:'5px 0 0 0'}:''">
                    <el-select v-model="form.staffIDs" multiple :disabled="type=='update'" size="small" style="width:200px;" filterable placeholder="请选择赏罚科目">
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
                <el-button @click="dialogVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="confirmSet">确 定</el-button>
            </span>
        </el-dialog> -->

        <!-- <el-dialog
            title="提示"
            :visible.sync="dialogVisibleDel"
            width="500px">
            <span>您确定要删除该赏罚信息吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleDel = false">取 消</el-button>
                <el-button type="primary" @click="confirmDel">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>

import {  } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'TrainingManageList',
    data(){
        return {
            form:{

            },
            // sleStaffID:"-1",
            // staffsList:[],

            currentPage:1,
            pageSize:10,
            itemNum:0,
            trainingManageList:[],

            clickItem:{},
            type:"",
            dialogVisibleAdd:false,
            dialogVisibleDel:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        // this.getNowTime();
        // this.getStaffsList();
        this.getRewardPunishmentSort();
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        dialogTitle(){
            if (this.type == "add") {
                return "赏罚录入"
            }else if (this.type == "update") {
                return "赏罚修改"
            }
        },
        titleName(){
            if (this.form.rewardSortID!="") {
                if (this.form.rewardSortArr.length!=0) {
                    let obj = this.form.rewardSortArr.find((item)=>{
                        return this.form.rewardSortID  === item.RewardPunishmentSortID;
                    })
                    return obj.Title;
                }
            }
        },
    },
    methods:{
        loadList(){
            this.trainingManageList = [];

            // let loading = showLoading();
            // getRewardPunishmentRecord(this.currentPage,this.pageSize,recordDate,staffID).then((result)=>{
            //     closeLoading(loading);
            //     this.trainingManageList = result.data.data;
            //     this.itemNum = result.data.totalCount;
            //     console.log(this.trainingManageList);
            // }).catch((err)=>{
            //     console.log(err);
            //     closeLoading(loading);
            //     alertError(this,"1335");
            // });
        },
        addTraining(){

        },
        //详情
        showDetail(){

        },
        handleSizeChange(val){
            this.pageSize = val;
            this.loadList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.loadList();
        },
        //获取当前时间
        // getNowTime(){
        //     let date = new Date();
        //     let year =  date.getFullYear();
        //     let month = date.getMonth() + 1;
        //     let strDate = date.getDate();
        //     if (month >= 1 && month <= 9) {
        //         month = "0" + month;
        //     }
        //     if (strDate >= 0 && strDate <= 9) {
        //         strDate = "0" + strDate;
        //     }
        //     this.form.recordDate = year + "-" + month;
        // },
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
.TrainingManageList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .trainingManageList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.trainingManageList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .trainingManageList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .trainingManageList{
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