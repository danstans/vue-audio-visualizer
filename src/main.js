import Vue from 'vue'
import App from './App'
// import AudioVisualizer from './components/AudioVisualizer.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')

// Vue.config.productionTip = false

// const VueAudioVisualizer = {
//   install (Vue, params = {}) {
//     Vue.component('audio-visualizer', AudioVisualizer)
//   }
// }

// // export default VueAudioVisualizer

// export {
//   AudioVisualizer
// }
