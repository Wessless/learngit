<template>
    <div class="expense">
        <chat-header :showBack="true" :title="'业绩评定-按教师'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-date-picker
                        v-model="formInline.month"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        @change="loadList(true)"
                        size="medium"
                        placeholder="请选择月份">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="primary" size="medium" @click="getHomeTongExport">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <no-data :isShow="isNoData"></no-data>
        <div class="classEvaluationList" v-infinite-scroll="loadList" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="0">
            <teacher-evaluation-item v-for="(item,index) in classEvaluationList" :key="index" :item="item" :month="formInline.month"></teacher-evaluation-item>
        </div>
    </div>
</template>

<script>

import { getWorkPerformance,getHomeTongExport } from '@/js/api'
import { showLoading,closeLoading,alertError } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import TeacherEvaluationItem from '@/page/office/teacherEvaluation/TeacherEvaluationItem'
import NoData from '@/components/chat/NoData'
import { export_json_to_excel,data2Workbook } from '@/js/exportToXlxs'

export default {
    name: 'TeacherEvaluation',
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
            pageSize:15,
            isDisabled:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
        TeacherEvaluationItem
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
        getHomeTongExport(){
            getHomeTongExport(this.userInfo.userStaffID,this.formInline.month.split("-").join("")).then((result)=>{
                console.log(result)
                this.export2Excel(result.data.data);
            }).catch((err)=>{
                alertError(this,"1295");
            });
        },
        // 导出Excel
        export2Excel(tableData){
            // let monthDateObj = new Date(this.formInline.month.split("-")[0],this.formInline.month.split("-")[1],"1");
            // monthDateObj.setDate(monthDateObj.getDate()-1);
            // let monthDateNum = Number(monthDateObj.getDate());
            let data = [];
            let tableTitle = this.formInline.month.split("-")[0]+"年"+Number(this.formInline.month.split("-")[1])+"月教工评定";
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
            },{ 
                value:"本月家园通",
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
                value:"园所",
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
                value:"班级",
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
                value:"个人",
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
                value:"看班次数",
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
                value:"考核评分",
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
                    value:childObj.StaffNum,
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
                    value:childObj.StaffName,
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
                    value: childObj.JIAYUANTONG=="0"?"":childObj.JIAYUANTONG,
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
                    value: childObj.kindergartenNum=="0"?"":childObj.kindergartenNum,
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
                    value: childObj.ClassNum=="0"?"":childObj.ClassNum,
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
                    value:childObj.ChildNum=="0"?"":childObj.ChildNum,
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
                    value:childObj.ICLASSATTEND,
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
                    value:childObj.ERPoint,
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
            let cols = [{ wpx: 30 },{ wpx: 60 },{ wpx: 70 },{ wpx: 80 },{ wpx: 50 },{ wpx: 50 },{ wpx: 50 },{ wpx: 70 },{ wpx: 100 }];
            let Sheets = {
                'Sheet1':data2Workbook(data,merges,cols)
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
                getWorkPerformance(this.currentPage,this.pageSize,staffID,this.formInline.month.split('-').join(''))
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
                    alertError(this,"1257");
                });
            }
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
    max-height: 100vh;
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