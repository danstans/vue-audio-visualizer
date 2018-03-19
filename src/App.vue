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
          songName: 'TaKillya (Baby Driver Soundtrack)',
          songSrc: 'http://k003.kiwi6.com/hotlink/x84m8bfceb/Legend_of_Zelda_Remix_Kiwi6_Exclusive_DL_.mp3',
          artistName: 'Vinnie Maniscalco',
          songImg: 'https://adamology.net/wp-content/uploads/2017/07/Baby-Driver.jpg'
        },
        {
          songName: 'Fragile',
          songSrc: 'http://k006.kiwi6.com/hotlink/89egzfld8n/Fragile.mp3',
          artistName: 'Marek Iwaszkiewicz',
          songImg: 'https://pbs.twimg.com/profile_images/765322021060354048/0ppD4P6Y_400x400.jpg'
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
