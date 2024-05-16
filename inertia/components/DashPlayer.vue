<script setup lang="ts">
import dashjs, { MediaPlayerClass } from 'dashjs'
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  url: string
}>()

const videoPlayer = ref()
const player = ref<MediaPlayerClass>()
let currentQualityIndex = 0
const qualities = [
  { resolution: 'Low (480p)', url: props.url + '/low.mpd' },
  { resolution: 'Medium (720p)', url: props.url + '/medium.mpd' },
  { resolution: 'High (1080p)', url: props.url + '/high.mpd' },
]
const selectedQuality = ref(qualities[currentQualityIndex])

const changeQuality = () => {
  if (player) {
    currentQualityIndex = qualities.findIndex((q) => q === selectedQuality.value)
    player.value!.attachSource(selectedQuality.value.url)
  }
}

onMounted(() => {
  player.value = dashjs.MediaPlayer().create()

  // Override URL resolution logic

  if (videoPlayer.value) {
    player.value.initialize(videoPlayer.value, selectedQuality.value.url, true)
  }
})

onUnmounted(() => {
  if (player.value) {
    player.value.reset()
  }
})
</script>

<template>
  <div>
    <video ref="videoPlayer" controls></video>
  </div>
  <br />
  <br />
  <div>
    <label>Quality:</label>
    <select
      v-model="selectedQuality"
      @change="changeQuality"
      class="select select-bordered select-sm w-full max-w-[150px]"
    >
      <option v-for="(quality, index) in qualities" :key="index" :value="quality">
        {{ quality.resolution }}
      </option>
    </select>
  </div>
</template>
