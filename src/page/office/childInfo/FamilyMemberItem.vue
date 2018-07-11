<template>
    <div class="childItem">
        <div class="headImage"><img :src="imagePath" alt=""></div>
        <div class="headTitle">
            <!-- <span class="iconfont moneyIcon" v-if="item.IsSalaryNotIncluded=='1'" style="color:#999">&#xe72e;</span>
            <span class="iconfont moneyIcon" v-if="item.IsSalaryNotIncluded=='0'" style="color:#fdc223">&#xe72e;</span> -->
            {{ item.ParentName }}
            <span class="sex iconfont" v-if="sex=='1'" style="color:#f817a6">&#xe72c;</span>
            <span class="sex iconfont" v-if="sex=='0'" style="color:#38adff">&#xe72b;</span>
        </div>
        <!-- <div class="sortblock">
            <span class="item" @click.stop="editFamilyMember">编辑家庭成员</span>
        </div> -->
        <div class="title">卡号：{{ item.CardID }}</div>
        <div class="title">关系：{{ item.Relation }}</div>
        <div class="title">固定电话：{{ item.PhoneNum }}</div>
        <div class="title">手机：{{ item.MobileNum }}</div>
        <div class="title">QQ：{{ item.QQ }}</div>
        <div class="title">电子邮件：{{ item.Email }}</div>
        <div class="bottomBtns">
            <div class="bottomBtn" @click.stop="deleteChild">删除</div>
            <div class="bottomBtn" @click.stop="changeChild">修改</div>
        </div>
        <!-- <div class="deleteChild" @click.stop="deleteChild">删除</div>
        <div class="changeChild" @click.stop="changeChild">修改</div> -->
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'FamilyMemberItem',
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
        sex(){
            if(this.item.Sex=="0"){
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
            this.$router.push(this.$route.fullPath + "/updateFamilyMember/"+this.item.Id);
        },
        // 删除
        deleteChild(){
            this.$emit("clickDelete",this.item);
        },
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
</style>