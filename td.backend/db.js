const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Omls@2025',
  database: 'track_desk'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

module.exports = db;
