<template>
  <el-header id="ElHeader">
      <el-menu
       id='ElMenu'
        background-color="#545c64"
        :router="true"
        mode="horizontal"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
      <h1>操作系统课程设计</h1>
        <el-menu-item index="/">主页</el-menu-item>
        <el-menu-item index="/Algorithm" >算法展示</el-menu-item>
        <el-menu-item index="/Statistics" >统计数据</el-menu-item>
      </el-menu>
  </el-header>
</template>

<style>
#ElHeader {
  height: 100%;
  padding: 0px;
}
#ElMenu{
  display: flex;
  margin-right: auto;
  margin-left: auto;
  justify-content: center;
  align-items: center;
}
h1 {
  margin-right: 50px;
  color: #fff;
}
</style>

<script scoped>
export default {
  name:'Header',
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      console.log(this.$route.path);
    },
  },
};
</script>