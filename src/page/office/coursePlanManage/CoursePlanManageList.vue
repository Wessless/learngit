<template>
    <div class="interestClassTeacher">
        <chat-header :showBack="true" :title="'教案管理'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns"></div>
        <no-data :isShow="isNoData"></no-data>
        <div class="coursePlanList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Course-Plan-Manage-item v-for="item in coursePlanList" :key="item.num" :item="item" @clickSubmit="clickSubmit" @clickReSubmit="clickReSubmit" @clickClear="clickClear" @clickEdit="clickEdit"></Course-Plan-Manage-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="clearDialogVisible"
            width="30%">
            <span>是否清空该教学主题</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clearDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmClear">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="submitDialogVisible"
            width="30%">
            <span>是否提交该教学主题</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="submitDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="resubmitDialogVisible"
            width="30%">
            <span>是否再次提交该教学主题</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resubmitDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmReSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="editDialogVisible"
            width="30%">
            <el-form :model="form" label-width="70px">
                <el-form-item :label="'编辑方式'">
                    <el-radio v-model="form.radio" label="0" style="margin-left:20px;">从头创建</el-radio>
                    <el-radio v-model="form.radio" label="1" style="margin-left:20px;">从园所主题库复制</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getCoursePlanList,confirmCourse,reconfirmCourse,cleanCourseTheme } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import CoursePlanManageItem from '@/page/office/coursePlanManage/CoursePlanManageItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'interestClassTeacher',
    data(){
        return {
            form:{
                radio:"0",
            },
            isDisabled:false,
            coursePlanList:[],
            currentPage:1,           
            pageSize:10,
            clearDialogVisible:false,
            submitDialogVisible:false,
            editDialogVisible:false,
            resubmitDialogVisible:false,
            clickItem:{},
            isNoData:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
        CoursePlanManageItem
    },
    mounted(){
        
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
    },
    watch:{
        
    },
    methods:{
        loadList(reload){
            let staffId = this.userInfo.userStaffID;
            // staffID = "0";
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getCoursePlanList(staffId,this.currentPage,this.pageSize).then((result)=>{
                    if(reload){
                        this.coursePlanList = [];
                    }
                    // console.log(result)
                    if(result.data.totalcount<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        this.coursePlanList.push(result.data.data[i]);
                    }
                    if(this.coursePlanList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                });
            }
        },
        clickClear(item){
            this.clearDialogVisible = true;
            this.clickItem = item;
        },
        clickSubmit(item){
            this.submitDialogVisible = true;
            this.clickItem = item;
        },
        clickReSubmit(item){
            this.resubmitDialogVisible = true;
            this.clickItem = item;
        },
        clickEdit(item){
            if (item.ID==null) {
                this.editDialogVisible = true;
            }else{
                this.$router.push(this.$route.fullPath+"/edit/"+item.ID+'&'+item.CourseID);
            }
            // console.log(item)
            this.clickItem = item;
        },
        confirmClear(){
            this.clearDialogVisible = false;
            let CourseID = this.clickItem.CourseID;
            let ThemeID = this.clickItem.ThemeID;
            let loading = showLoading();
            cleanCourseTheme(CourseID,ThemeID).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"清空成功",
                        type:"success"
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message:"提交失败",
                    });
                }
            })
            // .catch((err)=>{
            //     alertError(this,"2146");
            // });
        },
        confirmSubmit(){
            this.submitDialogVisible = false;
            let id = this.clickItem.ID;
            let loading = showLoading();
            confirmCourse(id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"提交成功",
                        type:"success"
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message:"提交失败",
                    });
                }
                // .catch((err)=>{
                //     alertError(this,"2146");
                // });
            });
        },
        confirmReSubmit(){
            this.resubmitDialogVisible = false;
            let id = this.clickItem.ID;
            let loading = showLoading();
            reconfirmCourse(id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"再提交成功",
                        type:"success"
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message:"再提交失败",
                    });
                }
                // .catch((err)=>{
                //     alertError(this,"2146");
                // });
            });
        },
        confirmEdit(){
            this.editDialogVisible = false;
            let id = this.clickItem.ID;
            if (this.form.radio == "0") {
                this.$router.push(this.$route.fullPath+"/add/"+this.clickItem.ThemeID+"&"+this.clickItem.CourseID);
            }else if(this.form.radio == "1"){
                this.$router.push(this.$route.fullPath+"/"+this.clickItem.ThemeID+"&"+this.clickItem.CourseID);
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interestClassTeacher{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .interestClassTeacher{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.coursePlanList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .coursePlanList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .coursePlanList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}

</style>