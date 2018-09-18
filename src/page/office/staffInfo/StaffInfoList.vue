<template>
    <div class="staffInfo">
        <chat-header :showBack="true" :title="'员工信息'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-radio v-model="radio" label="1" @change="staffChange">在职人员</el-radio>
                    <el-radio v-model="radio" label="2" @change="staffChange" style="margin-left:5px;">离职人员</el-radio>
                    <el-radio v-model="radio" label="3" @change="staffChange" style="margin-left:5px;">新同事</el-radio>
                    <!-- <el-checkbox v-model="showNotStaff" @change="staffChange">显示离职人员</el-checkbox> -->
                </el-form-item>
                <!-- <el-form-item>
                    <el-checkbox v-model="showNewStaff" @change="staffChange">显示新同事</el-checkbox>
                </el-form-item> -->
                <el-form-item>
                    <span style="color:#999">{{ allNum }}</span>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addStaff">添加</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="default" size="medium" @click="staffChange">查询</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-input size="medium" v-model="selectContent" style="width:300px;" placeholder="请输入姓名\手机号\员工编号\考勤卡号"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="staffInfoList">
            <staff-info-item v-for="item in allStaffList" :key="item.TemplateID" :item="item" @clickDelete="clickDelete" @clickReset="clickReset"></staff-info-item>
        </div>
        <scroll-top></scroll-top>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该员工</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="resetDialogVisible"
            width="30%">
            <span>是否重置该员工的密码</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="resetPassword">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { delStaff,findAllStaffs,findAllRetiredStaffs,findAllNewStaffs,isStaffDeleteOK,setPasswordOriginal } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ScrollTop from '@/components/chat/ScrollTop'
import staffInfoItem from '@/page/office/staffInfo/StaffInfoItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'StaffInfo',
    data(){
        return {
            radio:'1',
            selectContent:"",
            isNoData:false,
            dialogVisible:false,
            resetDialogVisible:false,
            clickItem:{},
            allStaffList:[],
            showNotStaff:false,
            showNewStaff:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
        ScrollTop,
        staffInfoItem
    },
    mounted(){
        this.staffChange();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        allNum(){
            let num = this.allStaffList.length;
            if(this.radio=="1"){
                return "在职"+num+"人";
            }else{
                return "";
            }
        }
    },
    watch:{
        
    },
    methods:{
        // 添加员工
        addStaff(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        // 导出
        export2Excal(){
            
        },
        staffChange(){
            if(this.radio=='1'){
                this.findAllStaffs();
            }else if(this.radio=='2'){
                this.findAllRetiredStaffs();
            }else if(this.radio=='3'){
                this.findAllNewStaffs();
            }
        },
        findAllStaffs(){
            let allStaffs;
            let loading = showLoading();
            findAllStaffs(this.selectContent).then((result)=>{
                closeLoading(loading);
                allStaffs = result;
                // let isStaffDeletePromiseArray = [];
                // for(let i=0;i<allStaffs.length;i++){
                //     isStaffDeletePromiseArray.push(isStaffDeleteOK(allStaffs[i].StaffID));
                // }
                if(allStaffs){
                    this.allStaffList = allStaffs.data.data;
                }
                if(this.allStaffList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                alertError(this,"1014");
            });
        },
        findAllNewStaffs(){
            let allStaffs;
            let loading = showLoading();
            findAllNewStaffs(this.selectContent).then((result)=>{
                closeLoading(loading);
                allStaffs = result;
                // let isStaffDeletePromiseArray = [];
                // for(let i=0;i<allStaffs.length;i++){
                //     isStaffDeletePromiseArray.push(isStaffDeleteOK(allStaffs[i].StaffID));
                // }
                if(allStaffs){
                    this.allStaffList = allStaffs.data.data;
                }
                if(this.allStaffList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                alertError(this,"1307");
            });
        },
        findAllRetiredStaffs(){
            let allStaffs;
            let loading = showLoading();
            findAllRetiredStaffs(this.selectContent).then((result)=>{
                closeLoading(loading);
                allStaffs = result;
                // let isStaffDeletePromiseArray = [];
                // for(let i=0;i<allStaffs.length;i++){
                //     isStaffDeletePromiseArray.push(isStaffDeleteOK(allStaffs[i].StaffID));
                // }
                if(allStaffs){
                    if(allStaffs.data.data.length>0){
                        this.allStaffList = allStaffs.data.data;
                    }
                }
                if(this.allStaffList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                alertError(this,"1053");
            });
        },
        clickReset(item){
            this.resetDialogVisible = true;  
            this.clickItem = item
        },
        resetPassword(){
            this.resetDialogVisible = false;
            let loading = showLoading();
            let staffID = this.clickItem.StaffID;
            setPasswordOriginal(staffID).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=='1'){
                    this.$message({
                        type:'success',
                        message:result.data.msg+',密码为123456'
                    });
                }else{
                    this.$message({
                        type:'error',
                        message:result.data.msg
                    });
                }
            }).catch((err)=>{
                alertError(this,"2197");
                closeLoading(loading);
            });
        },
        clickDelete(item){
            this.dialogVisible = true;  
            this.clickItem = item
        },
        confirmDelete(){
            this.dialogVisible = false;  
            let staffID = this.clickItem.StaffID;
            let loading = showLoading();
            isStaffDeleteOK(staffID).then((result)=>{
                if(result.data.ret=="1"){
                    delStaff(staffID).then((result)=>{
                        closeLoading(loading);
                        if(result.data.ret==1){
                            this.$message({
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            });
                            this.staffChange();
                        }else{
                            this.$message({
                                showClose: true,
                                message: '删除失败',
                                type: 'error'
                            });
                        }
                    }).catch((err)=>{
                        alertError(this,"2040");
                    });
                }else{
                    closeLoading(loading);
                    this.$message({
                        message: '无法删除该员工'
                    });
                }
            }).catch((err)=>{
                alertError(this,"1069");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.staffInfo{
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
.staffInfoList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .staffInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .staffInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}

</style>