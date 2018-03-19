<template>
  <div class="av" :style="{ '--av-height': avHeight }" v-if="playlist">
    <av-canvas v-if="showVis"/>
    <div class="av__audio">
      <!-- <img src="../../assets/logo.png"> -->
      <div class="av__audio__meta">
        <div class="av__audio__meta__img">
          <img :src="playlist[currentSong].songImg" alt="">
        </div>
        <div class="av__audio__meta__tags">
          <span class="av__audio__meta__tags__title">{{playlist[currentSong].songName}}</span>
          <span class="av__audio__meta__tags__artist">{{playlist[currentSong].artistName}}</span>
        </div>
      </div>
      <div class="av__audio__playback">
        <span @click="evalSong">Play button /</span>
        <span @click="nextSong">/ Go Next /</span>
        <span @click="prevSong">/ Go prev /</span>
        <span @click="toggleShuffle">/ Shuffle /</span>
        <span @click="toggleRepeat">/ Repeat /</span>
        <span>/ Progress bar</span>
      </div>
      <div class="av__audio__togglers">
        <span @click="showVis = !showVis">Toggle Visualizer</span>
        <span>Toggle Volume</span>
        <span>Toggle Playlist</span>
      </div>
      <audio :src="playlist[currentSong].songSrc" type="audio/ogg" ref="myAudio"></audio>
    </div>
  </div>
</template>

<script>
import AvCanvas from './AvCanvas'
import * as Utils from '../utils/utils.js'
export default {
  name: 'AudioVisualizer',
  mounted: function () {
    this.myAudioPlayer = this.$refs.myAudio
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
  components: { AvCanvas },
  data () {
    return {
      showVis: false,
      myAudioPlayer: null,
      currentSong: 0,
      isShuffling: false,
      isRepeat: 0
    }
  },
  methods: {
    evalSong () {
      this.myAudioPlayer.paused ? this.playSong() : this.pauseSong()
    },
    playSong () {
      setTimeout(function () {
        this.myAudioPlayer.play()
      }.bind(this), 150)
    },
    pauseSong () {
      this.myAudioPlayer.pause()
    },
    nextSong () {
      this.myAudioPlayer.pause()
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
    toggleShuffle () {
      this.isShuffling = !this.isShuffling
    },
    toggleRepeat () {
      this.isRepeat = Utils.mod(this.isRepeat + 1, 3)
      console.log(this.isRepeat)
    }
  }
}
</script>

<style lang="scss">
.av {
  height: 100vh;
  width: 100%;
  position: fixed;
  bottom: 0;
  color: white;

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
      width: 50%;
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
