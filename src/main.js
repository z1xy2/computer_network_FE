import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import router from '../router'
import 'element-ui/lib/theme-chalk/index.css';
import store from '../src/store'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios);
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  render: h => h(App),
  router:router,
  store,
}).$mount('#app')
