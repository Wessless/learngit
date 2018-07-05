<template>
    <div style="display:inline-block" v-html="html" @click="insertEmoji"></div>
</template>

<script>

export default {
    name: 'Emoji',
    props:['item'],
    data :function() {
        return {
            html:null
        }
    },
    mounted(){
        this.html = RongIMLib.RongIMEmoji.symbolToHTML(this.item.symbol);
    },
    components:{
        
    },
    methods:{
        insertEmoji(){
            this.$emit('insertEmoji',this.item);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

</style>