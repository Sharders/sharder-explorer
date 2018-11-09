<template>
        <div>
            <el-row class=" es-main" >

                <h2 class="main-title"><img src="https://apron-store.oss-cn-hangzhou.aliyuncs.com/sharder/img/network.png"><span style="margin-left: 40px;">{{$t('message.sharder_sharder_network')}} </span></h2>
            </el-row>

            <el-row class="statistical-main es-main" >
                <!--出块时间 start-->
                <el-col :span="4"  :xs="11">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>{{$t('message.sharder_block_time')}}</span>
                        </div>
                        <div class="details">
                            <div>
                                <div class="t">{{$t('message.sharder_last_block')}}</div>
                                <div class="c">{{new Date().msTohhmmssStr(statistical.prevBlockTime) || 0}}</div>
                            </div>
                            <div>
                                <div class="t">{{$t('message.sharder_average_block')}}</div>
                                <div class="c">{{new Date().msTohhmmssStr(statistical.avgBlockTime) || 0}}</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <!--出块时间 end-->
                <!--24h转账交易量 start-->
                <el-col :span="4" :xs="11">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>{{$t('message.sharder_txn_volume_24')}}</span>
                        </div>
                        <div class="details">
                            <div>
                                <div class="t">{{$t('message.sharder_txn_volume')}} </div>
                                <div class="c">{{statistical.transferCount24H || 0}} {{$t('message.sharder_txns')}}</div>
                            </div>
                            <div>
                                <div class="t">{{$t('message.sharder_txn_amount')}}</div>
                                <div class="c">{{Number().amountFormat(statistical.transferAmount24H) || 0}} SS</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <!--24h转账交易量 end-->

                <!--24h数据存储 start-->
                <el-col :span="4" :xs="11" class="hidden-xs-only">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>{{$t('message.sharder_data_storage_24')}}</span>
                        </div>
                        <div class="details">
                            <div>
                                <div class="t">{{$t('message.sharder_storage_amount')}}</div>
                                <div class="c">{{statistical.storageCount24H || 0}} {{$t('message.sharder_copies')}}</div>
                            </div>
                            <div>
                                <div class="t">{{$t('message.sharder_storage_size')}}</div>
                                <div class="c">{{Number().FileSizeFormatStr(statistical.storageDataLength24H) || 0}}</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <!--24h数据存储 end-->
                <!--全网转账交易量 start-->
                <el-col :span="4" :xs="11">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>{{$t('message.sharder_total_network_txn_volume')}}</span>
                        </div>
                        <div class="details">
                            <div>
                                <div class="t">{{$t('message.sharder_txn_volume')}}</div>
                                <div class="c">{{statistical.transferCount || 0}} {{$t('message.sharder_txns')}}</div>
                            </div>
                            <div>
                                <div class="t">{{$t('message.sharder_txn_amount')}}</div>
                                <div class="c">{{Number().amountFormat(statistical.transferAmount) || 0}} SS</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <!--全网转账交易量 end-->
                <!--全网数据存储 start-->
                <el-col :span="4" :xs="11">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>{{$t('message.sharder_total_data_storage_24')}}</span>
                        </div>
                        <div class="details">
                            <div class="l">
                                <div class="t">{{$t('message.sharder_storage_amount')}}</div>
                                <div class="c">{{statistical.storageCount || 0}} {{$t('message.sharder_copies')}}</div>
                            </div>
                            <div content="r">
                                <div class="t">{{$t('message.sharder_storage_size')}}</div>
                                <div class="c">{{Number().FileSizeFormatStr(statistical.storageDataLength) || 0}}</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <!--全网数据存储 end-->
            </el-row>
        </div>


</template>

<script>
    import axios from "axios";
    import api from '../assets/api';
    import Util from '../assets/js/util';
    export default {
        name: "statistical_data",
        data() {
            return {
                statistical:""
            }
        },
        methods:{
            getTxStatistics(){
                axios.get(api.methods.getBaseUrl(api.TX_STATISTICS)).then(res =>{
                    this.statistical = res.data;
                    this.statistical.prevBlockTime = Util.getLocalStorage("prevBlockTime");
                    this.statistical.avgBlockTime = Util.getLocalStorage("avgBlockTime");
                }).catch(function (error) {
                    console.error(error);
                })
            }
        },
        mounted(){
            this.getTxStatistics();
        }
    }
</script>
<style scoped>
    .main-title{
        margin-top: 30px;
        margin-bottom: 30px;
    }
</style>

<style>
    .statistical-main{
        text-align: center;
        padding: initial;
    }
    .statistical-main .el-col{
        float: initial;
        display: inline-block;
    }
    @media (min-width: 768px){
        .statistical-main .el-col-4{
            width: 19%;
        }
    }
    /*.statistical-main .el-col-4{*/
        /*width: 19%;*/
    /*}*/
    .statistical-main .el-card{

    }
    .statistical-main .el-card .el-card__header{
        padding: 10.5px 20px;
        font-size: 14px;
        font-weight: bold;
        color: #999;
    }
    .statistical-main .el-card__body{
        padding: 20px 5px;
    }
    .statistical-main .el-card:hover  > .el-card__header{
        background: #409EFF;
        color: #ffffff;
        transition: .3s;
    }
    .statistical-main .details{
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        font-weight: bold;
        position: relative;
    }
    .statistical-main .details >div{
        width: 100%;
    }
    .statistical-main .details .t{
        font-size: 12px;
    }
    .statistical-main .details .c{
        margin-top: 10px;
        color: #409eff;
        line-height: 16px;
        height: 16px;
        font-size: 12px;
    }
    .statistical-main .details:before{
        border-left: 1px solid #ebeef5;
        content: "";
        display: block;
        width: 1px;
        height: 100%;
        position: absolute;
        left: 50%;
    }
    @media (max-width: 768px){
        .statistical-main .el-card .el-card__header{
            font-size: 12px;
            padding: 10.5px 10px;
        }
    }



</style>