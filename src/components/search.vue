<template>
    <div class="es-search">

        <el-input class="input-search" :placeholder="$t('message.sharder_please_select')" v-model="searchText" @keyup.enter.native="search">
            <el-select v-model="searchType" slot="prepend" :placeholder="$t('message.sharder_please_inquiry')" class="searchType">
                <el-option :label="$t('message.sharder_block_height')" value="height"></el-option>
                <el-option label="Hash" value="hash"></el-option>
                <el-option :label="$t('message.sharder_trading_ID')" value="txId"></el-option>
                <el-option :label="$t('message.sharder_account_address')" value="account_addr"></el-option>
            </el-select>
            <el-button @click="search" id="es-search" slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <el-alert
                :title="errorInfo"
                type="error"
                show-icon class="search-error-info" v-if="verrorInfo">
        </el-alert>

    </div>
</template>

<script>
    import axios from "axios";
    import api from '../assets/api';
    import Util from '../assets/js/util';
    export default {
        name: "search",
        data() {
            return {
                searchText:'',
                searchType:'',
                errorInfo:'',
                verrorInfo:false,
            }
        },
        methods:{
            search(){
                this.searchText = this.searchText.trim();
                if(Util.isEmpty(this.searchText)){
                    this.fail(this.$t('message.sharder_input_not_null'));
                    return;
                }
               switch (this.searchType){
                   case "height":
                       this.getBlockInfo();
                       break;
                   case "hash":
                       this.getTxinfoByHash();
                       break;
                   case "txId":
                       this.getTxinfoByTxid();
                       break;
                   case "account_addr":
                       this.getAccountInfo();
                       break;
                   default:
                       this.fail(this.$t('message.sharder_select_search_type'));
               }
            },
            getAccountInfo(){
                axios.get(api.ACCOUNT_INFO + "&account=" +this.searchText, {withCredentials: true})
                    .then(res => {
                        if(Util.isEmpty(res.data.errorCode)){
                            this.success("/address.html?addr=");
                        }else{
                            this.fail(this.$t('message.sharder_select_address_not_exist'));
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            getTxinfoByTxid(){
                axios.get(api.TX +"&txID="+this.searchText, {withCredentials: true})
                    .then(res => {
                        if(Util.isEmpty(res.data.errorCode)){
                            Util.storageTradeTxid(res.data);
                            this.success("/tx.html?txId=");
                        }else{
                            this.fail(this.$t('message.sharder_select_transaction_not_exist'));
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            getTxinfoByHash(){
                axios.get(api.TX +"&hash="+this.searchText, {withCredentials: true})
                    .then(res => {
                        if(Util.isEmpty(res.data.errorCode)){
                            Util.storageTrade(res.data);
                            this.success("/tx.html?hash=");
                        }else{
                            this.fail(this.$t('message.sharder_select_transaction_not_exist'));
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            getBlockInfo(){
                //如果本地存在这个区块高度的信息就不去服务器拉去
                if(Util.isNotEmpty(Util.getJsonLocalStorage(this.searchText))){
                    this.success("/block.html?height=");
                    return;
                }
                axios.get(api.BLOCK_BY_HEIGHT + "&height=" + this.searchText, {withCredentials: true})
                    .then(res => {
                        console.log(res);
                        if(Util.isEmpty(res.data.errorCode)){
                            Util.storageBlock(res.data);
                            this.success("/block.html?height=");
                        }else{
                            this.fail(this.$t('message.sharder_select_block_height_not_exist'));
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            success(_url){
                window.location=_url+this.searchText;
            },
            fail(_info){
                this.errorInfo = _info;
                this.verrorInfo =true;

                let that = this;
                setTimeout(function () {
                    that.errorInfo = "";
                    that.verrorInfo = false;
                },1500);
            }
        }
    }
</script>

<style>
    .input-search input[type=text]{
        margin-right: -2px;
    }
    .es-search {
        position: relative;
        display: inline-block;
        vertical-align: top;
    }
    .searchType input[type=text]{
        width: 130px;
        background-color: #fff;

    }
    .es-search input {
        width: 350px;
        height: 40px;
        border-radius: 20px;
    }

    .es-search input:focus {
        border-color: transparent;
    }

    #es-search{
        padding-left: 12px;
        padding-right: 12px;
    }

    .search-error-info{
        line-height: initial;
    }
</style>