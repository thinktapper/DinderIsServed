import express from 'express'
export const app = express()
import cors from 'cors'
import session from 'express-session'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import passport from 'passport'
import flash from 'connect-flash'
import { morgan as logger } from 'morgan'
import prisma from './db'
import { PrismaClient } from '@prisma/client'
import mainRoutes from './routes/main'
import postRoutes from './routes/posts'

// Passport config
require('./config/passport')(passport)

app.use(cors())

// Body parsing to allow nested objects. & set the responses to only be parsed as JSON
app.use(express.urlencoded({ extended: true }), express.json())

// Logging
if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'staging'
) {
  app.use(logger('dev'))
}

app.use(
  session({
    name: 'session',
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, // 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Use flash messages for errors, info, etc...
app.use(flash())

// Routes
app.use('/', mainRoutes)
app.use('/api', apiRoutes)

// app.use((err, req: Request, res: Response, next: NextFunction) => {
//   if (err.type === 'auth') {
//     res.json({ ok: false, message: 'Unauthorized' })
//   } else if (err.type === 'input') {
//     res.json({ ok: false, message: 'Invalid input' })
//   } else {
//     res.json({ ok: false, message: 'Something went wrong' })
//   }
// })

export default app
