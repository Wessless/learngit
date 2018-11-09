<template>
    <div class="RewardSubjectList">
        <!-- <router-view></router-view> -->
        <chat-header :showBack="true" :title="'赏罚科目'"></chat-header>
        <div style="width:100%;padding:54px 20px 10px 20px;">
            <el-button style="display:block;float:right;margin:10px 10px 10px 5px;" type="primary" size="medium" @click="updateDetail('','add')">添加</el-button>
            <div class="midTableHeight" style="width:100%;display:block;padding:0 10px;">
                <el-table :data="rewardSubjectList" :row-class-name="tableRowClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="470">
                    <el-table-column prop="Title" align="center"  label="赏罚科目"></el-table-column>
                    <el-table-column prop="OnceMoney" align="center"  label="单次赏罚金额（元）"  width="160"></el-table-column>
                    <el-table-column align="center" label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="primary"
                                @click="updateDetail(scope.row,'update')">修改</el-button>
                            <el-button
                                type="danger"
                                size="mini"
                                @click="deleteDetail(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
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
                        :total="itemNum">
                    </el-pagination>
                </div>
            </div>
        </div>

        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisibleUpd"
            width="500px">
            <el-form :model="form" label-width="150px">
                <el-form-item label="科目名称">
                    <el-input v-model="form.itemName" size="small" style="width:200px;" placeholder="请输入科目名称"></el-input>
                </el-form-item>
                <el-form-item label="每次赏罚">
                    <el-input v-model="form.onceMoney" @keyup.native="changeMoney" size="small" style="width:200px;" placeholder="请输入金额">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio v-model="form.isReward" label="0">罚</el-radio>
                    <el-radio style="margin-left:20px;" v-model="form.isReward" label="1">赏</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleUpd = false">取 消</el-button>
                <el-button type="primary" @click="confirmSet">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="提示"
            :visible.sync="dialogVisibleDel"
            width="500px">
            <span>您确定要删除该赏罚科目吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleDel = false">取 消</el-button>
                <el-button type="primary" @click="confirmDel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getRewardPunishmentSort,addRewardPunishmentSort,deleteRewardPunishmentSort } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'RewardSubjectList',
    data(){
        return {
            form:{
                itemName:"",
                onceMoney:"",
                isReward:""
            },

            currentPage:1,
            pageSize:10,
            itemNum:0,
            rewardSubjectList:[],

            clickItem:{},
            type:"",
            dialogVisibleUpd:false,
            dialogVisibleDel:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        dialogTitle(){
            if (this.type == "add") {
                return "添加科目"
            }else if (this.type == "update") {
                return "修改科目"
            }
        },
    },
    methods:{
        loadList(){
            this.rewardSubjectList = [];

            let loading = showLoading();
            getRewardPunishmentSort(this.currentPage,this.pageSize).then((result)=>{
                closeLoading(loading);
                this.rewardSubjectList = result.data.data;
                this.itemNum = result.data.totalCount;
                console.log(this.rewardSubjectList);
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1185");
            });
        },
        updateDetail(item,type){
            this.form.staffIDs = [];
            if (type=="update") {
                this.clickItem = item; 
                this.form.itemName = item.Title;
                this.form.onceMoney = Math.abs(item.OnceMoney);
                this.form.isReward = item.Type;
            }else{
                this.form.itemName = "";
                this.form.onceMoney = "";
                this.form.isReward = "0";
            }
            this.type = type;
            this.dialogVisibleUpd = true;
        },
        confirmSet(){
            // id,staffID,title,onceMoney,isReward
            let json = {
                id:"",
                staffID:this.userInfo.userStaffID,
                title:this.form.itemName,
                onceMoney:this.form.onceMoney,
                isReward:this.form.isReward,
            }
            if (this.type=="update") {
                json.id = this.clickItem.RewardPunishmentSortID;
            }
            if(json.title==""){
                this.$message.error({
                    message:"请输入科目名称"
                });
                return;
            }
            if(json.onceMoney==""){
                this.$message.error({
                    message:"请输入每次赏罚的金额"
                });
                return;
            }
            this.dialogVisibleUpd = false;
            let loading = showLoading();
            addRewardPunishmentSort(json).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: this.type=='add'?"添加":"修改"+'成功',
                        type: 'success'
                    });
                    this.loadList();
                }else{
                    this.$message({
                        message: this.type=='add'?"添加":"修改"+'失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                alertError(this,"2113");
            });
        },
        //删除赏罚
        deleteDetail(item){
            this.clickItem = item;
            this.dialogVisibleDel = true;
        },
        confirmDel(){
            this.dialogVisibleDel = false;
            let id = this.clickItem.RewardPunishmentSortID;
            let loading = showLoading();
            deleteRewardPunishmentSort(id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
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
                alertError(this,"2112");
            });
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.loadList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.loadList();
        },
        //金额转换
        changeMoney(){
            let value = this.form.onceMoney;
            value = value.replace(/[^\d\.]/g,"").replace(/(\.\d{2}).+$/,"$1").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0");
            if(value.indexOf(".")< 0 && value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                value= parseFloat(value); 
            } 
            value = money(value)
            this.form.onceMoney = value;
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
				return 'padding-bottom:7px;text-align:center;'
			} else {
				return ''
            }
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
            return '';
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.RewardSubjectList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .rewardSubjectList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.rewardSubjectList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .rewardSubjectList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .rewardSubjectList{
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
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.spanTitle{
    display: block;
    height: 22px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.orangeButton{
    background: #FF9D00;
    border-color: #FF9D00;
    color: #fff;
}
.orangeButton:hover{
    background: rgb(255, 179, 56);
    border-color: rgb(255, 179, 56);
    color: #fff;
}
</style>