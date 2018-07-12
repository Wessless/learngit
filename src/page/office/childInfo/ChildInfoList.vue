<template>
    <div class="childInfo">
        <chat-header :showBack="true" :title="'幼儿信息'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="formInline.classID" filterable size="medium" placeholder="请选择班级">
                        <el-option
                        v-for="item in formInline.classList"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID"
                            @change="reloadList">
                        </el-option>
                    </el-select>
                    <!-- <el-checkbox>显示离职人员</el-checkbox> -->
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
        </div>
        <div class="childInfoList">
            <child-info-item v-for="(item,index) in allChildList" :key="index" :item="item" :type="formInline.radio" @clickDelete="clickDelete" @childRecord="childRecord" @changeClass="clickChangeClass" @quitSchool="clickQuitSchool" @changeClassBack="clickChangeClass"></child-info-item>
        </div>
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
            <el-table :data="childRecordList" border style="width: 100%">
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

import { getChildsByClassID,getClasses,getClassesByStatus,delChild,getChildRecord,changeClass,quitSchool } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import childInfoItem from '@/page/office/childInfo/ChildInfoItem'

export default {
    name: 'ChildInfo',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
                radio:"0"
            },
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
        ChatHeader,
        childInfoItem
    },
    mounted(){
        this.getClassesByStatus();
        this.getClasses();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        allNum(){
            let num = this.allChildList.length;
            return "总人数："+num+"人";
        }
    },
    watch:{
        
    },
    methods:{
        getClasses(){
            let staffID = this.userInfo.userStaffID;
            getClasses(staffID).then((result)=>{
                this.myAllClasses = result.data.data;
            });
        },
        // 根据状态获取所有班级
        getClassesByStatus(){
            let staffID = this.userInfo.userStaffID;
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
            });
        },
        // 重新加载列表
        reloadList(){
            let loading = showLoading();
            this.getChildsByClassID(loading);
        },
        getChildsByClassID(loading){
            getChildsByClassID(this.formInline.classID).then((result)=>{
                if(loading){
                    closeLoading(loading);
                }
                this.allChildList = result.data.data;
            });
        },
        // 点击删除弹出删除框
        clickDelete(item){
            this.dialogVisible = true;  
            this.clickItem = item
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
            });
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
@media screen and (max-width: 1120px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}

</style>