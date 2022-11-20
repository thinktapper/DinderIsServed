import express from 'express'
import router from './router'
import morgan from 'morgan'
import cors from 'cors'
import { protect } from './modules/auth'
import { login, signup } from './handlers/user'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  console.log('Hello from the server!')
  res.ok
  res.json({ message: 'Hello World!' })
})

app.use('/api', protect, router)
app.post('/user', signup)
app.post('/login', login)

export default app
