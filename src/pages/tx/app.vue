<template>
    <el-container id="app" class="page-container">
        <el-header></el-header>
        <el-main class="es-main">
            <el-card class="box-card info-overview-card">
                <!--交易信息-->
                <div slot="header" class="clearfix header">
                    <span class="key" style="width: initial">{{$t('message.sharder_trading_info')}}</span>
                </div>
                <!--交易hash-->
                <div class="text item">
                    <span class="key">{{$t('message.sharder_trading_hash')}}</span>
                    <span class="value">{{transactions.hash}}</span>
                </div>
                <!--交易id-->
                <div class="text item">
                    <span class="key">{{$t('message.sharder_trading_ID')}}</span>
                    <span class="value">{{transactions.transactionId}}</span>
                </div>
                <!--区块高度-->
                <div class="text item">
                    <span class="key">{{$t('message.sharder_block_height')}}</span>
                    <span class="value">
                        <a class="es-link" :href="'block.html?height='+transactions.height">
                            #{{transactions.height}}
                        </a>
                    </span>
                </div>
                <!--交易时间-->
                <div class="text item"><span class="key">{{$t('message.sharder_trading_time')}}</span>
                    <span class="value">{{new Date().BlockDate(transactions.timestamp)}}</span>
                </div>

                <!--发起方-->
                <div class="text item">
                    <span class="key">{{$t('message.sharder_initiator')}}</span>
                    <span class="value"><a :href="'/address.html?addr='+transactions.sender" class="es-link">{{transactions.sender}}</a></span>
                </div>

                <!--接收方-->
                <div class="text item" v-if="transactions.type != 6 " >
                    <span class="key">{{$t('message.sharder_receiver')}}</span>
                    <span class="value"><a :href="'/address.html?addr='+transactions.recipient" class="es-link">{{transactions.recipient}}</a></span>
                </div>

                <!--客户信息-->
                <div class="text item" v-if="transactions.type == 6" >
                    <span class="key">{{$t('message.client_account')}}</span>
                    <span class="value">
                        <a :href="'/address.html?addr='+transactions.data.clientAccount" class="es-link">{{transactions.data.clientAccount}}</a>
                    </span>
                </div>

                <!--交易类型-->
                <div class="text item">
                    <span class="key">{{$t('message.sharder_trading_type')}}</span>
                    <el-tag v-if="transactions.type == '0'" type="primary">{{$t('message.sharder_transfer')}}</el-tag>
                    <el-tag v-if="transactions.type == '6'" type="success">{{$t('message.sharder_storage')}}</el-tag>
                    <!--<el-tag v-if="transactions.type == '6'" type="success">数据处理</el-tag>-->
                </div>

                <!--文件名称-->
                <div class="text item" v-if="transactions.type == 6">
                    <span class="key">{{$t('message.sharder_file_name')}}</span>
                    <span class="value">
                        {{transactions.data.fileName}}&nbsp;&nbsp;
                        <el-tag>{{transactions.data.fileType || ''}}</el-tag>
                    </span>
                </div>

                <!--交易金额-->
                <div class="text item" v-else>
                    <span class="key">{{$t('message.sharder_transaction_amount')}}</span>
                    <span class="value amount">{{Number().amountFormat(transactions.amount)}}</span>
                </div>

                <!--手续费-->
                <div class="text item">
                    <span class="key">{{$t('message.sharder_service_charge')}}</span>
                    <span class="value amount">{{Number().amountFormat(transactions.fee)}}</span>
                </div>
                <!--交易状态及确认数-->
                <div class="text item">
                    <span class="key">{{$t('message.sharder_confirmation_state')}}</span>
                    <span class="value">
                        <span v-if="transactions.confirmations > 0">
                            <i class="el-icon-circle-check-outline es-success" ></i> ({{$t('message.sharder_ok_num')}}:{{transactions.confirmations}})
                        </span>
                        <span v-else>
                            <i class="el-icon-circle-check-outline el-icon-loading" ></i> (pending)
                        </span>
                    </span>
                </div>
            </el-card>
        </el-main>
        <el-footer></el-footer>
    </el-container>
</template>

<style scoped>
    @media (max-width: 768px){
        .es-main{
            padding-left: 0px;
            padding-right: 0px;
        }
        .es-main > .info-overview-card{
          margin-top: 0px;
          border: initial;
          box-shadow: initial;
        }
    }
</style>
<script>
    import axios from "axios";
    import elHeader from 'components/header.vue'
    import elFooter from 'components/footer.vue'
    import Util from '../../assets/js/util';
    import api from '../../assets/api';
    import '../../assets/css/es.css';

    export default {
        components: {
            'el-header': elHeader, "el-footer": elFooter
        },

        data() {
            return {
                msg: 'Use Vue 2.0 Today!',
                transactions: [{}],

            }
        },
        methods: {
            getTxInfo() {
                let key = "&hash=";
                let queryParam = Util.GetUrlParam("hash");
                if(Util.isEmpty(queryParam)){
                    queryParam = Util.GetUrlParam("txId");
                    key = "&txID=";
                }
                let tx = Util.getJsonLocalStorage(queryParam);
                if(Util.isEmpty(tx)){
                    axios.get(api.TX +key+queryParam, {withCredentials: true})
                        .then(res => {
                            this.transactions = res.data;
                            Util.storageTrade(res.data);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }else{
                    this.transactions = tx;
                }
            },
        },
        created() {
            this.getTxInfo();
        }
    }
</script>
