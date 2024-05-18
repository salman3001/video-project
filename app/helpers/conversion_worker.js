import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { encodeVideo } from './encode_video.js'
import { parentPort, workerData } from 'node:worker_threads'

function processJob(jobData) {
  return new Promise((resolve, reject) => {
    const chunksDir = path.join(jobData.outputDir, 'chunks')

    if (!existsSync(chunksDir)) {
      mkdirSync(chunksDir)
    }

    // Placeholder for the actual job logic
    console.log(`Processing job: ${JSON.stringify(jobData)}`)
    const outputPath = path.join(jobData.outputDir, 'main.mpd')

    encodeVideo(jobData.videoFile, outputPath, '1000k', '1280x720', jobData.outputDir, 'medium')
      .then(() => {
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
    // const command = `ffmpeg -i "${jobData.videoFile}"
    //                   -c:v libx265
    //                   -b:v 500k
    //                   -crf 23
    //                   -c:a aac
    //                   -b:a 128k
    //                   -init_seg_name ${initSegmentPath},
    //                   -media_seg_name ${mediaSegmentPath},
    //                   "${jobData.outputDir+'.mpd'}"`

    // exec(command, (error, stdout, stderr) => {
    //   if (error) {
    //     reject(error)
    //     return
    //   }
    //   if (stderr) {
    //     reject(new Error(stderr))
    //     return
    //   }
    //   resolve(stdout)
    // })
  })
}

async function startProcessing(jobData) {
  try {
    await processJob(jobData)
    console.log('Video encoding completed successfully.')
    parentPort.postMessage({ success: true, jobId: jobData.jobId })
  } catch (error) {
    console.error('Error encoding video:', error)
    parentPort.postMessage({ success: false, jobId: jobData.jobId })
  } finally {
    process.exit()
  }
}

startProcessing(workerData)
