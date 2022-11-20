import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.ok.json({ message: 'Hello World!' })
})

export default app
