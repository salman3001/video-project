import { spawn } from 'child_process'

export function applyCpuLimit(pid: number, cpuLimit: number) {
  const cpulimitProcess = spawn('cpulimit', ['-p', pid.toString(), '-l', cpuLimit.toString()])

  cpulimitProcess.on('error', (err) => {
    console.error('Error executing cpulimit:', err)
  })

  cpulimitProcess.on('exit', (code, signal) => {
    if (code === 0) {
      console.log('cpulimit process exited successfully')
    } else {
      console.error(`cpulimit process exited with code ${code} and signal ${signal}`)
    }
  })
}

// Usage example
// const workerPid = 12345; // Replace with the actual PID of the worker thread
// const cpuLimit = 10; // Replace with the desired CPU limit in percentage
// applyCpuLimit(workerPid, cpuLimit);
