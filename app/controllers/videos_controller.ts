import Video from '#models/video'
import FileService from '#services/file_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

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
}
