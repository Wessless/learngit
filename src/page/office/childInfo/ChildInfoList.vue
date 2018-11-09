<template>
    <div class="childInfo">
        <chat-header :showBack="true" :title="'幼儿信息'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="formInline.classID" filterable size="medium" placeholder="请选择班级" @change="reloadList(true)">
                        <el-option
                        v-for="item in formInline.classList"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span style="color:#999">{{ allNum }}</span>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-radio v-model="formInline.radio" label="0" style="margin-left:20px;" @change="getClassesByStatus">进行中班级</el-radio>
                    <el-radio v-model="formInline.radio" label="1" style="margin-left:20px;" @change="getClassesByStatus">已毕业班级</el-radio>
                    <el-radio v-model="formInline.radio" label="2" style="margin-left:20px;" @change="getClassesByStatus">中途退学</el-radio>
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="demo-form-inline" style="margin-top:10px;">
                <el-form-item style="float:right;">
                    <el-button type="default" size="medium" @click="export2Excel">导出</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" v-show="canSetPaymentSubject" @click="setPaymentSubject">缴费科目</el-button>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="formInline.selectInput" @keyup.enter.native="reloadList()" size="medium" style="width:218px;" placeholder="请输入学号、姓名、手机号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" @click="reloadList()">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="childInfoList" :class="{forthInfoList:closeLeft}">
            <child-info-item v-for="(item,index) in allChildList" :key="index" :item="item" :type="formInline.radio" :canSetPaymentSubject="canSetPaymentSubject" @clickDelete="clickDelete" @childRecord="childRecord" @changeClass="clickChangeClass" @quitSchool="clickQuitSchool" @changeClassBack="clickChangeClass"></child-info-item>
        </div>
        <scroll-top></scroll-top>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该幼儿</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="查看学籍"
            :visible.sync="recordDialogVisible"
            width="50%">
            <el-table :data="childRecordList" border style="width: 100%" :header-cell-class-name="getHeaderCellClass">
                <el-table-column prop="TurnDate" label="日期" width="100" align="center"></el-table-column>
                <el-table-column prop="Detail" label="学籍记录" width="180" align="center"></el-table-column>
                <el-table-column prop="Remark" label="备注信息" align="center"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog
            :title="changeClassTitle"
            :visible.sync="changeClassDialogVisible"
            width="30%">
            <el-form :model="changeClassForm" label-width="70px">
                <el-form-item label="转班日期" >
                    <el-date-picker
                        v-model="changeClassForm.turnDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        size="medium"
                        placeholder="请选择转班日期"
                        style="width:100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="班级名称" >
                    <el-select v-model="changeClassForm.changeClassID" size="medium" placeholder="请选择班级" style="width:100%;">
                        <!-- <el-option label="区域一" value="shanghai"></el-option> -->
                        <el-option
                            v-for="item in myAllClasses"
                            :key="item.ID"
                            :label="item.ClassName"
                            :disabled="item.ID==formInline.classID"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeClassDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeClass">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="退学"
            :visible.sync="quitSchoolDialogVisible"
            width="30%">
            <el-form :model="changeClassForm" label-width="70px">
                <el-form-item label="退学日期" >
                    <el-date-picker
                        v-model="quitSchoolForm.turnDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        size="medium"
                        placeholder="请选择退学日期"
                        style="width:100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input
                        placeholder="请输入备注"
                        v-model="quitSchoolForm.remark"
                        type="textarea"
                        :rows="4"
                        style="width:100%;">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="quitSchoolDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="quitSchool">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getChildsByClassID,getClasses,getClassesByStatus,delChild,getChildRecord,changeClass,quitSchool,getSettingValue } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { export_json_to_excel,data2Workbook } from '@/js/exportToXlxs'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import childInfoItem from '@/page/office/childInfo/ChildInfoItem'
import NoData from '@/components/chat/NoData'
import ScrollTop from '@/components/chat/ScrollTop'

export default {
    name: 'ChildInfo',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
                radio:"0",
                selectInput:""
            },
            canSetPaymentSubject:false,//是否可以设置缴费科目
            isNoData:false,
            dialogVisible:false,
            changeClassDialogVisible:false,
            quitSchoolDialogVisible:false,
            recordDialogVisible:false,
            clickItem:{},
            allStaffList:[],
            allChildList:[],
            myAllClasses:[],
            childRecordList:[],
            changeClassForm:{
                turnDate:"",
                changeClassID:""
            },
            quitSchoolForm:{
                turnDate:"",
                remark:""
            },
            changeClassTitle:""
        }
    },
    components:{
        NoData,
        ScrollTop,
        ChatHeader,
        childInfoItem
    },
    mounted(){
        this.getClassesByStatus();
        this.getClasses();
        this.getSettingValue();
    },
    activated(){
        if(this.formInline.classID){
            this.reloadList();
        }
        console.log(this.$vnode.parent.componentInstance.cache)
    },
    destroyed() {
        // alert('1')
    },
    beforeRouteLeave (to, from, next) {
        console.log(to);    
        console.log(from);
        if(to.name=='ChildInfoUpdate'||to.name=='PaymentSubjectList'||to.name=='EditFamilyMember'){
            
        }else{
            // console.log(this.$vnode.parent.componentInstance.cache)
            this.$vnode.parent.componentInstance.cache = {};
        }
        next();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs',
            'closeLeft'
        ]),
        allNum(){
            let num = this.allChildList.length;
            return "总人数："+num+"人";
        }
    },
    watch:{
        
    },
    methods:{
        getHeaderCellClass({row, column, rowIndex, columnIndex}) {
            return "note-attendance-height note-attendance-bg-blue"
        },
        getSettingValue(){
            let setting = 'FEE_ATTENDANCE_LINKAGE';
            getSettingValue(setting).then((result)=>{
                let settingValue = result.data[setting];
                if(settingValue=="1"||settingValue=="4"){
                    this.canSetPaymentSubject = true;
                }
                console.log(settingValue);
            }).catch(()=>{
                alertError(this,"1211");
            });
        },
        getClasses(){
            let staffID = this.userInfo.userStaffID;
            getClasses(staffID).then((result)=>{
                this.myAllClasses = result.data.data;
            }).catch((err)=>{
                alertError(this,"1002");
            });
        },
        // 根据状态获取所有班级
        getClassesByStatus(){
            let staffID = this.userInfo.userStaffID;
            this.formInline.selectInput = "";
            let loading = showLoading();
            getClassesByStatus(staffID,this.formInline.radio).then((result)=>{
                this.formInline.classList = result.data.data;
                if(result.data.data.length>0){
                    this.formInline.classID = result.data.data[0].ID;
                    this.getChildsByClassID(loading);
                }else{
                    closeLoading(loading);
                    this.formInline.classID = "";
                    this.allChildList = [];
                }
            }).catch((err)=>{
                alertError(this,"1028");
            });
        },
        // 重新加载列表
        reloadList(clearSelect){
            if(clearSelect){
                this.formInline.selectInput = "";
            }
            let loading = showLoading();
            this.getChildsByClassID(loading);
        },
        getChildsByClassID(loading){
            getChildsByClassID(this.formInline.classID,this.formInline.selectInput).then((result)=>{
                if(loading){
                    closeLoading(loading);
                }
                this.allChildList = result.data.data;
                if(this.allChildList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                alertError(this,"1003");
            });
        },
        // 点击跳转到设置缴费科目页面
        setPaymentSubject(){
            this.$router.push(this.$route.fullPath+"/paymentSubject");
        },
        // 点击删除弹出删除框
        clickDelete(item){
            this.dialogVisible = true;  
            this.clickItem = item;
        },
        // 删除幼儿
        confirmDelete(){
            this.dialogVisible = false;
            let childID = this.clickItem.Id;
            let staffID = this.userInfo.userStaffID;
            delChild(staffID,childID).then((result)=>{
                if(result.data.ret == "1"){
                    this.$message({
                        message:"删除成功",
                        type:"success"
                    });
                    this.reloadList();
                }else if(result.data.ret == "2"){
                    this.$message.error({
                        message:"该幼儿无法删除",
                    });
                }else if(result.data.ret == "0"){
                    this.$message.error({
                        message:"删除失败",
                    });
                }
            }).catch((err)=>{
                alertError(this,"2086");
            });
        },
        // 查看学籍
        childRecord(item){
            this.clickItem = item;
            let childID = this.clickItem.Id;
            this.childRecordList = [];
            getChildRecord(childID).then((result)=>{
                this.childRecordList = result.data.data;
                this.recordDialogVisible = true;
            }).catch((err)=>{
                alertError(this,"1058");
            });
        },
        clickChangeClass(item){
            this.clickItem = item.item;
            this.changeClassTitle = item.title;
            this.changeClassForm.changeClassID = "";
            this.changeClassForm.turnDate = "";
            this.changeClassDialogVisible = true;
        },
        // 转班
        changeClass(){
            let changeClassID = this.changeClassForm.changeClassID;
            let turnDate = this.changeClassForm.turnDate;
            let childID = this.clickItem.Id;
            let nowClassID = this.formInline.classID;
            
            if(changeClassID==""){
                this.$message.error({
                    message:"请选择班级"
                });
                return;
            }
            if(turnDate==""){
                this.$message.error({
                    message:"请选择转班日期"
                });
                return;
            }
            this.changeClassDialogVisible = false;
            changeClass(childID,nowClassID,changeClassID,turnDate).then((result)=>{
                if(result.data.ret=="1"){
                    this.$message({
                        message:"转班成功",
                        type:"success"
                    });
                    this.reloadList();
                }else{
                    this.$message.error({
                        message:"转班失败"
                    });
                }
            }).catch((err)=>{
                alertError(this,"2021");
            });
        },
        clickQuitSchool(item){
            this.clickItem = item;
            this.changeClassForm.remark = "";
            this.changeClassForm.turnDate = "";
            this.quitSchoolDialogVisible = true;  
        },
        // 退学
        quitSchool(){
            let childID = this.clickItem.Id;
            let classID = this.formInline.classID;
            let turnDate = this.quitSchoolForm.turnDate;
            let remark = this.quitSchoolForm.remark;
            if(turnDate==""){
                this.$message.error({
                    message:"请选择退学日期"
                });
                return;
            }
            this.quitSchoolDialogVisible = false;
            quitSchool(childID,classID,turnDate,remark).then((result)=>{
                if(result.data.ret=="1"){
                    this.$message({
                        message:"退学成功",
                        type:"success"
                    });
                    this.reloadList();
                }else{
                    this.$message.error({
                        message:"退学失败"
                    });
                }
            }).catch((err)=>{
                alertError(this,"2035");
            });
        },
        // 导出Excel
        export2Excel(){
            let data = [];
            let tableTitle = "";
            for(let i=0;i<this.formInline.classList.length;i++){
                if(this.formInline.classList[i].ID==this.formInline.classID){
                    tableTitle = this.formInline.classList[i].ClassName + "班级人员";
                }
            }
            // header
            data.push([
                {
                    value:tableTitle,
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
            // time
            let currDateObj = new Date();
            let dateStr = currDateObj.getFullYear()+"-"+(Array(3).join(0)+(currDateObj.getMonth()+1)).slice(-2)+"-"+(Array(3).join(0)+currDateObj.getDate()).slice(-2);
            data.push([
                {
                    value:"导出日期："+dateStr,
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
            // title
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
            titleArray.push({ 
                value:"学号",
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
            titleArray.push({ 
                value:"姓名",
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
            titleArray.push({ 
                value:"出生年月",
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
            titleArray.push({ 
                value:"性别",
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
            titleArray.push({ 
                value:"民族",
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
            titleArray.push({ 
                value:"通知人",
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
            titleArray.push({ 
                value:"通知手机",
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
            titleArray.push({ 
                value:"保险失效日期",
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
            data.push(titleArray);
            // content
            for(let i=0;i<this.allChildList.length;i++){
                let childObj = this.allChildList[i];
                let contentArray = [{
                    value:i+1,
                    type:"content",
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
                },{
                    value:childObj.ChildNum,
                    type:"content",
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
                },{
                    value:childObj.ChildName,
                    type:"content",
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
                },{
                    value:childObj.ChildBirthday.split(" ")[0],
                    type:"content",
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
                },{
                    value:childObj.ChildSex=='0'?'男':'女',
                    type:"content",
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
                },{
                    value:childObj.ChildNation,
                    type:"content",
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
                },{
                    value:childObj.ConnectPeople,
                    type:"content",
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
                },{
                    value:childObj.ConnectPhone,
                    type:"content",
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
                }]
                let date = childObj.InsuranceExpiryDate.split(" ")[0]=='1900-01-01'?'':childObj.InsuranceExpiryDate.split(" ")[0];
                let json = {
                    value:date,
                    type:"content",
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
                if(date){
                    let dateObj = new Date(parseInt(date.split("-")[0]),parseInt(date.split("-")[1])-1,parseInt(date.split("-")[2]));
                    let dateTime = dateObj.getTime();
                    if(new Date().getTime()>dateTime){//失效
                        json.style.fill = { fgColor:{ rgb: "AAAAAA" } };
                    }
                }
                contentArray.push(json);
                data.push(contentArray);
            }
            let concat = 9;
            let merges = [ {s:{c:0, r:0}, e:{c:concat-1, r:0}},{s:{c:0, r:1}, e:{c:concat-1, r:1}} ];
            let cols = [{ wpx: 30 },{ wpx: 50 },{ wpx: 60 },{ wpx: 70 },{ wpx: 30 },{ wpx: 70 },{ wpx: 60 },{ wpx: 90 },{ wpx: 90 }];
            let Sheets = {
                'Sheet1':data2Workbook(data,merges,cols)
            };
            export_json_to_excel(['Sheet1'],Sheets,tableTitle);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.childInfo{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .staffInfo{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.childInfoList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
.forthInfoList{
    grid-template-columns: 25% 25% 25% 25%;
}
@media screen and (max-width: 1120px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
    .forthInfoList{
        grid-template-columns: 33.3% 33.3% 33.3%;
    }
}
@media screen and (max-width: 960px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
    .forthInfoList{
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 690px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
    .forthInfoList{
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}

</style>