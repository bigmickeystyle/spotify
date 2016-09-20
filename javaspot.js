var input;


$('#submit').on('click', function(){
    $(".pictureBox").remove();
    $(".pictureText").remove();
    input = $('#inputString').val();
    var type = $('#selector').val();
    var searchString = encodeURIComponent(input);
    var spotURL = 'https://api.spotify.com/v1/search?q=' + searchString + '&type=' + type;
    var types = type + 's';
    console.log(spotURL);
    ajaxSpotify(spotURL, types);
});


function ajaxSpotify(toSearch, types){
    $.ajax({
        url: toSearch,
        method: 'GET',
        data: {
            limit: 10
        },
        success: function(data){
            generatePictures(data, types);
        }
    });
}

function generatePictures(data, types){
    $('#results').html("<h3>Results for \"" + input + "\"</h3>");
    var items = data[types].items;
    for (var i = 0; i < items.length; i++){
        $('#page').append("<div class='resultContainer'><div class='pictureBox'></div><div class='pictureText'></div></div>");
    }
    var j = 0;
    var k = 0;
    $(".pictureBox").each(function(){
        if (items[j].images[0] != undefined){
            $(this).css({"background-image" : "url("+ items[j].images[0].url + ")"});
        }
        else{
            $(this).css({"background-image" : "url('images/nada.png')"});
        }
        $(this).wrap("<a target='_blank' href=" + items[j].external_urls.spotify + "></a>");
        j++;
    });
    $(".pictureText").each(function(){
        if (items[k] != undefined){
            $(this).html("<a target='_blank' href=" + items[k].external_urls.spotify + "><p>" + items[k].name + "</p></a>");
        }
        k++;
    });
}
