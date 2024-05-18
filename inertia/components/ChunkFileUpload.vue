<script setup lang="ts">
import { onMounted } from 'vue'
import useChunkUploader from '~/compsables/useChunkUploader'

const props = defineProps<{ fileToUpload: File }>()

const { file, progress, uploadFile, uploaded, uploading } = useChunkUploader()

onMounted(() => {
  file.value = props.fileToUpload
})
</script>
<template>
  <div class="flex gap-4">
    <div class="flex flex-col">
      {{ file?.name }}
    </div>
    <div>
      <progress v-if="progress" :value="progress" max="100" class="progress progress-success w-44">
        {{ progress }}%
      </progress>
    </div>
    <div>
      <button class="btn btn-sm" @click="uploadFile(0)" v-if="!uploaded" :disabled="uploading">
        upload
      </button>
      <div class="badge badge-success" v-else>Upload complete</div>
    </div>
  </div>
</template>
