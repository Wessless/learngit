<template>
    <div class="CommonScoreDetail">
        <chat-header :fixIndex="10" :showBack="true" :title="title" :showRightBtn="isshow" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <div style="width:100%;padding:54px 10px 10px 10px;">
            <label>被考核人</label>
            <el-select v-model="StaffID" disabled @change="loadList" style="width:150px;margin-left:8px;" size="medium" filterable placeholder="请选择员工">
                <el-option
                    v-for="item in staffsList"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                </el-option>
            </el-select>
        </div>
        <div class="midTableHeight summaryColor" style="width:100%;display:block;padding:0px 10px 20px 10px;">
            <el-table :data="commonScoreDetail" :cell-class-name="tableCellClassName" :header-cell-style="getRowStyle"
                      show-summary :summary-method="getSummaries" border max-height="470">
                <el-table-column prop="Name" label="评分项" width="250"></el-table-column>
                <el-table-column prop="Description" label="评分标准"  ></el-table-column>
                <el-table-column align="center"  label="积分"  width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.Point" @keyup.native="onlyNumber(scope.row)" :disabled="!isshow" size="small" style="width:70px;"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <el-input v-model="strComment" :disabled="!isshow" type="textarea" rows="3" size="small" style="width:100%;margin-top:20px;"></el-input>
        </div>
    </div>
</template>

<script>

import { getOtherEvaluationDetail,addOntherEvaluation } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'CommonScoreDetail',
    data(){
        return {
            title:"绩效考核",
            StaffID:"",
            commonScoreDetail:[],
            strComment:"",
        }
    },
    props:{
        item:{
            type:Object
        },
        staffsList:{
            type:Array
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.StaffID = this.item.StaffID;
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        isshow(){
            if (this.$route.meta.type=="update") {
                return true;
            }else if (this.$route.meta.type=="show") {
                return false;
            }
        }
    },
    methods:{
        confirm(){
            // resultID,managerID,points,strComment,state
            let resultID = this.item.ResultID;
            let staffID = this.item.StaffID;
            let managerID = this.userInfo.userStaffID;
            let state = this.item.Type;
            let strComment = this.strComment;
            let points = [];
            for (let i = 0; i < this.commonScoreDetail.length; i++) {
                points.push(Number(this.commonScoreDetail[i].Point));
            }
            let pointsStr = points.toString();

            let loading = showLoading();
            addOntherEvaluation(resultID,staffID,managerID,pointsStr,strComment,state).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"提交成功",
                        type:"success"
                    });
                    this.$emit("refresh");
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message:"提交失败"
                    });
                }
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"2132");
            });

        },
        loadList(){
            this.commonScoreDetail = [];
            // resultID,staffID,managerID,state
            let resultID = this.item.ResultID;
            let staffID = this.StaffID;
            let managerID = this.item.ManageID?this.item.ManageID:this.userInfo.userStaffID;
            let state = this.item.Type;
            let loading = showLoading();
            getOtherEvaluationDetail(resultID,staffID,managerID,state).then((result)=>{
                closeLoading(loading);
                this.commonScoreDetail = result.data.Details;
                this.strComment = result.data.Comment;
                console.log(result.data)
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1200");
            });
        },
        getSummaries({ columns, data }){
            let sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总计';
                    return;
                }
                if (index ===1) {
                    sums[index] = '';
                    return;
                }
                if (index ===2) {
                    let sum = 0;
                    for (let i = 0; i < data.length; i++) {
                        sum += parseFloat(data[i].Point)?parseFloat(data[i].Point):0;
                    }
                    sums[index] = sum;
                    return;
                }
            })
            return sums;
        },
        onlyNumber(item){
            let value = item.Point;
            value = value.replace(/[^\d\.]/g,"");
            if(value.indexOf(".")< 0 && value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                value= parseFloat(value); 
            } 
            item.Point = value;
        },
        //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0) {
                return 'background:#38ADFF;color:#fff;text-align:center;'
            }
        },
        tableCellClassName({row, column, rowIndex, columnIndex}) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
        },
        //合并
        // arraySpanMethod({row, column, rowIndex, columnIndex}){
        //     if (columnIndex === 1) {
        //         if (row.Status == "待评定") {
        //             return {
        //                 rowspan: 1,
        //                 colspan: 3
        //             };
        //         } else {
        //             return {
        //                 rowspan: 0,
        //                 colspan: 0
        //             };
        //         }
        //     }
        // },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.CommonScoreDetail{
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
/* .pointsScoreList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.pointsScoreList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .pointsScoreList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .pointsScoreList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.addbtn{
    float: right;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.spanTitle{
    display: block;
    height: 22px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>