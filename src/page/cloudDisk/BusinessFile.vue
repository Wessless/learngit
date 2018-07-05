<template>
    <div class="mycloud">
        <!-- <input  name="file" type="file" id="uploadCloudFile" style="display:none" @change="uploadFile"/>
        <div class="cloudHeader">
            <el-dropdown @command="handleCommand">
                <el-button type="primary">
                    新建 /上传
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="newFolder">新建文件夹</el-dropdown-item>
                    <el-dropdown-item command="uploadFile">上传文件</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="title">
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item :to="'/mainpage/cloudDisk/mydisk/'+item.id" v-for="item in breadcrumbData" :key="item.id">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="">
                <el-input v-model="formInline.fileName" placeholder="请输入文件名"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="formInline.staffName" filterable placeholder="请选择同事">
                    <el-option
                    v-for="item in formInline.staffs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item>
                <div class="block">
                    <el-date-picker
                    v-model="formInline.startDate"
                    type="date"
                    placeholder="选择开始日期">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item>
                <div class="block">
                    <el-date-picker
                    v-model="formInline.endDate"
                    type="date"
                    placeholder="选择结束日期">
                    </el-date-picker>
                </div>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="loadFileList">查询</el-button>
            </el-form-item>
            

        </el-form>
        <div class="content">
            <el-table :data="newTable" :show-header="false" style="width: 100%" v-show="tableData.length!=0">
                <el-table-column>
                    <template slot-scope="scope">
                        <div class="item">
                            <input type="checkbox" class="aui-checkbox" v-bind:noAllSelect="noAllSelect" v-model="selectAll">
                            <span class="selectItem" v-show="selectedCount==0">名称</span>
                            <span class="selectItem" v-show="selectedCount!=0">已选中 {{selectedCount}} 个文件(文件夹)</span>
                            <span class="selectItem blueColor" v-show="selectedCount!=0" @click="downloadFile"><span class="iconfont">&#xe714;</span>&nbsp;下载</span>
                            <span class="selectItem blueColor" v-show="selectedCount!=0" @click="deleteAlert"><span class="iconfont">&#xe69d;</span>&nbsp;删除</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="100">
                    <template slot-scope="scope">
                        <div class="item" v-show="selectedCount==0">
                            <div class="size">创建人</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="200">
                    <template slot-scope="scope">
                        <div class="item" v-show="selectedCount==0">
                            <div class="size">最后更新</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="100">
                    <template slot-scope="scope">
                        <div class="item" v-show="selectedCount==0">
                            <div class="size">大小</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-table v-show="newFolder" :data="newTable" :show-header="false" style="width: 100%">
                <el-table-column>
                    <template slot-scope="scope">
                        <div class="item">
                            <input type="checkbox" name="mycloud" class="aui-checkbox" disabled>
                            <div class="iconType iconfont">&#xe607;</div>
                            <span class="newTableSpan"><input type="text" class="newTableInput" v-model="scope.row.name" autofocus placeholder="请输入内容" /></span>
                            <span class="postBtn iconfont" @click="newFolderMethod">&#xe6ad;</span>
                            <span class="postBtn iconfont" @click="closeNewFolder">&#xe69a;</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="200">
                    <template slot-scope="scope">
                        <div class="item">
                            <div class="size"></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="100">
                    <template slot-scope="scope">
                        <div class="item">
                            <div class="size"></div>
                        </div>
                    </template>
                </el-table-column>
            </el-table> -->
            <el-table :data="tableData" :show-header="false" style="width: 100%;">
                <el-table-column>
                    <template slot-scope="scope">
                        <!-- <div class="item" @click="routerTo(scope.row.type,scope.row.id)">
                            <input type="checkbox" name="mycloud" v-model="scope.row.selected" class="aui-checkbox" @click.stop="" v-bind:disabled="scope.row.progress&&scope.row.progress!=100">
                            <div class="iconType iconfont" v-if="scope.row.type=='file'">&#xe6fc;</div>
                            <div class="iconType iconfont" v-else-if="scope.row.type=='folder'">&#xe607;</div>
                            <div class="progress" v-if="scope.row.progress&&scope.row.progress!=100"></div>
                            <el-progress v-show="scope.row.progress&&scope.row.progress!=100" type="circle" :percentage="scope.row.progress" :width="23" :stroke-width="2" :show-text="false"></el-progress>
                            <span v-show="scope.row.progress&&scope.row.progress!=100" style="margin-left:5px;">{{scope.row.progress}}%</span>
                            <span class="name" style="margin-left: 10px">{{ scope.row.name }}</span>
                        </div> -->
                        <table-item :item="scope.row"></table-item>
                    </template>
                </el-table-column>
                <el-table-column width="100">
                    <template slot-scope="scope">
                        <div class="item" :class="{canclick:scope.row.type=='folder'}">
                            <div class="size">{{ scope.row.connectName }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="200">
                    <template slot-scope="scope">
                        <div class="item" :class="{canclick:scope.row.type=='folder'}">
                            <div class="size">{{ scope.row.date }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="100">
                    <template slot-scope="scope">
                        <div class="item" :class="{canclick:scope.row.type=='folder'}">
                            <div class="size">{{ scope.row.size }}</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="empty"></div>
    </div>
</template>

<script>

import { geFileByTreeID,getAllParentDocument,addMyDocumentFile,addMyDocument,delDocumentOrFile,downloadFile } from '@/js/api'
import { fileSizeInfo,showLoading,closeLoading } from '@/config/utils'
import {mapState, mapMutations} from 'vuex'
import TableItem from '@/page/cloudDisk/CloudDiskTableListItem'
import fs from 'fs'
export default {
    name: 'BusinessFile',
    data(){
        return {
            formInline: {
                fileName: '',
                staffName: '',
                startDate: '',
                endDate: '',
                staffs: []
            },
            newFolder:false,// 是否显示新建文件夹
            file:null,//上传文件
            newTable:[
                {
                    name: '',
                }
            ],
            breadcrumbData:[
                {
                    id:"-1",
                    name:"我的文件",
                    isLast:false,
                }
            ],
            tableData: []
        }
    },
    components:{
        TableItem
    },
    mounted(){
        this.loadFileList();
        var staffs = [{
            value:'-1',
            label:'全部'
        }];
        for(var i=0;i<this.allStaffs.length;i++){
            var json = {
                value:this.allStaffs[i].StaffID,
                label:this.allStaffs[i].StaffName
            }
            staffs.push(json);
        }
        this.formInline.staffs = staffs;
    },
    beforeRouteUpdate(to,from,next){
        // console.log("beforeRouteUpdate",to.params.id)
        // this.loadFileList(to.params.id);
        
        next();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        noAllSelect(){//未全选也未全不选
            let arr = this.tableData;
            let flag = false;
            if(arr.length>0){
                let firstBtn = arr[0].selected;
                for(let i=0;i<arr.length;i++){
                    if(arr[i].selected != firstBtn){
                        flag = true;
                    }
                }
            }
            return flag;
        },
        selectedCount(){// 选择个数
            let arr = this.tableData;
            let count = 0;
            for(let i=0;i<arr.length;i++){
                if(arr[i].selected){
                    count++;
                }
            }
            return count;
        },
        selectAll:{//全选
            get:function(){
                let arr = this.tableData;
                let flag = true;
                if(arr.length>0){
                    for(let i=0;i<arr.length;i++){
                        if(arr[i].selected == false){
                            flag = false;
                        }
                    }
                }else{
                    flag = false;
                }
                return flag;
            },
            set:function(value){
                let arr = this.tableData;
                for(let i=0;i<arr.length;i++){
                    arr[i].selected = value;
                }
            }
        }
    },
    watch:{
    },
    methods:{
        // 选择上传文件或新建文件夹
        // handleCommand(command){
        //     if(command == 'newFolder'){
        //         this.newFolder = true;
        //     }else if(command == 'uploadFile'){
        //         document.getElementById("uploadCloudFile").click();
        //     }
        // },
        routerTo(type,route){
            if(type=="folder"){
                console.log(route);
                this.$router.push('/mainpage/cloudDisk/mydisk/'+route);
            }
        },
        // 加载当前文件
        loadFileList(){
            let loading = showLoading();
            geFileByTreeID("1","1000",this.userInfo.userStaffID,"-2",this.formInline.fileName,this.formInline.staffName?this.formInline.staffName:"-1").then((result)=>{
                let data = result.data.data;
                console.log(data);
                let tableData = [];
                for(let i=0;i<data.length;i++){
                    let type = "";
                    if(data[i].Type=="F"){
                        type = "file";
                    }else if(data[i].Type=="D"){
                        type = "folder";
                    }
                    let url = data[i].URL.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/");
                    let json = {
                        id: data[i].ID,
                        date: data[i].CreateDate,
                        name: data[i].TheName,
                        size: data[i].FileSize?data[i].FileSize:"--",
                        type: type,
                        selected:false,
                        progress:100,
                        url:url,
                        connectID:data[i].ConnectStaffID,
                        connectName:data[i].ConnectStaffName
                    };
                    tableData.push(json);
                }
                this.tableData = tableData;
                closeLoading(loading);
            });
        },
        deleteAlert(){
            let arr = this.tableData;
            let index = 0;
            for(let i=0;i<arr.length;i++){
                if(arr[i].selected){
                    index++;
                }
            }
            if(index == 0){
                return;
            }
            this.$confirm('您确定要删除该'+index+'项内容吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // type: 'warning'
            }).then(() => {
                this.deleteFile();
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });          
            });
        },
        // 删除文件
        deleteFile(){
            let arr = this.tableData;
            let staffID = this.userInfo.userStaffID;
            let parentID = this.$route.params.id;
            let fileArr = [];
            let folderArr = [];
            for(let i=0;i<arr.length;i++){
                if(arr[i].selected){
                    if(arr[i].type=="file"){
                        fileArr.push(arr[i].id);
                    }else if(arr[i].type=="folder"){
                        folderArr.push(arr[i].id);
                    }
                }
            }
            delDocumentOrFile(staffID,folderArr.toString(),fileArr.toString()).then((response)=>{
                console.log(response);
                if(response.data.Result=="1"){
                    // let filePath = response.data.path.split("../../../")[1];
                    this.$message({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    });
                    this.loadFileList();
                }else{
                    this.$message({
                        showClose: true,
                        message: '删除失败',
                        type: 'error'
                    });
                }
            });
        },
        // 下载文件
        downloadFile(){
            let arr = this.tableData;
            for(let i=0;i<arr.length;i++){
                if(arr[i].selected){
                    
                    let url = arr[i].url.replace(this.userInfo.currCOSIP,this.userInfo.currProxy);
                    downloadFile(url).then((result)=>{
                        const content = result.data;
                        const blob = new Blob([content]);
                        const fileName = arr[i].name;
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
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.mycloud{
    padding:20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: scroll;
    background: #fafafa;
}
.title{
    padding: 15px 0;
}
.empty{
    flex:1;
}
.item{
    display: flex;
    align-items: center;
}
.item .name{
    margin-left: 10px;
    flex:1px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.item .progress{
    margin-left: 10px;
    height: 0px;
}
.iconType{
    color:#38adff;
    font-size: 25px;
    margin-left:15px
}
.size{
    text-align: center;
    width: 100%;
}
.newTableSpan{
    margin-left: 10px;
    height:30px;
}
.newTableInput[type='text']{
    height:100%;
    width: 100%;
    padding:0 10px;
    outline: none;
    border-radius:5px;
    border:1px solid #dddddd; 
}
.newTableInput[type='text']:focus{
    border:1px solid #38adff; 
}
.postBtn{
    width:25px;
    height:25px;
    line-height:25px;
    border-radius: 3px;
    border:1px solid #38adff;
    margin-left:5px;
    color: #38adff;
    background:#ffffff;
    text-align: center;
    cursor: pointer;
}
.breadcrumb{
    display:flex;
    flex-wrap:wrap;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
    overflow: hidden;
    margin-bottom: 0px;
    padding:0;
    background: #fafafa;
    /* height: 14px; */
    box-sizing: content-box;
}

.selectItem{
    margin-left: 10px;
    height:24px;
}
.selectItem .iconfont{
    font-size: 14px;
}
.blueColor{
    color:#38adff;
    cursor: pointer;
}
.canclick{
    cursor: pointer;
}


</style>