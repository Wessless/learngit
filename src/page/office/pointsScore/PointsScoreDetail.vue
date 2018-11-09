<template>
    <div class="PointsScoreDetail">
        <chat-header :fixIndex="10" :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <div style="width:100%;padding:54px 20px 10px 20px;">
            <el-date-picker
                v-model="selectYearMonth"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                :clearable="false"
                style="width:160px;margin-right:20px;"
                @change="loadList"
                size="medium">
            </el-date-picker>
            <el-select v-model="selectStaff" @change="loadList" disabled style="width:150px;" size="medium" filterable placeholder="请选择员工">
                <el-option
                    v-for="item in allStaffs"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                </el-option>
            </el-select>
            <div style="display:inline-block;">
                <el-radio v-model="typePoint" label="A" @change="loadList" style="margin-left:20px;">A分</el-radio>
                <el-radio v-model="typePoint" label="B" @change="loadList" style="margin-left:20px;">B分</el-radio>
            </div>
            <el-button style="float:right;" type="primary" size="medium" @click="clearTable">清空</el-button>
        </div>
        <div class="midTableHeight summaryColor" style="width:100%;display:block;padding:0px 20px 20px 20px;">
            <el-table :data="pointsScoreDetail" :cell-class-name="tableCellClassName" :header-cell-style="getRowStyle"
                      show-summary :summary-method="getSummaries" border max-height="470">
                <el-table-column prop="credit"  label="评分项"  width="500"></el-table-column>
                <el-table-column prop="point" align="center"  label="评分标准"  >
                    <template slot-scope="scope">
                        <span class="spanTitle">{{scope.row.point}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Point" align="center"  label="积分"  width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.value" @keyup.native="onlyNumber(scope.row)"  size="small" style="width:70px;"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <el-input v-model="strComment" type="textarea" rows="3" size="small" style="width:100%;margin-top:20px;"></el-input>
        </div>
    </div>
</template>

<script>

import { getAllCreditDetail,addCreditDetail } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'PointsScoreDetail',
    data(){
        return {
            title:"提交积分评分",
            pointsScoreDetail:[],
            strComment:"",
            selectStaff:"",
            typePoint:"",
            selectYearMonth:"",
        }
    },
    props:{
        item:{
            type:Object
        },
        yearMonth:{
            type:String,
        },
        AStaffs:{
            type:Array
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.selectStaff = this.item.StaffID; 
        this.typePoint = this.item.Type;
        this.selectYearMonth = this.yearMonth;
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    methods:{
        confirm(){
            // yearMonth,staffID,managerID,pointData,strComment,type
            let yearMonth=this.selectYearMonth + "-01";
            let staffID=this.selectStaff;
            let managerID=this.userInfo.userStaffID;
            let strComment=this.strComment;
            let type=this.typePoint;
            let arr = [];
            for (let i = 0; i < this.pointsScoreDetail.length; i++) {
                if (this.pointsScoreDetail[i].value != null&&this.pointsScoreDetail[i].value!=""&&this.pointsScoreDetail[i].value!="0") {
                    let obj = {};
                    obj.subjectID = this.pointsScoreDetail[i].subjectID+"";
                    obj.point = Number(this.pointsScoreDetail[i].value);
                    arr.push(obj);
                }
            }
            let pointData = arr;
            // console.log(yearMonth,staffID,managerID,pointData,strComment,type)
            let loading = showLoading();
            addCreditDetail(yearMonth,staffID,managerID,JSON.stringify(pointData),strComment,type).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"提交成功",
                        type:"success"
                    });
                    this.$emit("refresh",true);
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message:"提交失败"
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2138");
            });

        },
        loadList(){
            this.pointsScoreDetail = [];
            let staffID = this.selectStaff;
            let managerID = this.userInfo.userStaffID;
            let yearMonth = this.selectYearMonth + "-01";
            let type = this.typePoint;

            let loading = showLoading();
            getAllCreditDetail(yearMonth,staffID,managerID,type).then((result)=>{
                closeLoading(loading);
                this.pointsScoreDetail = result.data.Details;
                this.strComment = result.data.Comment;
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1208");
            });
        },
        clearTable(){
            for (let i = 0; i < this.pointsScoreDetail.length; i++) {
                this.pointsScoreDetail[i].value = "";
            }
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
                        sum += parseFloat(data[i].value)?parseFloat(data[i].value):0;
                    }
                    sums[index] = sum;
                    return;
                }
            })
            return sums;
        },
        onlyNumber(item){
            let value = item.value;
            value = value.replace(/[^\d\.]/g,"");
            if(value.indexOf(".")< 0 && value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                value= parseFloat(value); 
            } 
            item.value = value;
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
.PointsScoreDetail{
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