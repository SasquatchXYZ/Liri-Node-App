// Loading Environmental Variables - API Keys.
require("dotenv").config();

// Requiring Node Modules Needed to run LIRI.
const fs = require("fs");
const request = require("request");
const moment = require("moment");
const keys = require("./keys");
const Spotify = require("node-spotify-api");

// Passing the API Keys to variables.
const bandsAPIkey = keys.bandsAPIkey;
const spotify = new Spotify(keys.spotify);
const omdbAPIkey = keys.omdbAPIKey;

// Start of LIRI-Node-App Operations ===================================================================================

// Registering the command and parameters given to start LIRI.
let [ , , command, ...parameter] = process.argv;
//console.log(command, parameter);

// If the initial command given is 'do-what-it-says' we first need to read from the 'random.txt' file in order to
// determine exactly what is specified in the file and to run the proper query for the data found there.
if (command === `do-what-it-says`) {
    appendLog((`${command} ... reading from 'random.txt'`));
    queryRandom();
} else {
    queryAPIS();
}

// Function for discerning which API it is that we need to Query.
function queryAPIS() {
    switch (command) {
        case "concert-this":
            appendLog((`Search: ${command} + ${parameter}`));
            queryBandsInTown();
            break;
        case "spotify-this-song":
            appendLog((`Search: ${command} + ${parameter}`));
            querySpotify();
            break;
        case "movie-this":
            appendLog((`Search: ${command} + ${parameter}`));
            queryOMDB();
            break;
    }
}

// Function to Log the Query Commands as well as the Data returned to the 'log.txt' file.
// This logging is done using '.createWriteStream' in order to allow the loops
// to write large portions of data to the file.

function appendLog(data) {
    let stream = fs.createWriteStream("log.txt", {flags: "a"});
    stream.write(`\n${data}\n`);
    stream.end();
}

// Query Functions =====================================================================================================
function queryRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);

        var randomArray = data.split(",");
        //console.log(randomArray);
        command = randomArray[0];
        parameter = randomArray[1].replace(/"/g, "").split(" ");
        console.log(command, parameter);

        queryAPIS();

    })
}

// =====================================================================================================================
function queryBandsInTown() {
    let artist = parameter.join("%20");
    let queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${bandsAPIkey}`;
    //console.log(artist);
    //console.log(queryURL);

    request(queryURL, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            let results = JSON.parse(data);
            //console.log(results);
            //console.log(results.length);

            if (results.length === 0) {
                console.log(`There are no upcoming concerts for ${artist}`);
                appendLog(`There are no upcoming concerts for ${artist}`);
            } else {
                results.forEach(function (events) {
                    let concerts = {};
                    concerts.venue = events.venue.name;
                    concerts.location = `${events.venue.city} ${events.venue.region}, ${events.venue.country}`;
                    concerts.date = moment(events.datetime).format("MM/DD/YYYY");
                    console.log(`------------------------------------------------------------------------------------`);
                    console.log(concerts);

                    appendLog(JSON.stringify(concerts));

                    /*console.log(`Venue Name: ${concerts.venue}`);
                    console.log(`Venue Location: ${concerts.location}`);
                    console.log(`Date: ${concerts.date}`);*/
                })
            }
        }
    });
}

// =====================================================================================================================
function querySpotify() {
    let songTitle = parameter.join(" ");
    //console.log(songTitle);
    spotify.search({type: `track`, query: `${songTitle}`, limit: 5}, function (error, data) {
        if (error) {
            return console.log(`Error Occurred: ${error}`);
        }
        //console.log(data.tracks.items);
        let resultArray = data.tracks.items;
        resultArray.forEach(function (result) {
            let songDetails = {};
            songDetails.title = result.name;
            songDetails.artist = result.artists[0].name;
            songDetails.album = result.album.name;
            songDetails.previewLink = result.preview_url;

            console.log(`--------------------------------------------------------------------------------------------`);
            console.log(songDetails);

            appendLog(JSON.stringify(songDetails));

            /*console.log(`Artist: ${songDetails.artist}`);
        console.log(`Song Title: ${songDetails.title}`);
        console.log(`Preview Link: ${songDetails.previewLink}`);
        console.log(`Album Title: ${songDetails.album}`);*/
        })
    });
}

// =====================================================================================================================
function queryOMDB() {
    let movieTitle = parameter.join("+");

    if (movieTitle.length === 0) {
        movieTitle = "Mr.+Nobody";
    }
    //console.log(movieTitle);

    let queryURL = `http://www.omdbapi.com/?t=${movieTitle}&y=&plot=full&apikey=${omdbAPIkey}`;

    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(body);
            //console.log(JSON.parse(body));
            let results = JSON.parse(body);

            let moviedata = {};
            moviedata.title = results.Title;
            moviedata.releaseYear = results.Year;
            moviedata.rated = results.Rated;
            moviedata.imdbRating = results.Ratings[0].Value;
            moviedata.rottenTomatoesRating = results.Ratings[1].Value;
            moviedata.country = results.Country;
            moviedata.language = results.Language;
            moviedata.plot = results.Plot;
            moviedata.actors = results.Actors;

            console.log(moviedata);

            appendLog(JSON.stringify(moviedata));

            /*console.log(`Title: ${moviedata.title}`);
            console.log(`Year Released: ${moviedata.releaseYear}`);
            console.log(`IMDB Rating: ${moviedata.imdbRating}`);
            console.log(`Rotten Tomatoes Rating; ${moviedata.rottenTomatoesRating}`);
            console.log(`Country: ${moviedata.country}`);
            console.log(`Language: ${moviedata.language}`);
            console.log(`Plot: ${moviedata.plot}`);
            console.log(`Actors: ${moviedata.actors}`);*/
        }
    });
}