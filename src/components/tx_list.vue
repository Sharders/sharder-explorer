<template>
    <div>
        <div style="margin-top: 20px">
            <el-radio-group v-model="filterTypeRadio" @change="filterType" size="small">
                <el-radio-button  :label="$t('message.sharder_transfer')" @click.native="selectedType='zz'"></el-radio-button>
                <el-radio-button  :label="$t('message.sharder_storage')"  @click.native="selectedType='cc'"></el-radio-button>
                <!--<el-radio-button  label="数据处理" @click="selectedType='sjcl'"></el-radio-button>-->
            </el-radio-group>
        </div>
        <!--转账-->
        <el-table :data="transactionsData" class="table" v-show="selectedType === 'zz'">
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
                    <a class="hash" :href="'/tx.html?hash='+scope.row.hash">
                        <el-button type="text" size="small">{{scope.row.hash}}</el-button>
                    </a>
                </template>
            </el-table-column>
            <!--交易id-->
            <el-table-column prop="transactionId" :label="$t('message.sharder_trading_ID')"></el-table-column>

            <!--交易类型 old-->
            <!--<el-table-column prop="type" :label="$t('message.sharder_trading_type')">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-tag v-if="scope.row.type == '0'" type="success">转账</el-tag>-->
                    <!--<el-tag v-if="scope.row.type == '1'" type="primary">存储</el-tag>-->
                    <!--<el-tag v-if="scope.row.type == '6'" type="success">数据处理</el-tag>-->
                <!--</template>-->
            <!--</el-table-column>-->

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
        <el-table :data="transactionsData" class="table" v-show="selectedType === 'cc'">
            <!--折叠信息块-->
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="to-form">
                        <el-form-item :label="$t('message.sharder_store')" class="form">
                            <a :href="'/address.html?addr='+props.row.sender" class="es-link"><span>{{ props.row.sender }}</span></a>
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

    </div>
</template>


<script>
    import Util from '../assets/js/util';

    export default {
        name: "tx_list",
        data() {
            return {
                resData:[{}],
                blockInfo: [{}],
                filterTypeRadio:""+this.$t('message.sharder_transfer')+"",   //初始化选择类型
                selectedType:'zz',       //初始化选择类型
                originalTxs:[{}],
                transactionsData:this.transactions,
            }
        },
        props:['transactions','address'],
        methods: {
            filterType() {
                let value = "";
                if(this.selectedType === "zz"){
                    value = 0;
                }else  if(this.selectedType === "cc"){
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
<style scoped>
    .es-main  .el-table {
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        border: 1px solid #ebeef5;
        transition: .3s;
        margin-bottom: 20px;
    }
</style>