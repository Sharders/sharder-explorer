import axios from "axios";
import api from '../../assets/api';
const util = {

    //获取地址栏参数
    /**
     * @return {string}
     */
//     function IsPC() {
//     var userAgentInfo = navigator.userAgent;
//     var Agents = ["Android", "iPhone",
//         "SymbianOS", "Windows Phone",
//         "iPad", "iPod"];
//     var flag = true;
//     for (var v = 0; v < Agents.length; v++) {
//         if (userAgentInfo.indexOf(Agents[v]) > 0) {
//             flag = false;
//             break;
//         }
//     }
//     return flag;
// }

    isPC:function(){
        let sUserAgent = navigator.userAgent.toLowerCase();
        let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        let bIsMidp = sUserAgent.match(/midp/i) == "midp";
        let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        let bIsAndroid = sUserAgent.match(/android/i) == "android";
        let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) ){
           return true;
        } else {
            return false;
        }
    },
    isMobile(){
      return !this.isPC();
    },
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
            this.setJsonLocalStorage(_blocks[i].height,_blocks[i]);
        }
    },
    storageBlock:function(_blocks){
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
}

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
    let times = getRootTimestamp();
    times += _timestamp;
    if(isNaN(times)){
        times = 0;
    }
    return new Date(times).Format("yyyy-MM-dd hh:mm:ss");
}

function msTohhmmss(_timestamp){
    var _json = new Object();

    // 毫秒
    if(_timestamp < 1000){
        _json.number = _timestamp;
        _json.unit = "Ms";
        return _json;
    }
    // 秒
    if(_timestamp >=1000 && _timestamp < 60000){
        _json.number = (_timestamp / 1000);
        _json.unit = "S";
        return _json;
    }

    // 分
    if(_timestamp >=60000 && _timestamp < 3600000){
        _json.number = (_timestamp / 60000);
        _json.unit = "Min";
        return _json;
    }else{
        // 时
        _json.number = (_timestamp / 3600000);
        _json.unit = "H";
        return _json;
    }


    if(_timestamp >=1000 && _timestamp < 60000){
        _json.number = (_timestamp / 1000);
        _json.unit = "S";
        return _json;
    }
}
Date.prototype.msTohhmmssStr = function (_timestamp){
    if(_timestamp == null || _timestamp == ""){
        return "";
    }
    _timestamp = parseInt(_timestamp);
    if(_timestamp >= 3600000){
        return new Date(_timestamp).Format("dd (h) mm (min)ss (s)");
    }
    return new Date(_timestamp).Format("mm (min)ss (s)");
}
/**
 * 文件大小格式化  把数字太大的转换为 kb mb gb
 * @param _size   单位是byte
 * @constructor
 * @return 返回的值不会加上单位字符串
 */
Number.prototype.FileSizeFormat = function(_size){
        let j = fileSizeFormat(_size);

        return j.number;
}
/**
 * 文件大小格式化  把数字太大的转换为 kb mb gb
 * @param _size   单位是byte
 * @constructor
 *
 *@return  返回的值上会加上单位字符串
 */
Number.prototype.FileSizeFormatStr = function(_size){
        let j = fileSizeFormat(_size);
        let num = j.number;
        let unit = j.unit;

        return num + " ("+unit+")";
}


/**
 * 1024 b = 1kb
 * 1048576 b = 1mb
 * 1073741824 b = 1gb
 * @param _size
 */
function fileSizeFormat(_size){
    var _json = new Object();

    if(_size == "" || _size == null){
        _json.number = 0;
        _json.unit = "byte";
        return _json
    }

    // b
    if(_size < 1024){
        _json.number = _size;
        _json.unit = "byte";

        return _json;
    }
    // kb
    if(_size >=1024 && _size  < 1048576 ){
        _json.number = (_size / 1024).toFixed(3);
        _json.unit = "kb";

        return _json;
    // mb
    }else if(_size < 1073741824){
        _json.number = (_size / 1024 / 1024).toFixed(3);
        _json.unit = "mb";
        return _json;
    //gb
    }else {
        _json.number = (_size / 1024 / 1024 / 1024).toFixed(3);
        _json.unit = "gb";
        return _json;
    }

}

/**
 * 金额格式转换  千进制
 * @param _cent
 * @returns {*}
 */
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

function getRootTimestamp() {
    let constant = util.getJsonLocalStorage("SERVER_CONSTANT");

    if(constant != null && constant != ""){
        return constant.epochBeginning;
    }

    return 1471305600000;
}
