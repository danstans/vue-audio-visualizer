<template>
  <div class="av__visualizer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'AvCanvas',
  props: {
    audioAnalyser: {
      type: AnalyserNode,
      default: null
    }
  },
  data () {
    return {
      myCanvas: null,
      myCtx: null
    }
  },
  mounted: function () {
    this.myCanvas = this.$refs.canvas
    this.myCtx = this.myCanvas.getContext('2d')
    this.myCanvas.width = this.myCanvas.parentElement.getBoundingClientRect().width
    this.myCanvas.height = this.myCanvas.parentElement.getBoundingClientRect().height
    this.mainLoop()
  },
  methods: {
    mainLoop () {
      const frqBits = this.audioAnalyser.frequencyBinCount
      const dataArray = new Uint8Array(frqBits)
      var barWidth = this.myCanvas.width / frqBits * 2.5
      this.audioAnalyser.getByteFrequencyData(dataArray)
      this._fillCanvasBG()
      var xPos = 0;
      dataArray.forEach((data, indexPos) => {
        var barHeight = dataArray[indexPos] / 255 * this.myCanvas.height * 0.6
        this._drawBars(xPos, barHeight, barWidth)
        xPos += barWidth +1 
      })
      requestAnimationFrame(this.mainLoop)
    },
    _fillCanvasBG: function () {
      // Resets the canvas to black
      const w = this.myCanvas.width
      const h = this.myCanvas.height
      this.myCtx.fillStyle = 'black'
      this.myCtx.fillRect(0, 0, w, h)
    },
    _drawBars: function (xPos, yPos, barWidth) {
      this.myCtx.beginPath()
      this.myCtx.fillStyle = 'red'
      var barHeight = (this.myCanvas.height - yPos)
      this.myCtx.fillRect(xPos, barHeight, barWidth, barHeight + yPos)
    }
  }
}
</script>

<style scoped>
  .av__visualizer {
    height: calc(100% - var(--av-height));
    width: 100%;
    z-index: 1;
  }
</style>
