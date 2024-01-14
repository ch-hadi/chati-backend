import mysql from 'mysql';

const connection = mysql.createConnection({
  host: process.env.ENVIRONMENT,
  user: process.env.ROOTS,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
});
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('Database server is connected as id ' + connection.threadId);
});
export default connection;
