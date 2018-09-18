<template>
    <div class="childInfo">
        <chat-header :showBack="true" :title="'缴费科目'" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="formInline.classID" filterable size="medium" placeholder="请选择班级" @change="reloadList">
                        <el-option
                        v-for="item in formInline.classList"
                            :key="item.ID"
                            :label="item.ClassName"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                    <!-- <el-checkbox>显示离职人员</el-checkbox> -->
                </el-form-item>
                <el-form-item>
                    <el-radio v-model="formInline.radio" label="-1" style="margin-left:20px;" @change="reloadList">显示生日</el-radio>
                    <el-radio v-model="formInline.radio" label="0" style="margin-left:20px;" @change="reloadList">显示年龄</el-radio>
                    <span style="padding-left:10px;" v-show="formInline.radio=='0'">年龄基准日期</span>
                </el-form-item>
                <el-form-item v-show="formInline.radio=='0'">
                    <el-date-picker
                        v-model="formInline.date"
                        size="medium"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        @change="reloadList">
                    </el-date-picker>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" size="medium" v-show="canSetPaymentSubject" @click="setPaymentSubject">缴费科目</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <el-table :data="tableData" border max-height="600" style="width:100%;display:block;" :cell-class-name="getCellClass" :header-cell-class-name="getHeaderCellClass">
            <el-table-column fixed prop="ChildNum" align="center" label="学号" width="100"></el-table-column>
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
            <el-table-column prop="ChildBirthday" align="center" label="幼儿大小" width="120"></el-table-column>
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

import { getClasses,getClassesByStatus,getSettingValue,getPaymentsByType,getChildSpecialFee,setChildSpecialFee } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import childInfoItem from '@/page/office/childInfo/ChildInfoItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'PaymentSubjectList',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
                radio:"-1",
                data:""
            },
            myAllClasses:[],
            tableData:[],
            mealFeeType:[],
            mealFeeRefundType:[],
            tuitionType:[],
            tuitionRefundType:[],
        }
    },
    components:{
        NoData,
        ChatHeader,
        childInfoItem
    },
    mounted(){
        let date = new Date();
        this.formInline.date = date.getFullYear()+"-"+(Array(3).join(0)+(date.getMonth()+1)).slice(-2)+"-"+(Array(3).join(0)+date.getDate()).slice(-2);
        this.loadPayments();
        this.getClassesByStatus();
        // this.getClasses();// 转班时的班级列表
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
        // getClasses(){
        //     let staffID = this.userInfo.userStaffID;
        //     getClasses(staffID).then((result)=>{
        //         this.myAllClasses = result.data.data;
        //     }).catch((err)=>{
        //         alertError(this,"1002");
        //     });
        // },
        // 根据状态获取所有班级
        getClassesByStatus(){
            let staffID = this.userInfo.userStaffID;
            let loading = showLoading();
            getClassesByStatus(staffID,'0').then((result)=>{
                this.formInline.classList = result.data.data;
                if(result.data.data.length>0){
                    this.formInline.classID = result.data.data[0].ID;
                    this.getChildSpecialFee(loading);
                }else{
                    closeLoading(loading);
                    this.formInline.classID = "";
                }
            }).catch((err)=>{
                alertError(this,"1028");
            });
        },
        // 幼儿缴费科目管理一览
        getChildSpecialFee(loading){
            console.log('getChildSpecialFee')
            let type = "";
            if(this.formInline.radio=="-1"){
                type = "-1"
            }else{
                type = this.formInline.date;
            }
            console.log(this.formInline.classID,type)
            getChildSpecialFee(this.formInline.classID,type).then((result)=>{
                closeLoading(loading);
                let data = result.data.data;
                for(let i=0;i<data.length;i++){
                    if(data[i].DiscountUntil=="9999-01-01 00:00:00"){
                        data[i].DiscountUntil = "";
                    }else{
                        data[i].DiscountUntil = data[i].DiscountUntil.split(" ")[0];
                    }
                    if(data[i].TuitionTypeID==-1){
                        data[i].TuitionTypeID = "";
                    }else{
                        data[i].TuitionTypeID = data[i].TuitionTypeID+"";
                    }
                    if(data[i].TuitionRefundTypeID==-1){
                        data[i].TuitionRefundTypeID = "";
                    }else{
                        data[i].TuitionRefundTypeID = data[i].TuitionRefundTypeID+"";
                    }
                    if(data[i].MealFeeTypeID==-1){
                        data[i].MealFeeTypeID = "";
                    }else{
                        data[i].MealFeeTypeID = data[i].MealFeeTypeID+"";
                    }
                    if(data[i].MealFeeRefundTypeID==-1){
                        data[i].MealFeeRefundTypeID = "";
                    }else{
                        data[i].MealFeeRefundTypeID = data[i].MealFeeRefundTypeID+"";
                    }
                    if(type=="-1"){
                        data[i].ChildBirthday = data[i].ChildBirthday.split(" ")[0];
                    }else{
                        data[i].ChildBirthday = data[i].Age;
                    }
                }
                this.tableData = data;
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1293");
            });
        },
        loadPayments(){
            /**
             * 根据specialFeeType获得缴费科目
             * @param specialFeeType 
             * MEAL_FEE：餐费,
             * TUITION：保育费,
             * TUITION_REFUND：保育费退费,
             * MEAL_FEE_REFUND：餐费退费
             */
            Promise.all([getPaymentsByType('MEAL_FEE','-1'),getPaymentsByType('MEAL_FEE_REFUND','-1'),getPaymentsByType('TUITION','-1'),getPaymentsByType('TUITION_REFUND','-1'),]).then((result)=>{
                this.mealFeeType = result[0].data.data;
                this.mealFeeRefundType = result[1].data.data;
                this.tuitionType = result[2].data.data;
                this.tuitionRefundType = result[3].data.data;
                
            }).catch((err)=>{
                alertError(this,"1041");
            });
        },
        reloadList(){
            let loading = showLoading();
            this.getChildSpecialFee(loading);
        },
        confirm(){
            // [
            //     {"childID":"8","TF":"102","TR":"112","TD":"100","MF":"88","MR":"108","MD":"95","DiscountUntil":"2018-12-31"},
            //     {"childID":"8","TF":"102","TR":"112","TD":"100","MF":"88","MR":"108","MD":"95","DiscountUntil":""}
            // ]
            let feeData = [];
            let date = this.tableData;
            for(let i=0;i<date.length;i++){
                let json = {};
                json.childID = date[i].ID;
                json.TF = date[i].TuitionTypeID?date[i].TuitionTypeID:-1;
                json.TR = date[i].TuitionRefundTypeID?date[i].TuitionRefundTypeID:-1;
                json.TD = date[i].DiscountTuition;
                json.MF = date[i].MealFeeTypeID?date[i].MealFeeTypeID:-1;
                json.MR = date[i].MealFeeRefundTypeID?date[i].MealFeeRefundTypeID:-1;
                json.MD = date[i].DiscountMealFee;
                json.DiscountUntil = date[i].DiscountUntil?date[i].DiscountUntil:"9999-01-01";
                feeData.push(json)
            }
            let loading = showLoading();
            console.log(JSON.stringify(feeData));
            setChildSpecialFee(JSON.stringify(feeData)).then((result)=>{
                closeLoading(loading);
                console.log(result)
                if(result.data.Result == "1"){
                    this.$message({
                        type: 'success',
                        message:result.data.Msg
                    });
                    window.history.go(-1);
                }else{
                    this.$message({
                        type:"error",
                        message:result.data.Msg
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2182");
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