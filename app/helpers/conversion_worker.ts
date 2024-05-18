import { exec } from 'node:child_process'

function processJob(jobData: { filePath: string }) {
  return new Promise((resolve, reject) => {
    // Placeholder for the actual job logic
    console.log(`Processing job: ${JSON.stringify(jobData)}`)

    const outputFilePath = `${jobData.filePath}_in.mpd`
    const command = `ffmpeg -i ${jobData.filePath} -c:v libx265 -crf 23 -x265-params keyint=24:no-scenecut ${outputFilePath}`

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      if (stderr) {
        reject(new Error(stderr))
        return
      }
      resolve(stdout)
    })
  })
}

async function startProcessing(jobData: any) {
  try {
    await processJob(jobData)
    console.log('Job processed successfully')
    if (process.send) {
      process.send({ success: true, jobData })
    }
  } catch (error) {
    console.error('Error processing job:', error)
    if (process.send) {
      process.send({ success: false, jobData, error: error.message })
    }
  } finally {
    process.exit()
  }
}

// Get the job data from the arguments
const jobData = JSON.parse(process.argv[2])
startProcessing(jobData)
