<template>
    <div class="applyInstorageItem">
        <div class="headTitle">{{item.StaffName}}的申领申请</div>
        <div class="title">单号：{{item.ApplyID}}</div>
        <div class="title">申领人：{{item.StaffName}}</div>
        <div class="title">固定资产编号：{{item.StabilizeAssetsNum}}</div>
        <div class="title">物品名称：{{item.GoodsName}}</div>
        <div class="title">申领数量：{{item.applyCount}}</div>
        <div class="title">物品分类：{{item.GoodsSortName}}</div>
        <div class="title">开始时间：{{item.BeginDate}}</div>
        <div class="title">结束时间：{{item.EndDate}}</div>
        <div class="title">最终签字人：{{item.Singer}}</div>
        <div class="title">签字通过时间：{{item.SignedTime}}</div>
        <div class="title">出库员：{{item.Storager}}</div>
        <div class="examineReceiveApply" @click.stop="examineReceiveApply">查看</div>
        <div class="inStorage" @click.stop="inStorage">归还</div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
// import { mapState, mapMutations } from 'vuex'

export default {
    name: 'applyInstorageItem',
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
    watch:{
    },
    methods:{
        examineReceiveApply(){
            let receiveApplyID = this.item.ApplyID;
            this.$router.push(this.$route.fullPath+"/applyInstorage/examine/"+receiveApplyID);
        },
        inStorage(){
            this.$emit("clickInStorage",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .applyInstorageItem{
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
.applyInstorageItem{
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
.inStorage{
    position: absolute;
    right:30px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.examineReceiveApply{
    position: absolute;
    right:80px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
</style>