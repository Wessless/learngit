<template>
    <div class="PointsClassifyDetail">
        <chat-header :fixIndex="10" :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;padding-top:54px;">
            <el-form-item label="积分分类">
                <el-select v-model="form.typeID" size="small" style="width:400px;" filterable placeholder="请选择积分分类">
                    <el-option
                    v-for="item in form.typeNameArr"
                        :key="item.ID"
                        :label="item.TypeName"
                        :value="item.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="科目名称" style="margin-bottom:5px;">
                <el-input v-model="form.subjectName" size="small" clearable style="width:400px;" placeholder="请输入科目名称"></el-input>
            </el-form-item>
            <el-form-item label="评分标准" class="ReceiveApplyDetail_signatory">
                <el-input v-model="form.subjectPoint" type="textarea" rows="6" style="width:400px;" placeholder="请输入评分标准"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio v-model="form.status" label="0">有效</el-radio>
                <el-radio style="margin-left:20px;" v-model="form.status" label="1">无效</el-radio>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getAllCreditType,addCreditSubject } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'PointsClassifyDetail',
    data(){
        return {
            title:"",
            form: {
                typeID:"",
                typeNameArr:[],
                subjectName:"",
                subjectPoint:"",
                status:"0",
            },
            pointsSubjectList:[],
        }
    },
    components:{
        ChatHeader
    },
    props: {
        item:{
            type:Object
        }
    },
    mounted(){
        this.getAllCreditType();
        if(this.$route.meta.type=="add"){
            this.title = "添加积分科目";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改积分科目";
            this.loadList();
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
                id = this.item.SubjectID;
            }
            let typeID = this.form.typeID;
            let subjectName = this.form.subjectName;
            let point = this.form.subjectPoint;
            let delFlag = this.form.status;

            if(typeID == ""){
                this.$message.error({
                    message:"请选择积分分类"
                });
                return;
            }
            if(subjectName == ''){
                this.$message.error({
                    message:"请输入科目名称"
                });
                return;
            }
            if(point == ''){
                this.$message.error({
                    message:"请输入评分标准"
                });
                return;
            }
            let loading = showLoading();
            addCreditSubject(staffID,id,typeID,subjectName,point,delFlag).then((result)=>{
                closeLoading(loading);
                if(this.$route.meta.type=="update"){
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"修改成功",
                            type:"success"
                        });
                        this.$emit("refresh",true);
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
                        this.$emit("refresh",true);
                        window.history.go(-1);
                    }else{
                        this.$message.error({
                            message:"添加失败"
                        });
                    }
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2136");
            });
        },
        getAllCreditType(){
            getAllCreditType(1,1000,"-1").then((result)=>{
                this.form.typeNameArr = result.data.data;
            }).catch((err)=>{
                alertError(this,"1205");
            });
        },
        loadList(){
            this.form.typeID = this.item.TypeID;
            this.form.subjectName = this.item.SubjectName;
            this.form.subjectPoint = this.item.SubjectPoint;
            this.form.status = this.item.status;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.PointsClassifyDetail{
    padding:20px;
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap;  */
    height: 100vh;
    width: 100%;
    overflow: scroll;
    background: #fafafa;
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
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0px 12px 0 0;
    vertical-align: middle;
    position: relative;
}
</style>