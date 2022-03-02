<template>
  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
  >
    <el-form-item label="账号" prop="id">
      <el-input v-model="ruleForm.id" style="width: 230px"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input
        style="width: 230px"
        type="password"
        v-model="ruleForm.pass"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input
        style="width: 230px"
        type="password"
        v-model="ruleForm.checkPass"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Register",
  data() {
    var checkId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      this.axios({
        method: "POST",
        url: "/api/myapp/checkId",
        data: {
          id: this.ruleForm.id,
        },
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.find == true) {
            callback(new Error("id已被注册"));
          } else {
            callback();
          }
        })
        .catch((response) => {
          console.log(response);
        });
      //   setTimeout(() => {
      //     if (!Number.isInteger(value)) {
      //       callback(new Error("请输入数字值"));
      //     } else {
      //       if (value < 18) {
      //         callback(new Error("必须年满18岁"));
      //       } else {
      //         callback();
      //       }
      //     }
      //   }, 1000);
    };
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          //如果不为空再对checkpass进行校验调用校验函数
          this.$refs.ruleForm.validateField("checkPass");
        }
        //不返回错误
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        id: "",
        pass: "",
        checkPass: "",
        age: "",
      },
      rules: {
        id: [{ validator: checkId, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      // validate函数猜测是默认对所有数据进行了校验
      //如果校验函数都执行完了执行validate函数
      //传入的valid为boolean类型,校验都通过为true，否则为false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            method: "POST",
            url: "/api/myapp/addUser",
            data: {
              user: this.ruleForm,
            },
          })
            .then((response) => {
              console.log(response.data);
            })
            .catch((response) => {
              console.log(response);
            });
          alert("注册成功!");
        } else {
          alert("输入的信息有误!");
          return false;
        }
      });
    },
    //清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style>
</style>