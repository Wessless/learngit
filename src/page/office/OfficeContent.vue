<template>
    <div class="officeContent">
        <div class="officeItem" v-for="item in officeList" :key="item.Num" @click="toUrl(item)">
            <img :src="'/static/images/office/'+item.Num+'.png'" alt="">
            <div class="title">{{ item.MenuName?item.MenuName:item.MENU_NM }}</div>
        </div>
    </div>
</template>

<script>
import { _format } from '@/config/utils';
import { mapState,mapMutations } from 'vuex'
import { getMenusByStaffID } from '@/js/api'
import officeMenu from '@/js/officeMenu'

export default {
    name: 'OfficeContent',
    data :function() {
        return {
            itemList:[]
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'currConversation'
        ]),
        officeList(){
            let resultArr = [];
            let num = this.$route.params.id;
            let menus = officeMenu();
            for(let i=0;i<this.itemList.length;i++){
                let obj = this.itemList[i];
                if(obj.Num[0]==num){
                    if(menus[obj.Num]){// 是否在officeMenu中
                        // 如果是幼儿管理权限添加新生录入和新生分班
                        if(obj.Num=="6019"){
                            resultArr.push({
                                MENU_NM:"新生录入",
                                MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
                                Num:"6019_01",
                                TITLE_IMAGE:"",
                                Router: "/addNewChild"
                            });
                            resultArr.push({
                                MENU_NM:"新生分班",
                                MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
                                Num:"6019_02",
                                TITLE_IMAGE:"",
                                Router: "/assignChild"
                            });
                        }
                        // 将路由和名字放到数组对象中
                        obj.Router = menus[obj.Num].router;
                        if(menus[obj.Num].MenuName){
                            obj.MenuName = menus[obj.Num].MenuName;
                        }
                        resultArr.push(obj);
                    }
                }
            }
            // resultArr.push({
            //     MENU_NM:"幼儿出勤",
            //     MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
            //     Num:"6001",
            //     TITLE_IMAGE:"",
            //     Router: "/noteAttendance"
            // });
            // resultArr.push({
            //     MENU_NM:"借款支付",
            //     MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
            //     Num:"3005",
            //     TITLE_IMAGE:"",
            //     Router: "/expensePayment"
            // });
            return resultArr;
        }
    },
    mounted(){
        getMenusByStaffID(this.userInfo.userStaffID).then((result)=>{
            this.itemList = result.data.data;
        });
    },
    components: {
    },
    methods:{
        ...mapMutations([
            'SET_CURRCONVERSATION',
            'SET_CURRFRIENDLIST',
        ]),
        toUrl(item){
            if(item.Router){
                this.$router.push(this.$route.fullPath+item.Router);
            }else{
                this.$message('敬请期待，请前往蜂堡办公系统APP版进行操作');
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .officeContent{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
} */
.officeContent{
    padding:20px;
    display: grid;
    width: 100%;
    grid-template-columns: 25% 25% 25% 25%;
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;

    /* padding: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    height: 100%;
    overflow: scroll;
    background: #fafafa;
    position: relative; */

}
@media screen and (max-width: 1140px){
    .officeContent{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 33.3% 33.3% 33.3%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
@media screen and (max-width: 980px){
    .officeContent{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
@media screen and (max-width: 800px){
    .officeContent{
        padding:20px;
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
        max-height: 100%;
        overflow: scroll;
        background: #fafafa;
    }
}
/* .officeItem{
    display: flex;
    height:80px;
    width:23%;
    margin-bottom: 30px;
    flex-direction: row;
    border:1px solid #dddddd;
    border-radius: 5px;
    min-width: 200px;
    align-items: center;
    margin-right:10px;
} */
.officeItem{
    display: flex;
    height:80px;
    justify-self: center;
    width: 94%;
    margin-bottom: 30px;
    flex-direction: row;
    border:1px solid #dddddd;
    border-radius: 5px;
    align-items: center;
}

.officeItem:hover{
    cursor: pointer;
    border:1px solid #38adff;
}
.officeItem > img{
    width:80px;
    height:80px;
    display: inline-block;
}
.officeItem > .title{
    display: inline-block;
    height:20px;
}
</style>