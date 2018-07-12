<template>
    <div class="childInfo">
        <chat-header :showBack="true" :title="title" :showRightBtn="false" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <!-- <el-form-item>
                    {{childInfo}}    
                </el-form-item> -->
                <el-form-item style="float:right;">
                    <el-button size="medium" type="primary" @click="addFamilyMember">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="childInfoList">
            <family-member-item v-for="(item,index) in familyList" :key="index" :item="item" @clickDelete="clickDelete"></family-member-item>
            <!-- <child-info-item v-for="(item,index) in allChildList" :key="index" :item="item" @clickDelete="clickDelete"></child-info-item> -->
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该家长吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getChildByChildID,getParentsByChildID,delParent } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import FamilyMemberItem from '@/page/office/childInfo/FamilyMemberItem'

export default {
    name: 'EditFamilyMember',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
            },
            childName:"",
            dialogVisible:false,
            clickItem:{},
            familyList:[],
            multipleSelection:[],
        }
    },
    components:{
        ChatHeader,
        FamilyMemberItem
    },
    mounted(){
        let loading = showLoading();
        let childID = this.$route.params.childID;
        Promise.all([getChildByChildID(childID),getParentsByChildID(childID)]).then((result)=>{
            closeLoading(loading);
            this.familyList = result[1].data.data;
            this.childName = result[0].data.data[0].ChildName;
        }).catch((err)=>{
            closeLoading(loading);
        });
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        title(){
            if(this.childName){
                return this.childName+"的家庭成员";
            }else{
                return "家庭成员";
            }
        },
        childInfo(){
            if(this.childName){
                return this.childName+"的家长信息如下："
            }else{
                return "";
            }
        },
    },
    watch:{
        
    },
    methods:{
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        addFamilyMember(){
            this.$router.push(this.$route.fullPath + "/addFamilyMember");
        },
        clickDelete(item){
            this.dialogVisible = true;  
            this.clickItem = item
        },
        confirmDelete(){
            this.dialogVisible = false;
            let staffID = this.userInfo.userStaffID;
            let parentID = this.clickItem.Id;
            delParent(staffID,parentID).then((result)=>{
                console.log(result)
                if(result.data.ret=="1"){
                    this.$message({
                        message:"删除成功",
                        type:"success"
                    });
                    this.reloadParents();
                }else{
                    this.$message.error({
                        message:"删除失败",
                    });
                }
            })
        },
        reloadParents(){
            let childID = this.$route.params.childID;
            let loading = showLoading();
            getParentsByChildID(childID).then((result)=>{
                closeLoading(loading);
                this.familyList = result.data.data;
            });
        },
        // 点击确认保存模板
        confirm(){
            
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