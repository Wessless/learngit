<template>
    <div class="addNewChild">
        <chat-header :showBack="true" :title="'新生录入'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addChild">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="childInfoList">
            <child-info-item v-for="(item,index) in allChildList" :key="index" :item="item" :type="formInline.radio" :isAddChild="true" @clickDelete="clickDelete"></child-info-item>
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
    </div>
</template>

<script>

import { getChildsByClassID,getClasses,getClassesByStatus,delChild } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import childInfoItem from '@/page/office/childInfo/ChildInfoItem'

export default {
    name: 'AddNewChild',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
                radio:"-2"
            },
            dialogVisible:false,
            clickItem:{},
            allStaffList:[],
            allChildList:[],
        }
    },
    components:{
        ChatHeader,
        childInfoItem
    },
    mounted(){
        // this.getClassesByStatus();
        // this.getChildsByClassID(loading);
        this.reloadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ])
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
            getChildsByClassID('-2').then((result)=>{
                if(loading){
                    closeLoading(loading);
                }
                this.allChildList = result.data.data;
            });
        },
        // 添加幼儿
        addChild(){
            this.$router.push(this.$route.fullPath+"/add");
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
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.addNewChild{
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