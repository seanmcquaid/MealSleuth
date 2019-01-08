// ================== Define Latitute and Longitute from current location

let lat
let lon
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude,
    lon = position.coords.longitude

    const myAddressUrl=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${placesKey}`
    $.getJSON(myAddressUrl,(addressData)=>{   
        const myCurrAddress =  addressData.results[0].formatted_address
        $('.input-location').val(myCurrAddress)
    })        
    })
}

// ================== Pull price point from Search

$('.search-form').submit((e)=>{
    e.preventDefault();

     // ================== Google Places URL STart
        
     const googlePlaceUrl = "https://maps.googleapis.com/maps/api/place"
        

     // ================== Generate Parameters for Google Nearby Search URL
        
         const searchType = "nearbysearch"
         const language = "en"
         const price = $('.input-price').val();
         const type = "restaurant"
         const rankby = "distance" 
         
         // ================== Get Search Location Lat and Lon
         const myLocation = $('.input-location').val();
        //  console.log(myLocation);
             const myLocationComma = myLocation.replace(/,/g,"");
             const myLocFinalFormat = myLocationComma.replace(/ /g,"+")
             
             const addressToCordinatesUrl=`https://maps.googleapis.com/maps/api/geocode/json?address=${myLocFinalFormat}&key=${placesKey}`    
            //  console.log(addressToCordinatesUrl)
             
             let searchLat;
             let searchLon;
             let searchCoordinates;
             $.getJSON(addressToCordinatesUrl,(coridinateData)=>{   
                 searchLat =  coridinateData.results[0].geometry.location.lat;
                 searchLon =  coridinateData.results[0].geometry.location.lng;
                 searchCoordinates = `${searchLat},${searchLon}`;
                //  console.log(searchCordinates)

                 // Assemble Nearby Search Url
                 // The parameters needed for nearby search = api key, minprice, type, rankyby, location, language, opennow
 
                 const googleUrl = `${googlePlaceUrl}/${searchType}/json?key=${placesKey}&minprice=${price}&maxprice=${price}&type=${type}&rankby=${rankby}&location=${searchCoordinates}&language=${language}&opennow;`
                //  console.log(googleUrl)



    // ================= Get location id and photo reference number from Nearby Serach URL – First Result
    let directionsURL;
    $.getJSON(googleUrl,(searchData)=>{
        // console.log(searchData);
        // Get Random Number Based on googleUrl results to make sure we get a unique rest. each search
        const nearbySearchLength = (searchData.results).length;
        const nearbySearchNumber = (Math.floor(Math.random() * Math.floor(nearbySearchLength)));
        const placeId = searchData.results[nearbySearchNumber].place_id;
        // Calculate Place Location (to get distance variable further below)
        const placeLat = searchData.results[nearbySearchNumber].geometry.location.lat;
        const placeLon = searchData.results[nearbySearchNumber].geometry.location.lng;
        const placeLocation = `${placeLat},${placeLon}`;
        const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${searchCoordinates}&destinations=${placeLocation}&language=${language}&key=${distanceKey}`;
        directionsURL =  `https://www.google.com/maps/dir/${searchCoordinates}/${placeLocation}/`;
         $(".visit-link").attr("href", directionsURL);
        $.getJSON(distanceUrl,(distInMiles)=>{
        const placeDistance = distInMiles.rows[0].elements[0].distance.text
        $(".distance").html(`${placeDistance}`);
        });

        // ==================================================== Assemble Details URL
        const detailsUrl = `${googlePlaceUrl}/details/json?placeid=${placeId}&key=${placesKey}&fields=name,formatted_address,rating,website,price_level,review,photos`;
        // console.log(detailsUrl)
        // ================= Pull Details URL Data

        $.getJSON(detailsUrl,(searchDetails)=>{
            // console.log(searchDetails);
            const restName = searchDetails.result.name;
            $(".result-name").html(`${restName}`);
            const website = searchDetails.result.website;
            $(".result-site").html(`<a class="site-link" href="${website}">Website</a>`);
            const address = searchDetails.result.formatted_address;
            $(".result-add").html(`${address}`);
            let restRating = searchDetails.result.rating;
            restRating = ratingConversion(restRating);
            $(".main-score").html(`${restRating}`);
            const priceLevel = searchDetails.result.price_level;
            let priceDescription;
            if (priceLevel == 1){
                priceDescription = "$10 and Under";
            } else if (priceLevel == 2){
                priceDescription = "$11 – 30";
            } else if (priceLevel == 3){
                priceDescription = "$31 – 60";
            } else if (priceLevel == 4) {
                priceDescription = "$61 – Over";
            } else {
                priceDescription = "undefined";
            };
            $(".price-range").html(`${priceDescription}`);

            // ================== Review Info
            // Create Random Number based on number of review length
            // This lets pull a different review every time
            let reviewsLength,reviewsNumber,reviewUserName,reviewRating,reviewText;
            if(searchDetails.result.reviews){
                reviewsLength = (searchDetails.result.reviews).length;
                reviewsNumber = (Math.floor(Math.random() * Math.floor(reviewsLength)));
                reviewUserName = searchDetails.result.reviews[reviewsNumber].author_name || '';
                $(".review-username").html(`${reviewUserName}`);
                reviewRating = searchDetails.result.reviews[reviewsNumber].rating;
                reviewRating = ratingConversion(reviewRating);
                $(".review-score").html(`${reviewRating}`);
                reviewText = searchDetails.result.reviews[reviewsNumber].text;
                $(".review-text").html(`${reviewText}`);
            } else{
                $(".review-username").html("None available");
                $(".review-score").html("None available");
                $(".review-text").html("None available");
            };

            // ================== Rest Photo

            // Create Random Number based on number of photos results length, just like for reviews
            let photoLength, photoNumber, photoRef, photoWidth, restPhotoUrl;
            if((searchDetails.result.photos)){
                photoLength = (searchDetails.result.photos).length;
                photoNumber = (Math.floor(Math.random() * Math.floor(photoLength)));
                photoRef = searchDetails.result.photos[photoNumber].photo_reference;
                photoWidth = searchDetails.result.photos[photoNumber].width
                restPhotoUrl = `${googlePlaceUrl}/photo?maxwidth=${photoWidth}&photoreference=${photoRef}&key=${placesKey}`
                $(".rest-pic").attr("src", `${restPhotoUrl}`);
            } else {
                $(".rest-pic").attr("src", "");
            };

            let nearbyZomato;
            // console.log(searchLat)
            // console.log(searchLon)
            const zomUrl = `https://developers.zomato.com/api/v2.1/search?lat=${searchLat}&lon=${searchLon}&sort=real_distance&apikey=${zomatoKey}&start=0&count=100`;
                // console.log(zomUrl)
            $.getJSON(zomUrl,(zomData)=>{
                nearbyZomato = zomData.restaurants;
                for(let k=0; k < nearbyZomato.length; k++){
                    // need the name of the restaraunt from the search, NOT FROM GOOGLE
                    if(nearbyZomato[k].restaurant.name === restName){

                        let cuisineOfRest = nearbyZomato[k].restaurant.cuisines.split(",", 1);
                        console.log(cuisineOfRest)
                        // console.log(cuisineOfRest);
                        $(".cuisine").html(cuisineOfRest);
                        // this will not update on each click properly
                        return;
                        
                    } else {
                    $(".cuisine").html("Not available!");
                    };
                };
            });
        });
    });
});

});


// =================================================================================================================== Generate Background Image

function chooseBackground(){

    // ========================= Select Random Number for BG Image
    const backgroundImage = (Math.floor(Math.random() * Math.floor(8))) + 1;

    // ========================= Determine Where to Attach BG Image Based on Screen Size
    function checkScreen(size){
        if(size.matches){
            document.querySelector('.page-body').style.backgroundImage = `url('images/backgroundImage${backgroundImage}.jpg')`;
            document.querySelector('.tagline-box').style.backgroundImage = `none`;
        }
        else{
            document.querySelector('.tagline-box').style.backgroundImage = `url('images/backgroundImage${backgroundImage}.jpg')`;
            document.querySelector('.page-body').style.backgroundImage = `none`;
        };
    };

    let param = window.matchMedia("(min-width:40rem)");
    checkScreen(param);
    param.addListener(checkScreen);
};

chooseBackground();

// ============================= Animation for Results Pop-Up

$(document).ready(()=>{
    $('.results-box').css("display","none");
});

$('#search-btn').click(()=>{
    $('.results-box').css("display","flex");
    $('.results-box').css('animation-name',"grow");
    $('.footer').css('position',"static");
    $('.page-body').css('height','auto');
});

// ============================== Convert rating numbers to stars
function ratingConversion(rating){
    if(rating > 4.75 && rating <= 5){
        return '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i>';
    }
    else if(rating > 4.25 && rating <= 4.75){
        return '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-half-empty"></i>';
    }
    else if(rating > 3.75 && rating <= 4.25){
        return '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-empty"></i>';
    }
    else if(rating > 3.25 && rating <= 3.75){
        return '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-half-empty"></i><i class="icon-star-empty"></i>';
    }
    else if(rating > 2.75 && rating <= 3.25){
        return '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>';
    }
    else if(rating > 2.25 && rating <= 2.75){
        return '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-half-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>';
    }
    else if(rating > 1.75 && rating <= 2.25){
        return '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>';
    }
    else if(rating > 1.25 && rating <= 1.75){
        return '<i class="icon-star"></i><i class="icon-star-half-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>';
    }
    else if(rating > 0.75 && rating <= 1.25){
        return '<i class="icon-star"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>';
    }
    else if(rating > 0.25 && rating <= 0.75){
        return '<i class="icon-star-half-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>';
    }
    else if(rating > 0 && rating <= 0.25){
        return '<i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>';
    }
}