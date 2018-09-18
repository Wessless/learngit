<template>
    <div class="childInfo">
        <chat-header :showBack="true" :title="'本日家园通'" :showRightBtn="false" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <!-- <el-form-item>
                    <el-select v-model="formInline.classID" filterable size="medium" placeholder="请选择班级" @change="reloadList">
                        <el-option
                        v-for="item in formInline.classList"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item>
                    <el-radio v-model="formInline.radio" label="-1" style="margin-left:20px;" @change="reloadList">显示生日</el-radio>
                    <el-radio v-model="formInline.radio" label="0" style="margin-left:20px;" @change="reloadList">显示年龄</el-radio>
                </el-form-item> -->
                <!-- <el-form-item v-show="formInline.radio=='0'">
                    <el-date-picker
                        v-model="formInline.date"
                        size="medium"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        @change="reloadList">
                    </el-date-picker>
                </el-form-item> -->
                <!-- <el-form-item>
                    <el-button type="primary" size="medium" v-show="canSetPaymentSubject" @click="setPaymentSubject">缴费科目</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <el-table :data="tableData" border max-height="600" style="width:100%;display:block;" :cell-class-name="getCellClass" :header-cell-class-name="getHeaderCellClass">
            <el-table-column prop="HomeTime" align="center" label="发布时间"></el-table-column>
            <el-table-column prop="HomeType" align="center" label="发布类型"></el-table-column>
            <!-- <el-table-column fixed prop="ChildNum" align="center" label="学号" width="100"></el-table-column>
            <el-table-column fixed prop="ChildName" align="center" label="姓名" width="100"></el-table-column>
            <el-table-column align="center" label="保育费缴费科目" width="200">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.TuitionTypeID" filterable size="medium">
                        <el-option
                        v-for="item in tuitionType"
                            :key="item.ID"
                            :label="item.PaymentName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column align="center" label="保育费退费科目" width="200">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.TuitionRefundTypeID" filterable size="medium">
                        <el-option
                        v-for="item in tuitionRefundType"
                            :key="item.ID"
                            :label="item.PaymentName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column align="center" label="保育费折扣率" width="120">
                <template slot-scope="scope">
                    <el-input size="medium" v-model="scope.row.DiscountTuition"></el-input>
                </template>
            </el-table-column>
            <el-table-column align="center" label="餐费缴费科目" width="200">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.MealFeeTypeID" filterable size="medium">
                        <el-option
                        v-for="item in mealFeeType"
                            :key="item.ID"
                            :label="item.PaymentName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column align="center" label="餐费退费科目" width="200">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.MealFeeRefundTypeID" filterable size="medium">
                        <el-option
                        v-for="item in mealFeeRefundType"
                            :key="item.ID"
                            :label="item.PaymentName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column align="center" label="餐费折扣率" width="120">
                <template slot-scope="scope">
                    <el-input size="medium" v-model="scope.row.DiscountMealFee"></el-input>
                </template>
            </el-table-column>
            <el-table-column align="center" label="折扣终止日" width="160">
                <template slot-scope="scope">
                    <el-date-picker
                        v-model="scope.row.DiscountUntil"
                        size="medium"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width:100%;">
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column prop="ChildBirthday" align="center" label="幼儿大小" width="120"></el-table-column> -->
            <!-- <el-table-column v-for="(item,index) in columnList" :key="index" align="center" :label="item.name" min-width="40">
                <template slot-scope="scope">
                    <div v-show="!scope.row.AttData[index].number&&scope.row.AttData[index].number!=0">
                        <el-checkbox style="margin-bottom:0px;" v-model="scope.row.AttData[index].selected" :disabled="scope.row.AttData[index].disabled" @change="changeChildAttendance(scope,index)"></el-checkbox>
                    </div>
                    <div v-show="scope.row.AttData[index].number||scope.row.AttData[index].number==0">{{ scope.row.AttData[index].number }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="AttNum" fixed="right" align="center" label="出勤天数" width="100"></el-table-column> -->
        </el-table> 
    </div>
</template>

<script>

import { getDayPerformance } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'TeacherEvaluationDay',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
                radio:"-1",
                data:""
            },
            tableData:[],
            mealFeeType:[],
            mealFeeRefundType:[],
            tuitionType:[],
            tuitionRefundType:[],
        }
    },
    components:{
        NoData,
        ChatHeader
    },
    mounted(){
        let date = new Date();
        let dateStr = date.getFullYear()+"-"+(Array(3).join(0)+(date.getMonth()+1)).slice(-2)+"-"+(Array(3).join(0)+date.getDate()).slice(-2);
        this.getDayPerformance(dateStr);
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
        getHeaderCellClass({row, column, rowIndex, columnIndex}) {
            return "note-attendance-height note-attendance-bg-blue"
        },
        // 其他tablecell样式
        getCellClass({row, column, rowIndex, columnIndex}) {
            // console.log(row, column, rowIndex, columnIndex);
            if(columnIndex==2||columnIndex==3||columnIndex==4){
                return "note-attendance-bg-red"
            }
            if(columnIndex==5||columnIndex==6||columnIndex==7){
                return "note-attendance-bg-green"
            }
        },
        getDayPerformance(theDate){
            let staffID = this.$route.params.staffID;
            getDayPerformance(staffID,theDate).then((result)=>{
                console.log(result);
                this.tableData = result.data.data;
            }).catch((err)=>{
                alertError(this,"1000")
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.childInfo{
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