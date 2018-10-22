<template>
    <el-header class="es-header">
        <div class="es-header-main">

            <div class="header-logo">
                <a href="/" class="title"><img :src="logoImg" class="nav-logo"/>
                    <span class="t">
                        <h1 class="t-m">Sharder</h1>
                        <h2 class="t-d">Sharder Block Explorer</h2>
                    </span>
                </a>
                <span class="alpha" v-if="netWork == null">beta</span>
                <span class="alpha" v-else >{{netWork}}</span>
            </div>
            <es-search class="header-search" :class="{ show_mobile_search_block: show_mobile_search }" @searchText="searchText"></es-search>

            <el-button @click="show_mobile_search=true" class="show-mobile-search hidden-sm-and-up"  icon="el-icon-search" circle></el-button>

            <el-dropdown class="nav-dropdown nav-lang el-dropdown" trigger="click"  @command="changeLang">
            <span  class="el-dropdown-link" role="button">
                {{$t('message.sharder_language')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="cn">中文</el-dropdown-item>
                    <el-dropdown-item command="en">English</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown class="nav-dropdown nav-lang el-dropdown network" trigger="click"  @command="changeNetwork">
            <span  class="el-dropdown-link" role="button">
                {{$t('message.sharder_select_network')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="alpha">Alpha</el-dropdown-item>
                    <el-dropdown-item command="beta">Beta</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-header>
</template>

<script>
    import Util from '../assets/js/util';
    import logo from 'assets/img/logo.png'
    import search from "./search.vue";
    import api from '../assets/api';
    import index from '../pages/index/app.vue';

    export default {
        name: "es-header",

        components: {
            'es-search': search
        },

        data(){
            return {
                show_mobile_search:false,
                logoImg: logo,
                netWork: Util.getLocalStorage("networkState")
            }
        },
        methods:{
            changeLang(_select){
                this.$i18n.locale = _select;
                Util.setlang(_select);
                console.info("语言切换成:" + this.$i18n.locale);
            },
            changeNetwork(_select){
                api.methods.transferNetwork(_select);
                index.methods.getTxInfo();
                window.location.reload();
            },
            searchText(_data){
                if(_data == null || _data == ''){
                    this.show_mobile_search = false;
                }
            }
        }
    }
</script>

<style scoped>

    .network{
        margin-right: 30px;
    }

    .es-header{
        background-color: #4078cd;
        color: #FFF;
        /*line-height: 80px;*/
        height: 80px !important;
    }
    .es-header .title{
        font-size: 30px;
        display: inline-block;
        vertical-align: top;
        color: #FFF;
        text-decoration: none;
        z-index: 99;
        height: 80px;
    }
    .es-header-main{
        max-width: 1200px;
        width: 100%;
        margin: auto;
        position: relative;
    }
    .nav-logo{
        position: relative;
        vertical-align: middle;
        /*margin-right: 10px;*/
        z-index: 999;
    }
    .nav-lang{
        float: right;
        color: #FFF;
        cursor: pointer;
    }
    .es-search,.nav-lang{
        height: 80px;
        line-height: 80px;
    }

    /*移动版的样式  手机屏幕小于 768px start*/
    @media (max-width: 768px){
        .network{
            margin-right: 15px;
        }
        .nav-lang{
            height: 50px;
            line-height: 50px;
            display: none;
            font-size: small;
        }
        .es-header{
            height: 50px !important;
        }
        .header-logo .nav-logo{
            margin-top: initial;
        }
        .es-header .title{
            height: 40px;
            margin-top: 6px;
        }

        /* TODO 下面这段css 比较糟糕，日后再来重构*/
        .es-header-main{
            position: initial;
        }
        .alpha{
            left: 130px;
        }
    }
    /*移动版的样式  手机屏幕小于 768px end*/
</style>

<style>

    .header-logo .t{
        display: inline-block;
        margin-top: 19px;
        vertical-align: top;
    }
    .header-logo .t .t-m,.header-logo .t .t-d{
        margin: initial;

    }
    .header-logo .t .t-m{
        font-size: 24px;
    }
    .header-logo .t .t-d{
        font-size: 13px;
        font-weight: initial;
        color: #ddd;
    }
    .header-logo{
        display: inline-block;
    }
    .header-logo .nav-logo{
        width: 40px;
        margin-top: 20px;
    }
    .header-search  .el-input input{
        height: 36px;
    }
    .header-search .s-s{
        height: 36px;
        width: 36px;
        top: 49%;
        padding: 10px;
    }
    .header-search{
        margin-left: 20px;

    }
    .header-search .search-error-info{
        position: absolute;
        width: 100%;
        top: 60px;
    }
    .alpha{
        position: absolute;
        bottom: 0;
        left: 142px;
        top: 30px;
        z-index: 1;
        line-height: 16px;
        font-size: 12px;
        color: #ddd;
        font-style: italic;
        height: 16px;
    }



    /*移动版的样式  手机屏幕小于 768px start*/
    @media (max-width: 768px){
        .header-search  .el-input input {
            height: 30px;
        }
        .show-mobile-search{
            position: absolute;
            right: 15px;
            top: 5px;
        }

        .header-logo .t .t-m{
            font-size: 18px;
        }
        .header-logo .t{
            margin-top: initial;
        }
        .header-logo .nav-logo{
            width: 30px;
        }
        .header-logo .t .t-d{

        }
        .alpha{
            top: 11px;
            left: 110px;
        }

        .header-search{
            display: none !important;
            margin-left: initial;
        }
        .show_mobile_search_block{
            display: inline-block !important;
        }
    }
    /*移动版的样式  手机屏幕小于 768px end*/


    .show_mobile_search_block{
        display: inline-block !important;
    }
</style>
