<template>
    <div class="templateDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="$route.meta.type!='detail'" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="80px" style="width:100%;">
            <el-form-item label="模板名称">
                <el-input v-model="form.templateName" size="small" style="width:400px;" :disabled="$route.meta.type=='detail'"></el-input>
                <el-select v-model="form.examineType" size="small" placeholder="请选择考核类型" :disabled="$route.meta.type=='update'||$route.meta.type=='detail'" @change="changeExamineType">
                    <el-option
                    v-for="item in form.examineTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button size="small" type="primary" style="margin-left:10px;" @click="copyTemplate()" v-if="$route.meta.type!='detail'">复制已有模板</el-button>
            </el-form-item>
            <el-form-item label="模板描述">
                <el-input v-model="form.templateDescription" size="small" style="width:400px;" :disabled="$route.meta.type=='detail'"></el-input>
                <el-radio v-model="form.radio" label="1" style="margin-left:20px;" v-if="$route.meta.type=='update'">替换当前模板</el-radio>
                <el-radio v-model="form.radio" label="2" style="margin-left:20px;" v-if="$route.meta.type=='update'">创建新模板</el-radio>
            </el-form-item>
            <el-form-item label="模板分制">
                <el-select v-model="form.pointType" size="small" :disabled="form.examineType=='0'||$route.meta.type=='detail'" @change="initProjectArr" placeholder="请选择模板分制">
                    <el-option
                    v-for="item in form.pointTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button size="small" type="primary" style="margin-left:10px;" @click="addProject()" v-if="$route.meta.type!='detail'">添加考核项目</el-button>
            </el-form-item>
        </el-form>
        
        <div class="examineProject" v-for="(projectItem,projectIndex) in projectListObj.evalution_template.category" :key="projectIndex ">
            <div class="topLine">
                <div class="title">项目名：</div>
                <el-input size="small" style="width:400px;margin-right:10px;" v-model="projectItem.$.name" :disabled="$route.meta.type=='detail'"></el-input>
                <el-button size="small" type="primary" @click="addItem(projectIndex)" v-if="$route.meta.type!='detail'">添加评分项</el-button>
                <el-button size="small" type="danger" @click="removeProject(projectIndex)" v-if="$route.meta.type!='detail'">移除</el-button>
            </div>
            <el-row :gutter="5" v-if="form.pointType=='5'&&projectItem.item.length>0">
                <el-col :span="4">评分项目</el-col>
                <el-col :span="18">评分说明</el-col>
                <el-col :span="2"></el-col>
            </el-row>
            <el-row :gutter="5" v-if="form.pointType=='5'" style="padding-top:10px;" v-for="(item,index) in projectItem.item" :key="index">
                <el-col :span="4"><el-input size="small" v-model="item.$.name" :disabled="$route.meta.type=='detail'"></el-input></el-col>
                <el-col :span="18"><el-input size="small" v-model="item.$.description" :disabled="$route.meta.type=='detail'"></el-input></el-col>
                <el-col :span="2"><el-button size="small" type="danger" @click="removeItem(projectIndex,index)" v-if="$route.meta.type!='detail'">移除</el-button></el-col>
            </el-row>
            <el-row :gutter="5" v-if="form.pointType=='100'&&projectItem.item.length>0">
                <el-col style="line-height: 40px;" :span="3">评分项目</el-col>
                <el-col style="line-height: 40px;" :span="12">评分说明</el-col>
                <el-col style="line-height: 40px;" :span="1">分数</el-col>
                <el-col :span="2">考核人1<br />所占比例</el-col>
                <el-col :span="2">考核人2<br />所占比例</el-col>
                <el-col :span="2">考核人3<br />所占比例</el-col>
                <el-col style="line-height: 40px;" :span="2"></el-col>
            </el-row>
            <el-row :gutter="5" class="items" v-if="form.pointType=='100'" style="padding-top:10px;" v-for="(item,index) in projectItem.item" :key="index">
                <el-col :span="3"><el-input size="small" type="textarea" rows="5" v-model="item.$.name" :disabled="$route.meta.type=='detail'"></el-input></el-col>
                <el-col :span="12"><el-input size="small" type="textarea" rows="5" v-model="item.$.description" :disabled="$route.meta.type=='detail'"></el-input></el-col>
                <el-col :span="1"><el-input size="small" v-model="item.$.point" :disabled="$route.meta.type=='detail'"></el-input></el-col>
                <el-col :span="2"><el-input size="small" v-model="item.$.ratio1" :disabled="$route.meta.type=='detail'"></el-input></el-col>
                <el-col :span="2"><el-input size="small" v-model="item.$.ratio2" :disabled="$route.meta.type=='detail'"></el-input></el-col>
                <el-col :span="2"><el-input size="small" v-model="item.$.ratio3" :disabled="$route.meta.type=='detail'"></el-input></el-col>
                <el-col :span="2"><el-button size="small" type="danger" @click="removeItem(projectIndex,index)" v-if="$route.meta.type!='detail'">移除</el-button></el-col>
            </el-row>
        </div>
        <el-dialog :visible.sync="dialogFormVisible" :width="'500px'">
            <el-form :model="formDialog">
                <el-form-item label="">
                    <el-checkbox v-model="formDialog.showLoseTemplate" @change="loadSelectList(true)">显示已失效模板</el-checkbox>
                </el-form-item>
                <el-form-item label="模板名称">
                    <el-select v-model="templateID" placeholder="请选择模板名称">
                        <el-option
                            v-for="item in templateList"
                            :key="item.TemplateID"
                            :label="item.TemplateName"
                            :value="item.TemplateID">
                        </el-option>
                        <!-- <el-select v-model="form.pointType" size="small" :disabled="form.examineType=='0'||$route.meta.type=='detail'" @change="initProjectArr" placeholder="请选择模板分制">
                        </el-select> -->
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmLoadTemplate">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import { getTemplateByID,downloadFile,editTemplate,getTemplate } from '@/js/api'
import { money,stamper,showLoading,closeLoading,xmlStr2json,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'ExamineTemplatetDetail',
    data(){
        return {
            title:"",
            detail:{
                
            },
            pageSize:200,
            currentPage:1,
            hasData:true,
            dialogFormVisible: false,
            formDialog:{
                showLoseTemplate:false
            },
            templateID:"",
            templateList:[],
            form: {
                templateName:"",
                templateDescription:"",
                pointType:"100",
                pointTypeList:[{
                    value:"100",
                    label:"百分制"
                },{
                    value:"5",
                    label:"五分制"
                }],
                examineType:"0",
                examineTypeList:[{
                    value:"0",
                    label:"月度考核"
                },{
                    value:"1",
                    label:"其他考核"
                }],
                radio:""
            },
            projectListObj:{
                evalution_template:{
                    category:[
                        // {
                        //     $:{
                        //         name:""
                        //     },
                        //     item:[
                        //         {
                        //             $:{
                        //                 description:"",
                        //                 name:"",
                        //                 point:"",
                        //                 ratio1:"",
                        //                 ratio2:"",
                        //                 ratio3:""
                        //             }
                        //         }
                        //     ]
                        // }
                    ]
                }
            },
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        // this.loadDetail();
        if(this.$route.meta.type=="add"){
            this.title = "添加考核模板";
            this.form.radio = "2";
            this.loadSelectList(true);
        }else if(this.$route.meta.type=="detail"){
            this.title = "考核模板详情";
            this.loadDetail();
        }else if(this.$route.meta.type=="update"){
            this.title = "修改考核模板";
            this.form.radio = "1";
            this.loadDetail();
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        chargeBillType(){// 财务类型 01:记账凭证
            if(this.detail.ChargeBillType=="01"){
                return "记账凭证";
            }else{
                return "";
            }
        },
        hasInvoice(){// 是否有发票
            if(this.detail.HasInvoice=="0"){
                return "否";
            }else if(this.detail.HasInvoice=="1"){
                return "是";
            }else{
                return "";
            }
        },
        payType(){// 资金性质{0:现金1:支票2:银行汇款3:其他4:汇票5:虚拟账户}
            switch (this.detail.PayType){
                case "0":
                    return "现金";
                    break;
                case "1":
                    return "支票";
                    break;
                case "2":
                    return "银行汇款";
                    break;
                case "3":
                    return "其他";
                    break;
                case "4":
                    return "汇票";
                    break;
                case "5":
                    return "虚拟账户";
                    break;
            }
        },
        money(){
            return money(this.detail.Money);
        }
        
    },
    watch:{
    },
    methods:{
        // 复制已有模板
        copyTemplate(){
            this.formDialog.showLoseTemplate = false;
            this.dialogFormVisible = true;
        },
        // 加载已有模板列表
        loadSelectList(reload){
            let pointType = this.form.pointType;
            let isValid = this.formDialog.showLoseTemplate ? "0" : "1";
            if(reload){
                this.currentPage = 1;
                this.hasData = true;
            }
            if(this.hasData){
                getTemplate(this.currentPage,this.pageSize,pointType,isValid).then((result)=>{
                    if(reload){
                        this.templateList = [];
                    }
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.hasData = false;
                    }
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        result.data.data[i].selected = false;
                        this.templateList.push(result.data.data[i]);
                    }
                    this.templateID = "";
                }).catch((err)=>{
                    alertError(this,"1203");
                });
            }
        },
        // 选择复制模板后加载到页面
        confirmLoadTemplate(){
            this.dialogFormVisible = false;
            let loading = showLoading();
            let xmlurl = "";
            for(let i=0;i<this.templateList.length;i++){
                if(this.templateList[i].TemplateID==this.templateID){
                    xmlurl = this.templateList[i].XMLURL
                }
            }
            if(xmlurl==""){
                return "";
            }
            let url = xmlurl.replace("../../../",this.userInfo.currProxy+'/COS'+this.userInfo.cosNum+'/');
            console.log(url)
            downloadFile(url)
            .then((result)=>{
                const content = result.data;
                const blob = new Blob([content]);
                let reader = new FileReader();
                reader.readAsText(blob, 'utf-8');
                return new Promise(function(resolve,reject){
                    reader.onload = (e) => {
                        // 
                        resolve(reader.result)
                    }
                });
            })
            .then((result)=>{
                return xmlStr2json(result);
            })
            .then((result)=>{
                this.projectListObj = result;
                if(this.projectListObj.evalution_template.category){
                    
                }else{
                    this.projectListObj = {
                        evalution_template:{
                            $:result.evalution_template.$,
                            category:[]
                        }
                    }
                }
                closeLoading(loading);
            });
        },
        // 加载模板详情
        loadDetail(){
            let id = this.$route.params.templateID;
            let loading = showLoading();
            getTemplateByID(id)
            .then((result)=>{
                let obj = result.data;
                this.form.templateName = obj.TemplateName?obj.TemplateName:"";
                this.form.examineType = obj.Type?obj.Type:"";
                this.form.pointType = obj.PointType?obj.PointType:"";
                this.form.templateDescription = obj.Description?obj.Description:"";
                this.loadSelectList(true);
                let xmlurl = obj.XMLURL;
                let url = xmlurl.replace("../../../",this.userInfo.currProxy+'/COS'+this.userInfo.cosNum+'/');
                return downloadFile(url);
            })
            .then((result)=>{
                const content = result.data;
                const blob = new Blob([content]);
                let reader = new FileReader();
                reader.readAsText(blob, 'utf-8');
                return new Promise(function(resolve,reject){
                    reader.onload = (e) => {
                        resolve(reader.result)
                    }
                });
            })
            .then((result)=>{
                return xmlStr2json(result);
            })
            .then((result)=>{
                this.projectListObj = result;
                if(this.projectListObj.evalution_template.category){
                    
                }else{
                    this.projectListObj = {
                        evalution_template:{
                            $:result.evalution_template.$,
                            category:[]
                        }
                    }
                }
                closeLoading(loading);
            });
        },
        // 切换考核模板时控制模板分制
        changeExamineType(){
            if(this.form.examineType=="0"){
                if(this.form.pointType=="5"){
                    this.form.pointType = "100";
                    this.initProjectArr();
                }
            }
        },
        // 切换模板分制时清空数组并重新加载要复制的模板
        initProjectArr(){
            this.loadSelectList(true);
            this.projectListObj = {
                evalution_template:{
                    category:[
                    ]
                }
            }
        },
        // 添加考核项目
        addProject(){
            this.projectListObj.evalution_template.category.push({
                $:{
                    name:""
                },
                item:[{
                    $:{
                        description:"",
                        name:"",
                        point:"",
                        ratio1:"",
                        ratio2:"",
                        ratio3:""
                    }
                }]
            })
        },
        // 添加评分项目
        addItem(projectIndex){
            this.projectListObj.evalution_template.category[projectIndex].item.push({
                $:{
                    description:"",
                    name:"",
                    point:"",
                    ratio1:"",
                    ratio2:"",
                    ratio3:""
                }
            })
        },
        // 删除考核项目
        removeProject(projectIndex){
            this.projectListObj.evalution_template.category.splice(projectIndex,1);
        },
        // 删除评分项目
        removeItem(projectIndex,itemIndex){
            this.projectListObj.evalution_template.category[projectIndex].item.splice(itemIndex,1);
        },
        // 点击确认保存模板
        confirm(){
            let id = this.$route.params.templateID?this.$route.params.templateID:"-1";
            let editType = this.form.radio;
            let templateName = this.form.templateName;
            let description = this.form.templateDescription;
            let pointType = this.form.pointType;
            let type = this.form.examineType;
            if(templateName.trim()==""){
                this.$message({
                    message: '请输入模板名称',
                    type: 'error'
                });
            }
            if(description.trim()==""){
                this.$message({
                    message: '请输入模板描述',
                    type: 'error'
                });
            }
            let xmlJSON = [];
            let category = this.projectListObj.evalution_template.category;
            if(pointType=="100"){
                for(let i=0;i<category.length;i++){
                    let categoryJSON = {
                        categoryname:category[i].$.name.split(",").join("，"),
                        Details:[]
                    }
                    let items = category[i].item;
                    for(let j=0;j<items.length;j++){
                        let itemJSON = {
                            itemname:items[j].$.name.split(",").join("，"),
                            description:items[j].$.description.split(",").join("，"),
                            point:items[j].$.point.split(",").join("，"),
                            ratio1:items[j].$.ratio1.split(",").join("，"),
                            ratio2:items[j].$.ratio2.split(",").join("，"),
                            ratio3:items[j].$.ratio3.split(",").join("，")
                        };
                        categoryJSON.Details.push(itemJSON);
                    }
                    xmlJSON.push(categoryJSON);
                }
            }else{
                for(let i=0;i<category.length;i++){
                    let categoryJSON = {
                        categoryname:category[i].$.name.split(",").join("，"),
                        Details:[]
                    }
                    let items = category[i].item;
                    for(let j=0;j<items.length;j++){
                        let itemJSON = {
                            itemname:items[j].$.name.split(",").join("，"),
                            description:items[j].$.description.split(",").join("，"),
                            // point:items[j].$.point,
                            // ratio1:items[j].$.ratio1,
                            // ratio2:items[j].$.ratio2,
                            // ratio3:items[j].$.ratio3
                        };
                        categoryJSON.Details.push(itemJSON);
                    }
                    xmlJSON.push(categoryJSON);
                }
            }
            let detailString = JSON.stringify(xmlJSON);
            let loading = showLoading();
            console.log(id,editType,templateName,description,pointType,type,detailString);
            editTemplate(id,editType,templateName,description,pointType,type,detailString).then((result)=>{
                let str = "";
                if(this.$route.meta.type=="add"){
                    str = "添加";
                }else if(this.$route.meta.type=="update"){
                    str = "修改";
                }
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: str + '成功',
                        type: 'success'
                    });
                    window.history.go(-1);
                }else{
                    this.$message({
                        message: str + '失败',
                        type: 'error'
                    });
                }
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.templateDetail{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    padding-top:74px;
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
</style>