import util from './js/util';
import axios from "axios";


// var baseUrl='http://13.228.74.150:8215/sharder';
var baseUrl='https://biz.sharder.io/sharder';
var networkState = "beta";

const api={

    BLOCK_HEIGHT:"?requestType=getLastBlockHeight",//获取区块最新高度
    BLOCK_BY_HEIGHT:"?requestType=getBlockInfo",//根据区块高度查询区块及交易信息
    SERVER_CONSTANT:"?requestType=getBizConstants",//获取区块链相关常量信息
    ADDR_TRANSACTION:"?requestType=getAccountTxs",//获取指定用户的交易数据
    BLOCK_INFO:"?requestType=getBizBlocks",//获取区块信息（含交易详情）
    ACCOUNT_INFO:"?requestType=getAccountInfo",//获取指定账户信息
    TX:"?requestType=getTx", //获取指定交易数据
    TX_STATISTICS:"?requestType=getTxStatistics", //获取统计数据
    BACKUPS_INFO:"?requestType=getBackup",//获取备份相关数据

    methods:{
        transferNetwork(networkTyp){  //切换分为:主动切换（首页右上方点击网络切换），被动切换:点击交互按钮时判断localStorage来切换
            if (networkTyp === 'beta') {
                baseUrl = "https://biz.sharder.io/sharder";
                util.setlocalStorage("networkState",'beta');
            }else {
                baseUrl = "https://test.sharder.io/sharder";
                util.setlocalStorage("networkState",'alpha');
            }
        },
        getBaseUrl(path){
            let networkState = util.getLocalStorage("networkState");
            if (networkState !== null){
                this.transferNetwork(networkState);  //开启切换网络
            }
            return baseUrl+path;
        },
        getLastHeight:function (_callBack) {
            axios.get(api.BLOCK_HEIGHT,{withCredentials:true}).then(res=>{
                util.setlocalStorage("LAST_BLOCK_HEIGHT",res.data.height);

                if(typeof _callBack === 'function'){
                    _callBack(res.data);
                }
            }).catch(function (error) {
                console.log(error);
            })
        },
        getServerConstant:function () {
            axios.get(api.methods.getBaseUrl(api.SERVER_CONSTANT),{withCredentials:true}).then(res=>{
                util.setJsonLocalStorage("SERVER_CONSTANT",res.data);
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


