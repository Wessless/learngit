<template>
    <div class="expense">
        <chat-header :showBack="true" :title="'业绩评定-按班级'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-date-picker
                        v-model="formInline.month"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        size="medium"
                        @change="loadList(true)"
                        placeholder="请选择月份">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="getClassPerformance">导出</el-button>
                </el-form-item>
                <el-form-item v-show="false">
                    <vue-xlsx-table @on-select-file="handleOk">导入</vue-xlsx-table>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="classEvaluationList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="0">
            <class-evaluation-item v-for="(item,index) in classEvaluationList" :key="index" :item="item" @monthAttendance="monthAttendance" @childAttendance="childAttendance"></class-evaluation-item>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>是否删除该班级</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { getClassPerformance } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import ClassEvaluationItem from '@/page/office/classEvaluation/ClassEvaluationItem'
import NoData from '@/components/chat/NoData'
import { export_json_to_excel,data2Workbook } from '@/js/exportToXlxs'

export default {
    name: 'ClassEvaluation',
    data(){
        return {
            formInline: {
                radio:"0",
                month:""
            },
            isNoData:false,
            classEvaluationList:[],
            dialogVisible: false,
            clickItem:null,
            currentPage:1,
            pageSize:12,
            isDisabled:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
        ClassEvaluationItem
    },
    mounted(){
        let date = new Date();
        this.formInline.month = date.getFullYear()+"-"+(Array(3).join(0)+(date.getMonth()+1)).slice(-2);
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
        handleOk(convertedData){
            console.log(convertedData);
        },
        showInfo(){
            this.$notify.info({
                title: '说明',
                message: '打印时请横向打印',
                dangerouslyUseHTMLString:true,
                duration: 0
            });
        },
        getClassPerformance(){
            let loading = showLoading();
            let staffID = this.userInfo.userStaffID;
            getClassPerformance(1,1000,staffID,this.formInline.month.split('-').join(''))
            .then((result)=>{
                // this.showInfo();
                closeLoading(loading);
                this.export2Excel(result.data.data)
            })
            .catch((err)=>{
                closeLoading(loading);
                alertError(this,"1254");
            });
        },
        // 导出Excel
        export2Excel(tableData){
            // let monthDateObj = new Date(this.formInline.month.split("-")[0],this.formInline.month.split("-")[1],"1");
            // monthDateObj.setDate(monthDateObj.getDate()-1);
            // let monthDateNum = Number(monthDateObj.getDate());
            let data = [];
            let tableTitle = this.formInline.month.split("-")[0]+"年"+Number(this.formInline.month.split("-")[1])+"月班级评定";
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
            let titleArray = [{ 
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
            },{ 
                value:"编号",
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
            },{ 
                value:"班级名称",
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
            },{ 
                value:"班级定员",
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
            },{ 
                value:"主班",
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
            },{ 
                value:"配班",
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
            },{ 
                value:"保育员",
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
            },{ 
                value:"月出勤",
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
            },{ 
                value:"2.5岁以下",
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
            }];
            data.push(titleArray);
            // content
            for(let i=0;i<tableData.length;i++){
                let childObj = tableData[i];
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
                    value:childObj.ClassNum,
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
                    value:childObj.ClassName,
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
                    value: childObj.ClassSetNum,
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
                    value: childObj.TName,
                    type:"content",
                    style:{
                        font:{
                            color:{ rgb: "FF000000"}
                        },
                        alignment:{
                            horizontal:"left",
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
                    value: childObj.HName,
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
                    value:childObj.NName,
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
                    value:childObj.MonthAtt+"人",
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
                    value:childObj.BabyAtt+"人",
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
                }];
                // let date = childObj.InsuranceExpiryDate.split(" ")[0]=='1900-01-01'?'':childObj.InsuranceExpiryDate.split(" ")[0];
                // let json = {
                //     value:date,
                //     type:"content",
                //     style:{
                //         font:{
                //             color:{ rgb: "FF000000"}
                //         },
                //         alignment:{
                //             horizontal:"center",
                //             vertical:"center"
                //         },
                //         border:{
                //             top:{ style: "thin", color: { rgb: "FF000000"} },
                //             bottom:{ style: "thin", color: { rgb: "FF000000"} },
                //             left:{ style: "thin", color: { rgb: "FF000000"} },
                //             right:{ style: "thin", color: { rgb: "FF000000"} }
                //         }
                //     }
                // };
                // if(date){
                //     let dateObj = new Date(parseInt(date.split("-")[0]),parseInt(date.split("-")[1])-1,parseInt(date.split("-")[2]));
                //     let dateTime = dateObj.getTime();
                //     if(new Date().getTime()>dateTime){//失效
                //         json.style.fill = { fgColor:{ rgb: "AAAAAA" } };
                //     }
                // }
                // contentArray.push(json);
                data.push(contentArray);
            }
            console.log(data);
            let concat = 9;
            let merges = [ {s:{c:0, r:0}, e:{c:concat-1, r:0}},{s:{c:0, r:1}, e:{c:concat-1, r:1}} ];
            let cols = [{ wpx: 30 },{ wpx: 40 },{ wpx: 75 },{ wpx: 60 },{ wpx: 360 },{ wpx: 53 },{ wpx: 53 },{ wpx: 50 },{ wpx: 65 }];
            let pageSetup = {scale: '100', orientation: 'landscape'};
            let Sheets = {
                'Sheet1':data2Workbook(data,merges,cols,pageSetup)
            };
            export_json_to_excel(['Sheet1'],Sheets,tableTitle);
        },
        loadList(reload){
            let staffID = this.userInfo.userStaffID;
            if(reload){
                this.currentPage = 1;
                this.isDisabled = false;
            }
            if(!this.isDisabled){
                this.isDisabled = true;
                let loading = showLoading();
                getClassPerformance(this.currentPage,this.pageSize,staffID,this.formInline.month.split('-').join(''))
                .then((result)=>{
                    if(reload){
                        this.classEvaluationList = [];
                    }
                    if(result.data.totalCount<this.currentPage*this.pageSize){
                        this.isDisabled = true;
                    }else{
                        this.isDisabled = false;
                    }
                    closeLoading(loading);
                    this.currentPage++;
                    for(let i=0;i<result.data.data.length;i++){
                        this.classEvaluationList.push(result.data.data[i]);
                    }
                    if(this.classEvaluationList.length==0){
                        this.isNoData = true;
                    }else{
                        this.isNoData = false;
                    }
                })
                .catch((err)=>{
                    closeLoading(loading);
                    alertError(this,"1254");
                });
            }
        },
        monthAttendance(item){
            let month = this.formInline.month.split('-').join('');
            this.$router.push(this.$route.fullPath + "/month/"+item.ClassID+"/"+month);
        },
        childAttendance(item){
            let month = this.formInline.month.split('-').join('');
            this.$router.push(this.$route.fullPath + "/child/"+item.ClassID+"/"+month);
        },
        // 确认删除
        confirmDelete(){
            let id = this.clickItem.ID;
            
            this.dialogVisible = false;  
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.expense{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
    max-height:100vh;
}
/* .classEvaluationList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.classEvaluationList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .classEvaluationList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .classEvaluationList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
</style>