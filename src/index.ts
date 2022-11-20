import * as dotenv from 'dotenv'
dotenv.config()

import app from './server'

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log('Server is running on port', port)
})
