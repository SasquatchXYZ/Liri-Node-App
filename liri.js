require("dotenv").config();

let fs = require("fs");
let request = require("request");
let moment = require("moment");
let keys = require("./keys");
let Spotify = require("node-spotify-api");

let spotify = new Spotify(keys.spotify);
// console.log(spotify);

let command= process.argv[2];
let parameter = [];
for (k = 3; k < process.argv.length; k++) {
    parameter.push(process.argv[k]);
}
console.log(command, parameter);


if (command === `do-what-it-says`) {
    queryRandom();
} else {
    queryAPIS();
}

function queryAPIS() {
    if (command === `concert-this`) {
        appendLog((`${command} + ${parameter}`));
        queryBandsInTown();
    } else if (command === `spotify-this-song`) {
        appendLog((`${command} + ${parameter}`));
        querySpotify();
    } else if (command === `movie-this`) {
        appendLog((`${command} + ${parameter}`));
        queryOMDB();
    }
}

// Function to Log the Query Commands as well as the Data returned to the 'log.txt' file.
// This logging is done using '.createWriteStream' in order to allow the loops
// to write large portions of data to the file.

function appendLog(data) {
    let stream = fs.createWriteStream("log.txt", {flags: "a"});
    stream.write(`${data}\n`);
    stream.end();
}

// Query Functions =====================================================================================================
function queryRandom() {
    fs.readFile("random.txt", "utf8", function(error, data) {
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
    let queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
    console.log(artist);
    console.log(queryURL);

    request(queryURL, function(error, response, data) {
        if (!error && response.statusCode === 200) {
            let results = JSON.parse(data);
            //console.log(results);
            //console.log(results.length);
            for (var k = 0; k < results.length; k++) {
                let concerts = {};
                concerts.venue = results[k].venue.name;
                concerts.location = `${results[k].venue.city}, ${results[k].venue.country}`;
                concerts.date = moment(results[k].datetime).format("MM/DD/YYYY");
                console.log(`=======================================`);
                console.log(concerts);

                appendLog(JSON.stringify(concerts));

                /*console.log(`Venue Name: ${concerts.venue}`);
                console.log(`Venue Location: ${concerts.location}`);
                console.log(`Date: ${concerts.date}`);*/

            }
        }
    });
}

// =====================================================================================================================
function querySpotify() {
    let songTitle = parameter.join(" ");
    //console.log(songTitle);
    spotify.search({type: `track`, query: `${songTitle}`, limit: 1}, function(error, data) {
        if (error) {
            return console.log(`Error Occurred: ${error}`);
        }
        let result = data.tracks.items;
        /*console.log(result);*/
        let disc = result[0];
        let songDetails = {};
        songDetails.artist = disc.artists[0].name;
        songDetails.title = disc.name;
        songDetails.previewLink = disc.preview_url;
        songDetails.album = disc.album.name;
        console.log(songDetails);

        appendLog(JSON.stringify(songDetails));

        /*console.log(`Artist: ${songDetails.artist}`);
        console.log(`Song Title: ${songDetails.title}`);
        console.log(`Preview Link: ${songDetails.previewLink}`);
        console.log(`Album Title: ${songDetails.album}`);*/
    });
}

// =====================================================================================================================
function queryOMDB() {
    let movieTitle = parameter.join("+");

    if (movieTitle.length === 0) {
        movieTitle = "Mr.+Nobody";
    }
    //console.log(movieTitle);

    let queryURL = `http://www.omdbapi.com/?t=${movieTitle}&y=&plot=short&apikey=trilogy`;

    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let moviedata = {};
            moviedata.title = JSON.parse(body).Title;
            moviedata.releaseYear = JSON.parse(body).Year;
            moviedata.imdbRating = JSON.parse(body).Ratings[0].Value;
            moviedata.rottenTomatoesRating = JSON.parse(body).Ratings[1].Value;
            moviedata.country = JSON.parse(body).Country;
            moviedata.language = JSON.parse(body).Language;
            moviedata.plot = JSON.parse(body).Plot;
            moviedata.actors = JSON.parse(body).Actors;

            console.log(moviedata);

            appendLog(JSON.stringify(moviedata));
            //console.log(JSON.parse(body));
            /*console.log(`Title: ${JSON.parse(body).Title}`);
            console.log(`Year Released: ${JSON.parse(body).Year}`);
            console.log(`IMDB Rating: ${JSON.parse(body).Ratings[0].Value}`);
            console.log(`Rotten Tomatoes Rating; ${JSON.parse(body).Ratings[1].Value}`);
            console.log(`Country: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            console.log(`Actors: ${JSON.parse(body).Actors}`);*/
        }
    });
}