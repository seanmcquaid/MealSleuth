// ======================================================================================================================= Generate Search Result



// ================== Define Latitute and Longitute from current location

let lat
let lon
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude,
        lon = position.coords.longitude
    })
}

// ================== Pull price point from Search

    $('.search-btn').submit(()=>{
        // e.preventDefault();

        // ================== Google Search URL
        
        const googlePlaceUrl = "https://maps.googleapis.com/maps/api/place"
        const searchType = "nearbysearch"

            // ================== Generate Parameters
            const language = "en"
            const price = $('.input-price').val();
                // console.log(price)
            const type = "restaurant"
            const currLocation = `${lat},${lon}`
            const rankby = "distance" 
    
        // Parameters needed for nearby search = api key, minprice, type, rankyby, location, language, opennow
        
        const googleUrl = `${googlePlaceUrl}/${searchType}/json?key=${key}&minprice=${price}&type=${type}&rankby=${rankby}&location=${currLocation}&language=${language}&opennow;`
            console.log(googleUrl)
    
    });


// =================================================================================================================== Generate Background Image

function chooseBackground(){

    // ========================= Select Random Number for BG Image
    const backgroundImage = (Math.floor(Math.random() * Math.floor(8))) + 1;


    document.querySelector('.tagline-box').style.backgroundImage = `url('images/backgroundImage${backgroundImage}.jpg')`;
    console.log(backgroundImage)

}

chooseBackground()