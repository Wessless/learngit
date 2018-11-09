<template>
    <div class="CoursePlanManageDetail">
        <input  name="file" type="file" id="uploadCloudFile" style="display:none" @change="uploadFile"/>
        <chat-header :showBack="true" :title="title" :showRightBtn="showRightBtn" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-form ref="form" :model="form" label-width="80px" style="width:100%;">
            <el-form-item label="标题">
                <el-input v-model="form.ThemeName" size="small" style="width:650px;" :disabled="isDisabled"></el-input>
            </el-form-item>
            <el-form-item label="课件列表" class="ReceiveApplyDetail_signatory">
                <el-table :data="form.link" border style="width:650px;margin-top:5px;margin-bottom:8px;line-height:20px;" max-height="400">
                    <el-table-column prop="CoursewareNum" label="编号" width="120" align="center"></el-table-column>
                    <el-table-column prop="CoursewareName" label="名称" align="center"></el-table-column>
                    <el-table-column prop="Type" label="类型" width="80" align="center"></el-table-column>
                    <el-table-column prop="CoursewareFrom" label="来源" width="120" align="center"></el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="primary"
                                v-show="scope.row.Text=='试看'"
                                @click="1">试看</el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                v-show="isShow"
                                :style="{margin:scope.row.Text=='试看'?'0 0 0 10px':'0px'}"
                                @click="delCourseware(scope.row,scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                    <div style="padding:10px;" slot="append" v-show="isShow">
                        <el-button type="primary" @click="clickAdd" size="small">添加课件</el-button> 
                    </div>
                </el-table>
            </el-form-item>

            <el-form-item label="教学要点" class="ReceiveApplyDetail_signatory">
                <el-input
                    class="input_padding"
                    style="width:650px;"
                    type="textarea"
                    :rows="4"
                    :disabled="isDisabled" 
                    placeholder="请输入内容"
                    v-model="form.ThemePoint">
                </el-input>
            </el-form-item>

            <el-form-item label="家长指南" class="ReceiveApplyDetail_signatory">
                <el-input
                    class="input_padding"
                    style="width:650px;"
                    type="textarea"
                    :rows="4"
                    :disabled="isDisabled"
                    placeholder="请输入内容"
                    v-model="form.ParentGuide">
                </el-input>
            </el-form-item>

            <el-form-item label="审批意见" class="ReceiveApplyDetail_signatory" v-show="$route.meta.type=='approver'">
                <el-input
                    class="input_padding"
                    style="width:650px;"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="form.text">
                </el-input>
            </el-form-item>

            <el-dialog
                :title="'提示'"
                :visible.sync="dialogVisible"
                width="30%">
                <el-form :model="form" label-width="70px">
                    <el-form-item :label="'课件来源'">
                        <el-radio v-model="form.radio" label="0" style="margin-left:20px;">从川迪课件库</el-radio>
                        <el-radio v-model="form.radio" label="1" style="margin-left:20px;">从本地文件</el-radio>
                    </el-form-item>
                    <label class="startClass_label1">您最多可以从川迪课件库中添加两个课件</label>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCourseware">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                :title="'川迪课件列表'"
                :visible.sync="addDialogVisible"
                width="35%">
                <el-form-item label="系列名称" style="margin-left:10px;">
                    <el-select v-model="formInline.series" @change="getCourseList" filterable size="medium" placeholder="" style="width:320px;">
                        <el-option
                            v-for="item in formInline.allSeries"
                            :key="item.seriesNum"
                            :label="item.seriesName"
                            :value="item.seriesNum">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程名称" style="margin-left:10px;">
                    <el-select v-model="formInline.courseNum" @change="getCourseFromLibrary" filterable size="medium" placeholder="" style="width:320px;">
                        <el-option
                            v-for="item in formInline.courseList"
                            :key="item.index"
                            :label="item.courseName"
                            :value="item.courseNum">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课件名称" style="margin-left:10px;">
                    <el-select v-model="formInline.coursewareName" filterable multiple size="medium" placeholder="请选择课件名称" style="width:320px;">
                        <el-option
                            v-for="(item,index) in formInline.coursewareList"
                            :key="index"
                            :label="item.CoursewareName"
                            :value="index">
                            <span style="float: left">{{ item.CoursewareName }}&nbsp;&nbsp;</span>
                            <!-- <span style="float: right;color: #8492a6; font-size:10px;">{{ item.CoursewareNum }}</span> -->
                        </el-option>
                    </el-select>
                </el-form-item>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmAddSelectCourse">确 定</el-button>
                </span>
            </el-dialog>
        </el-form>
    </div>
</template>

<script>

import { getCourseTheme,getCourseList,getCourseFromLibrary,addCourseTheme,addSelectCourse,addSignTheme } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'

export default {
    name: 'CoursePlanManageDetail',
    data(){
        return {
            title:"",
            dialogVisible:false,
            addDialogVisible:false,
            addFromLocalDialogVisible:false,
            pageNo:1,
            pageSize:1000,
            isDisabled:false,
            showRightBtn:true,
            form: {
                ThemeName:"",
                ThemePoint:"",
                CoursewareFrom:"",
                ParentGuide:"",
                link:[],
                radio:"0",
                text:""
            },
            formInline:{
                courseNum:"",
                courseList:[],
                coursewareName:[],
                coursewareList:[],
                series:"001",
                allSeries:[
                    {seriesName:"HIKIDS系列",seriesNum:'001'},
                    {seriesName:"川迪特色学前系列",seriesNum:'002'},
                    {seriesName:"幼儿故事系列",seriesNum:'003'},
                    {seriesName:"学汉语300句系列",seriesNum:'004'},
                    {seriesName:"学汉字系列",seriesNum:'005'},
                    {seriesName:"国学系列",seriesNum:'006'},
                    {seriesName:"五大领域系列",seriesNum:'007'},
                    {seriesName:"小学教材系列",seriesNum:'008'},
                    {seriesName:"幼儿音乐系列",seriesNum:'009'},
                    {seriesName:"幼儿综合系列",seriesNum:'010'},
                ],
            },
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="edit"){
            this.title = "修改教学主题";
        }else if (this.$route.meta.type=="add") {
            this.title = "添加教学主题";
        }else if (this.$route.meta.type=="examine"||this.$route.meta.type=="examineApprover") {
            this.title = "查看教案详情";
            this.showRightBtn = false;
            this.isDisabled = true;
        }else if(this.$route.meta.type=="approver"){
            this.title = "审批教案";
            this.isDisabled = true;
        }
        this.getCourseTheme();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        isShow(){
            if (this.$route.meta.type!='examine'&&this.$route.meta.type!='examineApprover'&&this.$route.meta.type!='approver') {
                return true
            }else{
                return false
            }
        }
    },
    watch:{
    },
    methods:{ 
        confirm(){
            if (this.$route.meta.type=="add"||this.$route.meta.type=="edit") {
                this.confirmAddOrUpdate();
            }else if (this.$route.meta.type=="approver") {
                this.confirmApprover();
            }
        },
        // 添加或修改教学主题
        confirmAddOrUpdate(){
            let link = [];
            let json = {
                Id:"",
                staffId:this.userInfo.userStaffID,
                ThemeName:this.form.ThemeName,
                ThemePoint:this.form.ThemePoint,
                ParentGuide:this.form.ParentGuide,
            }
            for (let i = 0; i < this.form.link.length; i++) {
                let obj = {};
                // Id:"",CoursewareID:"",Type:""
                obj.Id = this.form.link[i].ID;
                obj.CoursewareID = this.form.link[i].CoursewareID;
                obj.Type = this.form.link[i].CoursewareFrom=="川迪课件库"?"Crisen":"Crisen";
                link.push(obj);
            }
            if (link.length>0) {     
                json.links = JSON.stringify(link);
            }else{
                json.links = "";
            }
            if (this.$route.meta.type=="edit") {
                json.tableID = this.$route.params.ID.split("&")[1],
                json.Id = this.$route.params.ID.split("&")[0];
                json.status = 1;
            }
            if (this.$route.meta.type=="add") {
                json.tableID = this.$route.params.ID.split("&")[1],
                json.status = -1;
            }
            console.log(json);
            if(json.ThemeName==""){
                this.$message.error({
                    message:"请填写标题"
                });
                return;
            }
            // console.log()
            let loading = showLoading();
            addCourseTheme(json).then((result)=>{
                closeLoading(loading);
                if (this.$route.meta.type=="edit") {
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"修改成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message({
                            message:"修改失败",
                            type:"error"
                        });
                    }
                }
                if (this.$route.meta.type=="add") {
                    if(result.data.Result=='1'){
                        this.$message({
                            message:"创建成功",
                            type:"success"
                        });
                        window.history.go(-1);
                    }else{
                        this.$message({
                            message:"创建失败",
                            type:"error" 
                        });
                    }
                }
            })
            // .catch((err)=>{
            //     alertError(this,"2146");
            // });
        },
        confirmApprover(){
            let staffId = this.userInfo.userStaffID;
            let Id = this.$route.params.ID;
            let text = this.form.text;
            if (text == "") {
                this.$message.error({
                    message:"请填写审批意见"
                });
                return;
            }
            // console.log(staffId,Id,text)
            let loading = showLoading();
            addSignTheme(staffId,Id,text).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=='1'){
                    this.$message({
                        message:"审批成功",
                        type:"success"
                    });
                    window.history.go(-1);
                }else{
                    this.$message({
                        message:"审批失败",
                        type:"error"
                    });
                }
            })
            // .catch((err)=>{
            //     alertError(this,"2146");
            // });
        },
        //加载页面
        getCourseTheme(){
            let Id = this.$route.params.ID.split("&")[0];
            let staffId = this.userInfo.userStaffID;
            let loading = showLoading();
            getCourseTheme(Id,staffId,this.pageNo,this.pageSize).then((result)=>{
                closeLoading(loading);
                let obj = result.data;
                // console.log(obj)
                this.form.ThemeName = obj.ThemeName;
                this.form.ThemePoint = obj.ThemePoint;
                this.form.ParentGuide = obj.ParentGuide;
                this.form.link = obj.link;
            })
            // .catch((err)=>{
            //     alertError(this,"1229");
            // })   
        },

        clickAdd(){
            let judge = [];
            for (let i = 0; i < this.form.link.length; i++) {
                if (this.form.link[i].CoursewareFrom=="川迪课件库") {
                    judge.push("川迪课件库");
                }
            }
            if (judge.length>=2) {
                this.$message({
                    message:"您最多可以从川迪课件库中添加两个课件",
                    type:"error" 
                });
                return false;
            }
            this.dialogVisible = true;
        },
        addCourseware(){
            this.dialogVisible = false;
            if (this.form.radio == "0") {
                this.addDialogVisible = true;
                this.getCourseList();
            }else if(this.form.radio == "1"){
                document.getElementById("uploadCloudFile").click();
            }
        },
        confirmAddSelectCourse(){
            let link = [];
            let Ids = [];
            let CoursewareNames = [];
            let json = {}
            for (let j = 0; j < this.formInline.coursewareName.length; j++) {
                let index = this.formInline.coursewareName[j];
                Ids.push(this.formInline.coursewareList[index].ID);
                CoursewareNames.push(this.formInline.coursewareList[index].CoursewareName);
            }
            json.Ids = Ids.join(",");
            json.CoursewareNames = CoursewareNames.join(",");
            for (let i = 0; i < this.form.link.length; i++) {
                let obj = {};
                // Id:"",CoursewareID:"",Type:""
                obj.ID = this.form.link[i].ID;
                obj.CoursewareID = this.form.link[i].CoursewareID;
                obj.CourseThemeID = this.form.link[i].CourseThemeID;
                obj.CoursewareFrom = this.form.link[i].CoursewareFrom=="川迪课件库"?"Crisen":"Crisen";
                obj.CoursewareName = this.form.link[i].CoursewareName;
                obj.Type = this.form.link[i].Type;
                link.push(obj);
            }
            if (link.length>0) {     
                json.data = JSON.stringify(link);
            }else{
                json.data = "";
            }
            if (this.$route.meta.type=="edit") {
                json.ThemeId = this.$route.params.ID.split("&")[0];
            }
            if (this.$route.meta.type=="add") {
                json.ThemeId = this.$route.params.ID.split("&")[0];
            }
            console.log(json)
            // let loading = showLoading();
            addSelectCourse(json).then((result)=>{
                // closeLoading(loading);
                // console.log(result.data)
                if(result.data.data.length>0){
                    for (let k = 0; k < result.data.data.length; k++) {
                        result.data.data[k].CoursewareFrom = result.data.data[k].CoursewareFrom=="Crisen"?"川迪课件库":"本地文件上传"
                    }
                    this.form.link = result.data.data;
                    this.addDialogVisible = false;
                }else if(result.data.Result == "2"){
                    this.$message({
                        message:"您最多可以从川迪课件库中添加两个课件",
                        type:"error"
                    });
                }else{
                    this.$message({
                        message:"添加失败",
                        type:"error"
                    });
                }
            })
        },
        delCourseware(item,index){
            this.form.link.splice(index,1);  
        },
        getCourseList(){
            let loading = showLoading();
            this.formInline.courseList = [];
            getCourseList(this.formInline.series).then((result)=>{
                closeLoading(loading);
                let obj = result.data;
                for(let k in obj){
                    this.formInline.courseList.push({courseName:k,courseNum:obj[k]});
                }
                this.formInline.courseNum = this.formInline.courseList[0].courseNum;
                this.getCourseFromLibrary();
            })
            // .catch((err)=>{
                //     alertError(this,"1229");
            // })  
        },
        getCourseFromLibrary(){
            this.formInline.coursewareNum = [];
            let loading = showLoading();
            getCourseFromLibrary(this.formInline.courseNum,this.pageSize,this.pageNo).then((result)=>{
                closeLoading(loading);
                let obj = result.data.data;
                this.formInline.coursewareList = obj;
            })
        },
        uploadFile(e){
            console.log(e.target.value);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.CoursePlanManageDetail{
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
.el-input__inner:disabled{
    color:#606266 !important; 
}
.labeleg{
    text-align: left;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.labeleg[disabled=disabled]{
    color:#c0c4cc;
}
.information{
    width: 90px;
    height: 40px;
    color:#38ADFF;
    margin-left: 10px;
    font-weight: normal;
    cursor: pointer;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0px 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.input_move{
    transform: translateY(-15px);
}
.input_padding{
    padding: 5px 0 8px 0;
}
.signature div:not(:first-child){
    float: left;
    margin-left: 40px;
}
.startClass_label1{
    color: #e51c23;
    font-weight: normal;
    transform: translateY(10px)
    /* margin-left: 10px; */
}
</style>