<template>
    <div class="proxyImg" v-bind:class="{widthAll:hasImg}">
        <img class="proxyImg" v-bind:class="{canclick:canBrowse}" @click="browserImage" :src="imgPath" :alt="alt" ref="img" >
        <!-- <el-dialog :visible.sync="dialogVisible" :fullscreen="true" :show-close="true">
            <div class="browser" @click="dialogVisible = false">
                <div><img class="browserImg" :src="imgPath" alt=""></div>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'

export default { 
    name: 'ImageProxy',
    props: {
        imagePath:{// 图片路径：../../data...
            type:String,
            default:""
        },
        hasImg:{// 没有图片的群组传false
            type:Boolean,
            default:true
        },
        alt:{
            type:String,
            default:""
        },
        canBrowse:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            imgSrc:"",
            currCOSIP:"",
            dialogVisible:false
        }
    },
    methods:{
        ...mapMutations([
            'SET_BROWSERIMG'
        ]),
        browserImage(){
            if(this.canBrowse){
                let imgUrl = this.imgPath;
                this.SET_BROWSERIMG({imgPath:imgUrl});
                // this.dialogVisible = true;
            }
        }
    },
    mounted() {
        this.currCOSIP = this.userInfo.currCOSImgIP;
        this.$refs.img.onerror = () => {
            this.currCOSIP = this.currCOSIP.replace("111.160.234.166:888","172.16.1.100:888");
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'currConversation'
        ]),
        imgAlt(){
            return "";
        },
        imgPath(){
            if(this.imagePath=="../../../Data/UPLOADFILES/ForumFaceImage/teacher_1_male.jpg"||this.imagePath=="../../../Data/UPLOADFILES/ForumFaceImage/teacher_1_female.jpg"){
                return "";
            }else{
                return this.imagePath.replace("../../../",this.currCOSIP+"COS"+this.userInfo.cosNum+"/");
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

.proxyImg{
    height: 100%;
    position: relative;
    display: block;
}

.proxyImg > img{
    min-width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}
.widthAll{
    width:100% !important;
}
.canclick{
    cursor: pointer;
}
/* .browser{
    width: 100%;
    height: 100%;
    position: relative;
}
.browserImg{
    max-width: 100%;
    margin: 0 auto;
    display: block;
} */
</style>