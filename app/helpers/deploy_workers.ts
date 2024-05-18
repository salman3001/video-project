import { spawn } from 'node:child_process'
import { cpuUsage } from 'os-utils'

const MAX_WORKERS = 4
const CPU_LIMIT = 10 // CPU limit per worker in percentage

let activeWorkers = 0
const workers: any[] = []

export function startWorker(workerFilePath: string, data: any) {
  cpuUsage((cpuPercentage: number) => {
    if (cpuPercentage * 100 < MAX_WORKERS * CPU_LIMIT && activeWorkers < MAX_WORKERS) {
      const worker = spawn('cpulimit', [
        '-l',
        CPU_LIMIT.toString(),
        '--',
        'node',
        workerFilePath,
        JSON.stringify(data),
      ])

    console.log('worker spawned');


      worker.stdout.on('data', (returnedData: any) => {
        console.log(`Worker stdout: ${returnedData}`)
      })

      worker.stderr.on('data', (returnedData) => {
        console.error(`Worker stderr: ${returnedData}`)
      })

      worker.on('exit', (code, signal) => {
        console.log(`Worker exited with code ${code} and signal ${signal}`)
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
