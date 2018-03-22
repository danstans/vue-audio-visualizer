<template>
  <div id="app">
    <div class="content">
      This is the main content
    </div>
    <audio-visualizer
     avHeight="82px"
     :playlist="playlist"
    ></audio-visualizer>
  </div>
</template>

<script>
import AudioVisualizer from './components/AudioVisualizer'
export default {
  components: { AudioVisualizer },
  data () {
    return {
      playlist: [
        {
          songName: 'Agnes',
          songSrc: 'https://github.com/danstans/vue-audio-visualizer/raw/master/src/assets/agnes.mp3',
          songLive: '/static/agnes.mp3',
          artistName: 'Glass Animals',
          songImg: 'https://pbs.twimg.com/profile_images/765322021060354048/0ppD4P6Y_400x400.jpg'
        },
        {
          songName: 'TaKillya (Baby Driver Soundtrack)',
          songSrc: 'https://github.com/danstans/vue-audio-visualizer/raw/master/src/assets/takillya.mp3',
          songLive: '/static/takillya.mp3',
          artistName: 'Vinnie Maniscalco',
          songImg: 'https://adamology.net/wp-content/uploads/2017/07/Baby-Driver.jpg'
        },
        {
          songName: 'Kipod',
          songSrc: 'https://github.com/danstans/vue-audio-visualizer/raw/master/src/assets/kipod.mp3',
          songLive: '/static/kipod.mp3',
          artistName: 'Infected Mushrrom',
          songImg: 'https://is4-ssl.mzstatic.com/image/thumb/Music/45/71/ff/mzi.mtqdovgf.jpg/1200x630bb.jpg'
        },
        {
          songName: 'Spitfire',
          songSrc: 'https://github.com/danstans/vue-audio-visualizer/raw/master/src/assets/spitfire.mp3',
          songLive: '/static/spitfire.mp3',
          artistName: 'Infected Mushrrom',
          songImg: 'https://is4-ssl.mzstatic.com/image/thumb/Music/45/71/ff/mzi.mtqdovgf.jpg/1200x630bb.jpg'
        }
      ]
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
}
</style>
