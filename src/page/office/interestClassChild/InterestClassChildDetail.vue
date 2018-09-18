<template>
    <div class="interestClassTeacherDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="兴趣班名称">
                <el-input v-model="form.iClassName" :disabled="true" size="small" style="width:400px;" placeholder="请输入班级名称"></el-input>
            </el-form-item>
            <el-form-item label="所在班级">
                <el-select v-model="form.ClassID" :disabled="isDisabled" size="small" style="width:400px;" placeholder="请选择班级" @change="getChildsByClassID">
                    <el-option
                    v-for="item in form.allClass"
                    :key="item.ID"
                    :label="item.ClassName"
                    :value="item.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名">
                <el-select v-model="form.ChildID" size="small" :disabled="isDisabled" placeholder="请选择幼儿" style="width:400px;" >
                    <el-option
                    v-for="item in form.allChild"
                    :key="item.Id"
                    :label="item.ChildName"
                    :value="item.Id">
                    </el-option>
                </el-select>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="入班日期">
                <el-date-picker
                    v-model="form.ClassInDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    size="small"
                    placeholder="请选择入班日期"
                    style="width:400px;">
                </el-date-picker>
                <div class="redColor">*必填</div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getIclassChildDetail,getClasses,getChildsByClassID,addChildInIClass,getIClassByID } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'InterestClassManageDetail',
    data(){
        return {
            title:"",
            form: {
                iClassName:"",
                iClassID:"",
                ClassID:"",
                ChildID:"",
                ClassInDate:"",
                childName:"",
                allClass:[],
                allChild:[],
            },
            isDisabled:true,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="add"){
            this.title = "添加兴趣班幼儿信息";
            this.isDisabled = false;
            this.form.iClassID = this.$route.params.classID;
            this.getIClassByID(this.form.iClassID);
            this.getClasses();
        }else if(this.$route.meta.type=="update"){
            this.title = "修改兴趣班幼儿信息";
            this.getIclassChildDetail();
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        classType(){
            if(this.teacherSex=="0"){
                return '0';
            }else{
                return '1';
            }
        },
    },
    watch:{
    },
    methods:{
        // 点击确认保存模板
        confirm(){
            let childID = this.$route.params.ID?this.$route.params.ID.split("&")[0]:this.form.ChildID;
            let iClassID = this.form.iClassID?this.form.iClassID:this.$route.params.ID.split("&")[1];
            let inDate = this.form.ClassInDate;
            console.log(childID,iClassID,inDate)
            let loading = showLoading();
            addChildInIClass(childID,iClassID,inDate).then((result)=>{
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
                }else if(this.$route.meta.type=="add"){
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
            })
        },
        getIclassChildDetail(){
            let childId = this.$route.params.ID.split("&")[0];
            let interestClassId = this.$route.params.ID.split("&")[1];
            this.getIClassByID(interestClassId);
            let loading = showLoading();
            getIclassChildDetail(childId,interestClassId).then((result)=>{
                closeLoading(loading);
                let childInfo = result.data;
                this.form.ChildID = childInfo.ChildName;
                this.form.ClassID = childInfo.ClassName;
                this.form.ClassInDate = childInfo.InDate;
            })
            // .catch((err)=>{
            //     alertError(this,"1040");
            // });
        },
        getIClassByID(iClassID){ 
            getIClassByID(iClassID).then((result)=>{
                let classInfo = result.data;
                this.form.iClassName = classInfo.ClassName;    
            })
        },
        getClasses(){
            let staffID = this.userInfo.userStaffID;
            getClasses(staffID).then((result)=>{
                // console.log(result.data.data);
                this.form.allClass = result.data.data
            })
            if (this.form.ClassID!="") {
                this.getChildsByClassID();
            }
        },
        getChildsByClassID(){
            this.form.allChild = [];
            getChildsByClassID(this.form.ClassID).then((result)=>{
                this.form.allChild = result.data.data;
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interestClassTeacherDetail{
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