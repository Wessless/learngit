<template>
    <div class="addNewChild">
        <chat-header :showBack="true" :title="'新生录入'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="formInline.selectInput" @keyup.enter.native="reloadList" size="medium" style="width:218px;" placeholder="请输入学号、姓名、手机号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" @click="reloadList">搜索</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="warning" size="medium" @click="addChild">添加</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="export2Excel">导出</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <vue-xlsx-table @on-select-file="handleOk">导入</vue-xlsx-table>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="formInline.radio1" size="medium" style="width:100px;" placeholder="请选择缴费状态">
                        <el-option key="0" label="全部" value="0"></el-option>
                        <el-option key="1" label="已缴费" value="1"></el-option>
                        <el-option key="2" label="未缴费" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="default" size="small" icon="el-icon-refresh" circle @click="reloadList"></el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <div class="downloadTemplate" @click="downloadTemplate">下载模板</div>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="childInfoList">
            <child-info-item v-for="(item,index) in selectChildList" :key="index" :item="item" :type="formInline.radio" :isAddChild="true" @clickDelete="clickDelete" @paymentMoney="paymentMoney"></child-info-item>
        </div>
        <scroll-top></scroll-top>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该幼儿</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
        <!-- <el-dialog title="缴费" :visible.sync="paymentDialogVisible">
            <el-table :data="paymentList" border :header-cell-class-name="getHeaderCellClass">
                <el-table-column property="ID" label="ID" width="70" align="center"></el-table-column>
                <el-table-column property="childName" label="姓名" align="center" width="100"></el-table-column>
                <el-table-column property="phone" label="手机" align="center" width="130"></el-table-column>
                <el-table-column property="money" label="金额" align="center"></el-table-column>
                <el-table-column width="200" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="danger" size="small">删除</el-button>
                        <el-button type="primary" size="small">人工收费</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="paymentDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmPayment">添 加</el-button>
            </span>
        </el-dialog> -->
        <!-- <el-dialog
            title="缴费"
            :visible.sync="paymentDialogVisible"
            width="30%">
            <span>是否删除该幼儿</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="paymentDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>

import { getChildsByClassID,delChild,downloadFile,getChildNum,addNewChild } from '@/js/api'
import { showLoading,closeLoading,PhoneNumValid ,alertError} from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import { export_json_to_excel,data2Workbook } from '@/js/exportToXlxs'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'
import childInfoItem from '@/page/office/childInfo/ChildInfoItem'
import ScrollTop from '@/components/chat/ScrollTop'

export default {
    name: 'AddNewChild',
    data(){
        return {
            formInline:{
                classID:"",
                classList:[],
                radio:"-2",
                radio1:"0",
                selectInput:""
            },
            dialogVisible:false,// 删除弹框
            paymentDialogVisible:false,// 缴费弹框
            clickItem:{},// 当前点击的幼儿相关信息
            paymentList:[],// 幼儿缴费信息
            allChildList:[],// 幼儿信息
        }
    },
    components:{
        ChatHeader,
        ScrollTop,
        NoData,
        childInfoItem
    },
    mounted(){
        this.reloadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        selectChildList(){
            let array = [];
            for(let i=0;i<this.allChildList.length;i++){
                if(this.formInline.radio1=="0"){
                    array.push(this.allChildList[i]);
                }else if(this.formInline.radio1=="1"){
                    if(this.allChildList[i].PriceAll){
                        array.push(this.allChildList[i]);
                    }
                }else{
                    if(this.allChildList[i].PriceAll){
                    }else{
                        array.push(this.allChildList[i]);
                    }
                }
            }
            return array;
        },
        isNoData(){
            if(this.selectChildList.length==0){
                return true;
            }else{
                return false;
            }
        }
    },
    watch:{
        
    },
    methods:{
        getHeaderCellClass({row, column, rowIndex, columnIndex}){
            return "note-attendance-height note-attendance-bg-blue"
        },
        // 导出Excel
        export2Excel(){
            let data = [];
            let tableTitle = "新生录入人员";
            // header
            data.push([
                {
                    value:tableTitle,
                    type:"header",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"},
                            sz:14
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                    } 
                }
            ]);
            // time
            let currDateObj = new Date();
            let dateStr = currDateObj.getFullYear()+"-"+(Array(3).join(0)+(currDateObj.getMonth()+1)).slice(-2)+"-"+(Array(3).join(0)+currDateObj.getDate()).slice(-2);
            data.push([
                {
                    value:"导出日期："+dateStr,
                    type:"time",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"},
                            sz:10
                        },
                        alignment:{
                            horizontal:"right",
                            vertical:"center"
                        }
                    } 
                }
            ]);
            // title
            let titleArray = [];
            titleArray.push({ 
                value:"序号",
                type:"title",
                style:{
                    font:{
                        color:{ rgb: "FF000000"}
                    },
                    alignment:{
                        horizontal:"center",
                        vertical:"center"
                    },
                    border:{
                        top:{ style: "thin", color: { rgb: "FF000000"} },
                        bottom:{ style: "thin", color: { rgb: "FF000000"} },
                        left:{ style: "thin", color: { rgb: "FF000000"} },
                        right:{ style: "thin", color: { rgb: "FF000000"} }
                    }
                }
            });
            titleArray.push({ 
                value:"学号",
                type:"title",
                style:{
                    font:{
                        color:{ rgb: "FF000000"}
                    },
                    alignment:{
                        horizontal:"center",
                        vertical:"center"
                    },
                    border:{
                        top:{ style: "thin", color: { rgb: "FF000000"} },
                        bottom:{ style: "thin", color: { rgb: "FF000000"} },
                        left:{ style: "thin", color: { rgb: "FF000000"} },
                        right:{ style: "thin", color: { rgb: "FF000000"} }
                    }
                }
            });
            titleArray.push({ 
                value:"姓名",
                type:"title",
                style:{
                    font:{
                        color:{ rgb: "FF000000"}
                    },
                    alignment:{
                        horizontal:"center",
                        vertical:"center"
                    },
                    border:{
                        top:{ style: "thin", color: { rgb: "FF000000"} },
                        bottom:{ style: "thin", color: { rgb: "FF000000"} },
                        left:{ style: "thin", color: { rgb: "FF000000"} },
                        right:{ style: "thin", color: { rgb: "FF000000"} }
                    }
                }
            });
            titleArray.push({ 
                value:"出生年月",
                type:"title",
                style:{
                    font:{
                        color:{ rgb: "FF000000"}
                    },
                    alignment:{
                        horizontal:"center",
                        vertical:"center"
                    },
                    border:{
                        top:{ style: "thin", color: { rgb: "FF000000"} },
                        bottom:{ style: "thin", color: { rgb: "FF000000"} },
                        left:{ style: "thin", color: { rgb: "FF000000"} },
                        right:{ style: "thin", color: { rgb: "FF000000"} }
                    }
                }
            });
            titleArray.push({ 
                value:"缴费金额",
                type:"title",
                style:{
                    font:{
                        color:{ rgb: "FF000000"}
                    },
                    alignment:{
                        horizontal:"center",
                        vertical:"center"
                    },
                    border:{
                        top:{ style: "thin", color: { rgb: "FF000000"} },
                        bottom:{ style: "thin", color: { rgb: "FF000000"} },
                        left:{ style: "thin", color: { rgb: "FF000000"} },
                        right:{ style: "thin", color: { rgb: "FF000000"} }
                    }
                }
            });
            titleArray.push({ 
                value:"通知人",
                type:"title",
                style:{
                    font:{
                        color:{ rgb: "FF000000"}
                    },
                    alignment:{
                        horizontal:"center",
                        vertical:"center"
                    },
                    border:{
                        top:{ style: "thin", color: { rgb: "FF000000"} },
                        bottom:{ style: "thin", color: { rgb: "FF000000"} },
                        left:{ style: "thin", color: { rgb: "FF000000"} },
                        right:{ style: "thin", color: { rgb: "FF000000"} }
                    }
                }
            });
            titleArray.push({ 
                value:"通知手机",
                type:"title",
                style:{
                    font:{
                        color:{ rgb: "FF000000"}
                    },
                    alignment:{
                        horizontal:"center",
                        vertical:"center"
                    },
                    border:{
                        top:{ style: "thin", color: { rgb: "FF000000"} },
                        bottom:{ style: "thin", color: { rgb: "FF000000"} },
                        left:{ style: "thin", color: { rgb: "FF000000"} },
                        right:{ style: "thin", color: { rgb: "FF000000"} }
                    }
                }
            });
            titleArray.push({ 
                value:"保险失效日期",
                type:"title",
                style:{
                    font:{
                        color:{ rgb: "FF000000"}
                    },
                    alignment:{
                        horizontal:"center",
                        vertical:"center"
                    },
                    border:{
                        top:{ style: "thin", color: { rgb: "FF000000"} },
                        bottom:{ style: "thin", color: { rgb: "FF000000"} },
                        left:{ style: "thin", color: { rgb: "FF000000"} },
                        right:{ style: "thin", color: { rgb: "FF000000"} }
                    }
                }
            });
            data.push(titleArray);
            // content
            for(let i=0;i<this.allChildList.length;i++){
                let childObj = this.allChildList[i];
                let contentArray = [{
                    value:i+1,
                    type:"content",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                        border:{
                            top:{ style: "thin", color: { rgb: "FF000000"} },
                            bottom:{ style: "thin", color: { rgb: "FF000000"} },
                            left:{ style: "thin", color: { rgb: "FF000000"} },
                            right:{ style: "thin", color: { rgb: "FF000000"} }
                        }
                    }
                },{
                    value:childObj.ChildNum,
                    type:"content",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                        border:{
                            top:{ style: "thin", color: { rgb: "FF000000"} },
                            bottom:{ style: "thin", color: { rgb: "FF000000"} },
                            left:{ style: "thin", color: { rgb: "FF000000"} },
                            right:{ style: "thin", color: { rgb: "FF000000"} }
                        }
                    }
                },{
                    value:childObj.ChildName,
                    type:"content",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                        border:{
                            top:{ style: "thin", color: { rgb: "FF000000"} },
                            bottom:{ style: "thin", color: { rgb: "FF000000"} },
                            left:{ style: "thin", color: { rgb: "FF000000"} },
                            right:{ style: "thin", color: { rgb: "FF000000"} }
                        }
                    }
                },{
                    value:childObj.ChildBirthday.split(" ")[0],
                    type:"content",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                        border:{
                            top:{ style: "thin", color: { rgb: "FF000000"} },
                            bottom:{ style: "thin", color: { rgb: "FF000000"} },
                            left:{ style: "thin", color: { rgb: "FF000000"} },
                            right:{ style: "thin", color: { rgb: "FF000000"} }
                        }
                    }
                },{
                    value:childObj.PriceAll,
                    type:"content",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                        border:{
                            top:{ style: "thin", color: { rgb: "FF000000"} },
                            bottom:{ style: "thin", color: { rgb: "FF000000"} },
                            left:{ style: "thin", color: { rgb: "FF000000"} },
                            right:{ style: "thin", color: { rgb: "FF000000"} }
                        }
                    }
                },{
                    value:childObj.ConnectPeople,
                    type:"content",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                        border:{
                            top:{ style: "thin", color: { rgb: "FF000000"} },
                            bottom:{ style: "thin", color: { rgb: "FF000000"} },
                            left:{ style: "thin", color: { rgb: "FF000000"} },
                            right:{ style: "thin", color: { rgb: "FF000000"} }
                        }
                    }
                },{
                    value:childObj.ConnectPhone,
                    type:"content",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                        border:{
                            top:{ style: "thin", color: { rgb: "FF000000"} },
                            bottom:{ style: "thin", color: { rgb: "FF000000"} },
                            left:{ style: "thin", color: { rgb: "FF000000"} },
                            right:{ style: "thin", color: { rgb: "FF000000"} }
                        }
                    }
                }]
                let date = childObj.InsuranceExpiryDate.split(" ")[0]=='1900-01-01'?'':childObj.InsuranceExpiryDate.split(" ")[0];
                let json = {
                    value:date,
                    type:"content",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"center",
                            vertical:"center"
                        },
                        border:{
                            top:{ style: "thin", color: { rgb: "FF000000"} },
                            bottom:{ style: "thin", color: { rgb: "FF000000"} },
                            left:{ style: "thin", color: { rgb: "FF000000"} },
                            right:{ style: "thin", color: { rgb: "FF000000"} }
                        }
                    }
                };
                if(date){
                    let dateObj = new Date(parseInt(date.split("-")[0]),parseInt(date.split("-")[1])-1,parseInt(date.split("-")[2]));
                    let dateTime = dateObj.getTime();
                    if(new Date().getTime()>dateTime){//失效
                        json.style.fill = { fgColor:{ rgb: "AAAAAA" } };
                    }
                }
                contentArray.push(json);
                data.push(contentArray);
            }
            let concat = 8;
            let merges = [ {s:{c:0, r:0}, e:{c:concat-1, r:0}},{s:{c:0, r:1}, e:{c:concat-1, r:1}} ];
            let cols = [{ wpx: 30 },{ wpx: 60 },{ wpx: 70 },{ wpx: 80 },{ wpx: 70 },{ wpx: 60 },{ wpx: 90 },{ wpx: 90 }];
            let Sheets = {
                'Sheet1':data2Workbook(data,merges,cols)
            };
            export_json_to_excel(['Sheet1'],Sheets,tableTitle);
        },
        // 下载模板
        downloadTemplate(){
            let url = this.userInfo.currProxy+"/COS"+this.userInfo.cosNum+"/Data/Templates/ChildrenInsertTemplate.xls";
            downloadFile(url).then((result)=>{
                const content = result.data;
                const blob = new Blob([content]);
                const fileName = 'ChildrenInsertTemplate.xls';
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
        // excel导入
        handleOk(data){
            let header = data.header;
            let dataArray = [];
            for(let i=0;i<data.body.length;i++){
                let json = {
                    childName:data.body[i][header[0]],
                    sexStatus:data.body[i][header[1]]=='男'?"0":"1",
                    birthday:data.body[i][header[2]],
                    connectPeople:data.body[i][header[3]],
                    phoneNum:data.body[i][header[4]],
                    index:i+2
                }
                dataArray.push(json);
            }
            var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
            var regExp = new RegExp(reg);
            let info = [];
            for(let i=0;i<dataArray.length;i++){
                if(!regExp.test(dataArray[i].birthday)){
                　　info.push(dataArray[i].index+"-"+dataArray[i].childName+"的出生日期格式不正确");
                }
                if(!PhoneNumValid(dataArray[i].phoneNum)){
                    info.push(dataArray[i].index+"-"+dataArray[i].childName+"的通知手机格式不正确");
                }
            }
            if(info.length>0){
                // this.$alert(info.join("\n\r")+"，", '', {
                //     confirmButtonText: '确定',
                //     callback: action => {
                //     }
                // });
                const h = this.$createElement;
                let array = [
                    // h('span', null, '内容可以是 '),
                    // h('i', { style: 'color: teal' }, 'VNode')
                ];
                for(let i=0;i<info.length;i++){
                    array.push(h('p',null,info[i]));
                }
                array.push(h('p',null,'请修改文件后重新导入'));
                this.$msgbox({
                    title: '',
                    message: h('p', null, array),
                    showCancelButton: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(action => {
                });
            }else{
                let loading = showLoading();
                this.addChildMethod(dataArray,0,[],loading);
            }
        },
        // 导入excel时一个一个添加幼儿
        addChildMethod(dataArray,index,errorArray,loading){
            getChildNum()
            .then((result)=>{
                let childNum = result.data.childnum;
                return addNewChild({
                    childNum,
                    childName:dataArray[index].childName,
                    sexStatus:dataArray[index].sexStatus,
                    birthday:dataArray[index].birthday,
                    connectPeople:dataArray[index].connectPeople,
                    phoneNum:dataArray[index].phoneNum,
                })
            })
            .then((result)=>{
                if(result.data.childid){
                }else{
                    errorArray.push(dataArray[index]);
                }
                if(index<dataArray.length-1){
                    index++;
                    this.addChildMethod(dataArray,index,errorArray,loading);
                }else{
                    closeLoading(loading);
                    this.showErrorArray(errorArray);
                }
            })
            .catch((err)=>{
                errorArray.push(dataArray[index]);
                if(index<dataArray.length-1){
                    index++;
                    this.addChildMethod(dataArray,index,errorArray,loading);
                }else{
                    closeLoading(loading);
                    this.showErrorArray(errorArray);
                }
            });
        },
        showErrorArray(errorArray){
            if(errorArray&&errorArray.length>0){
                let names = [];
                for(let i=0;i<errorArray.length;i++){
                    names.push(errorArray[i].childName);
                }
                this.$alert('幼儿（'+names.join("、")+'）添加失败，请重新添加', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        
                    }
                });
                this.reloadList();
            }else{
                this.$message({
                    message:"全部添加成功",
                    type:"success"
                });
                this.reloadList();
            }
        },
        // 重新加载列表
        reloadList(){
            let loading = showLoading();
            this.getChildsByClassID(loading);
        },
        getChildsByClassID(loading){
            getChildsByClassID('-2',this.formInline.selectInput).then((result)=>{
                if(loading){
                    closeLoading(loading);
                }
                this.allChildList = result.data.data;
            }).catch((err)=>{
                alertError(this,"1003");
            });
        },
        // 点击缴费弹出缴费框
        paymentMoney(item){
            this.$router.push(this.$route.fullPath+"/newChildPayment/"+item.Id);
        },
        // 确认缴费
        confirmPayment(){

        },
        // 添加幼儿
        addChild(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        // 点击删除弹出删除框
        clickDelete(item){
            this.dialogVisible = true;  
            this.clickItem = item;
        },
        // 删除幼儿
        confirmDelete(){
            this.dialogVisible = false;
            let childID = this.clickItem.Id;
            let staffID = this.userInfo.userStaffID;
            delChild(staffID,childID).then((result)=>{
                if(result.data.ret == "1"){
                    this.$message({
                        message:"删除成功",
                        type:"success"
                    });
                    this.reloadList();
                }else if(result.data.ret == "2"){
                    this.$message.error({
                        message:"该幼儿无法删除",
                    });
                }else if(result.data.ret == "0"){
                    this.$message.error({
                        message:"删除失败",
                    });
                }
            }).catch((err)=>{
                alertError(this,"2086");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.addNewChild{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .staffInfo{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.childInfoList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .childInfoList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.downloadTemplate{
    color: #38adff;
    cursor: pointer;
}
</style>