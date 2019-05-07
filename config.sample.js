const baseConfig = {
  name : API_NAME,
  key : API_KEY
}

const mongoConfig = {
  host: HOST_NAME,
  port: PORT,
  db: DB_NAME
}

module.exports = {
  base: baseConfig,
  mongo: mongoConfig
};