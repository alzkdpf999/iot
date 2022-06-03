const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host     : 'iot-prj-db.cobmwhsmz8z6.ap-northeast-2.rds.amazonaws.com',
  user     : 'jonghyun',
  password : 'Qwerty12',
  database : 'IoTDB',
  waitForConnection : false,
});

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  // let user_id = event.request.userAttributes.email;
  
  const connection = await pool.getConnection(async conn => conn);
  try {
    const [result, metadata] = await connection.query(`
      select * from IoTDB.environment ORDER BY id DESC LIMIT 24;
  `);

    callback(null, result);
  } catch (err) {
    console.log(err);
    callback(null, event);
  } finally {
    connection.release();
  }
};