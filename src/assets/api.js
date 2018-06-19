import axios from "axios";
import util from './js/util';

function url(path) {
    let baseUrl='';
    return baseUrl+path;
}

const api={
    BLOCK_HEIGHT:url("?requestType=getLastBlockHeight"),//获取区块最新高度
    BLOCK_BY_HEIGHT:url("?requestType=getBlockInfo"),//根据区块高度查询区块及交易信息
    SERVER_CONSTANT:url("?requestType=getBizConstants"),//获取区块链相关常量信息
    ADDR_TRANSACTION:url("?requestType=getAccountTxs"),//获取指定用户的交易数据
    BLOCK_INFO:url("?requestType=getBizBlocks"),//获取区块信息（含交易详情）
    ACCOUNT_INFO:url("?requestType=getAccountInfo"),//获取指定账户信息
    TX:url("?requestType=getTx"), //获取指定交易数据
    TX_STATISTICS:url("?requestType=getTxStatistics"), //获取统计数据

    methods:{
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
            axios.get(api.SERVER_CONSTANT,{withCredentials:true}).then(res=>{
                util.setJsonLocalStorage("SERVER_CONSTANT",res.data);
            }).catch(function (error) {
                console.log(error);
            })
        },
    }
}

api.methods.getServerConstant();
api.methods.getLastHeight();

export default api;


