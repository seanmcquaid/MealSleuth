// ================== Define Latitute and Longitute from current location

let lat,lon;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    const myAddressUrl=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${placesKey}`
    $.getJSON(myAddressUrl,(addressData)=>{   
        const myCurrAddress =  addressData.results[0].formatted_address;
        $('.input-location').val(myCurrAddress);
        });        
    });
};

// ================== Pull price point from Search

$('.search-form').submit((e)=>{
    e.preventDefault();

     // ================== Generate Parameters for Google Nearby Search URL
        
        const dirLanguage = "en";
        const dirPrice = $('.input-price').val();
        const dirType = "restaurant";
        const dirRankby = "distance";
         
        // ================== Get Search Location Lat and Lon
        const myLocation = $('.input-location').val();
        const myLocationComma = myLocation.replace(/,/g,"");
        const myLocFinalFormat = myLocationComma.replace(/ /g,"+");
        const addressToCoordinatesUrl=`https://maps.googleapis.com/maps/api/geocode/json?address=${myLocFinalFormat}&key=${placesKey}`;

        let searchLat,searchLon,searchCoordinates,searchObject; 
        $.getJSON(addressToCoordinatesUrl,(coordinateData)=>{   
            searchLat =  coordinateData.results[0].geometry.location.lat;
            searchLon =  coordinateData.results[0].geometry.location.lng;
            searchCoordinates ={lat: Number.parseFloat(searchLat), lng: Number.parseFloat(searchLon)}
            searchObject = coordinateData.results[0].geometry.location;

            


    // ================= Get location id from Nearby Serach URL – First Result
            let directionsURL;
            let request = {
            language: dirLanguage,
            minPriceLevel: dirPrice,
            maxPriceLevel: dirPrice,
            type: dirType,
            rankby:dirRankby,
            location: searchCoordinates,
            language: dirLanguage,
            opennow:true,
            radius: 1000
            };

            let service = new google.maps.places.PlacesService(document.createElement('div'));
            service.nearbySearch(request,(searchData)=>{
                // Get Random Number Based on length of searchData to make sure we get a unique rest. each search
                const nearbySearchLength = (searchData).length;
                const nearbySearchNumber = (Math.floor(Math.random() * Math.floor(nearbySearchLength)));
                const placeId = searchData[nearbySearchNumber].place_id;
                const placeLat = searchData[nearbySearchNumber].geometry.location.lat();
                const placeLon = searchData[nearbySearchNumber].geometry.location.lng();
                const placeLocation = `${placeLat},${placeLon}`;
                directionsURL =  `https://www.google.com/maps/dir/${searchLat},${searchLon}/${placeLocation}/`;
                $(".visit-link").attr("href", directionsURL);
                let distanceService = new google.maps.DistanceMatrixService();
                let distanceRequest = {
                origins: [searchObject],
                destinations: [placeLocation],
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                travelMode: "DRIVING",
                };
                distanceService.getDistanceMatrix(distanceRequest, (distanceDetails)=>{
                    const distanceText = distanceDetails.rows[0].elements[0].distance.text;
                    $(".distance").html(`${distanceText}`);
                });

        // ================= Pull Details URL Data
                let detailsRequest = {
                    placeId: placeId,
                    fields: ["name", "website", "formatted_address", "rating", "price_level", "reviews", "photos"]
                };

                service.getDetails(detailsRequest, (searchDetails)=>{
                    const restName = searchDetails.name;
                    $(".result-name").html(`${restName}`);
                    const website = searchDetails.website;
                    $(".result-site").html(`<a class="site-link" href="${website}">Website</a>`);
                    const address = searchDetails.formatted_address;
                    $(".result-add").html(`${address}`);
                    let restRating = searchDetails.rating;
                    restRating = ratingConversion(restRating);
                    $(".main-score").html(`${restRating}`);
                    const priceLevel = searchDetails.price_level;
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
                if(searchDetails.reviews){
                    reviewsLength = searchDetails.reviews.length;
                    reviewsNumber = (Math.floor(Math.random() * Math.floor(reviewsLength)));
                    reviewUserName = searchDetails.reviews[reviewsNumber].author_name || '';
                    $(".review-username").html(`${reviewUserName}`);
                    reviewRating = searchDetails.reviews[reviewsNumber].rating;
                    reviewRating = ratingConversion(reviewRating);
                    $(".review-score").html(`${reviewRating}`);
                    reviewText = searchDetails.reviews[reviewsNumber].text;
                    $(".review-text").html(`${reviewText}`);
                } else{
                    $(".review-username").html("None available");
                    $(".review-score").html("None available");
                    $(".review-text").html("None available");
                };

            // ================== Rest Photo

            // Create Random Number based on number of photos results length, just like for reviews
                let photoLength, photoNumber, photoRef, photoWidth, restPhotoUrl, photoLink;
                if((searchDetails.photos)){
                    photoLength = (searchDetails.photos).length;
                    photoNumber = (Math.floor(Math.random() * Math.floor(photoLength)));
                    photoLink = searchDetails.photos[photoNumber].getUrl();
                    $(".rest-pic").attr("src", photoLink);
                };

                let nearbyZomato;

                const zomUrl = `https://developers.zomato.com/api/v2.1/search?lat=${searchLat}&lon=${searchLon}&sort=real_distance&apikey=${zomatoKey}&start=0&count=100`;
                    // console.log(zomUrl)
                $.getJSON(zomUrl,(zomData)=>{
                    nearbyZomato = zomData.restaurants;     
                    
                    for(let k=0; k < nearbyZomato.length; k++){      
                        const restNameFormat = (`${(restName.split(" ")).slice(0,1)}`).toLowerCase(); 
                        let zomatoRestName = nearbyZomato[k].restaurant.name;
                        let zomatoRestNameFormat = (`${(zomatoRestName.split(" ")).slice(0,1)}`).toLowerCase();

                        // need the name of the restaraunt from the search, NOT FROM GOOGLE
                        if(zomatoRestNameFormat === restNameFormat){
                            let cuisineOfRest = nearbyZomato[k].restaurant.cuisines.split(",", 1);
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
};