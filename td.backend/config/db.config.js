module.exports = {
  HOST: "localhost",
  USER:"root",
  PASSWORD:"R0h!th@018",
  DB: "track_desk",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}