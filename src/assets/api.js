import util from './js/util';
import axios from "axios";


// var baseUrl='http://13.228.74.150:8215/sharder';
// var baseUrl='https://biz.sharder.io/sharder';
var baseUrl='http://localhost:8080';
// var networkState = "beta";
var serviceURLs = [
    "/blocks/getLastBlockHeight.ss",
    "/blocks/getBizConstants.ss",
    "/blocks/getTxStatistics.ss",
    "/blocks/getBizBlocks.ss"
];


const api={

    // BLOCK_HEIGHT:"?requestType=getLastBlockHeight",//获取区块最新高度
    // SERVER_CONSTANT:"?requestType=getBizConstants",//获取区块链相关常量信息
    // TX_STATISTICS:"?requestType=getTxStatistics", //获取统计数据
    // SERVICE_BLOCK_INFO:"http://localhost:8080/blocks/getBizBlocks.ss", //获取区块信息
    // SERVICE_BLOCK_INFO:"https://sharder.org/blocks/getBizBlocks.ss", //获取区块信息
    BLOCK_BY_HEIGHT:"?requestType=getBlockInfo",//根据区块高度查询区块及交易信息
    ADDR_TRANSACTION:"?requestType=getAccountTxs",//获取指定用户的交易数据
    BLOCK_INFO:"?requestType=getBizBlocks",//获取区块信息（含交易详情）
    ACCOUNT_INFO:"?requestType=getAccountInfo",//获取指定账户信息
    BACKUPS_INFO:"?requestType=getBackup",//获取备份相关数据
    TX:"?requestType=getTx", //获取指定交易数据
    BLOCK_HEIGHT:"/blocks/getLastBlockHeight.ss",//获取区块最新高度
    SERVER_CONSTANT:"/blocks/getBizConstants.ss",//获取区块链相关常量信息
    TX_STATISTICS:"/blocks/getTxStatistics.ss", //获取统计数据
    SERVICE_BLOCK_INFO:"/blocks/getBizBlocks.ss", //获取区块信息


    methods:{
        transferNetwork(networkType){
            if (networkType === 'beta') {
                baseUrl = "https://biz.sharder.io/sharder";
                localStorage.setItem("networkState","beta");
            }else {
                baseUrl = "https://test.sharder.io/sharder";
                localStorage.setItem("networkState","alpha");
            }
        },
        getBaseUrl(path){
            let networkType = localStorage.getItem("networkState");
            let suffix = "";
            var isService = true;
            for (var i = 0; i < serviceURLs.length; i++) {
                if (serviceURLs[i] == path) {
                    baseUrl = "http://localhost:8080";
                    // baseUrl = "https://sharder.org";
                    isService = false;
                }
            }
            if (!isService) {
                if (networkType !== null) {
                    suffix = "?networkType="+networkType;
                }
            }
            if (isService) {
                if (networkType !== null){
                    this.transferNetwork(networkType);
                }
            }
            console.log(suffix)
            return baseUrl+path+suffix;
        },
        getLastHeight:function (_callBack) {
            axios.get(api.methods.getBaseUrl(api.BLOCK_HEIGHT)).then(res=>{

                localStorage.setItem("LAST_BLOCK_HEIGHT",res.data);
                if(typeof _callBack === 'function'){
                    _callBack(res.data);
                }
            }).catch(function (error) {
                console.log(error);
            })
        },
        getServerConstant:function () {
            axios.get(api.methods.getBaseUrl(api.SERVER_CONSTANT)).then(res=>{
                localStorage.setItem("SERVER_CONSTANT",res.data);
            }).catch(function (error) {
                console.log(error);
            })



        },
    }
}

function utilLoadEnd(){
    api.methods.getServerConstant();
}
api.methods.getLastHeight();


let apiInterval =  setInterval(function () {
    if(util){
        utilLoadEnd();
        clearInterval(apiInterval);
    }
},200);

export default api;


