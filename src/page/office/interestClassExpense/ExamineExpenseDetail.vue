<template>
    <div class="interestClassTeacherDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="所在班级">
                <el-select v-model="form.ClassID" :disabled="isDisabled" @change="getChildsByClassID" size="small" style="width:400px;" placeholder="请选择班级">
                    <el-option
                    v-for="item in form.allClass"
                    :key="item.ID"
                    :label="item.ClassName"
                    :value="item.ID">
                    </el-option>
                </el-select>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="幼儿姓名">
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
            <el-form-item label="兴趣班学费">
                <el-input v-model="form.Charge" size="small" style="width:400px;" placeholder="请输入收费价格"></el-input>
            </el-form-item>
            <el-form-item label="兴趣班附加费">
                <el-input v-model="form.PlusCharge" size="small" style="width:400px;" placeholder="请输入收费价格"></el-input>
            </el-form-item>
            <el-form-item label="其他" style="margin-top:10px;">
                <el-input v-model="form.Remark" size="small" type="textarea" :rows="4" style="width:400px;" placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getIClassChargeByID,getClasses,getChildsByClassID,addOrUpdatChildChargee } from '@/js/api'
import { showLoading,closeLoading,IdentityCodeValid,PhoneNumValid,imageCompress,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'InterestClassTeacherDetail',
    data(){
        return {
            title:"",
            form: {
                ClassID:"",
                ChildID:"",
                childIDs:"",
                allClass:[],
                allChild:[],
                ChildName:"",
                ChildNum:"",
                ID:"",
                Charge:"",
                PlusCharge:"",
                Remark:"",
            },
            isDisabled:true,
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="add"){
            this.title = "添加幼儿缴费信息";
            this.isDisabled = false;
            this.getClasses();
        }else if(this.$route.meta.type=="update"){
            this.title = "修改幼儿缴费信息";
            this.getIClassChargeByID();
        }
        // console.log(this.$route.params);
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
            let json = {
                staffID : this.userInfo.userStaffID,
                ID : this.$route.params.ID?this.$route.params.ID:-1,
                iClassID : this.$route.params.data.split("&")[0],
                StartDate : this.$route.params.data.split("&")[1],
                EndDate : this.$route.params.data.split("&")[2],
                childID : this.form.ChildID,
                charge : this.form.Charge,
                plusCharge : this.form.PlusCharge,
                remark : this.form.Remark,
            }
            if(this.$route.meta.type=="update"){
                json.childID = this.form.ChildIDs.toString();
            }
            console.log(json)
            if(json.classID==""){
                this.$message.error({
                    message:"请选择所在班级！"
                });
				return false;
            }
            if(json.childID==""){
                this.$message.error({
                    message:"请选择幼儿姓名！"
                });
				return false;
            }
            if(json.charge==""){
                this.$message.error({
                    message:"请输入兴趣班学费！"
                });
				return false;
            }
            if(json.plusCharge==""){
                this.$message.error({
                    message:"请输入兴趣班附加费！"
                });
				return false;
            }
            let loading = showLoading();
            addOrUpdatChildChargee(json).then((result)=>{
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
            // .catch((err)=>{
            //     alertError(this,"2155");
            // });
        },
        getIClassChargeByID(){
            let ID = this.$route.params.ID;
            getIClassChargeByID(ID).then((result)=>{
                let ExpenseInfo = result.data;
                // console.log(ExpenseInfo)
                this.form.Charge = ExpenseInfo.Charge;
                this.form.PlusCharge = ExpenseInfo.PlusCharge;
                // this.form.ChildID = ExpenseInfo.ChildID;
                this.form.ChildID = ExpenseInfo.ChildName;
                this.form.ChildIDs = ExpenseInfo.ChildID;
                this.form.ClassID = ExpenseInfo.ClassName;
                this.form.ChildNum = ExpenseInfo.ChildNum;
                this.form.ID = ExpenseInfo.ID;
                this.form.Remark = ExpenseInfo.Remark;
            })
            // .catch((err)=>{
            //     alertError(this,"1040");
            // });
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
.interestClassTeacher_label{
    /* color:#c0c4cc; */
    font-weight: lighter;
}
</style>