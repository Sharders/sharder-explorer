import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import i18n from '../../i18n/i18n'
import App from './app.vue'
import Vuex from 'vuex'
Vue.use(Vuex)

Vue.use(ElementUI)

new Vue({
    el: '#app',
    i18n,
    render: h => h(App)
})
