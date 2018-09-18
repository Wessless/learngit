<template>
    <div class="officeContent">
        <div class="officeItem" v-for="item in officeList" :key="item.Num" @click="toUrl(item)">
            <img :src="item.Router?'/static/images/office/'+item.Num+'.png':'/static/images/office/'+item.Num+'_gray.png'" alt="">
            <div class="title">{{ item.MenuName?item.MenuName:item.MENU_NM }}</div>
        </div>
        <!-- <div class="showInterestClass" v-show="isshowInterestClass">
            <label class="title_InterestClass">兴趣班管理三步走：</label>
            <label class="label_InterestClass">第一步：设定兴趣班的基础信息</label>
            <label class="label_InterestClass">第二步：日常考勤管理</label>
            <label class="label_InterestClass">第三步：兴趣班收费以及教师支出管理</label>
        </div> -->
    </div>
</template>

<script>
import { _format ,alertError} from '@/config/utils';
import { mapState,mapMutations } from 'vuex'
import { getMenusByStaffID } from '@/js/api'
import officeMenu from '@/js/officeMenu'

export default {
    name: 'OfficeContent',
    data :function() {
        return {
            itemList:[],
            isshowInterestClass : false
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
                if(menus[obj.Num]&&menus[obj.Num].modulesNum==num){
                    // 如果是幼儿管理权限添加新生录入和新生分班
                    if(obj.Num=="6019"){
                        resultArr.push({
                            MENU_NM:"新生录入",
                            MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
                            Num:"6019_01",
                            TITLE_IMAGE:"",
                            sortNum:18.1,
                            Router: "/addNewChild"
                        });
                        resultArr.push({
                            MENU_NM:"新生分班",
                            MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
                            Num:"6019_02",
                            TITLE_IMAGE:"",
                            sortNum:18.2,
                            Router: "/assignChild"
                        });
                    }
                    // 将路由和名字放到数组对象中
                    obj.Router = menus[obj.Num].router;
                    if(menus[obj.Num].MenuName){
                        obj.MenuName = menus[obj.Num].MenuName;
                    }
                    obj.sortNum = menus[obj.Num].sortNum;
                    resultArr.push(obj);
                }
                // if(obj.Num[0]==num){
                //     if(menus[obj.Num]){// 是否在officeMenu中
                //         // 如果是幼儿管理权限添加新生录入和新生分班
                //         if(obj.Num=="6019"){
                //             resultArr.push({
                //                 MENU_NM:"新生录入",
                //                 MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
                //                 Num:"6019_01",
                //                 TITLE_IMAGE:"",
                //                 Router: "/addNewChild"
                //             });
                //             resultArr.push({
                //                 MENU_NM:"新生分班",
                //                 MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
                //                 Num:"6019_02",
                //                 TITLE_IMAGE:"",
                //                 Router: "/assignChild"
                //             });
                //         }
                //         // 将路由和名字放到数组对象中
                //         obj.Router = menus[obj.Num].router;
                //         if(menus[obj.Num].MenuName){
                //             obj.MenuName = menus[obj.Num].MenuName;
                //         }
                //         resultArr.push(obj);
                //     }
                // }
            }
            // 蜂堡绑定蜂堡绑定只有cql有权限
            // if(num=="6"&&this.userInfo.userStaffID=="0"){
            //     resultArr.push({
            //         MENU_NM:"蜂堡绑定",
            //         MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
            //         Num:"6cql",
            //         TITLE_IMAGE:"",
            //         Router: "/beeBind"
            //     });
            // }
            resultArr.sort((x, y)=>{
                // let xNum = x.Num.split("_")[0];
                // let yNum = y.Num.split("_")[0];
                if(x.Router==""&&y.Router==""){
                    if(x.sortNum<y.sortNum){
                        return -1;
                    }else if(x.sortNum>y.sortNum){
                        return 1;
                    }else{
                        return -1;
                    }
                }else if(x.Router!=""&&y.Router!=""){
                    if(x.sortNum<y.sortNum){
                        return -1;
                    }else if(x.sortNum>y.sortNum){
                        return 1;
                    }else{
                        return -1;
                    }
                }else if(x.Router!=""&&y.Router==""){
                    return -1;
                }else if(x.Router==""&&y.Router!=""){
                    return 1;
                }
            });
            //兴趣班提示
            if(num=="9"){
                this.isshowInterestClass = true;
            }else{
                this.isshowInterestClass = false;
            }
            // resultArr.push({
            //     MENU_NM:"报销凭证",
            //     MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
            //     Num:"3015",
            //     TITLE_IMAGE:"",
            //     Router: "/expenseCertificate"
            // });
            // resultArr.push({
            //     MENU_NM:"借款凭证",
            //     MENU_URL:"/image/firstpage/1-3_menu ico-321.png",
            //     Num:"3016",
            //     TITLE_IMAGE:"",
            //     Router: "/borrowCertificate"
            // });
            return resultArr;
        }
    },
    mounted(){
        this.SET_APPROVETABTYPE("first");
        getMenusByStaffID(this.userInfo.userStaffID).then((result)=>{
            this.itemList = result.data.data;
        }).catch((err)=>{
            alertError(this,"1016");
        });
    },
    components: {
    },
    methods:{
        ...mapMutations([
            'SET_CURRCONVERSATION',
            'SET_CURRFRIENDLIST',
            'SET_BROWSERIMG',
            'SET_APPROVETABTYPE',
        ]),
        toUrl(item){
            if(item.Router){
                this.$router.push(this.$route.fullPath+item.Router);
            }else{
                const h = this.$createElement;
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message:
                        h('p', null, [
                            h('span', null, '请前往蜂堡办公系统手机版进行操作 '),
                            h('a', { style: 'color: #38adff',on:{ click:this.openQRCode } }, '下载手机版')
                        ])
                });
            }
        },
        openQRCode(){
            this.SET_BROWSERIMG({
                imgPath:"static/images/cos_qrcode.png",
                styleObject:{
                    width:"300px",
                    height:"300px"
                }
            });
        },
        changeTwoNum(changeNum,insertToNum,array,side){
            let changeMenu = null;
            let changeIndex = 0;
            let insertToIndex = 0;
            for(let i=0;i<array.length;i++){
                if(changeNum==array[i].Num){
                    changeIndex = i;
                    changeMenu = array[i];
                    break;
                }
            }
            if(changeMenu){
                array.splice(changeIndex,1);
                for(let i=0;i<array.length;i++){
                    if(insertToNum==array[i].Num){
                        insertToIndex = i;
                        break;
                    }
                }
                if(side=="after"){
                    array.splice(insertToIndex+1,0,changeMenu);
                }else if(side=="before"){
                    array.splice(insertToIndex,0,changeMenu);
                }
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
.showInterestClass{
    width: 94.6%;
    justify-self: center;
}
.title_InterestClass{
    margin-bottom: 18px;
    color: #c0c4cc;
}
.label_InterestClass{
    margin-bottom: 10px;
    color:#c0c4cc;
    font-weight: lighter;
}
</style>