import { ref } from 'vue'
import axios from 'axios'

export default function useChunkUploader() {
  const id = Date.now() + (Math.random() * 100).toString()
  const uploaded = ref(false)
  const uploading = ref(false)
  // const form = reactive({
  //   id,
  //   chunk: null as null | File,
  //   totalChunks: '' as unknown as number,
  //   chunkIndex: '' as unknown as number,
  // })

  const file = ref<null | File>(null)
  const progress = ref<number>(0)

  const uploadFile = async (chunkIndex: number) => {
    if (chunkIndex === 0) {
      uploading.value = true
    }
    if (file.value) {
      const chunkSize = 5 * 1024 * 1024 // 5MB
      const totalChunks = Math.ceil(file.value.size / chunkSize)
      const start = chunkIndex * chunkSize
      const end = Math.min(start + chunkSize, file.value.size)
      const chunk = file.value.slice(start, end)

      // Create a new FormData object for each chunk upload
      const formData = new FormData()
      formData.append('id', String(id))
      formData.append('chunk', chunk)
      formData.append('chunkIndex', chunkIndex.toString())
      formData.append('totalChunks', totalChunks.toString())
      formData.append('fileName', file.value.name)

      const res = await axios.post<{ nextIndex?: number; completed: boolean }>(
        '/upload-chunks',
        formData
      )
      console.log(res.data)

      if (res?.data?.nextIndex) {
        progress.value = Math.floor(((chunkIndex + 1) / totalChunks) * 100)
        await uploadFile(res?.data?.nextIndex)
      }

      if (res?.data?.completed === true) {
        progress.value = 100
        uploaded.value = true
      }
    }
  }

  return {
    file,
    progress,
    uploadFile,
    uploaded,
    uploading,
  }
}
