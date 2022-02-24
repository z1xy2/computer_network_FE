<template>
  <el-main>
    <div id="getDataDiv">
      <h2 style="margin-left: 110px">算法执行方式</h2>
      <el-radio-group id="RadioGroup" v-model="radio1">
        <el-radio-button
          label="自动生成页面序列"
          style="margin-left: 40px"
        ></el-radio-button>
        <el-radio-button label="指定页面序列"></el-radio-button>
      </el-radio-group>
      <el-form
        id="form1"
        ref="form"
        :model="form"
        label-width="90px"
        v-if="showPage1"
      >
        <el-form-item label="内存块数">
          <el-input v-model="form.num" style="width: 230px"></el-input>
        </el-form-item>
        <el-form-item label="页面数">
          <el-select v-model="form.seqSize" placeholder="请选择内存大小">
            <el-option v-for="value in options" :key="value" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
      <el-form
        id="form1"
        ref="form"
        :model="form"
        label-width="90px"
        v-if="!showPage1"
      >
        <el-form-item label="内存块数">
          <el-input v-model="form.num" style="width: 230px"></el-input>
        </el-form-item>
        <el-form-item label="详细序列">
          <el-input v-model="form.seq" style="width: 230px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <el-result icon="success" title="生成成功">
        <template slot="extra">
          <el-button type="primary" size="medium" @click="jump">查看详情</el-button>
        </template>
      </el-result>
    </el-dialog>
  </el-main>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      radio1: "自动生成页面序列",
      centerDialogVisible: false,
      form: {
        num: 3,
        seq: "",
        seqSize: 15,
      },
      //记录选择的内存大小
      options: ["随机", 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      this.axios
        .get("http://127.0.0.1:8000/myapp/", {
          params: {
            form: this.form,
          },
        })
        .then((response) => {
          console.log(response);
          this.centerDialogVisible = true;
        })
        .catch((response) => {
          console.log(response);
        });
    },
    jump(){
      this.$router.push('/Algorithm')
    }
  },
  computed: {
    showPage1() {
      if (this.radio1 == "自动生成页面序列") {
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
  margin-bottom: 15px;
}
#form1 > {
  width: 100px;
}
.el-main {
  background-image: url("../src/assets/1.jpg");
  height: 650px;
}
</style>