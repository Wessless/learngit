<template>
    <div class="templateDetail smallTableHeight">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="100px" style="width:100%;">
            <!-- <el-form-item label="现有角色">
                <el-select v-model="form.currRole" size="small" placeholder="">
                    <el-option
                    v-for="item in roleSettingList"
                    :key="item.roleId"
                    :label="item.roleNm"
                    :value="item.roleId">
                    </el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="新角色">
                <el-input v-model="form.newRole" size="small" style="width:400px;" placeholder="请输入角色名"></el-input>
                <!-- <el-checkbox v-model="form.isCopy" style="margin-left:10px;">拷贝选中的现有角色权限</el-checkbox> -->
            </el-form-item>
            <!-- <el-form-item label="编号">
                <el-input v-model="form.number" size="small" style="width:400px;" placeholder="请输入编号"></el-input>
            </el-form-item> -->
        </el-form>
    </div>
</template>

<script>

import { addRoleSet,roleList,findRoleByID,addOrUpdateRoleSet } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'RoleSettingDetail',
    data(){
        return {
            title:"",
            form: {
                currRole:"",
                newRole:"",
                number:"",
                isCopy:false,
            },
            roleSettingList:[]
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="add"){
            this.title = '添加角色';
        }else{
            this.title = '修改角色';
            this.findRoleByID();
        }
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
        findRoleByID(){
            let id = this.$route.params.roleID;
            let loading = showLoading();
            findRoleByID(id).then((result)=>{
                closeLoading(loading);
                this.form.newRole = result.data.RoleName;
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1303");
            });
        },
        roleList(){
            let loading = showLoading();
            roleList().then((result)=>{
                closeLoading(loading);
                this.roleSettingList = result.data.data;
                if(result.data.data.length>0){
                    this.form.currRole = result.data.data[0].roleId;
                }
            }).catch((err)=>{
                alertError(this,"1302");
            });
        },
        // 点击确认保存模板
        confirm(){
            
            let PostNm = this.form.newRole;
            let Num = this.form.number;
            // let cbCopyRole = this.form.isCopy?"1":"0";
            // let roleSelectId = this.form.currRole;
            let id = "-1";
            if(this.$route.meta.type=="update"){
                id = this.$route.params.roleID;
            }
            if(PostNm.trim()==""){
                this.$message.error({
                    message:"请输入新角色名称！"
                });
				return false;
            }
            // if(Num.trim()==""){
            //     this.$message.error({
            //         message:"请输入编号！"
            //     });
			// 	return false;
            // }
            // let reg = /^\d{10}$/
            // if(!reg.test(Num)){
            //     this.$message.error({
            //         message:"编号应为10位数字！"
            //     });
			// 	return false;
            // }
            let loading = showLoading();
            addOrUpdateRoleSet(id,PostNm)
            .then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message : "添加成功",
                        type : "success"
                    }); 
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message : result.data.Msg
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2193");
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
.ddlBlock{
    display:flex;
    width: 100%;
    border:1px solid #dddddd;
    padding:10px;
    margin-bottom:10px;
    flex-direction: column;
}
.blockItem{
    display: flex;
    height:40px;
    align-items: center;
    padding:5px 0;
}
.gray{
    color: #AAAAAA;
}
.blockTitle{
    width:100px;
    display: inline-block;
    text-align: right;
    padding-right: 20px;
    color: #333 !important;
}
</style>