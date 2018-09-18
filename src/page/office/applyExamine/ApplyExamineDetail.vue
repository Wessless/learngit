<template>
    <div class="ApplyExamineDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="$route.meta.type!='detail'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="80px" style="width:100%;">
            <el-form-item label="申请人">
                <el-input v-model="form.ApplyerName" size="small" style="width:400px;" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="物品类别">
                <el-input v-model="form.GoodsSort" size="small" style="width:400px;" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="物品名称">
                <el-input v-model="form.GoodsName" size="small" style="width:400px;" :disabled="true"></el-input>
                <label class="information" @click.stop="clickReceiveApply" @showOccupyList="showOccupyList">显示参考信息</label>
            </el-form-item>
            <el-form-item label="物品总数">
                <el-input v-model="form.Num" size="small" style="width:400px;" :disabled="true"></el-input>
            </el-form-item>
        </el-form>
        <!-- <el-form ref="form" :model="form" label-width="300px" style="width:100%;">
            
        </el-form> -->
        <el-form ref="form" :model="form" label-width="80px" style="width:100%;">
            <el-form-item label="开始时间">
                <el-date-picker
                    v-model="form.newBeginDateTime"
                    @change="getUseGoods"
                    size="small"
                    :disabled="true"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    style="width:400px;"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="'选择日期'"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker
                    v-model="form.newEndDateTime"
                    @change="getUseGoods"
                    size="small"
                    type="datetime"
                    style="width:400px;"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="true"
                    :placeholder="'选择日期'"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="可用数量">
                <el-input :disabled="true" v-model="form.ApplyCount" size="small" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="申请理由" class="ReceiveApplyDetail_signatory">
                <el-input
                    :disabled="true"
                    class="input_padding"
                    style="width:400px;"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="form.Reason">
                </el-input>
            </el-form-item>
            <el-form-item label="签字人" style="width:500px;" class="ReceiveApplyDetail_signatory">
                <div v-show="this.form.SellManager1Name!=''"> 
                    <label class="labeleg" :disabled="true">{{this.form.SellManager1Name}}</label>
                    <el-radio v-model="radio1" label="1">同意</el-radio>
                    <el-radio v-model="radio1" label="0">不同意</el-radio>
                    <el-input class="input_move" v-model="form.note1" size="small" style="width:400px;"></el-input>
                </div>
                <div v-show="this.form.SellManager2Name!=''">
                    <label class="labeleg" :disabled="true">{{this.form.SellManager2Name}}</label>
                    <el-radio v-model="radio2" label="1">同意</el-radio>
                    <el-radio v-model="radio2" label="0">不同意</el-radio>
                    <el-input class="input_move" v-model="form.note2" size="small" style="width:400px;"></el-input>
                </div>
                <div v-show="this.form.SellManager3Name!=''">
                    <label class="labeleg" :disabled="true">{{this.form.SellManager3Name}}</label>
                    <el-radio v-model="radio3" label="1">同意</el-radio>
                    <el-radio v-model="radio3" label="0">不同意</el-radio>
                    <el-input class="input_move" v-model="form.note3" size="small" style="width:400px;"></el-input>
                </div>
            </el-form-item>
            <!-- <el-form-item label="签字人" style="width:500px;" class="signature">
                <div>
                    <label class="labeleg" :disabled="true">{{this.form.SellManager1Name}}</label>
                </div>
                <div>
                    <label class="labeleg" :disabled="true">{{this.form.SellManager2Name}}</label>
                </div>
                <div>
                    <label class="labeleg" :disabled="true">{{this.form.SellManager3Name}}</label>
                </div>
            </el-form-item> -->
            <el-dialog
                :title="dialogTitle"
                :visible.sync="recordDialogVisible"
                width="50%">
                <el-table :data="occupyList" border style="width: 100%" :header-cell-class-name="getHeader">
                    <el-table-column prop="StaffName" label="申请人" width="100" align="center"></el-table-column>
                    <el-table-column prop="dates" label="申请期限" align="center"></el-table-column>
                    <el-table-column prop="applyCount" label="申领数量" width="100" align="center"></el-table-column>
                    <el-table-column prop="status" label="状态" width="100" align="center"></el-table-column>
                </el-table>
            </el-dialog>
        </el-form>
    </div>
</template>

<script>

import {getApplyDetailByAplyId,getCanUseGoods,getOccupyList,signApplyByApplyId } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'ApplyExamineDetail',
    data(){
        return {
            title:"申领审批",
            title1:"",
            detail:{
                
            },
            radio1:"1",
            radio2:"1",
            radio3:"1",
            occupyList:[],
            recordDialogVisible:false,
            form: {
                ApplyerName:"",
                GoodsName:"",
                GoodsSort:"",
                GoodsID:"",
                BeginDate:"",
                BeginTime:"",
                EndDate:"",
                EndTime:"",
                Reason:"",
                Num:"",
                ApplyCount:"",
                newBeginDateTime:"",
                newEndDateTime:"",
                SellManager1Name:"",
                SellManager2Name:"",
                SellManager3Name:"",
                SellManager1:"",
                SellManager2:"",
                SellManager3:"",
                note1:"",
                note2:"",
                note3:"",
            },
        }
    },
    // props: {
    //     item:{
    //         type:Object
    //     }
    // },
    components:{
        ChatHeader
    },
    mounted(){
        this.loadUpdateReceiveApplyDetail();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        dialogTitle(){
            return '物品 '+this.title1+' 的被申领情况为：'
        }
    },
    watch:{
    },
    methods:{ 
        confirm(){
            let json = {
                // applyID,
                // masterID,
                // singer,
                // goodsID,
                // status,
                // note
                applyID:this.$route.params.applyId,
                masterID:this.userInfo.userStaffID,
                goodsID:this.form.GoodsID,
                status:this.radio1,
            }
            if (this.form.SellManager1.indexOf(json.masterID)!=-1&&this.form.SellManager1Name.indexOf(this.userInfo.userName)!=-1) {
                json.singer = this.form.SellManager1;
                json.note = this.form.note1;
            }else if(this.form.SellManager2.indexOf(json.masterID)!=-1&&this.form.SellManager2Name.indexOf(this.userInfo.userName)!=-1){
                json.singer = this.form.SellManager2;
                json.note = this.form.note2;
            }else if(this.form.SellManager3.indexOf(json.masterID)!=-1&&this.form.SellManager3Name.indexOf(this.userInfo.userName)!=-1){
                json.singer = this.form.SellManager3;
                json.note = this.form.note3;
            }
            if(json.note==""){
                this.$message.error({
                    message:"请签字"
                });
                return;
            }
            let loading = showLoading();
            signApplyByApplyId(json).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=='1'){
                    this.$message({
                        message:"签字成功",
                        type:"success"
                    });
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message:"签字失败"
                    });
                }
            }).catch((err)=>{
                alertError(this,"2148");
            });
        },
        clickReceiveApply(item){
            this.recordDialogVisible = true;
        },
        getHeader({row, column, rowIndex, columnIndex}) {
            return "note-attendance-height note-attendance-bg-blue"
        },
        loadUpdateReceiveApplyDetail(){
            let ApplyID = this.$route.params.applyId;
            let loading = showLoading();
            getApplyDetailByAplyId(ApplyID)
            .then((result)=>{
                let obj = result.data.data;
                this.form.GoodsID = obj[0].GoodsId?obj[0].GoodsId:"";
                this.form.ApplyerName = obj[0].ApplyerName?obj[0].ApplyerName:"";
                this.form.GoodsName = obj[0].GoodsName?obj[0].GoodsName:"";
                this.form.GoodsSort = obj[0].GoodsSort?obj[0].GoodsSort:"";
                this.form.BeginDate = obj[0].BeginDate?obj[0].BeginDate:"";
                this.form.BeginTime = obj[0].BeginTime?obj[0].BeginTime:"";
                this.form.EndDate = obj[0].EndDate?obj[0].EndDate:"";
                this.form.EndTime = obj[0].EndTime?obj[0].EndTime:"";
                this.form.Reason = obj[0].Reason?obj[0].Reason:"";
                this.form.Num = obj[0].ApplyCount?obj[0].ApplyCount:"";
                //签字人
                this.form.SellManager1Name = obj[0].SellManager1Name?obj[0].SellManager1Name:"";
                this.form.SellManager2Name = obj[0].SellManager2Name?obj[0].SellManager2Name:"";
                this.form.SellManager3Name = obj[0].SellManager3Name?obj[0].SellManager3Name:"";
                this.form.SellManager1 = obj[0].SellManager1?obj[0].SellManager1:"";
                this.form.SellManager2 = obj[0].SellManager2?obj[0].SellManager2:"";
                this.form.SellManager3 = obj[0].SellManager3?obj[0].SellManager3:"";
                // console.log(this.form);
                // console.log("***********************")
                // console.log(this.form.BeginDate)
                this.showOccupyList(this.form.GoodsID);
                this.form.newBeginDateTime = this.form.BeginDate+" "+this.form.BeginTime+":00";
                this.form.newEndDateTime = this.form.EndDate+" "+this.form.EndTime+":00";
                this.getUseGoods(loading);
            }).catch((err)=>{
                alertError(this,"1229");
            })   
        },
        //根据选择的日期查看可用数量
        getUseGoods(loading){
            let EgapplyID = "";
            if (this.$route.params.applyId) {
                EgapplyID = this.$route.params.applyId;
            }
            if (this.$route.params.goodsID) {
                this.form.GoodsID = this.$route.params.goodsID;
            }
            if(this.form.newBeginDateTime&&this.form.newEndDateTime){
                this.form.BeginDate = this.form.newBeginDateTime.split(" ")[0];
                this.form.EndDate = this.form.newEndDateTime.split(" ")[0];
                this.form.BeginTime = this.form.newBeginDateTime.split(" ")[1].slice(0,5);
                this.form.EndTime = this.form.newEndDateTime.split(" ")[1].slice(0,5);
                // console.log(this.form.GoodsID)
                getCanUseGoods(EgapplyID,this.form.GoodsID,this.form.BeginDate,this.form.EndDate).then((result)=>{
                    this.form.ApplyCount = result.data.count;
                    closeLoading(loading);
                }).catch((err)=>{
                    alertError(this,"1240");
                })
            }else{
                this.form.ApplyCount = "";
            }
        },
        //显示参考信息
        showOccupyList(goodsID){
            getOccupyList(goodsID).then((result)=>{
                this.occupyList = result.data.data;
                this.title1 = result.data.name;
            }).catch((err)=>{
                alertError(this,"1239");
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.ApplyExamineDetail{
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
.labeleg{
    text-align: left;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.information{
    width: 90px;
    height: 40px;
    color:#38ADFF;
    margin-left: 10px;
    font-weight: normal;
    cursor: pointer;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0px 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.input_move{
    transform: translateY(-15px);
}
.input_padding{
    padding: 5px 0 8px 0;
}
.signature div:not(:first-child){
    float: left;
    margin-left: 40px;
}
</style>