<template>
    <div class="templateDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="false"></chat-header>
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
                :render-content="renderContent"
                :highlight-current="true"
                @node-click="clickNode"
                style="width:100%;padding-top:92px;"
                ref="tree">
            </el-tree>
        </div>
        <div class="myDatabaseInfo" v-if="clickDatabaseID">
            <div class="myDatabaseItem">
                <div class="title">标题:</div>
                <div class="content">{{ articleInfo.ArticleTitle }}</div>
            </div>
            <div class="myDatabaseItem">
                <div class="title">ID:</div>
                <div class="content">{{ articleInfo.ArticleID }}</div>
            </div>
            <div class="myDatabaseItem">
                <div class="title">创建人:</div>
                <div class="content">{{ articleInfo.CreateUser }}</div>
            </div>
            <div class="myDatabaseItem">
                <div class="title">创建时间:</div>
                <div class="content">{{ articleInfo.CreateDate }}</div>
            </div>
            <div class="myDatabaseItem">
                <div class="title">内容:</div>
                <div class="content">{{ articleInfo.ArticleText }}</div>
            </div>
            <div class="myDatabaseItem">
                <div class="title">修改人:</div>
                <div class="content">{{ articleInfo.ModifyUser }}</div>
            </div>
            <div class="myDatabaseItem">
                <div class="title">修改时间:</div>
                <div class="content">{{ articleInfo.ModifyDate }}</div>
            </div>
            <div class="myDatabaseItem">
                <div class="title">文件:</div>
                <div class="content" style="flex-direction: column;">
                    <span class="contentFile" v-for="item in articleInfo.Attachment" :key="item.AttachmentID" @click="downloadFile(item)">{{item.AttachmentName}}</span>
                </div>
            </div>
            <div class="myDatabaseItem">
                <div class="title">图片:</div>
                <div class="content">
                    <img :src="item" v-for="(item, index) in articleInfo.images" :key="index" @click="showImage(item)" alt="">
                </div>
            </div>
        </div>
        <!-- <router-view></router-view> -->
    </div>
</template>

<script>

import { getknowledgebase,addKnowledgeBase,setknowledgebase,getBaseByStaffID,getKnowledgeTree,getArticleDetail,downloadFile } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'MyDatabaseBrowse',
    data(){
        return {
            title:"",
            knowledgeID:"-1",
            filterText:"",//检索条件
            knowledgeTree:[],
            defaultProps: {
                children: 'item',
                label: 'text'
            },
            knowledgeArray:[],
            currentPage:1,
            pageSize:1000,
            clickDatabaseID:"",
            articleInfo:{
                ArticleID:"",
                ArticleText:"",
                ArticleTitle:"",
                Attachment:[],
                CreateDate:"",
                CreateUser:"",
                images:[],
                ModifyDate:"",
                ModifyUser:''
            }
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        this.title = "检索资料库";
        let id = this.myDatabase.knowledgeID;
        if(id=="-1"){
            window.history.go(-1);
        }
        this.knowledgeID = id;
        this.getBaseByStaffID();
        this.getKnowledgeTree();
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
            console.log(val)
            this.$refs.tree.filter(val);
        }
    },
    methods:{
        ...mapMutations([
            'SET_BROWSERIMG',
            'SET_KNOWLEDGEID'
        ]),
        renderContent(h, { node, data, store }) {
            console.log(data)
            if(data.id[0]=='a'){
                return (
                    <span class="custom-tree-node">
                        <span class="iconfont" style="color:#38adff;padding-right:5px;">&#xe6a2;</span>
                        <span>{node.label}</span>
                    </span>
                );
            }else{  
                return (
                    <span class="custom-tree-node">
                        <span class="iconfont" style="color:#38adff;padding-right:5px;font-size:14px;">&#xe83c;</span>
                        <span>{node.label}</span>
                    </span>
                );
            }
            
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.text.indexOf(value) !== -1;
        },
        clickNode(data){
            if(data.id[0]=='a'){
                this.clickDatabaseID = data.id;
                this.loadDatabaseInfo();
            }else{
                this.clickDatabaseID = "";
            }
        },
        showImage(item){
            let urlArr = item.split("/");
            if(urlArr[urlArr.length-1].substring(0,2)=='s_'){
                urlArr[urlArr.length-1] = urlArr[urlArr.length-1].substring(2,urlArr[urlArr.length-1].length);
            }
            let imagePath = urlArr.join("/")
            this.SET_BROWSERIMG({
                imgPath:imagePath
            });
        },
        downloadFile(item){
            let url = item.AttachmentPath;
            url = url.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/");
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
        },
        // 加载所有资料库
        getBaseByStaffID(){
            let loading = showLoading();
            let staffID = this.userInfo.userStaffID;
            getBaseByStaffID(this.currentPage,this.pageSize,staffID).then((result)=>{
                
                closeLoading(loading);
                for(let i=0;i<result.data.data.length;i++){
                    this.knowledgeArray.push({
                        value:result.data.data[i].KnowledgeBaseID,
                        label:result.data.data[i].KnowledgeBaseName
                    });
                }
            }).catch((err)=>{
                alertError(this,"1194");
            });
        },
        // 加载资料库树
        getKnowledgeTree(){
            let baseID = this.knowledgeID;
            this.SET_KNOWLEDGEID(baseID);
            getKnowledgeTree(baseID,"1").then((result)=>{
                // console.log(result.data.item.item)
                // console.log(this.changeItem(result.data.item.item));
                this.knowledgeTree = this.changeItem(result.data.item);
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
            let id = this.clickDatabaseID.substr(1,this.clickDatabaseID.length-1)
            getArticleDetail(id).then((result)=>{
                console.log(result)
                let object = result.data;
                let articleInfo = {
                    ArticleID:object.ArticleID,
                    ArticleText:object.ArticleText,
                    ArticleTitle:object.ArticleTitle,
                    Attachment:object.Attachment,
                    CreateDate:object.CreateDate,
                    CreateUser:object.CreateUser,
                    images:[],
                    ModifyDate:object.ModifyDate,
                    ModifyUser:object.ModifyUser
                }
                if(object.Img1){
                    articleInfo.images.push(object.Img1.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/"));
                }
                if(object.Img2){
                    articleInfo.images.push(object.Img2.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/"));
                }
                if(object.Img3){
                    articleInfo.images.push(object.Img3.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/"));
                }
                if(object.Img4){
                    articleInfo.images.push(object.Img4.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/"));
                }
                if(object.Img5){
                    articleInfo.images.push(object.Img5.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/"));
                }
                if(object.Img6){
                    articleInfo.images.push(object.Img6.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/"));
                }
                if(object.Img7){
                    articleInfo.images.push(object.Img7.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/"));
                }
                if(object.Img8){
                    articleInfo.images.push(object.Img8.replace('../../../',this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/"));
                }
                this.articleInfo = articleInfo;
            }).catch((err)=>{
                alertError(this,"1192");
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
.topLine{
    display: flex;
    flex-direction: row;
    margin-bottom:10px;
}
.topLine > .title{
    display: flex;
    align-items: center;
    margin-right: 5px;
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
    padding:10px;
    overflow: scroll;
}
.myDatabaseItem{
    width:100%;
    padding:10px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.myDatabaseItem > .title{
    width: 100px;
    text-align: right;
    padding-right: 20px;
    color:#666;
}
.myDatabaseItem > .content{
    flex:1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
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