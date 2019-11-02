require("dotenv").config(); // imports dotenv package. Does nto need to be assigned to variable.
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js"); //imports spotify keys from keys file. File will run when imported.
//console.log(keys);
var Spotify = require('node-spotify-api'); // imports spotify package
var moment = require('moment'); // Moment JS required to format concert time
//console.log(process.argv.slice(3).join(' ')); // slices existing array and returns new array starting with index3
var command = process.argv[2]; // Base command
var input = process.argv.slice(3).join(' '); // argument given... ie movie or song name etc
var spotify = new Spotify(keys.spotify);

// console.warn('test')

if (command === 'spotify-this-song') {
    spotifyThis(input);
    
} else if (command === 'concert-this') {
    concertThis(input);
    
} else if (command === 'movie-this') {
    movieThis(input);

} else if (command === 'do-what-it-says') {
    doWhat(input);
    
} else {
    //console.log(command);
    //console.log(input);
    console.log("Liri Bot usage: ",
        "\r\n",
        "\r\nspotify-this-song <songname> to get song, Artist, and preview info.",
        "\r\noncert-this <band Name> to show the next concert.",
        "\r\nmovie-this <Movie Title> to show movie info, ratings, plot, etc.",
        "\r\ndo-what-it-says will run the commands listed in the random.txt file."
    );
}

function movieThis(input) {
    if (input === '') {
        input = 'Mr. Nobody'
    }
    axios({
        method: 'get',
        url: `http://www.omdbapi.com/?t=${input}&apikey=trilogy`, //${} is called template literal use "input" variable. Also use backticks
        //this input is more flexible than method used in line 29
        //url: `http://www.omdbapi.com/?s=${input}&apikey=3c07a96e`,
    })
        .then(function (response) {
            console.log("Title: ", response.data.Title,
                "\r\nYear: ", response.data.Year, // \r\n is "return & newline" This is so only one console.log is needed.
                "\r\nIMDB Rating: ", response.data.Ratings[0].Value,
                "\r\nRotten Tomatoes Rating: ", response.data.Ratings[1].Value,
                "\r\nLanguage: ", response.data.Language,
                "\r\nCountry: ", response.data.Country,
                "\r\nPlot: ", response.data.Plot,
                "\r\nActors: ", response.data.Actors,
            );
            //const movieArray = response.data.Search; // must capitalize bc the returned object key "Search" is capitalized 
        })
        .catch(err => console.warn('seomthing went wrong', err));
}

function spotifyThis(input) {
    if (input === '') { //If no song input then default to "The Sign" per requirements
        input = "The Sign"
    }
    spotify.search({ type: 'track', query: input, limit: 3 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        const response = data.tracks.items;

        console.log("Returning 3 tracks:");
        for (let i = 0; i < 3; i++) {
            console.log("Song: ", input);
            console.log(i + 1, ":");
            console.log("Artist: ", response[i].artists[0].name);
            console.log("Album: ", response[i].album.name);
            console.log("Preview URL: ", response[i].preview_url);
        }

    });
}

function concertThis(input){
    axios({
        method: 'get',
        url: "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp",
    })
        .then(function (response) {
            //console.log(response.data[0]);
            console.log("Venue: ", response.data[0].venue.name, //only first concert shown
                "\r\nLocation: ", response.data[0].venue.country,
                "\r\nDate: ", moment(response.data[0].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"))
        });
}

function doWhat(input){
    var callback = function (err, data) {
        if (err) {
            throw err;
        }
        //console.log(data);
        let result = data.split(",");
        let newCommand = result[0];
        let newInput = result[1];
        console.log(newCommand, newInput);
        if (newCommand === "spotify-this-song"){
            spotifyThis(newInput);
        } else if(newCommand === "movie-this"){
            movieThis(newInput);
        } else if(newCommand === "concert-this"){
            concertThis(newInput)
        }
    }
    fs.readFile("./random.txt", "utf-8", callback); // Manually created the callback function to show how it works compared to inline anonymous function method

}