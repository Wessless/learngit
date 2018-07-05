<template>
    <div class="staffInfo">
        <chat-header :showBack="true" :title="'员工信息'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-checkbox v-model="showNotStaff" @change="staffChange">显示离职人员</el-checkbox>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addStaff">添加</el-button>
                    <!-- <el-button type="danger" size="medium">删除</el-button> -->
                    <!-- <el-button size="medium" @click="export2Excal">导出</el-button> -->
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="loadList(true)">查询</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <div class="staffInfoList">
            <staff-info-item v-for="item in allStaffList" :key="item.TemplateID" :item="item" @clickDelete="clickDelete"></staff-info-item>
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
    </div>
</template>

<script>

import { delStaff,findAllStaffs,findAllRetiredStaffs,isStaffDeleteOK } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ScrollTop from '@/components/chat/ScrollTop'
import staffInfoItem from '@/page/office/staffInfo/StaffInfoItem'

export default {
    name: 'StaffInfo',
    data(){
        return {
            dialogVisible:false,
            clickItem:{},
            allStaffList:[],
            showNotStaff:false,
        }
    },
    components:{
        ChatHeader,
        ScrollTop,
        staffInfoItem
    },
    mounted(){
        this.findAllStaffs();
        
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
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
            if(this.showNotStaff){
                this.findAllRetiredStaffs();
            }else{
                this.findAllStaffs();
            }
        },
        findAllStaffs(){
            let allStaffs;
            let loading = showLoading();
            findAllStaffs().then((result)=>{
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
            });
        },
        findAllRetiredStaffs(){
            let allStaffs;
            let loading = showLoading();
            findAllRetiredStaffs().then((result)=>{
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
                            this.findAllStaffs();
                        }else{
                            this.$message({
                                showClose: true,
                                message: '删除失败',
                                type: 'error'
                            });
                        }
                    }).catch((err)=>{
                        closeLoading(loading);
                        this.$message({
                            showClose: true,
                            message: '删除失败',
                            type: 'error'
                        });
                    });
                }else{
                    closeLoading(loading);
                    this.$message({
                        message: '无法删除该员工'
                    });
                }
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