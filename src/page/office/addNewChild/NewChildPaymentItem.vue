<template>
    <div class="childItem">
        <!-- <div class="headImage"><img :src="imagePath" alt=""></div> -->
        <div class="headTitle">
            <!-- <span class="iconfont moneyIcon" v-if="item.IsSalaryNotIncluded=='1'" style="color:#999">&#xe72e;</span>
            <span class="iconfont moneyIcon" v-if="item.IsSalaryNotIncluded=='0'" style="color:#fdc223">&#xe72e;</span> -->
            {{ item.ChildName }}
            <span class="sex iconfont" v-if="sex=='1'" style="color:#f817a6">&#xe72c;</span>
            <span class="sex iconfont" v-if="sex=='0'" style="color:#38adff">&#xe72b;</span>
        </div>
        <div class="sortblock" v-show="false">
            <!-- <span class="item" @click.stop="editFamilyMember">编辑家庭成员</span> -->
            <!-- <span class="item" v-if="item.Mobile!=''"><span class="iconfont" style="color:#38adff;">&#xe7f4;</span>{{ item.Mobile }}</span>
            <span class="item" v-show="item.DepartmentName!=''">{{ item.DepartmentName }}</span> -->
        </div>
        <div class="title">ID：{{ item.ID }}</div>
        <div class="title">手机：{{ item.PhoneNum }}</div>
        <div class="title">金额：{{ price }}</div>
        <div class="title">缴费状态：{{ status }}</div>
        <div class="title">缴费方式：{{ paymentWay }}</div>
        <div class="title">缴费时间：{{ paymentTime }}</div>
        <div class="title">创建时间：{{ item.CreateDate.split(" ")[0] }}</div>
        <div class="title">备注：{{ item.Remark }}</div>
        <div class="bottomBtns">
            <div class="bottomBtn" v-show="item.PaymentStatus!='2'" @click.stop="deletePayment">删除</div>
            <div class="bottomBtn" v-show="item.PaymentStatus!='2'" @click.stop="paymentMoney">人工收费</div>
            <div class="bottomBtn">&nbsp;</div>
        </div>
    </div>
</template>

<script>

// import {  } from '@/js/api'
import { mapState, mapMutations } from 'vuex'
import { money } from '@/config/utils'

export default {
    name: 'NewChildPaymentItem',
    props: {
        item:{
            type:Object
        },
        type:{// 0：进行中班级，1：已毕业班级，2：中途退学
            type:String
        },
        isAddChild:{// 是否是新生录入
            type:Boolean,
            default:false
        },
        isAssignChild:{// 是否是新生分班
            type:Boolean,
            default:false
        },
        isBeeBind:{// 是否是蜂堡绑定
            type:Boolean,
            default:false
        },
        canSetPaymentSubject:{// 是否显示设置缴费科目状态
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
        }
    },
    components:{
    },
    mounted(){
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        sex(){
            if(this.item.ChildSex=="0"){
                // return "男";
                return '0';
            }else{
                // return "女";
                return '1';
            }
        },
        price(){
            return money(this.item.Price)+"元"
        },
        status(){
            if(this.item.PaymentStatus=="1"){
                return "未缴费"
            }
            if(this.item.PaymentStatus=="2"){
                return "已缴费"
            }
            if(this.item.PaymentStatus=="4"){
                return "未发布"
            }
            return "";
        },
        paymentWay(){
            // 现金-0
            // 小蜜蜂卡-1
            // 刷卡-2
            // 各种转账-3
            // 川迪钱包-4
            // 微信线上支付-5（原微信教育）
            // 支付宝教育-6
            // 大账户-7
            // 建行-8
            // 微信扫码支付-9（原微信支付）
            // 招行一网通-10
            // 支付宝支付-11
            // 平安银行-12
            // 支付宝直付通-13
            // 小通分期-14
            // 通联信用卡-15
            // 通联借记卡-16
            // 掌上生活支付-17
            // 招行转账-18
            // 招行代发-19
            // 招行信用卡-20
            // 招行E号贷-21
            // 招行小额贷-22
            let array = ['现金','小蜜蜂卡','刷卡','各种转账','川迪钱包','微信线上支付','支付宝教育','大账户','建行','微信扫码支付','招行一网通','支付宝支付','平安银行','支付宝直付通','小通分期','通联信用卡','通联借记卡','掌上生活支付','招行转账','招行代发','招行信用卡','招行E号贷','招行小额贷']
            return array[this.item.PaymentWay]
        },
        paymentTime(){
            if(this.item.PaymentTime=="1900-01-01 00:00:00"){
                return "";
            }else{
                return this.item.PaymentTime.split(" ")[0]
            }
        }
    },
    watch:{
    },
    methods:{
        // 删除
        deletePayment(){
            this.$emit("deletePayment",this.item);
        },
        // 人工缴费
        paymentMoney(){
            this.$emit("paymentMoney",this.item);
        },
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .childItem{
    display: block;
    position: relative;
    width:310px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 5px 10px 10px 10px;
    margin-right: 20px;
    margin-bottom: 20px;
    border:1px solid #ffffff;
} */
.childItem{
    display: block;
    position: relative;
    justify-self: center;
    width: 94%;
    background-color: #fff;
    border-radius: 6px;
    border:1px solid #999;
    /* box-shadow: 0 4px 8px rgba(0,0,0,.12); */
    padding: 10px;
    margin: 10px 3% 10px 3%;
}
.headImage{
    position: absolute;
    left:50%;
    top:-41px;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    height:82px;
    width:82px;
    border-radius: 50%;
    border:1px solid #999;
    background:#ffffff;
    overflow: hidden;
}
.headImage > img{
    width: 100%;
    height: 100%;
}
.headTitle{
    font-size:18px;
    font-weight: 500;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
    text-align:center;
}
.sortblock{
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    padding:5px 0;
    height:30px;
    align-items: center;
}
.sortblock > .item{
    padding-left: 8px;
    padding-right: 8px;
    height:24px;
    padding-top:2px;
    border-left: 1px solid #999;
    color: #ffffff;
    cursor: pointer;
    background:#38adff;
    border-radius: 3px;

}
.sortblock > .item:nth-child(1){
    border-left: 0px solid #999;
}
.title{
    /* width:49%; */
    display: block;
    color: #999999;
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
.deleteChild{
    position: absolute;
    right:13px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.changeChild{
    position: absolute;
    right:63px;
    bottom:5px;
    color: #38adff;
    cursor: pointer;
}
.el-checkbox{
    margin:0;
}
.sex{
    padding-left:5px;
    font-size:20px;
}
.moneyIcon{
    padding-right:5px;
}
.personIcon{
    padding-right: 5px;
}
.selected{
    color: #38adff;
}
.bottomBtns{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
.red{
    color: #e51c23;
}
.checkboxSelect{
    position: absolute;
    top:10px;
    left:10px;
    padding:0 3px;
}
.isSelect{
    border-color: #38adff !important;
}
</style>