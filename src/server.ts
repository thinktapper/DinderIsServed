import express from 'express'
export const app = express()
import cors from 'cors'
import session from 'express-session'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
// import passport from 'passport'
// import flash from 'connect-flash'
import morgan from 'morgan'
import prisma from './db'
import { PrismaClient } from '@prisma/client'
// import mainRoutes from './routes/main'
import { auth as authRoutes } from './routes/auth'
import { user as userRoutes } from './routes/user'
import { place as placeRoutes } from './routes/place'
import { vote as voteRoutes } from './routes/vote'
import { herd as herdRoutes } from './routes/herd'
import { feast as feastRoutes } from './routes/feast'
import { isAuth } from './middleware/isAuth'
import AppError from './modules/appError'

// // Passport config
// require('./config/passport')(passport)

declare global {
  namespace Express {
    interface Request {
      user?: import('@prisma/client').User
    }
  }
}

app.use(cors({ credentials: true }))

// Body parsing to allow nested objects. & set the responses to only be parsed as JSON
// app.use(express.urlencoded({ extended: true }), express.json())
app.use(express.json())

// Logging
if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'staging'
) {
  app.use(morgan('tiny'))
}

// app.use(
//   session({
//     name: 'session',
//     secret: process.env.SECRET!,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: true },
//     store: new PrismaSessionStore(prisma, {
//       checkPeriod: 2 * 60 * 1000, // 2 minutes
//       dbRecordIdIsSessionId: true,
//       dbRecordIdFunction: undefined,
//     }),
//   }),
// )

// Passport middleware
// app.use(passport.initialize())
// app.use(passport.session())

// Use flash messages for errors, info, etc...
// app.use(flash())

// Routes
app.use('/', authRoutes)
app.use('/api/user', isAuth, userRoutes)
app.use('/api/herd', isAuth, herdRoutes)
app.use('/api/feast', isAuth, feastRoutes)
app.use('/api/place', isAuth, placeRoutes)
app.use('/api/vote', isAuth, voteRoutes)

// UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`))
})

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  err.status = err.status || 'error'
  err.statusCode = err.statusCode || 500

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
})

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
