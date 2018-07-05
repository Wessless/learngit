<template>
    <div class="Message-audio" v-bind:class="{'Send-Message-audio':isSend}">
        <span class="Message-entry">
            <!-- <span class="audioBox clearfix " ng-class="{\'animate\':isplaying}" ng-click="play()"><i></i><i></i><i></i></span> -->
            <span class="audioBox clearfix"  v-bind:class="{'animate':isplaying,'Send-audioBox':isSend}" @click="play"><i></i><i></i><i></i><i></i></span>
        </span>
        <span class="audioTimer">{{duration}}”</span>
        <span class="audioState" v-show="isUnReade"></span>
        <!-- <audio :src="'data:audio/3gp;base64,'+message" controls="controls" autoplay >
            Your browser does not support the audio element.
        </audio> -->
        <!-- 
            awb wav x-wav
        -->
    </div>
</template>

<script>

export default {
    name: 'VoiceMessage',
    props:{
        isSend:{
            default:false,
            type:Boolean
        },
        message:{
            default:'',
            type:String
        },
        duration:{
            default:0,
            type:Number
        }
    },
    data :function() {
        return {
            isplaying:false,
            isUnReade:true,
            item:{
                
                // duration:0,
            },
            RongIMVoice:null
        }
    },
    mounted(){
        
    },
    components:{
        
    },
    methods:{
        play(){
            let voice = this.message;
            let RongIMVoice = RongIMLib.RongIMVoice;
            if(voice){
                var duration = this.duration;    // 音频持续大概时间(秒)
                if(!!window.ActiveXObject || "ActiveXObject" in window){
                    //如果是 IE 浏览器
                    RongIMVoice.preLoaded(voice);
                    RongIMVoice.play(voice,duration);
                    this.isUnReade = false;
                    this.isplaying = true;
                    setTimeout(() => {
                        this.isplaying = false;
                    },duration*1000);
                }else{
                    RongIMVoice.preLoaded(voice, ()=>{
                        RongIMVoice.play(voice,duration);
                        this.isUnReade = false;
                        this.isplaying = true;
                        setTimeout(() => {
                            this.isplaying = false;
                        },duration*1000);
                    });
                }
            }else{
                console.error('请传入 amr 格式的 base64 音频文件');
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* 语音消息 */
.Message-audio{
    display: flex;
    flex-direction: row;
}
.Message-audio .Message-entry{
    overflow:hidden;
}
.Message-audio .audioBox {
    display: inline-block;
    /* background: url(../../../img/audioBg.png) 0 0/170px auto no-repeat; */
    background:#ffffff;
    border: 1px solid #b9c1ca;
    border-radius: 5px;
    width: 165px;
    height: 36px;
    padding: 3px 0 3px 15px;
}

.Message-audio .audioBox i{
    float: left;
    display: inline-block;
    width: 4px;
    height: 26px;
    opacity: 1;
    -webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -ms-transition: all 1s ease;
    -o-transition: all 1s ease;
    transition: all 1s ease;
}

.Send-Message-audio{
    display: flex;
    flex-direction: row-reverse;
}
.Send-audioBox{
    background:#97D4FF !important;
    border: 1px solid #97D4FF !important;
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); 	    /* IE 9 */
    -moz-transform:rotate(180deg); 	    /* Firefox */
    -webkit-transform:rotate(180deg);   /* Safari 和 Chrome */
    -o-transform:rotate(180deg); 	    /* Opera */
}

.Message-audio .audioBox i:nth-child(1){
    background: url(../../../img/audioBg.png) 0px -40px/170px auto no-repeat;
}
.Message-audio .audioBox i:nth-child(2){
    background: url(../../../img/audioBg.png) -7px -40px/170px auto no-repeat;
}
.Message-audio .audioBox i:nth-child(3){
    background: url(../../../img/audioBg.png) -14px -40px/170px auto no-repeat;
}

.Message-audio .audioBox.animate i:nth-child(2){
    animation: audioAnimate 1.5s ease-in-out infinite ;
}
.Message-audio .audioBox.animate i:nth-child(3){
    animation: audioAnimate2 1.5s ease-in-out infinite ;
}
.public-Message .Message-audio .audioBox.animate i:nth-child(4){
    animation: audioAnimate3 1.5s ease-in-out infinite ;
}

@keyframes audioAnimate
{
    0% ,19%{  opacity: 0;  }
    20% ,100%{  opacity: 1;  }
}
@keyframes audioAnimate2
{
    0% ,39%{  opacity: 0;  }
    40% ,100%{  opacity: 1;  }
}
@keyframes audioAnimate3
{
    0% ,59%{  opacity: 0;  }
    60% ,100%{  opacity: 1;  }
}
#Messages .Message-audio .audioTimer{
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
    color: #8e969f;
}
#Messages .Message-audio .audioState{
    width: 10px;
    height: 10px;
    display: inline-block;
    background-color: #ff7373;
    margin-top: 13px;
    border-radius: 5px;
}
</style>