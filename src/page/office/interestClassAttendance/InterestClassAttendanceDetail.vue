<template>
    <div class="interertClassChild">
        <chat-header :showBack="true" :title="'兴趣班出勤管理'" :showRightBtn="false"></chat-header>
        <div style="width:100%;padding-top:54px;padding-bottom:20px;" id="staffInfoBtns">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="formInline.classify" @change="attendMessageForOnePerson" filterable size="medium" :placeholder="'请选择人员类别'">
                        <el-option
                            v-for="item in formInline.classifyArr"
                            :key="item.ID"
                            :label="item.Name"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="formInline.classify=='3'">
                    <el-select v-model="formInline.staffID" @change="attendMessageForOnePerson" size="medium" filterable placeholder="请选择跟班教师">
                        <el-option
                            v-for="item in formInline.staffs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" style="width:100%;display:block;" border max-height="600">
            <el-table-column  prop="ClassFrom" align="center"  label="日期"  width="100"></el-table-column>
            <el-table-column  prop="ClassTo" align="center"  label="时间段"  width="100"></el-table-column>
            <el-table-column  v-for="item in column" :key="item.prop" :prop="item.prop" align="center" :label="item.label"></el-table-column>
        </el-table>  
    </div>
</template>

<script>

import { getIClassByID,attendMessageForOnePerson } from '@/js/api'
import { showLoading,closeLoading } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import InterestClassChildItem from '@/page/office/interestClassChild/InterestClassChildItem'

export default {
    name: 'interertClassChild',
    data(){
        return {
            formInline:{
                classifyArr:[
                    {
                        ID:"1",
                        Name:"出勤学员"
                    },
                    {
                        ID:"2",
                        Name:"任课教师"
                    },
                    {
                        ID:"3",
                        Name:"陪班教师"
                    }
                ],
                classify:"1",
                staffID:"",
                staffs:[],
            },
            isDisabled:false,
            item:"",
            pageSize:1000,
            BeginDate:"",
            tableData:[],
            Attendance:[],
            column:[],
            classNum:"",
        }
    },
    components:{
        ChatHeader,
        InterestClassChildItem
    },
    mounted(){
        this.attendMessageForOnePerson();
        this.formInline.staffID = this.userInfo.userStaffID;
        var staffs = [];
        for(var i=0;i<this.allStaffs.length;i++){
            var json = {
                value:this.allStaffs[i].StaffID,
                label:this.allStaffs[i].StaffName
            }
            staffs.push(json);
        }
        this.formInline.staffs = staffs;
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
    },
    watch:{
        
    },
    methods:{
        attendMessageForOnePerson(){
            let personID = this.formInline.staffID;
            console.log(personID);
            let interestClassID = this.$route.params.classId;
            let personType = this.formInline.classify;
            let loading = showLoading();
            attendMessageForOnePerson(interestClassID,personType,this.pageSize,personID).then((result)=>{
                this.column = [];
                closeLoading(loading);
                this.tableData = result.data.data;
                for (let i in this.tableData[0]) {
                    if(i!="ID"&&i!="ClassID"&&i!="ClassFrom"&&i!="ClassTo"){
                        this.column.push({
                            prop:i,
                            label:i
                        })
                    }
                }
                // console.log(this.column);
                // for (let i = 0; i < result.data.data.length; i++) {
                //     let obj = result.data.data[i];
                //     let object = {}
                //     let attendance = []
                //     // console.log(object)
                //     for (let j in obj) {
                //         if(j=="ID"){
                //             object.ID = obj["ID"];
                //         }else if(j=="ClassID"){
                //             object.ClassID = obj["ClassID"];
                //         }else if(j=="ClassFrom"){
                //             object.ClassFrom = obj["ClassFrom"];
                //         }else if(j=="ClassTo"){
                //             object.ClassTo = obj["ClassTo"];
                //         }else{
                //            attendance.push({
                //                 name:j,
                //                 status:obj[j]
                //             });
                //         }
                //     }
                //     this.tableData.push(object);
                //     console.log(attendance)
                //     this.Attendance.concat(attendance);
                // }
                // console.log(this.Attendance)
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.interertClassChild{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative;
}
/* .interertClassChild{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.employTeacherList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1120px){
    .employTeacherList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 960px){
    .employTeacherList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.startClass_label{
    color: #c0c4cc;
    font-weight: normal;
}
.handleAttendance{
    color: #38adff;
    cursor: pointer;
    font-weight: normal;
}
</style>