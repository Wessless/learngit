<template>
    <div class="classManagementItem">
        <div class="headTitle">{{ item.PaymentName }}</div>
        <div class="title">ID：{{ item.ID }}</div>
        <div class="title">定价：{{ item.PaymentPrice }}</div>
        <div class="title">定价单位：{{ item.PaymentPriceUnit }}</div>
        <div class="title">说明：{{ item.Remark }}</div>
        <div class="title">特殊字段：{{ item.SpecialFeeType }}</div>
        <div class="title">退费方式：{{ item.RefundMethod }}</div>
        <!-- <div class="title" :title="item.Teacher">教师：{{ item.Teacher }}</div>
        <div class="title" :title="item.Assistant">助教：{{ item.Assistant }}</div>
        <div class="title" :title="item.Nursery">保育员：{{ item.Nursery }}</div> -->
        <div class="bottomBtns" v-show="flag=='0'">
            <div class="bottomBtn" @click="deleteClass">删除</div>
            <div class="bottomBtn" @click="changeClassInfo">修改</div>
        </div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'SetTuitionSubjectItem',
    props: {
        item:{
            type:Object
        },
        flag:{
            type:String,
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
        changeClassInfo(){
            this.$router.push(this.$route.fullPath+"/update/"+this.item.ID);
        },
        deleteClass(){
            this.$emit("clickDelete",this.item);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .classManagementItem{
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
.classManagementItem{
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