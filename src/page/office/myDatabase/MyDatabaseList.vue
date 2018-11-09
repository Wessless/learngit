<template>
    <div class="borrow">
        <chat-header :showBack="true" :title="'我的资料库'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <!-- <el-form-item label="">
                    <el-input v-model="formInline.fileName" placeholder="请输入文件名"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="">
                    <el-select v-model="formInline.staffID" filterable placeholder="请选择同事">
                        <el-option
                        v-for="item in formInline.staffs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadList(true)">查询</el-button>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="addKnowledgeBase">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="midTableHeight" style="width:100%;display:block;padding:0px 10px;">
            <el-table :data="myDatabaseList" :cell-class-name="tableCellClassName" :header-cell-style="getRowStyle" border max-height="470">
                <!-- <el-table-column prop="" align="center"  label="类别"  width="120"></el-table-column> -->
                <el-table-column prop="KnowledgeBaseName"  label="名称">
                    <template slot-scope="scope">
                        <span class="spanTitle">{{scope.row.KnowledgeBaseName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ANum" align="center"  label="个数"  width="80"></el-table-column>
                <el-table-column prop="CreateUser" align="center"  label="创建者"  width="80"></el-table-column>
                <el-table-column prop="CreateDate" align="center"  label="创建时间"  width="155"></el-table-column>
                <el-table-column label="检索/维护" width="147">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            v-show="scope.row.EnableBrowse=='1'"
                            @click="detailBrowse(scope.row)">检索</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            v-show="scope.row.EnableModify=='1'"
                            @click="detailKnowledge(scope.row)">维护</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="205">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            v-show="scope.row.EnableSet=='1'"
                            @click="setManager(scope.row)">权限管理+修改</el-button>
                        <el-button
                            type="danger"
                            size="mini"
                            v-show="scope.row.EnableSet=='1'"
                            @click="deleteKnowledge(scope.row)">删除</el-button>
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
        
        <el-dialog
            title="删除"
            :visible.sync="dialogVisible"
            width="30%">
        <span>是否删除该资料库</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteKnowledgeBase">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>

import { getBaseByStaffID,deleteKnowledgeBase } from '@/js/api'
import { showLoading,closeLoading ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'MyDatabase',
    data(){
        return {
            formInline: {
                staffID: '',
                staffs:[]
            },
            isNoData:false,
            myDatabaseList:[],
            pageSize:10,
            currentPage:1,
            itemNum:0,
            isDisabled:false,
            dialogVisible:false,
            clickItem:{},
        }
    },
    components:{
        ChatHeader,
    },
    mounted(){
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ])
    },
    watch:{
    },
    methods:{
        ...mapMutations([
            'SET_KNOWLEDGEID',
            'SET_TREENODEID',
        ]),
        addKnowledgeBase(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        deleteKnowledge(item){
            this.clickItem = item;
            this.dialogVisible = true;
        },
        deleteKnowledgeBase(){
            let id = this.clickItem.KnowledgeBaseID;
            deleteKnowledgeBase(id).then((result)=>{
                if(result.data.Result=="1"){
                    this.$message({
                        type:'success',
                        message:result.data.Msg
                    });
                    this.loadList(true);
                    this.dialogVisible = false;
                }else{
                    this.$message.error({
                        message:result.data.Msg
                    });
                }
            }).catch((err)=>{
                console.log(err);
                alertError(this,"2128");
            });
        },
        loadList(){
            let staffID = this.userInfo.userStaffID;
            let loading = showLoading();
            getBaseByStaffID(this.currentPage,this.pageSize,staffID).then((result)=>{
                closeLoading(loading);
                this.myDatabaseList = result.data.data;
                this.itemNum = parseInt(result.data.totalCount);
                console.log(this.myDatabaseList);
            }).catch((err)=>{
                alertError(this,"1194");
            });
        },
        //权限管理+修改
        setManager(item){
            this.$router.push(this.$route.fullPath+"/update/"+item.KnowledgeBaseID);
        },
        //维护
        detailKnowledge(item){
            this.SET_KNOWLEDGEID(item.KnowledgeBaseID);
            this.SET_TREENODEID({});
            this.$router.push(this.$route.fullPath+"/maintenance");
        },
        //检索
        detailBrowse(item){
            this.SET_KNOWLEDGEID(item.KnowledgeBaseID);
            this.SET_TREENODEID({});
            this.$router.push(this.$route.fullPath+"/browse");
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.loadList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.loadList();
        },

        //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0) {
                return 'background:#38ADFF;color:#fff;text-align:center;'
            }
        },
        // getColStyle({ row, column, rowIndex, columnIndex }){
        //     if (columnIndex == 0) {
		// 		return 'padding-bottom:7px;text-align:center;'
		// 	} else {
		// 		return ''
        //     }
        // },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
            return '';
        },
        tableCellClassName({ row, column, rowIndex, columnIndex }) {
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.borrow{
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
/* .myDatabaseList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.myDatabaseList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .myDatabaseList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .myDatabaseList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.spanTitle{
    display: inline-block;
    height: 17px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>