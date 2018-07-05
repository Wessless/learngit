<template>
    <div class="Message-text" v-bind:class="{'Send-Message-text':isSend}">
        <pre class="at_all_people" v-show="isAtAll">{{ $t("message.textMessage.atAll") }}</pre>
        <pre class="Message-entry ng-binding" v-html="textMessage"></pre>
        <br>
    </div>
</template>

<script>

export default {
    name: 'TextMessage',
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
        }
    },
    computed:{
        textMessage(){
            return RongIMLib.RongIMEmoji.symbolToHTML(this.message);
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

.Message-text, .file-text {
    position: relative;
    display: flex;
    max-width: 70%;
    border: 1px solid #b9c1ca;
    border-radius: 5px;
    padding: 6px 8px;
    background: #ffffff;
}

.Send-Message-text{
    border: 1px solid #38ADFF;
    background: #38ADFF;
    color: #ffffff !important;
}

.Message-text pre {
    font-size: 14px;
    line-height: 26px;
    color: rgb(68, 68, 68);
    word-break: break-all;
    word-wrap: break-word;
    background-color: transparent;
    border: none;
    border-radius: 0;
    font-family: "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    white-space: pre-wrap;
}


.Send-Message-text pre {
    color: #ffffff;
}

.Message-entry {
    display: inline-block;
    max-width: 100%;
}

.Message-entry p {
    margin-bottom: 5px;
}

.Message-entry a {
    text-decoration: none;
}
.at_all_people{
    display: inline-block;
}
</style>