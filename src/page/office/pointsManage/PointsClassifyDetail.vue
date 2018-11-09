<template>
    <div class="PointsClassifyDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="名称">
                <el-input v-model="form.TypeName" size="small" clearable style="width:400px;" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="分类">
                <el-radio v-model="form.Type" label="A">A分</el-radio>
                <el-radio style="margin-left:20px;" v-model="form.Type" label="B">B分</el-radio>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getAllCreditType,addCreditType } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'PointsClassifyDetail',
    data(){
        return {
            title:"",
            form: {
                TypeName:"",
                Type:"A",
            },
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="add"){
            this.title = "添加积分分类";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改积分分类";
            this.getAllCreditType();
        }
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
        // 点击确认保存模板
        confirm(){
            let staffID = this.userInfo.userStaffID;
            let id = "";
            if (this.$route.meta.type=="update") {
                id = this.$route.params.classifyID;
            }
            let typeName = this.form.TypeName;
            let type = this.form.Type;

            if(typeName==""){
                this.$message.error({
                    message:"请输入名称"
                });
                return;
            }
            let loading = showLoading();
            addCreditType(staffID,id,typeName,type).then((result)=>{
                closeLoading(loading);
                if(this.$route.meta.type=="update"){
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"修改成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"修改失败"
                        });
                    }
                }else{
                     if(result.data.Result=='1'){
                        this.$message({
                            message:"添加成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"添加失败"
                        });
                    }
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2135");
            });
        },
        getAllCreditType(){
            let classifyID = this.$route.params.classifyID;
            getAllCreditType(1,1000,"-1").then((result)=>{
                let arr = result.data.data;
                for (let i = 0; i < arr.length; i++) {
                    if (classifyID==arr[i].ID) {
                        this.form.TypeName = arr[i].TypeName;
                        this.form.Type = arr[i].Type;
                    }
                }
            }).catch((err)=>{
                alertError(this,"1205");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.PointsClassifyDetail{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    padding-top:74px;
    position: relative;
}
.el-form-item {
    margin-bottom: 0px;
}
.el-input__inner:disabled{
    color:#606266 !important;
}
.redColor{
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: red;
    display: inline-block;
}
</style>