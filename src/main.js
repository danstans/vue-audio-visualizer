import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

// import AudioVisualizer from './components/AudioVisualizer'
// const AVPlugin = {
//   install (Vue) {
//     Vue.component('audio-visualizer', AudioVisualizer)
//   }
// }

// export default AVPlugin

// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(AVPlugin)
// }
