const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host     : 'iot-prj-db.cobmwhsmz8z6.ap-northeast-2.rds.amazonaws.com',
  user     : 'jonghyun',
  password : 'Qwerty12',
  database : 'IoTDB',
  waitForConnection : false,
});

exports.handler = async (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;
  
  const environment = event;
  console.log("===== environment =====\n", environment);
  
  const connection = await pool.getConnection(async conn => conn);
  try {
    const [result, metadata] = await connection.query(`
      INSERT INTO environment (temperature, humidity, dust) VALUES (${environment.temperature}, ${environment.humidity}, ${environment.dust});
  `);
  
    return result;
    
  } catch (err) {
    console.log(err);
    callback(null, err);
  } finally {
    connection.release();
  }
};


