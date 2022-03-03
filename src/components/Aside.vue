<template>
  <el-menu
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    default-active="1"
    style="height:100%"
  >
    <!-- <ul>
      <li v-for="(item, index) in userList" :key="index">
        <p>
          <span>{{ item }}</span>
        </p>
      </li>
    </ul> -->
    <h1 align="center" style="color:#fff ; font-size:25px">欢迎来到聊天室</h1>
    <el-menu-item v-for="(item, index) in userList" :key="index">
      <i class="el-icon-user"></i>
      <span slot="title">{{ item }}</span>
    </el-menu-item>
  </el-menu>
</template>


<script>
export default {
  //为vuetools中组件命名
  name: "Aside",
  methods: {},
  data() {
    return {
    };
  },
  props:['userList'],
};
</script>
