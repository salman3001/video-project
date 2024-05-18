import { startWorker } from '#helpers/deploy_workers'
import type { JobHandlerContract, Job } from '@acidiney/bull-queue/types'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export type ConvertVideoPayload = {
  videoFile: string
}

export default class ConvertVideoJob implements JobHandlerContract<ConvertVideoPayload> {
  /**
   * Base Entry point
   */
  async handle(job: Job<ConvertVideoPayload>) {
    const workerPath = app.makePath('app', 'helpers', 'conversion_worker.js')
    const outputPath = app.makePath('uploads',`${Date.now()+cuid()}.mpd`)
    console.log('job ran');
    
    startWorker(workerPath, { videoFile: job.data.videoFile,outputPath })
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  async failed(job: Job<ConvertVideoPayload>) {
    throw new Error('Need to be implemented!')
  }
}
