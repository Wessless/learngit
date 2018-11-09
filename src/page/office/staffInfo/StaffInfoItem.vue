<template>
    <div class="staffItem">
        <div class="headImage"><img :src="imagePath" alt=""></div>
        <div class="manager" v-show="item.DepID=='1'"><div class="isManager"></div><div class="content">超</div></div> 
        <div class="canSUP" v-show="canSUP">S</div>
        <div class="headTitle">
            <span class="iconfont moneyIcon" v-if="item.IsSalaryNotIncluded=='1'" style="color:#999">&#xe72e;</span>
            <span class="iconfont moneyIcon" v-if="item.IsSalaryNotIncluded=='0'" style="color:#fdc223">&#xe72e;</span>
            {{ item.StaffName }}
            <span class="sex iconfont" v-if="sex=='0'" style="color:#f817a6">&#xe72c;</span>
            <span class="sex iconfont" v-if="sex=='1'" style="color:#38adff">&#xe72b;</span>
        </div>
        <div class="sortblock">
            <!-- <span class="item">{{ sex }}</span> -->
            <span class="item" v-if="item.Mobile!=''"><span class="iconfont" style="color:#38adff;">&#xe7f4;</span>{{ item.Mobile }}</span>
            <span class="item" v-show="item.DepartmentName!=''">{{ item.DepartmentName }}</span>
            <!-- <span class="item">{{ fillYear }}</span> -->
        </div>
        <div class="title">员工编号：{{ item.StaffNum }}</div>
        <div class="title">考勤卡号：{{ item.CardID?item.CardID:"无" }}</div>
        <!-- <div class="title">公司工龄：1年</div> -->
        <div class="title">入职时间：{{ beStaff }}（{{ fillYear }}）</div>
        <div class="title" v-show="item.NotBeStaff==''">转正时间：{{ turnDate }}</div>
        <div class="title" v-show="item.NotBeStaff!=''">离职时间：{{ notBeStaff }}</div>
        <div class="title">签字设定：
            <span class="personIcon iconfont" :class="{ selected: hasFinanceSignManager}">&#xe886;</span>
            <span class="personIcon iconfont" :class="{ selected: hasTimeScheduleManager}">&#xe734;</span>
            <span class="personIcon iconfont" :class="{ selected: item.DailyManager!='-1'}">&#xe737;</span>
        </div>
        <div class="deleteStaff" @click.stop="deleteStaff">删除</div>
        <div class="changeStaff" @click.stop="changeStaff">修改</div>
        <div class="resetPassword" @click.stop="resetPassword">重置密码</div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money} from '@/config/utils'

export default {
    name: 'StaffInfoItem',
    props: {
        item:{
            type:Object
        }
    },
    data(){
        return {
        }
    },
    components:{
    },
    mounted(){
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        canSUP(){
            if(this.item.SupID){
                return true;
            }else{
                return false;
            }
        },
        hasFinanceSignManager(){
            if(this.item.FinanceSignManager!="-1"||this.item.FinanceSignManager2!="-1"||this.item.FinanceSignManager3!="-1"){
                return true;
            }else{
                return false;
            }
        },
        hasTimeScheduleManager(){
            if(this.item.TimeScheduleManager!="-1"||this.item.TimeScheduleManager1!="-1"){
                return true;
            }else{
                return false;
            }
        },
        sex(){
            if(this.item.Sex=="0"){
                return '0';
                // return "女";
            }else{
                // return "男";
                return '1';
            }

        },
        imagePath(){
            if(this.item.ImagePath){
                return this.item.ImagePath.replace("../../../",this.userInfo.currProxy+'/COS'+this.userInfo.cosNum+'/');
            }else{
                if(this.item.Sex=="0"){
                    return "/static/images/staff_female.jpg";
                }else{
                    return "/static/images/staff_male.jpg";
                }
            }
        },
        beStaff(){
            if(this.item.BeStaff){
                let date = this.item.BeStaff;
                return date.substring(0,4)+"-"+date.substring(4,6)+"-"+date.substring(6,8);
            }else{
                return "无";
            }
        },
        turnDate(){
            if(this.item.TurnDate){
                let date = this.item.TurnDate;
                return date.substring(0,4)+"-"+date.substring(4,6)+"-"+date.substring(6,8);
            }else{
                return "无";
            }
        },
        notBeStaff(){
            if(this.item.NotBeStaff){
                let date = this.item.NotBeStaff;
                return date.substring(0,4)+"-"+date.substring(4,6)+"-"+date.substring(6,8);
            }else{
                return "无";
            }
        },
        fillYear(){
            // 在职1年
            if(this.item.BeStaff){
                let date = this.item.BeStaff;
                let year = Number(date.substring(0,4));
                let month = Number(date.substring(4,6));
                let day = Number(date.substring(6,8));
                let currentDate = new Date();
                let currYear = currentDate.getFullYear();
                let currMonth = currentDate.getMonth()+1;
                let currDate = currentDate.getDate();
                if(this.item.NotBeStaff){
                    let notDate = this.item.NotBeStaff;
                    currYear = Number(notDate.substring(0,4));
                    currMonth = Number(notDate.substring(4,6));
                    currDate = Number(notDate.substring(6,8));
                }
                let fillYear = currYear - year;
                if(month<currMonth){

                }else if(month==currMonth){
                    if(day<=currDate){

                    }else{
                        fillYear--;
                    }
                }else{
                    fillYear--;
                }
                return "在职满"+fillYear+"年";
            }else{
                return "";
            }
        }
    },
    watch:{
    },
    methods:{
        changeStaff(){
            this.$router.push(this.$route.fullPath+"/update/"+this.item.StaffID);
        },
        deleteStaff(){
            this.$emit("clickDelete",this.item);
        },
        resetPassword(){
            this.$emit("clickReset",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .staffItem{
    display: block;
    position: relative;
    width:310px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 5px 10px 10px 10px;
    margin-right: 20px;
    margin-bottom: 20px;
    border:1px solid #ffffff;
} */
.staffItem{
    display: block;
    position: relative;
    justify-self: center;
    width: 94%;
    background-color: #fff;
    border-radius: 6px;
    border:1px solid #999;
    /* box-shadow: 0 4px 8px rgba(0,0,0,.12); */
    padding: 45px 10px 25px 10px;
    margin: 40px 3% 20px 3%;
}
.manager{
    position: absolute;
    top: 0px;
    right: 0px;
    width: 40px;
    height: 40px;
    border-radius: 0px 5px 0px 0px; 
    overflow: hidden;
}
.content{
    position: absolute;
    top: 1px;
    right: 1px;
    width: 15px;
    height: 15px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}
.isManager{
    position: absolute;
    top: 0px;
    right: 0px;
    width: 0;
    height: 0;
    border-width: 30px 0px 0px 30px;
    border-color: #38adff transparent;
    border-style: solid;
}
.headImage{
    position: absolute;
    left:50%;
    top:-41px;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    height:82px;
    width:82px;
    border-radius: 50%;
    border:1px solid #999;
    background:#ffffff;
    overflow: hidden;
}
.headImage > img{
    width: 100%;
    height: 100%;
}
.headTitle{
    font-size:18px;
    font-weight: 500;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    text-align:center;
}
.sortblock{
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    padding:5px 0;
    height:50px;
    align-items: center;
}
.sortblock > .item{
    padding-left: 5px;
    padding-right: 5px;
    border-left: 1px solid #999;
    color: #999;
}
.sortblock > .item:nth-child(1){
    border-left: 0px solid #999;
}
.title{
    /* width:49%; */
    display: block;
    color: #999999;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.deleteStaff{
    position: absolute;
    right:13px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.changeStaff{
    position: absolute;
    right:53px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.resetPassword{
    position: absolute;
    right:93px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.el-checkbox{
    margin:0;
}
.sex{
    padding-left:5px;
    font-size:20px;
}
.moneyIcon{
    padding-right:5px;
}
.personIcon{
    padding-right: 5px;
}
.selected{
    color: #38adff;
}
.canSUP{
    width:20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #38ddff;
    color: #fff;
    position: absolute;
    left:50%;
    top:22px;
    margin-left:17px;
    z-index:7;
    font-size: 12px;
    border:2px solid #fff;
    border-radius: 50%;
}
</style>