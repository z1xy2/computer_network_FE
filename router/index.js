import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login'
import Algorithm from '../pages/Algorithm'
import Statistic from '../pages/Statistics'
import Register from '../src/components/Register'
Vue.use(VueRouter)
const routes=[
    {
        path:'/',
        name:'Login',//简化路由名，可以不写
        component:Login
    },
    {
        path:'/Register',
        name:'Register',//简化路由名，可以不写
        component:Register
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
