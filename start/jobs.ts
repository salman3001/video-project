import ConvertVideoJob from "../app/jobs/convert_video.js"

const jobs: Record<string, Function> = {
    [ConvertVideoJob.name]:()=>import('#app/jobs/convert_video')
}

export { jobs }