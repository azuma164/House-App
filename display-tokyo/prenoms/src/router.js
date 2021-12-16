import Vue from 'vue'
import Router from 'vue-router'
import Home2 from './Home2.vue'
import Routing from './views/Routing.vue'
import Time from './Time.vue'

Vue.use(Router)

export default new Router({
  // デフォルトの挙動では URL に `#` が含まれる.
  // URL から hash を取り除くには `mode:history` を指定する
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home2',
      component: Home2
    },
    {
      path: '/routing',
      name: 'routing',
      component: Routing 
    },
    {
      path: '/time',
      name: 'time',
      component: Time
    }
  ]
})

