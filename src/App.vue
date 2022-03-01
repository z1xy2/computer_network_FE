<template>
  <Login></Login>
</template>

<script>
import Login from '../pages/Login.vue'
//配置默认路由
export default {
  components:{
    Login
  },
  mounted() {
    this.axios.defaults.baseURL='http://127.0.0.1:8080'
  },
}
</script>

<style scoped>
</style>
