<template>
    <div class="businessApproveDetail">
        <chat-header :showBack="true" :title="title"></chat-header>
        <div class="createDate"><span>单号：{{detail.ApplyID}}</span><span>填表日期：{{detail.FillDate}}</span></div>
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
                <div class="detailContent">{{detail.ActualName}}</div>
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
                    <span class="file" v-for="item in detail.PathMsg" :key="item.AttachmentID" @click="downloadFile(item)">{{item.AttachmentName}}</span>
                </div>
            </div>

            <div class="detailItem" v-for="(item,index) in detail.data" :key="index+1">
                <div class="detailTitle">签字人姓名</div>
                <div class="detailContent flexItemCenter">
                    <span>{{item.ApprovalName}}</span>
                </div> 
                <div class="detailTitle">签字人评论</div>
                <div class="detailContent" style="flex:3;">
                    <span>{{item.Remark}}</span>
                </div>
                <div class="detailTitle" style="flex:0.7;">签字结果</div>
                <div class="detailContent flexItemCenter" style="flex:1.3;">
                    <span>{{item.Result!='0'?(item.Result=="1"?"同意":"拒绝"):"待签字"}}</span>
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

import { getCommodityorderApplyByID,downloadFile } from '@/js/api'
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
            },
            stamperImageUrl:"",
            status:"1",
        }
    },
    components:{
        ChatHeader,
        imageProxy
    },
    mounted(){
        this.loadDetail();
        this.title = '订单详情';
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
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
        loadDetail(){
            let id = this.$route.params.orderformID;
            let loading = showLoading();
            getCommodityorderApplyByID(id).then((result)=>{
                closeLoading(loading);

                let obj = result.data;
                // OrderNum:"",      //订单编号
                // UserID:"",        //用户ID  
                // UserName:"",      //用户
                // salesman:"",      //销售员
                // StaffID:"",       //申请人ID
                // StaffName:"",     //申请人
                // Price:"",         //总金额
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

                this.detail = obj;

                let status = "";
				let color = "";
				if(obj.ShowStatus=="待审批"){
					status = "待审批";// red
					color = "#e51c23";
				}else if(obj.ShowStatus=="待收款"){
					status = "待收款";//  orange
					color = "#FF9D00";
				}else if(obj.ShowStatus=="待出库"){
					status = "待出库";//  blue
					color = "#38ADFF";
				}else if(obj.ShowStatus=="已处理完毕"){
					status = "处理完毕";// green
					color = "#4DC060";
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