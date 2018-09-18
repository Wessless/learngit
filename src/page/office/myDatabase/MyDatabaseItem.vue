<template>
    <div class="myDatabaseItem">
        <div class="headTitle">{{ item.KnowledgeBaseName?item.KnowledgeBaseName:'&nbsp;' }}</div>
        <div class="title">ID：{{ item.KnowledgeBaseID }}</div>
        <div class="title">资料库个数：{{ item.ANum }}</div>
        <div class="title">创建者：{{ item.CreateUser }}</div>
        <div class="title">创建时间：{{ item.CreateDate }}</div>
        <div class="bottomBtns">
            <div class="bottomBtn" v-show="item.EnableSet=='1'" @click="deleteKnowledge">删除</div>
            <div class="bottomBtn" v-show="item.EnableSet=='1'" @click="setManager">权限管理+修改</div>
            <div class="bottomBtn" v-show="item.EnableModify=='1'" @click="detailKnowledge">维护</div>
            <div class="bottomBtn" v-show="item.EnableBrowse=='1'" @click="detailBrowse">检索</div>
        </div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'MyDatabaseItem',
    props: {
        item:{
            type:Object
        }
    },
    data(){
        return {
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
    },
    watch:{
    },
    methods:{
        ...mapMutations([
            'SET_KNOWLEDGEID',
            'SET_TREENODEID',
        ]),
        detailKnowledge(){
            this.SET_KNOWLEDGEID(this.item.KnowledgeBaseID);
            this.SET_TREENODEID({});
            this.$router.push(this.$route.fullPath+"/maintenance");
        },
        detailBrowse(){
            this.SET_KNOWLEDGEID(this.item.KnowledgeBaseID);
            this.SET_TREENODEID({});
            this.$router.push(this.$route.fullPath+"/browse");
        },
        setManager(){
            // this.$emit("setManager",this.item);
            this.$router.push(this.$route.fullPath+"/update/"+this.item.KnowledgeBaseID);
        },
        deleteKnowledge(){
            this.$emit("deleteKnowledge",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .myDatabaseItem{
    display: block;
    position: relative;
    width:310px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 10px;
    margin-right: 20px;
    margin-bottom: 20px;
} */
.myDatabaseItem{
    display: block;
    position: relative;
    justify-self: center;
    width: 94%;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 5px 10px 10px 10px;
    margin-right: 3%;
    margin-left: 3%;
    margin-bottom: 20px; 
    border:1px solid #ffffff;
}
.headTitle{
    font-size:20px;
    font-weight: 500;
}
.createDate{
    font-size: 14px;
    color: #999999;
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
.detail{
    position: absolute;
    right:30px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.giveMoney{
    position: absolute;
    right:80px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.bottomBtns{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    margin-top:5px;
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
</style>