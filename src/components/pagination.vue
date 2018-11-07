
<template>
    <el-pagination
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="totalNum" class="es-pagination"
            :current-page.sync="currentPage"
            @current-change="currentPageChange">
    </el-pagination>
</template>
<style>
    @media (max-width: 768px){
        .es-pagination .el-pager{
            display: none;
        }
    }
</style>
<script>
    export default {
        name: "pagination",
        data () {
            return {
                pageSize:10,
                firstIndex:0,
                lastIndex:9,
            }
        },
        props:['totalNum','currentPage'],
        methods:{
            currentPageChange(val){
                val -= 1;
                this.firstIndex = val * this.pageSize;
                this.lastIndex = ((this.firstIndex + this.pageSize)-1);
                this.$emit('pagingParams', this.firstIndex,this.lastIndex);
            },

        }
    }
</script>


