<template>
    <div class="item" :class="{canclick:item.type=='folder'}" @click="routerTo(item.type,item.id)">
        <input type="checkbox" name="mycloud" v-model="item.selected" class="aui-checkbox" @click.stop="" v-bind:disabled="item.progress&&item.progress!=100">
        <div class="iconType iconfont" v-if="item.type=='file'">
            <img v-bind:src="imgPath">
        </div>
        <div class="iconType iconfont" v-else-if="item.type=='folder'">&#xe607;</div>
        <div class="progress" v-if="item.progress&&item.progress!=100"></div>
        <el-progress v-show="item.progress&&item.progress!=100" type="circle" :percentage="item.progress" :width="23" :stroke-width="2" :show-text="false"></el-progress>
        <span v-show="item.progress&&item.progress!=100" style="margin-left:5px;">{{item.progress}}%</span>
        <span class="name" style="margin-left: 10px">{{ item.name }}</span>
    </div>
</template>

<script>

export default {
    name: 'TableListItem',
    props:{
        item:{
            // default:false,
            type:Object
        }
    },
    data :function() {
        return {
        }
    },
    computed:{
        fileExt(){
            let names = this.item.name.split(".")
            if(this.item.type=='file'){
                return names[names.length-1]
            }else if(this.item.type=='folder'){
                return "";
            }
        },
        imgPath(){
            if(this.fileExt=="doc" || this.fileExt=="docx"){
                return "static/images/doc.png";
            }else if(this.fileExt=="xlsx" || this.fileExt=="xls"){
                return "static/images/xlsx.png";
            }else if(this.fileExt=="txt"){
                return "static/images/txt.png";
            }else if(this.fileExt=="mp3"){
                return "static/images/mp3.png";
            }else if(this.fileExt=="mp4"){
                return "static/images/mp4.png";
            }else if(this.fileExt=="jpg" || this.fileExt=="jpeg" || this.fileExt=="png" || this.fileExt=="bmp"){
                return "static/images/pic.png";
            }else if(this.fileExt=="pdf"){
                return "static/images/pdf.png";
            }else if(this.fileExt=="imageText"){
                return "static/images/imageText.png";
            }
            return "static/images/undefined.png";
        }
    },
    components:{
        
    },
    methods:{
        routerTo(type,route){
            if(type=="folder"){
                console.log(route);
                this.$router.push('/mainpage/cloudDisk/mydisk/'+route);
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.item{
    display: flex;
    align-items: center;
}
.item .name{
    margin-left: 10px;
    flex:1px;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.item .progress{
    margin-left: 10px;
    height: 0px;
}
.iconType{
    color:#38adff;
    font-size: 23px;
    margin-left:15px;
    display: flex;
    justify-content: center;
    align-items: center;
    width:27px;
    height: 27px;
    border-radius: 2px;
    overflow: hidden;
}
.iconType img{
    width: 100%;
    height: 100%;
}
.size{
    text-align: center;
    width: 100%;
}
.canclick{
    cursor: pointer;
}
</style>