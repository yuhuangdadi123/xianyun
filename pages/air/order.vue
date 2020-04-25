<template>
    <div class="container">
        <el-row type="flex" justify="space-between">
            <!-- 订单表单 -->
            <div class="main">
                <OrderForm/>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                <!-- <OrderAside :data="$store.state.air.flightData"/> -->
            </div>
        </el-row>
    </div>
</template>

<script>
//购买机票的表单组件
import OrderForm from "@/components/air/orderForm.vue";
//机票订单的侧边栏组件 （价格显示）
import OrderAside from "@/components/air/OrderAside.vue";

export default {
    data(){
        return{

        }
    },
    components: {
        OrderForm,
        OrderAside
    }
}
</script>

<style lang="less" scoped>
    .container{
        width:1000px;
        margin:20px auto;
    }
    
    /*aside*/
    .aside{
        width: 350px;
        height: fit-content;
        border:1px #ddd solid;
    }
</style>