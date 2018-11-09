<template>
    <div class="dueApproveDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="isShowButton" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirmTwo"></chat-header>
        <div class="createDate">
            <span>&nbsp;</span>
            <!-- <span>填表日期：{{detail.CreateDate}}</span> -->
        </div>
        <img :src="stamperImageUrl" v-show="stamperImageUrl" class="stamperImage" alt="">
        <div class="detailList">
            <div class="detailItem">
                <div class="detailTitle">申请人姓名</div>
                <div class="detailContent">{{detail.ApplyName}}</div>
                <div class="detailTitle">金额</div>
                <div class="detailContent">{{detail.Money}}</div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">详细说明</div>
                <div class="detailContent">{{detail.Note}}</div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">凭证号</div>
                <div class="detailContent" v-if="$route.meta.type!='certificate'">{{detail.BelongWarrantNumber}}</div>
                <div class="detailContent" v-if="$route.meta.type=='certificate'">
                    <el-input v-model="detail.BelongWarrantNumber" size="mini" placeholder="请输入凭证号" style="width:240px;"></el-input>
                </div>
            </div>
            <!-- <div class="detailItem" v-for="(item,index) in detail.Content" :key="index">
                <div class="detailTitle">{{item.name}}</div>
                <div class="detailContent">{{item.value}}</div>
            </div> -->
            <div class="detailItem">
                <div class="detailTitle">文件</div>
                <div class="detailContent">
                    <span class="file" v-for="item in detail.link" :key="item.FinanceAttachmentID" @click="downloadFile(item)">{{item.FileName}}</span>
                </div>
            </div>
            <div class="detailItem" v-for="(item,index) in detail.approvalArr" :key="index+1">
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
                    <span v-show="!item.showApproval">{{item.Result!='-1'?(item.Result=="1"?"同意":"拒绝"):"待签字"}}</span>
                    <div v-show="item.showApproval">
                        <el-radio v-model="status" label="1" style="margin-left:-5px;">同意</el-radio>
                        <el-radio v-model="status" label="2" style="margin-left:6px;">拒绝</el-radio>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { getExamineByID,signExamine,paymentChargeDetailForm,addPaymentChargecheckNo } from '@/js/api'
import { money,stamper,showLoading,closeLoading ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import imageProxy from '@/components/chat/ImageProxy'

export default {
    name: 'dueApproveDetail',
    data(){
        return {
            title:"",
            detail:{
                ApplyUser:"",
                ApplyName:"",
                CreateDate:"",
                Money:"",
                Note:"",
                BelongWarrantNumber:"",
                link:[],
                approvalArr:[]
            },
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
        this.title = '应付款详情';
        if (this.$route.meta.type=="approve") {
            this.title = '应付款审批';
        }
        if (this.$route.meta.type=="certificate") {
            this.title = '应付款凭证号录入';
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
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
            if(this.$route.meta.type=="certificate"){
                this.addPaymentChargecheckNo();
            }else if(this.$route.meta.type=="approve"){
                this.confirm();
            }
        },
        addPaymentChargecheckNo(){
            if(this.detail.BelongWarrantNumber.trim()==''){
                this.$message.error('请输入凭证号');
                return;
            }
            addPaymentChargecheckNo(this.$route.params.dueID,this.detail.BelongWarrantNumber).then((result)=>{
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
                alertError(this,"2201");
            });
        },
        confirm(){
            let cosNum = this.userInfo.cosNum;
            let id = this.$route.params.examineID;
            // {"ApprovalUser":"","ApprovalName":"","State":"","Remark":""}
            let approvalID = '';
            let result = '';
            let remark = '';
            for(let i=0;i<this.detail.approvalArr.length;i++){
                if(this.detail.approvalArr[i].showApproval){
                    approvalID = this.detail.approvalArr[i].ApprovalUser;
                    result = this.status;
                    remark = this.detail.approvalArr[i].Remark;
                }
            }
            if (result != "1"&&result != "2") {
                this.$message.error({
                    message:"请签字"
                })
                return
            }
            console.log(cosNum,id,approvalID,result,remark);
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
        downloadFile(item){

        },
        loadDetail(){
            let cosNum = this.userInfo.cosNum;
            console.log(this.$route.params)
            let loading = showLoading();
            paymentChargeDetailForm('Modify',this.$route.params.staffID,this.$route.params.dueID,this.$route.params.expenseID).then((result)=>{
                closeLoading(loading);
                let obj = result.data;
                // 未签字 -1 拒绝 0 同意 1
                this.detail.ApplyName = obj.fillStaffName;
                this.detail.Money = money(obj.Money);
                this.detail.Note = obj.Note;
                this.detail.BelongWarrantNumber = obj.BelongWarrantNumber;
                this.detail.link = obj.link;
                this.detail.approvalArr = [];
                for(let i=0;i<obj.data.length;i++){
                    console.log(obj.data[i])
                    let json = {};
                    if(this.$route.meta.type=='approve'&&obj.data[i].StaffID==this.userInfo.userStaffID){
                        json.showApproval = true;
                    }else{
                        json.showApproval = false;
                    }
                    json.ApprovalName = obj.data[i].StaffName;
                    json.ApprovalUser = obj.data[i].StaffID;
                    json.Result = obj.data[i].SignState;
                    json.Remark = obj.data[i].SignOpinion;
                    this.detail.approvalArr.push(json);
                }

                let status = "";
                let color = "";
                if (this.$route.params.isAccount == "1") {
                    status = "审批同意";// green 
                    color = "#2ecc71";
                    for (let i = 0; i < this.detail.approvalArr.length; i++) {
                        this.detail.approvalArr[i].Result = "1";
                    }
                }else{
                    if(obj.signState=="-1"){
                        status = "待签字";// gray 
                        color = "#8f8f94";
                    }else if(obj.signState=="1"){
                        status = "审批同意";// green 
                        color = "#2ecc71";
                    }else if(obj.signState=="0"){
                        status = "审批拒绝";// orange 
                        color = "#e51c23";
                    }
                }
                if(this.$route.meta.type!="approve"){
                    let imgurl = stamper({
                        outsideInfo : this.userInfo.cosName,
                        success : obj.signState=="1"?true:false,
                        stampImage : "stampImage",
                        color:color,
                        status:status
                    });
                    this.stamperImageUrl = imgurl;
                }
            })
            .catch((err)=>{
                console.log(err)
                alertError(this,"1089");
                closeLoading(loading);
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.dueApproveDetail{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
</style>