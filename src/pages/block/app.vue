<template>
    <el-container id="app"  class="page-container">
        <el-header></el-header>
        <el-main class="es-main">
            <el-card class="box-card info-overview-card">
                <div slot="header" class="clearfix header">
                    <span class="key">{{$t('message.sharder_block_info')}}:</span>
                    <span class="value"><span>{{$t('message.sharder_height')}}</span>#{{blockInfo.height}}</span>
                </div>
                <div class="text item" v-if="blockInfo.prevp != null">
                    <span class="key">{{$t('message.sharder_upper_block')}}</span>
                    <span class="value"><a :href="'/block.html?height='+(blockInfo.prevp)" class="es-link"><span>#{{blockInfo.prevp}}</span></a></span>
                </div>
                <div class="text item" v-if="blockInfo.nextp != null">
                    <span class="key">{{$t('message.sharder_next_block')}}</span>
                    <span class="value"><a :href="'/block.html?height='+(blockInfo.nextp)" class="es-link"><span>#{{blockInfo.nextp}}</span></a></span>
                </div>
                <div class="text item">
                    <span class="key">{{$t('message.sharder_block_size')}}</span>
                    <span class="value">{{Number().FileSizeFormatStr(blockInfo.payloadLength)}}</span>

                </div>
                <div class="text item"><span class="key">{{$t('message.sharder_out_block_time')}}</span><span
                        class="value">{{new Date().BlockDate(blockInfo.timestamp)}} </span></div>

                <div class="text item">
                    <span class="key">{{$t('message.sharder_piece')}}</span>
                    <span class="value"><a :href="'/address.html?addr='+blockInfo.generatorRS" class="es-link">{{blockInfo.generatorRS}}</a></span>
                </div>

                <div class="text item"><span class="key">{{$t('message.sharder_service_charge')}}</span><span
                        class="value amount">{{Number().amountFormat(blockInfo.totalFee)}}</span></div>
                <div class="text item"><span class="key">{{$t('message.sharder_volume_transactions')}}</span><span
                        class="value">{{blockInfo.numberOfTransactions || 0}}</span></div>
                <div class="text item"><span class="key">{{$t('message.sharder_transaction_amount')}}</span><span
                        class="value amount">{{Number().amountFormat(blockInfo.totalAmount)}}</span></div>
            </el-card>

            <es-tx-list :transactions="blockInfo" class="table block-table" v-if="showlist"></es-tx-list>
        </el-main>
        <el-footer>Footer</el-footer>
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
        .block-table{
            padding-left: 15px;
            padding-right: 15px;
        }
    }
</style>
<script>
    import elHeader from 'components/header.vue'
    import elFooter from 'components/footer.vue'
    import tx_list from 'components/tx_list.vue'
    import axios from "axios";
    import api from '../../assets/api';
    import Util from '../../assets/js/util';


    import '../../assets/css/es.css';
    let _height = Util.GetUrlParam("height");
    export default {
        components: {
            'el-header': elHeader, "el-footer": elFooter ,"es-tx-list":tx_list
        },
        data() {
            return {
                blockInfo: [{}],
                showlist:false
            }
        },
        methods: {
            getBlockInfo() {
                let blockInfo = Util.getJsonLocalStorage(_height);
                if (blockInfo == null) {
                    axios.get(api.methods.getBaseUrl(api.BLOCK_BY_HEIGHT) + "&height=" + _height, {withCredentials: true})
                        .then(res => {
                            this.blockInfo = res.data;
                            this.blockInfo.transactionsDto = this.blockInfo.transactions;
                            delete this.blockInfo.transactions;
                            this.showlist = true;
                            this.storageTrade();
                            this.previousNext();
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else {
                    this.showlist = true;
                    this.blockInfo = blockInfo;
                    this.storageTrade();
                    this.previousNext();
                }
            },
            storageTrade() {
                Util.storageTrade(this.blockInfo.transactionsDto);
            },
            previousNext(){
                let _lastHeight = Util.getLocalStorage("LAST_BLOCK_HEIGHT");
                let _height = this.blockInfo.height;
                if(_height > 0){
                    this.blockInfo.prevp = _height - 1;
                }
                if(_height < _lastHeight){
                    this.blockInfo.nextp = _height + 1;
                }
                console.log(_lastHeight +"最后高度")
            }

        },
        created() {
            this.getBlockInfo();
        }
    }
</script>

