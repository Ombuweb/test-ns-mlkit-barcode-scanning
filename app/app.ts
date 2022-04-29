import Vue from 'nativescript-vue'
import Home from './components/Home.vue'
import MLKit from '@nativescript/mlkit-core/vue'

Vue.use(MLKit)
declare let __DEV__: boolean;

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__

new Vue({
  render: (h) => h('frame', [h(Home)]),
}).$start()
