export const HOST = process.env.DB_HOST || "localhost";
export const USER = process.env.DB_USER || "root";
export const PASSWORD ="R0h!th@018";
export const DB = "track_desk";
export const dialect = "mysql";
export const pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
};