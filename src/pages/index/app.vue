<template>
    <el-container id="app"  class="page-container">
        <el-header></el-header>
        <el-main>
            <el-row class="index-head">
                <el-col class="es-main">
                    <div class="content">
                        <h1 class="s-title">{{$t('message.sharder_block_browser')}}</h1>
                        <p class="s-info">{{$t('message.sharder_block_check_details')}}</p>
                        <es-search></es-search>
                    </div>
                </el-col>
            </el-row>

            <statistical>

            </statistical>
            <el-row class="es-main block-list-main">
                <h2 class="main-title"><img src="https://apron-store.oss-cn-hangzhou.aliyuncs.com/sharder/img/block.png"/><span style="margin-left: 40px;">{{$t('message.sharder_block_list')}}</span>
                </h2>
                <el-table :data="blockInfo" style="width: 100%" class="table" v-loading="loading">

                    <el-table-column  :label="this.$t('message.sharder_block_height')">
                        <template slot-scope="scope">
                            <a class="es-link" :href="'block.html?height='+scope.row.height">
                               {{scope.row.height}}
                            </a>
                        </template>
                    </el-table-column>


                    <el-table-column prop="blockId" :label="this.$t('message.sharder_block_hash')"
                                     ></el-table-column>

                    <el-table-column :label="$t('message.sharder_time')">
                        <template slot-scope="scope">
                            {{new Date().BlockDate(scope.row.timestamp)}}
                        </template>
                    </el-table-column>

                    <el-table-column width="250px" prop="generatorRS" :label="this.$t('message.sharder_piece')"></el-table-column>


                    <el-table-column  :label="this.$t('message.sharder_block_size')">
                        <template slot-scope="scope">
                            {{Number().FileSizeFormatStr(scope.row.payloadLength)}}
                        </template>
                    </el-table-column>

                    <el-table-column  :label="this.$t('message.sharder_operation')">
                        <template slot-scope="scope">
                            <a :href="'block.html?height='+scope.row.height">
                                <el-button type="text" size="small">{{$t('message.sharder_check_details')}}</el-button>
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @pagingParams="paging" :totalNum="totalNum"></el-pagination>
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
                blockInfo: [{}],
                searchText:'',
                loading: true
            }
        },
        methods: {
            getTxInfo(firstIndex,lashIndex) {
                axios.get(api.BLOCK_INFO +"&firstIndex="+ firstIndex + "&lastIndex=" + lashIndex, {withCredentials: true})
                    .then(res => {
                        this.blockInfo = res.data;

                        console.log(this.blockInfo);
                        Util.storageBlocks(res.data);
                        if(firstIndex == 0){
                            this.totalNum = res.data[0].height;
                            Util.setlocalStorage("prevBlockTime",this.prevBlockTime(res.data));
                            Util.setlocalStorage("avgBlockTime",this.avgBlockTime(res.data));
                        }

                        this.loading = false;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            paging(firstIndex,lashIndex){
                this.getTxInfo(firstIndex,lashIndex);
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
            }
        },
        created() {
            this.getTxInfo(pagination.data().firstIndex,pagination.data().lastIndex);
        },
    }
</script>

<style lang="postcss">

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
</style>
