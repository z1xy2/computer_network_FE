<template>
  <el-main>
    <div id="getDataDiv">
      <h2 align="center">欢迎来到聊天室</h2>
      <el-radio-group id="RadioGroup" v-model="radio1">
        <el-radio-button
          label="账号登录"
        ></el-radio-button>
        <el-radio-button label="账号注册"></el-radio-button>
      </el-radio-group>
      <el-form
        id="form1"
        :model="user"
        label-width="90px"
        v-if="showPage1"
      >
        <el-form-item label="账号">
          <el-input v-model="user.id" style="width: 230px"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="user.pass" style="width: 230px" type="pass"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:50px">
          <el-button type="primary" @click="onSubmit">立即登录</el-button>
        </el-form-item>
      </el-form>
      <Register v-if="!showPage1"></Register>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <el-result icon="success" title="登录成功">
        <template slot="extra">
          <el-button type="primary" size="medium" @click="jump"
            >进入</el-button
          >
        </template>
      </el-result>
    </el-dialog>
  </el-main>
</template>

<script>
import Register from '../src/components/Register.vue'
// import Vue from "vue";
export default {
  name: "Login",
  components:{Register},
  data() {
    return {
      radio1: "账号登录",
      centerDialogVisible: false,
      user: {
        id: "",
        name: "",
        pass: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      this.axios({
        method:"POST",
        url:"/api/myapp/Login",
        data:{
          user:this.user
        }
      })

        .then((response) => {
          
          if(response.data.result=='success'){
            this.centerDialogVisible = true;
            localStorage.setItem('id', this.user.id);
          }else{
            alert('账号密码不匹配')
          }
        })
        .catch((response) => {
          console.log(response);
        });
    },
    jump() {
      this.$router.push("/Chart");
    },
  },
  computed: {
    showPage1() {
      if (this.radio1 == "账号登录") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
#getDataDiv {
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px auto 0px auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 600px;
  background-color: rgba(255, 255, 255, 0.9);
}
.el-radio-group {
  margin-top: 30px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
}
#form1 > {
  width: 100px;
}
.el-main {
  background-image: url("../src/assets/1.jpg");
  height: 650px;
}
</style>