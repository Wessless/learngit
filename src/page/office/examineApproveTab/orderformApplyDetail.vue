<template>
    <div class="orderformApplyDetail">
        <!-- <div class="redColor">*必填</div> -->
        <input  name="file" type="file" id="uploadCloudFile" style="display:none" @change="uploadFile"/>
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="120px" style="width:100%;">
            <el-form-item label="客户">
                <el-select v-model="form.customerID" filterable clearable size="small" style="width:300px;"
                remote :remote-method="remoteMethod" :loading="loadingCustomer" placeholder="请输入关键词">
                    <el-option
                        v-for="item in form.customerArr"
                        :key="item.CustomerID"
                        :label="item.CompanyTitle"
                        :value="item.CustomerID">
                    </el-option>
                </el-select>    
                <label style="color:#606266;margin:0 8px 0 27px;">保留小数</label>  
                <el-radio v-model="form.point" label="0">0</el-radio>
                <el-radio v-model="form.point" label="1">1</el-radio>
            </el-form-item>

            <el-form-item label="经销商">
                <el-select v-model="form.dealerID" filterable clearable size="small" style="width:300px;" placeholder="请选择经销商">
                    <el-option
                        v-for="item in form.dealerArr"
                        :key="item.CustomerID"
                        :label="item.CompanyTitle"
                        :value="item.CustomerID">
                    </el-option> 
                </el-select>      
                <label style="color:#606266;margin:0 8px 0 42px;">销售员</label>  
                <el-input v-model="form.ActualName" size="small" style="width:200px;" placeholder="请输入销售员"></el-input>   
            </el-form-item>

            <el-form-item label="产品">
                <el-button type="primary" @click="addInOrderform" size="mini">向订单中添加</el-button> 
                <!-- <el-button type="primary" style="margin-left:47px;" @click="chongxinjisuan" size="mini">重新计算</el-button>  -->
                <div class="addProductArr" v-for="(item,index) in form.addProductArr" :key="index">
                    <div class="flex">
                        <div style="margin-left:10px;flex:6;width: 294px;">
                            <span style="color:#c0c4cc;" class="ellipsis" :title="item.SortName">产品分类：{{item.SortName}}</span>
                        </div>
                        <div style="flex:6;width: 294px;">
                            <span style="color:#c0c4cc;" class="ellipsis" :title="item.CommodityName">产品名称：{{item.CommodityName}}</span>
                        </div>
                    </div>

                    <div class="flex">
                        <div style="margin-left:10px;flex:6">
                            <span style="color:#c0c4cc;">定价信息：{{item.DatailPrice}}</span>
                        </div>
                        <div style="flex:6">
                            <span>价格单位：</span>
                            <el-input v-model="item.SellPriceUnit" style="width:100px;" placeholder="价格单位" size="mini"></el-input>
                        </div>
                    </div>

                    <div class="flex">
                        <div style="margin-left:10px;flex:6">
                            <span>生效日：</span>
                            <el-date-picker
                                v-model="item.StartDate"
                                type="date"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                size="mini"
                                placeholder="请选择生效日"
                                style="width:150px;">
                            </el-date-picker>
                        </div>
                        <div style="flex:6">
                            <span>失效日：</span>
                            <el-date-picker
                                v-model="item.EndDate"
                                type="date"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                size="mini"
                                placeholder="请选择失效日"
                                style="width:150px;">
                            </el-date-picker>
                        </div>
                    </div>

                    <div class="flex">
                        <div style="margin-left:10px;flex:4">
                            <span>调整价格：</span>
                            <el-input v-model="item.SellPrice" @keyup.native="changeMoney(item.SellPrice,'SellPrice',index)" style="width:80px;" placeholder="调整价格" size="mini"></el-input>
                        </div>
                        <div style="flex:4">
                            <span>数量：</span>
                            <el-input v-model="item.Count" @keyup.native="changeNum(item.Count,index)" style="width:80px;" placeholder="数量" size="mini"></el-input>
                        </div>
                        <div style="flex:2.5">
                            <span style="color:#c0c4cc;">小计：{{item.SellPrice*item.Count?(item.SellPrice*item.Count).toFixed(Number(form.point)):0}}</span>
                        </div>
                        <div style="flex:1.5">
                            <el-button type="danger" style="margin-left:12px;" @click="removeThisItem(index)" size="mini">删除</el-button> 
                        </div>
                    </div>
                </div>
                <div style="width:600px;">
                    <span style="color:#c0c4cc;float:left;width:200px;">产品服务费合计：{{beforeSumMoney}}元</span>
                    <span style="float:left;margin-left:40px;">折扣率（如0.8）</span>
                    <el-input v-model="discountRate" style="float:left;width:50px;" size="small"></el-input> 
                    <span style="color:#c0c4cc;float:right;">折扣后合计：{{afterSumMoney}}元</span> 
                </div>
            </el-form-item> 

            <el-form-item label="附加费" class="smallTableHeight ReceiveApplyDetail_signatory">
                <el-table :data="form.additionMoney" style="width:600px;display:block;margin:5px 0 10px 0;line-height:31px;margin-bottom:8px;" :header-cell-style="getRowClass" border max-height="400">
                    <el-table-column align="center" label="施工费">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.constructionMoney" @keyup.native="changeMoney(scope.row.constructionMoney,'constructionMoney')" size="small" placeholder="施工费"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center"  label="运输费">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.transMoney" @keyup.native="changeMoney(scope.row.transMoney,'transMoney')" size="small" placeholder="运输费"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center"  label="税金">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.taxes" @keyup.native="changeMoney(scope.row.taxes,'taxes')" size="small" placeholder="税金"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center"  label="其他">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.elseMoney" @keyup.native="changeMoney(scope.row.elseMoney,'elseMoney')" size="small" placeholder="其他"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center"  label="合计">
                        <template slot-scope="scope">
                            <!-- <el-input v-model="scope.row.elseMoney" size="small" placeholder=""></el-input> -->
                            <span>{{additionMoneySum}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <div style="width:600px;">
                    <span style="color:#c0c4cc;float:right;">订单总金额：{{orderTotalAmount}}元</span> 
                </div>
            </el-form-item>

            <!-- <el-form-item label="审批人">
                <el-select v-model="form.approvalUser" multiple size="small" style="width:600px;" placeholder="请选择审批人">
                    <el-option
                        v-for="item in form.approvalUserArr"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item> -->
            
            <el-form-item>
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

            <el-form-item label="抄送人" v-show="$route.meta.type!='update'">
                <el-select v-model="form.ccUser" multiple size="small" style="width:600px;" placeholder="请选择抄送人">
                    <el-option
                        v-for="item in form.ccUserArr"
                        :key="item.StaffID"
                        :label="item.StaffName"
                        :value="item.StaffID">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-dialog
                title="产品列表"
                :visible.sync="dialogVisible"
                width="65%">
                <label style="color:#606266;margin-right:8px;">产品分类</label>  
                <el-select v-model="sortID" size="small" style="width:200px;margin-bottom:20px;" @change="getProductData" placeholder="请选择产品分类">
                    <el-option
                        v-for="item in sortArr"
                        :key="item.SortID"
                        :label="item.SortName"
                        :value="item.SortID">
                    </el-option>
                </el-select>
                <el-input v-model="goodsSearchText"  size="small" style="margin-left:100px;width:200px;" placeholder="请输入产品关键词"></el-input>
                <el-button type="primary" size="small" style="margin-left:15px;" @click="getProductData">查询</el-button>
                <el-table ref="multipleTable" :data="productData" style="width:100%;display:block;" @selection-change="handleSelectionChange" :header-cell-style="getRowStyle" :cell-style="getColStyle" border max-height="300">
                    <el-table-column type="selection" align="center" width="40"></el-table-column>
                    <el-table-column  prop="GoodsID" align="center"  label="ID"  width="60"></el-table-column>
                    <el-table-column  prop="GoodsName" align="center"  label="产品名称" width="220"></el-table-column>
                    <el-table-column  prop="BorrowSum" align="center"  label="借出" ></el-table-column>
                    <el-table-column  prop="OrderSum" align="center"  label="订单" ></el-table-column>
                    <el-table-column  prop="WarehouseSum" align="center"  label="在库" ></el-table-column>
                    <el-table-column  prop="Sum" align="center"  label="数量" ></el-table-column>
                    <el-table-column  prop="Pricing" align="center"  label="定价信息" width="120" ></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addProduct">确 定</el-button>
                </span>
            </el-dialog>
        </el-form>
    </div>
</template>

<script>

import { getCustomerManage,getAllCommoditySort,getDataSetBySortID,addOrUpdateCommodityorderApply,addAttachment,getCommodityorderApplyByID } from '@/js/api'
import { showLoading,closeLoading,alertError,money} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'OrderformApplyDetail',
    data(){
        return {
            title:"订单申请",
            form: {
                customerID:"",        //客户ID
                customerArr:[],       //客户列表
                dealerID:"",          //经销商
                dealerArr:[],         //经销商列表
                ActualName:"",          //销售员
                point:"0",            //保留小数
                addProductArr:[],     //已添加的产品列表
                additionMoney:[       //附加费列表
                    {
                        constructionMoney:"",
                        transMoney:"",
                        taxes:"",
                        elseMoney:""
                    }
                ],  
                approvalUser:"",
                approvalUserArr:[],
                ccUser:"",
                ccUserArr:[],
                delAttachmentID:[],
                images:[],
            },
            delImgUrl:[],
            pathArr:[],
            uploadArr:[],
            sortID:"",
            sortArr:[],
            productData:[],
            checkProductData:[],
            discountRate:"1.0",//折扣率
            dialogVisible:false,
            loadingCustomer:false,
            pageNo:1,
            pageSize:30,
            pageSize1:1000,
            searchText:"",
            goodsSearchText:"",
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        this.form.ccUserArr = this.findAllstaffs;
        this.getCustomerManage();
        this.getdealerArr();
        if (this.$route.meta.type=="update") {
            this.getCommodityorderApplyByID();
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
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
        sortName(){
            if (this.sortArr.length!=0) {
                let obj = this.sortArr.find((item)=>{
                    return this.sortID === item.SortID;
                })
                return obj.SortName;
            }else{
                return "";
            }
        },
        additionMoneySum(){
            let a = this.form.additionMoney[0].constructionMoney?parseFloat(this.form.additionMoney[0].constructionMoney):0;
            let b = this.form.additionMoney[0].transMoney?parseFloat(this.form.additionMoney[0].transMoney):0;
            let c = this.form.additionMoney[0].taxes?parseFloat(this.form.additionMoney[0].taxes):0;
            let d = this.form.additionMoney[0].elseMoney?parseFloat(this.form.additionMoney[0].elseMoney):0;
            let sum = (a+b+c+d).toFixed(Number(this.form.point));
            return sum;
        },
        beforeSumMoney(){
            if (this.form.addProductArr.length>0) {
                let sum = 0;
                for (let i = 0; i < this.form.addProductArr.length; i++) {
                    let a = this.form.addProductArr[i].SellPrice*this.form.addProductArr[i].Count?(this.form.addProductArr[i].SellPrice*this.form.addProductArr[i].Count).toFixed(Number(this.form.point)):0//一个产品的费用小计
                    sum += parseFloat(a);
                }
                return parseFloat(sum).toFixed(Number(this.form.point));
            }else{
                return 0;
            }
        },
        afterSumMoney(){
            let sum = this.beforeSumMoney*this.discountRate;
            return parseFloat(sum).toFixed(Number(this.form.point));
        },
        orderTotalAmount(){
            let sum = parseFloat(this.afterSumMoney) + parseFloat(this.additionMoneySum);
            return parseFloat(sum).toFixed(Number(this.form.point));
        }
    },
    watch:{
    },
    methods:{
        ...mapMutations([
            'SET_BROWSERIMG'
        ]),
        // 点击确认保存模板
        confirm(){
            // {
            //     constructionMoney:"",
            //     transMoney:"",
            //     taxes:"",
            //     elseMoney:""
            // }
            let json = {
                cosNum:this.userInfo.cosNum,
                id:this.$route.params.orderformID?this.$route.params.orderformID:"-1",
                sortID:this.form.addProductArr.length!=0?this.form.addProductArr[0].SortID:"",
                staffID:this.userInfo.userStaffID,
                actualName:this.form.ActualName,
                sumMoney:this.afterSumMoney,
                constructionFee:this.form.additionMoney[0].constructionMoney,
                transportationFee:this.form.additionMoney[0].transMoney,
                tax:this.form.additionMoney[0].taxes,
                otherFee:this.form.additionMoney[0].elseMoney,
                orderTotalAmount:this.orderTotalAmount,
                decimals:this.form.point,
                discountPercent:this.discountRate,
                dealerID:this.form.dealerID,
                userID:this.form.customerID,
                applyDetailList:"",
                ccUser:this.form.ccUser?this.form.ccUser.join(","):"",
                attachment:"",
                delAttachmentID : this.form.delAttachmentID.length!=0?this.form.delAttachmentID.join(","):"",
                delImg : this.delImgUrl.length!=0?this.delImgUrl.join(","):""
            }
            for (let i = 0; i < this.pathArr.length; i++) {
                if (i==0) {
                    json.attachment = this.uploadArr[i].fileName.split(".")[0] +":"+ this.pathArr[i];
                }else{
                    json.attachment += "," + this.uploadArr[i].fileName.split(".")[0] +":"+ this.pathArr[i];
                }
            }
            if (this.form.customerID == "") {
                this.$message.error({
                    message:"请选择客户！"
                });
                return;
            }
            if (this.discountRate == "") {
                this.$message.error({
                    message:"请输入折扣率！"
                });
                return;
            }
            if (this.form.addProductArr.length == 0) {
                this.$message.error({
                    message:"请选择产品！"
                });
                return;
            }
            let array = [];
            for (let i = 0; i < this.form.addProductArr.length; i++) {
                let obj = {};
                obj.CommodityID = this.form.addProductArr[i].CommodityID;
                obj.DetailSortID = this.form.addProductArr[i].SortID;
                obj.SellPrice = this.form.addProductArr[i].SellPrice;
                obj.SellPriceUnit = this.form.addProductArr[i].SellPriceUnit;
                obj.StartDate = this.form.addProductArr[i].StartDate;
                obj.EndDate = this.form.addProductArr[i].EndDate;
                obj.Price = this.form.addProductArr[i].DatailPrice;
                obj.Count = this.form.addProductArr[i].Count;
                obj.Sum = (this.form.addProductArr[i].SellPrice*this.form.addProductArr[i].Count).toFixed(Number(this.form.point));
                let newBeginTime = new Date(obj.StartDate.replace(/-/g,'/')).getTime();
                let newEndTime = new Date(obj.EndDate.replace(/-/g,'/')).getTime();
                if(obj.SellPrice==""){
                    this.$message.error({
                        message:"请输入调整价格！"
                    });
                    return;
                }
                if(obj.Count==""||obj.Count=="0"){
                    this.$message.error({
                        message:"请输入数量！"
                    });
                    return;
                }
                if(obj.Sum==""){
                    this.$message.error({
                        message:"请重新计算价格！"
                    });
                    return;
                }
                if(newBeginTime>newEndTime){
                    this.$message.error({
                        message:"请选择正确的时间段！"
                    });
                    return false;
                }
                array.push(obj);
            }
            json.applyDetailList = JSON.stringify(array);
            console.log(json);
            let loading = showLoading();
            addOrUpdateCommodityorderApply(json).then((result)=>{
                closeLoading(loading);
                if (this.$route.meta.type=="add") {
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"添加成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message({
                            message:"添加失败",
                        });
                    }
                }else if (this.$route.meta.type=="update") {
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"修改成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message({
                            message:"修改失败",
                        });
                    }
                }
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"2091");
            });
        },
        //修改时获得data
        getCommodityorderApplyByID(){
            let id = this.$route.params.orderformID;
            let loading = showLoading();
            getCommodityorderApplyByID(id).then((result)=>{
                let obj = result.data;
                this.form.customerID = obj.UserID;
                this.remoteMethod(obj.UserName);
                this.form.ActualName = obj.ActualName;
                this.discountRate = obj.DiscountPercent;
                this.form.additionMoney[0].constructionMoney = obj.ConstructionFee;
                this.form.additionMoney[0].transMoney = obj.TransportationFee;
                this.form.additionMoney[0].taxes = obj.Tax;
                this.form.additionMoney[0].elseMoney = obj.OtherFee;
                this.form.addProductArr = obj.DetailList;
                for (let i = 0; i < obj.PathMsg.length; i++) {
                    let obj1 = {"ID":"","fileName":"","type":"","imgPath":""};
                    let array = obj.PathMsg[i].AttachmentPath.split(".")
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
                    obj1.fileName = obj.PathMsg[i].AttachmentName + "." + obj1.type;
                    obj1.ID = obj.PathMsg[i].AttachmentID;
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
                // console.log(this.form.images)
                closeLoading(loading);
            })
            .catch((err)=>{
                alertError(this,"1150");
            });
        },
        //获得客户列表
        getCustomerManage(){
            let cosNum = this.userInfo.cosNum;
            let customerType = "0";
            let searchText = this.searchText?this.searchText:"";
            getCustomerManage(cosNum,this.pageNo,this.pageSize,customerType,searchText).then((result)=>{
                this.form.customerArr = result.data.data;
                this.loadingCustomer = false;
            })
            .catch((err)=>{
                alertError(this,"1108");
            });
        },
        remoteMethod(query) {
            // if (query !== '') {
                this.loadingCustomer = true;
                this.searchText = query;
                this.getCustomerManage();
            // } else {
            //     this.form.customerArr = [];
            // }
        },
        //获得经销商列表
        getdealerArr(){
            let cosNum = this.userInfo.cosNum;
            let customerType = "2";
            getCustomerManage(cosNum,this.pageNo,this.pageSize1,customerType,"").then((result)=>{
                this.form.dealerArr = result.data.data;
            })
            .catch((err)=>{
                alertError(this,"1108");
            });
        },
        //向订单中添加
        addInOrderform(){
            this.dialogVisible = true;
            this.sortArr = [];
            let cosNum = this.userInfo.cosNum;
            let sortID;
            if (this.form.addProductArr.length>0) {
                sortID = this.form.addProductArr[0].SortID;
            }else{
                sortID = "-1";
            }
            getAllCommoditySort(cosNum,sortID).then((result)=>{
                this.sortArr = result.data.data;
                this.sortID = result.data.data[0].SortID?result.data.data[0].SortID:"";
                this.getProductData();
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"1147");
            });
        },
        //根据分类获取相应的产品列表
        getProductData(){
            let cosNum = this.userInfo.cosNum;
            let staffID = this.userInfo.userStaffID;
            let sortID = this.sortID;
            let searchText = this.goodsSearchText;
            let loading = showLoading()
            getDataSetBySortID(cosNum,this.pageNo,this.pageSize,staffID,sortID,searchText).then((result)=>{
                closeLoading(loading);
                this.productData = result.data.data;
            })
        },
        handleSelectionChange(val){
            this.checkProductData = val;
        },
        //添加产品
        addProduct(){
            // {
            //     "SortID":"4",
            //     "SortName":"川迪学习资源",
            //     "CommodityID":"227",
            //     "CommodityName":"HIKIDS系列课件",
            //     "DatailPrice":"1000",
            //     "SellPrice":"",
            //     "SellPriceUnit":"",
            //     "StartDate":"",
            //     "EndDate":"",
            //     "Count":"",
            //     "isSum":"",
            //     "Sum":"",
            // },
            let state = "";
            let array = [];
            for (let i = 0; i < this.checkProductData.length; i++) {
                let obj={};
                let goodsArray=[];
                obj.SortID = this.sortID;
                obj.SortName = this.sortName;
                obj.CommodityID = this.checkProductData[i].GoodsID;
                obj.CommodityName = this.checkProductData[i].GoodsName;
                obj.Sum = this.checkProductData[i].Sum;
                obj.DatailPrice = this.checkProductData[i].Pricing;
                obj.isSum = this.checkProductData[i].IsNotNeedDeliver;
                obj.SellPrice = "";
                obj.SellPriceUnit = "";
                obj.StartDate = "";
                obj.EndDate = "";
                obj.Count = "";
                for (let j = 0; j < this.form.addProductArr.length; j++) {
                    goodsArray.push(this.form.addProductArr[j].CommodityID);
                }
                if (obj.isSum!='1'&&this.checkProductData[i].Sum==0) {
                    state = "1";
                }else if(this.isInArray(obj.CommodityID,goodsArray)){
                    state = "2";
                }else{
                    array.push(obj);
                }
            }
            if (state == "1") {
                this.$message({
                    message:"当前产品库存不足",
                });
                return;
            }else if (state == "2") {
                this.$message({
                    message:"订单中已存在该产品",
                });
                return;
            }else{
                this.form.addProductArr = this.form.addProductArr.concat(array);
                this.dialogVisible = false;
            }
        },
        removeThisItem(index){
            this.form.addProductArr.splice(index,1);
        },
        //判断该产品是否已添加到数组中
        isInArray(index,array){
            for(var i=0;i<array.length;i++){
                if(index == array[i]){
                    return true;
                }
            }
            return false;
        },
        //金额转换
        changeMoney(moneyStr,type,index){
            // console.log(obj.target._value)
            let value = moneyStr;
            value = value.replace(/[^\d\.]/g,"").replace(/(\.\d{2}).+$/,"$1").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0");
            if(value.indexOf(".")< 0 && value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                value= parseFloat(value); 
            } 
            // console.log(value);
            value = money(value);
            if (type == "SellPrice") {
                this.form.addProductArr[index].SellPrice = value;
            }else if (type == "constructionMoney") {
                this.form.additionMoney[0].constructionMoney = value;
            }else if (type == "transMoney") {
                this.form.additionMoney[0].transMoney = value;
            }else if (type == "taxes") {
                this.form.additionMoney[0].taxes = value;
            }else if (type == "elseMoney") {
                this.form.additionMoney[0].elseMoney = value;
            }
        },
        changeNum(num,index){
            let value = num;
            value = value.replace(/[^\d*]/,'')
            if (this.form.addProductArr[index].isSum != '1'&&parseFloat(value)>parseFloat(this.form.addProductArr[index].Sum)) {
                this.$message({
                    message:"货物个数超过库存上限",
                });
                this.form.addProductArr[index].Count = value.substr(0, value.length - 1);
            }else{
                this.form.addProductArr[index].Count = value;
            }
        },
        clickUploadFile(){
            document.getElementById("uploadCloudFile").click();
        },
        uploadFile(e){
            let type = "7";
            let obj = {"fileName":"","type":"","imgPath":""}
            obj.fileName = e.target.files[0].name;
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
            let file = e.target.files[0];
            addAttachment(file,type).then((result) => {
                let path = result.data.Path;
                if(result.data.Result=="1"){
                    this.pathArr.push(path);
                    this.uploadArr.push(obj);
                }
            })
            .catch((err)=>{
                alertError(this,"2196");
            });
        },
        delFile(item,index){
            if (this.$route.meta.type=="update") {
                this.form.delAttachmentID.push(this.uploadArr[index].ID);
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

        
        //改变表头颜色
        getRowClass({ row, column, rowIndex, columnIndex }){
			if (rowIndex == 0) {
				return 'background:#38ADFF;color:#fff;'
			}  else {
				return ''
            }
        },
        //改变多选框样式
        getColStyle({ row, column, rowIndex, columnIndex }){
            if (columnIndex == 0) {
				return 'padding-bottom:5px;'
			} else {
				return ''
            }
        },
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (columnIndex == 0) {
				return 'padding-bottom:5px;'
			} else {
				return ''
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.orderformApplyDetail{
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
.addProductArr{
    width: 600px;
    border: 1px solid #c0c4cc;
    box-sizing: border-box;
    margin-top: 10px;
}
.flex{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.flex .ellipsis{
    display: block;
    width: 100%;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>