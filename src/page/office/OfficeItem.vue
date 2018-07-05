<template>
    <div class="chatList" v-bind:class="{selected:$route.params.id==isCurrentConversation}" @click="showCloudDisk">
        <div class="chat_item online slide-left">
            <div class="photo">
                <!-- <img class="img" v-show="imgSrc" :src="imgSrc" alt=""> imgUrl-->
                <!-- <div class="portrait iconfont" v-show="imagePath=='&#xe83c;'">&#xe83c;</div>
                <div class="portrait iconfont" v-show="imagePath=='&#xe6a2;'" style="font-size: 27px;">&#xe6a2;</div> -->
                <div class="portrait iconfont" v-show="item.imgUrl" :style="item.styleObj"><img :src="item.imgUrl" alt=""></div>
                <i class="Presence Presence--stacked Presence--mainBox" v-show="false"></i>
            </div>
            <div class="info">
                <h3 class="nickname">
                    <span class="nickname_text">{{title}}</span>
                </h3>
                <p class="msg ng-scope" v-show="content">
                    <!-- // <span ng-if="conversation.unReadNum>0" class="ng-binding ng-scope">[{{conversation.unReadNum}}条未读]</span> -->
                    <span class="at_show" v-show="conversation.atStr">{{conversation.atStr}}</span>
                    <span class="ng-binding" v-html="content"></span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { _format } from '@/config/utils';
import { mapState,mapMutations } from 'vuex'


export default {
    name: 'OfficeItem',
    props: {
        item:{
            type:Object
        }
    },
    data :function() {
        return {
            conversation:{
                atStr:""
            }
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'currConversation'
        ]),
        title(){
            return this.item.title;
        },
        imgSrc(){
            return "";
        },
        isCurrentConversation(){
            
            return this.item.name;
        },
        content(){
            return this.item.content;
        },
        imagePath(){
            return this.item.imagePath;
        }
    },
    mounted(){
        
    },
    components: {
    },
    methods:{
        ...mapMutations([
            'SET_CURRCONVERSATION',
            'SET_CURRFRIENDLIST',
        ]),
        showCloudDisk(){
            this.$router.push(this.item.url);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/**/ 
.chat_item {
    overflow: hidden;
    /*padding: 12px 18px 11px;*/
    padding: 8px 18px 7px;
    border-bottom: 1px solid #e1e9f1;
    cursor: pointer;
    position: relative;
}

.chat_item p {
    margin: 0;
}

.chat_item.online {
    opacity: 1;
    display: flex;
}

.chat_item.offline {
    opacity: .3;
}

.chat_item .photo {
    float: left;
    margin-right: 10px;
    position: relative;
    display: flex;
}

.chat_item .photo .img {
    display: block;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
}

.Presence--mainBox {
    left: 2px;
    top: 0px;
    border-color: #f4f8fc;
}



.chat_item .info {
    overflow: hidden;
    flex:1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.chat_item .info .nickname {
    font-weight: 400;
    font-size: 16px;
    color: #000;
    line-height: 20px;
    margin: 0;
}

.chat_item .info .nickname_text {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: top;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal
}

.chat_item .info .nickname_count {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: top
}

.chat_item .info .msg {
    color: #8e969f;
    font-size: 14px;
    width: 100%;
    /*overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    height: 1.5em*/
    /* display: -webkit-box; */
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    word-wrap:normal;
    padding-top:3px;
    /* -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; */
    height: 26px;/*IE*/
}

/*  */ 
.chatList .portrait{
  height: 45px;
  width: 45px;
  font-size: 24px;
  line-height: 45px;
  text-align: center;
  background: #38adff;
}
.chatList .portrait img{
  height: 100%;
  width: 100%;
}
.chatList:hover {
    background: #ebf2f7;
}
.chatList.selected {
    background: #dde7f0;
}
.chatList .timeBoundary{
    margin-left:5px ;
}

.chatList .badge{
    float: left;
    background-color:#0099ff ;
    font-weight:normal;
}
.chatList .timer{
    color: #8e969f;
    position: absolute;
    right: 0;
    white-space: nowrap;
    margin-top:0px !important;
}

.nickname .nickname_text{
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.chat_item .attr span{
    display: inline-block;
    float: none !important;
    /* position: absolute;
    right: 0;
    white-space: nowrap; */
}
/*             有人at         */
.chat_item .info .msg .at_show{
    color: #cc3333;
}

</style>