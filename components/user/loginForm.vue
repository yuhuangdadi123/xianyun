<template>
    <!-- model: 声明表单的数据对象 -->
    <!-- ref: 获取dom元素 -->
    <!-- rules: 表单的验证规则 -->
    <el-form 
        :model="form" 
        ref="form"
        :rules="rules" 
        class="form">

        <el-form-item class="form-item" prop="username">
            <el-input 
            v-model="form.username"
            placeholder="用户名/手机">
            </el-input>
        </el-form-item>

        <el-form-item class="form-item"  prop="password">
            <el-input 
            v-model="form.password"
            placeholder="密码" 
            type="password">
            </el-input>
        </el-form-item>

        <p class="form-text">
            <nuxt-link to="#">忘记密码</nuxt-link>
        </p>

        <el-button 
        class="submit"
        type="primary"
        @click="handleLoginSubmit">
            登录
        </el-button>
    </el-form>

</template>

<script>
export default {
    data(){
        return {
            // 表单数据
            form: {
                username:"",
                password:""
            },
            // 表单规则
            rules: {
                username: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { min: 11, max: 11, message: '手机号码格式错误', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '密码长度为6-12位', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        // 提交登录
        handleLoginSubmit(){
        //    console.log(this.form)
        // 判断element的表单验证是否通过, element的表单都有一个validate这个方法
        this.$refs.form.validate((valid) => {
            // valid如果值是true代表验证通过
            if(valid){
                // this.form就是上面 账号跟密码的表单 已经填了的                  把this.form传过去
                // 调用actions的方法   .then的参数res是上一个then的返回值决定的
                this.$store.dispatch("user/login",this.form).then(data=>{
                    // 弹窗提示
                    this.$message.success("登录成功！欢迎回来： " + data.user.nickname);
                    // 跳转到首页
                    // this.$router.push("/")
                    // 返回上一页
                    this.$router.back()
                })
                }
            })


            // this.$refs.form.validate(async (valid) => {
            //     // valid如果值是true代表验证通过
            //     if(valid){
            //         // 调用actions的方法
            //         await this.$store.dispatch("user/login", this.form);
            //         // 弹窗提示
            //         this.$message.success("登录成功");
            //         // 跳转到首页
            //         this.$router.push("/")
            //     }
            // })


        }
    }
}
</script>

<style scoped lang="less">
    .form{
        padding:25px;
    }
    .form-item{
        margin-bottom:20px;
    }
    .form-text{
        font-size:12px;
        color:#409EFF;
        text-align: right;
        line-height: 1;
    }
    .submit{
        width:100%;
        margin-top:10px;
    }
</style>