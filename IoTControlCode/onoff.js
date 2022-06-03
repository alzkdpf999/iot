    var request = require('request');
    
    var Gpio = require('pigpio').Gpio, //include pigpio to interact with the GPIO
    ledRed = new Gpio(4, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
    ledGreen = new Gpio(10, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
    ledBlue = new Gpio(17, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUE
    redRGB = 0, //set starting value of RED variable to off (0 for common cathode)
    greenRGB = 0, //set starting value of GREEN variable to off (0 for common cathode)
    blueRGB = 0; //set starting value of BLUE variable to off (0 for common cathode)
    
    //RESET RGB LED
    ledRed.digitalWrite(0); // Turn RED LED off
    ledGreen.digitalWrite(0); // Turn GREEN LED off
    ledBlue.digitalWrite(0); // Turn BLUE LED off
    
    
    /* NodeJs 12 샘플 코드 
    참조 https://wpioneer.tistory.com/192
    */
    
    
    
    
    requestCount = 50;
    let today = new Date();
    let hours = today.getHours();
    const hourConst = today.getHours();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var newday= year + month+ day;
    
    
    
    if(hours % 3 == 0) {
        hours -= 1; 
    } else if (hours % 3 == 1) {
        hours -= 2;
    }
    let base_time = JSON.stringify(hours) + "00";
    // base_time = "1000";
    console.log(base_time);
    
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    var queryParams = '?' + encodeURIComponent('serviceKey') + '=SBQlti54douWRlqNX2phAHR%2F6BOwFVvZSbLdTVHyMGnidnerTYbCVtpLgquT3Ip9JuJYStI34JqyZ0AjK%2BzYGA%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(requestCount); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(newday); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(base_time); /* 3의 배수 + 2 */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('55'); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('127'); /* */
    
    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        // console.log('Status', response.statusCode);
        //console.log('Headers', JSON.stringify(response.headers));
        console.log("현재 날씨 상황 : \n");
    
        for (let i = 0; i < requestCount; i++ ) {
    
            let categoryName;
            const category = JSON.parse(body).response.body.items.item[i].category;
            if(category == "POP") {
                categoryName = "강수확률";
            } 
            else if (category == "PTY") {
                categoryName = "강수형태";
            }
            else if (category == "PCP") {
                categoryName = "1시간 강수량";
            }
            else if (category == "REH") {
                categoryName = "습도";
            }
            else if (category == "SNO") {
                categoryName = "1시간 신적설";
            }
            else if (category == "SKY") {
                categoryName = "하늘상태";
            }
            else if (category == "TMP") {
                categoryName = "1시간 기온";
            }
            else if (category == "TMN") {
                categoryName = "일 최저기온";
            }
            else if (category == "TMX") {
                categoryName = "일 최고기온";
            }
            else if (category == "UUU") {
                categoryName = "풍속";
            }
            else if (category == "VVV") {
                categoryName = "풍속";
            }
            else if (category == "WAV") {
                categoryName = "파고";
            }
            else if (category == "VEC") {
                categoryName = "풍향";
            }
            else if (category == "WSD") {
                categoryName = "풍속";
            }
    
            // const value = JSON.parse(body).response.body.items.item[i].fcstValue;
            
            if(JSON.parse(body).response.body.items.item[i].fcstTime == JSON.stringify(hourConst+1) + "00"){

                if(category == "TMP"){
                    const temperature = JSON.parse(body).response.body.items.item[i].fcstValue;
                    console.log(categoryName,":", temperature);
                    greenRGB=temperature * 3 ;    //255off 0 on
                    blueRGB =temperature *4 ;
                    redRGB =temperature * 2;

                    if(temperature >=25){greenRGB=255;redRGB=0;blueRGB=255;}
                    else if(temperature <25 && temperature>15){geenRGB=0;redRGB=0;blueRGB=255;}
                    else {greenRGB=255;redRGB=255;blueRGB=0;}
                    ledRed.pwmWrite(redRGB); //set RED LED to specified value
                    ledGreen.pwmWrite( greenRGB); //set GREEN LED to specified value
                    ledBlue.pwmWrite( blueRGB); //set BLUE LED to specified value
            }
if(category == "POP"){
	const rainrate= JSON.parse(body).response.body.items.item[i].fcstValue;
	console.log(categoryName,":",rainrate);
		if(rainrate>=60)
		{
			redRGB=255;
			blueRGB=0;
			greenRGB=255;
			ledRed.pwmWrite(redRGB); //set RED LED to specified value
        ledGreen.pwmWrite( greenRGB); //set GREEN LED to specified value
        ledBlue.pwmWrite( blueRGB); //set BLUE LED to specified value
}
}
}
     }   
    });
    
    
    
    
    process.on('SIGINT', function () { //on ctrl+c
      ledRed.digitalWrite(0); // Turn RED LED off
      ledGreen.digitalWrite(0); // Turn GREEN LED off
      ledBlue.digitalWrite(0); // Turn BLUE LED off
      process.exit(); //exit completely
    })
    
