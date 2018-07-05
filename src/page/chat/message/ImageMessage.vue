<template>
    <div class="Message-img">
        <span class="Message-entry gallery" style="">
            <a>
                <img :src="imgPath" alt="" ref="img"/>
            </a>
        </span>
        <!-- <a href="item.imageUri" download>下载</a> -->
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
export default {
    name: 'ImageMessage',
    props:{
        isSend:{
            default:false,
            type:Boolean
        },
        message:{
            default:'',
            type:String
        }
    },
    data :function() {
        return {
            isAtAll:false,
            currCOSIP:""
        }
    },
    mounted() {
        // this.currCOSIP = this.userInfo.currCOSImgIP;
        // this.$refs.img.onerror = () => {
        //     this.currCOSIP = this.currCOSIP.replace("111.160.234.166:888","172.16.1.100:888");
        //     return "";
        // }
    },
    computed:{
        ...mapState([
            'userInfo',
            'currConversation'
        ]),
        imgPath(){
            var img = this.message.split("/COS")[1];
            if(img){
                return this.userInfo.currProxy+"COS"+img;
            }else{
                return this.message;
            }
            
        }
    },
    methods:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.Message-img{
    display: inline-block;
    background:#ffffff;
    max-width: 50%;
}
.Message-img img {
    border-radius: 5px;
    width:100%;
}
</style>