<template>
    <div class="templateDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="false"></chat-header>
        <vue-context-menu :contextMenuData="contextMenuData" @deleteNode="deleteNode" @addNode="addNode" @updateNode="updateNode"></vue-context-menu>
        <div class="myDatabaseTree">
            <el-select 
                v-model="knowledgeID" 
                size="small"
                @change="getKnowledgeTree"
                style="margin:10px 10px 10px 3px;width:282px;position:fixed;top:54px;z-index:99;"
                placeholder="请选择资料库">
                <el-option
                    v-for="item in knowledgeArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input
                size="small"
                placeholder="输入检索内容"
                style="margin:0px 10px 10px 3px;width:282px;position:fixed;top:106px;z-index:99;"
                v-model="filterText">
            </el-input>
            <div style="width:292px;position:fixed;top:54px;z-index:98;height:92px;background:#fff;"></div>
            <el-tree
                class="filter-tree"
                :data="knowledgeTree"
                :props="defaultProps"
                :default-expand-all="false"
                :filter-node-method="filterNode"
                :highlight-current="true"
                :default-expanded-keys="showArray"
                :render-content="renderContent"
                @node-click="clickNode"
                @node-contextmenu="clickRightNode"
                style="width:100%;padding-top:92px;"
                ref="tree">
            </el-tree>
        </div>
        <div class="myDatabaseInfo" v-if="clickDatabaseID">
            <div style="margin:0 10px 10px 10px; display:flex;align-items:center;">
                <el-button type="primary" size="small" @click="addArticle">添加</el-button>
                <span v-show="myDatabase.treeNode.treeNodeName" style="padding-left:10px;">节点：{{myDatabase.treeNode.treeNodeName}}</span>
            </div>
            <div class="databaseList">
                <my-database-artical-item v-for="(item,index) in articleList" :key="index" :item="item" @deleteArticle="deleteArticleClick"></my-database-artical-item>
                <!-- <div class="myDatabaseItem">
                    <div class="headTitle">123</div>
                    <div class="title">创建者：</div>
                    <div class="title">创建时间：</div>
                    <div class="title">修改者：</div>
                    <div class="title">修改时间：</div>
                    <div class="bottomBtns">
                        <div class="bottomBtn">删除</div>
                        <div class="bottomBtn">修改</div>
                    </div>
                </div> -->
            </div>
            <div style="flex:1;"></div>
        </div>
        <el-dialog
            title="删除"
            :visible.sync="dialogVisible"
            width="30%">
        <span>是否删除该资料</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteArticle">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
            title="删除节点"
            :visible.sync="deleteNodedialogVisible"
            width="30%">
        <span>是否删除该资料库节点</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteNodedialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteNodeConfirm">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
            :title="addOrUpdateTitle"
            :visible.sync="addOrUpdateNodedialogVisible"
            width="30%">
            <el-input 
                placeholder="输入节点名称"
                v-model="treeNodeName">
            </el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addOrUpdateNodedialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addOrUpdateNodeConfirm">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>

import { getBaseByStaffID,getKnowledgeTree,getArticleTreeNodeID,deleteKnowledgeArticle,addKnowledgeTree,deleteKnowledgeTree } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import MyDatabaseArticalItem from '@/page/office/myDatabase/MyDatabaseArticalItem'
import vueContextMenu from '@/components/chat/VueContextMenu'

export default {
    name: 'MyDatabaseMaintenance',
    data(){
        return {
            title:"",
            knowledgeID:"-1",// 资料库ID
            filterText:"",//检索条件
            knowledgeTree:[],// 资料库树数组
            defaultProps: {// 树配置
                children: 'item',
                label: 'text'
            },
            knowledgeArray:[],// 资料库数组
            currentPage:1,
            pageSize:1000,
            clickDatabaseID:"",// 当前点击的哪个资料库树的节点ID
            clickDatabaseName:"",// 当前点击的哪个资料库树的节点name
            // 文章数组
            articleList:[],
            clickItem:null,
            dialogVisible:false,
            showArray:[],// 默认展开
            // contextmenu data (菜单数据)
            contextMenuData: {
                menuName: 'treeNode',
                // The coordinates of the display(菜单显示的位置)
                axios: {
                    x: null,
                    y: null
                },
                // Menu options (菜单选项)
                menulists: [
                    
                    {
                        fnHandler: 'addNode',
                        btnName: '添加子节点'
                    }
                ],
                menuData:null,// 点击节点相关数据
            },
            deleteNodedialogVisible:false,
            treeNodeName:"",
            addOrUpdateNodedialogVisible:false,
            addOrUpdateTitle:"",
        }
    },
    components:{
        ChatHeader,
        MyDatabaseArticalItem,
        vueContextMenu
    },
    mounted(){
        this.title = "维护资料库";
        let id = this.myDatabase.knowledgeID;
        if(id=="-1"){
            window.history.go(-1);
        }
        this.knowledgeID = id;
        this.getBaseByStaffID();
        this.getKnowledgeTree();
        if(this.myDatabase.treeNode.treeNodeID){
            this.clickDatabaseID = this.myDatabase.treeNode.treeNodeID;
            this.clickDatabaseName = this.myDatabase.treeNode.treeNodeName;
            this.loadDatabaseInfo();
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs',
            'myDatabase'
        ])
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods:{
        ...mapMutations([
            'SET_BROWSERIMG',
            'SET_KNOWLEDGEID',
            'SET_TREENODEID',
        ]),
        renderContent(h, { node, data, store }) {
            return (
                <span class="custom-tree-node">
                    <span class="iconfont" style="color:#38adff;padding-right:5px;font-size:14px;">&#xe83c;</span>
                    <span>{node.label}</span>
                </span>
            );
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.text.indexOf(value) !== -1;
        },
        clickNode(data){
            if(data.id[0]!='a'&&data.id!='root'){
                this.clickDatabaseID = data.id;
                this.clickDatabaseName = data.text;
                this.SET_TREENODEID({treeNodeID:data.id,treeNodeName:data.text});
                this.loadDatabaseInfo();
            }else{
                this.clickDatabaseID = "";
                this.SET_TREENODEID({});
            }
        },
        clickRightNode(event,data){
            event.preventDefault();
            var x = event.clientX;
            var y = event.clientY;
            if(data.id!="root"){
                this.contextMenuData.menulists = [{
                    fnHandler: 'addNode',
                    btnName: '添加子节点'
                },{
                    fnHandler: 'updateNode', // Binding events(绑定事件)
                    btnName: '修改节点' // The name of the menu option (菜单名称)
                },{
                    fnHandler: 'deleteNode', // Binding events(绑定事件)
                    btnName: '删除节点' // The name of the menu option (菜单名称)
                }];
            }else{
                this.contextMenuData.menulists = [{
                    fnHandler: 'addNode',
                    btnName: '添加子节点'
                }];
            }
            // Get the current location
            this.contextMenuData.axios = {
                x, y
            };
            this.contextMenuData.menuData = data;
        },
        // 加载所有资料库
        getBaseByStaffID(){
            let loading = showLoading();
            let staffID = this.userInfo.userStaffID;
            getBaseByStaffID(this.currentPage,this.pageSize,staffID).then((result)=>{
                
                closeLoading(loading);
                for(let i=0;i<result.data.data.length;i++){
                    if(result.data.data[i].EnableSet=='1'){
                        this.knowledgeArray.push({
                            value:result.data.data[i].KnowledgeBaseID,
                            label:result.data.data[i].KnowledgeBaseName
                        });
                    }
                }
            }).catch((err)=>{
                alertError(this,"1194");
            });
        },
        // 加载资料库树
        getKnowledgeTree(){
            let baseID = this.knowledgeID;
            this.SET_KNOWLEDGEID(baseID);
            getKnowledgeTree(baseID,"0").then((result)=>{
                this.knowledgeTree = this.changeItem(result.data.item);
                if(this.myDatabase.treeNode.treeNodeID){
                    this.showArray = ['root',this.myDatabase.treeNode.treeNodeID];
                }
                
            }).catch((err)=>{
                alertError(this,"1304");
            });
        },
        changeItem(item){
            let array = [];
            if(item.length){
                array = item;
            }else{
                array = [item];
            }
            for(let i=0;i<array.length;i++){
                if(array[i].item){
                    array[i].item = this.changeItem(array[i].item);
                }
            }
            return array;
        },
        // 加载资料库详情
        loadDatabaseInfo(){
            let id = this.clickDatabaseID;
            let loading = showLoading();
            getArticleTreeNodeID(1,1000,id).then((result)=>{
                closeLoading(loading);
                this.articleList = result.data.data;
            }).catch((err)=>{
                alertError(this,"1193");
                closeLoading(loading);
            });
        },
        //
        addNode(data){
            this.addOrUpdateTitle = '添加节点';
            this.addOrUpdateNodedialogVisible = true;
            this.treeNodeName = '';
        },
        updateNode(data){
            this.addOrUpdateTitle = '修改节点';
            this.addOrUpdateNodedialogVisible = true;
            this.treeNodeName = '';
            this.treeNodeName = data.text;
        },
        addOrUpdateNodeConfirm(){
            let id = "-1";
            let parentID = "";
            let type = '';
            if(this.addOrUpdateTitle == '添加节点'){
                parentID = this.contextMenuData.menuData.id;
                type = '添加';
            }else{
                id = this.contextMenuData.menuData.id;
                type = '修改';
            }
            if(parentID=='root'){
                parentID = '';
            }
            if(this.treeNodeName.trim()==''){
                this.$message.error({
                    message:"请输入节点名称！"
                });
                return false;
            }
            let loading = showLoading();
            console.log(id,this.treeNodeName,parentID,this.knowledgeID)
            addKnowledgeTree(id,this.treeNodeName,parentID,this.knowledgeID)
            .then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:type+"成功",
                        type:"success"
                    });
                    this.addOrUpdateNodedialogVisible = false;
                    this.getKnowledgeTree();
                }else{
                    this.$message.error({
                        message:type+"失败"
                    });
                }
            })
            .catch((err)=>{
                alertError(this,"2125");
                closeLoading(loading);
            });
        },
        deleteNode(data){
            this.deleteNodedialogVisible = true;
        },
        deleteNodeConfirm(){
            let loading = showLoading();
            deleteKnowledgeTree(this.contextMenuData.menuData.id)
            .then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message:result.data.Msg,
                        type:"success"
                    });
                    this.deleteNodedialogVisible = false;
                    this.getKnowledgeTree();
                }else{
                    this.$message({
                        message:result.data.Msg,
                        type:"error"
                    });
                }
            })
            .catch((err)=>{
                alertError(this,"2126");
                closeLoading(loading);
            });
        },
        // 点击添加文章
        addArticle(){
            this.$router.push(this.$route.fullPath+"/articleAdd");
        },
        // 点击删除文章
        deleteArticleClick(item){
            let id = item.ArticleID;
            this.clickItem = item;
            this.dialogVisible = true;
        },
        // 点击确定删除文章
        deleteArticle(){
            let id = this.clickItem.ArticleID;
            deleteKnowledgeArticle(id).then((result)=>{
                if (result.data.Result == "1") {
                    this.$message({
                        message:"删除成功",
                        type:"success"
                    });
                    this.dialogVisible = false;
                    this.loadDatabaseInfo();
                } else {
                    this.$message.error({
                        message:"删除失败"
                    });
                }
            }).catch((err)=>{
                alertError(this,"2124");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.templateDetail{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    height: 100vh;
    overflow: hidden;
    background: #fafafa;
    padding-top:54px;
    position: relative;
}
.el-form-item {
    margin-bottom: 0px;
}
.examineProject{
    width:100%;
    margin-top:20px; 
    padding-top:20px;
    margin-left:10px;
    border-top: 1px solid #666666;
}
.el-input__inner:disabled{
    color:#606266 !important;
}
.redColor{
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: red;
    display: inline-block;
}
.grayColor{
    height: 100%;
    width:100%;
    display: flex;
    align-items: center;
    /* padding-left: 10px; */
    color: #888;
    display: inline-block;
}
.element-icon{
    font-family: element-icons !important;
    /* speak: none; */
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
}
.avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    position: absolute;
}
.avatar-uploader-icon:before {
    content: "\E62B";
    z-index: 1;
}
.avatar {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 5px;
    display: block;
    margin:5px 0;
    background:#ffffff;
    overflow: hidden;
    cursor: pointer;
}
.avatar:hover{
    border: 1px dashed #38adff;
}
.avatar > img {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 5;
}
.myDatabaseTree{
    height:100%;
    width:300px;
    background: #ffffff;
    overflow: scroll;
    display:flex;
    flex-direction: column;
    align-items: center;
}
.templateDetail::-webkit-scrollbar{
    width: 0px;
    height: 0px;
}
.myDatabaseInfo{
    flex:1;
    padding:10px 0;
    overflow: scroll;
    display: flex;
    flex-direction: column;
}
.databaseList{
    display: grid;
    width: 100%;
    grid-template-columns: 50% 50%;
}
.contentFile{
    margin-right:10px;
    color:#38adff;
    cursor: pointer;
}
.content > img{
    width:80px;
    margin-right: 10px;
    cursor: pointer;
}
</style>