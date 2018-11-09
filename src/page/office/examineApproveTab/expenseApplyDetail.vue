<template>
    <div class="expenseApplyDetail">
        <!-- <div class="redColor">*必填</div> -->
        <input  name="file" type="file" id="uploadCloudFile" style="display:none" @change="uploadFile"/>
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="财务类型">
                <el-select v-model="form.chargeBillType" size="small" style="width:125px;" disabled>
                    <el-option label="记账凭证" value="01"></el-option>
                </el-select>
                <label style="color:#606266;margin:0 8px 0 65px;">财务所属公司</label>
                <el-select v-model="form.companyID" size="small" style="width:311px;" placeholder="请选择财务所属公司">
                    <el-option
                        v-for="item in form.CompanyArr"
                        :key="item.CompanyID"
                        :label="item.CompanyTitle"
                        :value="item.CompanyID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="填表人姓名">
                <el-input v-model="userInfo.userName" size="small" style="width:125px;" disabled></el-input>
                <label style="color:#606266;margin:0 8px 0 50px;">费用发生者姓名</label>
                <el-select v-model="form.chargeStaffID" filterable size="small" style="width:200px;" placeholder="请选择费用发生者姓名">
                    <el-option
                        v-for="item in form.practicalNameArr"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
                <el-checkbox v-model="checked1" @change="changePracticalName">显示离职员工</el-checkbox>
            </el-form-item>

            <el-form-item label="凭证号" class="firstBg" style="padding-top:3px;">
                <el-input v-model="form.warrantNumber" size="small" style="width:600px;" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="是否有发票">
                <div style="width:600px;position:relative;">
                    <el-radio v-model="form.hasInvoice" label="1">有</el-radio>
                    <el-radio v-model="form.hasInvoice" label="0" style="margin-left:20px;" @change="form.payType='0'">无</el-radio>
                    <label style="color:#606266;margin:0 8px 0 77px;">单据张数</label>
                    <el-input v-model="form.billCount" size="small" style="width:60px;" placeholder=""></el-input>
                    <span style="color:#e51c23;position:absolute;right:0px;">您目前借款：<span>{{form.borrowSum}}&nbsp;元</span></span>
                </div>
            </el-form-item>

            <el-form-item label="资金性质">
                <el-radio v-model="form.payType" label="0">现金</el-radio>
                <el-radio v-model="form.payType" label="1" style="margin-left:20px;" :disabled="form.hasInvoice=='0'">支票</el-radio>
                <el-radio v-model="form.payType" label="2" style="margin-left:20px;" :disabled="form.hasInvoice=='0'">银行汇款</el-radio>
                <el-radio v-model="form.payType" label="3" style="margin-left:20px;" :disabled="form.hasInvoice=='0'">汇款</el-radio>
                <el-radio v-model="form.payType" label="4" style="margin-left:20px;">虚拟账户</el-radio>
                <el-radio v-model="form.payType" label="5" style="margin-left:20px;">其他</el-radio>
            </el-form-item>

            <el-form-item label="摘要" class="ReceiveApplyDetail_signatory">
                <el-input v-model="form.summary" size="small" type="textarea" :rows="2" style="width:600px;padding: 4px 0px 7px 0;" placeholder="请输入摘要"></el-input>
            </el-form-item>

            <el-form-item label="收款单位名称" v-show="form.payType=='3'||form.payType=='1'||form.payType=='2'">
                <el-select v-model="form.customerID" size="small" style="width:600px;" @change="getBankDetail" filterable allow-create placeholder="请选择收款单位">
                    <el-option
                        v-for="item in form.CustomerList"
                        :key="item.CustomerID"
                        :label="item.CompanyTitle"
                        :value="item.CustomerID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="开户银行" v-show="form.payType=='3'||form.payType=='1'||form.payType=='2'">
                <el-input v-model="form.bank" size="small" style="width:600px;" placeholder="请输入开户银行"></el-input>
            </el-form-item>

            <el-form-item label="银行账号" v-show="form.payType=='3'||form.payType=='1'||form.payType=='2'">
                <el-input v-model="form.bankAccount" size="small" style="width:600px;" placeholder="请输入银行账号"></el-input>
            </el-form-item>

            <el-form-item label="金额" class="secondBg" style="padding-top:3px;">
                <el-input v-model="form.money" @keyup.native="changeMoney" size="small" style="width:100px;" placeholder="请输入金额"></el-input>
                <label style="color:#606266;margin:0 8px;">币种</label>
                <el-select v-model="form.rateID" size="small" style="width:100px;" placeholder="请选择收款单位">
                    <el-option
                        v-for="item in form.RateArr"
                        :key="item.RateID"
                        :label="item.RateName"
                        :value="item.RateID">
                    </el-option>
                </el-select>
                <label style="color:#606266;margin:0 8px;">大写</label>
                <el-input v-model="transformCapital" size="small" style="width:296px;" placeholder="请输入大写金额"></el-input>
            </el-form-item>

            <el-form-item label="还现金" style="padding-top:3px;">
                <el-input v-model="form.returnCash" size="small" style="width:600px;" placeholder="请输入金额"></el-input>
            </el-form-item>

            <el-form-item label="资金分类" class="thirdBg" style="padding-top:3px;">
                 <el-select v-model="form.bigTypeID" size="small" style="width:600px;" @change="getSmallType" placeholder="请选择资金分类">
                    <el-option
                        v-for="item in form.BigTypeArr"
                        :key="item.BigTypeID"
                        :label="item.BigTypeName"
                        :value="item.BigTypeID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="资金小类" class="thirdBg">
                 <el-select v-model="form.smallTypeID" size="small" style="width:600px;" @change="getSubject" placeholder="请选择资金小类">
                    <el-option
                        v-for="item in form.SmallTypeArr"
                        :key="item.SmallTypeID"
                        :label="item.SmallTypeName"
                        :value="item.SmallTypeID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="资金科目" class="thirdBg">
                 <el-select v-model="form.subjectID" size="small" style="width:600px;" placeholder="请选择资金科目">
                    <el-option
                        v-for="item in form.SubjectArr"
                        :key="item.SubjectID"
                        :label="item.SubjectName"
                        :value="item.SubjectID">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- let obj = {"OutType":"","DetailID":"","Ratio":""} -->
            <el-form-item label="资金出处" class="thirdBg smallTableHeight ellipsis ReceiveApplyDetail_signatory">
                <el-table :data="form.billOutsList" style="width:600px;display:block;margin:5px 0 10px 0;line-height:31px;margin-bottom:8px;" :header-cell-style="getRowClass" border max-height="400">
                    <el-table-column  prop="OutType" align="center" label="资金出处" width="140">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.OutType" @change="changeOutType(scope)" size="small" placeholder="资金出处">
                                <el-option
                                    v-for="item in form.OutBillNameList"
                                    :key="item.OutBill"
                                    :label="item.OutBill"
                                    :value="item.OutBill">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="DetailID" align="center"  label="出处详细">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.DetailID" size="small" placeholder="请选择出处详细">
                                <el-option
                                    v-for="item in scope.row.Array"
                                    :key="item.DetailID"
                                    :label="item.DetailName"
                                    :value="item.DetailID">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="Ratio" align="center"  label="百分比(%)" width="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.Ratio" size="small" placeholder=""></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center"  width="80">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="danger"
                                @click="deleteCategory(scope.row,scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                    <div style="margin:10px;" slot="append">
                        <el-button type="primary" @click="clickAddOutBill" size="small">添加行</el-button> 
                    </div>
                </el-table>
            </el-form-item>
            
            <el-form-item label="详细说明" class="thirdBg ReceiveApplyDetail_signatory">
                <el-input v-model="form.note" size="small" type="textarea" :rows="4" style="width:600px;padding: 4px 0px 7px 0;" placeholder="请输入详细说明"></el-input>
            </el-form-item>

            <el-form-item class="thirdBg">
                <el-button size="mini" type="primary" @click="clickUploadFile" style="margin-bottom:8px;">添加附件</el-button>
                <div v-for="(item,index) in uploadArr" :key="index" class="uploadDiv">
                    <div>
                        <img v-bind:src="item.imgPath">
                        <span class="name" style="margin-left: 10px;" :title="item.fileName">{{ item.fileName }}</span>
                        <span class="del"  @click="delFile(item,index)">删除</span>
                    </div>
                </div>
                <div class="uploadImages">
                    <div class="imagediv" @click="borwserImage(item)" v-for="(item,number) in form.images" :key="item.compressImage">
                        <img :src="item.compressImage" alt="">
                        <div class="deleteImgBtn iconfont" @click.stop="deleteImage(item,number)">&#xe69a;</div>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="审批人">
                <div>
                    <label class="labeleg" :disabled="true">{{form.FinanceSignManagerName}}</label>
                </div>
                <div>
                    <label class="labeleg" :disabled="true">{{form.FinanceSignManagerName2}}</label>
                </div>
                <div>
                    <label class="labeleg" :disabled="true">{{form.FinanceSignManagerName3}}</label>
                </div>
            </el-form-item>
            <el-form-item label="追加审批人" style="transform:translateY(-8px);">
                <el-select v-model="form.sidAdditionalSigner1" filterable size="small" style="width:220px;" placeholder="请选择追加审批人">
                    <el-option
                        v-for="item in form.plusSignManagerNameArr"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
                <el-select v-model="form.sidAdditionalSigner2" filterable size="small" style="width:220px;margin-left:34px;" placeholder="请选择追加审批人">
                    <el-option
                        v-for="item in form.plusSignManagerNameArr"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
                <el-checkbox v-model="checked2" style="margin-left:10px;" @change="changePlusSignManagerName">显示离职员工</el-checkbox>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { GetRateSets,getCompany,findStaffByStaffID,getAllBigType,
        getSmallType,getSubject,findAllRetiredStaffs,
        getOutBill,getOutBillDetail,getMarginMoneySumByStaffID,delChargeBillImg,
        getCustomerManage,addChargeAttachment,addChargeBill,getChargeBillByID } from '@/js/api'
import { showLoading,closeLoading,money,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'expenseApplyDetail',
    data(){
        return {
            title:"",
            disabled:true,
            checked1:false,
            checked2:false,
            pathArr:[],
            uploadArr:[],
            // OutsList:[],
            pageNo:1,
            pageSize:1000,
            customerType:"1",
            delImgUrl:[],
            // lixiaowei
            noCompany:false,
            form: {
                chargeBillID:"",
                chargeBillType:"01",
                companyID:"",
                CompanyArr:[],
                chargeStaffID:"",
                practicalNameArr:[],
                hasInvoice:"1",
                warrantNumber:"",
                payType:"0",
                billCount:"1",
                customerID:"",
                CustomerList:[],
                bank:"",
                bankAccount:"",
                money:"",
                summary:"",
                borrowSum:"",
                rateID:"",
                RateArr:[],
                returnCash:"",
                bigTypeID:"",
                BigTypeArr:[],
                smallTypeID:"",
                SmallTypeArr:[],
                subjectID:"",
                SubjectArr:[],
                billOutsList:[],//资金出处大表信息
                OutBillNameList:[],//资金出处列表
                DetailOutBillList:[],//出处详细列表
                note:"",
                FinanceSignManager:"",
                FinanceSignManager2:"",
                FinanceSignManager3:"",
                FinanceSignManagerName:"",
                FinanceSignManagerName2:"",
                FinanceSignManagerName3:"",
                sidAdditionalSigner1:"",
                sidAdditionalSigner2:"",
                plusSignManagerNameArr:[],
                attachmentID:[],
                images:[]
            },
            
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        this.form.practicalNameArr = this.findAllstaffs;
        this.form.plusSignManagerNameArr = this.findAllstaffs;
        if (this.$route.meta.type=="add") {  
            this.title = "添加报销申请";
            this.getAllBigType();
        }else if (this.$route.meta.type=="update") {
            this.title = "修改报销申请";
        }
        this.loadAddList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        //获得所有员工
        findAllstaffs(){
            let staffs = [];
            for(let i=0;i<this.allStaffs.length;i++){
                let json = {  
                    StaffID:this.allStaffs[i].StaffID,
                    StaffName:this.allStaffs[i].StaffName
                }
                staffs.push(json);
            }
            return staffs;
        },
        bigType(){
            if (this.form.BigTypeArr.length!=0) {
                let obj = this.form.BigTypeArr.find((item)=>{
                    return this.form.bigTypeID === item.BigTypeID;
                })
                return obj.BigTypeName;
            }
        },
        smallType(){
            if (this.form.SmallTypeArr.length!=0) {
                let obj = this.form.SmallTypeArr.find((item)=>{
                    return this.form.smallTypeID === item.SmallTypeID;
                })
                return obj.SmallTypeName;
            }
        },
        subject(){
            if (this.form.SubjectArr.length!=0) {
                let obj = this.form.SubjectArr.find((item)=>{
                    return this.form.subjectID === item.SubjectID;
                })
                return obj.SubjectName;
            }
        },
        rateName(){
            if (this.form.RateArr.length!=0) {
                let obj = this.form.RateArr.find((item)=>{
                    return this.form.rateID  === item.RateID;
                })
                return obj.RateName;
            }
        },
        receiverTitle(){
            if (this.form.CustomerList.length!=0) {
                let obj = this.form.CustomerList.find((item)=>{
                    return this.form.customerID === item.CustomerID;
                })
                if(obj){
                    return obj.CompanyTitle;
                }else{
                    return '';
                }
            }
        },
        transformCapital(){
            let value = this.form.money;
            var stmp = "";
            //输入框为空时不显示大写
            if(value==stmp) {
                return;
            }
            var ms = value.replace(/[^\d\.]/g,"").replace(/(\.\d{2}).+$/,"$1").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0");
            var txt = ms.split(".");
            value = stmp = txt[0]+(txt.length>1?"."+txt[1]:"");
            var MAXIMUM_NUMBER = 99999999999.99;
            var CN_ZERO = "零";
            var CN_ONE = "壹";
            var CN_TWO = "贰";
            var CN_THREE = "叁";
            var CN_FOUR = "肆";
            var CN_FIVE = "伍";
            var CN_SIX = "陆";
            var CN_SEVEN = "柒";
            var CN_EIGHT = "捌";
            var CN_NINE = "玖";
            var CN_TEN = "拾";
            var CN_HUNDRED = "佰";
            var CN_THOUSAND = "仟";
            var CN_TEN_THOUSAND = "万";
            var CN_HUNDRED_MILLION = "亿";
            var CN_DOLLAR = "元";
            var CN_TEN_CENT = "角";
            var CN_CENT = "分";
            var CN_INTEGER = "整";
                
            // Variables:
            var integral; // Represent integral part of digit number.
            var decimal; // Represent decimal part of digit number.
            var outputCharacters; // The output result.
            var parts;
            var digits, radices, bigRadices, decimals;
            var zeroCount;
            var i, p, d;
            var quotient, modulus;
                
            // Validate input string:
            //value = value.toString();
            //if (value == "") {
            //alert("金额不能为空!");
            //return "";
            //}
            //if (value.match(/[^,.\d]/) != null) {
            //alert("金额为无效字符串!");
            //return "";
            //}
            //if ((value).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
            //alert("金额格式错误!");
            //return "";
            //}
                
            // Normalize the format of input digits:
            value = value.replace(/,/g, ""); // Remove comma delimiters.
            value = value.replace(/^0+/, ""); // Trim zeros at the beginning.
            // Assert the number is not greater than the maximum number.
            if (Number(value) > MAXIMUM_NUMBER) {
                this.$message({
                        showClose: true,
                        message: '金额太大不能转换',
                        type: 'error'
                    });
                return "";
            }
                
            // http://www.knowsky.com/ Process the coversion from currency digits to characters:
            // Separate integral and decimal parts before processing coversion:
            parts = value.split(".");
            if (parts.length > 1) {
                integral = parts[0];
                decimal = parts[1];
                // Cut down redundant decimal digits that are after the second.
                decimal = decimal.substr(0, 2);
            }else {
                integral = parts[0];
                decimal = "";
            }
            // Prepare the characters corresponding to the digits:
            digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
            radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
            bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
            decimals = new Array(CN_TEN_CENT, CN_CENT);
            // Start processing:
            outputCharacters = "";
            // Process integral part if it is larger than 0:
            if (Number(integral) > 0) {
                zeroCount = 0;
                for (i = 0; i < integral.length; i++) {
                    p = integral.length - i - 1;
                    d = integral.substr(i, 1);
                    quotient = p / 4;
                    modulus = p % 4;
                    if (d == "0") {
                        zeroCount++;
                    }else {
                        if (zeroCount > 0){
                            outputCharacters += digits[0];
                        }
                        zeroCount = 0;
                        outputCharacters += digits[Number(d)] + radices[modulus];
                    }
                    if (modulus == 0 && zeroCount < 4) {
                        outputCharacters += bigRadices[quotient];
                    }
                }
                outputCharacters += CN_DOLLAR;
            }
            // Process decimal part if there is:
            if (decimal != "") {
                for (i = 0; i < decimal.length; i++) {
                    d = decimal.substr(i, 1);
                    if (d != "0") {
                        outputCharacters += digits[Number(d)] + decimals[i];
                    }
                }
            }
            // Confirm and return the final output string:
            if (outputCharacters == "") {
                outputCharacters = CN_ZERO + CN_DOLLAR;
            }
            if (decimal == "") {
                outputCharacters += CN_INTEGER;
            }
            outputCharacters = outputCharacters;
            
            return outputCharacters;
        }
    },
    methods:{
        ...mapMutations([
            'SET_BROWSERIMG'
        ]),
        // 点击确认保存模板
        confirm(){
            // console.log(this.form.attachmentID)
            let billOutsList = [];
            for(let i=0;i<this.form.billOutsList.length;i++){
                let json = {
                    "OutType":this.form.billOutsList[i].OutType,
                    "DetailID":this.form.billOutsList[i].DetailID,
                    "DetailName":"",
                    "Ratio":this.form.billOutsList[i].Ratio
                }
                for(let j=0;j<this.form.billOutsList[i].Array.length;j++){
                    if(this.form.billOutsList[i].Array[j].DetailID==this.form.billOutsList[i].DetailID){
                        json.DetailName = this.form.billOutsList[i].Array[j].DetailName;
                    }
                }
                billOutsList.push(json);
            }
            let json = {
                id:"-1",
                staffID : this.userInfo.userStaffID,
                hasInvoice : this.form.hasInvoice,
                payType : this.form.payType,
                chargeStaffID : this.form.chargeStaffID,
                money : this.form.money,
                rateID : this.form.rateID,
                companyID : this.form.companyID?this.form.companyID:"-1",
                bigType : this.bigType,
                smallType : this.smallType,
                subject : this.subject,
                rateName : this.rateName,
                receiverTitle : this.noCompany?this.form.customerID:this.receiverTitle,
                bigTypeID : this.form.bigTypeID,
                smallTypeID : this.form.smallTypeID,
                subjectID : this.form.subjectID,
                sidAdditionalSigner1 : this.form.sidAdditionalSigner1?this.form.sidAdditionalSigner1:"-1",
                sidAdditionalSigner2 : this.form.sidAdditionalSigner2?this.form.sidAdditionalSigner2:"-1",
                billCount : this.form.billCount,
                warrantNumber : this.form.warrantNumber,
                customerID : this.noCompany?'-1':(this.form.customerID?this.form.customerID:"-1"),
                bank : this.form.bank,
                bankAccount : this.form.bankAccount,
                chargeBillType : this.form.chargeBillType,
                note : this.form.note,
                transformCapital : this.transformCapital,
                returnCash : this.form.returnCash?this.form.returnCash:"0",
                summary : this.form.summary,
                billOutsList : JSON.stringify(billOutsList),
                signUser:"",
                ccUser : "",
                path : "",
                photoList : "",
                examineID : "",
                attachment : this.pathArr.join(','),
                attachmentID : this.form.attachmentID.length!=0?this.form.attachmentID.join(","):""
            }
            if (this.form.FinanceSignManager!="-1") {
                json.signUser = this.form.FinanceSignManager
            }
            if (this.form.FinanceSignManager2!="-1") {
                json.signUser += ","+this.form.FinanceSignManager2
            }
            if (this.form.FinanceSignManager3!="-1") {
                json.signUser += ","+this.form.FinanceSignManager3
            }
            if (this.form.payType == "0"||this.form.payType == "4"||this.form.payType == "5") {
                json.receiverTitle = "";
                json.customerID = "-1";
                json.bank = "";
                json.bankAccount = "";
            }
            // for (let i = 0; i < this.pathArr.length; i++) {
            //     if (i==0) {
            //         json.attachment = this.uploadArr[i].fileName.split(".")[0] +":"+ this.pathArr[i];
            //     }else{
            //         json.attachment += "," + this.uploadArr[i].fileName.split(".")[0] +":"+ this.pathArr[i];
            //     }
            // }
            if(json.staffID==""){
                this.$message.error({
                    message:"填表人ID错误"
                });
                return;
            }
            if(json.chargeStaffID==""){
                this.$message.error({
                    message:"请选择费用发生者"
                });
                return;
            }
            if(json.money==""){
                this.$message.error({
                    message:"请填写金额"
                });
                return;
            }
            if(json.rateName==""){
                this.$message.error({
                    message:"请选择币种名称"
                });
                return;
            }
            if(json.bigType==""){
                this.$message.error({
                    message:"请选择资金分类"
                });
                return;
            }
            if(this.form.billOutsList.length==0){
                this.$message.error({
                    message:"请填写资金出处"
                });
                return;
            }
            if(json.billCount==""){
                this.$message.error({
                    message:"请填写单据张数"
                });
                return;
            }
            if(json.chargeBillType==""){
                this.$message.error({
                    message:"请选择财务类型"
                });
                return;
            }
            if(json.note==""){
                this.$message.error({
                    message:"请填写详细说明"
                });
                return;
            }
            if(json.summary==""){
                this.$message.error({
                    message:"请填写摘要"
                });
                return;
            }
            if (this.$route.meta.type=="update") {
                json.id = this.form.chargeBillID;
                json.examineID = this.$route.params.ChargeID.split("&")[1]
                let imgUr = this.delImgUrl.length!=0?this.delImgUrl.join(","):""
                delChargeBillImg(json.examineID,imgUr).then((result)=>{
                    
                })
                .catch((err)=>{
                    alertError(this,"2198");
                });
            }
            console.log(json);
            let loading = showLoading();
            addChargeBill(json).then((result)=>{
                closeLoading(loading);
                console.log(result)
                if (this.$route.meta.type=="add") {
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"添加成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else if(result.data.Result=='0'){
                        this.$message({
                            message:"添加失败",
                        });
                    }
                }
                if (this.$route.meta.type=="update") {
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"修改成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else if(result.data.Result=='0'){
                        this.$message({
                            message:"修改失败",
                        });
                    }
                }
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"2106");
            });
        },
        //加载申请页面
        loadAddList(){
            let staffID = this.userInfo.userStaffID;
            let cosNum = this.userInfo.cosNum;
            let loading = showLoading();
            Promise.all([
                GetRateSets(cosNum),
                getCompany(cosNum),
                findStaffByStaffID(staffID),
                getMarginMoneySumByStaffID(cosNum,staffID)
            ]).then((result) => {
                if (this.$route.meta.type == "add") {
                    this.getCustomerManage();
                    closeLoading(loading);
                }
                this.form.RateArr = result[0].data.data;
                this.form.rateID = result[0].data.data[0].RateID;
                this.form.CompanyArr = result[1].data.data;
                this.form.companyID = result[1].data.data[0].CompanyID;
                this.form.FinanceSignManager = result[2].data.data[0].FinanceSignManager;
                this.form.FinanceSignManager2 = result[2].data.data[0].FinanceSignManager2;
                this.form.FinanceSignManager3 = result[2].data.data[0].FinanceSignManager3;
                this.getFinanceSignManagerName();
                this.form.borrowSum = result[3].data.Sum;
                if (this.$route.meta.type=="update") {
                    this.loadUpdateList(loading);
                }
            })
        },
        //加载修改页面
        loadUpdateList(loading){
            let id = this.$route.params.ChargeID.split("&")[0];
            getChargeBillByID(id).then((result)=>{
                let obj = result.data;
                this.form.chargeBillID = obj.ChargeBillID;
                this.form.chargeBillType = obj.ChargeBillType;
                this.form.companyID = obj.CompanyID;
                this.form.chargeStaffID = obj.ChargeStaffID;
                this.form.hasInvoice = obj.HasInvoice=="True"?"1":"0";
                this.form.warrantNumber = obj.WarrantNumber;
                this.form.payType = obj.PayType;
                this.form.billCount = obj.BillCount;
                // lixiaowei
                if(obj.ReceiverID!=-1){
                    this.form.customerID = obj.ReceiverID;
                }else{
                    this.form.customerID = obj.ReceiverTitle;
                    this.noCompany = true;
                }
                this.form.bank = obj.Bank?obj.Bank:"";
                this.form.bankAccount = obj.BankAccount?obj.BankAccount:"";
                this.form.money = obj.Money;
                this.changeMoney();
                this.form.summary = obj.Summary;
                this.form.rateID = obj.MoneyUnitID;
                this.form.returnCash = obj.ReturnCash;
                this.form.bigTypeID = obj.BigTypeID;
                this.form.smallTypeID = obj.SmallTypeID;
                this.form.subjectID = obj.SubjectID;
                for(let i=0;i<obj.BillOuts.length;i++){
                    obj.BillOuts[i].Array = [];
                }
                this.form.billOutsList = obj.BillOuts;//资金出处大表信息
                this.getAllBigType();
                this.getCustomerManage();
                this.form.note = obj.Note;
                this.form.sidAdditionalSigner1 = obj.AddFinanceStaff[0]?obj.AddFinanceStaff[0].ApprovalUser:"";
                this.form.sidAdditionalSigner2 = obj.AddFinanceStaff[1]?obj.AddFinanceStaff[1].ApprovalUser:"";

                // if (this.form.billOutsList.length!=0) {
                //     this.getOutBill(obj.BigTypeID);
                // }
                
                for (let i = 0; i < obj.Attachment.length; i++) {
                    let obj1 = {"ID":"","fileName":"","type":"","imgPath":""};
                    let array = obj.Attachment[i].AttachmentPath.split(".")
                    obj1.type = array[array.length-1];
                    if(obj1.type=="doc" || obj1.type=="docx"){
                        obj1.imgPath = "static/images/doc.png";
                    }else if(obj1.type=="xlsx" || obj1.type=="xls"){
                        obj1.imgPath = "static/images/xlsx.png";
                    }else if(obj1.type=="txt"){
                        obj1.imgPath = "static/images/txt.png";
                    }else if(obj1.type=="mp3"){
                        obj1.imgPath = "static/images/mp3.png";
                    }else if(obj1.type=="mp4"){
                        obj1.imgPath = "static/images/mp4.png";
                    }else if(obj.type=="jpg" || obj1.type=="jpeg" || obj1.type=="png" || obj1.type=="bmp"){
                        obj1.imgPath = "static/images/pic.png";
                    }else if(obj.type=="pdf"){
                        obj1.imgPath = "static/images/pdf.png";
                    }else if(obj.type=="imageText"){
                        obj1.imgPath = "static/images/imageText.png";
                    }else{
                        obj1.imgPath = "static/images/undefined.png";
                    }
                    obj1.fileName = obj.Attachment[i].AttachmentName;
                    obj1.ID = obj.Attachment[i].AttachmentID;
                    this.uploadArr.push(obj1);
                }
                let images = [];
                let everyImage = '';
                if(obj.Img1){
                    everyImage = obj.Img1;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(obj.Img2){
                    everyImage = obj.Img2;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(obj.Img3){
                    everyImage = obj.Img3;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(obj.Img4){
                    everyImage = obj.Img4;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(obj.Img5){
                    everyImage = obj.Img5;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(obj.Img6){
                    everyImage = obj.Img6;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(obj.Img7){
                    everyImage = obj.Img7;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                if(obj.Img8){
                    everyImage = obj.Img8;
                    let compressImage = everyImage.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
                    let oldImages = compressImage.split('/');
                    if(oldImages[oldImages.length-1].substring(0,2)=='s_'){
                        oldImages[oldImages.length-1] = oldImages[oldImages.length-1].substring(2,oldImages[oldImages.length-1].length);
                    }
                    let oldImage = oldImages.join('/');
                    images.push({
                        AttachmentPath: everyImage,
                        compressImage: compressImage,
                        oldImage: oldImage,
                        isNew:false
                    })
                }
                this.form.images = images;
                closeLoading(loading);
                // console.log(this.uploadArr)
            })
            .catch((err)=>{
                alertError(this,"1175");
                closeLoading(loading);
            });
        },
        //获得收款单位名称
        getCustomerManage(){
            let cosNum = this.userInfo.cosNum;
            getCustomerManage(cosNum,this.pageNo,this.pageSize,this.customerType,'','CustomerNum','').then((result)=>{
                this.form.CustomerList = result.data.data;
                // if (this.$route.meta.type == "add"||this.form.customerID=="") {
                //     if(this.form.CustomerList.length>0){
                //         this.form.customerID = this.form.CustomerList[0].CustomerID;
                //     }
                // }
                if(this.form.customerID){
                    this.getBankDetail(this.form.customerID);
                }
            })
            .catch((err)=>{
                console.log(err)
                alertError(this,"1108");
            });
        },
        getBankDetail(value){
            if (value!="") {
                let obj = this.form.CustomerList.find((item)=>{
                    return item.CustomerID === value;
                })
                // lixiaowei
                if(obj){
                    this.form.bank = obj.Bank;
                    this.form.bankAccount = obj.BankAccount;
                    this.noCompany = false;
                }else{
                    this.noCompany = true;
                }
            }
        },
        //金额转换
        changeMoney(){
            // console.log(obj.target._value)
            let value = this.form.money;
            value = value.replace(/[^\d\.]/g,"").replace(/(\.\d{2}).+$/,"$1").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0");
            // value = value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符  
            // value = value.replace(/^\./g,""); //验证第一个字符是数字而不是  
            // value = value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
            // value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
            // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
            if(value.indexOf(".")< 0 && value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                value= parseFloat(value); 
            } 
            // console.log(value);
            value = money(value)
            this.form.money = value;
        },
        //显示离线员工
        changePracticalName(){
            if(this.checked1){
                this.findAllRetiredStaffs(1);
            }else{
                this.form.practicalNameArr = this.findAllstaffs;
            }
        },
        changePlusSignManagerName(){
            if(this.checked2){
                this.findAllRetiredStaffs(2);
            }else{
                this.form.plusSignManagerNameArr = this.findAllstaffs;
            }
        },
        //离线员工列表
        findAllRetiredStaffs(typeNum){
            let AllRetiredStaffsArr = [];
            findAllRetiredStaffs().then((result)=>{
                if(result){
                    if(result.data.data.length>0){
                        for(let i=0;i<result.data.data.length;i++){
                            let json = {
                                StaffID:result.data.data[i].StaffID,
                                StaffName:result.data.data[i].StaffName
                            }
                            AllRetiredStaffsArr.push(json);
                        }
                        if (typeNum == 1) {
                            this.form.practicalNameArr = this.form.practicalNameArr.concat(AllRetiredStaffsArr);
                        }else if (typeNum == 2){
                            this.form.plusSignManagerNameArr = this.form.plusSignManagerNameArr.concat(AllRetiredStaffsArr);
                        }
                    }
                }
            }).catch((err)=>{
                alertError(this,"1053");
            });
        },
        //获得审批人
        getFinanceSignManagerName(){
            for (let i = 0; i < this.allStaffs.length; i++) {
                if (this.form.FinanceSignManager == this.allStaffs[i].StaffID) {
                    this.form.FinanceSignManagerName = this.allStaffs[i].StaffName;
                    continue;
                }else if (this.form.FinanceSignManager2 == this.allStaffs[i].StaffID) {
                    this.form.FinanceSignManagerName2 = this.allStaffs[i].StaffName; 
                    continue;
                }else if (this.form.FinanceSignManager3 == this.allStaffs[i].StaffID) {
                    this.form.FinanceSignManagerName3 = this.allStaffs[i].StaffName;
                    continue;
                }
            }
        },
        //获得资金分类
        getAllBigType(){
            // let loading = showLoading();
            let cosNum = this.userInfo.cosNum;
            getAllBigType(cosNum).then((result)=>{
                this.form.BigTypeArr = result.data.data;
                if(result.data.data.length>0){
                    if (this.$route.meta.type == "add") {
                        this.form.bigTypeID = result.data.data[0].BigTypeID;
                    }
                    this.getSmallType();
                }
            })
            .catch((err)=>{
                alertError(this,"1167");
            });
        },
        //获得资金小类
        getSmallType(){
            let cosNum = this.userInfo.cosNum;
            let bigTypeID = this.form.bigTypeID;
            getSmallType(cosNum,bigTypeID).then((result)=>{
                this.form.SmallTypeArr = result.data.data;result.data.data;
                if(result.data.data.length>0){
                    if (this.$route.meta.type == "add") {
                        this.form.smallTypeID = result.data.data[0].SmallTypeID;
                    }
                    this.getSubject();
                }
            }).catch((err)=>{
                alertError(this,"1169");
            });
            // if (this.form.billOutsList.length!=0) {
                this.getOutBill();
            // }
        },
        //获得资金科目
        getSubject(){
            let smallTypeID = this.form.smallTypeID;
            let cosNum = this.userInfo.cosNum;
            let bigTypeID = this.form.bigTypeID;
            getSubject(cosNum,bigTypeID,smallTypeID).then((result)=>{
                this.form.SubjectArr = result.data.data;
                if(result.data.data.length>0){
                    if (this.$route.meta.type == "add") {
                        this.form.subjectID = result.data.data[0].SubjectID;
                    }
                }
            }).catch((err)=>{
                alertError(this,"1170");
            });
        },
        //添加资金出处
        clickAddOutBill(){
            let obj = {
                OutType:"",
                DetailID:"",
                DetailName:"",
                Ratio:"",
                Array:[]
            }
            let cosNum = this.userInfo.cosNum;
            let outBill = this.form.OutBillNameList[0].OutBill;
            getOutBillDetail(cosNum,outBill).then((result)=>{
                obj.Array = result.data.data;
                if(obj.Array.length>0){
                    obj.OutType = outBill;
                    obj.DetailID = obj.Array[0].DetailID;
                    obj.DetailName = obj.Array[0].DetailName;
                    this.form.billOutsList.push(obj);
                    if (this.form.billOutsList.length == 1) {
                        this.form.billOutsList[0].Ratio = 100;
                    }else if (this.form.billOutsList.length > 1){
                        for (let i = 0; i < this.form.billOutsList.length; i++) {
                            this.form.billOutsList[i].Ratio = "";
                        }
                    }
                }
            }).catch((err)=>{
                alertError(this,"1173");
            });
        },
        //获得资金出处信息
        getOutBill(ID){
            let cosNum = this.userInfo.cosNum;
            let bigTypeID;
            if (ID) {
                bigTypeID = ID
            }else{
                bigTypeID = this.form.bigTypeID;
            }
            getOutBill(cosNum,bigTypeID).then((result)=>{
                this.form.OutBillNameList = result.data.data;
                if (this.$route.meta.type == "add") {
                    // this.form.billOutsList[this.form.billOutsList.length-1].OutType = result.data.data[0].OutBill;
                    this.form.billOutsList = [];
                }else{
                    
                    let promiseArr = [];
                    for(let i=0;i<this.form.billOutsList.length;i++){
                        promiseArr.push(getOutBillDetail(cosNum,this.form.billOutsList[i].OutType));
                    }
                    Promise.all(promiseArr)
                    .then((result)=>{
                        for(let i=0;i<this.form.billOutsList.length;i++){
                            this.form.billOutsList[i].Array = result[i].data.data;
                        }
                    })
                    .catch((error)=>{
                        alertError(this,"1173");
                    });
                }
            })
            .catch((err)=>{
                alertError(this,"1172");
            });
        },
        // 修改资金出处
        changeOutType(scope){
            console.log(scope)
            let outBill = scope.row.OutType;
            let cosNum = this.userInfo.cosNum;
            getOutBillDetail(cosNum,outBill).then((result)=>{
                scope.row.Array = result.data.data;
                if(scope.row.Array.length>0){
                    scope.row.DetailID = scope.row.Array[0].DetailID;
                    scope.row.DetailName = scope.row.Array[0].DetailName;
                }else{
                    scope.row.DetailID = "";
                    scope.row.DetailName = "";
                }
            }).catch((err)=>{
                alertError(this,"1173");
            });
        },
        deleteCategory(item,index){
            this.form.billOutsList.splice(index,1); 
        },
        //改变表头颜色
        getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return 'background:#38ADFF;color:#fff;'
			} else {
				return ''
			}
        },

        //上传文件
        clickUploadFile(){
            document.getElementById("uploadCloudFile").click();
        },
        uploadFile(e){
            let file = e.target.files[0];
            let obj = {"fileName":"","type":"","imgPath":""}
            obj.fileName = file.name;
            let names = obj.fileName.split(".");
            obj.type = names[names.length-1];
            if(obj.type=="doc" || obj.type=="docx"){
                obj.imgPath = "static/images/doc.png";
            }else if(obj.type=="xlsx" || obj.type=="xls"){
                obj.imgPath = "static/images/xlsx.png";
            }else if(obj.type=="txt"){
                obj.imgPath = "static/images/txt.png";
            }else if(obj.type=="mp3"){
                obj.imgPath = "static/images/mp3.png";
            }else if(obj.type=="mp4"){
                obj.imgPath = "static/images/mp4.png";
            }else if(obj.type=="jpg" || obj.type=="jpeg" || obj.type=="png" || obj.type=="bmp"){
                obj.imgPath = "static/images/pic.png";
            }else if(obj.type=="pdf"){
                obj.imgPath = "static/images/pdf.png";
            }else if(obj.type=="imageText"){
                obj.imgPath = "static/images/imageText.png";
            }else{
                obj.imgPath = "static/images/undefined.png";
            }
            
            let loading = showLoading();
            addChargeAttachment(file).then((result) => {
                closeLoading(loading);
                let path = result.data.Path;
                if(result.data.Result=="1"){
                    this.pathArr.push(file.name+':'+path);
                    this.uploadArr.push(obj);
                }else{
                }
            })
            .catch((err)=>{
                alertError(this,"2192");
                closeLoading(loading);
            });
        },
        delFile(item,index){
            if (this.$route.meta.type=="update") {
                this.form.attachmentID.push(this.uploadArr[index].ID);
            }
            this.uploadArr.splice(index,1);
            this.pathArr.splice(index,1);
        },
        deleteImage(item,index){
            if(!item.isNew){
                this.delImgUrl.push(item.AttachmentPath);
            }
            this.form.images.splice(index,1);
        },
        borwserImage(item){
            this.SET_BROWSERIMG({
                imgPath:item.oldImage
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.expenseApplyDetail{
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
.firstBg{
    background: rgba(255, 182, 193,0.4);
}
.secondBg{
    background: #FFFACD;
}
.thirdBg{
    background: #dcdcdc;;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.el-table th, .el-table tr {
    background-color: #38ADFF;
}
.el-table .cell{
    color: #fff;
}
.uploadDiv div{
    display: flex;
    width:600px;
    height: 27px;
    margin-bottom:10px;
}
.uploadDiv div .name{
    margin-left: 10px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    line-height: 27px;
}
.uploadDiv div .del{
    margin-left: 10px;
    width: 40px;
    line-height: 27px;
    color:#38ADFF;
    cursor: pointer;
}
.uploadDiv img{  
    width:27px;
    height: 27px;
}
.uploadImages{
    display: flex;
    width:280px;
    margin-bottom:10px;
    flex-wrap: wrap;
}
.uploadImages > .imagediv{
    margin-right: 10px;
    margin-bottom: 10px;
    width:60px;
    height: 60px;
    display: inline-block;
    cursor: pointer;
    position: relative;
}
.imagediv > img{
    width: 100%;
    height: 100%;
    position: absolute;
    left:0;
    top:0;
}
.imagediv > .deleteImgBtn{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    background:rgba(0, 0, 0, .3);
    font-size:16px;
    line-height: 20px;
    text-align: center;
    color: #ffffff;
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
.labeleg[disabled=disabled]{
    color:#c0c4cc;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>