<template>
  <div class="av" :style="{ '--av-height': avHeight }" ref="av" v-if="playlist">
    <av-canvas
    :audioAnalyser="myAnalyser"
    @pauseSong="evalSong"
    @prevSong="prevSong"
    @nextSong="nextSong"
    @lowerVolume="lowerVolume"
    @raiseVolume="raiseVolume"
    v-if="showVis"/>
    <div class="av__audio">
      <div class="av__audio__meta">
        <div class="av__audio__meta__img">
          <img :src="computedPlaylist[currentSong].songImg" alt="">
        </div>
        <div class="av__audio__meta__tags">
          <span class="av__audio__meta__tags__title">{{computedPlaylist[currentSong].songName}}</span>
          <span class="av__audio__meta__tags__artist">{{computedPlaylist[currentSong].artistName}}</span>
        </div>
      </div>
      <div class="av__audio__playback">
        <audio-controls
        @evalSong="evalSong"
        @nextSong="nextSong"
        @prevSong="prevSong"
        @toggleShuffle="toggleShuffle"
        @toggleRepeat="toggleRepeat"
        :repeatVal="repeatVal"
        :isShuffling="isShuffling"
        :songControls="songControls"
        ></audio-controls>
      </div>
      <div class="av__audio__togglers">
        <span @click="showCanvas">Toggle Visualizer</span>
        <span>Toggle Volume</span>
        <span>Toggle Playlist</span>
      </div>
      <audio
      :src="computedPlaylist[currentSong].songLive"
      type="audio/mp3"
      ref="myAudio"
      @timeupdate='onTimeUpdateListener'
      @ended="handleSongEnd"></audio>
    </div>
  </div>
</template>

<script>
import AvCanvas from './AvCanvas/AvCanvas'
import AudioControls from './AudioControls'
import * as Utils from '../utils/utils.js'
export default {
  name: 'AudioVisualizer',
  mounted: function () {
    this.myAudioPlayer = this.$refs.myAudio
    this.setAnalyser()
  },
  props: {
    avHeight: {
      type: String,
      default: '72px'
    },
    playlist: {
      type: Array,
      default: null
    }
  },
  components: { AvCanvas, AudioControls },
  data () {
    return {
      showVis: false,
      myAudioPlayer: null,
      myAnalyser: null,
      currentSong: 0,
      isShuffling: false,
      repeatVal: 0, // 0 -> repeat none, 1 -> repeat one, 2 -> repeat all
      songControls: {
        songPercent: 0,
        songTime: '',
        songDuration: '',
        songPaused: true
      }
    }
  },
  computed: {
    computedPlaylist () {
      if (this.isShuffling) {
        return Utils.shuffle(this.playlist)
      }
      return this.playlist
    }
  },
  methods: {
    showCanvas () {
      this.showVis = !this.showVis
      this.showVis ? this.$refs.av.style.height = '100%' : this.$refs.av.style.height = 'auto'
    },
    evalSong () {
      this.myAudioPlayer.paused ? this.playSong() : this.pauseSong()
    },
    playSong () {
      setTimeout(function () {
        this.myAudioPlayer.play()
        this.songControls.songPaused = false
      }.bind(this), 150)
    },
    pauseSong () {
      setTimeout(function () {
        this.myAudioPlayer.pause()
        this.songControls.songPaused = true
      }.bind(this), 150)
    },
    nextSong () {
      this.currentSong = (this.currentSong + 1) % this.playlist.length
      this.myAudioPlayer.currentTime = 0
      this.playSong()
    },
    prevSong () {
      if (this.myAudioPlayer.currentTime < 2) {
        this.currentSong = Utils.mod(this.currentSong - 1, this.playlist.length)
      }
      this.myAudioPlayer.currentTime = 0
      this.playSong()
    },
    lowerVolume () {
      this.myAudioPlayer.volume - 0.05 < 0 ? this.myAudioPlayer.volume = 0 : this.myAudioPlayer.volume -= 0.05
    },
    raiseVolume () {
      this.myAudioPlayer.volume + 0.05 > 1 ? this.myAudioPlayer.volume = 1 : this.myAudioPlayer.volume += 0.05
    },
    toggleShuffle () {
      this.isShuffling = !this.isShuffling
    },
    toggleRepeat () {
      this.repeatVal = Utils.mod(this.repeatVal + 1, 3)
    },
    onTimeUpdateListener () {
      var currentTime = this.myAudioPlayer.currentTime
      var currentDuration = this.myAudioPlayer.duration
      var percent = (currentTime / currentDuration)
      if (isNaN(percent)) {
        this.songControls.songPercent = 0
      } else {
        this.songControls.songPercent = percent
        this.songControls.songTime = Math.floor(currentTime.toFixed(0) / 60) + ':' + (currentTime.toFixed(0) % 60 ? Utils.minTwoDigits((currentTime.toFixed(0) % 60)) : '00')
        this.songControls.songDuration = Math.floor(currentDuration.toFixed(0) / 60) + ':' + (currentDuration.toFixed(0) % 60 ? Utils.minTwoDigits(currentDuration.toFixed(0) % 60) : '00')
      }
    },
    handleSongEnd () {
      switch (this.repeatVal) {
        case 0: // Repeat None
          (this.currentSong + 1 === this.playlist.length) ? this.currentSong = 0 : this.nextSong()
          break
        case 1: // Repeat One
          this.myAudioPlayer.currentTime = 0
          this.playSong()
          break
        case 2: // Repeat All
          this.nextSong()
          break
      }
    },
    setAnalyser: function () {
      const ctx = new AudioContext()
      const src = ctx.createMediaElementSource(this.myAudioPlayer)
      ctx.crossOrigin = 'anonymous'
      this.myAudioPlayer.crossOrigin = 'anonymous'
      this.myAnalyser = ctx.createAnalyser()
      src.connect(this.myAnalyser)
      this.myAnalyser.fftSize = 32768
      this.myAnalyser.connect(ctx.destination)
    }
  }
}
</script>

<style lang="scss">
@import url('../../node_modules/font-awesome/css/font-awesome.min.css');
.av {
  width: 100%;
  position: fixed;
  bottom: 0;
  color: white;
  user-select: none;

  &__audio {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: var(--av-height);
    background: #282828;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, .5);

    &__meta {
      position: absolute;
      left: 0px;
      height: inherit;
      width: auto;
      max-width: 25%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      &__img {
        width: var(--av-height);
        height: 100%;
        min-width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          max-height: 70%;
          max-width: 70%;
        }
      }

      &__tags {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        &__title {
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.21px;
          font-family: Helvetica, sans-serif;
          color: #fff;
        }

        &__artist {
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }

    &__playback {
      margin: 0 auto;
      height: 100%;
      width: 40%;
      max-width: 770px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__togglers {
      position: absolute;
      right: 10px;
      top: 0px;
      height: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
