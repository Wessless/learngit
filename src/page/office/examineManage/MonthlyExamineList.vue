<template>
    <div class="ExamineManageList">
        <router-view :item="clickItem" @refresh="refresh"></router-view>
        <chat-header :showBack="true" :title="'月度考核设定'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding:54px 20px 20px 20px;overflow: scroll;">
            <el-tabs v-model="tabSelect" @tab-click="handleClick" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;width:100%;" class="tuitionIncomeTabs">
                <el-tab-pane label="考核员工" name="first" >
                    <label style="margin-left:20px">月度考核</label>
                    <el-switch
                        style="margin:8px 5px 10px 13px;"
                        v-model="hrEvaluation"
                        @change="setMonExamineDate"
                        active-color="#38adff"
                        inactive-color="#8f8f94">
                    </el-switch>
                    <span v-show="hrEvaluation" style="cursor:pointer;color:#38adff;" @click="dialogVisibleSet=true;Switch=true;">{{dateRange}}</span>
                    <el-button style="display:block;float:right;margin:5px 20px 10px 5px;" @click="saveEvaluationTemplateForStaff" type="primary" size="medium">设为非考核员工</el-button>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 20px;">
                        <el-table :data="monthlyExamineList"  @selection-change="handleSelectionChange" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="455">
                            <el-table-column type="selection" align="center" width="40"></el-table-column>
                            <el-table-column align="center"  label="被考核人"  width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.StaffName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="考核模板">
                                <template slot-scope="scope"  >
                                    <span class="spanTitle">{{scope.row.Name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="status" label="考核人" width="200">
                                <template slot-scope="scope">
                                    <span>{{scope.row.NAME1+(scope.row.NAME2?'，'+scope.row.NAME2:"")+(scope.row.NAME3?'，'+scope.row.NAME3:"")}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="80">
                                <template slot-scope="scope">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="updateExamine(scope.row)">修改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>    
                    </div>
                </el-tab-pane>

                <el-tab-pane label="非考核员工" name="second" >
                    <label style="margin-left:20px">月度考核</label>
                    <el-switch
                        style="margin:8px 5px 10px 13px;"
                        v-model="hrEvaluation"
                        @change="setMonExamineDate"
                        active-color="#38adff"
                        inactive-color="#8f8f94">
                    </el-switch>
                    <span v-show="hrEvaluation" style="cursor:pointer;color:#38adff;" @click="dialogVisibleSet=true;Switch=true">{{dateRange}}</span>
                    <div class="midTableHeight" style="width:100%;display:block;padding:10px 20px;">
                        <el-table :data="monthlyExamineList"  @selection-change="handleSelectionChange" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="455">
                            <el-table-column align="center"  label="被考核人" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.StaffName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="updateExamine(scope.row)">修改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>  
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog
            title="设置月度考核起止日期"
            :show-close="false"
            :close-on-click-modal="false"
            :visible.sync="dialogVisibleSet"
            width="400px">
            <el-form label-width="110px">
                <el-form-item :label="'开始日期'">
                    <el-input v-model="startDate" size="mini" style="width:200px;" placeholder="每月的第几日"></el-input>
                </el-form-item>
                <el-form-item :label="'结束日期'">
                    <el-input v-model="endDate" size="mini" style="width:200px;" placeholder="每月的第几日"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDia">取 消</el-button>
                <el-button type="primary" @click="setExamine">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getSettingValue,setSettingValue,getEvaluationStaff,saveEvaluationTemplateForStaff } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'ExamineManageList',
    data(){
        return {
            tabSelect:"first",
            hrEvaluation:false,
            Switch:false,

            dialogVisibleSet:false,
            startDate:"",
            endDate:"",

            monthlyExamineList:[],
            clickItem:{},
            checkExamineArr:[],
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.getSettingValue();
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        dateRange(){
            if (this.hrEvaluation) {
                return this.startDate+'日 ~ '+this.endDate + '日';
            }else{
                return "";
            }
        }
    },
    methods:{
        refresh(){
            this.tabSelect = "first";
            this.loadList();
        },
        loadList(){
            this.monthlyExamineList = [];
            let templateID;
            if (this.tabSelect == "first") {
                templateID = "0";
            }else{
                templateID = "-1";
            }
            let loading = showLoading();
            getEvaluationStaff(templateID).then((result)=>{
                closeLoading(loading);
                console.log(result.data.data);
                let arr = result.data.data;
                this.monthlyExamineList = arr;
            }).catch((err)=>{
                alertError(this,"1108");
                closeLoading(loading);
            });
        },
        getSettingValue(){
            getSettingValue("HR_EVALUATION_START_DATE,HR_EVALUATION_END_DATE").then((result)=>{
                console.log(result.data);
                let obj = result.data;
                this.startDate = obj.HR_EVALUATION_START_DATE;
                this.endDate = obj.HR_EVALUATION_END_DATE;
                if (this.startDate!='') {
                    this.hrEvaluation = true;
                }else{
                    this.hrEvaluation = false;

                }
            }).catch((err)=>{
                alertError(this,"1211");
            });  
        },
        saveEvaluationTemplateForStaff(){
            let staffArr = [];
            if (this.checkExamineArr.length==0) {
                this.$message.error({
                    message:"请选择设为非考核员工的记录"
                });
                return;
            }
            for (let i = 0; i < this.checkExamineArr.length; i++) {
                staffArr.push(this.checkExamineArr[i].StaffID);
            }
            let staffID = staffArr.join(",");
            let loading = showLoading();
            saveEvaluationTemplateForStaff(staffID,"","-1","-1","-1").then((result)=>{
                closeLoading(loading);
                this.dialogVisibleSet = false;
                if(result.data.ret=="1"){
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
                console.log(err);
                closeLoading(loading);
                alertError(this,"2139");
            });
        },
        //跳转修改页
        updateExamine(item){
            this.clickItem = item;
            this.$router.push(this.$route.fullPath+"/update");
        },
        handleSelectionChange(arr){
            this.checkExamineArr = arr;
        },
        //设置月度考核起止日期
        setMonExamineDate(){
            if (this.hrEvaluation) {
                this.dialogVisibleSet = true;
            }else{
                let settingKey = "HR_EVALUATION_START_DATE,HR_EVALUATION_END_DATE";
                let settingValue = ""+","+"";
                setSettingValue(settingKey,settingValue).then((result)=>{
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
                    console.log(err);
                    alertError(this,"2139");
                });
            }
        },
        setExamine(){
            let startDate = this.startDate;
            let endDate = this.endDate;
            if(startDate == ''){
                this.$message.error({
                    message:"请输入开始日期"
                });
                return;
            }
            if(endDate == ''){
                this.$message.error({
                    message:"请输入结束日期"
                });
                return;
            }
            if(parseInt(startDate)>parseInt(endDate)){
                this.$message.error({
                    message:"时间输入有误"
                });
                return;
			}
            if(parseInt(startDate)>28||parseInt(startDate)<1||parseInt(endDate)>28||parseInt(endDate)<1){
                this.$message.error({
                    message:"时间输入应在1到28之间"
                });
                return;
			}
            let settingKey = "HR_EVALUATION_START_DATE,HR_EVALUATION_END_DATE";
            let settingValue = startDate+","+endDate;
            setSettingValue(settingKey,settingValue).then((result)=>{
                this.dialogVisibleSet = false;
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
                console.log(err);
                alertError(this,"2139");
            });
        },
        closeDia(){
            this.dialogVisibleSet = false;
            if (!this.Switch) {
                this.hrEvaluation = false;
            }
            this.Switch = false;
        },
        handleClick(tab, event) {
            if (tab.label == "考核员工") {
                this.loadList();
            }else if (tab.label == "非考核员工") {
                this.loadList();
            }
        },
        // handleSizeChange(val){
        //     this.pageSize = val;
        //     this.loadList();
        // },
        // handleCurrentChange(val){
        //     this.currentPage = val;
        //     this.loadList();
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
        tableCellClassName({ row, column, rowIndex, columnIndex }) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
        },
        //合并
        // arraySpanMethod({row, column, rowIndex, columnIndex}){
        //     if (columnIndex === 0) {
        //         if (row.index === 0) {
        //             return {
        //                 rowspan: row.len,
        //                 colspan: 1
        //             };
        //         } else {
        //             return {
        //                 rowspan: 0,
        //                 colspan: 0
        //             };
        //         }
        //     }
        //     if (columnIndex === 1) {
        //         if (row.index === 0) {
        //             return {
        //                 rowspan: row.len,
        //                 colspan: 1
        //             };
        //         } else {
        //             return {
        //                 rowspan: 0,
        //                 colspan: 0
        //             };
        //         }
        //     }
        // },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.ExamineManageList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .monthlyExamineList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.monthlyExamineList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .monthlyExamineList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .monthlyExamineList{
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
    line-height: 12px;
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
    height: 17px;
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
</style>