<template>
    <div class="members_item" @click="showFriendListInfo">
        <div class="photo">
            <!-- <img class="img" v-show="imgSrc" :src="imgSrc" alt=""> -->
            <div class="img" v-show="imgSrc"><image-proxy :imagePath="item.ImagePath"></image-proxy></div>
            <div class="portrait" v-show="!imgSrc" :odd-even="staffID%2" :data-sex="sex">{{firstchar}}</div>
        </div>
        <div class="info">
            <h3 class="nickname">
                <span class="nickname_text">{{staffName}}</span>
            </h3>
        </div>
        <div class="botDivider"></div>
        <!-- // <i class="Presence Presence--members online"></i> -->
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import imageProxy from '@/components/chat/ImageProxy'

export default {
    name: 'FriendItem',
    props: ['item'],
    data :function() {
        return {
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
        ]),
        firstchar(){
            let userName = this.item.StaffName;
            return userName.substr(userName.length-2<0?0:userName.length-2,userName.length);
        },
        imgSrc(){
            return this.item.ImagePath.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/");
        },
        staffID(){
            return this.item.StaffID;
        },
        staffName(){
            return this.item.StaffName;
        },
        sex(){
            return this.item.Sex;
        },
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
            this.SET_CURRFRIENDLIST({type:"staff",data:this.item});
            // 路由跳转到员工信息路由
            this.$router.push('/mainpage/friendList/staffInfo');
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.portrait{
  height: 45px;
  width: 45px;
  font-size: 14px;
  line-height: 45px;
}
.notice_item, .members_item {
    /*overflow: hidden;*/
    padding: 8px 12px;
    cursor: pointer;
    position: relative;
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
.Presence--members.online {
    position: absolute;
    top: 25px;
    right: 18px;
    width: 10px;
    height: 10px;
}

.Presence--members.offline {
    position: absolute;
    top: 25px;
    right: 18px;
    width: 10px;
    height: 10px;
    background-color: #b3b3b3;
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

</style>