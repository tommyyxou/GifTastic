let words = [
    "Bugs Bunny", "Homer Simpson", "Mickey Mouse", "Bart Simpson", "Charlie Brown",
    "Fred Flintstone", "The Grinch", "Popeye", "Wile E. Coyote", "Rocky and Bullwinkle",
];

let favorites = [];

let searchTerm = "";
let charId = 0;
let limit = 10;
let ratingQuery = "G"
let webResponse = "";
let isImgStill = true;
let topicJSON = "";
let responsePos = null;

function initialize () {
     if (localStorage.getItem("topic") === null) {
        for (charId = 0; charId < words.length; charId++ ) {
            setupButton (words);
        } 
    } else {
        words = JSON.parse(localStorage.getItem("topic"));
        for (charId = 0; charId < words.length; charId++ ) {
            setupButton (words);
        };
    }

    favorites = JSON.parse(localStorage.getItem("favorites"));
    
    displayGif ();
    displayFav ();
    addButton ();
    clearLocalStorage ();
    ratingSetting ();
    
};

function ratingSetting () {
    $(".RatingSetting").on("click", function(event) {
        ratingQuery = event.currentTarget.innerText;
        console.log (ratingQuery)
    });
};  

function clearLocalStorage () {
    $("#resetArray").on("click", function() {
        localStorage.clear();
    });
}

function addButton () {
    $("#find-char").on("click", function() {
        if ($("#charName").val() !== "") {
            let charName = $("#charName").val();
            words.push(charName);
            topicJSON = JSON.stringify (words);
            localStorage.setItem ("topic",topicJSON);
            appendCharButton();
            $("#charName").val("");
        } else {
            alert("Please Enter Character Name!")
        }
    });
}    

function getResults () {
    let queryURL = "https://api.giphy.com/v1/gifs/search?api_key=2RY8YHlNYX8yKSGzWLcLUwu7fPvEjdp5&q=" +
            searchTerm + "&limit=" +
            limit + "&offset=0&rating=" +
            ratingQuery + "&lang=en";
            console.log (ratingQuery)
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            for (let i = (limit-10); i < response.data.length; i++) {
                webResponse = response
                let rating = response.data[i].rating;
                let stillImg = response.data[i].images.fixed_height_still.url;
                let animeImg = response.data[i].images.fixed_height.url;

                let gifIdString = "gif" + i;
                $("#gifsDiv").append("<div id='" + gifIdString + "' class='gifImage'></div>");
      
                let gifRating = $("<h2>");
                gifRating.text("Rating: " + rating);

                let imgIdString = "img" + i;

                let gifImg = $("<img>");
                gifImg.attr('id', imgIdString );
                gifImg.attr('class', "gifImgFrame");
                gifImg.attr('src', stillImg);

                let appendgifId = "#" + gifIdString;
                $(appendgifId).append(gifRating);
                $(appendgifId).append(gifImg);
                $(appendgifId).append("<div><a href='" + animeImg + "' download='gif'><button class='buttonDL' src='" + animeImg + "'>Download Gif</button></a></div>");
                $(appendgifId).append("<button id='" + i + "' class='buttonDL float fav' >Add to Favorites</button>");
            }
            gifAnime ();
            addFav ();
        });
}

function addFav () {
    $(".fav").on("click", function() {
    console.log ("fav click")
    let i = event.currentTarget.id;
    
    let favGif = {  rating: webResponse.data[i].rating,
                    stillImgURL: webResponse.data[i].images.fixed_height_still.url,
                    animeImgURL: webResponse.data[i].images.fixed_height.url,
                 }
    favorites.push(favGif);
    favJSON = JSON.stringify(favorites);
    localStorage.setItem ("favorites", favJSON);
    console.log (localStorage.getItem ("favorites"))
    displayFav();
    });
    
}

function displayFav() {
    if (favorites.length !== 0) {
        $(".favImage").remove();
        favorites = JSON.parse(localStorage.getItem("favorites"));
        console.log ("fav display")
        if (favorites.length !== 0) {
            for (let i = 0; i < favorites.length ; i++) {
                let favString = "fav" + i
                
                    $("#favDiv").append("<div id='" + favString + "' class='favImage'></div>");
        
                    let gifRating = $("<h2>");
                    gifRating.text("Rating: " + favorites[i].rating);

                    let imgIdString = "img" + i;

                    let gifImg = $("<img>");
                    gifImg.attr('id', imgIdString );
                    gifImg.attr('class', "gifImgFrame");
                    gifImg.attr('src', favorites[i].stillImgURL);

                    let appendfavId = "#" + favString;
                    $(appendfavId).append(gifRating);
                    $(appendfavId).append(gifImg);
            }
        }
    }
}

function favReset () {
    favorites = [];
    favJSON = JSON.stringify(favorites);
    localStorage.setItem ("favorites", favJSON);
    $(".favImage").remove();


}

function displayGif () {
    $(".button").on("click", function() {
         if (searchTerm !== $(this).text()) {
        $("#gifsDiv").remove();
        $("#placeHolder").append("<div id='gifsDiv'></div>");
        $("#more").remove();
        searchTerm = $(this).text();
        getResults();
        $("#moreButtonDiv").append("<button id='more' class='button first' onclick='moreGif();'>Load More Gifs</button>")
        }
        
    });   
}

function moreGif () {
    limit = limit +10;
    
    $("#more").remove();
    getResults();
    $("#moreButtonDiv").append("<button id='more' class='button first' onclick='moreGif();'>Load More Gifs</button>")
}

function appendCharButton () {
    words = JSON.parse(localStorage.getItem("topic"));
    setupButton(words);
    charId++;
    displayGif();
}

function setupButton (words) {

    let buttonName = $("<button>");
    buttonName.attr('class', "button hover");
    buttonName.text(words[charId]);
    $("#buttonDiv").append(buttonName);
}

function gifAnime () {
    $(".gifImgFrame").on("click", function(event) {
        console.log ("anime click");
        gifId = event.currentTarget.id;
        let i = gifId.match(/\d/g);
        i = i.join("");
        gifAnimeIdString = "#img" + i;

        if (isImgStill === true) {
            let animeImg = webResponse.data[i].images.fixed_height.url;
            $(gifAnimeIdString).attr('src', animeImg);
            isImgStill = false;
        } else {
            let stillImg = webResponse.data[i].images.fixed_height_still.url;
            $(gifAnimeIdString).attr('src', stillImg);
            isImgStill = true;
        }
    });
}
