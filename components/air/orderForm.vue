<template>
    <div class="main">
        <div class="air-column">
            <h2>乘机人</h2>
            <el-form class="member-info" :rules="rules" ref="form" :model="form">
                <!-- 乘机人用户列表，根据form.users要循环 -->
                <div class="member-info-item" 
                v-for="(item,index) in form.users"
                :key="index"
                >
                <el-form-item  prop="users">
                    <el-form-item label="乘机人类型" >
                        <!-- 重点注意input -->
                        <el-input placeholder="姓名" class="input-with-select" v-model="item.username" >
                            <el-select 
                            slot="prepend" 
                            value="1" 
                            placeholder="请选择">
                                <el-option label="成人" value="1"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="证件类型">
                        <el-input 
                        placeholder="证件号码"  class="input-with-select" v-model="item.id">
                            <el-select 
                            slot="prepend" 
                            value="1"           
                            placeholder="请选择">
                                <el-option label="身份证" value="1" :checked="true"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </el-form-item>

                    <span class="delete-user" @click="handleDeleteUser(index)">-</span>
                </div>
            </el-form>

            <el-button class="add-member" type='primary' @click="handleAddUsers">添加乘机人</el-button>
        </div>

        <div class="air-column">
            <h2>保险</h2>
            <div>
                <div class="insurance-item"
                v-for="(item, index) in detail.insurances"
                :key="index">
                    <el-checkbox 
                    :checked="false"
                    @change="handleInsurances(item.id)"
                    :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`" 
                    border>
                    </el-checkbox> 
                </div>
            </div>
        </div>

        <div class="air-column">
            <h2>联系人</h2>
            <div class="contact">
                <el-form label-width="80px" :rules="rules" :model="form" ref="form2">
                    <el-form-item label="姓名" prop="contactName">
                        <!-- 联系人的姓名 -->
                        <el-input v-model="form.contactName"></el-input>
                    </el-form-item>

                    <el-form-item label="手机"  prop="contactPhone">
                        <!-- 手机号码 -->
                        <el-input placeholder="请输入内容" v-model="form.contactPhone">
                            <template slot="append">
                            <el-button @click="handleSendCaptcha">发送验证码</el-button>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="验证码" prop="captcha">
                        <!-- 手机验证码 -->
                        <el-input v-model="form.captcha"></el-input>
                    </el-form-item>
                </el-form>   
                <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        //callback 是一个回调函数 且必须调用   value 是输入框的值
        const validateUsers = (rule, value, callback) => {
            // 假设验证是通过的， 如果最后的验证通过就调用callback   这是表单验证的valid
            let valid = true;
            // v是一个对象,比如{username: "a", id: "123"}
            value.forEach(v => {
                // 如果验证有一个不通过，后面的判断就没必要再执行
                if(valid === false) return;
                // 如果username是空的
                if(v.username.trim() === ""){
                    valid = false;
                    return callback(new Error("乘机人姓名不能为空"));
                }
                // 如果id是空的
                if(v.id.trim() === ""){
                    valid = false;
                    return callback(new Error("乘机人证件号码不能为空"));
                }
            })
            // 如果验证全部通过
            if(valid){
                callback();
            }
        };

        return{
            form:{
                //用户列表
                users:[
                    {username:"",id:""}
                ],
                // 保险id
                insurances:[],
                // 联系人名字
                contactName:"",
                //联系人电话
                contactPhone:"",
                // 是否需要发票
                invoice:false, //默认不要
                // 座位id
                seat_xid:"",
                // 航班id
                air:"",
                // 验证码
                captcha: "",       
            },
            // 机票的详细信息
            detail: {},
            //表单验证
            rules:{
                users:[
                    //自定义验证表单  失去焦点时 调用validateUsers 这个函数
                    {validator: validateUsers, trigger: 'blur' }
                ],
                // 联系人表单
                contactName: [
                    { required: true, message: '请填写联系人' }
                ],
                contactPhone: [
                    { required: true, message: "联系人电话不能为空"}
                ],
                captcha: [
                    { required: true, message: "验证码不能为空"}
                ]
            }
        }
    },

    mounted(){
        // 获取问号的参数
        const {id , seat_xid} = this.$route.query;
        // 把航班id和座位赋值给表单
        this.form.air = id;
        this.form.seat_xid = seat_xid;
        //根据航班id和座位的id来请求当前的机票详情
        this.$axios({
            url:"/airs/" + id,
            //axios的get的请求的参数用params  ,   post请求参数用data
            params:{
                seat_xid
            }
        }).then(res=>{
            // console.log(res);
            this.detail = res.data;
            this.$store.commit("air/setflightData",this.detail)
        })
    },

    methods: {
        // 添加乘机人
        handleAddUsers(){
            this.form.users.push({
                username:"",
                id:""
            })
        },
        
        // 移除乘机人
        handleDeleteUser(index){
            this.form.users.splice(index,1)
        },
        
        // 发送手机验证码
        handleSendCaptcha(){
            //如果手机号码有填
            if(this.form.contactPhone){
                // 调用store user.js里面的action方法来发送手机验证码
                this.$store.dispatch("user/sendCaptcha",this.form.contactPhone).then(code=>{
                    this.$message.success("手机验证码发送成功：验证码为：" + code)
                })
            }else{
                this.$message.error("请输入手机号码");
            }
        },

        // 提交订单
        handleSubmit(){
        this.$refs.form.validate((valid) => {
             // 第二个表单
                this.$refs.form2.validate(valid2 => {
                    if (valid && valid2) {
                        // console.log(this.form);
                        this.$axios({
                            url:"/airorders",
                            method:"post",
                            headers:{
                                Authorization: `Bearer ` + this.$store.state.user.userInfo.token 
                            },
                            data:this.form,
                        }).then(res=>{
                            this.$message.success("订单提交成功")
                        })
                    }
                })
            })
        },

        // 点击保险的checkbox时候触发
        handleInsurances(id){
            // 判断数组中是否已经包含了该id
            // 如果index大于-1就表示有id，反之就没有
            //  indexOf根据元素查找该元素在数组中的索引 , 数组.indexOf(元素) 如果没有返回值是-1，有的话则是索引
            const index = this.form.insurances.indexOf(id);
            if(index>-1){
                // 有该id就删除
                this.form.insurances.splice(index,1);
            }else{
                // 还没有该id
                this.form.insurances.push(id)
            }
            // console.log(this.form.insurances);
        }
    }
}
</script>

<style scoped lang="less">
    .air-column{
        border-bottom:1px #ddd dashed;
        padding-bottom: 20px;   
        margin-bottom: 20px;
    }

    .air-column h2{
        margin-bottom: 20px;
        font-size: 22px;
        font-weight: normal;
    }

    /deep/ .el-select .el-input {
        width: 130px;
    }

    .input-with-select{
        width:590px;
    }

    .input-with-select /deep/  .el-input-group__prepend {
        background-color: #fff;
    }
    .member-info /deep/ .el-form-item{
        margin-bottom:0;
    }

    .member-info-item{
        border-bottom:1px #eee dashed;
        padding-bottom: 20px;
        position: relative;

        &:first-child{
            .delete-user{
                display: none;
            }
        }
    }

    .add-member{
        margin-top:20px;
    }

    .delete-user{
        display: block;
        background:#ddd;
        width:16px;
        height:16px;
        font-size:14px;
        text-align: center;
        line-height: 16px;
        color:#fff;
        cursor: pointer;
        border-radius: 50px;
        position:absolute;
        right:-30px;
        top:50%;
    }

    .insurance{
        > div{
            margin-top:10px;
        }
    }

    .insurance-item{
        margin-bottom: 20px;
    }

    .contact{
        /deep/ .el-input{
            width:50%;
        }
    }

    .submit{
        margin: 50px auto;
        display: block;
        width:250px;
        height:50px;
    }
</style>