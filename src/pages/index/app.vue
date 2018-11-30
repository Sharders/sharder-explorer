<template>
    <el-container id="app"  class="page-container">
        <el-header></el-header>
        <el-main>
            <el-row class="index-head">
                <el-col class="es-main">
                    <div class="content">
                        <h1 class="s-title" v-if="isPc()">{{$t('message.sharder_block_browser')}}</h1>
                        <h1 class="s-title" v-else>{{$t('message.sharder_block_browser_mobile')}}</h1>

                        <p class="s-info">{{$t('message.sharder_block_check_details')}}</p>

                        <div class="hidden-xs-only">
                            <es-search></es-search>
                        </div>

                    </div>
                </el-col>
            </el-row>

            <el-row class="search-mobile-index hidden-sm-and-up">
                <es-search></es-search>
            </el-row>
            <!--豆匣网络数据统计模板-->
            <statistical></statistical>
            <el-row class="es-main block-list-main">
                <h2 class="main-title"><img src="https://apron-store.oss-cn-hangzhou.aliyuncs.com/sharder/img/block.png"/><span style="margin-left: 40px;">{{$t('message.sharder_block_list')}}</span>
                </h2>

                <!--首页区块列表table  pc-->
                <el-table :data="blockInfo" style="width: 100%" class="table hidden-xs-only" v-loading="loading">

                    <el-table-column  :label="this.$t('message.sharder_block_height')" width="120px">
                        <template slot-scope="scope">
                            <a class="es-link" :href="'block.html?height='+scope.row.height">
                               {{scope.row.height}}
                            </a>
                        </template>
                    </el-table-column>

                    <el-table-column prop="blockId" :label="this.$t('message.sharder_block_hash')"></el-table-column>
                    <el-table-column :label="$t('message.sharder_time')">
                        <template slot-scope="scope">
                            {{new Date().BlockDate(scope.row.timestamp)}}
                        </template>
                    </el-table-column>

                    <el-table-column width="250px" prop="generatorRS" :label="this.$t('message.sharder_piece')"></el-table-column>

                    <el-table-column :label="this.$t('message.sharder_block_size')" width="100px">
                        <template slot-scope="scope">
                            {{Number().FileSizeFormatStr(scope.row.payloadLength)}}
                        </template>
                    </el-table-column>

                    <el-table-column width="140px" :label="this.$t('message.sharder_trading_type')" :render-header="PCrenderHeader">
                        <template slot-scope="scope">
                                <el-tag size="mini" v-if="scope.row.txTransfer == 1" type="primary">{{$t('message.sharder_transfer')}}</el-tag>

                                <el-tag size="mini" v-if="scope.row.txStorage == 1" type="success">{{$t('message.sharder_storage')}}</el-tag>

                                <el-tag size="mini" v-if="scope.row.txCoinBase == 1" type="warning">{{$t('message.sharder_coin_base')}}</el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column  :label="this.$t('message.sharder_operation')" width="80px">
                        <template slot-scope="scope">
                            <a :href="'block.html?height='+scope.row.height">
                                <el-button type="text" size="small">{{$t('message.sharder_check_details')}}</el-button>
                            </a>
                        </template>
                    </el-table-column>
                </el-table>

                <!--首页区块列表table  移动-->
                <div>

                    <el-table :data="blockInfo" style="width: 100%" class="table hidden-sm-and-up block-table-mobile" v-loading="loading">

                        <el-table-column  :label="this.$t('message.sharder_block_height_mobile')" width="60px">
                            <template slot-scope="scope">
                                <a class="es-link" :href="'block.html?height='+scope.row.height">
                                    {{scope.row.height}}
                                </a>
                            </template>
                        </el-table-column>

                        <el-table-column :label="$t('message.sharder_block_time')">
                            <template slot-scope="scope">
                                {{new Date().BlockDate(scope.row.timestamp)}}
                            </template>
                        </el-table-column>

                        <el-table-column  :label="this.$t('message.sharder_block_size')">
                            <template slot-scope="scope">
                                {{Number().FileSizeFormatStr(scope.row.payloadLength)}}
                            </template>
                        </el-table-column>

                        <el-table-column  :render-header="MOrenderHeader">
                            <template slot-scope="scope">
                            <span v-for="type in scope.row.types" >
                                <el-tag size="mini" v-if="type == '0'" type="primary">{{$t('message.sharder_transfer')}}</el-tag>

                                <el-tag size="mini" v-if="type == '6'" type="success">{{$t('message.sharder_storage')}}</el-tag>

                                <el-tag size="mini" v-if="type == '9'" type="warning">{{$t('message.sharder_coin_base')}}</el-tag>

                            </span>
                            </template>
                        </el-table-column>

                    </el-table>

                </div>
            </el-row>
            <el-row  class="es-main">
                    <el-pagination  @pagingParams="paging" :totalNum="totalNum" :currentPage="currentPage"></el-pagination>
            </el-row>
        </el-main>
        <el-footer>Footer</el-footer>
    </el-container>
</template>
<script>
    import elHeader from 'components/header.vue'
    import elFooter from 'components/footer.vue'
    import search from 'components/search.vue'

    import axios from "axios";
    import api from '../../assets/api';
    import Util from '../../assets/js/util';
    import '../../assets/css/es.css';
    import pagination from 'components/pagination.vue'

    import statistical11 from 'components/statistical_data.vue'

    export default {
        components: {
            'el-header': elHeader, "el-footer": elFooter,"el-pagination":pagination ,"es-search":search,"statistical":statistical11
        },

        data() {
            return {
                totalNum:0,
                blockInfo: [],
                tradingType:"",
                searchText:'',
                loading: true,
                currentPage:1,
                firstNum:0,
                lastNum:0,
                type:"",
            }
        },
        methods: {

            PCrenderHeader(h,para) {
                var _this = this;
                var netWork = Util.getLocalStorage("networkState");
                if (netWork == "alpha") {
                    return (
                        h('span',[
                            h('el-select',{
                                attrs: {
                                    placeholder:this.$t('message.sharder_trading_type'),
                                    size:"mini"
                                },
                                "class":{
                                    "tx-type-PC":true
                                },
                                on:{
                                    change:function (type) {
                                        _this.type = type;
                                        _this.loading = true;
                                        _this.currentPage = 1;
                                        _this.getTxInfo(0,_this.lastNum,type);
                                    }
                                },
                            },[
                                h('el-option',{
                                    attrs: {   //可以用props:{value:"xxx"}直接将值设置到组件当中
                                        label:this.$t('message.sharder_all'),
                                        value: ""
                                    }
                                }),
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_coin_base'),
                                        value: "9"
                                    }
                                }),
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_transfer'),
                                        value: "0"
                                    }
                                }),
                            ]),

                        ],'')
                    )
                }else {
                    return (
                        h('span',[
                            h('el-select',{
                                attrs: {
                                    placeholder:this.$t('message.sharder_trading_type'),
                                    size:"mini"
                                },
                                "class":{
                                    "tx-type-PC":true
                                },
                                on:{
                                    change:function (type) {
                                        _this.type = type;
                                        _this.loading = true;
                                        _this.currentPage = 1;
                                        _this.getTxInfo(0,_this.lastNum,type);

                                    }
                                },
                            },[
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_all'),
                                        value: ""
                                    }
                                }),
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_transfer'),
                                        value: "0"
                                    }
                                }),
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_storage'),
                                        value: "6"
                                    }
                                })
                            ]),

                        ],'')
                    )
                }

            },
            MOrenderHeader(h,para) {
                var _this = this;
                var netWork = Util.getLocalStorage("networkState");
                if (netWork == "alpha") {
                    return (
                        h('span',[
                            h('el-select',{
                                attrs: {
                                    placeholder:this.$t('message.sharder_trading_type'),
                                    size:"mini"
                                },
                                "class":{
                                    "tx-type-MO":true
                                },
                                on:{
                                    change:function (type) {
                                        _this.type = type;
                                        _this.loading = true;
                                        _this.currentPage = 1;
                                        _this.getTxInfo(0,_this.lastNum,type);
                                    }
                                },
                            },[
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_all'),
                                        value: ""
                                    }
                                }),
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_coin_base'),
                                        value: "9"
                                    }
                                }),
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_transfer'),
                                        value: "0"
                                    }
                                })
                            ]),

                        ],'')
                    )
                }else {
                    return (
                        h('span',[
                            h('el-select',{
                                attrs: {
                                    placeholder:this.$t('message.sharder_trading_type'),
                                    size:"mini"
                                },
                                "class":{
                                    "tx-type-MO":true
                                },
                                on:{
                                    change:function (type) {
                                        _this.type = type;
                                        _this.loading = true;
                                        _this.currentPage = 1;
                                        _this.getTxInfo(0,_this.lastNum,type);
                                    }
                                },
                            },[
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_all'),
                                        value: ""
                                    }
                                }),
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_transfer'),
                                        value: "0"
                                    }
                                }),
                                h('el-option',{
                                    attrs: {
                                        label:this.$t('message.sharder_storage'),
                                        value: "6"
                                    }
                                })
                            ]),

                        ],'')
                    )
                }

            },
            isPc(){
                return Util.isPC();
            },
            getTxInfo(firstIndex,lashIndex,type) {
                this.firstNum = firstIndex;
                this.lastNum = lashIndex;
                var includeTypes = "";
                if (type !== undefined && type !== ""){
                    includeTypes = "&includeTypes=" + type;
                }
                let _this = this;
                if (firstIndex == undefined && lashIndex == undefined) {
                    firstIndex = 0;
                    lashIndex = 9;
                }
                axios.get(api.methods.getBaseUrl(api.SERVICE_BLOCK_INFO) +"&firstIndex="+ (firstIndex/10 + 1) + "&lastIndex=" + 10 + includeTypes)
                // axios.get(api.SERVICE_BLOCK_INFO +"?firstIndex="+ (firstIndex/10 + 1) + "&lastIndex=" + 10 + includeTypes)
                    .then(res => {
                        _this.loading = false;
                        Util.setlocalStorage("prevBlockTime", this.prevBlockTime(res.data.list));
                        Util.setlocalStorage("avgBlockTime", this.avgBlockTime(res.data.list));
                        this.blockInfo = res.data.list;
                        this.totalNum = res.data.totalCount;
                        this.handleBlockIncludeOfOrderType(this.blockInfo);
                        Util.storageBlocks(res.data.list);
                    }).catch(function (error) {
                        _this.loading = false;
                        console.log(error);
                    });
            },
            paging(firstIndex,lashIndex){
                this.loading = true;
                this.currentPage = firstIndex/10 + 1;
                this.getTxInfo(firstIndex,lashIndex,this.type);
            },
            prevBlockTime(data){

               return (data[0].timestamp - data[1].timestamp) * 1000;

            },
            avgBlockTime(data){
                let sum = 0;
                for (let i=0;i<data.length -1;i++)
                {
                    sum += (data[i].timestamp - data[i+1].timestamp);
                }
                return ((sum / data.length) * 1000);
            },
            handleBlockIncludeOfOrderType(_data){
                for (let i = 0; i < _data.length; i++) {
                    let transac = _data[i].transactionsDto;
                    if (transac == null) {
                        continue;
                    }
                    let IncludeOfType = new Array();
                    for (let k = 0; k < transac.length; k++) {
                        if(IncludeOfType.indexOf(transac[k].type) < 0){
                            IncludeOfType.push(transac[k].type);
                        }
                    }

                    _data[i].types  = IncludeOfType;
                }
            }
        },
        created() {
            this.getTxInfo(pagination.data().firstIndex,pagination.data().lastIndex);
        },
    }
</script>

<style lang="postcss">

    .tx-type-PC{
        width: 126px;
        margin-left: -25px;
    }
    .tx-type-PC > .el-input > .el-input__inner{
        width: 94px;
    }
    .tx-type-MO{
        width: 135px;
        margin-left: -30px;
    }
    .tx-type-MO > .el-input{
        width: 105px;
    }
    .tx-type-MO > .el-input > .el-input__inner{
        padding-right: 20px;
    }
    .tx-type-MO > .el-input > .el-input__suffix > .el-input__suffix-inner > .el-icon-arrow-up{
        width: 34px;
    }
    .es-main > .table {
        border-radius: initial;
        box-shadow: initial;
        border: initial;
    }
    .es-header .es-search{
        display: none;
    }
    .index-head {
        height: 400px;
        background: url("https://apron-store.oss-cn-hangzhou.aliyuncs.com/sharder/img/banner.png");
    }

    .index-head .content {
        text-align: left;
        margin-top: 100px;
        /*margin-left: 100px;*/
        color: #FFF;
    }

    .index-head .s-info {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .index-head .es-main {
        height: 100%;
        border: 1px solid transparent;
        float: initial;
        background-image: url("https://apron-store.oss-cn-hangzhou.aliyuncs.com/sharder/img/head_back.png");
        background-repeat: no-repeat;
        background-position-x: right;
        background-position-y: 30px;
    }

    .main-title {
        font-size: 18px;
        color: #333;
        position: relative;
    }

    .main-title img {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
    }

    .block-list-main {
        margin-top: 20px;
    }
    .es-header{
        border-bottom: 1px solid #fff3;
    }

    .tx_type_tag{
        margin-left: 2px;
        margin-right: 2px;
    }

    /*移动版的样式  手机屏幕小于 768px start*/
    @media (max-width: 768px){
        .show-mobile-search{
            display: none;
        }
        .nav-lang{
            display: block !important;
        }
        .main-title{
            margin-top: 15px !important;
            margin-bottom: 10px !important;
        }
        .index-head{
            background: url("https://apron-store.oss-cn-hangzhou.aliyuncs.com/sharder/img/mobile/banner@2x.png") no-repeat;
            background-size: 100%;
            height: 150px;
        }
        .index-head .content{
            margin-top: 40px;
        }
        .index-head .content .s-title{
            font-size: 21px;
            margin: initial;
        }
        .index-head .s-info{
            font-size: 12px;
            margin: initial;
        }
        .index-head .es-main{
            background-image: none;
        }
        .search-mobile-index .es-search input{
            width: 100%;
             margin-right: initial;
        }
        .searchType input[type=text]{
            width: 100px;
            background-color: #fff;
        }

        .search-mobile-index{
            padding-left: 10px;
            padding-right: 10px;
            margin-top: 20px;
            text-align: center;
        }
        .search-mobile-index .es-search{
            display: inline-block !important;

            position: initial;
            padding-left:initial;
            padding-right: initial;
            width: initial;
            left: initial;
            background: initial;
            z-index: initial;
            top: initial;
            height: initial;
            line-height: initial;
        }
        .search-mobile-index .es-search-btn .el-icon-close:before{
            content: "\E619";
        }
        .clone-search-text-btn{
            margin-right: initial;
        }
        .input-search .el-input-group__prepend{
            border-radius: initial;
        }
        .input-search input[type=text]{
            border-radius: initial;
        }
        .input-search .el-input-group__append{
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        .block-item-mobile {
            margin-bottom: 5px;
        }
        .block-item-mobile .item .el-card__body{
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            padding: 10px;
        }
        .block-table-mobile{
            font-size: 12px;
        }
    }


    /*移动版的样式  手机屏幕小于 768px end*/
</style>
