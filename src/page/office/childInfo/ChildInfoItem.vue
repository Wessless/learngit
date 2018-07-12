<template>
    <div class="childItem" :class="{isSelect:item.selected}">
        <div class="headImage"><img :src="imagePath" alt=""></div>
        <div class="headTitle">
            <!-- <span class="iconfont moneyIcon" v-if="item.IsSalaryNotIncluded=='1'" style="color:#999">&#xe72e;</span>
            <span class="iconfont moneyIcon" v-if="item.IsSalaryNotIncluded=='0'" style="color:#fdc223">&#xe72e;</span> -->
            {{ item.ChildName }}
            <span class="sex iconfont" v-if="sex=='1'" style="color:#f817a6">&#xe72c;</span>
            <span class="sex iconfont" v-if="sex=='0'" style="color:#38adff">&#xe72b;</span>
        </div>
        <div class="sortblock" v-show="!isAssignChild">
            <span class="item" @click.stop="editFamilyMember">编辑家庭成员</span>
            <!-- <span class="item" v-if="item.Mobile!=''"><span class="iconfont" style="color:#38adff;">&#xe7f4;</span>{{ item.Mobile }}</span>
            <span class="item" v-show="item.DepartmentName!=''">{{ item.DepartmentName }}</span> -->
        </div>
        <div class="title">学号：{{ item.ChildNum }}</div>
        <div class="title">出生年月：{{ item.ChildBirthday.split(" ")[0] }}</div>
        <div class="title">民族：{{ item.ChildNation }}</div>
        <div class="title" v-show="!isAddChild&&!isAssignChild">通知人：{{ item.ConnectPeople }}</div>
        <div class="title" v-show="!isAddChild&&!isAssignChild">通知手机：{{ item.ConnectPhone }}</div>
        <div class="title" v-show="!isAddChild&&!isAssignChild">保险失效日期：<span :class="{'red':insuranceExpiryDateColor}">{{ insuranceExpiryDate }}</span></div>
        <div class="bottomBtns" v-show="!isAddChild&&!isAssignChild">
            <div class="bottomBtn" v-show="type=='0'" @click.stop="quitSchool">退学</div>
            <div class="bottomBtn" v-show="type=='0'" @click.stop="changeClass">转班</div>
            <div class="bottomBtn" v-show="type=='2'" @click.stop="changeClassBack">恢复学籍</div>
            <div class="bottomBtn" @click.stop="childRecord">查看学籍</div>
        </div>
        <div class="bottomBtns" v-show="!isAssignChild">
            <div class="bottomBtn" @click.stop="deleteChild">删除</div>
            <div class="bottomBtn" @click.stop="changeChild">修改</div>
        </div>
        <div class="checkboxSelect" v-show="isAssignChild"><el-checkbox v-model="item.selected"></el-checkbox></div>
        <!-- <div class="deleteChild" @click.stop="deleteChild">删除</div>
        <div class="changeChild" @click.stop="changeChild">修改</div> -->
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'ChildInfoItem',
    props: {
        item:{
            type:Object
        },
        type:{// 0：进行中班级，1：已毕业班级，2：中途退学
            type:String
        },
        isAddChild:{// 是否是新生录入
            type:Boolean,
            default:false
        },
        isAssignChild:{// 是否是新生分班
            type:Boolean,
            default:false
        },
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
        insuranceExpiryDate(){
            return this.item.InsuranceExpiryDate.split(" ")[0]=='1900-01-01'?'':this.item.InsuranceExpiryDate.split(" ")[0]
        },
        insuranceExpiryDateColor(){
            let date = this.insuranceExpiryDate;
            if(date){
                let dateObj = new Date(parseInt(date.split("-")[0]),parseInt(date.split("-")[1])-1,parseInt(date.split("-")[2]));
                let dateTime = dateObj.getTime();
                if(new Date().getTime()>dateTime){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        },
        sex(){
            if(this.item.ChildSex=="0"){
                // return "男";
                return '0';
            }else{
                // return "女";
                return '1';
            }
        },
        imagePath(){
            if(this.item.ImagePath){
                return this.item.ImagePath.replace("../../../",this.userInfo.currProxy+'/COS'+this.userInfo.cosNum+'/');
            }else{
                return this.userInfo.currProxy+'/COS'+this.userInfo.cosNum+'/data/UPLOADFILES/ForumFaceImage/face.bmp'
                // if(this.item.Sex=="0"){
                //     return "/static/images/staff_female.jpg";
                // }else{
                //     return "/static/images/staff_male.jpg";
                // }
            }
        },
    },
    watch:{
    },
    methods:{
        // 修改
        changeChild(){
            this.$router.push(this.$route.fullPath+"/update/"+this.item.Id);
        },
        // 删除
        deleteChild(){
            this.$emit("clickDelete",this.item);
        },
        // 编辑家庭成员
        editFamilyMember(){
            this.$router.push(this.$route.fullPath+"/familyMember/"+this.item.Id);
        },
        childRecord(){
            this.$emit("childRecord",this.item);
        },
        changeClass(){
            this.$emit("changeClass",{item:this.item,title:"转班"});
        },
        quitSchool(){
            this.$emit("quitSchool",this.item);
        },
        changeClassBack(){
            this.$emit("changeClassBack",{item:this.item,title:"恢复学籍"});
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .childItem{
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
.childItem{
    display: block;
    position: relative;
    justify-self: center;
    width: 94%;
    background-color: #fff;
    border-radius: 6px;
    border:1px solid #999;
    /* box-shadow: 0 4px 8px rgba(0,0,0,.12); */
    padding: 45px 10px 10px 10px;
    margin: 40px 3% 20px 3%;
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
    height:30px;
    align-items: center;
}
.sortblock > .item{
    padding-left: 8px;
    padding-right: 8px;
    height:24px;
    padding-top:2px;
    border-left: 1px solid #999;
    color: #ffffff;
    cursor: pointer;
    background:#38adff;
    border-radius: 3px;

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
.deleteChild{
    position: absolute;
    right:13px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.changeChild{
    position: absolute;
    right:63px;
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
.bottomBtns{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
.red{
    color: #e51c23;
}
.checkboxSelect{
    position: absolute;
    top:10px;
    left:10px;
    padding:0 3px;
}
.isSelect{
    border-color: #38adff !important;
}
</style>