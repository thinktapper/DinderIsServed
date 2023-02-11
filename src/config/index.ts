import merge from 'lodash.merge'

// make sure default NODE_ENV is set
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// set the stage
const stage = process.env.STAGE || 'local'
let envConfig

// dynamically require each config depending on the stage we're in
if (stage === 'production') {
  envConfig = require('./prod').default
} else if (stage === 'staging') {
  envConfig = require('./staging').default
} else {
  envConfig = require('./local').default
}

// merge the config with the default config
const defaultConfig = {
  stage,
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    dbUrl: process.env.DATABASE_URL,
    RENDER_DB_URL: process.env.RENDER_DB_URL,
    GOOGLE_API: process.env.GOOGLE_API,
  },
  logging: false,
}

export default merge(defaultConfig, envConfig)
