let lat = 33.7490;
let lon = 84.3880;
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//         lat = position.coords.latitude,
//         lon = position.coords.longitude
//     })
// }

console.log(lat);
console.log(lon);

// ================== Google Search URL

const googlePlaceUrl = "https://maps.googleapis.com/maps/api/place"
const searchType = "nearbysearch"
const key = "AIzaSyBhEyPG1pqRNT2FOdpiMX_2zRDYgY8Y1W0";

// ================== Generate Parameters
const language = "en"
const price = $('.input-price').val();;
// console.log(price)
const type = "restaurant"
const currLocation = `${lat},${lon}`
const rankby = "distance" 

// Parameters needed for nearby search = api key, minprice, type, rankyby, location, language, opennow

const googleUrl = `${googlePlaceUrl}/${searchType}/json?key=${apiKey}&minprice=${price}&type=${type}&rankby=${rankby}&location=${currLocation}&language=${language}&opennow;`
console.log(googleUrl)

$.getJSON(googleUrl, (googleData)=>{
    console.log(googleData);
})