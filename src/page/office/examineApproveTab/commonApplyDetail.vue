<template>
    <div class="commonApplyDetail">
        <!-- <div class="redColor">*必填</div> -->
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="申请内容" class="ReceiveApplyDetail_signatory">
                <el-input v-model="form.applyText" size="small" type="textarea" :rows="4" style="width:600px;padding: 4px 0px 7px 0;" placeholder="请输入申请内容"></el-input>
            </el-form-item>
            <el-form-item label="审批人">
                <el-select v-model="form.approvalUser" multiple size="small" style="width:600px;" placeholder="请选择审批人">
                    <el-option
                        v-for="item in form.approvalUserArr"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
                <!-- <el-checkbox v-model="checked1" style="margin-left:10px;" @change="changeApprovalUserArr">显示离职员工</el-checkbox> -->
            </el-form-item>
            <el-form-item label="抄送人">
                    <el-select v-model="form.ccUser" multiple size="small" style="width:600px;" placeholder="请选择抄送人">
                        <el-option
                            v-for="item in form.ccUserArr"
                            :key="item.StaffID"
                            :label="item.StaffName"
                            :value="item.StaffID">
                        </el-option>
                    </el-select>
                    <!-- <el-checkbox v-model="checked2" style="margin-left:10px;" @change="changeCcUserAr">显示离职员工</el-checkbox> -->
                </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { findAllRetiredStaffs,addExamine } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'InterestClassManageDetail',
    data(){
        return {
            title:"通用申请",
            form: {
                applyText:"",
                approvalUser:"",
                approvalUserArr:[],
                ccUser:"",
                ccUserArr:[]
            },
            checked1:false,
            checked2:false,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        this.form.ccUserArr = this.findAllstaffs;
        this.form.approvalUserArr = this.findAllstaffs;
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        findAllstaffs(){
            let staffs = [];
            for(let i=0;i<this.allStaffs.length;i++){
                let json = {  
                    StaffID:this.allStaffs[i].StaffID,
                    StaffName:this.allStaffs[i].StaffName
                }
                staffs.push(json);
            }
            return staffs;
        },
    },
    watch:{
    },
    methods:{
        // 点击确认保存模板
        confirm(){
            let json = {
                cosNum : this.userInfo.cosNum,
                type : "1",
                applyUser : this.userInfo.userStaffID,
                approvalUser : this.form.approvalUser?this.form.approvalUser.join(","):"",
                ccUser : this.form.ccUser?this.form.ccUser.join(","):"",
                content : "",
                flag : "1"
            }
            let obj = {name:"",value:""};
            let array = [];
            obj.name = "申请内容";
            obj.value = this.form.applyText;
            array.push(obj);
            json.content = JSON.stringify(array);
            if (this.form.applyText == "") {
                this.$message.error({
                    message:"请输入申请内容"
                });
                return;
            }
            if (json.approvalUser == "") {
                this.$message.error({
                    message:"请选择审批人"
                });
                return;
            }
            console.log(json)
            let loading = showLoading();
            addExamine(json).then((result)=>{
                closeLoading(loading);
                if(result.data.ExamineID!=''){
                    this.$message({
                        message:"添加成功",
                        type:"success"
                    });
                    window.history.go(-1);
                }else{
                    this.$message({
                        message:"添加失败",
                    });
                }
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"2050");
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.commonApplyDetail{
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
.interestClassTeacher_label{
    /* color:#c0c4cc; */
    font-weight: lighter;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.el-table th, .el-table tr {
    background-color: #38ADFF;
}
.el-table .cell{
    color: #fff;
}
.uploadDiv div{
    display: flex;
    width:600px;
    height: 27px;
    margin-bottom:10px;
}
.uploadDiv div .name{
    margin-left: 10px;
    width: 150px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    line-height: 27px;
}
.uploadDiv div .del{
    margin-left: 10px;
    width: 40px;
    line-height: 27px;
    color:#38ADFF;
    cursor: pointer;
}
.uploadDiv img{  
    width:27px;
    height: 27px;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>