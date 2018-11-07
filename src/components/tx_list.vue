<template>
    <div>
        <div class="tx-type-select-group" style="margin-top:20px">
            <el-radio-group v-model="filterTypeRadio" @change="filterType" size="small" class="tx-type-select-block">
                <el-radio-button class="select-btn" v-if="netWork == 'alpha'" :label="$t('message.sharder_coin_base')" @click.native="selectedType='cb'"></el-radio-button>
                <el-radio-button class="select-btn"  :label="$t('message.sharder_transfer')" @click.native="selectedType='zz'"></el-radio-button>
                <el-radio-button class="select-btn"  :label="$t('message.sharder_storage')"  @click.native="selectedType='cc'"></el-radio-button>
            </el-radio-group>
        </div>

        <!------------------------------------------pc 端的转账存储 start------------------------------------------------------>
        <!--coin base-->
        <el-table :data="transactionsData" class="table hidden-xs-only" v-show="selectedType === 'cb'">
            <!--折叠面板-->
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="to-form">
                        <el-form-item :label="$t('message.sharder_initiator')" class="form">
                            <a :href="'/address.html?addr='+props.row.sender" class="es-link" ><span>{{ props.row.sender }}</span></a>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <!--交易id-->
            <el-table-column prop="hash" :label="$t('message.sharder_trading_hash')">
                <template slot-scope="scope">
                    <a class="hash" :href="'/tx.html?hash='+scope.row.hash+'&type=zz'">
                        <el-button type="text" size="small">{{scope.row.hash}}</el-button>
                    </a>
                </template>
            </el-table-column>
            <!--����id-->
            <el-table-column prop="transactionId" :label="$t('message.sharder_trading_ID')"></el-table-column>


            <!--交易类型 new-->
            <el-table-column prop="type" :label="$t('message.sharder_trading_type')" v-if="address != '' && address != null" width="140">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.sender == address" style="color: #F56C6C">OUT</el-tag>
                    <el-tag v-if="scope.row.recipient == address" style="color: #67C23A">IN</el-tag>
                </template>
            </el-table-column>

            <!--交易数量-->
            <el-table-column prop="amount" :label="$t('message.sharder_number')" width="150">
                <template slot-scope="scope">
                    <span class="amount">{{Number().amountFormat(scope.row.amount)}}</span>
                </template>
            </el-table-column>
            <!--费用-->
            <el-table-column  :label="$t('message.sharder_cost')" width="100">
                <template slot-scope="scope">
                    <span class="amount">{{Number().amountFormat(scope.row.fee)}}</span>
                </template>
            </el-table-column>
            <!--创建时间-->
            <el-table-column :label="$t('message.sharder_creation_time')">
                <template slot-scope="scope">
                    {{new Date().BlockDate(scope.row.timestamp)}}
                </template>
            </el-table-column>
            <!--确认数及其状态-->
            <el-table-column  :label="$t('message.sharder_confirmation_state')">
                <template slot-scope="scope">
                    <span v-if="scope.row.confirmations > 0">
                        <i class="el-icon-circle-check-outline es-success" ></i> ({{$t('message.sharder_ok_num')}}:{{scope.row.confirmations}})
                    </span>
                    <span v-else>
                        <i class="el-icon-circle-check-outline el-icon-loading" ></i> (pending)
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <!--转账-->
        <el-table :data="transactionsData" class="table hidden-xs-only" v-show="selectedType === 'zz'">
            <!--折叠面板-->
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="to-form">
                        <el-form-item :label="$t('message.sharder_initiator')" class="form">
                            <a :href="'/address.html?addr='+props.row.sender" class="es-link" ><span>{{ props.row.sender }}</span></a>
                        </el-form-item>
                        <el-form-item ><i class="fa fa-long-arrow-right" aria-hidden="true" ></i></el-form-item>
                        <el-form-item :label="$t('message.sharder_receiver')" class="to">
                            <a :href="'/address.html?addr='+ props.row.recipient" class="es-link"><span>{{ props.row.recipient}}</span></a>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <!--交易hash-->
            <el-table-column prop="hash" :label="$t('message.sharder_trading_hash')">
                <template slot-scope="scope">
                    <a class="hash" :href="'/tx.html?hash='+scope.row.hash+'&type=zz'">
                        <el-button type="text" size="small">{{scope.row.hash}}</el-button>
                    </a>
                </template>
            </el-table-column>
            <!--交易id-->
            <el-table-column prop="transactionId" :label="$t('message.sharder_trading_ID')"></el-table-column>


            <!--交易类型 new-->
            <el-table-column prop="type" :label="$t('message.sharder_trading_type')" v-if="address != '' && address != null" width="140">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.sender == address" style="color: #F56C6C">OUT</el-tag>
                    <el-tag v-if="scope.row.recipient == address" style="color: #67C23A">IN</el-tag>
                </template>
            </el-table-column>

            <!--交易数量-->
            <el-table-column prop="amount" :label="$t('message.sharder_number')" width="150">
                <template slot-scope="scope">
                    <span class="amount">{{Number().amountFormat(scope.row.amount)}}</span>
                </template>
            </el-table-column>
            <!--费用-->
            <el-table-column  :label="$t('message.sharder_cost')" width="100">
                <template slot-scope="scope">
                    <span class="amount">{{Number().amountFormat(scope.row.fee)}}</span>
                </template>
            </el-table-column>
            <!--创建时间-->
            <el-table-column :label="$t('message.sharder_creation_time')">
                <template slot-scope="scope">
                    {{new Date().BlockDate(scope.row.timestamp)}}
                </template>
            </el-table-column>
            <!--确认数及其状态-->
            <el-table-column  :label="$t('message.sharder_confirmation_state')">
                <template slot-scope="scope">
                    <span v-if="scope.row.confirmations > 0">
                        <i class="el-icon-circle-check-outline es-success" ></i> ({{$t('message.sharder_ok_num')}}:{{scope.row.confirmations}})
                    </span>
                    <span v-else>
                        <i class="el-icon-circle-check-outline el-icon-loading" ></i> (pending)
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <!--存储-->
        <el-table :data="transactionsData" class="table hidden-xs-only" v-show="selectedType === 'cc'">
            <!--折叠信息块-->
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="to-form">
                        <el-form-item :label="$t('message.sharder_store')" class="form">
                            <a :href="'/address.html?addr='+props.row.sender" class="es-link"><span>{{ props.row.sender }}</span></a>
                        </el-form-item><br/>
                        <el-form-item v-if="netWork == 'alpha'" :label="$t('message.sharder_backup_id')" class="form">
                            <a :href="'/tx.html?hash='+props.row.hash" class="es-link"><span>{{ props.row.backups[0].backup_Tx }}</span></a>
                        </el-form-item><br/>
                        <el-form-item  v-if="netWork == 'alpha'" :label="$t('message.sharder_backup_confirm')" class="form">
                            <span>{{ props.row.backups[0].backup_Tx_confirmations }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <!--交易hash-->
            <el-table-column prop="hash" :label="$t('message.sharder_store_hash')">
                <template slot-scope="scope">
                    <a class="hash" :href="'/tx.html?hash='+scope.row.hash">
                        <el-button type="text" size="small">{{scope.row.hash}}</el-button>
                    </a>
                </template>
            </el-table-column>

            <!--存储id-->
            <el-table-column prop="transactionId" :label="$t('message.sharder_store_id')"></el-table-column>


            <!--客户地址-->
            <el-table-column :label="$t('message.client_account')">
                <template slot-scope="scope" v-if="scope.row.data != null && scope.row.data != ''">
                    <a :href="'/address.html?addr='+scope.row.data.clientAccount" class="es-link">{{scope.row.data.clientAccount || ''}}</a>
                </template>
            </el-table-column>

            <!--文件名称-->
            <el-table-column :label="$t('message.sharder_file_name')">
                <template slot-scope="scope" v-if="scope.row.data != null && scope.row.data != ''">
                    {{scope.row.data.fileName || ''}}
                </template>
            </el-table-column>
            <!--文件类型-->
            <el-table-column :label="$t('message.sharder_file_type')">
                <template slot-scope="scope" v-if="scope.row.data != null && scope.row.data != ''">
                    <el-tag>{{scope.row.data.fileType || ''}}</el-tag>
                </template>
            </el-table-column>


            <!--费用-->
            <el-table-column prop="amount" :label="$t('message.sharder_cost')" width="100">
                <template slot-scope="scope">
                    <span class="amount">{{Number().amountFormat(scope.row.fee)}}</span>
                </template>
            </el-table-column>

            <!--创建时间-->
            <el-table-column :label="$t('message.sharder_creation_time')">
                <template slot-scope="scope">
                    {{new Date().BlockDate(scope.row.timestamp)}}
                </template>
            </el-table-column>
            <!--确认数及其状态-->
            <el-table-column  :label="$t('message.sharder_confirmation_state')" width="160">
                <template slot-scope="scope">
                    <span v-if="scope.row.confirmations > 0">
                        <i class="el-icon-circle-check-outline es-success" ></i> ({{$t('message.sharder_ok_num')}}:{{scope.row.confirmations}})
                    </span>
                    <span v-else>
                        <i class="el-icon-circle-check-outline el-icon-loading" ></i> (pending)
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <!--pc 端的转账存储 end-->
        <!------------------------------------------mobile 端的转账存储 start------------------------------------------------------>

        <!--coin base-->
        <el-table :data="transactionsData" class="table hidden-sm-and-up table-lists table-lists-mobile" v-show="selectedType === 'cb'">
            <!--折叠面板-->
            <el-table-column  type="expand" width="40" >
                <template slot-scope="props" >
                    <el-form label-position="left" inline class="to-form">
                        <!--交易发送者-->
                        <el-form-item class="item"   :label="$t('message.sharder_initiator')">
                            <span> <a :href="'/address.html?addr='+props.row.sender" class="es-link" ><span>{{ props.row.sender }}</span></a></span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <!--交易hash-->
            <el-table-column prop="hash" :label="$t('message.sharder_trading_hash')" width="90">
                <template slot-scope="scope">
                    <a class="hash simpl-hash" :href="'/tx.html?hash='+scope.row.hash">
                        <el-button type="text" size="small"><span class="simpl-hash">{{scope.row.hash}}</span></el-button>
                    </a>
                </template>
            </el-table-column>
            <!--创建时间-->
            <el-table-column :label="$t('message.sharder_creation_time')" width="90">
                <template slot-scope="scope">
                    {{new Date().BlockDate(scope.row.timestamp)}}
                </template>
            </el-table-column>
            <!--确认数及其状态-->
            <el-table-column  :label="$t('message.sharder_confirmation_state')">
                <template slot-scope="scope">
                    <span v-if="scope.row.confirmations > 0">
                        <i class="el-icon-circle-check-outline es-success" ></i> ({{$t('message.sharder_ok_num')}}:{{scope.row.confirmations}})
                    </span>
                    <span v-else>
                        <i class="el-icon-circle-check-outline el-icon-loading" ></i> (pending)
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <!--转账-->
        <el-table :data="transactionsData" class="table hidden-sm-and-up table-lists table-lists-mobile" v-show="selectedType === 'zz'">
            <!--折叠面板-->
            <el-table-column  type="expand" width="40" >
                <template slot-scope="props" >
                    <el-form label-position="left" inline class="to-form">
                        <!--交易发送者-->
                        <el-form-item class="item"   :label="$t('message.sharder_initiator')">
                            <span> <a :href="'/address.html?addr='+props.row.sender" class="es-link" ><span>{{ props.row.sender }}</span></a></span>
                        </el-form-item>
                        <!--交易接收者-->
                        <el-form-item class="item"   :label="$t('message.sharder_receiver')">
                            <span>   <a :href="'/address.html?addr='+ props.row.recipient" class="es-link"><span>{{ props.row.recipient}}</span></a></span>
                        </el-form-item>
                        <!--交易id-->
                        <el-form-item class="item"  :label="$t('message.sharder_trading_ID')">
                            <span>{{props.row.transactionId}}</span>
                        </el-form-item>
                        <!--交易金额-->
                        <el-form-item class="item"  :label="$t('message.sharder_number')" >
                            <span class="amount">{{props.row.amount}}</span>
                        </el-form-item>
                        <!--手续费-->
                        <el-form-item class="item" :label="$t('message.sharder_cost')" >
                            <span class="amount">{{Number().amountFormat(props.row.fee)}}</span>
                        </el-form-item>
                        <!--交易类型 in | out-->
                        <el-form-item class="item" :label="$t('message.sharder_trading_type')"  v-if="address != '' && address != null">
                            <!--<span class="amount">{{Number().amountFormat(props.row.fee)}}</span>-->

                            <el-tag v-if="props.row.sender == address" style="color: #F56C6C">OUT</el-tag>
                            <el-tag v-if="props.row.recipient == address" style="color: #67C23A">IN</el-tag>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <!--交易hash-->
            <el-table-column prop="hash" :label="$t('message.sharder_trading_hash')" width="90">
                <template slot-scope="scope">
                    <a class="hash simpl-hash" :href="'/tx.html?hash='+scope.row.hash">
                        <el-button type="text" size="small"><span class="simpl-hash">{{scope.row.hash}}</span></el-button>
                    </a>
                </template>
            </el-table-column>
            <!--创建时间-->
            <el-table-column :label="$t('message.sharder_creation_time')" width="90">
                <template slot-scope="scope">
                    {{new Date().BlockDate(scope.row.timestamp)}}
                </template>
            </el-table-column>
            <!--确认数及其状态-->
            <el-table-column  :label="$t('message.sharder_confirmation_state')">
                <template slot-scope="scope">
                    <span v-if="scope.row.confirmations > 0">
                        <i class="el-icon-circle-check-outline es-success" ></i> ({{$t('message.sharder_ok_num')}}:{{scope.row.confirmations}})
                    </span>
                    <span v-else>
                        <i class="el-icon-circle-check-outline el-icon-loading" ></i> (pending)
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <!--存储-->
        <el-table  :data="transactionsData" class="table hidden-sm-and-up table-lists table-lists-mobile" v-show="selectedType === 'cc'">
            <!--折叠信息块-->
            <el-table-column type="expand" width="40">
                <template slot-scope="props" >
                    <el-form label-position="left" inline class="to-form store">
                        <!--存储发起人-->
                        <el-form-item class="item"  :label="$t('message.sharder_store')">
                            <span>
                                <a :href="'/address.html?addr='+props.row.sender" class="es-link"><span>{{ props.row.sender }}</span></a>
                            </span>
                        </el-form-item>
                        <!--客户地址-->
                        <el-form-item class="item" label-width="120" :label="$t('message.client_account')">
                            <span v-if="props.row.data != null && props.row.data != ''">
                                <a :href="'/address.html?addr='+props.row.data.clientAccount" class="es-link">{{props.row.data.clientAccount || ''}}</a>
                            </span>
                        </el-form-item>

                        <!--存储ID-->
                        <el-form-item class="item"  :label="$t('message.sharder_store_id')" >
                            <span>{{props.row.transactionId}}</span>
                        </el-form-item>

                        <!--备份数-->
                        <el-form-item v-if="netWork == 'alpha'" class="item" :label="$t('message.sharder_store')" >
                            <a :href="'/tx.html?hash='+props.row.hash" class="es-link"><span>{{ props.row.backups[0].backup_Tx }}</span></a>
                        </el-form-item>

                        <el-form-item v-if="netWork == 'alpha'" class="item" :label="$t('message.sharder_backup_id')">
                            <span>{{ props.row.backups[0].backup_Tx_confirmations }}</span>
                        </el-form-item>

                        <!--文件名称-->
                        <el-form-item class="item"  :label="$t('message.sharder_file_name')" >
                            <span v-if="props.row.data != null && props.row.data != ''"> {{props.row.data.fileName || ''}}</span>

                        </el-form-item>


                        <!--文件类型-->
                        <el-form-item class="item"  :label="$t('message.sharder_file_type')">
                            <span><el-tag>{{props.row.data.fileType || ''}}</el-tag></span>
                        </el-form-item>

                    </el-form>
                </template>
            </el-table-column>
            <!--存储hash-->
            <el-table-column prop="hash" :label="$t('message.sharder_hash')" width="90">
                <template slot-scope="scope">
                    <a class="hash " :href="'/tx.html?hash='+scope.row.hash">
                        <el-button type="text" size="small"><span class="simpl-hash">{{scope.row.hash}}</span></el-button>
                    </a>
                </template>
            </el-table-column>


            <!--创建时间-->
            <el-table-column :label="$t('message.sharder_creation_time')" width="90">
                <template slot-scope="scope">
                    {{new Date().BlockDate(scope.row.timestamp)}}
                </template>
            </el-table-column>
            <!--确认数及其状态-->
            <el-table-column  :label="$t('message.sharder_confirmation_state')" >
                <template slot-scope="scope">
                    <span v-if="scope.row.confirmations > 0">
                        <i class="el-icon-circle-check-outline es-success" ></i> ({{$t('message.sharder_ok_num')}}:{{scope.row.confirmations}})
                    </span>
                    <span v-else>
                        <i class="el-icon-circle-check-outline el-icon-loading" ></i> (pending)
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <!--mobile 端的转账存储 end-->

    </div>
</template>

<style>

    /*移动版的样式  手机屏幕小于 768px start*/
    @media (max-width: 768px){
        .block-table{
            padding-left: 0px !important;
            padding-right: 0px !important;
        }
        .es-main .el-table,.table-lists-mobile{
            border-radius: initial !important;
            box-shadow:initial !important;
            border: initial !important;
            font-size: 12px;
        }
        .table-lists .simpl-hash{
            display: inline-block;
            vertical-align: bottom;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 60px;
            text-align: left;
        }

        .tx-type-select-group{
            padding-left: 15px;
            padding-right: 15px;
        }
        .el-table__expanded-cell[class*=cell]{
            padding: 20px 20px;
        }
        .to-form .item{
            display: block;
            margin-bottom: 0px;
        }
        .to-form .item{
            border-bottom: 1px solid #f2f2f2;
        }
        .to-form .item label{
            width: 45%;
        }
        .to-form .item label:after{
            content: ":";
        }
        .to-form .item .el-form-item__content{
            width: 55%;
        }
        .block-table .cell{
            line-height: 14px;
            font-size: 12px;
        }
        .tx-type-select-block{
            width: 100%;
        }
        .tx-type-select-block > label{
            width: 50%;
            text-align: center;
        }

        .tx-type-select-block .select-btn .el-radio-button__inner{
            width: 100%;
        }
    }
    /*移动版的样式  手机屏幕小于 768px end*/
</style>

<style scoped>
    .es-main  .el-table {
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        border: 1px solid #ebeef5;
        transition: .3s;
        margin-bottom: 20px;
    }
</style>
<script>
    import Util from '../assets/js/util';
    import axios from "axios";
    import api from "../assets/api";

    export default {
        name: "tx_list",
        data() {
            return {
                resData:[{}],
                blockInfo: [{}],
                filterTypeRadio:""+this.$t('message.sharder_transfer')+"",   //初始化选择类型
                selectedType:'zz',       //初始化选择类型
                originalTxs:[{}],
                netWork:"",
                transactionsData:this.transactions,
            }
        },
        props:['transactions','address'],
        methods: {
            filterType() {
                this.netWork = Util.getLocalStorage("networkState");
                let value = "";
                if(this.selectedType === "zz"){
                    value = 0;
                }else  if(this.selectedType === "cb"){
                    value = 9;
                }else  if(this.selectedType === "cc" && this.netWork == "alpha"){
                    value = 11;
                }else if(this.selectedType === "cc"){
                    value = 6;
                }else if(this.selectedType === "sjcl"){
                    value = 6;
                }else {
                    return;
                }
                let  temporary = new Array();
                for (let i=0;i<this.originalTxs.length;i++)
                {
                    if(this.originalTxs[i].type == value){
                        if (this.netWork == "alpha" && value == '11') {
                            axios.get(api.methods.getBaseUrl(api.BACKUPS_INFO) + "&txID=" + this.originalTxs[i].transactionId,{withCredentials:false})  //获取指定存储交易的备份信息
                                .then(res =>{
                                    if (res.status == 200) {
                                        this.$set(this.originalTxs[i],"backups",res.data.backups);
                                    }
                                }).catch(function (error) {
                                    console.log(error)
                            })
                        }
                        temporary.push(this.originalTxs[i])
                    }
                }
                this.transactionsData = temporary;

                if(Util.isEmpty(temporary) && Util.isNotEmpty(this.transactionsData)){
                    this.nodata();
                }
            },
            startup(){
                if(Util.isNotEmpty(this.transactions)){
                    this.originalTxs = Util.jsonDeepCopy(this.transactions);
                    this.filterType();
                }else if(Util.isNotEmpty(this.transactionsData)){
                    this.nodata();
                }
            },
            nodata(){
                this.$notify({
                    title: this.$t('message.sharder_warning'),
                    message: this.$t('message.sharder_not_data'),
                    type: 'warning'
                });
            }
        },
        mounted() {
            this.startup();
        },
        watch:{
            transactions(val, oldVal){
                this.startup();
            },
        }
    }
</script>
