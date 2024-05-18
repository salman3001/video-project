const uploadFileInChunks = async (file: File) => {
  const chunkSize = 5 * 1024 * 1024 // 5MB
  const totalChunks = Math.ceil(file.size / chunkSize)

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('chunkIndex', chunkIndex)
    formData.append('totalChunks', totalChunks)

    await fetch('/upload', {
      method: 'POST',
      body: formData,
    })
  }
}
