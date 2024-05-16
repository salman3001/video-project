import env from '#start/env'

const commonConfig = {
  rowsPerPage: 20,
  mail_address_info: 'info@urvigo.com',
  uploadPath: env.get('UPLOAD_PATH', 'tmp'),
}

export default commonConfig
