<template>
    <div class="templateDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="姓名">
                <el-input v-model="form.ChildName" size="small" style="width:400px;" placeholder="请输入姓名"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio v-model="form.ChildSex" label="0" style="margin-left:20px;">男</el-radio>
                <el-radio v-model="form.ChildSex" label="1" style="margin-left:20px;">女</el-radio>
            </el-form-item>
            <el-form-item label="出生日期">
                <el-date-picker
                    v-model="form.ChildBirthday"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    size="small"
                    placeholder="请选择出生日期"
                    style="width:400px;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="民族">
                <el-input v-model="form.ChildNation" size="small" style="width:400px;" placeholder="请输入民族"></el-input>
            </el-form-item>
            <el-form-item label="保险失效日期">
                <el-date-picker
                    v-model="form.ChildBirthday"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    size="small"
                    placeholder="请选择保险失效日期"
                    style="width:400px;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="头像">
                <div class="avatar" @click="clickUploadFile">
                    <i class="element-icon avatar-uploader-icon"></i>
                    <img :src="imagePath" v-show="imagePath" alt="">
                    <input name="file" type="file" id="childInfoUploadFile" style="display:none" accept=".png,.jpg,.jpeg" @change="childInfoFileChange"/>
                </div>
            </el-form-item>
            <el-form-item label="通知人">
                <el-radio v-model="form.ConnectPeople" label="爸爸" style="margin-left:20px;"></el-radio>
                <el-radio v-model="form.ConnectPeople" label="妈妈" style="margin-left:20px;"></el-radio>
                <el-radio v-model="form.ConnectPeople" label="本人" style="margin-left:20px;"></el-radio>
                <el-radio v-model="form.ConnectPeople" label="其他" style="margin-left:20px;"></el-radio>
                <el-input v-model="form.ConnectPeopleElse" v-show="form.ConnectPeople=='其他'" size="small" style="width:200px;margin-left:20px;" placeholder="请输入通知人"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="通知手机">
                <el-input v-model="form.ConnectPhone" size="small" style="width:400px;" placeholder="请输入通知手机"></el-input>
                <div class="redColor">*必填</div>
            </el-form-item>
            <el-form-item label="户籍">
                <el-input v-model="form.ChildHuji" size="small" style="width:400px;" placeholder="请输入户籍"></el-input>
            </el-form-item>
            <el-form-item label="幼儿证件类型">
                <el-select v-model="form.IdentityType" size="small" style="width:400px;" placeholder="请选择幼儿证件类型">
                    <el-option label="居民身份证" value="居民身份证"></el-option>
                    <el-option label="护照" value="护照"></el-option>
                    <el-option label="无证件" value="无证件"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="幼儿证件号码">
                <el-input v-model="form.IdentityCard" size="small" style="width:400px;" placeholder="请输入幼儿证件号码"></el-input>
            </el-form-item>
            <el-form-item label="餐费缴费科目" class="firstBg">
                <el-select v-model="form.MealFeeTypeID" size="small" placeholder="请选择餐费缴费科目" style="width:400px;" >
                    <el-option
                    v-for="item in mealFeeType"
                    :key="item.ID"
                    :label="item.PaymentName"
                    :value="item.ID">
                    </el-option>
                </el-select>
                <div class="grayColor">（为该生指定一个餐费标准）</div>
            </el-form-item>
            <el-form-item label="餐费退费科目" class="firstBg">
                <el-select v-model="form.MealFeeRefundTypeID" size="small" placeholder="请选择餐费退费科目" style="width:400px;" >
                    <el-option
                    v-for="item in mealFeeRefundType"
                    :key="item.ID"
                    :label="item.PaymentName"
                    :value="item.ID">
                    </el-option>
                </el-select>
                <!-- <el-input v-model="form.MealFeeRefundTypeID" size="small" style="width:400px;" ></el-input> -->
                <div class="grayColor">（为该生指定一个餐费退费标准）</div>
            </el-form-item>
            <el-form-item label="保育费缴费科目" class="firstBg">
                <el-select v-model="form.TuitionTypeID" size="small" placeholder="请选择保育费缴费科目" style="width:400px;" >
                    <el-option
                    v-for="item in tuitionType"
                    :key="item.ID"
                    :label="item.PaymentName"
                    :value="item.ID">
                    </el-option>
                </el-select>
                <!-- <el-input v-model="form.TuitionTypeID" size="small" style="width:400px;" ></el-input> -->
                <div class="grayColor">（为该生指定一个保育费标准）</div>
            </el-form-item>
            <el-form-item label="保育费退费科目" class="firstBg">
                <el-select v-model="form.TuitionRefundTypeID" size="small" placeholder="请选择保育费退费科目" style="width:400px;" >
                    <el-option
                    v-for="item in tuitionRefundType"
                    :key="item.ID"
                    :label="item.PaymentName"
                    :value="item.ID">
                    </el-option>
                </el-select>
                <!-- <el-input v-model="form.TuitionRefundTypeID" size="small" style="width:400px;" ></el-input> -->
                <div class="grayColor">（为该生指定一个保育费退费标准）</div>
            </el-form-item>
            <el-form-item label="餐费折扣率" class="firstBg">
                <el-input v-model="form.DiscountMealFee" size="small" style="width:400px;" placeholder="请输入餐费折扣率"></el-input>
                <div class="grayColor">（免费输入0,75折输入75，无折扣什么也不输）</div>
            </el-form-item>
            <el-form-item label="保育费折扣率" class="firstBg">
                <el-input v-model="form.DiscountTuition" size="small" style="width:400px;" placeholder="请输入保育费折扣率"></el-input>
                <div class="grayColor">（免费输入0,9折输入90，无折扣什么也不输）</div>
            </el-form-item>
            <el-form-item label="折扣率终止日" class="firstBg">
                <el-date-picker
                    v-model="form.DiscountUntil"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    size="small"
                    placeholder="请选择折扣率终止日"
                    style="width:400px;">
                </el-date-picker>
                <div class="grayColor">（必须输入月末最后一天）</div>
            </el-form-item>
            <el-form-item label="开户行" class="secondBg" style="margin-top:10px;">
                <el-select v-model="form.OpenBankId" size="small" style="width:400px;" placeholder="请选择开户行">
                    <el-option label="邮政银行" value="0100"></el-option>
                    <el-option label="中国工商银行" value="0102"></el-option>
                    <el-option label="中国农业银行" value="0103"></el-option>
                    <el-option label="中国银行" value="0104"></el-option>
                    <el-option label="中国建设银行" value="0105"></el-option>
                    <el-option label="交通银行" value="0301"></el-option>
                    <el-option label="中信银行" value="0302"></el-option>
                    <el-option label="中国光大银行" value="0303"></el-option>
                    <el-option label="中国民生银行" value="0305"></el-option>
                    <el-option label="广东发展银行" value="0306"></el-option>
                    <el-option label="深发展银行" value="0307"></el-option>
                    <el-option label="招商银行" value="0308"></el-option>
                    <el-option label="兴业银行" value="0309"></el-option>
                    <el-option label="中国平安银行" value="0410"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="卡号" class="secondBg">
                <el-input v-model="form.CarsNO" size="small" style="width:400px;" placeholder="请输入卡号"></el-input>
            </el-form-item>
            <el-form-item label="持卡人姓名" class="secondBg">
                <el-input v-model="form.UsrName" size="small" style="width:400px;" placeholder="请输入持卡人姓名"></el-input>
            </el-form-item>
            <el-form-item label="证件类型" class="secondBg">
                <el-select v-model="form.CertType" size="small" style="width:400px;" placeholder="请选择证件类型">
                    <el-option label="身份证" value="01"></el-option>
                    <el-option label="军官证" value="02"></el-option>
                    <el-option label="护照" value="03"></el-option>
                    <el-option label="户口簿" value="04"></el-option>
                    <el-option label="回乡证" value="05"></el-option>
                    <el-option label="其他" value="06"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="证件号" class="secondBg">
                <el-input v-model="form.CertId" size="small" style="width:400px;" placeholder="请输入证件号"></el-input>
            </el-form-item>
            <el-form-item label="备注" style="margin-top:10px;">
                <el-input v-model="form.Remark" size="small" type="textarea" :rows="4" style="width:400px;" placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { updateChild,getChildByChildID,getPaymentsByType,addChildPhoto } from '@/js/api'
import { showLoading,closeLoading,IdentityCodeValid,PhoneNumValid,imageCompress} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'ChildInfoDetail',
    data(){
        return {
            title:"",
            form: {
                ChildNum:"",
                ChildName:"",
                ChildSex:"0",
                ChildBirthday:"",
                ChildNation:"",
                ImagePath:"",
                InsuranceExpiryDate:"",
                ConnectPeople:"爸爸",
                ConnectPeopleElse:"",
                ConnectPhone:"",
                ChildHuji:"",
                IdentityType:"居民身份证",
                IdentityCard:"",
                MealFeeTypeID:"",
                MealFeeRefundTypeID:"",
                TuitionTypeID:"",
                TuitionRefundTypeID:"",
                DiscountMealFee:"",
                DiscountTuition:"",
                DiscountUntil:"",
                OpenBankId:"0308",
                CarsNO:"",
                UsrName:"",
                CertType:"01",
                CertId:"",
                Remark:""
            },
            mealFeeType:[],
            mealFeeRefundType:[],
            tuitionType:[],
            tuitionRefundType:[],
            uploadPath:""
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        // this.loadDetail();
        if(this.$route.meta.type=="add"){
            this.title = "添加幼儿信息";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改幼儿信息";
        }
        this.loadPayments();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        imagePath(){
            if(this.uploadPath){
                return this.uploadPath;
            }else if(this.form.ImagePath){
                return this.form.ImagePath.replace("../../../",this.userInfo.currProxy+'/COS'+this.userInfo.cosNum+'/');
            }else{
                return '';
            }
        }
    },
    watch:{
    },
    methods:{
        clickUploadFile(){
            document.getElementById("childInfoUploadFile").click();
        },
        childInfoFileChange(e){
            let childID = this.$route.params.childID;
            let file = e.target.files[0];
            this.familyMemberFile = file;
            // this.familyMemberFileName = file.name;
            imageCompress(file,0.5,(base64)=>{
                let base64Image = base64;
                this.uploadPath = base64Image;
            });
            addChildPhoto(childID,file).then((result)=>{
                if(result.data.status==1){
                    this.$message({
                        message:"上传成功",
                        type:"success"
                    });
                }else{
                    this.$message.error({
                        message:"上传成功"
                    });
                }
            });
        },
        getChildByChildID(){
            let childID = this.$route.params.childID;
            getChildByChildID(childID).then((result)=>{
                let childInfo = result.data.data[0];
                this.form.ChildName = childInfo.ChildName;
                this.form.ChildNum = childInfo.ChildNum;
                this.form.ChildSex = childInfo.ChildSex;
                this.form.ChildBirthday = childInfo.ChildBirthday.split(" ")[0];
                this.form.ChildNation = childInfo.ChildNation;
                this.form.InsuranceExpiryDate = childInfo.InsuranceExpiryDate.split(" ")[0];
                if(childInfo.ConnectPeople=="爸爸"||childInfo.ConnectPeople=="妈妈"||childInfo.ConnectPeople=="本人"){
                    this.form.ConnectPeople = childInfo.ConnectPeople;
                }else{
                    this.form.ConnectPeople = "其他";
                    this.form.ConnectPeopleElse = childInfo.ConnectPeople;
                }
                this.form.ImagePath = childInfo.ImagePath;
                this.form.ConnectPhone = childInfo.ConnectPhone;
                this.form.ChildHuji = childInfo.ChildHuji;
                this.form.IdentityType = childInfo.IdentityType;
                this.form.IdentityCard = childInfo.IdentityCard;
                this.form.MealFeeTypeID = childInfo.MealFeeTypeID;
                this.form.MealFeeRefundTypeID = childInfo.MealFeeRefundTypeID=="-1"?"":childInfo.MealFeeRefundTypeID;
                this.form.TuitionTypeID = childInfo.TuitionTypeID;
                this.form.TuitionRefundTypeID = childInfo.TuitionRefundTypeID=="-1"?"":childInfo.TuitionRefundTypeID;
                this.form.DiscountMealFee = childInfo.DiscountMealFee;
                this.form.DiscountTuition = childInfo.DiscountTuition;
                this.form.DiscountUntil = childInfo.DiscountUntil.split(" ")[0]=="9999-01-01"?"":childInfo.DiscountUntil.split(" ")[0];
                this.form.OpenBankId = childInfo.OpenBankId;
                this.form.CarsNO = childInfo.CarsNO;
                this.form.UsrName = childInfo.UsrName;
                this.form.CertType = childInfo.CertType;
                this.form.CertId = childInfo.CertId;
                this.form.Remark = childInfo.Remark;
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
            Promise.all([getPaymentsByType('MEAL_FEE'),getPaymentsByType('MEAL_FEE_REFUND'),getPaymentsByType('TUITION'),getPaymentsByType('TUITION_REFUND'),]).then((result)=>{
                this.mealFeeType = result[0].data.data;
                this.mealFeeRefundType = result[1].data.data;
                this.tuitionType = result[2].data.data;
                this.tuitionRefundType = result[3].data.data;
                if(result[0].data.data.length>0){
                    this.form.MealFeeTypeID = result[0].data.data[0].ID;
                }
                if(result[1].data.data.length>0){
                    this.form.MealFeeRefundTypeID = result[1].data.data[0].ID;
                }
                if(result[2].data.data.length>0){
                    this.form.TuitionTypeID = result[2].data.data[0].ID;
                }
                if(result[3].data.data.length>0){
                    this.form.TuitionRefundTypeID = result[3].data.data[0].ID;
                }
                if(this.$route.meta.type=="update"){
                    this.getChildByChildID();
                }
            });
            
        },
        isUntilDate(strDate){
            var date = eval('new Date('+strDate.replace(/\d+(?=-[^-]+$)/,function(a){return parseInt(a,10)-1;}).match(/\d+/g)+')');
			date.setDate(date.getDate()+1);
			if(date.getDate()==1){
				return true;
			}else{
				return false;
			}
        },
        // 点击确认保存模板
        confirm(){
            let childID = this.$route.params.childID;
            let childNum = this.form.ChildNum;
            let childName = this.form.ChildName;
            let sexStatus = this.form.ChildSex;
            let birthday = this.form.ChildBirthday;
            let connectPeople = "";
            if(this.form.ConnectPeople=="爸爸"||this.form.ConnectPeople=="妈妈"||this.form.ConnectPeople=="本人"){
                connectPeople = this.form.ConnectPeople;
            }else{
                connectPeople = this.form.ConnectPeopleElse
            }
            let phoneNum = this.form.ConnectPhone;
            let remark = this.form.Remark;
            let discountUntil = this.form.DiscountUntil;
            let mealFeeTypeID = this.form.MealFeeTypeID;
            let mealFeeRefundTypeID = this.form.MealFeeRefundTypeID;
            let tuitionTypeID = this.form.TuitionTypeID;
            let tuitionRefundTypeID = this.form.TuitionRefundTypeID;
            let discountMealFee = this.form.DiscountMealFee;
            let discountTuition = this.form.DiscountTuition;
            let insuranceExpiryDate = this.form.InsuranceExpiryDate;
            let openBankId = this.form.OpenBankId;
            let carsNO = this.form.CarsNO;
            let usrName = this.form.UsrName;
            let certType = this.form.CertType;
            let certId = this.form.CertId;
            let childNation = this.form.ChildNation;
            let childHuji = this.form.ChildHuji;
            let identityType = this.form.IdentityType;
            let identityCard = this.form.IdentityCard;
            if (childName == "") {
				this.$message.error({
                    message:"请输入幼儿姓名！"
                });
				return false;
			}
			if (birthday == "") {
                this.$message.error({
                    message:"请输入幼儿生日！"
                });
				return false;
			}
			if (childNation == "") {
                this.$message.error({
                    message:"请输入幼儿民族！"
                });
				return false;
			}
			if (phoneNum == "") {
                this.$message.error({
                    message:"请输入手机号！"
                });
				return false;
			}
			if(!PhoneNumValid(phoneNum)){
                this.$message.error({
                    message:"请输入正确手机号！"
                });
				return false;
			}
			if (connectPeople == "") {
                this.$message.error({
                    message:"请输入通知人！"
                });
				return false;
			}
			if (identityCard != "") {
				if (!IdentityCodeValid(identityCard)) {
                    this.$message.error({
                        message:"身份证号格式不正确！"
                    });
					return false;
				}
			}
			
			if (discountUntil!=""&&!this.isUntilDate(discountUntil)) {
                this.$message.error({
                    message:"折扣终止日必须输入月末最后一天！"
                });
				return false;
            }
            
            updateChild({
                childID,
                childNum,
                childName,
                sexStatus,
                birthday,
                connectPeople,
                phoneNum,
                remark,
                discountUntil,
                mealFeeTypeID,
                tuitionTypeID,
                mealFeeRefundTypeID,
                tuitionRefundTypeID,
                discountMealFee,
                discountTuition,
                insuranceExpiryDate,
                openBankId,
                carsNO,
                usrName,
                certType,
                certId,
                childNation,
                childHuji,
                identityType,
                identityCard
            }).then((result)=>{
                if(result.data.childid){
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
    display: flex;
    align-items: center;
    padding-left: 10px;
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
.firstBg{
    background: #ffb6c1;
}
.secondBg{
    background: #90ee90;
}
</style>