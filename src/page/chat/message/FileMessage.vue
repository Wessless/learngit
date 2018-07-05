<template>
    <div class="upload_file">
        <div class="out_border">
            <div class="file_type fl">
                <img v-bind:src="imgPath">
            </div>
            <div class="file_name fl">
                <p class="p1">{{fileName}}.{{fileExt}}</p>
                <p class="p2">{{fileSize}}</p>
                <div class="up_process" v-show="false"><div></div></div>
            </div>
            <a v-bind:href="fileUrl" v-bind:download="fileUrl">
                <!-- <div class="file_btn fr" ng-click="Download()"> -->
                <div class="file_btn fr"></div>
            </a>
            <div v-show="false" class="file_btn_close fr" ng-click="Cancel()"></div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'FileMessage',
    props:{
        isSend:{
            default:false,
            type:Boolean
        },
        fileName:{
            default:"",
            type:String
        },
        fileExt:{
            default:"",
            type:String
        },
        fileSize:{
            default:"",
            type:String
        },
        fileUrl:{
            default:"",
            type:String
        },
    },
    data :function() {
        return {
        }
    },
    computed:{
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
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* 文件样式 */ 
#Messages .upload_file .out_border{
    border:1px solid #b9c1ca;
    border-radius: 5px;
    overflow: hidden;
    width: 268px;
    padding: 8px;
    background:#ffffff;
}
.fl{
    float: left;
}
.fr{
    float: right;
}
#Messages .upload_file .out_border .file_type img{
    display: block;
    width: 52px;
    height: 52px;
    margin-right: 9px;

}
#Messages .upload_file .out_border .file_name p.p1{
    font-size: 14px;
    color: #343434;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    max-width: 150px;
}
#Messages .upload_file .out_border .file_name p.p2{
    font-size: 12px;
    color: #8e969f;
    line-height: 14px;
    text-overflow:ellipsis;
    white-space: nowrap;
    max-width: 150px;
}
#Messages .upload_file .out_border .file_name .up_process{
    width: 140px;
    height: 3px;
    background: #dfdfdf;
    border-radius: 2px;
    margin-top: 8px;
}
#Messages .upload_file .out_border .file_name .up_process div{
    width: 0;
    height: 3px;
    background: #0099ff;
    border-radius: 2px;
}
#Messages .upload_file .out_border .file_btn{
    width: 31px;
    height: 31px;
    background: url(../../../img/uploadbtn.png) no-repeat;
    background-size: 62px 62px;
    background-position: 0px -31px;
    margin-top: 10px;
    margin-right: 5px;
}
#Messages .upload_file .out_border .file_btn:hover{
    background-position: -31px -31px;
}
#Messages .upload_file .out_border .file_btn_close{
    width: 31px;
    height: 31px;
    background: url(../../../img/uploadbtn.png) no-repeat;
    background-size: 62px 62px;
    background-position: 0px 0px;
    margin-top: 10px;
    margin-right: 5px;
}
#Messages .upload_file .out_border .file_btn_close:hover{
    background-position: -31px 0px;
}
.MessageForm-tool i.file_shot {
    background: url(../../../img/icons.png) 0 -672px/100px auto no-repeat;
}
.MessageForm-tool i.file_shot:hover {
    background: url(../../../img/icons.png) -60px -672px/100px auto no-repeat;
}
</style>