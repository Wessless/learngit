<template>
    <div class="templateDetail smallTableHeight">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <!-- <el-form-item label="班号">
                <el-input v-model="form.ClassNum" size="small" style="width:400px;" placeholder="" disabled></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="班名">
                <el-input v-model="form.ClassName" size="small" style="width:400px;" placeholder="请输入班名"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="添加日期">
                <el-date-picker
                    v-model="form.ClassDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    size="small"
                    placeholder="请选择添加日期"
                    style="width:400px;">
                </el-date-picker>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="班级定员">
                <el-input v-model="form.ClassSetNum" size="small" style="width:400px;" placeholder="请输入班级定员"></el-input>
                <div class="grayColor">是指按照教育局规定该班能容纳的最多人数</div>
            </el-form-item>
            <el-form-item label="班级教师">
                <el-select v-model="form.TeacherID" multiple size="small" placeholder="请选择班级教师" style="width:400px;" >
                    <el-option
                    v-for="item in allStaff"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="班级助教">
                <el-select v-model="form.AssistantID" multiple size="small" placeholder="请选择班级助教" style="width:400px;" >
                    <el-option
                    v-for="item in allStaff"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="班级保育员">
                <el-select v-model="form.NurseryID" multiple size="small" placeholder="请选择班级保育员" style="width:400px;" >
                    <el-option
                    v-for="item in allStaff"
                    :key="item.StaffID"
                    :label="item.StaffName"
                    :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="班级类别">
                <el-radio v-model="form.ClassType" label="1" :disabled="$route.meta.type=='update'" style="margin-left:20px;">托班</el-radio>
                <el-radio v-model="form.ClassType" label="2" :disabled="$route.meta.type=='update'" style="margin-left:20px;">小班</el-radio>
                <el-radio v-model="form.ClassType" label="3" :disabled="$route.meta.type=='update'" style="margin-left:20px;">中班</el-radio>
                <el-radio v-model="form.ClassType" label="4" :disabled="$route.meta.type=='update'" style="margin-left:20px;">大班</el-radio>
            </el-form-item>
            <el-form-item label="班级状态">
                <el-radio v-model="form.ClassStatus" label="0" :disabled="$route.meta.type=='update'" style="margin-left:20px;">进行中</el-radio>
                <el-radio v-model="form.ClassStatus" label="1" :disabled="$route.meta.type=='update'" style="margin-left:20px;">已毕业</el-radio>
            </el-form-item> -->
            <el-form-item label="缴费科目名称">
                <el-input v-model="form.PaymentName" size="small" style="width:400px;" placeholder="请输入缴费科目名称"></el-input>
            </el-form-item>
            <el-form-item label="是否特殊字段">
                <el-radio v-model="form.SpecialFeeType" label="0" style="margin-left:10px;" @change="changeSpecialFeeType">非特殊字段</el-radio>
                <el-radio v-model="form.SpecialFeeType" label="1" style="margin-left:10px;" @change="changeSpecialFeeType">餐费</el-radio>
                <el-radio v-model="form.SpecialFeeType" label="2" style="margin-left:10px;" @change="changeSpecialFeeType">保育费</el-radio>
                <el-radio v-model="form.SpecialFeeType" label="3" style="margin-left:10px;" @change="changeSpecialFeeType">餐费退费</el-radio>
                <el-radio v-model="form.SpecialFeeType" label="4" style="margin-left:10px;" @change="changeSpecialFeeType">保育费退费</el-radio>
            </el-form-item>
            <el-form-item label="定价" v-show="form.SpecialFeeType=='0'||form.SpecialFeeType=='1'||form.SpecialFeeType=='2'">
                <el-input v-model="form.PaymentPrice" size="small" style="width:400px;" placeholder="请输入定价"></el-input>
            </el-form-item>
            <el-form-item label="定价周期" v-show="form.SpecialFeeType=='0'||form.SpecialFeeType=='1'||form.SpecialFeeType=='2'">
                <el-radio v-model="form.PaymentPriceUnit" label="0" style="margin-left:10px;">月</el-radio>
                <el-radio v-model="form.PaymentPriceUnit" label="1" style="margin-left:10px;">天</el-radio>
                <el-radio v-model="form.PaymentPriceUnit" label="2" v-show="form.SpecialFeeType=='0'" style="margin-left:10px;">次</el-radio>
                <el-radio v-model="form.PaymentPriceUnit" label="3" v-show="form.SpecialFeeType=='0'" style="margin-left:10px;">年</el-radio>
                <el-radio v-model="form.PaymentPriceUnit" label="4" v-show="form.SpecialFeeType=='0'" style="margin-left:10px;">半年</el-radio>
            </el-form-item>
            <el-form-item label="备注说明" style="margin-top:10px;">
                <el-input v-model="form.Note" size="small" type="textarea" :rows="4" style="width:400px;" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item label="退费计算方法" v-show="form.SpecialFeeType=='3'||form.SpecialFeeType=='4'">
                <el-radio v-model="form.rbMethod" label="1" style="margin-left:10px;">通用公式</el-radio>
                <el-radio v-model="form.rbMethod" label="0" style="margin-left:20px;">单独定制</el-radio>
            </el-form-item>
            <el-form-item label="退费计算公式" v-show="(form.SpecialFeeType=='3'||form.SpecialFeeType=='4')&&form.rbMethod=='1'">
                <div class="ddlBlock" :class="{gray:!item.line}" v-for="(item,index) in form.ddl" :key="index">
                    <div class="blockItem">
                        <span class="blockTitle">生效：</span>
                        <el-checkbox v-model="item.line" style="margin-bottom:0px;"></el-checkbox>
                    </div>
                    <div class="blockItem">
                        <span class="blockTitle">退费条件：</span>
                        <el-checkbox v-model="item.Continuous" :disabled="!item.line" style="margin-bottom:0px;margin-right:10px;">连续</el-checkbox>
                        <el-select v-model="item.ddlStatus" :disabled="!item.line" size="small" placeholder="" style="width:80px;margin-right:10px;" >
                            <el-option
                            v-for="item in ddlStatus"
                            :key="item.ID"
                            :label="item.Text"
                            :value="item.ID">
                            </el-option>
                        </el-select>
                        <el-select v-model="item.ddlCompare" :disabled="!item.line" size="small" placeholder="" style="width:70px;margin-right:10px;" >
                            <el-option
                            v-for="item in ddlCompare"
                            :key="item.ID"
                            :label="item.Text"
                            :value="item.ID">
                            </el-option>
                        </el-select>
                        <el-select v-model="item.ddlDays" :disabled="!item.line" size="small" placeholder="" style="width:120px;" >
                            <el-option
                            v-for="item in ddlDays"
                            :key="item.ID"
                            :label="item.Text"
                            :value="item.ID">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="blockItem">
                        <span class="blockTitle">退费：</span>
                        <el-select v-model="item.ddlCalculationMethod" :disabled="!item.line" size="small" placeholder="" style="width:250px;" >
                            <el-option
                            v-for="item in ddlCalculationMethod"
                            :key="item.ID"
                            :label="item.Text"
                            :value="item.ID">
                            </el-option>
                        </el-select>
                        <span v-show="item.ddlCalculationMethod!='1'" style="padding-left:10px;padding-right:5px;">X=</span>
                        <el-input v-model="item.txtX" v-show="item.ddlCalculationMethod!='1'" :disabled="!item.line" size="small" style="width:80px;"></el-input>
                    </div>
                    <div class="blockItem">
                        <span class="blockTitle">管理费：</span>
                        <el-select v-model="item.ddlFlag3" :disabled="!item.line" size="small" placeholder="" style="width:250px;" >
                            <el-option
                            v-for="item in ddlFlag3"
                            :key="item.ID"
                            :label="item.Text"
                            :value="item.ID">
                            </el-option>
                        </el-select>
                        <span style="padding-left:10px;padding-right:5px;">X=</span>
                        <el-input v-model="item.txtAdministration" :disabled="!item.line" size="small" style="width:80px;"></el-input>
                        <span v-show="item.ddlFlag3=='1'" style="padding-left:10px;padding-right:5px;">Y=</span>
                        <el-input v-model="item.txtAdministrationY" v-show="item.ddlFlag3=='1'" :disabled="!item.line" size="small" style="width:80px;"></el-input>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="定制退费方式" v-show="(form.SpecialFeeType=='3'||form.SpecialFeeType=='4')&&form.rbMethod=='0'">
                <el-select v-model="form.ddlRefundMethodIndex" size="small" placeholder="请选择班级保育员" style="width:400px;" >
                    <el-option
                    v-for="item in ddlRefundMethod"
                    :key="item.ID"
                    :label="item.Text"
                    :value="item.ID">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { getPaymentManageDetail,addPayment } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'SetTuitionSubjectDetail',
    data(){
        return {
            title:"",
            form: {
                PaymentName:"",// 缴费名称
                PaymentPrice:"",// 定价
                PaymentPriceUnit:"0",// 定价周期
                SpecialFeeType:"0",// 特殊字段
                Note:"",// 备注说明
                rbMethod:"1",// 退费计算方式
                ddlRefundMethodIndex:"0",//单独定制
                // ddlStatus1:"",
                // ddlCompare1:"",
                // ddlDays1:"",
                // ddlCalculationMethod1:"",
                // txtX1:"",
                // txtAdministration1:"",
                // txtAdministrationY1:"",
                // ddlFlag31:"",
                ddl:[
                    {
                        line:false,// 生效
                        Continuous:false,// 连续
                        ddlDays:"1天",
                        ddlStatus:"缺勤",// 出勤缺勤
                        ddlCompare:">",
                        txtX:"",
                        txtAdministration:"",
                        txtAdministrationY:"",
                        ddlCalculationMethod:"0",
                        ddlFlag3:"0"
                    },{
                        line:false,
                        Continuous:false,
                        ddlDays:"1天",
                        ddlStatus:"缺勤",
                        ddlCompare:">",
                        txtX:"",
                        txtAdministration:"",
                        txtAdministrationY:"",
                        ddlCalculationMethod:"0",
                        ddlFlag3:"0"
                    },{
                        line:false,
                        Continuous:false,
                        ddlDays:"1天",
                        ddlStatus:"缺勤",
                        ddlCompare:">",
                        txtX:"",
                        txtAdministration:"",
                        txtAdministrationY:"",
                        ddlCalculationMethod:"0",
                        ddlFlag3:"0"
                    }
                ]
            },
            ddlStatus:[
                {
                    ID:"缺勤",
                    Text:"缺勤"
                },
                {
                    ID:"出勤",
                    Text:"出勤"
                }
            ],
            ddlCompare:[
                {
                    ID:">",
                    Text:">"
                },
                {
                    ID:">=",
                    Text:">="
                },
                {
                    ID:"<=",
                    Text:">="
                },
                {
                    ID:"<",
                    Text:"<"
                }
            ],
            ddlDays:[
                {
                    ID:"1天",
                    Text:"1天"
                },
                {
                    ID:"2天",
                    Text:"2天"
                },
                {
                    ID:"3天",
                    Text:"3天"
                },
                {
                    ID:"4天",
                    Text:"4天"
                },
                {
                    ID:"5天",
                    Text:"5天"
                },
                {
                    ID:"6天",
                    Text:"6天"
                },
                {
                    ID:"7天",
                    Text:"7天"
                },
                {
                    ID:"8天",
                    Text:"8天"
                },
                {
                    ID:"9天",
                    Text:"9天"
                },
                {
                    ID:"10天",
                    Text:"10天"
                },
                {
                    ID:"11天",
                    Text:"11天"
                },
                {
                    ID:"12天",
                    Text:"12天"
                },
                {
                    ID:"13天",
                    Text:"13天"
                },
                {
                    ID:"14天",
                    Text:"14天"
                },
                {
                    ID:"15天",
                    Text:"15天"
                },
                {
                    ID:"半个月",
                    Text:"半个月"
                }
            ],
            // 退费
            ddlCalculationMethod:[
                {
                    ID:"0",
                    Text:"固定钱数X * 缺勤天数"
                },
                {
                    ID:"1",
                    Text:"已缴费 / 工作日 * 缺勤天数"
                },
                {
                    ID:"2",
                    Text:"全额 * X%"
                }
            ],
            // 管理费
            ddlFlag3:[
                {
                    ID:"0",
                    Text:"固定金额X"
                },
                {
                    ID:"1",
                    Text:"固定金额X * 出勤天数 + 固定金额Y"
                }
            ],
            ddlRefundMethod:[
                {
                    ID:"0",
                    Text:"01.少来一天就退一天"
                },
                {
                    ID:"1",
                    Text:"02.少来超过半个月就退半个月"
                },
                {
                    ID:"2",
                    Text:"03.连续少来超过半个月就退半个月"
                },
                {
                    ID:"3",
                    Text:"04.出勤未超过5天就退半个月"
                },
                {
                    ID:"4",
                    Text:"05.少来半个月就退半个月"
                },
                {
                    ID:"5",
                    Text:"06.连续3天未出勤退连续少的天数的费用"
                },
                {
                    ID:"6",
                    Text:"07.出勤不超过10天退半个月"
                },
                {
                    ID:"7",
                    Text:"08.出勤超过4天收整个月，不足4天则退缺勤的部分"
                },
                {
                    ID:"8",
                    Text:"09.2744保育费退费规则"
                },
                {
                    ID:"9",
                    Text:"10.2763餐费退费规则"
                },
                {
                    ID:"10",
                    Text:"11.2763保育费退费规则"
                },
                {
                    ID:"11",
                    Text:"12.2761餐费退费规则"
                },
                {
                    ID:"12",
                    Text:"13.连续10天未出勤退连续少来天数的费用"
                },
                {
                    ID:"13",
                    Text:"14.出勤达到5天收整月，没到达5天收600元"
                },
                {
                    ID:"14",
                    Text:"15.2848和2850餐费退费规则"
                },
                {
                    ID:"15",
                    Text:"16.无论怎样都不退"
                },
            ]
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        // this.loadDetail();
        if(this.$route.meta.type=="add"){
            this.title = "添加学杂费科目";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改学杂费科目";
            this.getPaymentManageDetail();
        }
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
        getHeaderCellClass({row, column, rowIndex, columnIndex}){
            return "note-attendance-bg-blue"
        },
        changeSpecialFeeType(){
            this.form.PaymentPriceUnit = "0";
        },
        getPaymentManageDetail(){
            let loading = showLoading();
            let paymentID = this.$route.params.subjectID;
            getPaymentManageDetail(paymentID).then((result)=>{
                closeLoading(loading);
                let payment = result.data;
                // postJSON.PaymentName = this.form.PaymentName;
                // postJSON.PaymentPrice = this.form.PaymentPrice;
                // postJSON.PaymentPriceUnit = this.form.PaymentPriceUnit;
                // postJSON.SpecialFeeType = this.form.SpecialFeeType;
                // postJSON.Note = this.form.Note;
                // postJSON.rbMethod = this.form.rbMethod;
                // postJSON.ddlRefundMethodIndex = this.form.ddlRefundMethodIndex;
                this.form.PaymentName = payment.PaymentName;
                this.form.PaymentPrice = payment.PaymentPrice;
                // 定价周期
                if(payment.rbMonth=="true"){
                    this.form.PaymentPriceUnit = "0";
                }
                if(payment.rbDay=="true"){
                    this.form.PaymentPriceUnit = "1";
                }
                if(payment.rbTime=="true"){
                    this.form.PaymentPriceUnit = "2";
                }
                if(payment.rbYear=="true"){
                    this.form.PaymentPriceUnit = "3";
                }
                if(payment.rbHalfYear=="true"){
                    this.form.PaymentPriceUnit = "4";
                }
                // 是否特殊字段
                if(payment.rbGeneralItem=="true"){
                    this.form.SpecialFeeType = "0";
                }
                if(payment.rbMealFee=="true"){
                    this.form.SpecialFeeType = "1";
                }
                if(payment.rbTuition=="true"){
                    this.form.SpecialFeeType = "2";
                }
                if(payment.rbMealFeeRefund=="true"){
                    this.form.SpecialFeeType = "3";
                }
                if(payment.rbTuitionRefund=="true"){
                    this.form.SpecialFeeType = "4";
                }
                this.form.Note = payment.Note;
                // 单独定制
                if(payment.ddlRefundMethod){
                    this.form.rbMethod = "0";
                    this.form.ddlRefundMethodIndex = payment.ddlRefundMethod+"";
                }
                // 通用公式
                if(payment.cbIsContinuous1){
                    this.form.ddl[0].line = true;
                    // 连续
                    if(payment.cbIsContinuous1=="true"){
                        this.form.ddl[0].Continuous = true;
                    }
                    this.form.ddl[0].ddlStatus = payment.ddlStatus1;
                    this.form.ddl[0].ddlCompare = payment.ddlCompare1;
                    this.form.ddl[0].ddlDays = payment.ddlDays1;
                    // 退费
                    this.form.ddl[0].ddlCalculationMethod = payment.ddlCalculationMethod1+"";
                    this.form.ddl[0].txtX = payment.txtX1;
                    // 管理费
                    this.form.ddl[0].ddlFlag3 = payment.ddlFlag31;
                    this.form.ddl[0].txtAdministration = payment.txtAdministration1;
                    this.form.ddl[0].txtAdministrationY = payment.txtAdministrationY1;
                }

                if(payment.cbIsContinuous2){
                    this.form.ddl[1].line = true;
                    // 连续
                    if(payment.cbIsContinuous2=="true"){
                        this.form.ddl[1].Continuous = true;
                    }
                    this.form.ddl[1].ddlStatus = payment.ddlStatus2;
                    this.form.ddl[1].ddlCompare = payment.ddlCompare2;
                    this.form.ddl[1].ddlDays = payment.ddlDays2;
                    // 退费
                    this.form.ddl[1].ddlCalculationMethod = payment.ddlCalculationMethod2+"";
                    this.form.ddl[1].txtX = payment.txtX2;
                    // 管理费
                    this.form.ddl[1].ddlFlag3 = payment.ddlFlag32;
                    this.form.ddl[1].txtAdministration = payment.txtAdministration2;
                    this.form.ddl[1].txtAdministrationY = payment.txtAdministrationY2;
                }

                if(payment.cbIsContinuous3){
                    this.form.ddl[2].line = true;
                    // 连续
                    if(payment.cbIsContinuous3=="true"){
                        this.form.ddl[2].Continuous = true;
                    }
                    this.form.ddl[2].ddlStatus = payment.ddlStatus3;
                    this.form.ddl[2].ddlCompare = payment.ddlCompare3;
                    this.form.ddl[2].ddlDays = payment.ddlDays3;
                    // 退费
                    this.form.ddl[2].ddlCalculationMethod = payment.ddlCalculationMethod3+"";
                    this.form.ddl[2].txtX = payment.txtX3;
                    // 管理费
                    this.form.ddl[2].ddlFlag3 = payment.ddlFlag33;
                    this.form.ddl[2].txtAdministration = payment.txtAdministration3;
                    this.form.ddl[2].txtAdministrationY = payment.txtAdministrationY3;
                }
                
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1301");
            });
        },
        // 点击确认保存模板
        confirm(){
            let loading = showLoading();
            
            let type = "";
            if(this.$route.meta.type=="add"){
                type = "添加";
            }else if(this.$route.meta.type=="update"){
                type = "修改";
            }
            let postJSON = {};
            if(this.$route.meta.type=="add"){
                postJSON.paymentID = "-1";
            }else if(this.$route.meta.type=="update"){
                postJSON.paymentID = this.$route.params.subjectID;
            }
            postJSON.PaymentName = this.form.PaymentName;
            postJSON.PaymentPrice = this.form.PaymentPrice?this.form.PaymentPrice:"0";
            postJSON.PaymentPriceUnit = this.form.PaymentPriceUnit;
            postJSON.SpecialFeeType = this.form.SpecialFeeType;
            if(this.form.SpecialFeeType=="0"){
                postJSON.SpecialFeeType = "";
            }else if(this.form.SpecialFeeType=="1"){
                postJSON.SpecialFeeType = "MEAL_FEE";
            }else if(this.form.SpecialFeeType=="2"){
                postJSON.SpecialFeeType = "TUITION";
            }else if(this.form.SpecialFeeType=="3"){
                postJSON.SpecialFeeType = "MEAL_FEE_REFUND";
            }else if(this.form.SpecialFeeType=="4"){
                postJSON.SpecialFeeType = "TUITION_REFUND";
            }
            postJSON.Note = this.form.Note;
            postJSON.rbMethod = this.form.rbMethod;
            postJSON.ddlRefundMethodIndex = this.form.ddlRefundMethodIndex;
            postJSON.line1 = this.form.ddl[0].line?"1":"0";
            postJSON.line2 = this.form.ddl[1].line?"1":"0";
            postJSON.line3 = this.form.ddl[2].line?"1":"0";
            postJSON.Continuous1 = this.form.ddl[0].Continuous?"1":"0";
            postJSON.Continuous2 = this.form.ddl[1].Continuous?"1":"0";
            postJSON.Continuous3 = this.form.ddl[2].Continuous?"1":"0";
            postJSON.ddlStatus1 = this.form.ddl[0].ddlStatus;
            postJSON.ddlStatus2 = this.form.ddl[1].ddlStatus;
            postJSON.ddlStatus3 = this.form.ddl[2].ddlStatus;
            postJSON.ddlCompare1 = this.form.ddl[0].ddlCompare;
            postJSON.ddlCompare2 = this.form.ddl[1].ddlCompare;
            postJSON.ddlCompare3 = this.form.ddl[2].ddlCompare;
            postJSON.ddlDays1 = this.form.ddl[0].ddlDays;
            postJSON.ddlDays2 = this.form.ddl[1].ddlDays;
            postJSON.ddlDays3 = this.form.ddl[2].ddlDays;
            postJSON.ddlCalculationMethod1 = this.form.ddl[0].ddlCalculationMethod;
            postJSON.ddlCalculationMethod2 = this.form.ddl[1].ddlCalculationMethod;
            postJSON.ddlCalculationMethod3 = this.form.ddl[2].ddlCalculationMethod;
            postJSON.txtX1 = this.form.ddl[0].txtX?this.form.ddl[0].txtX:"0";
            postJSON.txtX2 = this.form.ddl[1].txtX?this.form.ddl[1].txtX:"0";
            postJSON.txtX3 = this.form.ddl[2].txtX?this.form.ddl[2].txtX:"0";
            postJSON.ddlFlag31 = this.form.ddl[0].ddlFlag3;
            postJSON.ddlFlag32 = this.form.ddl[1].ddlFlag3;
            postJSON.ddlFlag33 = this.form.ddl[2].ddlFlag3;
            postJSON.txtAdministration1 = this.form.ddl[0].txtAdministration?this.form.ddl[0].txtAdministration:"0";
            postJSON.txtAdministration2 = this.form.ddl[1].txtAdministration?this.form.ddl[1].txtAdministration:"0";
            postJSON.txtAdministration3 = this.form.ddl[2].txtAdministration?this.form.ddl[2].txtAdministration:"0";
            postJSON.txtAdministrationY1 = this.form.ddl[0].txtAdministrationY?this.form.ddl[0].txtAdministrationY:"0";
            postJSON.txtAdministrationY2 = this.form.ddl[1].txtAdministrationY?this.form.ddl[1].txtAdministrationY:"0";
            postJSON.txtAdministrationY3 = this.form.ddl[2].txtAdministrationY?this.form.ddl[2].txtAdministrationY:"0";
            // console.log(JSON.stringify(postJSON))
            addPayment(postJSON)
            .then((result)=>{
                console.log(result);
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message : type + "成功",
                        type : "success"
                    });
                    window.history.go(-1);
                }else{
                    this.$message.error({
                        message : type + "失败"
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2187");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.templateDetail{
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
.examineProject{
    width:100%;
    margin-top:20px; 
    padding-top:20px;
    margin-left:10px;
    border-top: 1px solid #666666;
}
.topLine{
    display: flex;
    flex-direction: row;
    margin-bottom:10px;
}
.topLine > .title{
    display: flex;
    align-items: center;
    margin-right: 5px;
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
.grayColor{
    height: 100%;
    width:100%;
    display: flex;
    align-items: center;
    /* padding-left: 10px; */
    color: #888;
    display: inline-block;
}
.element-icon{
    font-family: element-icons !important;
    /* speak: none; */
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
}
.avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    position: absolute;
}
.avatar-uploader-icon:before {
    content: "\E62B";
    z-index: 1;
}
.avatar {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 5px;
    display: block;
    margin:5px 0;
    background:#ffffff;
    overflow: hidden;
    cursor: pointer;
}
.avatar:hover{
    border: 1px dashed #38adff;
}
.avatar > img {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 5;
}
.ddlBlock{
    display:flex;
    width: 100%;
    border:1px solid #dddddd;
    padding:10px;
    margin-bottom:10px;
    flex-direction: column;
}
.blockItem{
    display: flex;
    height:40px;
    align-items: center;
    padding:5px 0;
}
.gray{
    color: #AAAAAA;
}
.blockTitle{
    width:100px;
    display: inline-block;
    text-align: right;
    padding-right: 20px;
    color: #333 !important;
}
</style>