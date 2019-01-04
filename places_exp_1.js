function initMap() {
    const latLng = {lat: -33.8670522, lng: 151.1957362};
    const map = new google.maps.Map(document.getElementById('map'), {
        center: latLng,
        zoom: 17
    });
    
    const mapURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyB2RPBv5Q0-RL92TMZMaL8Zob4E37pKWFk`;
    let placeURL = `https://maps.googleapis.com/maps/api/place/details/json`;
    let address, reviewer, score, review;

    $.getJSON(mapURL,(mapData)=>{
        //console.log(mapData);
        let name = mapData.results[0].name;
        $('#field-1').html(name);

        let placeID = mapData.results[0].place_id;
        placeURL = `${placeURL}?placeid=${placeID}&key=AIzaSyB2RPBv5Q0-RL92TMZMaL8Zob4E37pKWFk`;
        
        $.getJSON(placeURL,(placeData)=>{
            address = placeData.result.adr_address;
            $('#field-2').html(address);

            reviewer = placeData.result.reviews[placeData.result.reviews.length-1].author_name;
            score = placeData.result.reviews[placeData.result.reviews.length-1].rating;
            review = placeData.result.reviews[placeData.result.reviews.length-1].text;

            $('#field-5').html(`${reviewer}: ${score}`);
            $('#field-6').html(review);
        });

        let rating = mapData.results[0].rating;
        ratingConversion(rating);

        let price = mapData.results[0].price_level;
        priceConversion(price);
    });
}

function ratingConversion(rating){
    if(rating > 4.75 && rating <= 5){
        $('#field-3').html('<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i>');
    }
    else if(rating > 4.25 && rating <= 4.75){
        $('#field-3').html('<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-half-empty"></i>');
    }
    else if(rating > 3.75 && rating <= 4.25){
        $('#field-3').html('<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-empty"></i>');
    }
    else if(rating > 3.25 && rating <= 3.75){
        $('#field-3').html('<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-half-empty"></i><i class="icon-star-empty"></i>');
    }
    else if(rating > 2.75 && rating <= 3.25){
        $('#field-3').html('<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>');
    }
    else if(rating > 2.25 && rating <= 2.75){
        $('#field-3').html('<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-half-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>');
    }
    else if(rating > 1.75 && rating <= 2.25){
        $('#field-3').html('<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>');
    }
    else if(rating > 1.25 && rating <= 1.75){
        $('#field-3').html('<i class="icon-star"></i><i class="icon-star-half-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>');
    }
    else if(rating > 0.75 && rating <= 1.25){
        $('#field-3').html('<i class="icon-star"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>');
    }
    else if(rating > 0.25 && rating <= 0.75){
        $('#field-3').html('<i class="icon-star-half-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>');
    }
    else if(rating > 0 && rating <= 0.25){
        $('#field-3').html('<i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i>');
    }
}

function priceConversion(price){
    if(price == 1){
        $('#field-4').html('$: Under $10');
    }
    else if (price == 2){
        $('#field-4').html('$$: $11 to $30');
    }
    else if (price == 3){
        $('#field-4').html('$$$: $31 to $60');
    }
    else if (price == 4){
        $('#field-4').html('$$$$: $61 & Over');
    }
}