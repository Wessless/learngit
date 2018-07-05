<template>
    <div class="scrollToTop iconfont" v-show="show" @click="scrollToTop">&#xe738;</div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
// import { money } from '@/config/utils'

export default {
    name: 'ScrollTop',
    props: {
    },
    data(){
        return {
            show:false,
            box:null,
        }
    },
    components:{
    },
    mounted(){
        window.addEventListener('scroll', this.handleScroll)
    },
    watch:{
    },
    computed:{
        // scrollTop(){
        //     return document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset
        // }
    },
    methods:{
        scrollToTop(){
            let total = 0;

            document.body.scrollTop = total
            // Firefox
            document.documentElement.scrollTop = total
            // Safari
            window.pageYOffset = total
        },
        handleScroll () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop>500){
                this.show = true;
            }else{
                this.show = false;
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.scrollToTop{
    width:50px;
    height: 50px;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    bottom:10px;
    right:0px;
    /* background:#38adff; */
    border-radius: 50%;
    z-index:20;
    color:#FF9D00;
    font-size:45px;
    font-weight: 500;
}
</style>