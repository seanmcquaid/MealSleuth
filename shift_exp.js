function getXY(){
    var offset = $('.box1').offset();
    $('#pos-x').html(offset.left);
    $('#pos-y').html(offset.top);
}

getXY();

$('#shift-btn').click(()=>{
    $('.box2').css("display","inline-flex");

    $('.box2').css("animation-name","grow");
    setTimeout(()=>{
        console.log("WOOF");
        $('#text').css("animation-name","appear")
    },1375);
    getXY();
});