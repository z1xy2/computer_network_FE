import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home'
import Algorithm from '../pages/Algorithm'
import Statistic from '../pages/Statistics'
Vue.use(VueRouter)
const routes=[
    {
        path:'/',
        name:'Home',//简化路由名，可以不写
        component:Home
    },
    {
        path:'/Algorithm',
        name:'Algorithm',//简化路由名，可以不写
        component:Algorithm
    },
    {
        path:'/Statistics',
        name:'Statistics',//简化路由名，可以不写
        component:Statistic
    },    
]
//创建并暴露路由器
export default new VueRouter({
    routes:routes
})
