<template>
    <div class="expenseDetail">
        <chat-header :fixIndex="10" :showBack="true" :title="title" :showRightBtn="isShowButton" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirmTwo"></chat-header>
        <div class="createDate"><div style="float:left;">单号：{{detail.ChargeBillID}}</div><div style="float:right;">填表日期：{{detail.FillDate}}</div></div>
        <img :src="stamperImageUrl" v-show="stamperImageUrl" class="stamperImage" alt="">
        <div class="detailList">
            <div class="detailItem">
                <div class="detailTitle">财务类型</div>
                <div class="detailContent">{{chargeBillType}}</div>
                <div class="detailTitle">凭证号</div>
                <div class="detailContent" v-if="$route.meta.type!='certificate'">{{detail.WarrantNumber}}</div>
                <div class="detailContent" v-if="$route.meta.type=='certificate'">
                    <el-input v-model="detail.WarrantNumber" size="mini" placeholder="请输入凭证号" style="width:180px;"></el-input>
                </div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">财务所属</div>
                <div class="detailContent">{{detail.CompanyName}}</div>
                <div class="detailTitle">所在部门</div>
                <div class="detailContent">{{detail.FillDepartmentName}}</div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">填表人姓名</div>
                <div class="detailContent">{{detail.FillStaffName}}</div>
                <div class="detailTitle">费用发生者姓名</div>
                <div class="detailContent">{{detail.ChargeStaffName}}</div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">是否有发票</div>
                <div class="detailContent">{{hasInvoice}}</div>
                <div class="detailTitle">资金性质</div>
                <div class="detailContent">{{payType}}</div> 
            </div>
            <div class="detailItem">
                <div class="detailTitle">金额</div>
                <div class="detailContent" style="color: #FF9D00;">{{money}}{{detail.MoneyUnitName}}</div>
                <div class="detailTitle">大写</div>
                <div class="detailContent">{{detail.Capital}}</div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">单据张数</div>
                <div class="detailContent">{{detail.BillCount}}</div>
                <div class="detailTitle">还现金</div>
                <div class="detailContent">{{detail.ReturnCash}}</div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">摘要</div>
                <div class="detailContent" v-html="detail.Summary"></div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">资金分类</div>
                <div class="detailContent">{{detail.BigType}}</div> 
                <div class="detailTitle">资金小类</div>
                <div class="detailContent">{{detail.SmallType}}</div>
                <div class="detailTitle">资金科目</div>
                <div class="detailContent">{{detail.Subject}}</div>
            </div>
            <div class="detailItem" v-for="item in detail.BillOuts" :key="item.DetailID">
                <div class="detailTitle">资金出处</div>
                <div class="detailContent">{{item.OutType}}</div> 
                <div class="detailTitle">出处详细</div>
                <div class="detailContent" style="flex:3;">{{item.DetailName}}</div>
                <div class="detailTitle">百分比</div>
                <div class="detailContent">{{item.Ratio}}</div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">详细说明</div>
                <div class="detailContent" style="white-space: normal;" v-html="detail.Note"></div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">关联文件</div>
                <div class="detailContent">
                    <span class="file" v-for="item in detail.Attachment" :key="item.AttachmentID" @click="downloadFile(item)">{{item.AttachmentName}}</span>
                </div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">图片</div>
                <div class="detailContent">
                    <div class="image" v-for="item in detail.Images" :key="item"><image-proxy :canBrowse="true" :imagePath="item"></image-proxy></div>
                </div>
            </div>
            <div class="detailItem signer" v-for="item in allSigner" :key="item.ApprovalUser">
                <div class="detailTitle">签字人姓名</div>
                <div class="detailContent flexItemCenter">
                    <span>{{item.ApprovalName}}</span>
                </div> 
                <div class="detailTitle">签字人评论</div>
                <div class="detailContent" style="flex:3;">
                    <span v-show="!item.showApproval">{{item.Remark}}</span>
                    <el-input v-model="item.Remark" type="textarea" :row="6" size="mini" v-show="item.showApproval" placeholder="请输入签字人评论"></el-input>
                </div>
                <div class="detailTitle" style="flex:0.7;">签字结果</div>
                <div class="detailContent flexItemCenter" style="flex:1.3;">
                    <span v-show="!item.showApproval">{{item.State?(item.State=="1"?"同意":"拒绝"):"待签字"}}</span>
                    <div v-show="item.showApproval">
                        <el-radio v-model="status" label="1" style="margin-left:-5px;">同意</el-radio>
                        <el-radio v-model="status" label="2" style="margin-left:6px;">拒绝</el-radio>
                    </div>
                </div>
            </div>
        </div>
        <div style="flex:1;"></div>
    </div>
</template>

<script>

import { getChargeBillByID,findStaffByStaffID,downloadFile,signExamine,addbChargeNo } from '@/js/api'
import { money,stamper,showLoading,closeLoading ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import imageProxy from '@/components/chat/ImageProxy'

export default {
    name: 'ExpensePaymentDetail',
    data(){
        return {
            title:"",
            detail:{
                Attachment:[],
                BalanceItem:"",
                Bank:"",
                BankAccount:"",
                BigType:"",
                BigTypeID:"",
                BillCount:"",
                BillOuts:[],
                Capital:"",
                ChargeBillID:"",
                ChargeBillType:"",
                ChargeDate:"",
                ChargeStaffID:"",
                ChargeStaffName:"",
                CompanyID:"",
                CompanyName:"",
                FillDate:"",
                FillDepartmentID:"",
                FillDepartmentName:"",
                FillStaffI:"",
                FillStaffName:"",
                HasInvoice:"",
                Img1:"",
                Img2:"",
                Img3:"",
                Img4:"",
                Img5:"",
                Img6:"",
                Img7:"",
                Img8:"",
                Images:[],
                Money:"",
                MoneyUnitID:"",
                MoneyUnitName:"",
                Note:"",
                PayDate:"",
                PayType:"",
                ReturnCash:"",
                SignRecords:[],
                SmallType:"",
                SmallTypeID:"",
                State:"",
                Subject:"",
                SubjectID:"",
                Summary:"",
                WarrantNumber:"",
            },
            allSigner:[],
            stamperImageUrl:"",
            status:"",
        }
    },
    components:{
        ChatHeader,
        imageProxy
    },
    mounted(){
        this.loadDetail();
        this.title = '报销详情';
        if (this.$route.meta.type=="approve") {
            this.title = '报销审批';
        }
        if (this.$route.meta.type=="certificate") {
            this.title = '报销凭证录入';
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        chargeBillType(){// 财务类型 01:记账凭证
            if(this.detail.ChargeBillType=="01"){
                return "记账凭证";
            }else{
                return "";
            }
        },
        hasInvoice(){// 是否有发票
            if(this.detail.HasInvoice=="False"){
                return "否";
            }else if(this.detail.HasInvoice=="True"){
                return "是";
            }else{
                return "";
            }
        },
        payType(){// 资金性质{0:现金1:支票2:银行汇款3:其他4:汇票5:虚拟账户}
            switch (this.detail.PayType){
                case "0":
                    return "现金";
                    break;
                case "1":
                    return "支票";
                    break;
                case "2":
                    return "银行汇款";
                    break;
                case "3":
                    return "其他";
                    break;
                case "4":
                    return "汇票";
                    break;
                case "5":
                    return "虚拟账户";
                    break;
            }
        },
        money(){
            return money(this.detail.Money);
        },
        isShowButton(){
            if (this.$route.meta.type=="approve"||this.$route.meta.type=="certificate") {
                return true;
            }else{
                return false;
            }
        }
        
    },
    watch:{
    },
    methods:{
        confirmTwo(){
            if (this.$route.meta.type=="approve") {
                this.confirm();
            }else if(this.$route.meta.type=="certificate"){
                this.addbChargeNo();
            }
        },
        addbChargeNo(){
            if(this.detail.WarrantNumber.trim()==''){
                this.$message.error('请输入凭证号');
                return;
            }
            addbChargeNo(this.detail.ChargeBillID,this.detail.WarrantNumber).then((result)=>{
                if(result.data.Result==1){
                    this.$message({
                        message: '录入成功',
                        type: 'success'
                    });
                    window.history.go(-1);
                }else{
                    this.$message.error('录入失败');
                }
            }).catch((err)=>{
                alertError(this,"2203");
            });
        },
        confirm(){
            let cosNum = this.userInfo.cosNum;
            let id = this.$route.params.expenseID.split("&")[1];
            // {"ApprovalUser":"","ApprovalName":"","State":"","Remark":""}
            let approvalID = '';
            let result = '';
            let remark = '';
            for(let i=0;i<this.allSigner.length;i++){
                if(this.allSigner[i].showApproval){
                    approvalID = this.allSigner[i].ApprovalUser;
                    result = this.status;
                    remark = this.allSigner[i].Remark;
                }
            }
            if (result != "1"&&result != "2") {
                this.$message.error({
                    message:"请签字"
                })
                return
            }
            let loading = showLoading();
            signExamine(cosNum,id,approvalID,result,remark).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        message: '审批成功',
                        type: 'success'
                    });
                    window.history.go(-1);
                }else{
                    this.$message({
                        message: '审批失败',
                        type: 'error'
                    });
                }
            })
            .catch((err)=>{
                alertError(this,"2048");
            });
        },
        loadDetail(){
            let id;
            if (this.$route.meta.type=="approve"||this.$route.meta.type=="examine") {
                id = this.$route.params.expenseID.split("&")[0];
            }else{
                id = this.$route.params.expenseID;
            }
            let loading = showLoading();
            getChargeBillByID(id).then((result)=>{
                closeLoading(loading);
                let obj = result.data;
                if(typeof result.data=="string"){
                    let str = result.data.replace(/\n/g,"");
                    str = str.replace(/\t/g,"");
                    str = str.replace(/\r/g,"");
                    obj = JSON.parse(str);
                }
                obj.Images = [];
                // obj.Img1 = "../../../data/UPLOADFILES/MyDocument/1003_145/91a3e7de-02e3-43c3-bcf6-987ada5b6173.png";
                // obj.Img2 = "../../../data/UPLOADFILES/MyDocument/1003_145/7db2385f-e46c-431e-93ec-a8f1b07fbe42.jpg";
                // obj.Img3 = "../../../data/UPLOADFILES/ChatImage/2ab15744-3378-4a07-b962-7b4c15e53078.png";
                if(obj.Img1){
                    obj.Images.push(obj.Img1.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                }
                if(obj.Img2){
                    obj.Images.push(obj.Img2.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                }
                if(obj.Img3){
                    obj.Images.push(obj.Img3.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                }
                if(obj.Img4){
                    obj.Images.push(obj.Img4.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                }
                if(obj.Img5){
                    obj.Images.push(obj.Img5.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                }
                if(obj.Img6){
                    obj.Images.push(obj.Img6.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                }
                if(obj.Img7){
                    obj.Images.push(obj.Img7.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                }
                if(obj.Img8){
                    obj.Images.push(obj.Img8.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/"))
                }
                this.detail = obj;
                this.allSigner = [];
                for(let i=0;i<obj.FinanceStaff.length;i++){
                    obj.FinanceStaff[i].State = "";
                    obj.FinanceStaff[i].Remark = "";
                    this.allSigner.push(obj.FinanceStaff[i]);
                }
                for(let i=0;i<obj.AddFinanceStaff.length;i++){
                    obj.AddFinanceStaff[i].State = "";
                    obj.AddFinanceStaff[i].Remark = "";
                    this.allSigner.push(obj.AddFinanceStaff[i]);
                }
                for(let i=0;i<this.allSigner.length;i++){
                    for(let j=0;j<obj.SignRecords.length;j++){
                        if(obj.SignRecords[j].ApprovalUser==this.allSigner[i].ApprovalUser){
                            // this.allSigner[i].showApproval = true;
                            this.allSigner[i].State = obj.SignRecords[j].State;
                            this.allSigner[i].Remark = obj.SignRecords[j].Remark;
                        }
                    }
                }
                for(let j=0;j<this.allSigner.length;j++){
                    if(this.allSigner[j].ApprovalUser==this.userInfo.userStaffID&&this.$route.meta.type=="approve"){
                        this.allSigner[j].showApproval = true;
                        this.allSigner[j].State = "";
                    }
                }
                // if (this.$route.meta.type=="approve") {
                //     let object = {"ApprovalUser":"","ApprovalName":"","State":"1","Remark":""}
                //     object.ApprovalUser = this.userInfo.userStaffID;
                //     object.ApprovalName = this.userInfo.userName;
                //     this.detail.SignRecords.push(object);
                // }

                let status = "";
				let color = "";
				if(obj.State=="0"){
					status = "待签字";// gray 
					color = "#8f8f94";
				}else if(obj.State=="1"){
					status = "待支付";// orange 
					color = "#FF9D00";
				}else if(obj.State=="2"){
					status = "处理完毕";// green 
					color = "#2ecc71";
                    for (let i = 0; i < this.allSigner.length; i++) {
                        this.allSigner[i].State = "1";
                    }
				}else if(obj.State=="-1"){
					status = "未通过审批";// red 
					color = "#e51c23";
				}else if(obj.State=="3"){
					status = "延期付款中";// orange 
					color = "#FF9D00";
				}else if(obj.State=="4"){
					status = "延期付款完毕";// green 
					color = "#2ecc71";
                }
                if(this.$route.meta.type!="approve"){
                    let imgurl = stamper({
                        outsideInfo : this.userInfo.cosName,
                        success : true,
                        stampImage : "stampImage",
                        color:color,
                        status:status
                    });
                    this.stamperImageUrl = imgurl;
                }
                
            })
            .catch((err)=>{
                console.log(err)
                alertError(this,"1175");
            });
        },
        downloadFile(item){
            let url = item.AttachmentPath.replace("../../../",this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
            downloadFile(url).then((result)=>{
                const content = result.data;
                console.log("downloadFile");
                console.log(result);
                const blob = new Blob([content]);
                const fileName = item.AttachmentName;
                if ('download' in document.createElement('a')) { // 非IE下载
                    const elink = document.createElement('a');
                    elink.download = fileName;
                    elink.style.display = 'none';
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                } else { // IE10+下载
                    navigator.msSaveBlob(blob, fileName)
                }
            }).catch(()=>{
                console.log("error")
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.expenseDetail{
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
.detailList{
    width:100%;
    border-left:1px solid #999;
    border-top:1px solid #999;
}
.detailItem{
    display: flex;
    flex-direction: row;
}
.detailTitle{
    width:130px;
    border-bottom:1px solid #999;
    border-right:1px solid #999;
    padding:10px;
    display: flex;
    align-items: center;
}
.detailContent{
    flex:1;
    border-bottom:1px solid #999;
    border-right:1px solid #999;
    padding:10px;
    color: #999;
    min-height: 41px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    display: flex;
    align-items: center;
}
.detailContent > .image{
    width:50px;
    height:50px;
    margin-right: 40px;
    display: inline-block;
    overflow: hidden;
}
.flexItemCenter{
    display: flex;
    align-items: center;
}
.createDate{
    padding-top:54px;
    padding-bottom: 10px;
    width: 100%;
    height: 20px;
    box-sizing: content-box;
}
.file{
    color:#38adff;
    margin-right: 30px;
    cursor: pointer;
}
.stamperImage{
    position: absolute;
    right: 40px;
    top: 50px;
    /* background:#fafafa; */
}
.signer > .detailTitle{
    font-weight: 600;
    color:#000;
}
.signer{
    background: rgba(255,182,193,.4);
}
</style>