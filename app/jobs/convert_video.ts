import { startWorker } from '#helpers/deploy_workers'
import type { JobHandlerContract, Job } from '@acidiney/bull-queue/types'
import app from '@adonisjs/core/services/app'

export type ConvertVideoPayload = {
  filePath: string
}

export default class ConvertVideoJob implements JobHandlerContract<ConvertVideoPayload> {
  /**
   * Base Entry point
   */
  async handle(job: Job<ConvertVideoPayload>) {
    const workerPath = app.makePath('app', 'helpers', 'conversion_worker.ts')
    startWorker(workerPath, { videoFile: job.data.filePath })
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  async failed(job: Job<ConvertVideoPayload>) {
    throw new Error('Need to be implemented!')
  }
}
