<template>
<div :style="{ '--av-height': avHeight }">
  <div class="av" ref="av" v-if="playlist">
    <!-- The canvas component with visualizations -->
    <av-canvas
    :audioAnalyser="myAnalyser"
    @pauseSong="evalSong"
    @prevSong="prevSong"
    @nextSong="nextSong"
    @lowerVolume="lowerVolume"
    @raiseVolume="raiseVolume"
    v-if="isShowing.showVis"/>

    <!-- Wrapper for the audio player bottom of the page -->
    <div class="av__audio">

      <!-- Audio meta data about the current song -->
      <div class="av__audio__meta">
        <div class="av__audio__meta__img">
          <img :src="computedPlaylist[currentSong].songImg" alt="">
        </div>
        <div class="av__audio__meta__tags">
          <span class="av__audio__meta__tags__title">{{computedPlaylist[currentSong].songName}}</span>
          <span class="av__audio__meta__tags__artist">{{computedPlaylist[currentSong].artistName}}</span>
        </div>
      </div>

      <!-- Audio Controls (Play/Prev/Next + Song Progress) -->
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

      <!-- Page Togglers on the right side -->
      <div class="av__audio__togglers">
        <div class="av__audio__togglers__volume">
          <div class="av__audio__togglers__volume__hover" @mouseover="togglers.showVolumeSlider=true" @mouseout="togglers.showVolumeSlider=false" v-show="togglers.showVolumeSlider">
            <i class="fa fa-volume-off"></i>
            <div>
              <input class="volume-slider" ref="volumeBar" type="range" min="0" max="100" @input="slideVolume"/>
              <span ref="volumeLeft"></span>
            </div>
          </div>
          <i class="fa fa-volume-up" @mouseover="togglers.showVolumeSlider=true" @mouseout="togglers.showVolumeSlider=false" aria-hidden="true"></i>
        </div>
        <i class="fa fa-list-ol" :class="{'active-fa': isShowing.playlist}" aria-hidden="true" @click="isShowing.playlist = !isShowing.playlist"></i>
        <i @click="showCanvas" :class="{'active-fa': isShowing.showVis}" class="fa fa-signal" aria-hidden="true"></i>
      </div>

      <!-- HTML5 Audio -->
      <audio
      :src="computedPlaylist[currentSong].songLive"
      type="audio/mp3"
      ref="myAudio"
      @timeupdate='onTimeUpdateListener'
      @ended="handleSongEnd"></audio>
    </div>
  </div>
  <audio-playlist
  :playlist="playlist"
  @chooseSong="chooseSong"
  v-if="isShowing.playlist"
  ></audio-playlist>
</div>
</template>

<script>
import AvCanvas from './AvCanvas/AvCanvas'
import AudioControls from './AudioControls'
import AudioPlaylist from './AudioPlaylist'
import * as Utils from '../utils/utils.js'
import Vue from 'vue'
export default {
  name: 'AudioVisualizer',
  mounted: function () {
    this.myAudioPlayer = this.$refs.myAudio
    this.volume.volumeBar = this.$refs.volumeBar
    this.volume.volumeLeft = this.$refs.volumeLeft
    this.setAnalyser()
    this.updateVolumeBar()
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
  components: { AvCanvas, AudioControls, AudioPlaylist },
  data () {
    return {
      myAudioPlayer: null,
      volumeBar: null,
      myAnalyser: null,
      currentSong: 0,
      isShuffling: false,
      repeatVal: 0, // 0 -> repeat none, 1 -> repeat one, 2 -> repeat all
      isShowing: {
        playlist: false,
        showVis: false
      },
      songControls: {
        songPercent: 0,
        songTime: '',
        songDuration: '',
        songPaused: true
      },
      volume: {
        volumeBar: null,
        volumeLeft: null
      },
      togglers: {
        showVolumeSlider: false
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
      this.isShowing.showVis = !this.isShowing.showVis
      this.isShowing.showVis ? this.$refs.av.style.height = '100%' : this.$refs.av.style.height = 'auto'
    },
    evalSong () {
      this.myAudioPlayer.paused ? this.playSong() : this.pauseSong()
    },
    chooseSong (songIndex) {
      if (this.currentSong !== songIndex) {
        Vue.set(this.playlist[this.currentSong], 'isPlaying', false)
        this.currentSong = songIndex
        this.myAudioPlayer.currentTime = 0
        this.playSong()
      } else if (this.currentSong === songIndex && this.songControls.songPaused) {
        this.playSong()
      } else {
        this.pauseSong()
      }
    },
    playSong () {
      setTimeout(function () {
        this.myAudioPlayer.play()
        this.songControls.songPaused = false
        Vue.set(this.playlist[this.currentSong], 'isPlaying', true)
      }.bind(this), 150)
    },
    pauseSong () {
      setTimeout(function () {
        this.myAudioPlayer.pause()
        this.songControls.songPaused = true
        Vue.set(this.playlist[this.currentSong], 'isPlaying', false)
      }.bind(this), 150)
    },
    nextSong () {
      Vue.set(this.playlist[this.currentSong], 'isPlaying', false)
      this.currentSong = (this.currentSong + 1) % this.playlist.length
      this.myAudioPlayer.currentTime = 0
      this.playSong()
    },
    prevSong () {
      if (this.myAudioPlayer.currentTime < 2) {
        Vue.set(this.playlist[this.currentSong], 'isPlaying', false)
        this.currentSong = Utils.mod(this.currentSong - 1, this.playlist.length)
        Vue.set(this.playlist[this.currentSong], 'isPlaying', false)
      }
      this.myAudioPlayer.currentTime = 0
      this.playSong()
    },
    lowerVolume () {
      this.myAudioPlayer.volume - 0.05 < 0 ? this.myAudioPlayer.volume = 0 : this.myAudioPlayer.volume -= 0.05
      this.updateVolumeBar()
    },
    raiseVolume () {
      this.myAudioPlayer.volume + 0.05 > 1 ? this.myAudioPlayer.volume = 1 : this.myAudioPlayer.volume += 0.05
      this.updateVolumeBar()
    },
    updateVolumeBar () {
      this.cleanVolumeLeft(this.myAudioPlayer.volume * 100)
      this.volume.volumeBar.value = (this.myAudioPlayer.volume * 100)
    },
    slideVolume (event) {
      var targetVal = event.target.value
      this.cleanVolumeLeft(targetVal)
      this.setVolume(targetVal / 100)
    },
    setVolume (val) {
      this.myAudioPlayer.volume = val
      this.volume.volumeLeft.style.display = 'block'
      if (val === 0) {
        this.volume.volumeLeft.style.display = 'none'
        this.volume.volumeLeft.style.width = '0%'
      }
    },
    cleanVolumeLeft (targetVal) {
      if (targetVal > 75) {
        this.volume.volumeLeft.style.width = (targetVal - 6).toString() + '%'
      } else if (targetVal > 50) {
        this.volume.volumeLeft.style.width = (targetVal - 3.5).toString() + '%'
      } else if (targetVal > 25) {
        this.volume.volumeLeft.style.width = (targetVal - 3).toString() + '%'
      } else if (targetVal > 10) {
        this.volume.volumeLeft.style.width = (targetVal - 2).toString() + '%'
      } else {
        this.volume.volumeLeft.style.width = (targetVal - 1.5).toString() + '%'
      }
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
  width: 100vw;
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
    box-shadow: 0px 0px 10px rgba(0, 0, 0, .15);

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
        font-family: Helvetica, sans-serif;

        &__title {
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.21px;
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
      color: hsla(0, 0%, 100%, .6);
      display: flex;
      flex-direction: space-between;
      justify-content: center;
      align-items: center;
      margin: 0 -5px;

      &__volume {
        width: 150px;
        height: 30px;
        margin: 0 5px;
        display: flex;
        justify-content: flex-end;

        &__hover {
          flex-grow: 1;
          height: 100%;
          display: flex;
          margin: 0 -5px;

          >i {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          >div {
            margin: 0 5px;
            width: 80%;
            align-self: center;
            position: relative;

            .volume-slider {
              -webkit-appearance: none;
              position: absolute;
              border-radius: 5px;
            }

            >span {
              position: absolute;
              background: white;
              border: 1px solid white;
              height: 100%;
              border-radius: 5px;
              z-index: 1;
              width: calc(50% - 3px);
            }
          }

        }

        >i {
          margin: 0 -5px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      >i {
        width: 30px;
        margin: 0 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
      }
    }
  }
}

.active-fa {
  color: white;
}

input[type=range] {
  -webkit-appearance: none;
  background-color: gray;
  cursor: pointer;
}

input[type=range]:focus {
    outline: none;
}

input[type=range]::-webkit-slider-runnable-track {
  height: 3px;
  -webkit-appearance: none;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  margin-top: -5px;
  border-radius: 50%;
  cursor: pointer;
  background-color: white;
}
</style>
