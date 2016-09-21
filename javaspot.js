var input;
var i = 0;
var j = 0;
var k = 0;
var items = [];
var length = 10;
var limit = 2800;
var spotURL;
var didScroll = false;

var templates = document.querySelectorAll('script[type="text/handlebars"]');

Handlebars.templates = Handlebars.templates || {};

Handlebars.partials = Handlebars.templates;

Array.prototype.slice.call(templates).forEach(function(script) {
    Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
});


$('#submit').on('click', function(){
    $(".pictureBox").remove();
    $(".pictureText").remove();
    $('.more').remove();
    i = 0;
    j = 0;
    k = 0;
    id = 0;
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
var id = 0;
function generatePictures(data, types){
    $('#results').html(Handlebars.templates.resultScript({input}));
    $.merge(items, data[types]['items']);
    for (i; i < items.length; i++){
        $('#page').append(Handlebars.templates.resultsScript({id}));
        id = id + 1;
    }
    for (j; j < items.length; j++){
        if (items[j].images[0] != undefined){
            var it = '#' + j;
            $(it).css({"background-image" : "url("+ items[j].images[0].url + ")"});
        }
        else{
            $(it).css({"background-image" : "url('images/nada.png')"});
        }
        var link = items[j].external_urls.spotify;
        $(it).wrap("<a target='_blank' href=" + link + "></a>");
    }
    for (k; k < items.length; k++){
        if (items[k] != undefined){
            $(".pictureText").eq(k).html("<a target='_blank' href=" + items[k].external_urls.spotify + "><p>" + items[k].name + "</p></a>");
        }
    }
    $("#page").append(Handlebars.templates.moreButton({}));
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
