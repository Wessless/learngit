<template>
    <div class="CommandTaskDetail">
        <chat-header :fixIndex="10" :showBack="true" :title="'交办详情'" :showRightBtn="state=='0'" :rightBtnTitle="'留言'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <div class="createDate"><div style="float:left;">发布者：{{form.CreateUser}}</div></div>
        <div class="detailList">
            <div class="detailItem">
                <div class="detailTitle">发布时间</div>
                <div class="detailContent">{{form.CreateDate}}</div>
                <div class="detailTitle">截止日期</div>
                <div class="detailContent">{{form.EndDate}}</div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">交办内容</div>
                <div class="detailContentNE">{{form.Content}}</div>
            </div>
            <div class="detailItem">
                <div class="detailTitle">接收人</div>
                <div class="detailContentNE">{{form.ReceiveStaff.join("，")}}</div>
                <div class="detailTitle">抄送人</div>
                <div class="detailContentNE">{{form.AcName.join("，")}}</div>
            </div>
        </div>

        <div class="revertList" v-show="form.CommandRevertInfo.length!=0">
            <div class="revertItem" v-for="item in form.CommandRevertInfo" :key="item.RevertInfoID">
                <div class="revertCreateUser">
                    <div class="image" v-show="item.ImagePath!=''"><img :src="imagePath(item.ImagePath)" class="imgimg"></div>
                    <div class="portrait" v-show="item.ImagePath==''" :odd-even="item.StaffID%2" :data-sex="item.Sex">{{firstchar(item.CreateUser)}}</div>
                    <span style="font-size:12px;margin-top:5px">{{item.CreateUser}}</span>
                </div>
                <div class="revertDetail">
                    <div class="revertContent">{{item.Content}}</div>
                    <div class="revertDate">
                        <!-- <span class="DelBtn" v-show="item.StaffID==userInfo.userStaffID" @click="dialogVisibleDel=true">删除</span> -->
                        <span class="Date">{{item.CreateDate}}</span>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            title="交办任务留言"
            :visible.sync="dialogVisibleRev"
            width="500px">
                <el-input v-model="content" type="textarea" rows="4" size="small" placeholder="请输入您的留言"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleRev = false">取 消</el-button>
                <el-button type="primary" @click="confirmRev">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getCommandByID,getCommandRevertInfoes,addCommandRevertInfo } from '@/js/api'
import { showLoading,closeLoading,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'CommandTaskDetail',
    data(){
        return {
            form: {
               CreateUser:"",
               CreateDate:"",
               EndDate:"",
               ReceiveStaffID:[],
               ReceiveStaff:[],
               CommandRevertInfo:[],
               AcID:[],
               AcName:[],
               Content:"",
            },
            currentPage:1,
            pageSize:1000,

            dialogVisibleDel:false,
            content:"",
            dialogVisibleRev:false,
        }
    },
    components:{
        ChatHeader
    },
    props: {
        item:{
            type:Object
        },
        state:{
            type:String
        }
    },
    mounted(){
        this.loadList();
        this.getCommandRevertInfoes();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        imgSrc(){
            return this.item.ImagePath.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/");
        },
    },
    watch:{
    },
    methods:{
        confirm(){
            this.dialogVisibleRev = true;
        },
        confirmRev(){
            // staffID,
            // staffName,
            // commandID,
            // content
            let staffID = this.userInfo.userStaffID;
            let staffName = this.userInfo.userName;
            let commandID = this.item.CommandID;
            if(this.content==""){
                this.$message.error({
                    message:"请输入您的留言"
                });
                return;
            }
            this.dialogVisibleRev = false;
            let loading = showLoading();
            addCommandRevertInfo(staffID,staffName,commandID,this.content).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: '留言成功',
                        type: 'success'
                    });
                    this.loadList();
                }else{
                    this.$message({
                        message: '留言失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"2116");
            });
        },
        loadList(){
            let id = this.item.CommandID;
            let loading = showLoading();
            getCommandByID(id).then((result)=>{
                closeLoading(loading);
                let obj = result.data.data[0];
                console.log(obj);
                this.form.CreateUser = obj.CreateUser;
                this.form.CreateDate = obj.CreateDate;
                this.form.EndDate = obj.EndDate;
                this.form.ReceiveStaffID = obj.ReceiveStaffID!=""?obj.ReceiveStaffID.split(","):"";
                this.getStaffName(this.form.ReceiveStaffID,"0");
                this.form.AcID = obj.AcID!=""?obj.AcID.split(","):"";
                this.getStaffName(this.form.AcID,"1");
                this.form.Content = obj.Content;
                
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1187");
            });
        },
        getCommandRevertInfoes(){
            let id = this.item.CommandID;
            let loading = showLoading();
            getCommandRevertInfoes(this.currentPage,this.pageSize,id).then((result)=>{
                closeLoading(loading);
                let arr = result.data.data;
                this.form.CommandRevertInfo = arr;
                this.getStaffName(this.form.CommandRevertInfo,"2");
                console.log(this.form.CommandRevertInfo)

            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1336");
            });
        },
        getStaffName(array,type){
            for (let i = 0; i < array.length; i++) {
                let obj = this.allStaffs.find((item)=>{
                    if (type=="2") {
                        return array[i].StaffID  === item.StaffID;
                    }else{
                        return array[i]  === item.StaffID;
                    }
                })
                if (type=="0") {
                    this.form.ReceiveStaff.push(obj.StaffName);
                }else if (type=="1") {
                    this.form.AcName.push(obj.StaffName);
                }else{
                    this.form.CommandRevertInfo[i].ImagePath = obj.ImagePath;
                    this.form.CommandRevertInfo[i].Sex = obj.Sex;
                }
            }
        },
        firstchar(userName){
            return userName.substr(userName.length-2<0?0:userName.length-2,userName.length);
        },
        imagePath(path){
            return path.replace("../../../",this.userInfo.currProxy+'/COS'+this.userInfo.cosNum+'/');
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.CommandTaskDetail{
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
}
.detailContentNE{
    flex:1;
    border-bottom:1px solid #999;
    border-right:1px solid #999;
    padding:10px;
    color: #999;
    min-height: 41px;
}

.revertList{
    width:100%;
    border:1px solid #999;
    border-bottom:0px solid #999;
    margin-top: 30px;
}
.revertItem{
    display: flex;
    flex-direction: row;
}
.revertCreateUser{
    width: 90px;
    border-bottom: 1px solid #999;
    border-right: 1px solid #999;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.revertCreateUser > .image{
    width:50px;
    height:50px;
    display: inline-block;
    overflow: hidden;
    position: relative;
    border-radius: 50%;
}
.revertCreateUser > .image .imgimg{
    display: block;
    width: 100%;
    height: 100%;
}
.revertCreateUser .portrait{
    height: 50px;
    width: 50px;
    font-size: 14px;
    line-height: 50px;
}
.revertList:last-child{
    border-bottom:0px solid #999;
}
.revertDetail{
    flex:1;
    border-bottom: 1px solid #999;
    padding:10px 10px 5px 10px;
    min-height: 41px;
    /* background: #fff; */
}
.revertContent{
    height: auto!important;
    min-height: 45px;
    white-space: normal;
    word-break: break-all;
}
.revertDate{
    position: relative;
    height: 22px;
    color: #999;
}
.revertDate .Date{
    position: absolute;
    bottom: 0;
    right: 0;
    display:inline-block;
    color:#999;
    margin-right:10px;
}
/* .revertDate .DelBtn{
    position: absolute;
    bottom: 0;
    right: 0;
    display:inline-block;
    color:#38adff;
    cursor: pointer;
} */
.revertContent .img{
    display: block;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
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