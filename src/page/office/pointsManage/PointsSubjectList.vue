<template>
    <div class="PointsSubjectList">
        <router-view :item="clickItem" @refresh="refresh"></router-view>
        <chat-header :showBack="true" :title="'积分科目'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding:54px 20px 20px 20px;">
            <el-tabs v-model="tabSelect" @tab-click="handleClick" stretch="true" style="height:100%;overflow:hidden;display:flex;flex-direction:column;width:100%;" class="tuitionIncomeTabs">
                <el-tab-pane label="有效科目" name="first" >
                    <el-button style="display:block;float:right;margin:10px 20px 10px 5px;" type="primary" size="medium" @click="addSubject">添加</el-button>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 20px 20px 20px;">
                        <el-table :data="pointsSubjectList" :span-method="arraySpanMethod" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="455">
                            <el-table-column prop="TypeName" align="center"  label="积分分类"  width="160"></el-table-column>
                            <el-table-column prop="Type" align="center"  label="计分类型"  width="100"></el-table-column>
                            <el-table-column label="科目名称">
                                <template slot-scope="scope">
                                    <el-popover width="500" trigger="hover" placement="bottom">
                                        <div v-html="scope.row.SubjectName" style="word-break:break-all;"></div>
                                        <div slot="reference">
                                            <span class="spanTitle" v-show="!scope.row.ellipsis" v-html="scope.row.SubjectName"></span>
                                            <span class="spanTitle" v-show="scope.row.ellipsis" v-html="scope.row.ellipsisSubjectName"></span>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="评分标准" width="180">
                                <template slot-scope="scope">
                                    <el-popover width="500" trigger="hover" placement="bottom">
                                        <div v-html="scope.row.SubjectPoint" style="word-break:break-all;"></div>
                                        <div slot="reference">
                                            <span class="spanTitle" v-show="!scope.row.ellipsis" v-html="scope.row.SubjectPoint"></span>
                                            <span class="spanTitle" v-show="scope.row.ellipsis" v-html="scope.row.ellipsisContent"></span>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="操作"  width="80">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" @click="updateSubject(scope.row)">修改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="失效科目" name="second" >
                    <el-button style="display:block;float:right;margin:10px 20px 10px 5px;" type="primary" size="medium" @click="addSubject">添加</el-button>
                    <div class="midTableHeight" style="width:100%;display:block;padding:0 20px 20px 20px;">
                        <el-table :data="pointsSubjectList" :span-method="arraySpanMethod" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="455">
                            <el-table-column prop="TypeName" align="center"  label="积分分类"  width="160"></el-table-column>
                            <el-table-column prop="Type" align="center"  label="计分类型"  width="100"></el-table-column>
                            <el-table-column prop="SubjectName" align="center"  label="科目名称"  width="200"></el-table-column>
                            <el-table-column label="评分标准">
                                <template slot-scope="scope">
                                    <el-popover width="500" trigger="hover" placement="bottom">
                                        <div v-html="scope.row.SubjectPoint" style="word-break:break-all;"></div>
                                        <div slot="reference">
                                            <span class="spanTitle" v-show="!scope.row.ellipsis" v-html="scope.row.SubjectPoint"></span>
                                            <span class="spanTitle" v-show="scope.row.ellipsis" v-html="scope.row.ellipsisContent"></span>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="操作"  width="80">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" @click="updateSubject(scope.row)">修改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

import { getCreditTemplate } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'PointsSubjectList',
    data(){
        return {
            tabSelect:"first",
            dialogVisible:false,
            pointsSubjectList:[],
            delFlag:"0",
            clickItem:{},
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    methods:{
        refresh(booleanR){
            if (booleanR) {
                this.loadList();
            }
        },
        loadList(){
            this.pointsSubjectList = [];
            let delFlag = this.delFlag;
            let type = "-1";
            let loading = showLoading();
            getCreditTemplate(delFlag,type).then((result)=>{
                closeLoading(loading);
                let arr = result.data.data;
                let m = 0;//判断行颜色
                for (let i = 0; i < arr.length; i++) {
                    let sarr = arr[i].Subjects;
                    let k = 0;//判断行合并
                    for (let j = 0; j < sarr.length; j++) {
                        let obj = {};   
                        obj.index = k;
                        obj.color = m;
                        obj.len = sarr.length;
                        obj.Type = arr[i].Type;
                        obj.TypeID = arr[i].TypeID;
                        obj.TypeName = arr[i].TypeName;
                        obj.SubjectID = sarr[j].SubjectID;
                        obj.SubjectName = sarr[j].SubjectName;
                        obj.SubjectPoint = sarr[j].SubjectPoint;
                        if (obj.SubjectPoint.indexOf('<br />')!="-1") {
                            obj.ellipsis = true;
                            obj.ellipsisContent = obj.SubjectPoint.split("<br />")[0]+' ...';
                        }else{
                            obj.ellipsis = false;
                        }
                        if (obj.SubjectName.indexOf('<br />')!="-1") {
                            obj.ellipsis1 = true;
                            obj.ellipsisSubjectName = obj.SubjectName.split("<br />")[0]+' ...';
                        }else{
                            obj.ellipsis1 = false;
                        }
                        this.pointsSubjectList.push(obj);
                        k++;
                    }
                    m++;
                }
                console.log(this.pointsSubjectList);
            }).catch((err)=>{
                alertError(this,"1206");
                closeLoading(loading);
            });
        },
        addSubject(){
            this.$router.push(this.$route.fullPath+"/add");
        },
        updateSubject(item){
            this.clickItem = item;
            this.clickItem.status = this.delFlag;
            this.$router.push(this.$route.fullPath+"/update");
        },
        handleClick(tab, event) {
            if (tab.label == "有效科目") {
                this.delFlag = "0";
                this.loadList();
            }else if (tab.label == "失效科目") {
                this.delFlag = "1";
                this.loadList();
            }
        },
        //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0) {
                if (columnIndex == 0) {
				    return 'padding-bottom:7px;background:#38ADFF;color:#fff;'
                }
                return 'background:#38ADFF;color:#fff;text-align:center;'
            }
        },
        getColStyle({ row, column, rowIndex, columnIndex }){
            if (columnIndex == 0) {
				return 'padding-bottom:7px;text-align:center;'
			} else {
				return ''
            }
        },
        tableCellClassName({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0||columnIndex === 1) {
                return 'nohover';
            }else{
                 if (rowIndex%2 ==0) {
                    return 'grayRow';
                } 
                return '';
            }
        },
        //合并
        arraySpanMethod({row, column, rowIndex, columnIndex}){
            if (columnIndex === 0) {
                if (row.index === 0) {
                    return {
                        rowspan: row.len,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
            if (columnIndex === 1) {
                if (row.index === 0) {
                    return {
                        rowspan: row.len,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.PointsSubjectList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .pointsSubjectList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.pointsSubjectList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .pointsSubjectList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .pointsSubjectList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.addbtn{
    float: right;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.spanTitle{
    display: block;
    height: 22px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.orangeButton{
    background: #FF9D00;
    border-color: #FF9D00;
    color: #fff;
}
.orangeButton:hover{
    background: rgb(255, 179, 56);
    border-color: rgb(255, 179, 56);
    color: #fff;
}
</style>