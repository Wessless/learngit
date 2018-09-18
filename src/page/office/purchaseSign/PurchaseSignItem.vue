<template>
    <div class="PurchaseSignItem">
        <div class="headTitle">{{item.StaffName}}的采购申请</div>
        <div class="title">单号：{{item.ApplyID}}</div>
        <div class="title">批次号：{{item.SequenceNo}}</div>
        <div class="title">代申请人：{{item.StaffName}}</div>
        <div class="title">申请时间：{{item.ApplyDate}}</div>
        <div class="title">物品分类：{{item.GoodsSort}}</div>
        <div class="title">物品名称：{{item.GoodsName}}</div>
        <div class="title">数量：{{item.GoodsCount}}</div>
        <div class="title">估价：{{item.PossiblePrice}}</div>
        <div class="title" style="color:#e51c23;">状态：{{item.Status}}</div>
        <div class="title">最终签字人：{{item.signed}}</div>
        <div class="signPurchaseApply" @click.stop="signPurchaseApply">签字</div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'PurchaseSignItem',
    props: {
        item:{
            type:Object
        }
    },
    data(){
        return {
            // staffuser :{
            //     "name":"张三",
            //     "ChargeBillID":"86",
            //     "num":"12345678936985",
            //     "itemname":"测试机",
            //     "count":"1",
            //     "itemclasses":"台式机",
            //     "starttime":"2018-07-10 00:00", 
            //     "endtime":"2026-08-10 00:00" ,
            //     "state" : "待签字"
            // }
        }
    },
    components:{
    },
    mounted(){
    },
    computed:{
        
    },
    watch:{
    },
    methods:{
        signPurchaseApply(){
            let purchaseApplyID = this.item.ApplyID;
            this.$router.push(this.$route.fullPath+"/purchaseSign/signature/"+purchaseApplyID);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .PurchaseSignItem{
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
.PurchaseSignItem{
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
.signPurchaseApply{
    position: absolute;
    right:30px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
</style>