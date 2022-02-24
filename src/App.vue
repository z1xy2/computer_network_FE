<template>
  <el-container style="height:100%" direction="vertical">
    <Header></Header>
    <router-view></router-view>
  </el-container>
</template>

<script>
import Header from './components/Header.vue'
export default {
  components:{
    Header
  },
  // mounted() {
  //   console.log(this)
  // },
}
</script>

<style scoped>
</style>
