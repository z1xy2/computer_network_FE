import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home'
Vue.use(VueRouter)
const routes=[
    {
        path:'/',
        name:'Home',//简化路由名，可以不写
        component:Home
    }
]
//创建并暴露路由器
export default new VueRouter({
    routes:routes
})
