<template>
    <div class="InternalEmailList">
        <chat-header :showBack="true" :title="'站内邮件'"  :showRightBtn="true" :rightBtnTitle="'写邮件'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="">
                    <el-select v-model="form.flag" filterable @change="reloadList" style="width:150px;">
                        <el-option
                            v-for="item in form.flagArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item>
                    <span style="color:#999;margin-left:10px;">共{{ this.form.emailNum }}封邮件</span>
                </el-form-item> -->
                <el-form-item label="">
                    <el-select v-model="form.signFlag" v-show="form.flag!='-3'" style="width:100px;" placeholder="标记为..." @change="unReadOrReadLocalMail">
                        <el-option
                            v-for="item in form.signFlagArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item style="margin-left:20px;">
                    <el-button type="danger" v-show="form.flag!='-3'" @click="clickDelete">删除</el-button>
                    <el-radio v-show="form.flag=='-3'" style="margin-left:10px;" @change="loadList" v-model="isReceive" label="1">来自收件</el-radio>
                    <el-radio v-show="form.flag=='-3'" style="margin-left:10px;" @change="loadList" v-model="isReceive" label="0">来自发件</el-radio>
                    <el-button type="primary" v-show="form.flag=='-3'" style="margin-left:30px;" @click="clickRevocer">恢复</el-button>
                </el-form-item>

                <el-form-item style="float:right;">
                    <el-button type="primary"  style="float:left;" @click="loadList()">检索</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-input v-model="form.searchText" style="float:left;" placeholder="请输入关键字进行检索"></el-input>
                </el-form-item>
                <!-- <el-form-item style="float:right;">
                    <el-radio v-model="form.searchType" label="2" v-show="form.flag=='-1'">按ID</el-radio>
                    <el-radio v-model="form.searchType" label="1" style="margin-left:10px;">按邮件信息</el-radio>
                </el-form-item> -->
            </el-form>
                
                <!-- <el-form-item>
                    <el-checkbox v-model="signAll" @change="signAllEmail">标记全部</el-checkbox>
                </el-form-item> -->
        </div>
        <!-- <div style="width:30%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                
            </el-form>
        </div> -->
        <!-- <no-data :isShow="isNoData"></no-data> -->
        <!-- <div class="internalEmailList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Internal-Email-item v-for="item in internalEmailList" :key="item.num" :item="item" :flag="form.flag" @clickDelete="clickDelete" @clickIsRead="clickIsRead"></Internal-Email-item>
        </div> -->
        <div class="midTableHeight" style="width:100%;display:block;">

            <el-table :data="internalEmailList" v-show="form.flag!='-3'" :cell-style="getColStyle" tooltip-effect="light" :header-cell-style="getRowStyle" @selection-change="handleSelectionChange" border max-height="405">
                <el-table-column type="selection" align="center" width="40"></el-table-column>
                <el-table-column align="center"  width="45">
                    <template slot-scope="scope">
                        <b class="iconfont" :style="{color:scope.row.IsUnread=='1'?'#FF9D00':'#38ADFF'}">{{scope.row.IsUnread=='1'?`&#xe739;`:`&#xe73a;`}}</b>
                    </template>
                </el-table-column>
                <el-table-column v-if="form.flag!='-2'" :show-overflow-tooltip='true' prop="Sender" align="center"  label="发件人"  width="100"></el-table-column>
                <el-table-column v-if="form.flag=='-2'" :show-overflow-tooltip='true' prop="Receivers" align="center"  label="收件人"  width="100"></el-table-column>
                <el-table-column :show-overflow-tooltip='true' label="主题"  width="">
                    <template slot-scope="scope">
                        <span class="spanTitle" @click="examineEmail(scope.row)">{{scope.row.Title}}</span>
                    </template>
                </el-table-column>
                <el-table-column  prop="SentTime" align="center"  label="收件时间"  width="160"></el-table-column>
                <el-table-column  prop="MailSize" align="center"  label="大小"  width="80"></el-table-column>
                <el-table-column  align="center"  label="邮件ID"  width="80">
                    <template slot-scope="scope">
                        <span>{{form.flag=='-2'?scope.row.MailID:scope.row.ID}}</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-table :data="internalEmailList" v-show="form.flag=='-3'" :cell-style="getColStyle" tooltip-effect="light" :header-cell-style="getRowStyle" @selection-change="handleSelectionChange" border max-height="405">
                <el-table-column type="selection" align="center" width="40"></el-table-column>
                <el-table-column align="center"  width="45">
                    <template slot-scope="scope">
                        <b class="iconfont" :style="{color:scope.row.IsUnread=='1'?'#FF9D00':'#38ADFF'}">{{scope.row.IsUnread=='1'?`&#xe739;`:`&#xe73a;`}}</b>
                    </template>
                </el-table-column>
                <el-table-column v-if="isReceive=='1'" :show-overflow-tooltip='true' prop="Address" align="center"  label="发件人"  width="100"></el-table-column>
                <el-table-column v-if="isReceive=='0'" :show-overflow-tooltip='true' prop="Address" align="center"  label="收件人"  width="100"></el-table-column>
                <el-table-column align="center"  :show-overflow-tooltip='true' label="主题"  width="">
                    <template slot-scope="scope">
                        <span class="spanTitle" @click="examineEmail(scope.row)">{{scope.row.Title}}</span>
                    </template>
                </el-table-column>
                <el-table-column  prop="SentTime" align="center"  label="收件时间"  width="160"></el-table-column>
                <el-table-column  prop="DeleteTime" align="center"  label="删除时间"  width="160"></el-table-column>
                <el-table-column  prop="MailSize" align="center"  label="大小"  width="80"></el-table-column>
                <el-table-column  prop="ID" align="center"  label="邮件ID"  width="80"></el-table-column>
            </el-table>
            <div>
                <el-pagination
                    style="float:left;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="form.emailNum">
                </el-pagination>
            </div>
        </div>
        <!-- <div class="EmailPagination" style="width:100%;margin-top:15px;">
            <el-pagination
                style="float:right;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="form.emailNum">
            </el-pagination>
        </div> -->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>您确定要删除该邮件吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import {localMailList,deleteLocalMail,unReadOrReadLocalMail,recoverDeleteMail } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import NoData from '@/components/chat/NoData'
import ChatHeader from '@/components/chat/ChatHeader'
// import InternalEmailItem from '@/page/office/internalEmail/InternalEmailItem'

export default {
    name: 'InternalEmailList',
    data(){
        return {
            form: {
                emailNum:0,
                flag:"-1",
                flagArr:[
                    {"value":"-1","label":"收件箱"},
                    {"value":"-2","label":"已发邮件"},
                    {"value":"-3","label":"已删除邮件"}
                    ],
                signFlag:"",
                signFlagArr:[
                    {"value":"0","label":"未读"},
                    {"value":"1","label":"已读"},
                    ],
                searchText:"",
                searchType:"1",
            },
            dialogVisible:false,
            checkEmailArr:[],
            clickItem:{},
            internalEmailList:[],
            pageSize:10,
            currentPage:1,
            isNoData:false,
            isReceive:"",
        }
    },
    components:{
        ChatHeader,
        // InternalEmailItem,
        NoData,
    },
    mounted(){
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    methods:{
        loadList(){
            this.internalEmailList = [];
            let flag = this.form.flag;
            let staffID = this.userInfo.userStaffID;
            let searchType = this.form.searchType;
            let searchText = this.form.searchText;
            let loading = showLoading();
            localMailList(flag,staffID,searchType,searchText,this.currentPage,this.pageSize,this.isReceive).then((result)=>{
                closeLoading(loading);
                for(let i=0;i<result.data.data.length;i++){
                    this.internalEmailList.push(result.data.data[i]);
                }
                console.log(this.internalEmailList)
                this.form.emailNum = parseInt(result.data.totalCount);
                if(this.internalEmailList.length==0){
                    this.form.emailNum = 0;
                }else{
                    this.isNoData = false;
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"1313");
            });
        },
        // loadList(reload){
        //     // flag:-1收件箱，-2已发邮件，-3已删除邮件
        //     // staffId
        //     // searchType:1检索，2Id检索
        //     // searchText
        //     let flag = this.form.flag;
        //     let staffID = this.userInfo.userStaffID;
        //     let searchType = this.form.searchType;
        //     let searchText = this.form.searchText;
        //     if(reload){
        //         this.currentPage = 1;
        //         this.isDisabled = false;
        //     }
        //     if(!this.isDisabled){
        //         this.isDisabled = true;
        //         let loading = showLoading();
        //         localMailList(flag,staffID,searchType,searchText,this.currentPage,this.pageSize).then((result)=>{
        //             if(reload){
        //                 this.internalEmailList = [];
        //             }
        //             if(result.data.totalCount<this.currentPage*this.pageSize){
        //                 this.isDisabled = true;
        //             }else{
        //                 this.isDisabled = false;
        //             }
        //             closeLoading(loading);
        //             this.currentPage++;
        //             for(let i=0;i<result.data.data.length;i++){
        //                 // result.data.data[i].selected = false;
        //                 this.internalEmailList.push(result.data.data[i]);
        //             }
        //             this.form.emailNum = result.data.totalCount;
        //             if(this.internalEmailList.length==0){
        //                 this.isNoData = true;
        //                 this.form.emailNum = 0;
        //             }else{
        //                 this.isNoData = false;
        //             }
        //         }).catch((err)=>{
        //             alertError(this,"");
        //         });
        //     }
        // },
        //标记为全部
        // signAllEmail(){
        //     if (this.signAll) {
        //         for (let i = 0; i < this.internalEmailList.length; i++) {
        //             this.internalEmailList[i].selected = true;
        //         }
        //     }else{
        //         for (let i = 0; i < this.internalEmailList.length; i++) {
        //             this.internalEmailList[i].selected = false;
        //         }
        //     }
        // },
        reloadList(){
            if (this.form.flag!='-3') {
                this.isReceive = ""
            }else{
                this.isReceive = "1"
            }
            this.form.searchType = "1";
            this.form.searchText = "";
            this.loadList();
        },
        handleSelectionChange(arr){
            this.checkEmailArr = arr;
        },
        unReadOrReadLocalMail(){
            let array = this.checkEmailArr;
            if (array.length==0) {
                this.$message({
                    message:"未选中任何邮件",
                });
                this.form.signFlag = "";
                return
            }
            let Ids = array[0].ID;
            for (let i = 1; i < array.length; i++) {
                Ids += ','+array[i].ID;
            }
            let flag = this.form.signFlag;
            let loading = showLoading();
            unReadOrReadLocalMail(Ids,flag).then((result)=>{
                closeLoading(loading);
                if(result.data.Result==1){
                    this.form.signFlag = "";
                    this.loadList();
                }else{
                    this.form.signFlag = "";
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"");
            })
        },
        confirm(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        clickDelete(){
            if (this.checkEmailArr.length==0) {
                this.$message({
                    message:"未选中任何邮件",
                });
                return
            }
            this.dialogVisible = true;
        },
        confirmDel(){
            this.dialogVisible = false;
            let array = this.checkEmailArr;
            let staffId = this.userInfo.userStaffID;
            let Ids;
            if (this.form.flag=='-1') {
                Ids = array[0].ID;
                for (let i = 1; i < array.length; i++) {
                    Ids += ','+array[i].ID;
                }
            }else if (this.form.flag=='-2') {
                Ids = array[0].MailID;
                for (let i = 1; i < array.length; i++) {
                    Ids += ','+array[i].MailID;
                }
            }
            let loading = showLoading();
            deleteLocalMail(staffId,Ids).then((result)=>{
                closeLoading(loading);
                if(result.data.Result==1){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.loadList();
                }else{
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2205");
            })
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.loadList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.loadList();
        },
        examineEmail(item){
            if (this.form.flag=='-1') {
                let ID = item.ID;
                let flag = "1";
                
                unReadOrReadLocalMail(ID,flag).then((result)=>{})
                .catch((err)=>{alertError(this,"2206");})

                this.$router.push(this.$route.fullPath+"/examine/"+ID+'&'+this.form.flag);
            }else if (this.form.flag=='-2') {
                let ID = item.MailID;
                this.$router.push(this.$route.fullPath+"/examine/"+ID+'&'+this.form.flag);
            }
        },
        clickRevocer(){
            let flag = this.isReceive;
            let array = this.checkEmailArr;
            let Ids;
            Ids = array[0].ID;
            for (let i = 1; i < array.length; i++) {
                Ids += ','+array[i].ID;
            }
            let loading = showLoading();
            recoverDeleteMail(flag,Ids).then((result)=>{
                closeLoading(loading);
                if(result.data.Result==1){
                    this.$message({
                        message: '恢复成功',
                        type: 'success'
                    });
                    this.loadList();
                    this.form.flag = "-3"
                }else{
                    this.$message({
                        message: '恢复失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                alertError(this,"");
            })
        },

        //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0) {
                if (columnIndex == 0) {
				    return 'padding-bottom:7px;background:#38ADFF;color:#fff;'
                }
                return 'background:#38ADFF;color:#fff;text-align:center;'
            }
        },
        getColStyle({ row, column, rowIndex, columnIndex }){
            if (columnIndex == 0) {
				return 'padding-bottom:7px;'
			} else {
				return ''
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.InternalEmailList{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .internalEmailList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.internalEmailList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .internalEmailList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .internalEmailList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.addbtn{
    float: right;
}
.spanTitle{
    color:#38ADFF;
    cursor: pointer;
    /* white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden; */
}
.iconfont{
    font-weight: normal;
    font-size: 20px;
}
</style>