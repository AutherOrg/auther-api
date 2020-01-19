const Ajv = require('ajv')

const validate = (schema, data) => {
  try {
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const isValid = validate(data)
    return isValid
  } catch (e) {
    return ({
      error: e.message
    })
  }
}

module.exports = {
  validate
}
