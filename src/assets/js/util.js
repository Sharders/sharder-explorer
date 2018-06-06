// import axios from "axios";
// import api from '../../assets/api';
const util = {

    //获取地址栏参数
    /**
     * @return {string}
     */
    GetUrlParam : function (name){
        let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if(r!=null){
            return  decodeURI(r[2]);
        }
        return "";
    },
    jsonDeepCopy : function(obj){
        if(this.isNotEmpty(obj)){
            let newObj = JSON.stringify(obj);
            return JSON.parse(newObj);
        }
        return "";

    },
    setJsonLocalStorage:function (key,val) {
        try {
            localStorage.setItem(key,JSON.stringify(val));
        }catch (e) {
            console.warn("The browser does not support cookies.");
            return null;
        }

    },

    getJsonLocalStorage:function (key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        }catch (e) {
            console.warn("The browser does not support cookies.");
            return null;
        }
    },

    setlocalStorage:function(key,val){
        try {
            localStorage.setItem(key,val);
        }catch (e) {
            console.warn("The browser does not support cookies.");
            return null;
        }
    },
    getLocalStorage:function (key) {
        try {
           return localStorage.getItem(key);
        }catch (e) {
            console.warn("The browser does not support cookies.");
            return null;
        }
    },
    setlang:function(_lang){
        try {
         localStorage.lang = _lang;
        } catch (e) {
            console.warn("The browser does not support cookies.");
            return null;
        }
    },
    lang:function(){
        try {
            return localStorage.lang;
        } catch (e) {
            console.warn("The browser does not support cookies.");
            return null;
        }
    },
    // 存储区块信息用高度作为key
    storageBlocks:function (_blocks) {
        for (let i=0;i<_blocks.length;i++)
        {
            console.log("存储一组区块");
            this.setJsonLocalStorage(_blocks[i].height,_blocks[i]);
        }
    },
    storageBlock:function(_blocks){
        console.log("存储一个区块");
        this.setJsonLocalStorage(_blocks.height,_blocks);
    },
    getBlockInfoById:function (_height) {
        let blocks = this.getJsonLocalStorage(_height);
        if(blocks != null){
            return blocks;
        }
    },

    storageTrade:function(_transaction) {
        if(this.isNotEmpty(_transaction)){
            for (let i=0;i<_transaction.length;i++)
            {
                this.setJsonLocalStorage(_transaction[i].hash,_transaction[i]);
            }
        }
    },
    storageTradeTxid:function(_transaction) {
        if(this.isNotEmpty(_transaction)){
            for (let i=0;i<_transaction.length;i++)
            {
                this.setJsonLocalStorage(_transaction[i].transactionId,_transaction[i]);
            }
        }
    },
    isNotEmpty:function (params) {
        if(params != null && params != "" && params != undefined && typeof params !="undefined"){
            return true;
        }else{
            return false;
        }
    },
    isEmpty:function(params){
        return !this.isNotEmpty(params);
    },
    // getServerConstant:function () {
    //     axios.get(api.SERVER_CONSTANT,{withCredentials:true}).then(res=>{
    //         this.setJsonLocalStorage("SERVER_CONSTANT",res.data);
    //     }).catch(function (error) {
    //         console.log(error);
    //     })
    // },

}
//
// util.getServerConstant();
export default util;

Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.BlockDate = function (_timestamp) {
    _timestamp *= 1000;
    let times = 1471305600000;
    times += _timestamp;
    if(isNaN(times)){
        times = 0;
    }
    return new Date(times).Format("yyyy-MM-dd hh:mm:ss");
}


Number.prototype.amountFormat = function(_cent){

    // var oldYuan = (parseInt(_cent)/100).toString();
    var oldYuan = (parseInt(_cent)).toString();

    if(isNaN(oldYuan)){
        return _cent;
    }

    var yuan = "";
    var count = 0;

    if(oldYuan.indexOf(".")==-1){
        for(var i=oldYuan.length-1;i>=0;i--){
            if(count % 3 == 0 && count != 0){
                yuan = oldYuan.charAt(i) + "," + yuan;
            }else{
                yuan = oldYuan.charAt(i) + yuan;
            }
            count++;
        }
        // oldYuan = yuan + ".00"; //自动补小数点后两位
        if(yuan.startsWith("-,")){
            yuan = yuan.replace("-,","-")
        }
        return yuan;
    }
    else
    {
        for(var i = oldYuan.indexOf(".")-1;i>=0;i--){
            if(count % 3 == 0 && count != 0){
                yuan = oldYuan.charAt(i) + "," + yuan;
            }else{
                yuan = oldYuan.charAt(i) + yuan; //逐个字符相接起来
            }
            count++;
        }
        oldYuan = yuan + (oldYuan + "00").substr((oldYuan + "00").indexOf("."),3);
        return oldYuan;
    }
}

