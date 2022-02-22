<template>
  <el-header id="ElHeader">
      <el-menu
       id='ElMenu'
        background-color="#545c64"
        :router="true"
        class="el-menu-demo"
        mode="horizontal"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
      <h1>操作系统课程设计</h1>
        <el-menu-item index="/" route="">主页</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="3" disabled>消息中心</el-menu-item>
        <el-menu-item index="4"
          ><a href="https://www.ele.me" target="_blank"
            >订单管理</a
          ></el-menu-item
        >
      </el-menu>
  </el-header>
</template>

<style>
#ElHeader {
  height: 100%;
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

<script>
export default {
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