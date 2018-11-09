<template>
    <div class="es-search">

        <el-input class="input-search" :placeholder="$t('message.sharder_please_select')" v-model="searchText" @keyup.enter.native="search">
            <el-select  v-model="searchType" slot="prepend" :placeholder="$t('message.sharder_please_inquiry')" class="searchType">
                <el-option :label="$t('message.sharder_block_height')" value="height"></el-option>
                <el-option label="Hash" value="hash"></el-option>
                <el-option :label="$t('message.sharder_trading_ID')" value="txId"></el-option>
                <el-option :label="$t('message.sharder_account_address')" value="account_addr"></el-option>
            </el-select>
            <i v-show="!searchTextIsEmpty()" slot="suffix" class="el-input__icon el-icon-circle-close-outline clone-search-text-btn" @click="searchText=''" ></i>

            <!--移动端-->
            <el-button v-if="isMobile()"  @click="searchMobile" class="es-search-btn" slot="append" :icon="searchTextIsEmpty() ?'el-icon-close' : 'el-icon-search'"></el-button>
            <!--pc 端-->
            <el-button v-else @click="search" class="es-search-btn" slot="append" icon="el-icon-search"></el-button>


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
            searchTextIsEmpty(){
                return Util.isEmpty(this.searchText);
            },
            isMobile(){
                return Util.isMobile();
            },
            searchMobile(){
                try {
                    this.$emit('searchText', this.searchText);
                } catch (e) {
                    console.log(e);
                }

                if(this.searchTextIsEmpty()){
                    return;
                }

                this.search();
            },
            search(){
                this.searchText = this.searchText.trim();


                if(this.searchTextIsEmpty()){
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
                axios.get(api.methods.getBaseUrl(api.ACCOUNT_INFO) + "&account=" +this.searchText, {withCredentials: true})
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
                axios.get(api.methods.getBaseUrl(api.TX) +"&txID="+this.searchText, {withCredentials: true})
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
                axios.get(api.methods.getBaseUrl(api.TX) +"&hash="+this.searchText, {withCredentials: true})
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
                axios.get(api.methods.getBaseUrl(api.BLOCK_BY_HEIGHT) + "&height=" + this.searchText, {withCredentials: true})
                    .then(res => {
                        if(Util.isEmpty(res.data.errorCode)){
                            res.data.transactionsDto = res.data.transactions;
                            delete res.data.transactions;
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
        },
        watch:{
            searchText(val, oldVal){

                if(val == null || val == ''){

                }
            },
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

    .es-search input:focus{
        border-color: #e4e4e4;
    }

    .es-search-btn{
        padding-left: 12px;
        padding-right: 12px;
    }
    .search-error-info{
        line-height: initial;
        z-index: 9999;
    }
    .clone-search-text-btn{
        margin-right: 10px;
    }


    /*移动版的样式  手机屏幕小于 768px start*/
    @media (max-width: 768px){
        .input-search .el-input{
            font-size: 12px;
        }
    }
    /*移动版的样式  手机屏幕小于 768px end*/


    /*非首页时使用此样式，在受首页需要写来覆盖*/
    /*移动版的样式  手机屏幕小于 768px start*/
    @media (max-width: 768px){
        .clone-search-text-btn{
            margin-right: 55px;
            font-size: 20px;
            line-height: 30px;
        }
        .es-search{
            width: 100%;
        }
        .es-search{
            position: fixed;
            padding-left: 10px;
            padding-right: 10px;
            width: calc(100% - 20px);
            left: 0;
            background: #4078cd;
            z-index: 9999;
            top: 0;
            height: 50px !important;
            line-height: 46px !important;
        }
        .es-search input{
            width: 95%;
            margin-right: initial;
        }
        .input-search input[type=text]{
            border-radius: 0 15px 15px 0;
        }
        .searchType input[type=text]{
            width: 100px;
            background-color: #fff;
        }
        .el-input-group__append{
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }
        .input-search .el-input-group__prepend{
            border-radius: 15px 0 0 15px;
        }
        .header-search .search-error-info{
            position: relative;
            top: 0px;
        }

    }
    /*移动版的样式  手机屏幕小于 768px end*/
</style>