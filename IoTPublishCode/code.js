var awsIot = require('aws-iot-device-sdk');
var pro = awsIot.device({
    keyPath: "./key5/99d7822f1ca3f9a06ecb72262be03ad56d1d6f077dca8dc334273c652ce89062-private.pem.key",
    certPath:"./key5/99d7822f1ca3f9a06ecb72262be03ad56d1d6f077dca8dc334273c652ce89062-certificate.pem.crt",
    caPath:"./key5/AmazonRootCA1.pem",
    clientId:"pro",
    host:"a3wlbc2zlro4q-ats.iot.ap-northeast-2.amazonaws.com"
    //MQTT DN for device Gateway
}) ;
pro.on('connect',function(){
    console.log('Face Recognition System connected');

    pro.subscribe('test',function(){
        console.log('subscribing to the topic faceRecog/request !');
    });
    var registeredImage=['heoungboo','nolboo','ggachi','seodong','pyeongang'];
    pro.on('message',function(topic,message){
        console.log('Request:',message.toString());
        if(topic != 'topic_1') return;
        var req= JSON.parse(message.toString());
        var id =registeredImage.indexOf(req.image);
        if (id != -1){
            pro.publish(req.notify,JSON.stringify({'image':req.image,'command':'unlock'}))
        } else{
            pro.publish(req.notify,JSON.stringify({'image':req.image,'command':'reject'}))
        }
    })
});