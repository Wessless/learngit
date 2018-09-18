<template>
    <div class="childInfo">
        <chat-header :showBack="true" :title="'蜂堡绑定'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="formInline.classID" filterable size="medium" placeholder="请选择班级" @change="reloadList">
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
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="childInfoList">
            <child-info-item v-for="(item,index) in allChildList" :key="index" :item="item" :type="formInline.radio" :isBeeBind="true" @sendMessage="sendMessageClick"></child-info-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否向该幼儿发送短信</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sendMessage">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getClassesByStatus,getRegisterChildren,sendRegisterChildren } from '@/js/api'
import { showLoading,closeLoading ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import childInfoItem from '@/page/office/childInfo/ChildInfoItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'BeeBind',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
                radio:"0"
            },
            isNoData:false,
            pageNo:1,
            pageSize:100,
            dialogVisible:false,
            changeClassDialogVisible:false,
            quitSchoolDialogVisible:false,
            recordDialogVisible:false,
            clickItem:{},
            allStaffList:[],
            allChildList:[],
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
        ChatHeader,
        childInfoItem
    },
    mounted(){
        this.getClassesByStatus();
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
        // 根据状态获取所有班级
        getClassesByStatus(){
            let staffID = this.userInfo.userStaffID;
            let loading = showLoading();
            getClassesByStatus(staffID,this.formInline.radio).then((result)=>{
                this.formInline.classList = result.data.data;
                if(result.data.data.length>0){
                    this.formInline.classID = result.data.data[0].ID;
                    this.getRegisterChildren(loading);
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
        reloadList(){
            let loading = showLoading();
            this.getRegisterChildren(loading);
        },
        getRegisterChildren(loading){
            let staffID = this.userInfo.userStaffID
            getRegisterChildren(this.pageNo,this.pageSize,staffID,this.formInline.classID).then((result)=>{
                if(loading){
                    closeLoading(loading);
                }
                console.log(result)
                this.allChildList = result.data.data;
                if(this.allChildList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            });
        },
        sendMessageClick(item){
            this.clickItem = item;
            this.dialogVisible = true;
        },
        sendMessage(){
            let childID = this.clickItem.ID;
            let classID = this.formInline.classID;
            this.dialogVisible = false;
            sendRegisterChildren(childID,classID).then((result)=>{
                if(result.data.Result=="1"){
                    this.$message({
                        message:"发送成功",
                        type:"success"
                    });
                    this.reloadList();
                }else{
                    this.$message.error({
                        message:"发送成功"
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