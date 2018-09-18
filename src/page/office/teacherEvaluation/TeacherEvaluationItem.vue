<template>
    <div class="classManagementItem">
        <div class="headTitle">{{ item.StaffName }}</div>
        <div class="title">教师编号：{{ item.StaffNum }}</div>
        <div class="title" :title="item.TMsg">所在班级：{{ item.TMsg }}</div>
        <div class="title">工作质量考核所得评分：{{ item.ER }}</div>
        <div class="title">兴趣班看班次数：{{ item.ICLASSATTEND }}</div>
        <!-- <div class="title">时间外出勤次数：{{ item.OUTNUM }}</div> -->
        <div class="title">家园通：<span :class="{clickColor:item.TODAYJIAYUANTONG!='0'}" @click="jiayuantong('day')">本日{{ item.TODAYJIAYUANTONG }}</span>，<span :class="{clickColor:item.JIAYUANTONG!='0'}" @click="jiayuantong('month')">本月{{ item.JIAYUANTONG }}</span></div>
    </div>
</template>

<script>

export default {
    name: 'TeacherEvaluationItem',
    props: {
        item:{
            type:Object
        },
        month:{
            type:String,
            default:""
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
    },
    watch:{
    },
    methods:{
        jiayuantong(type){
            if((type=="day"&&this.item.TODAYJIAYUANTONG=="0")||(type=="month"&&this.item.JIAYUANTONG=="0")){
                return;
            }else{
                if(type=="day"){
                    this.$router.push(this.$route.fullPath+"/day/"+this.item.StaffID);
                }else if(type=="month"){
                    this.$router.push(this.$route.fullPath+"/month/"+this.item.StaffID+"/"+this.month);
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* .classManagementItem{
    display: block;
    position: relative;
    width:310px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 10px;
    margin-right: 20px;
    margin-bottom: 20px;
} */
.classManagementItem{
    display: block;
    position: relative;
    justify-self: center;
    width: 94%;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12);
    padding: 5px 10px 10px 10px;
    margin-right: 3%;
    margin-left: 3%;
    margin-bottom: 20px; 
    border:1px solid #ffffff;
}
.headTitle{
    font-size:20px;
    font-weight: 500;
}
.createDate{
    font-size: 14px;
    color: #999999;
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
.detail{
    position: absolute;
    right:30px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.giveMoney{
    position: absolute;
    right:80px;
    top:10px;
    color: #38adff;
    cursor: pointer;
}
.bottomBtns{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    margin-top:5px;
}
.bottomBtn{
    margin-left:10px;
    color: #38adff;
    cursor: pointer;
}
.clickColor{
    color: #38adff;
    cursor: pointer;
}
</style>