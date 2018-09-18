<template>
    <div class="applyFindItem">
        <div class="headTitle">{{item.StaffName}}的采购申请</div>
        <div class="title">单号：{{item.ApplyID}}</div>
        <div class="title">代申请人：{{item.StaffName}}</div>
        <div class="title">申请时间：{{item.ApplyDate}}</div>
        <div class="title">申请人：{{item.ActualName}}</div>
        <div class="title">所在部门：{{item.ActualDepartment}}</div>
        <div class="title">物品名称：{{item.GoodsName}}</div>
        <div class="title">数量：{{item.GoodsCount}}</div>
        <div class="title">状态：{{item.Status}}</div>
        <div class="title">最终签字人：{{item.signed}}</div>
        <div class="title">签字通过时间：{{item.signedTime.split(" ")[0]}}</div>
        <div class="purchaseInformation" @click.stop="purchaseInformation">采购信息</div>
        <div class="instorageInformation" @click.stop="instorageInformation">入库信息</div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
// import { mapState, mapMutations } from 'vuex'

export default {
    name: 'applyFindItem',
    props: {
        item:{
            type:Object
        }
    },
    data(){
        return {
            staffuser :{
                "name":"张三",
                "ChargeBillID":"86",
                "num":"12345678936985",
                "itemname":"测试机",
                "count":"1",
                "itemclasses":"台式机",
                "starttime":"2018-07-10 00:00", 
                "endtime":"2026-08-10 00:00" ,
                "state" : "待签字"
            }
        }
    },
    components:{
    },
    mounted(){
    },
    watch:{
    },
    methods:{
        purchaseInformation(){
            let receiveApplyID = this.item.ApplyID;
            this.$router.push(this.$route.fullPath+"/enter/"+receiveApplyID);
        },
        instorageInformation(){
            let receiveApplyID = this.item.ApplyID;
            this.$router.push(this.$route.fullPath+"/edit/"+receiveApplyID);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .applyFindItem{
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
.applyFindItem{
    display: block;
    position: relative;
    justify-self: center;
    width: 94%;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 5px 10px 25px 10px;
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
.purchaseInformation{
    position: absolute;
    right:83px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.instorageInformation{
    position: absolute;
    right:13px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
</style>