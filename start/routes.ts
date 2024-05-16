/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import commonConfig from '#config/common'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import { createReadStream } from 'node:fs'
import { sep, normalize, join } from 'node:path'
const VideosController = () => import('#controllers/videos_controller')

router.get('/', [VideosController, 'index']).as('home')
router.on('/upload').renderInertia('upload-video').as('upload')
router.post('/upload', [VideosController, 'store']).as('store')
router.get('/view-video/:id', [VideosController, 'show']).as('show')

// serving uploads
const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath(commonConfig.uploadPath, normalizedPath)
  // const stream = createReadStream(absolutePath)
  // response.header('content-type', 'video/avi')
  return response.download(absolutePath)
})

// serving videos
router.get('/videos/*', ({ request, response }) => {
  const filePathParts = request.param('*').split('/')
  if (filePathParts.length !== 2) {
    return response.badRequest('Invalid file path format')
  }

  const [dateFolder, videoFolder] = filePathParts
  const normalizedPath = normalize(join(dateFolder, videoFolder))

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = join(app.makePath(commonConfig.uploadPath), normalizedPath)
  const stream = createReadStream(absolutePath)

  // Set content type based on the video format (e.g., MPD)
  response.header('content-type', 'application/dash+xml')

  return response.stream(stream)
})

export { router }
