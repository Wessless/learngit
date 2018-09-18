<template>
    <div class="interestClassTeacher">
        <chat-header :showBack="true" :title="'教案审批'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns"></div>
        <no-data :isShow="isNoData"></no-data>
        <div class="coursePlanList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Course-Plan-Examine-item v-for="item in coursePlanList" @clickInstorage="clickInstorage" :key="item.num" :item="item"></Course-Plan-Examine-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="DialogVisible"
            width="30%">
            <span>是否将该教案放入主题库</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="DialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmInstorage">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getCourseThemeMessage,addToDataBase } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import CoursePlanExamineItem from '@/page/office/coursePlanExamine/CoursePlanExamineItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'interestClassTeacher',
    data(){
        return {
            isDisabled:false,
            coursePlanList:[],
            currentPage:1,           
            pageSize:10,
            DialogVisible:false,
            clickItem:{},
            isNoData:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
        CoursePlanExamineItem
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
                getCourseThemeMessage(staffId,this.currentPage,this.pageSize).then((result)=>{
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
        clickInstorage(item){
            this.DialogVisible = true;
            this.clickItem = item;
        },
        confirmInstorage(){
            this.DialogVisible = false;
            let CourseThemeID = this.clickItem.ID;
            let ddlThemeDataType = this.clickItem.ThemeDataType;
            let loading = showLoading();
            addToDataBase(CourseThemeID,ddlThemeDataType).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"放入主题库成功",
                        type:"success"
                    });
                }else{
                    this.$message({
                        message:"放入主题库失败",
                        type:"error"
                    });
                }
            })
            // .catch((err)=>{
            //     alertError(this,"2146");
            // });
        },
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