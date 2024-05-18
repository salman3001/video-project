export type ImageType = {
  url: string
  thumbnailUrl: string
}

export type VideoType = {
  url: string
}

export interface VideoJobData {
  jobId: string
  outputDir: string
  videoFile: string
}
