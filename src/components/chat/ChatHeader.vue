<template>
    <div class="box_hd">
        <div class="title_wrap">
            <a class="phone_return iconfont" v-show="showBack" @click="back()"><span class="backArrow">&#xe697;</span></a>
            <div class="title">
                <span class="title_name">{{ title }}</span>
            </div>
            <a class="editBtn" v-show="showRightBtn&&rightBtnType=='none'" href="javascript:void 0" @click="edit">{{ rightBtnTitle }}</a>
            <el-button class="title-btn" v-show="showRightBtn&&rightBtnType=='btn'" type="primary" size="small" @click="edit">{{ rightBtnTitle }}</el-button>
            <!-- <a class="editBtn" href="javascript:void 0" v-show="!editable" @click="edit">编辑</a>
            <a class="editBtn" href="javascript:void 0" v-show="editable" @click="save">保存</a> -->
        </div>
    </div>
</template>

<script>

export default { 
    name: 'ChatHeader',
    props: {
        showBack:{
            type:Boolean,
            default:false
        },
        title:{
            type:String,
            default:""
        },
        showRightBtn:{
            type:Boolean,
            default:false
        },
        rightBtnTitle:{
            type:String,
            default:""
        },
        rightBtnName:{
            type:String,
            default:""
        },
        rightBtnType:{
            type:String,
            default:"none"
        }
    },
    data() {
        return {
            
        }
    },
    methods:{
        back(){
            window.history.go(-1)
        },
        edit(){
            this.$emit(this.rightBtnName,"");
        }
    },
    mounted() {
        
    },
    watch:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

/* 头部样式 */
.box_hd {
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    line-height: 30px;
    background: #fff;
    box-shadow: 2px 2px 2px #f5f7fa;
    height: 54px;
    overflow: hidden;
    z-index: 9;
    margin-left:384px;
}

.box_hd .title_wrap {
    position: relative;
    padding: 10px 0;
    margin: 0 19px;
    z-index: 10
}
.phone_return {
    position: absolute;
    color: #0099ff;
    /*top: 14px;*/
    left: -3px;
    font-size: 16px;
    /*background: url(../../static/images/icons.png) 1px -180px/86px auto no-repeat;*/
    /*background: url(../../static/images/leftArrow.png) 0px 3px/10px auto no-repeat;*/
    /*text-indent: 20px;*/
    height: 34px;
    line-height: 34px;
}
.phone_return:hover, .phone_return:active,.phone_return:focus {
     color: #0994f1;
}
.editBtn {
    position: absolute;
    color: #0099ff;
    /*top: 14px;*/
    right: -3px;
    font-size: 12px;
    height: 34px;
    line-height: 34px;
}
.editBtn:hover, .editBtn:active,.editBtn:focus {
    color: #0994f1;
}

.box_hd .title {
    font-weight: 400;
    height: 34px;
    display: inline-block;
    font-size: 14px;
    position: absolute;
    left:50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
}

.box_hd .title .title_name {
    display: inline-block;
    vertical-align: middle;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    text-decoration: none;
    color: #000;
    font-weight: 400;
    font-size: 15px;
}
.box_hd .title .title_name.chat_title:hover{
  color: #0099ff;
}

.backArrow{
    vertical-align: 1px;
    padding: 0 5px 0 0;
    font-size: 30px; 
}
.title-btn{
    float: right;
}
</style>