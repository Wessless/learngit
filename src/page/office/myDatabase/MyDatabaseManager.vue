<template>
    <div class="templateDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="$route.meta.type!='detail'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirmAdd"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="资料库名称">
                <el-input v-model="form.databaseName" size="small" style="width:400px;" placeholder="请输入资料库名称"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="浏览权限">
                <el-select v-model="form.readArr" multiple size="small" placeholder="请选择浏览权限人" style="width:400px;" >
                    <el-option
                    v-for="item in allStaff"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="修改权限">
                <el-select v-model="form.writeArr" multiple size="small" placeholder="请选择修改权限人" style="width:400px;" >
                    <el-option
                    v-for="item in allStaff"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getknowledgebase,addKnowledgeBase,setknowledgebase } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'ClassManagementDetail',
    data(){
        return {
            title:"",
            form: {
                databaseName:"",
                readArr:[],
                writeArr:[],
            },
            disabledChangeName:false,
            allStaff:[],
            dialogVisible:false,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        // this.loadDetail();
        // this.title = "资料库管理";
        if(this.$route.meta.type=="add"){
            this.title = "添加资料库";
            this.form.readArr.push(this.userInfo.userStaffID);
            this.form.writeArr.push(this.userInfo.userStaffID);
            // this.getClassNum();
        }else if(this.$route.meta.type=="update"){
            this.title = "修改资料库";
            this.getknowledgebase();
        }
        this.allStaff = this.allStaffs;
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
        getknowledgebase(){
            let id = this.$route.params.KnowledgeBaseID; 
            let loading = showLoading();
            getknowledgebase(id).then((result)=>{
                closeLoading(loading);
                this.form.databaseName = result.data.BaseName;
                this.form.readArr = result.data.EnBrowse.split(",");
                this.form.writeArr = result.data.EnModify.split(",");
            }).catch((err)=>{
                alertError(this,"1027");
            });
        },
        confirmAdd(){
            if(this.$route.meta.type=="add"){
                this.confirm();
            }else{
                this.confirm();
            }
        },
        // 点击确认保存模板
        confirm(){
            let baseName = this.form.databaseName;
            if(baseName.trim()==""){
                this.$message.error({
                    message : "请输入资料库名称！"
                });
                return;
            }

            let type = "";
            let id = '-1';
            if(this.$route.meta.type=="add"){
                type = "添加";
            }else if(this.$route.meta.type=="update"){
                type = "修改";
                id = this.$route.params.KnowledgeBaseID;
            }
            let loading = showLoading();
            console.log(id,this.userInfo.userStaffID,this.userInfo.userName,baseName,"0","")
            addKnowledgeBase(id,this.userInfo.userStaffID,this.userInfo.userName,baseName,"0","")
            .then((result)=>{
                console.log(result);
                if(result.data.Result=="0"){
                    closeLoading(loading);
                    this.$message.error({
                        message : result.data.Msg
                    });
                    return new Promise((resolve,reject)=>{
                        resolve()
                    })
                }else{
                    return setknowledgebase(result.data.Result,this.form.readArr.join(","),this.form.writeArr.join(","))
                }
            })
            .then((result)=>{
                console.log(result)
                if(result){
                    closeLoading(loading);
                    if(result.data.Result=="1"){
                        this.$message({
                            message : type + "成功",
                            type : "success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message({
                            message : type + "失败",
                            type : "error"
                        });
                    }
                }
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"2127/2130");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.templateDetail{
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
.examineProject{
    width:100%;
    margin-top:20px; 
    padding-top:20px;
    margin-left:10px;
    border-top: 1px solid #666666;
}
.topLine{
    display: flex;
    flex-direction: row;
    margin-bottom:10px;
}
.topLine > .title{
    display: flex;
    align-items: center;
    margin-right: 5px;
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
.grayColor{
    height: 100%;
    width:100%;
    display: flex;
    align-items: center;
    /* padding-left: 10px; */
    color: #888;
    display: inline-block;
}
.element-icon{
    font-family: element-icons !important;
    /* speak: none; */
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
}
.avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    position: absolute;
}
.avatar-uploader-icon:before {
    content: "\E62B";
    z-index: 1;
}
.avatar {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 5px;
    display: block;
    margin:5px 0;
    background:#ffffff;
    overflow: hidden;
    cursor: pointer;
}
.avatar:hover{
    border: 1px dashed #38adff;
}
.avatar > img {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 5;
}
</style>