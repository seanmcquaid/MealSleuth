console.log("WOOF");

function initMap() {
    const latLng = {lat: -33.8670522, lng: 151.1957362};
    const map = new google.maps.Map(document.getElementById('map'), {
        center: latLng,
        zoom: 17
    });
    
    const mapURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyB2RPBv5Q0-RL92TMZMaL8Zob4E37pKWFk`;

    $.getJSON(mapURL,(apiData)=>{
        //console.log(apiData);
        let name = apiData.results[0].name;
        $('#field-1').html(name);

        let rating = apiData.results[0].rating;
        ratingConversion(rating);

        let price = apiData.results[0].price_level;
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
        $('#field-4').html('$');
    }
    else if (price == 2){
        $('#field-4').html('$$');
    }
    else if (price == 3){
        $('#field-4').html('$$$');
    }
    else if (price == 4){
        $('#field-4').html('$$$$');
    }
}