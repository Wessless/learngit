<template>
    <div class="chatBoxInner">
        <input  name="file" type="file" id="imageInput1" style="display:none" accept="image/png,image/gif,image/jpeg" @change="selectImgFinish"/>
        <chat-header :showBack="false" :title="'创建群组'" :showRightBtn="false" ></chat-header>
        <div id="functionBox">
            <div class="userInfo">
                <!-- <div class="groupTitle">
                    <input type="text" class="form-control" v-model="groupName" placeholder="请输入群组名称（必填）">
                </div> -->
                <div class="groupInfo">
                    <div class="groupTitle">
                        <input type="text" class="form-control" v-model="groupName" placeholder="请输入群组名称（必填）">
                    </div>
                    <div class="groupImgDom">
                        <div class="imgDom" @click="selectImg">
                            <img v-bind:src="uploadImgBase64" v-show="uploadImgBase64" alt="">
                        </div>
                    </div>
                    <div class="submitBtn" @click="createGroupMethod">提交</div>
                </div>
                <div class="staffList">
                    <div class="staffListTitle"></div>
                    <div class="staffListArr">
                        <staff-select v-for="(item,index) in friendList" v-if="!(item.StaffID==userInfo.userStaffID)" :key="index" :item="item" class="members_item" :emit="'createGrup'" @createGrup="createGrupSelect"></staff-select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import SwitchButton from '@/components/chat/SwitchButton'
import ChatHeader from '@/components/chat/ChatHeader'
import StaffSelect from '@/page/user/StaffSelect'
import { mapState,mapMutations,mapActions } from 'vuex'
import { rong_getConversation } from '@/js/rongCloud'
import { createGroup } from '@/js/api'
import { alertError } from '@/config/utils'

export default {
    name: 'CreateGroup',
    data(){
        return {
            groupName:"",
            uploadImgBase64:"",
            file:null
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'currFriendList',
            'allStaffs'
        ]),
        friendList(){
            for(let i=0;i<this.allStaffs.length;i++){
                this.allStaffs[i].selected = false;
            }
            return this.allStaffs;
        }
    },
    components:{
        SwitchButton,
        ChatHeader,
        StaffSelect
    },
    methods:{
        ...mapMutations([
            'SET_CURRCONVERSATION',
            'SET_CURRFRIENDLIST',
        ]),
        ...mapActions([
            'reloadMyGroups'
        ]),
        userEdit(){
            this.editable = true;
            this.newName = this.loginUser.nickName;
        },
        userSave(){
            this.editable = false;
            this.loginUser.nickName = this.newName;
        },
        modalVisibleChange(val){
            this.loginUser.hasSound = val;
        },
        createGrupSelect(val){
            for(let i=0;i<this.allStaffs.length;i++){
                if(val.staffID==this.allStaffs[i].StaffID){
                    this.allStaffs[i].selected = val.value;
                }
            }
        },
        selectImg(){
            document.getElementById("imageInput1").click();
        },
        selectImgFinish(e){
            let file = e.target.files[0];
            this.file = file;
            var reader = new FileReader();
            reader.readAsDataURL(file); 
            reader.onloadend = () => {
                // 图片的 base64 格式, 可以直接当成 img 的 src 属性值        
                var dataURL = reader.result;
                this.uploadImgBase64 = dataURL;
            };
        },
        createGroupMethod(){
            var arr = [this.userInfo.cosNum+"_"+this.userInfo.userStaffID];
            for(let i=0;i<this.allStaffs.length;i++){
                if(this.allStaffs[i].selected==true){
                    arr.push(this.userInfo.cosNum+"_"+this.allStaffs[i].StaffID);
                }
            }
            if(this.groupName.trim() == ""){
                return;
            }
            if(arr.length<3){
                alert("至少选择两个员工");
                return;
            }
            createGroup("",this.groupName.trim(),this.userInfo.userStaffID,arr.toString(),this.userInfo.cosNum,this.file).then((data)=>{
                if(data.data.ret==1){
                    // 隐藏消息组件
                    this.SET_CURRCONVERSATION(null);
                    // 隐藏员工（群组）信息组件
                    let groupInfo = {
                        CreatStaff:this.userInfo.userStaffID,
                        Flag:"1",
                        GroupName:data.data.groupName,
                        ID:data.data.groupId,
                        Portraiturl:data.data.portraitUrl,
                        Staffs:arr.toString(),
                    }
                    this.SET_CURRFRIENDLIST({type:"group",data:groupInfo,friendList:this.allStaffs});
                    this.reloadMyGroups();
                }
            }).catch((err)=>{
                alertError(this,"2054");
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

#functionBox {
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    top: 54px;
    bottom: 0;
    width: 100%;
}
/* userInfo*/
.userInfo{
    width: 100%;
    height:100%;
    padding: 20px 100px;
    display: flex;
    flex-direction:row;
}
.groupInfo{
    height: 100%;
    flex: 1;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.groupImgDom{
    flex:1;
    display: flex;
    justify-content: center;
}
.imgDom{
    width:200px;
    height:200px;
    border-radius: 50%;
    overflow: hidden;
    background:#dddddd;
}
.imgDom > img{
    width: 100%;
    height:100%;
}
.staffList{
    width: 350px;
    height: 100%;
    overflow: scroll;
}
.staffListArr{
    border: 1px solid #e9f0f8;
    background: #ffffff;
}
.groupTitle{
    display: flex;
    height:50px;
    align-items: center;
    justify-content: center;
    padding-bottom: 10px;
    width: 100%;
}
.groupTitle > input{
    /* padding:5px 10px; */
    font-size: 16px;
    height: 40px;
}
.submitBtn{
    width:200px;
    padding:10px;
    background:#38adff;
    color:#ffffff;
    text-align: center;
    border-radius: 5px;
}
</style>