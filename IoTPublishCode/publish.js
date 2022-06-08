var awsIot = require('aws-iot-device-sdk');
const SDS011Wrapper = require("sds011-wrapper");
const sensor = new SDS011Wrapper("/dev/ttyUSB0");
var sensorLib = require('node-dht-sensor');


var client  = awsIot.device({
    keyPath: "./key5/99d7822f1ca3f9a06ecb72262be03ad56d1d6f077dca8dc334273c652ce89062-private.pem.key",
    certPath:"./key5/99d7822f1ca3f9a06ecb72262be03ad56d1d6f077dca8dc334273c652ce89062-certificate.pem.crt",
    caPath:"./key5/AmazonRootCA1.pem",
    clientId:"pro",
    host:"a3wlbc2zlro4q-ats.iot.ap-northeast-2.amazonaws.com"
    //MQTT DN for device Gateway
}) ;



function read () {
    var readout = sensorLib.read();
    console.log('Temperature: '+readout.temperature.toFixed(2)+'C, humidity: '+readout.humidity.toFixed(2)+'%');
}
sensorLib.initialize(11,3 );

client.on('connect', async function(){
    console.log('Getting Environment System connected');

    
    let dustData;
    
    sensor
            .setReportingMode('active')
            .then(() => {
                //console.log("Working period set to 0 minutes.");
                //console.log("\nSensor readings:");

                // Since working period was set to 0 and mode was set to active, this event will be emitted as soon as new data is received.
                sensor.on('measure', (data) => {
                    console.log(`[${new Date().toISOString()}] ${JSON.stringify(data)}`);
                    dustData = data.PM10;
                });
            });
    
    
    
    setInterval(() => {
        
        
        
        var readout = sensorLib.read();
        
        
        const publishMsg = {
            "temperature" : readout.temperature,
            "humidity" : readout.humidity,
            "dust" : parseInt(dustData),
        };
        
        console.log("PM : ",publishMsg);
        
        
        client.publish('iot1/test1/environment', JSON.stringify(publishMsg));
        console.log('send msg : ', publishMsg);
    }, 10000);
    
    // client.end();
});

