import Vue from 'vue'
import app from './app.vue'
import './application.styl'
// import 'buefy/dist/buefy.css'
import router from './router'
import store from './store'

// Vue.use(Buefy)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')

