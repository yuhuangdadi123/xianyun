// 引入message提示
import {Message} from "element-ui";

// plugin的所有文件都会导入到项目中， 并且是全局的， 需要在nuxt.config.js 里面去添加，
//类似于在普通vue项目中的main.js里面的内容，对整个项目都是有效的

//拦截axios的错误，插件必须要暴露出一个函数

// 暴露出一个函数
export default (nuxt) => {
    //  console.log(nuxt);  // 里面有$axios的方法

    // onError在axios请求错误的时候才会触发， err是错误的对象
    nuxt.$axios.onError(err =>{
        // 打印err看不出是什么  所以要找到err里面的response的方法
        // err.response是错误对象的详细信息
        console.log(err.response);
        // 先解构出来
        const {statusCode,message} = err.response.data;
        if(statusCode === 400){
            Message.error(message);
        }
    })

}