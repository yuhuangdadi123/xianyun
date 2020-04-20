<template>
    <div class="search-form">

        <!-- 头部tab切换 -->
        <el-row type="flex" class="search-tab">
            <span v-for="(item, index) in tabs" :key="index"
            @click="handleSearchTab(item, index)"
            :class="{active: index === currentTab}">
                <i :class="item.icon"></i>{{item.name}}
            </span>
        </el-row>

        <!-- 机票搜索表单 -->
        <el-form class="search-form-content" ref="form"  :model="form"  :rules="rules"  label-width="80px">
            <el-form-item label="出发城市"  prop="departCity">
                <!-- fetch-suggestions 返回输入建议的方法 -->
                <!-- select 点击选中建议项时触发 -->
                <!-- fetch-suggestions :  获取建议  一旦输入框的文字发生了变化，就会触发queryDepartSearch这个事件
                然后事件根据这个输入框的关键字去请求接口 接口返回的数据就显示在下拉列表里面 -->

                <el-autocomplete
                :fetch-suggestions="queryDepartSearch"
                placeholder="请搜索出发城市"
                @select="handleDepartSelect"
                class="el-autocomplete"
                v-model="form.departCity"
                @blur="handleDepartBlur"
                ></el-autocomplete>
            </el-form-item>

            <el-form-item label="到达城市" prop="destCity">
                <el-autocomplete
                :fetch-suggestions="queryDestSearch"
                placeholder="请搜索到达城市"
                @select="handleDestSelect"
                class="el-autocomplete"
                v-model="form.destCity"
                @blur="handleDestBlur"
                ></el-autocomplete>
            </el-form-item>

            <el-form-item label="出发时间"  prop="departDate">
                <!-- change 用户确认选择日期时触发 -->
                 <!-- value-format 设置时间的格式 -->
                <el-date-picker type="date" 
                placeholder="请选择日期" 
                style="width: 100%;"
                align="right"
                v-model="form.departDate"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                @change="handleDate">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="">
                <el-button style="width:100%;" 
                type="primary" 
                icon="el-icon-search"
                @click="handleSubmit">
                    搜索
                </el-button>
            </el-form-item>

            <div class="reverse">
                <span @click="handleReverse">换</span>
            </div>
        </el-form>  
      </div>
</template>

<script>
export default {
    data(){
        return {
            tabs: [
                {icon: "iconfont icondancheng", name: "单程"},
                {icon: "iconfont iconshuangxiang", name: "往返"}
            ],
            currentTab: 0,
            form:{
                departCity:"",//出发城市
                departCode:"",//出发城市的字母代码
                destCity:"",//到达城市
                destCode:"",//到达城市的字母代码
                departDate:"" //出发日期
            },
            // 出发城市下拉列表的数据
            departCities:[],
            // 到达城市下拉列表的数据
            destCities:[],
            //日期禁用选项  禁用昨天之前的日期
            pickerOptions: {
                disabledDate(time) {
                return time.getTime() < Date.now() - 3600 * 1000 * 24;
                }
            },
            shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
                }
            }],
            // 表单的校验规则,trigger是随便填的，默认是blur，主要是blur交互我们觉得不好看，想覆盖掉这个功能
            rules: {
                departCity: [
                    { required: true, message: "请选中出发城市", trigger: "abc" }
                ],
                destCity: [
                    { required: true, message: "请选中到达城市", trigger: "abc"  }
                ],
                departDate: [
                    { required: true, message: "请选中出发时间", trigger: "abc"  }
                ]
            }
        }
    },
    methods: {
        // tab切换时触发
        handleSearchTab(item, index){
            
        },
        
        // 监听  出发城市  输入框的变化，一旦输入框的文字发生了变化，就会触发该这个事件
        // value是输入框的值 cb是函数必须要调用的
        //cb接收的参数有个固定的格式，参数必须是一个数组，且数组里面每一项都必须是 对象，每个对象必须要有value
        // 这里这个插件版本有问题，手动把element-ui的版本回退到2.12.0    执行命会覆盖  npm  install element-ui@2.12.0
        queryDepartSearch(value, cb){
            //如果value是空 就不请求
            if(!value){return}
            // 监听输入框有值的时候重新验证表单，可以消除掉红的报错信息
            this.$refs.form.validateField("departCity");
            // 请求和value相关的文字
            this.$axios({
                url:"/airs/city",
                params:{
                    name:value
                }
            }).then(res=>{
                // console.log(res);
                const {data} = res.data;
                // 因为cb里面的每个对象里面必须要有value 所以要map添加
                // map必须要retur；！！！！！！！
                const newData = data.map(v=>{
                    v.value = v.name.replace('市','');
                    return v;
                });
                // 保存到data中，给blur事件使用，失去焦点选择第一个
                this.departCities = newData;
                // cb是函数必须要调用的
                cb(newData);
            })
        },
        
        // 出发城市输入框失去焦点事件
        handleDepartBlur(){
            if(this.departCities.length>0){
                this.form.departCity = this.departCities[0].value;
                this.form.departCode = this.departCities[0].sort;
            }
        },

        //  目标城市  输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表
        queryDestSearch(value, cb){
             if(!value){return}
            // 监听输入框有值的时候重新验证表单，可以消除掉红的报错信息
            this.$refs.form.validateField("destCity");
            // 请求和value相关的文字
            this.$axios({
                url:"/airs/city",
                params:{
                    name:value
                }
            }).then(res=>{
                // console.log(res);
                const {data} = res.data;
                // 因为cb里面的每个对象里面必须要有value 所以要map添加
                // map必须要retur；！！！！！！！
                const newData = data.map(v=>{
                    v.value = v.name.replace('市','');
                    return v;
                });
                // 保存到data中，给blur事件使用，失去焦点选择第一个
                this.destCities = newData;
                // cb是函数必须要调用的
                cb(newData);
            })
        },
       // 到达城市 输入框失去焦点事件
        handleDestBlur(){
            if(this.departCities.length>0){
                this.form.destCity = this.destCities[0].value;
                this.form.destCode = this.destCities[0].sort;
            }
        },


        // 出发城市下拉选择时触发
        handleDepartSelect(item) {
            // console.log(item);
            this.form.departCode = item.sort
        },

        // 目标城市下拉选择时触发
        handleDestSelect(item) {
            this.form.destCode = item.sort
        },

        // 确认选择日期时触发
        handleDate(value){
        //    console.log(value);
        this.$refs.form.validateField("departDate");
        },

        // 触发和目标城市切换时触发
        handleReverse(){
            
        },

        // 提交表单是触发
        handleSubmit(){
           // 表单验证
            this.$refs.form.validate(valid => {
                if(valid){
                    // console.log(this.form);
                    // 路由跳转，path指定的路径，query属性指定的问号后面的参数
                    // 如果是动态参数就使用params
                    this.$router.push({
                        path:'/air/flights',
                        query: this.form
                    })
                }
            })
        }
    },
    mounted() {
       
    }
}
</script>

<style scoped lang="less">
.search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}
</style>
