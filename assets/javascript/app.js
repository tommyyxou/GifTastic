let words = [
    "Bugs Bunny", "Homer Simpson", "Mickey Mouse", "Bart Simpson", "Charlie Brown",
    "Fred Flintstone", "The Grinch", "Popeye", "Wile E. Coyote", "Rocky and Bullwinkle",
];

let searchTerm = "";
let charId = 0;
let limit = 10;
let ratingQuery = "G"
let webResponse = "";
let isImgStill = true;
let topicJSON = "";

function initialize () {
    if (localStorage.length > 0) {
        words = JSON.parse(localStorage.getItem("topic"));
        for (charId = 0; charId < words.length; charId++ ) {
            setupButton (words);
        };
    } else {

        for (charId = 0; charId < words.length; charId++ ) {
            setupButton (words);
        };
    }

    displayGif ();
    addButton ();
    clearLocalStorage ();
    ratingSetting ()
    
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

function displayGif () {
    $(".button").on("click", function() {
        $("#gifsDiv").remove();
        $(".leftSideBar").append("<div id='gifsDiv'></div>");

        if (searchTerm == $(this).text()) {
            limit = limit + 10;
        } else {
            limit = 10;
        }

        searchTerm = $(this).text();
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
            for (let i = 0; i < response.data.length; i++) {
                webResponse = response
                console.log (response)
                let rating = response.data[i].rating;
                let stillImg = response.data[i].images.fixed_height_still.url;

                let gifIdString = "gif" + i;
                $("#gifsDiv").append("<div id='" + gifIdString + "' class='gifImage'></div>");
      
                let gifRating = $("<h2>");
                gifRating.text("Rating: " + rating);

                let imgIdString = "img" + i;

                let gifImg = $("<img>");
                gifImg.attr('id', imgIdString )
                gifImg.attr('src', stillImg);

                let appendgifId = "#" + gifIdString;
                $(appendgifId).append(gifRating);
                $(appendgifId).append(gifImg);
            }
            gifAnime ();
        });
    });
    
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
    $(".gifImage").on("click", function(event) {
        let gifId = event.currentTarget.id;
        console.log (gifId)
        let i = gifId.substring(3,4);
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
