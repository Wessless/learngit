<template>
    <div class="businessApproveDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="isShowButton" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <div class="createDate"><span></span><span>填表日期：{{detail.CreateDate}}</span></div>
        <img :src="stamperImageUrl" v-show="stamperImageUrl" class="stamperImage" alt="">
        <div class="detailList">
            <div class="detailItem">
                <div class="detailTitle">申请人姓名</div>
                <div class="detailContent">{{detail.ApplyName}}</div>
            </div>

            <div class="detailItem">
                <div class="detailTitle">请假种类</div>
                <div class="detailContent">{{holiType}}</div>
                <div class="detailTitle">处理方法</div>
                <div class="detailContent">{{handingMethod}}</div>
            </div>

            <div class="detailItem">
                <div class="detailTitle">请假时间</div>
                <div class="detailContent">{{detail.holiDate}}</div>
                <div class="detailTitle">请假时长</div>
                <div class="detailContent">{{detail.holiDuration}}</div>
            </div>

            <div class="detailItem" v-show="detail.handingMethod=='3'">
                <div class="detailTitle">倒休时间</div>
                <div class="detailContent">{{detail.offDate}}</div>
                <div class="detailTitle">倒休时长</div>
                <div class="detailContent">{{detail.offDuration}}</div>
            </div>

            <div class="detailItem">
                <div class="detailTitle">请假事由</div>
                <div class="detailContent">{{detail.holiReason}}</div>
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

import { getExamineByID,signExamine } from '@/js/api'
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
                holiType:"",      //请假种类
                handingMethod:"", //处理方法  
                holiDate:"",      //请假时间
                holiDuration:"",  //请假时长
                offDate:"",       //倒休时间
                offDuration:"",   //倒休时长
                holiReason:"",    //请假事由
                ApplyUser:"",
                ApplyName:"",
                CreateDate:"",
                Content:[],
                Images:[],
                approvalArr:[]
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
        this.title = '请假详情';
        if (this.$route.meta.type=="approve") {
            this.title = '请假审批';
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
        handingMethod(){
            if(this.detail.handingMethod=="1"){
                return "使用年假";
            }else if(this.detail.handingMethod=="2"){
                return "薪金扣除";
            }else{
                return "倒休";
            }
        },
        holiType(){
            if(this.detail.holiType=="1"){
                return "病假";
            }else if(this.detail.holiType=="2"){
                return "事假";
            }else if(this.detail.holiType=="4"){
                return "工伤假";
            }else{
                return "产假/婚假/丧假等";
            }
        }
    },
    watch:{
    },
    methods:{
        confirm(){
            let cosNum = this.userInfo.cosNum;
            let id = this.$route.params.holidayID;
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
            if (remark == "") {
                this.$message.error({
                    message:"请输入签字人评论"
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
            let examineID = this.$route.params.holidayID;
            let loading = showLoading();
            getExamineByID(cosNum,examineID).then((result)=>{
                closeLoading(loading);

                let obj = result.data;
                obj.approvalArr = [];
                obj.examineID = examineID;
                let Content = JSON.parse(result.data.Content);
                // holiType:"",      //请假种类
                // handingMethod:"", //处理方法  
                // holiDate:"",      //请假时间
                // holiDuration:"",  //请假时长
                // offDate:"",       //倒休时间
                // offDuration:"",   //倒休时长
                // holiReason:"",    //请假事由
                for (let j = 0; j < Content.length; j++) {
                    if (Content[j].name=='请假种类') {
                        obj.holiType = Content[j].value
                    }
                    if (Content[j].name=='处理方法') {
                        obj.handingMethod = Content[j].value
                    }
                    if (Content[j].name=='请假时间') {
                        obj.holiDate = Content[j].value
                    }
                    if (Content[j].name=='请假时长') {
                        obj.holiDuration = Content[j].value
                    }
                    if (Content[j].name=='倒休时间') {
                        obj.offDate = Content[j].value
                    }
                    if (Content[j].name=='倒休时长') {
                        obj.offDuration = Content[j].value
                    }
                    if (Content[j].name=='请假事由') {
                        obj.holiReason = Content[j].value
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
                console.log(this.detail);
            })
            .catch((err)=>{
                console.log(err)
                alertError(this,"1089");
            });
        },
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
</style>