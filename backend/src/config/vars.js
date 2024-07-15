require("dotenv").config(); //get env file based on script NODE_ENV==="cross-env" in package.json

module.exports = {
  BASE_URL: process.env.BASE_URL,
  port: process.env.PORT,
  mongo: { uri: process.env.MONGO_URI },
  adminUrl: process.env.ADMIN_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  pwEncruptionKey: process.env.PW_ENCRYPTION_KEY,
  pwdSaltRounds: process.env.PWD_SALT_ROUNDS,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,

};