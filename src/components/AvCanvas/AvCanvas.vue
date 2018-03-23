<template>
  <div class="av__visualizer">
    <canvas-settings
    @pauseSong="$emit('pauseSong')"
    @prevSong="$emit('prevSong')"
    @nextSong="$emit('nextSong')"
    @lowerVolume="$emit('lowerVolume')"
    @raiseVolume="$emit('raiseVolume')"
    @showCanvas="$emit('showCanvas')"
    ></canvas-settings>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import CanvasSettings from './CanvasSettings'
export default {
  name: 'AvCanvas',
  components: { CanvasSettings },
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
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
    this.myCanvas = this.$refs.canvas
    this.myCtx = this.myCanvas.getContext('2d')
    this.myCanvas.width = this.myCanvas.parentElement.getBoundingClientRect().width
    this.myCanvas.height = this.myCanvas.parentElement.getBoundingClientRect().height
    this.mainLoop()
  },
  methods: {
    handleResize (event) {
      this.myCanvas.width = this.myCanvas.parentElement.getBoundingClientRect().width
      this.myCanvas.height = this.myCanvas.parentElement.getBoundingClientRect().height
    },
    mainLoop () {
      const frqBits = this.audioAnalyser.frequencyBinCount
      const fftSize = this.audioAnalyser.fftSize
      const dataArray = new Uint8Array(frqBits)
      var timeFrequencyData = new Uint8Array(fftSize)
      const numBars = 64
      const gapSize = 4
      const step = Math.round(frqBits * 0.85 / (numBars)) // Songs do not contain the higher frequencies so cut them out
      var xPos = 0
      var barWidth = this.myCanvas.width / (numBars)
      this.audioAnalyser.getByteFrequencyData(dataArray)
      this.audioAnalyser.getByteTimeDomainData(timeFrequencyData)
      this._fillCanvasBG()
      dataArray.forEach((data, indexPos) => {
        if (indexPos % step) return
        const bits = Math.round(dataArray.slice(indexPos, indexPos + step)
          .reduce((v, t) => t + v, 0) / step)
        const barHeight = bits / 255 * this.myCanvas.height
        this._drawBars(xPos, barHeight, barWidth)
        xPos += barWidth + gapSize
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
    _drawBars: function (xPos, barHeight, barWidth) {
      this.myCtx.fillStyle = 'white'
      var yPos = (this.myCanvas.height - barHeight)
      this.myCtx.fillRect(xPos, yPos, barWidth, barHeight)
    }
  }
}
</script>

<style lang="scss" scoped>
  .av__visualizer {
    height: calc(100% - var(--av-height));
    width: 100%;
    position: relative;
  }
</style>
