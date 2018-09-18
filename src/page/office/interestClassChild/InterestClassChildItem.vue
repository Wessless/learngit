<template>
    <div class="childItem" :class="{isSelect:item.selected}">
        <div class="headTitle">{{ item.ChildName }}
            <span class="sex iconfont" v-if="sex=='1'" style="color:#f817a6">&#xe72c;</span>
            <span class="sex iconfont" v-if="sex=='0'" style="color:#38adff">&#xe72b;</span>
        </div>
        <div class="title">学号：{{ item.ChildNum }}</div>
        <div class="title">所在班级：{{ item.ClassName }}</div>
        <div class="title">入班日期：{{ item.InDate }}</div>
        <div class="title">退班日期：{{ item.OutDate }}</div>
        <div class="bottomBtns">
            <div class="bottomBtn" @click.stop="deleteChild">删除</div>
            <div class="bottomBtn" @click.stop="changeChild">修改</div>
            <div class="bottomBtn" @click.stop="quitClass" v-show="item.OutDate==''">中途退班</div>
        </div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'InterertClassChildItem',
    props: {
        item:{
            type:Object
        },
        iClassID:{
            type:String
        }
    },
    data(){
        return {
            // childName:"川宝宝",
            // childNumber:"170419",
            // className:"已离园",
            // enterClassTime:"2017-09-11",
            // leaveClassTime:"",
        }
    },
    components:{
    },
    mounted(){
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        sex(){
            if(this.item.ChildSex=="0"){
                // return "男";
                return '0';
            }else{
                // return "女";
                return '1';
            }
        },
    },
    watch:{
    },
    methods:{
        // 修改
        changeChild(){
            let ID = this.item.ID+"&"+this.iClassID;
            this.$router.push(this.$route.fullPath+"/update/"+ID);
        },
        // 删除
        deleteChild(){
            // this.$emit("clickDelete",this.item);
            this.$emit("clickDelete",this.item);
        },
        quitClass(){
            this.$emit("clickQuit",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .childItem{
    display: block;
    position: relative;
    width:310px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 5px 10px 10px 10px;
    margin-right: 20px;
    margin-bottom: 20px;
    border:1px solid #ffffff;
} */
.childItem{
    display: block;
    position: relative;
    justify-self: center;
    width: 94%;
    background-color: #fff;
    border-radius: 6px;
    border:1px solid #999;
    /* box-shadow: 0 4px 8px rgba(0,0,0,.12); */
    padding: 15px 10px 25px 10px;
    margin: 20px 3% 20px 3%;
}
.headTitle{
    /* padding-left: 10px; */
    font-size:18px;
    font-weight: 500;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    text-align:center;
    margin-bottom: 10px;
}
.title{
    /* width:49%; */
    display: block;
    color: #999999;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.bottomBtns{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    height: 0px;
    transform: translateY(-5px);
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
</style>