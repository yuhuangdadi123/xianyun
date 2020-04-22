<template>
    <section class="contianer">
        <el-row  type="flex" justify="space-between">

            <!-- 顶部过滤列表 -->
            <div class="flights-content">
                <!-- 过滤条件 -->
                <div>
                    <FlightsFilters :data="flightDataCache" @getData="getData"/>
                </div>
                
                <!-- 航班头部布局 -->
                <div>
                    <FlightsListHead/>
                </div>
                
                
                <!-- 航班信息 -->
                <div>
                    <FlightsItem  v-for="(item,index) in dataList" 
                    :key="index" 
                    :data="item"
                    />

                    <!-- size-change : 切换条数时触发的事件 -->
                    <!-- current-change：切换页数时候触发的事件 -->
                    <!-- current-page：当前页数 -->
                    <!-- page-size：当前页的条数 -->
                    <!-- total总条数 -->
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>

                </div>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                <!-- 侧边栏组件 -->
            </div>
        </el-row>
    </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead.vue"
import FlightsItem from "@/components/air/flightsItem.vue"
import FlightsFilters from "@/components/air/flightsFilters.vue"

export default {
    data(){
        return {
            //res.data 赋值出的 总数据 里面有 flights  info  options 这三组大数据
            flightsData:{
                info:{},
               flights:[],
               options:{}
            },
            // 备份一个数据，这个数据一旦被赋值后永远都不能被修改（原图）
            // 备份一份 大数据  给筛选组件，然后筛选数组的赋值是给原份，如果再次筛选给的还是备份的大数据，而不是给的筛选过后的数据
            flightDataCache: {
                info: {},
                flights: [],
                options: {}
            },
            //新建一个 专门用来存放 用slice切割出来的数组,把切割的数组用来渲染机票列表，达到分页效果
            //所以上面机票列表v-for 是循环 dataList
            // dataList:[],
            //当前页数
            pageIndex:1,
            //当前页面条数
            pageSize:5,
            //总条数
            total:0,
        }
    },
    components: {
        FlightsListHead,
        FlightsItem,
        FlightsFilters
    },
    // 把机票列表提取到computed 监听   切换页数 条数 就可以监听到  记得return 因为要赋值的
    // dataList 相当于赋值  一开始axios还没请求到  赋值的时候没找到值，就undefined，所以要给flights一个默认值；
    computed:{
        dataList(){
            const arr = this.flightsData.flights.slice( (this.pageIndex-1)*this.pageSize , this.pageIndex * this.pageSize );
            return arr;
        }
    },
    mounted(){
        // 请求机票列表
        this.$axios({
            url:"/airs",
            params:this.$route.query,
        }).then(res=>{
            console.log(res);  //res.data 里面有 flights  info  options 这三组大数据
            // 把这个大数据 给data里面的flightsData  所以flightsData是一个对象
            this.flightsData = res.data;
            //请求完成后切割出第一页的数据  flightsData.flights是机票列表的数组   第一页就0-5 这5条数据 因为slice不会拿到索引5

            //因为 var a = c   var b = c   内存地址一样 通过a把c改了  b的c也会被改了 ，所以把对象解构出来放在另外一个对象里面
            // 相当于给了一个新的内存地址
            // 备份一份起来, 这份不能被修改, 因为是引用类型内存地址是一样的所以需要拷贝一份
            this.flightDataCache = {...res.data};


            //数组的slice方法 例如arr[1,2,3,4]  arr.slice(0,2)  
            // 返回索引0-2之间的元素 不包含索引2那一项  返回的是一个数组[0,1]    不会改变原数组 
            // this.dataList = this.flightsData.flights.slice(0,this.pageSize);    不能赋值来改computed的值

            //总条数
            this.total = this.flightsData.total;
        })
    },
    methods:{
        //这个事件传递给过滤的子组件用于获取过滤后的数组
        getData(arr){
            //又因为computed 监听到this.flightsData.flights 的变化  会重新刷新数组
            this.flightsData.flights = arr;
            this.total=arr.length;
        },

        //切换条数时触发的事件
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            // 都会触发 computed 监听
            this.pageSize = val;
        },
        //切换页数时触发的事件
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            //修改页数  都会触发 computed 监听
            this.pageIndex = val;
        }


    },

}
</script>

<style scoped lang="less">
    .contianer{
        width:1000px;
        margin:20px auto;
    }

    .flights-content{
        width:745px;
        font-size:14px;
    }

    .aside{
        width:240px;
    } 
</style>