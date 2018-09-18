<template>
    <div class="PurchaseInstorageItem">
        <div class="headTitle">{{item.RegisterID}}的入库信息</div>
        <div class="title">ID：{{item.GoodsID}}</div>
        <div class="title">固定资产编号：{{item.assets}}</div>
        <div class="title">物品名称：{{item.GoodsName}}</div>
        <div class="title">部门：{{item.department}}</div>
        <div class="title">位置：{{item.location}}</div>
        <div class="title">价格：{{item.free}}</div>
        <div class="title">物品总数：{{item.Sum}}</div>
        <div class="title">采购日期：{{item.RegistTime}}</div>
        <div class="deletePurchaseApply" v-show="$route.meta.type!='purchaseFindEdit'" @click.stop="deletePurchaseApply">删除</div>
        <div class="changePurchaseApply" v-show="$route.meta.type!='purchaseFindEdit'" @click.stop="changePurchaseApply">修改</div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'PurchaseInstorageItem',
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
        changePurchaseApply(){
            let Id = this.item.GoodsID;
            this.$router.push(this.$route.fullPath+"/update/"+Id);
        },
        deletePurchaseApply(){
            this.$emit("clickDelete",this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .PurchaseInstorageItem{
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
.PurchaseInstorageItem{
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
.deletePurchaseApply{
    position: absolute;
    right:30px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.changePurchaseApply{
    position: absolute;
    right:80px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
</style>