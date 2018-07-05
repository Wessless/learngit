<template>
    <div>
        <!-- <user-setting></user-setting> -->
        <!-- 员工信息 -->
        <staff-info v-if="this.friendListType=='staff'"></staff-info>
        <!-- 群组信息 -->
        <group-info v-if="this.friendListType=='group'"></group-info>
        <!-- 创建群组 -->
        <create-group v-if="this.friendListType=='creatGroup'"></create-group>
    </div>
</template>

<script>

import userSetting from '@/page/user/UserSetting'
import StaffInfo from '@/page/user/StaffInfo'
import GroupInfo from '@/page/user/GroupInfo'
import CreateGroup from '@/page/user/CreateGroup'
import { mapState,mapMutations } from 'vuex'

export default {
    name: 'FriendListInfo',
    data(){
        return {
            
        }
    },
    components:{
        userSetting,
        StaffInfo,
        GroupInfo,
        CreateGroup
    },
    computed:{
        ...mapState([
            'currFriendList'
        ]),
        friendListType(){
            if(this.currFriendList&&this.currFriendList.type){
                return this.currFriendList.type
            }else{
                return "";
            }
        }
    },
    methods:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

</style>