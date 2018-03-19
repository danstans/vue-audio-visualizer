<template>
  <canvas class="av__visualizer" ref="canvas">
    This is the vis
  </canvas>
</template>

<script>
export default {
  name: 'AvCanvas',
  data () {
    return {
      myCanvas: null
    }
  },
  mounted: function () {
    this.myCanvas = this.$refs.canvas
    var ctx = this.myCanvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(20, 20, 150, 75)
  }
}
</script>

<style scoped>
  .av__visualizer {
    height: calc(100% - var(--av-height));
    width: 100%;
    background: black;
    z-index: 1;
  }
</style>
