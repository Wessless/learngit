<template>
    <div class="interestClass">
        <div class="headTitle">{{ item.ChildID }}</div>
        <div class="title">ID:{{ item.ID }}</div>
        <div class="title">设定时间：{{ item.CreateDate }}</div>
        <div class="title">设定人：{{ item.CreateID }}</div>
        <div class="title">缴费金额：{{ item.PaymentNums }}</div>
        <div class="title" :title="item.Remark">备注：{{ item.Remark }}</div>
        <div class="bottomBtns">
            <!-- <div class="bottomBtn" @click.stop="buildReceipt">生成收据</div> -->
            <div class="bottomBtn" @click.stop="haveCharge">人工收费</div>
            <!-- <div class="bottomBtn" @click.stop="examineFees">查看明细</div> -->
        </div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'InterestClassManageItem',
    props: {
        item:{
            type:Object
        },
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
        // 查看明细
        // examineFees(){
        //     let classID = this.item.ID
        //     this.$router.push(this.$route.fullPath+"/update/"+classID);
        // },
        // 生成收据
        // buildReceipt(){
        //     this.$emit("clickBuild",this.item);
        // },
        //人工收费
        haveCharge(){
            this.$emit("clickCharge",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .interestClass{
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
.interestClass{
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
.title{
    /* width:49%; */
    display: block;
    color: #999999;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.edit{
    color: #38adff;
    font-weight: normal;
    cursor: pointer;
}
.bottomBtns{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    margin-top: 5px;
    height: 15px;
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
</style>