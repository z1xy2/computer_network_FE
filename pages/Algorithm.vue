<template>
  <el-main>
    <el-col :span="15">
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
          <div id="pages" class="butLine">
            <span>请求的页面 </span>
            <el-button
              :type="step_index == index ? 'warning' : 'primary'"
              v-for="(item, index) in seq"
              :key="index"
              style="margin-right: -9px"
              >{{ item }}</el-button
            >
          </div>
          <div id="mem" class="butLine">
            <span>内存块页号 </span>
            <el-button
              :type="buttonCol(index)"
              v-for="(item, index) in memory_history[step_index]"
              :key="index"
              style="margin-right: -9px"
              >{{ item[0] }}</el-button
            >
          </div>
          <div id="age" class="butLine">
            <span>存在的时间 </span>
            <el-button
              :type="buttonCol(index)"
              v-for="(item, index) in memory_history[step_index]"
              :key="index"
              style="margin-right: -9px"
              >{{ item[1] }}</el-button
            >
          </div>
          <el-slider v-model="step_index" :max="len - 1"></el-slider>
          <el-input-number
            v-model="step_index"
            :min="0"
            :max="len - 1"
            label="描述文字"
          ></el-input-number>
        </div>
      </el-card>
      <el-card>
        <p>
          当前缺页次数:
          <span style="color: red">{{ page_faults[step_index] }}</span>
        </p>
        <p>操作提示:{{MPrompt[step_index]}}</p>
      </el-card>
    </el-col>
    <el-col :span="9">
      <el-card style="margin-right: 20px">
        <el-descriptions title="算法信息" :column='1'>
          <el-descriptions-item label="实现算法">{{
            selArg
          }}</el-descriptions-item>
          <el-descriptions-item label="缺页率"
            >{{ total_faults_rate }}%</el-descriptions-item
          >
          <el-descriptions-item label="大体实现方式">{{
            way
          }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card>
        <div ref="echarts" :style="{ width: '100%', height: '400px' }"></div>
      </el-card>
    </el-col>
  </el-main>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      step_index: 0,
      selArg: "FIFO",
    };
  },
  methods: {
    initEcharts() {
      const option = {
        title: {
          text: "缺页率对比"
        },
        tooltip: {},
        legend: {
          data: ["缺页率"]
        },
        xAxis: {
          data: ["FIFO", "LRU", "OPT"]
        },
        yAxis: {
          max:1,
          min:0,
        },
        series: [
          {
            name: "缺页率",
            type: "line", 
            data: [this.$data1.dataDic1.page_faults_rate,this.$data1.dataDic2.page_faults_rate,this.$data1.dataDic3.page_faults_rate]
          }
        ]
      };
      const myChart = echarts.init(this.$refs.echarts);// 图标初始化
      myChart.setOption(option);// 渲染页面
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    buttonCol(index) {
      if (index == this.replace_idx[this.step_index]) {
        return "success";
      } else {
        return "primary";
      }
    },
  },
  mounted(){
    this.initEcharts();
  },
  computed: {
    MPrompt(){
      if (this.selArg == "FIFO") {
        return this.$data1.dataDic1.prompt;
      } else if (this.selArg == "LRU") {
        return this.$data1.dataDic2.prompt;
      } else {
        return this.$data1.dataDic3.prompt;
      }      
    },
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
    replace_idx() {
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
    seq() {
      return this.$data1.seq;
    },
    total_faults_rate(){
      return  (this.page_faults[this.page_faults.length-1]/(this.page_faults.length-1)).toFixed(2)*100;
    },
    way(){
      if (this.selArg == "FIFO") {
        return 'FIFO 算法先进先出,也就是在内存中存在时间最长的出去,为每一个进入内存的页面利用二维数组的方式设置age属性,在遍历时每轮age加一,需要替换时就讲age最大的替换出去'
      } else if (this.selArg == "LRU") {
        return 'LRU 和先进先出算法类似，也是在内存中存在时间最长的出去,需要替换时就讲age最大的替换出去,区别在于当内存中已存在此页面时此页面的存在时间即age要清0';
      } else {
        return 'OPT算法即每次需要置换页面时遍历在此请求页面之后的所有页面，找到一个最长时间内用不到的页面，也就是在页面数组中下一个出现的index最大的页面将他置换出去';
      }      
    }
  },
};
</script>

<style>
.butLine {
  margin-top: 10px;
}
</style>