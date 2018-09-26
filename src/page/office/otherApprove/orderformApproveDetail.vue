<template>
    <div class="businessApproveDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="isShowButton" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <div class="createDate"><span>单号：{{detail.ApplyID}}</span><span>填表日期：{{detail.CreateDate}}</span></div>
        <img :src="stamperImageUrl" v-show="stamperImageUrl" class="stamperImage" alt="">
        <div class="detailList">
            <div class="detailItem">
                <div class="detailTitle">订单编号</div>
                <div class="detailContent">{{detail.OrderNum}}</div>
                <div class="detailTitle">用户</div>
                <div class="detailContent">{{detail.UserName}}</div>
            </div>

            <div class="detailItem">
                <div class="detailTitle">申请人</div>
                <div class="detailContent">{{detail.StaffName}}</div>
                <div class="detailTitle">销售员</div>
                <div class="detailContent">{{detail.salesman}}</div>
                <div class="detailTitle">总金额</div>
                <div class="detailContent" style="color: #FF9D00;">{{detail.Price}}</div>
            </div>
            
            <div class="detailItem">
                <div class="detailTitle">订单明细</div>
                <div class="detailContent noBorder" style="flex:3;">
                    <div class="smallItem" v-for="item in detail.DetailList" :key="item.CommodityID">
                        <div class="smallContent" style="width:300px;">产品分类：{{item.SortName}}</div>
                        <div class="smallContent" style="width:400px;">产品名称：{{item.CommodityName}}</div>
                        <div class="smallContent" style="width:300px;">定价信息：{{item.DatailPrice}}</div>
                        <div class="smallContent" style="width:200px;color: #FF9D00;">调整价格：{{item.SellPrice}}</div>
                        <div class="smallContent" style="width:200px;">价格单位：{{item.SellPriceUnit}}</div>
                        <div class="smallContent" style="width:300px;">有效日期：{{item.StartDate!=''?item.StartDate+`&nbsp;~&nbsp;`:""}}{{item.EndDate}}</div>
                        <div class="smallContent" style="width:200px;">数量：{{item.Count}}</div>
                        <div class="smallContent" style="width:200px;color: #FF9D00;">小计：{{item.Sum}}</div>
                    </div>
                </div>
            </div>

            <div class="detailItem">
                <div class="detailTitle">附加费</div>
                <div class="detailContent noBorder" style="flex:1;">
                    <div class="smallItem">
                        <div class="smallContent" style="width:25%;line-height:40px;">施工费：{{detail.ConstructionFee}}</div>
                        <div class="smallContent" style="width:25%;line-height:40px;">运输费：{{detail.TransportationFee}}</div>
                        <div class="smallContent" style="width:25%;line-height:40px;">税金：{{detail.Tax}}</div>
                        <div class="smallContent" style="width:25%;line-height:40px;">其他：{{detail.OtherFee}}</div>
                    </div>
                </div>
                <div class="detailTitle flexItemCenter" style="flex:0.2;">合计</div>
                <div class="detailContent" style="color: #FF9D00;flex:0.3;">{{extraSum}}</div>
            </div>

            <div class="detailItem">
                <div class="detailTitle">关联文件</div>
                <div class="detailContent">
                    <span class="file" v-for="item in detail.AttachmentList" :key="item.AttachmentID" @click="downloadFile(item)">{{item.AttachmentName}}</span>
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
                    <span v-show="!item.showApproval">{{item.Result!='0'?(item.Result=="1"?"同意":"拒绝"):"待签字"}}</span>
                    <div v-show="item.showApproval">
                        <el-radio v-model="status" label="1" style="margin-left:-5px;">同意</el-radio>
                        <el-radio v-model="status" label="2" style="margin-left:6px;">拒绝</el-radio>
                    </div>
                </div>
            </div>
            
            <div class="detailItem">
                <div class="detailTitle">图片</div>
                <div class="detailContent">
                    <div class="image" v-for="item in detail.Images" :key="item"><image-proxy :canBrowse="true" :imagePath="item"></image-proxy></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { getExamineByID,signExamine,downloadFile } from '@/js/api'
import { money,stamper,showLoading,closeLoading ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import imageProxy from '@/components/chat/ImageProxy'

export default {
    name: 'businessApproveDetail',
    data(){
        return {
            title:"",
            detail:{
                examineID:"",
                OrderNum:"",          //订单编号
                UserID:"",            //用户ID  
                UserName:"",          //用户
                salesman:"",          //销售员
                StaffID:"",           //申请人ID
                StaffName:"",         //申请人
                Price:"",             //总金额
                ConstructionFee:"",   //施工费
                TransportationFee:"", //运输费
                Tax:"",               //税金
                OtherFee:"",          //其他
                AttachmentList:[],    //关联文件
                ApplyUser:"",
                ApplyName:"",
                CreateDate:"",
                Content:[],
                Images:[],
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
        this.title = '订单详情';
        if (this.$route.meta.type=="approve") {
            this.title = '订单审批';
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        isShowButton(){
            if (this.$route.meta.type=="approve") {
                return true;
            }else{
                return false;
            }
        },
        extraSum(){
            let ConstructionFee = this.detail.ConstructionFee?this.detail.ConstructionFee:0;
            let TransportationFee = this.detail.TransportationFee?this.detail.TransportationFee:0;
            let Tax = this.detail.Tax?this.detail.Tax:0;
            let OtherFee = this.detail.OtherFee?this.detail.OtherFee:0;
            let sum = parseFloat(ConstructionFee)+
                      parseFloat(TransportationFee)+
                      parseFloat(Tax)+
                      parseFloat(OtherFee);
            return sum;
        }
    },
    watch:{
    },
    methods:{
        confirm(){
            let cosNum = this.userInfo.cosNum;
            let id = this.$route.params.orderformID;
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
        loadDetail(){
            let cosNum = this.userInfo.cosNum;
            let examineID = this.$route.params.orderformID;
            let loading = showLoading();
            getExamineByID(cosNum,examineID).then((result)=>{
                closeLoading(loading);

                let obj = result.data;
                obj.approvalArr = [];
                obj.examineID = examineID;
                let Content = JSON.parse(result.data.Content);
                // OrderNum:"",      //订单编号
                // UserID:"",        //用户ID  
                // UserName:"",      //用户
                // salesman:"",      //销售员
                // StaffID:"",       //申请人ID
                // StaffName:"",     //申请人
                // Price:"",         //总金额
                for (let j = 0; j < Content.length; j++) {
                    if (Content[j].name=='ID') {
                        obj.ApplyID = Content[j].value
                    }
                    if (Content[j].name=='订单编号') {
                        obj.OrderNum = Content[j].value
                    }
                    if (Content[j].name=='用户ID') {
                        obj.UserID = Content[j].value
                    }
                    if (Content[j].name=='用户') {
                        obj.UserName = Content[j].value
                    }
                    if (Content[j].name=='销售员') {
                        obj.salesman = Content[j].value
                    }
                    if (Content[j].name=='申请人ID') {
                        obj.StaffID = Content[j].value
                    }
                    if (Content[j].name=='申请人') {
                        obj.StaffName = Content[j].value
                    }
                    if (Content[j].name=='总金额') {
                        obj.Price = Content[j].value
                    }
                }
                obj.Images = [];
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
                
                for(let i=0;i<obj.data.length;i++){
                    if(obj.data[i].ApprovalUser==this.userInfo.userStaffID&&this.$route.meta.type=="approve"){
                        obj.data[i].showApproval = true;
                    }
                    let boolean = obj.approvalArr.find((item)=>{
                        return obj.data[i].ApprovalUser === item.ApprovalUser;
                    })
                    if (boolean) {
                        continue
                    }else{
                        obj.approvalArr.push(obj.data[i]);
                    }
                }

                this.detail = obj;

                let status = "";
				let color = "";
				if(obj.Result=="0"){
					status = "待签字";// gray 
					color = "#8f8f94";
				}else if(obj.Result=="1"){
					status = "审批同意";// green 
					color = "#2ecc71";
				}else if(obj.Result=="2"){
					status = "审批拒绝";// orange 
					color = "#e51c23";
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
                alertError(this,"1089");
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
.businessApproveDetail{
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
.noBorder{
    border-bottom: 0px;
    padding: 0;
}
.smallItem{
    display: flex;
    flex-direction: row;
    border-bottom:1px solid #999;
    color: #999;
    min-height: 41px;
    flex-wrap: wrap;
}
.smallContent{
    padding:0 5px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    align-items: center;
}
</style>