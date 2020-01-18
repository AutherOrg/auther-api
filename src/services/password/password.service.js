const bcrypt = require('bcrypt')

const hash = async (password, saltRounds = 12) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return reject(err)
      }
      return resolve(hash)
    })
  })
}

const compare = async (password, hash) => {
  return new Promise((resolve, reject) => {
    return bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(res)
    })
  })
}

module.exports = {
  hash,
  compare
}
