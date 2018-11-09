<template>
    <div class="IntelligentDeviceList">
        <!-- <router-view></router-view> -->
        <!-- :span-method="arraySpanMethod" -->
        <chat-header :showBack="true" :title="'智能设备'"></chat-header>
        <div style="width:100%;padding:74px 20px 20px 20px;">

        </div>
        <div class="midTableHeight" style="width:100%;display:block;padding:0px 20px 20px 20px;">
            <el-table :data="intelligentDeviceList" :cell-class-name="tableCellClassName" :cell-style="getColStyle" :header-cell-style="getRowStyle" border max-height="470">
                <!-- <el-table-column prop="" align="center"  label="类别"  width="120"></el-table-column> -->
                <el-table-column prop="DeviceName" align="center"  label="名称"  width="140"></el-table-column>
                <el-table-column prop="DevicePlace" align="center"  label="位置"  width="220"></el-table-column>
                <el-table-column prop="Remark" align="center"  label="描述"  ></el-table-column>
                <el-table-column label="操作" width="225">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            @click="restart(scope.row)">重启</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            style="margin-left:0px;"
                            @click="shutdown(scope.row)">关机</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            style="margin-left:0px;"
                            @click="connectWIFI(scope.row)">连接WIFI</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            style="margin-left:0px;"
                            @click="showDetail(scope.row)">当前状况</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            style="margin-left:0px;margin-top:5px;"
                            @click="videoSurv(scope.row)">视频监控</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="Remark" align="center"  label="同步"  width="100">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            style="margin-left:0px;"
                            @click="synStaffs(scope.row)">同步人员</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            style="margin-left:0px;margin-top:5px;"
                            @click="synAttendance(scope.row)">同步考勤</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 重启 -->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisibleRestart"
            width="430px">
            <span>是否重启</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleRestart = false">取 消</el-button>
                <el-button type="primary" @click="confirmRestart">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 关机 -->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisibleShutdown"
            width="430px">
            <span>是否关机</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleShutdown = false">取 消</el-button>
                <el-button type="primary" @click="confirmShutdown">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 连接wifi -->
        <el-dialog
            title="连接WIFI"
            class="workTimeSet"
            :visible.sync="dialogVisibleWifi"
            width="500px">
            <el-form :model="form" label-width="130px">
                <el-form-item :label="''">
                    <el-checkbox v-model="form.checked" style="margin-right:10px;">自动获取IP地址</el-checkbox>
                </el-form-item>
                <el-form-item :label="'WIFI名称'">
                    <el-input v-model="form.wifiName" size="small" style="width:240px;" placeholder="请输入WIFI名称"></el-input>
                </el-form-item>
                <el-form-item :label="'WIFI密码'">
                    <el-input type="password" v-model="form.wifiPassword" size="small" style="width:240px;" placeholder="请输入WIFI密码"></el-input>
                </el-form-item>
                <el-form-item v-show="!form.checked" :label="'IP地址'">
                    <el-input v-model="form.ipAddress" size="small" style="width:240px;" placeholder="请输入IP地址"></el-input>
                </el-form-item>
                <el-form-item v-show="!form.checked" :label="'默认网关'">
                    <el-input v-model="form.gateway" size="small" style="width:240px;" placeholder="请输入默认网关"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleWifi = false">取 消</el-button>
                <el-button type="primary" @click="confirmConnect">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 当前状况 -->
        <el-dialog
            title="当前状况"
            class="workTimeSet"
            :visible.sync="dialogVisibleDetail"
            width="500px">
            <el-form :model="posInfo" label-width="180px">
                <el-form-item :label="'IP地址：'">
                    <span>{{posInfo.ipAddress}}</span>
                </el-form-item>
                <el-form-item :label="'WIFI状态：'">
                    <span>{{wifiState}}</span>
                </el-form-item>
                <el-form-item :label="'3G状态：'">
                    <span>{{state3G}}</span>
                </el-form-item>
                <el-form-item :label="'最近一次启动时间：'">
                    <span>{{posInfo.latelyOpenTime}}</span>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 同步人员 -->
        <el-dialog
            title="同步人员"
            :visible.sync="dialogVisibleSynStaff"
            width="430px">
            <span>是否同步人员</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleSynStaff = false">取 消</el-button>
                <el-button type="primary" @click="confirmSynStaffs">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 同步考勤 -->
        <el-dialog
            title="同步考勤"
            class="workTimeSet"
            :visible.sync="dialogVisiblesynAtt"
            width="430px">
            <span>是否同步考勤</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisiblesynAtt = false">取 消</el-button>
                <el-button type="primary" @click="confirmSynAtt">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 视频监控 -->
        <el-dialog
            title="视频监控"
            class="workTimeSet"
            :visible.sync="dialogVisibleVideo"
            width="500px">
        </el-dialog>
    </div>
</template>

<script>

import { getDeviceList,shutdownPos,rebootPos,getPosinfo,wifidhcpPos,wifimanualPos,getCosposUser } from '@/js/api'
import { showLoading,closeLoading,alertError,money } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
import NoData from '@/components/chat/NoData'

export default {
    name: 'IntelligentDeviceList',
    data(){
        return {
            intelligentDeviceList:[],
            clickItem:{},
            posInfo:{
                ipAddress:"",
                state3G:"",
                latelyOpenTime:"",
                wifiState:"",
            },
            cosposUser:{
                
            },

            form:{
                checked:true,
                wifiName:"",
                wifiPassword:"",
                ipAddress:"",
                gateway:"",
            },

            dialogVisibleRestart:false,
            dialogVisibleShutdown:false,
            dialogVisibleWifi:false,
            dialogVisibleDetail:false,
            dialogVisibleSynStaff:false,
            dialogVisibleVideo:false,
            dialogVisiblesynAtt:false,
        }
    },
    components:{
        NoData,
        ChatHeader,
    },
    mounted(){
        this.loadList();
    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        state3G(){
            if (this.posInfo.state3G=="1") {
                return "可用";
            }else if (this.posInfo.state3G=="") {
                return "";
            }else{
                return "不可用";
            }
        },
        wifiState(){
            if (this.posInfo.wifiState=="1") {
                return "可用";
            }else if (this.posInfo.wifiState=="") {
                return "";
            }else{
                return "不可用";
            }
        },
    },
    methods:{
        loadList(){
            this.intelligentDeviceList = [];

            let loading = showLoading();
            getDeviceList().then((result)=>{
                closeLoading(loading);
                console.log(result.data);
                this.intelligentDeviceList = result.data.data;
                // let str = result.data.IOT_DEVICRE_ID;
                // let arr = str.split(";");
                // let color = 0;
                // for (let i = 0; i < arr.length; i++) {
                //     let arr1 = arr[i].split(":")[1].split(",");
                //     let index = 0; 
                //     for (let j = 0; j < arr1.length; j++) {
                //         let obj = {};
                //         obj.type = arr[i].split(":")[0];
                //         obj.ID = arr1[j];
                //         obj.index = index;
                //         obj.color = color;
                //         obj.len = arr1.length;
                //         this.intelligentDeviceList.push(obj);
                //         index++;
                //     }
                //     color++;
                // }
                // console.log(this.intelligentDeviceList);
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1331");
            });
        },
        //重启
        restart(item){
            this.dialogVisibleRestart = true;
            this.clickItem = item;
        },
        confirmRestart(){
            this.dialogVisibleRestart = false;
            let DevCode = this.clickItem.DeviceCode;
            let loading = showLoading();
            rebootPos(DevCode).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        message: '重启成功',
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: '重启失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                console.log(err);
                alertError(this,"2221");
            });
        },
        //关机
        shutdown(item){
            this.dialogVisibleShutdown = true;
            this.clickItem = item;
        },
        confirmShutdown(){
            this.dialogVisibleShutdown = false;
            let DevCode = this.clickItem.DeviceCode;
            let loading = showLoading();
            shutdownPos(DevCode).then((result)=>{
                closeLoading(loading);
                if(result.data.ret=="1"){
                    this.$message({
                        message: '关机成功',
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: '关机失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                closeLoading(loading);
                console.log(err);
                alertError(this,"2222");
            });
        },
        //WIFI
        connectWIFI(item){
            this.dialogVisibleWifi = true;
            this.clickItem = item;
        },
        confirmConnect(){
            let wifiName = this.form.wifiName;
            let wifiPasswd = this.form.wifiPassword;
            let ipAddr = this.form.ipAddress;
            let ipGate = this.form.gateway;
            let DevCode = this.clickItem.DeviceCode;
            
            if(wifiName==""){
                this.$message.error({
                    message:"请输入wifi名称"
                });
                return;
            }
            if(wifiPasswd==""){
                this.$message.error({
                    message:"请输入wifi密码"
                });
                return;
            }
            if(!this.checked&&ipAddr==""){
                this.$message.error({
                    message:"请输入IP地址"
                });
                return;
            }
            if(!this.checked&&ipGate==""){
                this.$message.error({
                    message:"请输入默认网关"
                });
                return;
            }
            this.dialogVisibleWifi = false;

            let loading = showLoading();
            if (this.form.checked) {
                wifidhcpPos(DevCode,wifiName,wifiPasswd).then((result)=>{
                    closeLoading(loading);
                    if(result.data.ret=="1"){
                        this.$message({
                            message: '连接成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: '连接失败',
                            type: 'error'
                        });
                    }
                }).catch((err)=>{
                    closeLoading(loading);
                    console.log(err);
                    alertError(this,"2223");
                });
            }else{
                wifimanualPos(DevCode,wifiName,wifiPasswd,ipAddr,ipGate).then((result)=>{
                    closeLoading(loading);
                    if(result.data.ret=="1"){
                        this.$message({
                            message: '连接成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: '连接失败',
                            type: 'error'
                        });
                    }
                }).catch((err)=>{
                    closeLoading(loading);
                    console.log(err);
                    alertError(this,"2224");
                });
            }

        },
        //当前状况
        showDetail(item){
            this.dialogVisibleDetail = true;
            this.clickItem = item;
            let DevCode = this.clickItem.DeviceCode;
            getPosinfo(DevCode).then((result)=>{
                let obj = result.data.data[0];
                this.posInfo.ipAddress = obj.ref0.split("-")[0];
                this.posInfo.wifiState = obj.ref0.split("-")[1];
                this.posInfo.state3G = obj.ref0.split("-")[2];
                this.posInfo.latelyOpenTime = obj.ref1.split(".")[0];
            }).catch((err)=>{
                console.log(err);
                alertError(this,"1333");
            });
        },
        //同步人员
        synStaffs(item){
            this.dialogVisibleSynStaff = true;
            this.clickItem = item;
        },
        confirmSynStaffs(){
            this.dialogVisibleSynStaff = false;
            let DevCode = this.clickItem.DeviceCode;
            let loading = showLoading();
            getCosposUser(DevCode).then((result)=>{
                closeLoading(loading);
                if(result.data.Result=="1"){
                    this.$message({
                        message: '同步成功',
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: '同步失败',
                        type: 'error'
                    });
                }
            }).catch((err)=>{
                console.log(err);
                closeLoading(loading);
                alertError(this,"1332");
            });
        },
        //同步考勤
        synAttendance(item){
            this.dialogVisiblesynAtt = true;
            this.clickItem = item;
        },
        confirmSynAtt(){
            this.dialogVisiblesynAtt = false;
        },
        //视频监控
        videoSurv(item){
            this.dialogVisibleVideo = true;
            this.clickItem = item;
        },


        //改变表样式
        getRowStyle({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0) {
                if (columnIndex == 0) {
				    return 'padding-bottom:7px;background:#38ADFF;color:#fff;'
                }
                return 'background:#38ADFF;color:#fff;text-align:center;'
            }
        },
        getColStyle({ row, column, rowIndex, columnIndex }){
            if (columnIndex == 0) {
				return 'padding-bottom:7px;text-align:center;'
			} else {
				return ''
            }
        },
        tableCellClassName({row, column, rowIndex, columnIndex}) {
            // if (columnIndex === 0) {
            //     return 'nohover';
            // }else{
            //     if (rowIndex%2 ==0) {
            //         return 'grayRow';
            //     } 
            //     return '';
            // }
            if (rowIndex%2 ==0) {
                return 'grayRow';
            } 
        },
        //合并
        // arraySpanMethod({row, column, rowIndex, columnIndex}){
        //     if (columnIndex === 0) {
        //         console.log(row)
        //         if (row.index === 0) {
        //             return {
        //                 rowspan: row.len,
        //                 colspan: 1
        //             };
        //         } else {
        //             return {
        //                 rowspan: 0,
        //                 colspan: 0
        //             };
        //         }
        //     }
        // },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.IntelligentDeviceList{
    /* padding:20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    overflow: hidden;
    background: #fafafa;
    position: relative;
    max-height: 100vh;
}
/* .intelligentDeviceList{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
} */
.intelligentDeviceList{
    display: grid;
    width: 100%;
    grid-template-columns: 33.3% 33.3% 33.3%;
}
@media screen and (max-width: 1310px){
    .intelligentDeviceList{
        display: grid;
        width: 100%;
        grid-template-columns: 50% 50%;
    }
}
@media screen and (max-width: 1030px){
    .intelligentDeviceList{
        display: grid;
        width: 100%;
        grid-template-columns: 100%;
    }
}
.el-form-item {
    margin-bottom: 0px !important;
}
.addbtn{
    float: right;
}
.ReceiveApplyDetail_signatory{
    display: flex;
    padding: 0 12px 0 0;
    vertical-align: middle;
    position: relative;
}
.smallTableHeight .el-input--small .el-input__inner{
    white-space: nowrap;
	text-overflow: ellipsis;
	word-wrap: normal;
	overflow: hidden;
}
</style>