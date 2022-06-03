/* NodeJs 12 샘플 코드 
참조 https://wpioneer.tistory.com/192
*/


var request = require('request');

requestCount = 1000;

var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
var queryParams = '?' + encodeURIComponent('serviceKey') + '=SBQlti54douWRlqNX2phAHR%2F6BOwFVvZSbLdTVHyMGnidnerTYbCVtpLgquT3Ip9JuJYStI34JqyZ0AjK%2BzYGA%3D%3D'; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(requestCount); /* */
queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent('20220531'); /* */
queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent('2000'); /* */
queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('55'); /* */
queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('127'); /* */
queryParams += '&' + encodeURIComponent('fcstValue') + '' + encodeURIComponent('TMP'); /**/

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
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
        
        const value = JSON.parse(body).response.body.items.item[i].fcstValue;
        // console.log(categoryName,":", JSON.parse(body).response.body.items.item[i].fcstValue, JSON.parse(body).response.body.items.item[i].fcstTime);
        if(category == "POP" || category == "PCP")
            console.log(value);

        if(category == "POP") {
            
        }
        
    }
    // console.log(JSON.parse(body).response.body.items.item.length);
    // console.log('Reponse received', JSON.parse(body).response.body.items);
});