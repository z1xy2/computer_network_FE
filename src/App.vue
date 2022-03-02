<template>
  <router-view></router-view>
</template>

<script>
//配置默认路由
export default {
  mounted() {
    this.axios.defaults.baseURL='http://127.0.0.1:8080'
  },
}
</script>

<style scoped>
</style>
