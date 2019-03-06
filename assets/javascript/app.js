let words = [
    "Bugs Bunny", "Homer Simpson", "Mickey Mouse", "Bart Simpson", "Charlie Brown",
    "Fred Flintstone", "The Grinch", "Popeye", "Wile E. Coyote", "Rocky and Bullwinkle",
];

let searchTerm = "";
let charId = 0;
let limit = 10;
let ratingQuery = "G"

function initialize () {
    for (charId = 0; charId < words.length; charId++ ) {
        setupButton ();
    };

    displayGif ();

    $("#find-char").on("click", function(event) {
        event.preventDefault();
        let charName = $("#charName").val();
        words.push(charName);
        appendCharButton();
    });
};

function displayGif () {
    $("button").on("click", function() {

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


        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            for (let i = 0; i < response.data.length; i++) {

                let rating = response.data[i].rating;
                let stillImg = response.data[i].images.downsized_still.url;

                let gifIdString = "gif" + i;
                $("#gifsDiv").append("<div id='" + gifIdString + "' class='gifImage'></div>");
      
                let gifRating = $("<h2>");
                gifRating.text(rating);
      
                let gifImg = $("<img>");
                gifImg.attr('src', stillImg);

                let appendgifId = "#" + gifIdString;
                $(appendgifId).append(gifRating);
                $(appendgifId).append(gifImg);
              }
        });
    });
}

function appendCharButton () {
    setupButton();
    charId++;
    displayGif();
}

function setupButton () {
    let buttonName = $("<button>");
    buttonName.attr('class', "button");
    buttonName.text(words[charId]);
    $("#buttonDiv").append(buttonName);
}
