<template>
    <div class="members_item">
        <input type="checkbox" name="creatGroup" v-model="isChecked" class="aui-checkbox">
        <div class="photo">
            <img class="img" v-show="imgSrc" :src="imgSrc" alt="">
            <div class="portrait" v-show="!imgSrc" :odd-even="staffID%2" :data-sex="sex">{{firstchar}}</div>
        </div>
        <div class="info">
            <h3 class="nickname">
                <span class="nickname_text">{{staffName}}</span>
            </h3>
        </div>
        <div class="botDivider"></div>
        <!-- // <i class="Presence Presence--members online"></i> -->
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'

export default {
    name: 'FriendItem',
    props: {
        item:{
            type:Object,
        },
        emit:{
            type:String
        }
    },
    data :function() {
        return {
            isChecked:false
        }
    },
    mounted() {
        this.isChecked = this.item.selected;
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
        firstchar(){
            let userName = this.item.StaffName;
            return userName.substr(userName.length-2<0?0:userName.length-2,userName.length);
        },
        imgSrc(){
            return this.item.ImagePath.replace("../../../",this.userInfo.currCOSIP+"COS"+this.userInfo.cosNum+"/");
        },
        staffID(){
            return this.item.StaffID;
        },
        staffName(){
            return this.item.StaffName;
        },
        sex(){
            return this.item.Sex;
        },
    },
    watch:{
        isChecked(val){
            this.$emit(this.emit,{value:val,staffID:this.staffID});
        },
        value(val){
            this.isChecked = val;
        }
    },
    methods:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.portrait{
  height: 45px;
  width: 45px;
  font-size: 14px;
  line-height: 45px;
}
.notice_item, .members_item {
    /*overflow: hidden;*/
    padding: 8px 12px;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
}
.notice_item .photo, .members_item .photo {
    float: left;
    margin-right: 10px;
    position: relative;
    display: flex;
    margin-left: 10px;
}

.notice_item .photo .img, .members_item .photo .img {
    display: block;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
}

.notice_item .info, .members_item .info{
    /* padding-bottom: 8px; */
    line-height: 45px;
}
.notice_item .info span, .members_item .info span {
    height: 45px;
    line-height: 45px;
    font-weight: normal;
}
.nickname{
    display: flex;
}
.nickname .nickname_text{
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.Presence--members.online {
    position: absolute;
    top: 25px;
    right: 18px;
    width: 10px;
    height: 10px;
}

.Presence--members.offline {
    position: absolute;
    top: 25px;
    right: 18px;
    width: 10px;
    height: 10px;
    background-color: #b3b3b3;
}
.botDivider {
    height: 1px;
    /*margin: 9px 0;*/
    overflow: hidden;
    background-color: #e9f0f8;
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 100%;
}

</style>