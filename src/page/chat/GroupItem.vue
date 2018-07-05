<template>
    <div class="notice_item" @click="showFriendListInfo">
        <div class="photo">
            <!-- <img class="img" v-show="imgSrc" :src="imgSrc" alt=""> -->
            <div class="img" v-show="imgSrc"><image-proxy :imagePath="item.Portraiturl"></image-proxy></div>
            <div class="portrait" v-show="!imgSrc">
                <!-- <div class="threeIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div>
                <div class="threeIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div>
                <div class="threeIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div> -->
                <!-- <div class="fourIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div>
                <div class="fourIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div>
                <div class="fourIcon allIcon" odd-even="1" data-sex="1"><div>张</div></div> -->
                <div class="allIcon" v-bind:class="{threeIcon:(staffArray.length==3),fourIcon:(staffArray.length==4)}" v-for="imgItem in staffArray" :key="imgItem.StaffID" v-bind:odd-even="imgItem.StaffID%2==0?1:0" v-bind:data-sex="imgItem.Sex">
                    <div v-show="!imgItem.ImagePath">{{ imgItem.StaffName.substring(imgItem.StaffName.length-1,imgItem.StaffName.length) }}</div>
                    <span v-if="imgItem.ImagePath"><div class="image"><image-proxy :imagePath="imgItem.ImagePath" :hasImg="false"></image-proxy></div></span>
                </div>
            </div>
        </div>
        <div class="info">
            <h3 class="nickname">
                <span class="nickname_text">{{name}}</span>
            </h3>
        </div>
        <div class="botDivider"></div>
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import imageProxy from '@/components/chat/ImageProxy'

export default {
    name: 'GroupItem',
    props: ['item','friendList'],
    data :function() {
        return {
        }
    },
    mounted(){
        
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
        firstchar(){
            return this.item.GroupName[0];
        },
        name(){
            return this.item.GroupName;
        },
        imgSrc(){
            return this.item.Portraiturl.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/");
        },
        staffArray(){
            if(this.item.Staffs){
                let staffs = this.item.Staffs.split(",");
                let allStaffs = this.friendList;
                let staffArray = [];
                for(let i=0;i<staffs.length;i++){
                    for(let j=0;j<allStaffs.length;j++){
                        if(staffs[i].split("_")[1] == allStaffs[j].StaffID && staffArray.length<4){
                            staffArray.push(allStaffs[j]);
                        }
                    }
                }
                return staffArray;
            }else{
                return [];
            }
        }
    },
    methods:{
        ...mapMutations([
            'SET_CURRCONVERSATION',
            'SET_CURRFRIENDLIST',
        ]),
        showFriendListInfo(){
            // 隐藏消息组件
            this.SET_CURRCONVERSATION(null);
            // 隐藏员工（群组）信息组件
            this.SET_CURRFRIENDLIST({type:"group",data:this.item,friendList:this.friendList});
            // 路由跳转到员工信息路由
            this.$router.push('/mainpage/friendList/groupInfo');
        }
    },
    components:{
        imageProxy
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.portrait{
  height: 45px;
  width: 45px;
  font-size: 20px;
  /* line-height: 35px; */
}
.notice_item, .members_item {
    /*overflow: hidden;*/
    padding: 8px 12px;
    cursor: pointer;
    position: relative;
    display: flex;
}

.notice_item .photo, .members_item .photo {
    float: left;
    margin-right: 10px;
    position: relative;
    display: flex;
}

.notice_item .photo .img, .members_item .photo .img {
    display: block;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    overflow: hidden;
}

.notice_item .info, .members_item .info{
    /* padding-bottom: 8px; */
    line-height: 45px;
}
.notice_item .info span, .members_item .info span {
    height: 45px;
    line-height: 45px;
    font-weight: normal;
}
.nickname{
    display: flex;
}
.nickname .nickname_text{
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
    width: 245px;
}
/* 群组头像 */	
.threeIcon{
    width:50%;
    box-sizing: border-box;
    float: left; 
    position:relative;
    color:#FFFFFF;
    font-size: 10px;
    overflow:hidden;
    background-repeat: no-repeat;
    position: relative;
}
/*.threeIcon > img{
    position:relative;
    z-index:3;
    height:100%;
}*/
.threeIcon > div{
    position:absolute;
    text-align:center;
    width:12px;
    height:12px;
    line-height:12px;
}
.threeIcon:nth-child(1){
    border-right:1px solid #FFFFFF;
    height: 100%;
    background-size: 100% 100%;
}
.threeIcon:nth-child(1) > div{
    top:16px;
    right:3px;
}
.threeIcon:nth-child(2){
    border-left:1px solid #FFFFFF;
    border-bottom:1px solid #FFFFFF;
    height: 50%;
    background-size:50% 50%;
}
.threeIcon:nth-child(2) > div{
    bottom:3px;
    left:3px;
}
.threeIcon:nth-child(3){
    border-left:1px solid #FFFFFF;
    border-top:1px solid #FFFFFF;
    height: 50%;
    background-size:50% 50%;
}
.threeIcon:nth-child(3) > div{
    top:3px;
    left:3px;
}
.fourIcon{
    height:50%;
    width:50%;
    box-sizing: border-box;
    float: left;
    position:relative;
    color:#FFFFFF;
    font-size: 12px;
    overflow:hidden;
    background-repeat: no-repeat;
    background-size:50% 50%;
}
/*.fourIcon > img{
    position:relative;
    z-index:3;
    width:100%;
    height:100%;
}*/
.fourIcon > div{
    position:absolute;
    text-align:center;
    width:12px;
    height:12px;
    line-height:12px;
}
.fourIcon:nth-child(1){
    border-right:1px solid #FFFFFF;
    border-bottom:1px solid #FFFFFF;
}
.fourIcon:nth-child(1) > div{
    bottom:3px;
    right:3px;
}
.fourIcon:nth-child(2){
    border-left:1px solid #FFFFFF;
    border-bottom:1px solid #FFFFFF;
}
.fourIcon:nth-child(2) > div{
    bottom:3px;
    left:3px;
}
.fourIcon:nth-child(3){
    border-right:1px solid #FFFFFF;
    border-top:1px solid #FFFFFF;
}
.fourIcon:nth-child(3) > div{
    top:3px;
    right:3px;
}
.fourIcon:nth-child(4){
    border-left:1px solid #FFFFFF;
    border-top:1px solid #FFFFFF;
}
.fourIcon:nth-child(4) > div{
    top:3px;
    left:3px;
}	
.allIcon[odd-even='0'][data-sex='1']{
    background: #6BB5CE;
}
.allIcon[odd-even='0'][data-sex='0']{
    background: #FF943E;
}
.allIcon[odd-even='1'][data-sex='1']{
    background: #78C06E;
}
.allIcon[odd-even='1'][data-sex='0']{
    background: #F65E5E;
}
.allIcon span{
    display: block;
    width: 100%;
    height: 100%;
}
.allIcon span .image{
    height: 100%;
    min-width: 100%;
    position: relative;
    display: block;
}
</style>