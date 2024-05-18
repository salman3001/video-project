import { exec } from 'node:child_process'

function processJob(jobData) {
  return new Promise((resolve, reject) => {

    // Placeholder for the actual job logic
    console.log(`Processing job: ${JSON.stringify(jobData)}`)
    const command = `ffmpeg -i ${jobData.videoFile} -c:v libx265 -b:v 500k -crf 23 -c:a aac -b:a 128k ${jobData.outputPath}`

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

async function startProcessing(jobData) {
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
