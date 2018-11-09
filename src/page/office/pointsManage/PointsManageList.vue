<template>
    <div class="PointsManageList">
        <chat-header :showBack="true" :title="'员工积分'"></chat-header>
        <div style="width:100%;padding:54px 20px 20px 20px;">
            <el-tabs v-model="tabSelect" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;width:100%;" class="tuitionIncomeTabs">
                <el-tab-pane label="在职人员" name="first" >
                    <el-button style="display:block;float:right;margin:10px 20px 10px 5px;" type="primary" size="medium" @click="setPoints">设置</el-button>
                    <el-button style="display:block;float:right;margin:10px 5px;" type="primary" size="medium" @click="pointsSubject">积分科目</el-button>
                    <el-button style="display:block;float:right;margin:10px 5px;" type="primary" size="medium" @click="pointsClassify">积分分类&nbsp;({{dealNum}}个)</el-button>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 20px 20px 20px;">
                    <el-table :data="pointsManageList1" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="445">
                        <el-table-column prop="StaffName" align="center"  label="姓名"  width="180"></el-table-column>
                        <el-table-column prop="StaffNum" align="center"  label="员工编号"  width="150"></el-table-column>
                        <el-table-column prop="TotalCredit" align="center"  label="当前积分"  width="150"></el-table-column>
                        <el-table-column align="center" label="是否参与工资计算" >
                            <template slot-scope="scope">
                                <span :style="{color: scope.row.SalaryNotIncluded=='1'?'#e51c23':''}">{{scope.row.SalaryNotIncluded=="1"?"不参与":"参与"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="180">
                            <template slot-scope="scope">
                                <!-- <el-button
                                    size="mini"
                                    class="orangeButton"
                                    type="primary"
                                    @click="updateDetail(scope.row)">修改</el-button> -->
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="showDetail(scope.row)">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="离职人员" name="second" >
                    <el-button style="display:block;float:right;margin:10px 20px 10px 5px;" type="primary" size="medium" @click="setPoints">设置</el-button>
                    <el-button style="display:block;float:right;margin:10px 5px;" type="primary" size="medium" @click="pointsClassify">积分分类</el-button>
                    <el-button style="display:block;float:right;margin:10px 5px;" type="primary" size="medium" @click="pointsSubject">积分科目</el-button>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 20px 20px 20px;">
                    <el-table :data="pointsManageList2" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="445">
                        <el-table-column prop="StaffName" align="center"  label="姓名"  width="180"></el-table-column>
                        <el-table-column prop="StaffNum" align="center"  label="员工编号"  width="150"></el-table-column>
                        <el-table-column prop="TotalCredit" align="center"  label="当前积分"  width="150"></el-table-column>
                        <el-table-column align="center" label="是否参与工资计算" >
                            <template slot-scope="scope">
                                <span :style="{color: scope.row.SalaryNotIncluded=='1'?'#e51c23':''}">{{scope.row.SalaryNotIncluded=="1"?"不参与":"参与"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="180">
                            <template slot-scope="scope">
                                <!-- <el-button
                                    size="mini"
                                    class="orangeButton"
                                    type="primary"
                                    @click="updateDetail(scope.row)">修改</el-button> -->
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="showDetail(scope.row)">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <div class="midTableHeight">
            <el-dialog
                :title="clickStaffName+'积分详情'"
                :visible.sync="dialogVisibleShow"
                width="50%">
                <span>当前积分：{{allTotalCredit}}</span>
                <el-table :data="pointsManageDetail" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="300">
                    <el-table-column prop="BeginDate" align="center"  label="开始时间"  width="120"></el-table-column>
                    <el-table-column align="center"  label="科目名称" >
                        <template slot-scope="scope">
                            <span class="spanTitle" :title="scope.row.Detail[0].credit">{{scope.row.Detail[0].credit}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ManageName" align="center"  label="评定人"  width="80"></el-table-column>
                    <el-table-column prop="ManageDate" align="center"  label="评定时间"  width="180"></el-table-column>
                    <el-table-column align="center"  label="积分"  width="60">
                        <template slot-scope="scope">
                            <span>{{scope.row.Detail[0].value}}</span>
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

            <el-dialog
                title="积分设置"
                :visible.sync="dialogVisibleSet"
                width="35%">
                <div style="color:#606266;font-weight:bold;margin-left:30px;">关于A分：</div>
                <div style="margin-left:50px;">
                    <span style="margin-right:10px;">评分人</span>
                    <el-select v-model="form.ApointPeople" multiple size="mini" placeholder="请选择评分人" style="width:290px" >
                        <el-option
                        v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                        </el-option>
                    </el-select>
                </div>
                <div style="color:#606266;font-weight:bold;margin:10px 0 0 30px;">关于B分：</div>
                <div style="margin-left:50px;">
                    <div>
                        <span style="margin-right:10px;">评分人</span>
                        <el-checkbox v-model="form.checked1">员工本人</el-checkbox>
                        <el-checkbox v-model="form.checked2">直属上级</el-checkbox>
                    </div>
                    <div>
                        <el-checkbox v-model="form.checked3" style="margin:0px 10px 0px 56px;">其他</el-checkbox>  
                        <el-select v-model="form.BpointPeople" :disabled="disabledB" multiple size="mini" placeholder="请选择评分人" style="width:223px;" >
                            <el-option
                            v-for="item in allStaffs"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleSet = false">取 消</el-button>
                    <el-button type="primary" @click="confirmSet">确 定</el-button>
                </span>
            </el-dialog>

            <!-- <el-dialog
                title="积分分类"
                :visible.sync="dialogVisibleClassify"
                width="40%">
                <el-table :data="pointsClassifyDetail" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="300">
                    <el-table-column prop="TypeName" align="center"  label="分类名称"  width="240">
                        <template slot-scope="scope">
                            <span class="spanTitle" :title="scope.row.TypeName">{{scope.row.TypeName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center"  label="计分类型"  width="160">
                        <template slot-scope="scope">
                            <el-radio v-model="scope.row.Type" label="A">A分</el-radio>
                            <el-radio style="margin-left:5px;" v-model="scope.row.Type" label="B">B分</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column align="center"  label="积分" >
                        <template slot-scope="scope">
                            
                        </template>
                    </el-table-column>
                </el-table>

                <div style="margin-bottom:50px;">
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
            </el-dialog> -->
        </div>
    </div>
</template>

<script>

import { getTotalCredit,getCreditDetailList,getCreditSetting,setCreditSetting } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'PointsManageList',
    data(){
        return {
            form:{
                ApointPeople:[],
                BpointPeople:[],
                checked1:false,  //是否员工本人
                checked2:false,  //工作计划负责人
                checked3:false,  //其他
            },
            clickTabName:"",
            tabSelect:"first",
            dealNum:"",
            clickStaffName:"",
            
            dialogVisibleShow:false,
            dialogVisibleSet:false,
            clickItem:{},
            pointsManageList1:[],
            pointsManageList2:[],
            //员工积分详情参数
            pointsManageDetail:[],
            pageSize:10,
            currentPage:1,
            itemNum:0,
            allTotalCredit:"", //当前积分

            //积分分类参数
            // pointsClassifyDetail:[],
            // pageSize1:10,
            // currentPage1:1,
            // itemNum1:0,
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
        disabledB(){
            if (this.form.checked3) {
                return false;
            }else{
                this.form.BpointPeople = [];
                return true;
            }
        }
    },
    methods:{
        loadList(){
            this.pointsManageList1 = [];
            this.pointsManageList2 = [];
            let loading = showLoading();
            // getTotalCredit(isBeStaff).then((result)=>{
            //     closeLoading(loading);
            //     this.pointsManageList = result.data.data;
            // }).catch((err)=>{
            //     closeLoading(loading);
            //     alertError(this,"1014");
            // });
            Promise.all([getTotalCredit('1'),getTotalCredit('0'),getCreditSetting()]).then((result)=>{
                closeLoading(loading);
                let arr1 = result[0].data.data;
                let arr2 = result[1].data.data;
                let arrSplice1 = [];
                let arrSplice2 = [];
                for (let i = 0; i < arr1.length; i++) {
                    if (arr1[i].SalaryNotIncluded == "1") {
                        arrSplice1.push(arr1[i]);
                    }else{
                        this.pointsManageList1.push(arr1[i]);
                    }
                }
                this.pointsManageList1 = this.pointsManageList1.concat(arrSplice1);

                for (let j = 0; j < arr2.length; j++) {
                    if (arr2[j].SalaryNotIncluded == "1") {
                        arrSplice2.push(arr2[j]);
                    }else{
                        this.pointsManageList2.push(arr2[j]);
                    }
                }
                this.pointsManageList2 = this.pointsManageList2.concat(arrSplice2);

                this.dealNum = result[2].data.AllNum;
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1218");
            });
        },
        //积分设置
        setPoints(){
            this.dialogVisibleSet = true;
            // let loading = showLoading();
            getCreditSetting().then((result)=>{
                // closeLoading(loading);
                console.log(result.data);
                this.form.ApointPeople = result.data.ASet.length!=0?result.data.ASet.split(","):[];
                this.form.BpointPeople = result.data.BSetStaffs.length!=0?result.data.BSetStaffs.split(","):[];
                let str = result.data.BSet;
                this.form.checked1 = str[0]=="1"?true:false;
                this.form.checked2 = str[1]=="1"?true:false;
                this.form.checked3 = result.data.BSetStaffs.length!=0?true:false;
                // this.form.checked3 = str[2]=="1"?true:false;

            }).catch((err)=>{
                console.log(err);
                // closeLoading(loading);
                alertError(this,"1218");
            });
        },
        confirmSet(){
            // if(maxDaysValue==""){
            //     this.$message.error({
            //         message:"请输入上限天数"
            //     });
            //     return;
            // }
            let aStaff = this.form.ApointPeople.length!=0?this.form.ApointPeople.join(","):"";
            let str1 = this.form.checked1?"1":"0";
            let str2 = this.form.checked2?"1":"0";
            let bStaff = str1 + str2 + "0";
            let bStaffs = this.form.BpointPeople.length!=0?this.form.BpointPeople.join(","):"";
            // console.log(aStaff);
            // console.log(bStaff);
            // console.log(bStaffs);
            if(aStaff==""){
                this.$message.error({
                    message:"请选择A分评分人"
                });
                return;
            }
            if(bStaff=="000"&&bStaffs==""){
                this.$message.error({
                    message:"请选择B分评分人"
                });
                return;
            }
            if (this.form.checked3&&bStaffs=="") {
                this.$message.error({
                    message:"请选择其他项评分人"
                });
                return;
            }
            this.dialogVisibleSet = false;

            let loading = showLoading();
            setCreditSetting(aStaff,bStaff,bStaffs).then((result)=>{
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
                alertError(this,"2140");
            });
        },
        //积分分类
        pointsClassify(){
            this.$router.push(this.$route.fullPath+"/pointsClassify");
        },
        //积分科目
        pointsSubject(){
            this.$router.push(this.$route.fullPath+"/pointsSubject");
        },
        // getAllCreditType(){
        //     let type = "-1";
        //     getAllCreditType(this.currentPage1,this.pageSize1,type).then((result)=>{
        //         this.pointsClassifyDetail = result.data.data;
        //         console.log(this.pointsClassifyDetail)
        //         this.itemNum1 = result.data.totalCount;
        //     }).catch((err)=>{
        //         closeLoading(loading);
        //         alertError(this,"1205");
        //     });
        // },
        //员工积分详情
        showDetail(item){
            this.dialogVisibleShow = true;
            this.clickItem = item;
            this.clickStaffName = item.StaffName;
            this.currentPage = 1;
            this.pageSize = 10;
            this.getCreditDetailList();
        },
        getCreditDetailList(){
            this.pointsManageDetail = [];
            let staffID = this.clickItem.StaffID;
            let loading = showLoading();
            getCreditDetailList(this.currentPage,this.pageSize,staffID).then((result)=>{
                closeLoading(loading);
                let obj = result.data.data;
                let detailValue = result.data;
                // for(let i=0;i<obj.length;i++){
                //      if (obj[i].HolidayReason.indexOf('<br />')!="-1") {
                //         obj[i].ellipsis = true;
                //         obj[i].ellipsisHolidayReason = obj[i].HolidayReason.split("<br />")[0]+' ...';
                //     }else{
                //         obj[i].ellipsis = false;
                //     }
                //     this.pointsManageDetail.push(obj[i]);
                // }
                this.pointsManageDetail = obj;
                this.allTotalCredit = detailValue.TotalCredit;
                this.itemNum = parseInt(detailValue.totalCount);
                if(this.pointsManageDetail.length==0){
                    this.itemNum = 0;
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1166");
            });
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.getCreditDetailList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getCreditDetailList();
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
.PointsManageList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .pointsManageList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.pointsManageList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .pointsManageList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .pointsManageList{
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