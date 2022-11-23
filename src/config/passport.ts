import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import prisma from '../db'
import { comparePwds } from '../modules/auth'

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        // Match user
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          return done(null, false, { msg: `Email ${email} not found.` })
        } else if (user) {
          // Match password
          const isValid = comparePwds(password, user.password)
          if (isValid) return done(null, user)

          return done(null, false, { msg: 'Invalid credentials' })
        }
      },
    ),
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id: string | number, done) => {
    const user = await prisma.user.findUnique({
      where: {
        id: id.toString(),
      },
    })
    if (user === null) return done(null, false, 'Nope')

    return done(null, user)
  })
}
