import { cuid } from '@adonisjs/core/helpers'
import {
  createWriteStream,
  existsSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'

export function readJsonFile(filePath: string): null | Record<string, any> {
  if (!existsSync(filePath)) {
    return null
  }
  const data = readFileSync(filePath, 'utf8')
  return JSON.parse(data)
}

export function writeJsonFile(filePath: string, data: Record<string, any>) {
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

export function updateJsonFile(filePath: string, newData: Record<string, any>) {
  const data = readJsonFile(filePath)
  if (data) {
    // Update the object (this assumes newData is an object with keys to be updated)
    Object.assign(data, newData)
    writeJsonFile(filePath, data)
  } else {
    // If the file doesn't exist, create a new one with newData
    writeJsonFile(filePath, newData)
  }
}

export function concatenateChunks(chunksDir: string) {
  const outputPath = path.join(chunksDir, Date.now() + cuid() + '.mp4')

  // Ensure chunks directory exists
  if (!existsSync(chunksDir)) {
    return 'missing dir'
  }

  // Read all chunk files and sort them by index
  const chunkFiles = readdirSync(chunksDir)
    .filter((file) => file.startsWith('chunk-'))
    .sort((a, b) => {
      const aIndex = Number.parseInt(a.split('-')[1].split('.')[0])
      const bIndex = Number.parseInt(b.split('-')[1].split('.')[0])
      return aIndex - bIndex
    })

  // Create a write stream for the output file
  const outputStream = createWriteStream(outputPath)

  // Concatenate the chunks
  for (const chunkFile of chunkFiles) {
    const chunkPath = path.join(chunksDir, chunkFile)
    const chunkData = readFileSync(chunkPath)
    outputStream.write(chunkData)
  }

  // Close the output stream
  outputStream.end()

  // Optionally, remove the chunks after concatenation
  for (const chunkFile of chunkFiles) {
    unlinkSync(path.join(chunksDir, chunkFile))
  }

  console.log(`MP4 chunks concatenated successfully. Output file: ${chunksDir}`)
}
