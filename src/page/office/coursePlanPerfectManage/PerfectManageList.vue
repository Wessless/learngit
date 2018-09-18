<template>
    <div class="interestClassTeacher">
        <chat-header :showBack="true" :title="title" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="baseOfSort" style="margin-left:10px;" @change="loadList" filterable size="medium" placeholder="请选择排序方式">
                        <el-option
                        v-for="item in baseArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="float:right;" v-show="$route.meta.type!='examine'">
                    <el-button type="primary" size="medium" @click="addThemeDatabase" >添加</el-button>
                </el-form-item>
                <el-form-item style="float:right;" v-show="$route.meta.type!='examine'">
                    <el-button type="primary" size="medium" @click="sortDialogVisible = true">分类管理</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="coursePlanList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="10">
            <Perfect-Manage-item v-for="item in coursePlanList" :key="item.ID" :sortArr="sortArr" :item="item" @clickDelete="clickDelete"></Perfect-Manage-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="DialogVisible"
            width="30%">
            <span>是否删除该教案</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="DialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="分类管理"
            :visible.sync="sortDialogVisible"
            width="30%">
            <el-table :data="sortArr" style="width:100%;display:block;" border max-height="600">
                <el-table-column  prop="ID" align="center"  label="ID" width="80"></el-table-column>
                <el-table-column  prop="ThemeType" align="center"  label="分类名称">
                    <template slot-scope="scope">
                        <span  v-show="scope.row.ID!=''">{{scope.row.ThemeType}}</span>
                        <el-input v-model="addSortName" size="mini" v-show="scope.row.ID==''" placeholder="请输入分类名称"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center"  width="100">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="danger"
                            v-show="scope.row.ID!=''"
                            @click="deleteCategory(scope.row)">删除</el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            v-show="!scope.row.ID"
                            style="margin-left:0px;"
                            @click="addCategory">确认</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" style="float:left;">
                <el-button type="primary" @click="addSort">添加</el-button> 
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sortDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getThemeDatabase,getCategoryList,addCategory,deleteCategory,deleteThemeDatabase } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import PerfectManageItem from '@/page/office/coursePlanPerfectManage/PerfectManageItem'
import NoData from '@/components/chat/NoData'

export default {
    name: 'interestClassTeacher',
    data(){
        return {
            title:"精品教案库管理",
            isDisabled:false,
            coursePlanList:[],
            currentPage:1,     
            pageNo:1,      
            pageSize:10,
            DialogVisible:false,
            sortDialogVisible:false,
            clickItem:{},
            isNoData:false,
            sortArr:[],
            addSortName:"",
            baseOfSort:"ThemeDataType",
            baseArr:[
                {
                    value:"ThemeDataType",
                    label:"按分类"
                },
                {
                    value:"CreaterID",
                    label:"按教师"
                },
                {
                    value:"ThemeDataTime",
                    label:"按加入时间"
                }
            ]
        }
    },
    components:{
        NoData,
        ChatHeader,
        PerfectManageItem
    },
    mounted(){
        this.getCategoryList();
        if (this.$route.meta.type=='examine') {
            this.title = "精品教案库浏览"
        }
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
    },
    watch:{
        
    },
    methods:{
        loadList(reload){
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getThemeDatabase(this.currentPage,this.pageSize,this.baseOfSort).then((result)=>{
                    if(reload){
                        this.coursePlanList = [];
                    }
                    // console.log(result)
                    if(result.data.table.length<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.table.length;i++){
                        this.coursePlanList.push(result.data.table[i]);
                    }
                    if(this.coursePlanList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                });
            }
        },
        getCategoryList(){
            getCategoryList(this.pageNo,this.pageSize).then((result)=>{
                this.sortArr = result.data.data;
            })
        },
        clickDelete(item){
            this.DialogVisible = true;
            this.clickItem = item;
        },
        addThemeDatabase(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        confirmDelete(){
            this.DialogVisible = false;
            let Id = this.clickItem.ID; 
            let loading = showLoading();
            deleteThemeDatabase(Id).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"删除成功",
                        type:"success"
                    });
                    this.loadList(true);
                }else{
                    this.$message({
                        message:"删除失败",
                    });
                }
            })
            // .catch((err)=>{
            //     alertError(this,"2146");
            // });
        },
        addSort(){
            let sortObj = {
                ID:"",
                ThemeType:"",
            }
            this.sortArr.push(sortObj);
        },
        addCategory(){
            let ThemeDataType = this.addSortName;
            let loading = showLoading();
            addCategory(ThemeDataType).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"添加成功",
                        type:"success"
                    });
                    this.getCategoryList();
                }else{
                    this.$message({
                        message:"添加失败",
                    });
                }
            })
            // .catch((err)=>{
            //     alertError(this,"2146");
            // });
        },
        deleteCategory(item){
            let cid = item.ID;
            let loading = showLoading();
            deleteCategory(cid).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"删除成功",
                        type:"success"
                    });
                    this.getCategoryList();
                }else{
                    this.$message({
                        message:"删除失败",
                    });
                }
                // .catch((err)=>{
                //     alertError(this,"2146");
                // });
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interestClassTeacher{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .interestClassTeacher{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.coursePlanList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .coursePlanList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .coursePlanList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}

</style>