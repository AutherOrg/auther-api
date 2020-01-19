const fetch = require('node-fetch')
const Ajv = require('ajv')

const schemaUri = 'https://w3id.org/blockcerts/schema/2.1/schema.json'

const loadSchema = async uri => {
  try {
    const response = await fetch(uri)
    const schema = await response.json()
    return schema
  } catch (e) {
    return ({
      error: e.message
    })
  }
}

const validate = async data => {
  try {
    const schema = await loadSchema(schemaUri)
    const ajv = new Ajv({
      schemaId: 'id',
      loadSchema: loadSchema
    })
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))
    const validate = await ajv.compileAsync(schema)
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
