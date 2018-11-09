<template>
    <div class="PointsClassifyItem">
        <div class="headTitle" :title="item.TypeName">{{item.TypeName}}</div>
        <div class="title">计分类型：{{item.Type}}</div>
        <div class="update" @click.stop="updateDetail">修改</div>
        <div class="delete" @click.stop="deleteClassify">删除</div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
// import {  } from '@/config/utils'

export default {
    name: 'PointsClassifyItem',
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
        deleteClassify(){
            this.$emit("clickDelete",this.item);
        },
        updateDetail(){
            let classifyID = this.item.ID;
            this.$router.push(this.$route.fullPath+"/update/"+classifyID);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .PointsClassifyItem{
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
.PointsClassifyItem{
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
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    padding-right: 74px;
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
.update{
    position: absolute;
    right:70px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.delete{
    position: absolute;
    right:20px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
</style>