<template>
    <div v-show="isShow" class="noData">
        <el-alert
            :title="content"
            type="info"
            center
            :closable="false">   
        </el-alert>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
// import { money } from '@/config/utils'

export default {
    name: 'NoData',
    props: {
        isShow:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            content:"暂无数据"
        }
    },
    components:{
    },
    mounted(){
        
    },
    watch:{
    },
    computed:{
        // scrollTop(){
        //     return document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset
        // }
    },
    methods:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.noData{
    width:100%;
}
</style>