import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from '@/axios/http'

import LetItSnow from 'vue-let-it-snow'

import ElementUi from 'element-ui'
import  'element-ui/lib/theme-chalk/index.css'

Vue.filter('dateFormat', (date) => {
  let dt = new Date(date)
  let y = dt.getFullYear().toString().padStart(2,0)
  let m = dt.getMonth()+1
  m = m.toString().padStart(2,0)
  let d = dt.getDate().toString().padStart(2,0)

  return y + '-' + m + '-' + d
})
Vue.filter('headFormat',(num) => {
  if(num.toString().length <= 5){
    return num
  } else {
    let str = num.toString()
    return str.substring(0,str.length-4) + '万'
  }
})
Vue.filter('timeFormat',(time) => {
  let t = Math.floor(time/1000)
  if( t < 60) {
    return '00:'+t
  }
  let c = (t%60).toString().padStart(2,0)
  return '0'+Math.floor(t/60)+':'+ c
})
Vue.filter('songTimeFormat',(time) => {
  let t = Math.floor(time)
  if(time < 60){
    t = t.toString().padStart(2,0)
    return '00:' + t
  }
  let c = (t%60).toString().padStart(2,0)
  return '0'+ Math.floor(t/60) + ':'+ c
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.use(LetItSnow)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
