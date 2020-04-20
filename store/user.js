// 浏览器会发出警告 说state应该是一个 方法/函数  所以用箭头函数

// 存放仓库该分类（user）下的数据, export const state = {}是固定的格式
export const state =()=>({
    // 登录成功后接口返回的用户数据, 里面包含了token和用户的详细信息
    userInfo: {}
});

// 修改state中的数据 export const mutations = {}是固定的格式
// store的数据不能直接修改，必须要使用mutations来修改
export const mutations = {
    // 声明一个函数，函数名可以随便起
    // 该函数有两个参数，第一个参数是上面state(固定的), 第二个参数是传入的参数(不固定)
    setUserInfo(state,data){
        // 随意的修改state的属性
        state.userInfo = data;
        // console.log("store的数据被修改了:", state.userInfo)
    }
}

// 重点：actions可以用来存放一些公共的方法，多个组件或者项目通用的方法
// 顺带的：并且可以调用mutations来修改state
export const actions = {
    // 声明一个函数，函数名可以随便起
    // 该函数有两个参数，第一个参数是Store对象, 第二个参数是传入的参数(不固定)
    login(store,data){
        // console.log(this);  打印this  就是store 下面 有个axios 所以可以直接用axios
        // 请求登录接口
         return this.$axios({
            url: "/accounts/login",
            method: "POST",
            data: data
        }).then(res => {
            // console.log(res);
            const {data} = res;
            // 这个写法是错的
            // this.$store.state.user.userInfo = data;

             // 通过store.commit调用mutations的方法
            // 由于是在同一个模块下，可以省略前面的user名字
            store.commit('setUserInfo', data);
            return data
        })
    },

    // 发送手机验证码
    sendCaptcha(store, tel){
        // 请求验证码接口
        return this.$axios({
            url: "/captchas",
            method: "POST",
            data: {
                // 手机号码
                tel
            }
        }).then(res => {
            // 接口主要调用成功了，都认为短信已经成功的发送到用户的手机上了
            const {code} = res.data;
            return code;
        })
    },

    // 注册，注册接口调用成功后和登录的操作是一样
    register(store, data){
        return this.$axios({
            url: "/accounts/register",
            method: "POST",
            data
        }).then(res => {
            // data是用户的数据
            const {data} = res;

            // 通过store.commit调用mutations的方法
            // 由于是在同一个模块下，可以省略前面的user名字
            store.commit('setUserInfo', data);

            return data;
        })
    }
}
