var input;
var i = 0;
var j = 0;
var k = 0;
var items = [];
var length = 10;
var limit = 2800;
var spotURL;
var didScroll = false;

$('#submit').on('click', function(){
    $(".pictureBox").remove();
    $(".pictureText").remove();
    $('.more').remove();
    i = 0;
    j = 0;
    k = 0;
    items = [];
    length = 10;
    input = $('#inputString').val();
    var type = $('#selector').val();
    var searchString = encodeURIComponent(input);
    spotURL = 'https://api.spotify.com/v1/search?q=' + searchString + '&type=' + type;
    var types = type + 's';
    ajaxSpotify(spotURL, types);
});


function ajaxSpotify(toSearch, types){
    $.ajax({
        url: toSearch,
        method: 'GET',
        data: {
            limit: 20
        },
        success: function(data){
            generatePictures(data, types);
        }
    });
}

function generatePictures(data, types){
    $('#results').html("<h3>Results for \"" + input + "\"</h3>");
    $.merge(items, data[types]['items']);
    for (i; i < items.length; i++){
        $('#page').append("<div class='resultContainer'><div class='pictureBox'></div><div class='pictureText'></div></div>");
    }
//    $(".pictureBox").each(function(){
    for (j; j < items.length; j++){
        if (items[j].images[0] != undefined){
            $(".pictureBox").eq(j).css({"background-image" : "url("+ items[j].images[0].url + ")"});
        }
        else{
            $(".pictureBox").eq(j).css({"background-image" : "url('images/nada.png')"});
        }
        $(".pictureBox").eq(j).wrap("<a target='_blank' href=" + items[j].external_urls.spotify + "></a>");
    }
//    });
    for (k; k < items.length; k++){
        if (items[k] != undefined){
            $(".pictureText").eq(k).html("<a target='_blank' href=" + items[k].external_urls.spotify + "><p>" + items[k].name + "</p></a>");
        }
    }
    $("#page").append("<div class='more'><p>more</p></div>");
    $(".more").on('click', function(){
        $('.more').remove();
        length += 10;
        spotURL = data[types].next;
        ajaxSpotify(spotURL, types);
    });
    $(window).scroll(function() {
        didScroll = true;
    });

    setInterval(function() {
        if ( didScroll ) {
            didScroll = false;
        }
        console.log($(window).scrollTop());
        if ($(window).scrollTop() > limit){
            $('.more').remove();
            length += 10;
            var useURL = spotURL + '&offset=' + length;
            console.log(useURL);
            ajaxSpotify(useURL, types);
            limit += 3300;
        }
    }, 2000);

}
