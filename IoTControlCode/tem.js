var sensorLib = require('node-dht-sensor');
 
var sensor = {
  initialize: function() {

    return sensorLib.initialize(11,3 );
  },
  read: function() {
    var readout = sensorLib.read();
    console.log('Temperature: '+readout.temperature.toFixed(2)+'C, humidity: '+readout.humidity.toFixed(2)+'%');
    setTimeout(function() {
      sensor.read();
    }, 1500);
  }
};
 
if (sensor.initialize()) {
  sensor.read();
} else {
  console.warn('Failed to initialize sensor');
}

