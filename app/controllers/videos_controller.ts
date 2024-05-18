import { concatenateChunks } from '#helpers/common'
import Video from '#models/video'
import FileService from '#services/file_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import vine from '@vinejs/vine'
import { existsSync, mkdirSync } from 'node:fs'

@inject()
export default class VideosController {
  constructor(protected fileService: FileService) {}

  async index({ inertia }: HttpContext) {
    const videos = await Video.all()

    return inertia.render('home', { videos })
  }

  async store({ request, response, session }: HttpContext) {
    const validationSchema = vine.compile(
      vine.object({
        name: vine.string().minLength(1).maxLength(255),
        file: vine.file({
          extnames: ['mp4'],
          size: '20gb',
        }),
      })
    )

    const payload = await request.validateUsing(validationSchema)
    const url = await this.fileService.uploadVideo(payload.file, 'videos')
    session.flash('message', 'File uploaded')
    await Video.create({ name: payload.name, data: { url: url } })

    return response.redirect().toRoute('home')
  }

  async show({ inertia, params }: HttpContext) {
    const video = await Video.findOrFail(+params.id)

    return inertia.render('view-video', { video })
  }

  async uploadChunk({ request, response }: HttpContext) {
    const validationSchema = vine.compile(
      vine.object({
        id: vine.string(),
        chunk: vine.file({
          size: '8mb',
        }),
        totalChunks: vine.number(),
        chunkIndex: vine.number(),
      })
    )

    const payload = await request.validateUsing(validationSchema)

    const outputDir = app.makePath('uploads', payload.id)

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    await payload.chunk.move(outputDir, {
      name: `chunk-${payload.chunkIndex}`,
    })

    if (payload.chunkIndex === payload.totalChunks - 1) {
      concatenateChunks(outputDir)
      return response.json({
        completed: true,
      })
    } else {
      return response.json({
        nextIndex: payload.chunkIndex + 1,
      })
    }
  }
}
