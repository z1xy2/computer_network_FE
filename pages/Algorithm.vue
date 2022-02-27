<template>
  <el-main>
    <el-col :span="16">
      <el-card>
        <h3>算法选择</h3>
        <el-radio-group v-model="selArg">
          <el-radio-button label="FIFO"></el-radio-button>
          <el-radio-button label="LRU"></el-radio-button>
          <el-radio-button label="OPT"></el-radio-button>
        </el-radio-group>
      </el-card>
      <el-card>
        <div class="block">
          <span class="demonstration">步骤导航栏</span>
          <span v-for="item in memory_history[index]" :key="item">{{ item[0] }}</span>
          <el-slider v-model="index" :max="len"></el-slider>
          <el-input-number
            v-model="index"
            :min="0"
            :max="len"
            label="描述文字"
          ></el-input-number>
        </div>
      </el-card>
    </el-col>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
      selArg: "FIFO",
    };
  },
  computed: {
    memory_history() {
      if (this.selArg == "FIFO") {
        return this.$data1.dataDic1.memory_history;
      } else if (this.selArg == "LRU") {
        return this.$data1.dataDic2.memory_history;
      } else {
        return this.$data1.dataDic3.memory_history;
      }
    },
    page_faults() {
      if (this.selArg == "FIFO") {
        return this.$data1.dataDic1.page_faults;
      } else if (this.selArg == "LRU") {
        return this.$data1.dataDic2.page_faults;
      } else {
        return this.$data1.dataDic3.page_faults;
      }
    },
    replace_idx(){
      if (this.selArg == "FIFO") {
        return this.$data1.dataDic1.replace_idx;
      } else if (this.selArg == "LRU") {
        return this.$data1.dataDic2.replace_idx;
      } else {
        return this.$data1.dataDic3.replace_idx;
      }      
    },
    len() {
      return this.page_faults.length;
    },
  },
};
</script>

<style>
</style>