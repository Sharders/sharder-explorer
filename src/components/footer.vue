<template>
    <el-footer class="es-footer hidden-xs-only">
        <ul class="es-main">
            <li class="font-icon">
                <a href="https://twitter.com/SharderChain" target="_blank"><span><i class="fa fa-twitter"></i></span></a>
                <a href="https://github.com/Sharders" target="_blank"><span><i class="fa fa-github"></i></span></a>
                <!--<span><i class="fa fa-medium" aria-hidden="true"></i></span>-->
                <!--<span><i class="fa fa-weixin"></i></span>-->
                <a href="https://t.me/sharder_talk" target="_blank"><span><i style="font-size: 27px" class="fa fa-paper-plane" aria-hidden="true"></i></span></a>
                <a href="mailto:hi@sharder.org" target="_blank"><span><i style="font-size: 27px" class="fa fa-envelope-o" aria-hidden="true"></i></span></a>

                <a href="https://www.reddit.com/r/Sharder/" target="_blank"><span><i style="font-size: 27px" class="fa fa-reddit" aria-hidden="true"></i></span></a>
            </li>

            <li class="copyright"><span>© sharder.org, 2018. All Rights Reserved.</span></li>
        </ul>
    </el-footer>
</template>

<script>
    export default {
        name: "esFooter"
    }
</script>

<style scoped>
    .es-footer{
        height: auto !important;
        background-color: #000;
        color: #999;
    }
    .es-footer .es-main{
        max-width: 1200px;
        width: inherit;
        margin: auto;
        text-align: center;
    }
    .font-icon{
        font-size: 30px;
        margin-top: 30px;

    }
    .font-icon .fa{
        margin-left: 10px;
        margin-right: 10px;
        transition: all 0.5s;
        color: #999;
    }
    .font-icon .fa:hover{
        color: #fff;
        cursor: pointer;
    }

    .copyright{
        font-size: 14px;
        padding: 13px 0 14px;
        color: #999999;
    }
</style>