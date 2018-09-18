<template>
    <div class="expense">
        <chat-header :showBack="true" :title="'角色定义'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <!-- <el-form-item>
                    <el-radio v-model="formInline.radio" label="0" style="margin-left:20px;" @change="roleList">使用中</el-radio>
                    <el-radio v-model="formInline.radio" label="1" style="margin-left:20px;" @change="roleList">已删除</el-radio>
                </el-form-item> -->
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="addRole">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="roleSettingList">
            <role-setting-item v-for="(item,index) in roleSettingList" :key="index" :item="item" @clickDelete="clickDelete"></role-setting-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该角色</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { roleList,deleteRoleSet } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import RoleSettingItem from '@/page/office/roleSetting/RoleSettingItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'RoleSetting',
    data(){
        return {
            formInline: {
                radio:"0"
            },
            isNoData:false,
            roleSettingList:[],
            dialogVisible: false,
            clickItem:null,
            currPage:1,
            pageSize:1000
        }
    },
    components:{
        NoData,
        ChatHeader,
        RoleSettingItem
    },
    mounted(){
        this.roleList();
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
        addRole(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        roleList(){
            let loading = showLoading();
            roleList().then((result)=>{
                closeLoading(loading);
                // for(let i=0;i<result.data.data.length;i++){
                //     if(result.data.data[i].ClassNum=="-1"){
                //         result.data.data.splice(i,1);
                //     }
                // }
                this.roleSettingList = result.data.data;
                if(this.roleSettingList.length==0){
                    this.isNoData = true;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                alertError(this,"1302");
            });
        },
        // 删除
        clickDelete(item){
            this.dialogVisible = true;  
            this.clickItem = item;
        },
        // 确认删除
        confirmDelete(){
            let id = this.clickItem.roleId;
            let loading = showLoading();
            deleteRoleSet(id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message:'删除成功',
                        type:'success'
                    });
                    this.roleList();
                }else{
                    this.$message.error({
                        message:result.data.Msg,
                    });
                }
            }).catch((err)=>{
                alertError(this,"2191");
            });
            this.dialogVisible = false;  
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.expense{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .roleSettingList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.roleSettingList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .roleSettingList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .roleSettingList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>