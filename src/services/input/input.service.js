const localSchemaService = require('../schemas/local.schema.service')

const validate = (inputSchemaFile, req) => {
  const { body } = req
  if (!body) {
    return false
  }
  const schema = require(inputSchemaFile)
  const isValid = localSchemaService.validate(schema, body)
  return isValid
}

const service = {
  validate
}

module.exports = service
