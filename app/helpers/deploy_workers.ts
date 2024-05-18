import { cpuUsage } from 'os-utils'
import { VideoJobData } from './types.js'
import { Worker } from 'node:worker_threads'

const MAX_WORKERS = 4
const CPU_LIMIT = 10 // CPU limit per worker in percentage

let activeWorkers = 0
const workers: any[] = []

export function startWorker(workerFilePath: string, data: VideoJobData) {
  console.log(workerFilePath)

  cpuUsage((cpuPercentage: number) => {
    if (/*cpuPercentage * 100 < MAX_WORKERS * CPU_LIMIT &&*/ activeWorkers < MAX_WORKERS) {
      // const worker = spawn('cpulimit', ['-l', CPU_LIMIT, 'node', workerFilePath], {
      //   stdio: 'inherit' // Inherit standard I/O streams (stdin, stdout, stderr)
      // });
      const worker = new Worker(workerFilePath, {
        workerData: data,
      })

      // applyCpuLimit(worker.threadId, 10)

      console.log('worker spawned')

      // worker.stdout.on('data', (returnedData: any) => {
      //   console.log(`Worker stdout: ${returnedData}`)
      // })

      // worker.stderr.on('data', (returnedData) => {
      //   console.error(`Worker stderr: ${returnedData}`)
      // })

      worker.on('message', (message) => {
        const jobId = message.jobId
        if (message.success) {
          console.log(`Job ${jobId} succeeded.`)
        } else {
          console.log(`Job ${jobId} failed.`)
        }
      })

      worker.on('error', (err) => {
        console.error('Error spawning worker:', err)
      })

      worker.on('exit', () => {
        console.log(`Worker exited `)
        workers.splice(workers.indexOf(worker), 1)
        activeWorkers--
      })

      workers.push(worker)
      activeWorkers++
      console.log(`Started worker, active workers: ${activeWorkers}`)
    } else {
      throw new Error('wokers busy. try again later')
    }
  })
}

function monitorWorkers() {
  cpuUsage((cpuPercentage: number) => {
    console.log(`CPU Usage: ${(cpuPercentage * 100).toFixed(2)}%`)
    console.log(`Active Workers: ${activeWorkers}`)
  })
}

// Monitor CPU usage and adjust workers every 5 seconds
// setInterval(monitorWorkers, 5000)
