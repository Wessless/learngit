<template>
    <div class="interertClassChild">
        <chat-header :showBack="true" :title="'兴趣班幼儿管理'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="formInline.classID" @change="reloadList" style="margin-left:10px;" filterable size="medium" placeholder="请选择兴趣班">
                        <el-option
                        v-for="item in formInline.InterestClassArr"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                   <label class="startClass_label">{{allNum}}</label>
                </el-form-item>
                <el-form-item>
                    <el-radio v-model="formInline.radio" label="0" @change="getIClass" style="margin-left:20px;">进行中</el-radio>
                    <el-radio v-model="formInline.radio" label="1" @change="getIClass" style="margin-left:20px;">已结束</el-radio>
                </el-form-item>
                <el-form-item>
                   <label class="startClass_label">开班日期：{{BeginDate}}</label>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addChild">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="employTeacherList">
            <Interest-Class-Child-item v-for="item in employTeacherList" :key="item.num" :item="item" :iClassID="formInline.classID" @clickDelete="clickDelete" @clickQuit="clickQuit"></Interest-Class-Child-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该学员</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="statusDialogVisible"
            width="30%">
            <el-form :model="formInline" label-width="70px">
                <el-form-item label="退班日期"  style="width:100%">
                    <el-date-picker
                        v-model="formInline.quitDate"
                        size="small"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :placeholder="'选择日期'"
                        >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="statusDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmStatus">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getChildrenByIClassID,getIClass,getIClassByID,deleteIClassChild,quitClass } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import InterestClassChildItem from '@/page/office/interestClassChild/InterestClassChildItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'interertClassChild',
    data(){
        return {
            formInline:{
                InterestClassArr:[],
                classID:"",
                radio:"0",
                quitDate:"",
            },
            isDisabled:false,
            employTeacherList:[],
            pageNo:1,
            pageSize:1000,
            isNoData:false,
            dialogVisible:false,
            statusDialogVisible:false,
            item:"",
            BeginDate:"",
            clickItem:[],
        }
    },
    components:{
        NoData,
        ChatHeader,
        InterestClassChildItem
    },
    mounted(){
        this.getIClass();
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
        allNum(){
            let num = this.employTeacherList.length;
            return "总人数："+num+"人";
        },
    },
    watch:{
        
    },
    methods:{
        reloadList(){
            let loading = showLoading();
            this.getChildrenByIClassID(loading);
        },
        getChildrenByIClassID(loading){
            let staffID = this.userInfo.userStaffID;
            getChildrenByIClassID(this.pageNo,this.pageSize,staffID,this.formInline.classID).then((result)=>{
                this.employTeacherList = result.data.data;
                if(this.employTeacherList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            })
            // .catch((err)=>{
            //     alertError(this,"1003");
            // });
            getIClassByID(this.formInline.classID).then((result)=>{
                if(loading){
                    closeLoading(loading);
                }
                let BeginDate = result.data.BeginDate.split(" ")[0];
                this.BeginDate = BeginDate;
            })
        },
        getIClass(){
            let staffID = this.userInfo.userStaffID;
            let endFlag = this.formInline.radio;
            let loading = showLoading();
            // pageNo,pageSize,staffID,endFlag
            getIClass(this.pageNo,this.pageSize,staffID,endFlag).then((result)=>{
                this.formInline.InterestClassArr = result.data.data;
                if(result.data.data.length>0){
                    this.formInline.classID = result.data.data[0].ID;
                    let BeginDate = result.data.data[0].BeginDate.split(" ")[0];
                    this.BeginDate = BeginDate;
                    this.employTeacherList = [];
                    this.getChildrenByIClassID(loading);
                }else{
                    closeLoading(loading);
                    this.formInline.classID = "";
                    this.BeginDate = "";
                    this.employTeacherList = [];
                }
            })
        },
        addChild(){
            let classID = this.formInline.classID;
            this.$router.push(this.$route.fullPath+"/add/"+classID);
        },
        clickDelete(item){
            this.dialogVisible = true;
            this.clickItem = item;
        },
        confirmDelete(){
            this.dialogVisible = false;
            let classID = this.formInline.classID;
            let childID = this.clickItem.ID;
            let loading = showLoading();
            deleteIClassChild(classID,childID).then((result)=>{
                closeLoading(loading);
                if(result.data.Result==1){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getChildrenByIClassID();
                }else{
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                }
            })
        },
        clickQuit(item){
            this.statusDialogVisible = true;
            this.clickItem = item;
        },
        confirmStatus(){
            this.statusDialogVisible = false;
            let classID = this.formInline.classID;
            let childID = this.clickItem.ID;
            let quitDate = this.formInline.quitDate;
            // console.log(quitDate)
            let loading = showLoading();
            quitClass(classID,childID,quitDate).then((result)=>{
                closeLoading(loading);
                if(result.data.Result==1){
                    this.$message({
                        message: '退班成功',
                        type: 'success'
                    });
                    this.getChildrenByIClassID();
                }else{
                    this.$message({
                        message: '退班失败',
                        type: 'error'
                    });
                }
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interertClassChild{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .interertClassChild{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.employTeacherList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .employTeacherList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .employTeacherList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.startClass_label{
    color: #c0c4cc;
    font-weight: normal;
    margin-left: 10px;
}
</style>