// 存放仓库该分类（user）下的数据, export const state = {}是固定的格式
export const state = {
    // 登录成功后接口返回的用户数据, 里面包含了token和用户的详细信息
    userInfo: {}
};

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
            store.commit('user/setUserInfo', data);
            return data
        })
    }
}
