<template>
    <div class="searchArea">
        <div class="form-group">
            <input type="text" class="form-control" :placeholder="placeholder?placeholder:$t('message.searchInput.search')" v-model="content">
            <i class="clearInputBtn" v-show="content.length>0" @click="clear()"></i>
        </div>
    </div>
</template>

<script>

export default { 
    name: 'SearchInput',
    props:["placeholder"],
    data :function() {
        return {
            content:''
        }
    },
    methods:{
        clear(){
            this.content = ''; 
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* #functionBox .searchArea div {
    width: 100%;
}

#functionBox .searchArea div label {
    left: 50%;
    top: 1px;
    background: url(../../img/icons.png) 0px -78px/80px auto no-repeat;
    width: 18px;
    height: 28px;
    margin-left: -35px;
}

#functionBox .searchArea div input {
    text-align: center;
    border: 1px solid #e7e7e7;
}

#functionBox .searchArea div input:focus {
    text-align: left;
} */

.searchArea div {
    width: 90%;
    margin: 10px auto;
    position: relative;
}
.searchArea div input {
    border-color: #fff;
    -webkit-box-shadow: none;
    box-shadow: none;
    text-indent: 2em;
    padding: 6px 12px 4px;
    background: url(../../img/icons.png) 10px -110px/108px auto no-repeat;
    background-color: #fff;
}

.searchArea div label {
    position: absolute;
    top: 0;
    left: 0;
    background: url(../../img/icons.png) 10px -110px/108px auto no-repeat;
    width: 70px;
    height: 36px;
    display: none;
}

.searchArea div.isfocus label {
    display: none;
}

.searchArea div.isfocus input {
    /*text-indent: 0;*/
}

.searchArea div input:focus {
    text-indent: 0;
    background: none;
    background-color: #fff;
}
.searchArea div .clearInputBtn{
    position: absolute;
    width: 17px;
    height: 17px;
    top: 8px;
    right: 8px;
    cursor: pointer;
    background: url(../../img/clear.png) 0 0/17px 17px no-repeat ;
}
</style>