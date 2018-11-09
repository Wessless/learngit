<template>
    <div class="IllegalManageDetail">
        <chat-header :fixIndex="10" :showBack="true" :title="title"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;padding-top:54px;">
            <el-form-item label="违规日期">
                <el-date-picker
                    v-model="form.NGDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :disabled="true"
                    style="width:400px"
                    size="small">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="辩解人">
                <el-select v-model="form.StaffID" :disabled="true" size="small" style="width:400px;" filterable placeholder="请选择积分分类">
                    <el-option
                        v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="辩解日期">
                <el-date-picker
                    v-model="form.JustifyTime"
                    size="small"
                    :disabled="true"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    style="width:400px;"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="'请选择日期'">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="辩解种类" style="transform:translateY(-5px)">
                <el-radio v-model="type" :disabled="true" label="1">未打卡的理由</el-radio>
                <el-radio style="margin-left:20px;" v-model="type" :disabled="true" label="2">迟到或者早退理由</el-radio>
            </el-form-item>
            <el-form-item label="辩解理由" style="transform:translateY(-8px)" class="ReceiveApplyDetail_signatory">
                <el-input v-model="form.JustifyReason" :disabled="true" type="textarea" rows="6" style="width:400px;" placeholder="请输入辩解理由"></el-input>
            </el-form-item>
            <el-form-item label="审批人">
                <el-select v-model="form.ApproveStaffID" :disabled="true" size="small" style="width:400px;" filterable placeholder="请选择积分分类">
                    <el-option
                        v-for="item in allStaffs"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审批日期">
                <el-date-picker
                    v-model="form.ApprovedTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :disabled="true"
                    style="width:400px"
                    size="small">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="审批意见" style="transform:translateY(-5px)">
                <el-radio v-model="form.Status" :disabled="true" label="2">同意</el-radio>
                <el-radio v-model="form.Status" :disabled="true" label="-1" style="margin-left:20px;">不同意</el-radio>
                <el-radio v-model="form.Status" :disabled="true" label="1"  style="margin-left:20px;">暂不签字</el-radio>
            </el-form-item>
            <el-form-item label="补充理由" style="transform:translateY(-8px)" class="ReceiveApplyDetail_signatory">
                <el-input v-model="form.ApprovedReason" :disabled="true" type="textarea" rows="6" style="width:400px;" placeholder="请输入补充理由"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getJustifyByID } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'IllegalManageDetail',
    data(){
        return {
            title:"违规详情",
            type:"",
            form:{

            }
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
        this.getJustifyByID();
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
        getJustifyByID(){
            let justifyID;
            if(this.item.JustifyOne!="-1"||this.item.JustifyTwo!="-1"){
                if(this.item.JustifyOne!="-1"){
                    justifyID = this.item.JustifyOne;
                    this.type = "1";
                }
                if(this.item.JustifyTwo!="-1"){
                    justifyID = this.item.JustifyTwo;
                    this.type = "2";
                }
            }
            let loading = showLoading();
            getJustifyByID(justifyID,this.type).then((result)=>{
                closeLoading(loading);
                let obj = result.data;
                obj.Status = obj.Status.toString();
                obj.ApproveStaffID = obj.ApproveStaffID.toString();
                obj.StaffID = obj.StaffID.toString();
                this.form = obj;
            }).catch((err)=>{
                console.log(err)
                closeLoading(loading);
                alertError(this,"1134");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.IllegalManageDetail{
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