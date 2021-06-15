import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueMobileDetection from 'vue-mobile-detection'

Vue.config.productionTip = false
Vue.use(VueMobileDetection);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

