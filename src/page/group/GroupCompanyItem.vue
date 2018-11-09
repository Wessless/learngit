<template>
    <div class="company_item" v-bind:class="{'selected':item.F_CosNum==userInfo.cosNum}" onselectstart="return false;">
        <span class="title" :style="{color:isGroup?'black':'#38adff'}" :title="item.F_CosNum+'-'+item.F_CosName">{{item.F_CosNum+'-'+item.F_CosName}}</span>
        <span class="groupName" v-show="isGroup">集团</span>
        <span class="loginName" v-show="item.F_CosNum!=userInfo.cosNum&&item.F_DbConfig!=''" @click="changeLogin">登录</span>
        <el-popover
            placement="right"
            popper-class="groupPopover"
            v-model="item.isShowGroup"
            trigger="click">
            <div class="newGroupItem">
                <div class="flexItem" v-for="(item2,index2) in newGroupItem" :key="index2" @click="examineGroupDetail(item2)">
                    <div class="image"><img :src="item2.icon"></div>
                    <span>{{item2.text}}</span>
                </div>
            </div>
            <span slot="reference" class="iconfont icon" v-show="item.F_LastModifyUserId!=''" @click.stop="examineGroupItem">&#xe73b;</span>
        </el-popover>
        <span class="caret" v-show="isGroup" v-bind:class="{'open':showcompany}"></span>
        <div class="botDivider"></div>
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import imageProxy from '@/components/chat/ImageProxy'

export default {
    name: 'GroupCompanyItem',
    props: {
        item:{
            type:Object
        },
        isGroup:{
            type:Boolean,
            default:false,
        },
        showcompany:{
            type:Boolean,
        }
    },
    data :function() {
        return {
            hideMoreflag:"",
            oldGroupItem:[{
                    id : '1',
                    text : '学费收入',
                    icon : '/static/images/group/icon-1.png' 
                }, {
                    id : '2',
                    text : '费用支出',
                    icon : '/static/images/group/icon-2.png'
                }, {
                    id : '3',
                    text : '工资支出',
                    icon : '/static/images/group/icon-3.png'
                }, {	
                    id : '4',
                    text : '员工数据',
                    icon : '/static/images/group/icon-4.png'
                }, {
                    id : '5',
                    text : '学员数据',
                    icon : '/static/images/group/icon-5.png'
                }, {
                    id : '6',
                    text : '学员出勤',
                    icon : '/static/images/group/icon-6.png'
                }],
            newGroupItem:[],
            clickIndex:"",
        }
    },
    mounted(){
    },
    components:{
        imageProxy
    },
    computed:{
        ...mapState([
            'userInfo'
        ])
    },
    methods:{
        examineGroupItem(){
            this.newGroupItem = [];
            let Ids = this.item.F_LastModifyUserId.split(',');
            for (let i = 0; i < Ids.length; i++) {
                for (let j = 0; j < this.oldGroupItem.length; j++) {
                    if (this.oldGroupItem[j].id==Ids[i]) {
                        this.newGroupItem.push(this.oldGroupItem[j]);
                    }
                }
            }
            // console.log(this.newGroupItem);
            this.$emit("changeIsShowGroup",this.item.F_CosNum);
        },
        examineGroupDetail(item2){
            this.item.isShowGroup = false;
            let isGroup = this.isGroup?'1':'0';
            if (item2.id=='1') {
                this.$router.push("/mainpage/group/"+this.item.F_CosNum+'/'+isGroup+"/tuitionIncome");
            }
            if (item2.id=='2') {
                // this.$router.push("/mainpage/group");
                // window.history.go(-1);
                this.$router.push("/mainpage/group/"+this.item.F_CosNum+'/'+isGroup+"/chargeExpend");
            }
            if (item2.id=='4') {
                this.$router.push("/mainpage/group/"+this.item.F_CosNum+'/'+isGroup+"/staffData");
            }
            if (item2.id=='5') {
                this.$router.push("/mainpage/group/"+this.item.F_CosNum+'/'+isGroup+"/studentData");
            }
            if (item2.id=='6') {
                this.$router.push("/mainpage/group/"+this.item.F_CosNum+'/'+isGroup+"/studentAttendance");
            }
        },
        changeLogin(){
            this.$emit("changeLogin",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.company_item {
    /*overflow: hidden;*/
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    position: relative;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    padding-right: 10px;
    color: #38ADFF;
    font-size: 15px;
}
.company_item.selected{
    background-color: rgba(56,173,255,0.1) !important;
}
.company_item .info{
    /* padding-bottom: 8px; */
    line-height: 40px;
}
.company_item .icon{
    margin-left: 10px;
    display: inline-block;
    font-size: 14px;
    line-height: 40px;
}
.company_item .nickname_text{
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.botDivider {
    height: 1px;
    /*margin: 9px 0;*/
    overflow: hidden;
    background-color: #e9f0f8;
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 100%;
}
.title{
    flex:1;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    display:inline-block;
}
.company_item .groupName{
    display: inline-block;
    position: relative;
    margin-left: 10px;
    background-color: #38ADFF;
    color: #fff;
    text-align: center;
    width: 32px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
    border-radius: 3px;
}
.company_item .loginName{
    display: inline-block;
    position: relative;
    margin-left: 10px;
    text-align: center;
    width: 32px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
    border-radius: 3px;
    border: 1px solid #38ADFF;
    color: #38ADFF;
    box-sizing: border-box;
}
.company_item .caret.open{
    margin: 0 0 0 10px;
    color: #38adff;
    border-bottom: 5px solid;
    border-top: 0;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
.company_item .caret{
    margin: 0 0 0 10px;
    color: #38adff;
    border-top: 5px solid;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
.newGroupItem{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}
.flexItem{
    display: flex;
    height: 36px;
    /* text-align: center; */
    line-height: 30px;
    padding: 3px 15px;
    cursor: pointer;
    align-items: center;
    border-bottom: 1px solid #dddddd;   
}
.flexItem:hover{
    background-color: rgba(56,173,255,0.1) !important;
}
.flexItem:last-child{
    border-bottom: 0px;   
}
.image{
    width: 24px;
    height: 24px;
    margin-right: 5px;
    position: relative;
}
.image > img{
    width: 100%;
    height: 100%;
    position: absolute;
    left:0;
    top:0;
}
</style>