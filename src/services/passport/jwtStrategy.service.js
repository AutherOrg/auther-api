const passportJwt = require('passport-jwt')

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

const config = require('../../config')
const User = require('../../models/users/users.model')

const hookJwtStrategy = passport => {
  passport.use(
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jsonWebTokenOptions: {
        maxAge: '30 days'
      },
      secretOrKey: config.passport.secret
    },
    (jwtPayload, done) => {
      User.findOne({ where: { id: jwtPayload.id } })
        .then((user) => {
          if (!user) {
            done(null, false)
          } else {
            done(null, user)
          }
        })
    }
    ))
}

module.exports = hookJwtStrategy
