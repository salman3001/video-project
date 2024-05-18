import commonConfig from '#config/common'
import { ImageType } from '#helpers/types'
import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
// @ts-ignore
import ffmpeg from 'fluent-ffmpeg-7'

import { DOMParser, XMLSerializer } from 'xmldom'

@inject()
export default class FileService {
  constructor(protected ctx: HttpContext) {}

  async uploadeFile(file: MultipartFile, folder: string = '') {
    const buffer = readFileSync(file.tmpPath!)
    return await this.writeFile(folder, buffer, file.extname || '')
  }

  async uploadeImage(file: MultipartFile, folder: string = '') {
    const url = await this.resizeImageAndSave(file, folder)
    const thumbnailUrl = await this.resizeImageAndSave(file, folder, 320, 240)
    return {
      url,
      thumbnailUrl,
    }
  }

  async encodeVideo(
    inputPath: string,
    outputPath: string,
    bitrate: string,
    resolution: string,
    outputDir: string, // New parameter to specify the output directory,
    chunkPrefix: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const chunksDir = path.join(outputDir, 'chunks') // Directory for storing chunks
      const initSegmentPath = path.posix.join(
        outputDir,
        `init-${chunkPrefix}-$RepresentationID$.mp4`
      ) // Initialization segment path
      const segmentListPath = path.join(outputDir) // Segment list path
      const mediaSegmentPath = path.posix.join(
        outputDir,
        `chunk-${chunkPrefix}-$RepresentationID$-$Number$.m4s`
      ) // Segment output path

      // Ensure the output directory and chunks directory exist
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true })
      }
      // if (!existsSync(chunksDir)) {
      //   mkdirSync(chunksDir)
      // }

      const outputOptions = [
        '-preset fast',
        '-keyint_min 50',
        '-g 50',
        '-sc_threshold 0',
        '-use_timeline 1',
        '-use_template 1',
        `-init_seg_name ${path.posix.normalize(initSegmentPath).replace(/\\/g, '/')}`,
        `-media_seg_name ${path.posix.normalize(mediaSegmentPath).replace(/\\/g, '/')}`,
        '-f dash',
        `-b:v ${bitrate}`,
        `-s ${resolution}`,
        // `-segment_list ${path.join(app.makePath('tmp'), outputDir)}`, // Specify segment list file
        '-segment_list_flags +live', // Enable live streaming mode
        '-segment_list_size 3', // Set maximum segment list size
        '-segment_list_type m3u8', // Specify segment list type
        // `-segment_list_entry_prefix ${path.join(app.makePath('tmp'), outputDir)}`, // Specify segment output path
      ]

      ffmpeg(inputPath)
        .outputOptions(outputOptions)
        .output(outputPath) // Specify the output path for the main video file
        .on('end', async () => {
          await this.addBaseUrlToMpd(outputPath, 'http://localhost:3333/')
          resolve()
        })
        .on('error', (err) => {
          reject(err)
        })
        .run()
    })
  }

  async uploadVideo(file: MultipartFile): Promise<string> {
    const tempFilePath = file.tmpPath!
    const baseFileName = `${Date.now()}_${cuid()}`
    const todayDate = new Date().toISOString().split('T')[0] // Get today's date
    // const outputDir = path.join(app.makePath(commonConfig.uploadPath), todayDate)
    const outputDir = path.join('uploads', todayDate)
    const videoFolder = path.join(outputDir, baseFileName)
    const lowQualityOutputPath = path.join(videoFolder, `low.mpd`)
    const mediumQualityOutputPath = path.join(videoFolder, `medium.mpd`)
    const highQualityOutputPath = path.join(videoFolder, `high.mpd`)

    // Ensure the output directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    try {
      // Encode videos with absolute output paths
      await Promise.all([
        this.encodeVideo(tempFilePath, lowQualityOutputPath, '500k', '640x360', videoFolder, 'low'),
        this.encodeVideo(
          tempFilePath,
          mediumQualityOutputPath,
          '1000k',
          '1280x720',
          videoFolder,
          'medium'
        ),
        this.encodeVideo(
          tempFilePath,
          highQualityOutputPath,
          '2000k',
          '1920x1080',
          videoFolder,
          'high'
        ),
      ])

      // Construct relative path
      const relativePath = path.relative(app.makePath(commonConfig.uploadPath), videoFolder)
      // Normalize and replace backslashes with forward slashes
      const normalizedPath = path.posix.normalize(relativePath).replace(/\\/g, '/')
      return normalizedPath
    } catch (error) {
      throw error
    }
  }

  async addBaseUrlToMpd(mpdFilePath: string, baseUrl: string): Promise<void> {
    const mpdText = readFileSync(mpdFilePath, 'utf-8')
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(mpdText, 'application/xml')

    // Create BaseURL element
    const baseUrlElement = xmlDoc.createElement('BaseURL')
    baseUrlElement.textContent = baseUrl

    // Append BaseURL to the MPD
    const mpdElement = xmlDoc.getElementsByTagName('MPD')[0]
    mpdElement.insertBefore(baseUrlElement, mpdElement.firstChild)

    const serializer = new XMLSerializer()
    const modifiedMpdText = serializer.serializeToString(xmlDoc)

    writeFileSync(mpdFilePath, modifiedMpdText)
  }

  async deleteImage(image: ImageType): Promise<void> {
    await this.deleteFile(image.url)
    await this.deleteFile(image.thumbnailUrl)
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // Check if the file exists
    const filePath = path.join(app.makePath(commonConfig.uploadPath), fileUrl)
    if (existsSync(filePath)) {
      // Delete the file
      unlinkSync(filePath)
    }
  }

  async resizeImageAndSave(
    file: MultipartFile,
    folder: string = '',
    width?: number,
    height?: number
  ): Promise<string> {
    // Resize the image
    const resizedBuffer = await sharp(file.tmpPath)
      .resize(width, height, { fit: 'cover' })
      .toFormat('webp')
      .toBuffer()

    return await this.writeFile(folder, resizedBuffer, 'webp')
  }

  async writeFile(folder: string = '', buffer: NodeJS.ArrayBufferView, extName: string) {
    // Ensure the output directory exists
    const fileName = Date.now() + cuid() + `.${extName}`
    const url = path.join(folder, fileName)
    const outputDir = path.join(app.makePath(commonConfig.uploadPath), folder)
    const outputPath = path.join(outputDir, fileName)
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // Write the resized image buffer to the file system
    writeFileSync(outputPath, buffer)

    return path.posix.normalize(url).replace(/\\/g, '/')
  }
}
