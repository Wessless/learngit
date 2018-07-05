<template>
    <div class="templateItem" v-bind:class="{selected:item.selected}">
        <el-checkbox v-model="item.selected"></el-checkbox>
        <div class="headTitle" :title="item.TemplateName">{{item.TemplateName}}</div>
        <div class="title">模板ID：{{item.TemplateID}}</div>
        <!-- <div class="title" style="color:#FF9D00;">金额：{{money}}{{item.MoneyUnitName}}</div> -->
        <!-- <div class="title">模板名称：{{item.TemplateName}}</div> -->
        <div class="title">模板描述：{{item.TemplateDescription}}</div>
        <div class="detail" @click.stop="showDetail">详情</div>
        <div class="giveMoney" @click.stop="change">修改</div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'ExpensePaymentItem',
    props: {
        item:{
            type:Object
        }
    },
    data(){
        return {
            payType:{
                "0":"现金",
                "1":"支票",
                "2":"银行汇款",
                "3":"其他",
                "4":"汇票",
                "5":"虚拟账户",
            }
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
        money(){
            // return money(this.item.Money);
        }
    },
    watch:{
    },
    methods:{
        change(){
            let id = this.item.TemplateID;
            this.$router.push(this.$route.fullPath+"/update/"+id);
        },
        showDetail(){
            let id = this.item.TemplateID;
            this.$router.push(this.$route.fullPath+"/detail/"+id);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .templateItem{
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
.templateItem{
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
.selected{
    border:1px solid #38adff;
}
.headTitle{
    font-size:20px;
    font-weight: 500;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
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
    right:13px;
    top:5px;
    color: #38adff;
    cursor: pointer;
}
.giveMoney{
    position: absolute;
    right:63px;
    top:5px;
    color: #38adff;
    cursor: pointer;
}
.el-checkbox{
    margin:0;
}
</style>