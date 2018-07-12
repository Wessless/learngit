<template>
    <div class="assignChild">
        <chat-header :showBack="true" :title="'新生分班'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="assignChildClick">分班</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="childInfoList">
            <child-info-item v-for="(item,index) in allChildList" :key="index" :item="item" :type="formInline.radio" :isAssignChild="true" :isAddChild="true"></child-info-item>
        </div>
        <el-dialog
            title="分班"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="入班日期">
                    <el-date-picker
                        v-model="form.dataFrom"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        size="medium"
                        placeholder="请选择入班日期"
                        style="width:100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="班级名称">
                    <el-select v-model="form.classID" size="medium" placeholder="请选择班级" style="width:100%;">
                        <!-- <el-option label="区域一" value="shanghai"></el-option> -->
                        <el-option
                            v-for="item in myAllClasses"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        placeholder="请输入备注"
                        v-model="form.remark"
                        type="textarea"
                        :rows="4"
                        style="width:100%;">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAssign">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getChildsByClassID,getClasses,newKindergartenChildrenToClass } from '@/js/api'
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
            selectedChildList:[],
            myAllClasses:[],
            form:{
                dataFrom:"",
                classID:"",
                remark:""
            }
        }
    },
    components:{
        ChatHeader,
        childInfoItem
    },
    mounted(){
        this.reloadList();
        this.getClasses();
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
        getClasses(){
            let staffID = this.userInfo.userStaffID;
            getClasses(staffID).then((result)=>{
                this.myAllClasses = result.data.data;
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
                this.allChildList = [];
                for(let i=0;i<result.data.data.length;i++){
                    result.data.data[i].selected = false;
                    this.allChildList.push(result.data.data[i]);
                }

            });
        },
        assignChildClick(){
            this.selectedChildList = [];
            for(let i=0;i<this.allChildList.length;i++){
                if(this.allChildList[i].selected){
                    this.selectedChildList.push(this.allChildList[i].Id);
                }
            }
            if(this.selectedChildList.length==0){
                this.$message.error({
                    message:"请选择幼儿"
                });
                return;
            }
            this.form.classID = "";
            this.form.dataFrom = "";
            this.form.remark = "";
            this.dialogVisible = true;
        },
        confirmAssign(){
            let childIDs = this.selectedChildList.join(",");
            let classID = this.form.classID;
            let dataFrom = this.form.dataFrom;
            let remark = this.form.remark;
            if(classID==""){
                this.$message.error({
                    message:"请选择班级"
                });
                return;
            }
            if(dataFrom==""){
                this.$message.error({
                    message:"请选择入班日期"
                });
                return;
            }
            console.log(childIDs,classID,dataFrom,remark);
            newKindergartenChildrenToClass(childIDs,classID,dataFrom,remark)
            .then((result)=>{
                if(result.data.Result=="1"){
                    this.$message({
                        message:"分班成功",
                        type:"success"
                    });
                    this.dialogVisible = false;
                    this.reloadList();
                }else{
                    this.$message.error({
                        message:"分班失败"
                    });
                }
            })
            .catch((err)=>{
                this.$message.error({
                    message:"分班失败"
                });
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.assignChild{
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