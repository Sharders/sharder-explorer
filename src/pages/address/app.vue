<template>
    <el-container id="app"  class="page-container">
        <el-header></el-header>
        <el-main v-bind:class="{'es-main':isPc()}">
            <el-card class="box-card info-overview-card">
                <!--账户地址-->
                <div slot="header" class="clearfix header dz-t">
                    <span class="key maohao">{{$t('message.sharder_account_address')}}</span>
                    <span class="value">{{account.accountRS}}</span>
                </div>
                <!--公钥-->
                <div class="text item"><span class="key">{{$t('message.sharder_public_key_account')}}</span><span
                        class="value">{{account.publicKey}}</span></div>
                <!--账户余额-->
                <div class="text item"><span class="key">{{$t('message.sharder_account_balance')}}</span><span
                        class="value amount">{{Number().amountFormat(account.balance)}}</span></div>
                <div class="text item"><span class="key">{{$t('message.sharder_block_generation_reward')}}</span><span
                        class="value amount">{{Number().amountFormat(account.forgedBalance)}}</span></div>
                <div class="text item">
                    <span class="key">{{$t('message.sharder_account_name')}}</span>
                    <span class="value">{{account.name}}</span>
                </div>
                <div class="text item">
                    <span class="key">{{$t('message.sharder_account_that')}}</span>
                    <span class="value">{{account.description}}</span>
                </div>
            </el-card>
            <es-tx-list v-bind:transactions="transaction" :address="addr" class="table" v-if="showlist"></es-tx-list>
            <el-pagination @pagingParams="paging"></el-pagination>
        </el-main>

        <el-footer>Footer</el-footer>
    </el-container>
</template>

<script>
    import elHeader from 'components/header.vue'
    import pagination from 'components/pagination.vue'
    import tx_list from 'components/tx_list.vue'
    import elFooter from 'components/footer.vue'
    import axios from "axios";
    import api from '../../assets/api';
    import Util from '../../assets/js/util';
    import '../../assets/css/es.css';
    export default {
        components: {
            'el-header': elHeader, "el-footer": elFooter,"el-pagination":pagination,"es-tx-list":tx_list
        },

        data() {
            return {
                account: [{}],
                transaction: [{}],
                addr: Util.GetUrlParam("addr"),
                showlist:false,
            }
        },
        methods: {
            isPc(){
                return Util.isPC();
            },
            getTxInfo() {
                axios.get(api.methods.getBaseUrl(api.ACCOUNT_INFO) + "&account=" +this.addr, {withCredentials: true})
                    .then(res => {
                        this.account = res.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            getAccountTxs(firstIndex,lashIndex) {
                axios.get(api.methods.getBaseUrl(api.ADDR_TRANSACTION) + "&account=" + this.addr + "&firstIndex="+firstIndex+"&lastIndex="+lashIndex, {withCredentials: true})
                    .then(res => {
                        this.transaction = res.data;
                        this.showlist = true;
                        Util.storageTrade(this.transaction);

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },

            paging(firstIndex,lashIndex){
                this.getAccountTxs(firstIndex,lashIndex);
            },

        },
        mounted(){
            this.getTxInfo();
            this.getAccountTxs(pagination.data().firstIndex,pagination.data().lastIndex);
        }
    }
</script>

<style scoped>
    .info-overview-card .dz-t .maohao:after{
        content: "";
    }
    .info-overview-card .dz-t .value{
        display: block;
    }
</style>