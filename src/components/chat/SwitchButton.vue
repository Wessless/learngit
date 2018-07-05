<template>
    <div class="switchDom">
        <input type="checkbox" class="switch" v-model="isChecked">
    </div>
</template>

<script>

export default { 
    name: 'SwitchButton',
    props: {
        value:{
            type:Boolean,
            default:false
        },
        emit:{
            type:String
        }
    },
    data() {
        return {
            isChecked:false
        }
    },
    methods:{
    },
    mounted() {
        this.isChecked = this.value;
    },
    watch:{
        isChecked(val){
            this.$emit(this.emit,val);
        },
        value(val){
            this.isChecked = val;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.switchDom{
    display: inline-block;
    width: 46px;
    height: 26px;
}
/* 开关样式 */
.switch{
    width: 46px;
    height: 26px; 
    position: relative;
    margin:0;
    z-index: 2; 
    box-sizing : border-box; 	
    border: 1px solid #ccc; 
    background-color: #ddd; 
    box-shadow: #ff6262 0 0 0 0 inset; 
    border-radius: 13px; 
    background-clip: content-box; 
    display: inline-block; 
    -webkit-appearance: none; 
    user-select: none; 
    outline: none !important; 
    transition:all .4s; 
}
.switch:before {
    width: 24px;
    height: 24px; 
    position: absolute; 
    top: 0px; 
    transition:all 1s; left: 0px;
    border-radius: 13px; 
    background-color: #fff; 
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); 
    content: ''; 
    transition: left 0.3s; 
}
.switch:checked {
    border-color: #38ADFF;
    box-shadow: #38ADFF 0 0 0 26px inset;
    background-color: #67778b;
    transition: border ease 0.4s,box-shadow ease 0.4s,background-color ease 1.2s; 
}
.switch:checked:before {
    left: 20px; 
    background-color: #FFFFFF;  
}
</style>