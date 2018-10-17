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

if (command === `concert-this`) {
    queryBandsInTown();

/*    let artist = parameter.join("%20");
    let queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
    console.log(artist);
    console.log(queryURL);

    request(queryURL, function(error, response, data) {
        if (!error && response.statusCode === 200) {
            let results = JSON.parse(data);
            //console.log(results);
            //console.log(results.length);
            for (var k = 0; k < results.length; k++) {
                console.log(`=======================================`);
                console.log(`Venue Name: ${results[k].venue.name}`);
                console.log(`Venue Location: ${results[k].venue.city}, ${results[k].venue.country}`);
                console.log(`Date: ${moment(results[k].datetime).format("MM/DD/YYYY")}`);
            }
        }
    });*/

} else if (command === `spotify-this-song`) {
    querySpotify();
    /*spotify.search({type: `track`, query: `${parameter}`, limit: 1}, function(error, data) {
        if (error) {
            return console.log(`Error Occurred: ${error}`);
        }
        let result = data.tracks.items;
        /!*console.log(result);*!/
        let disc = result[0];
        console.log(`Artist: ${disc.artists[0].name}`); //Band Name
        console.log(`Song Title: ${disc.name}`); //Song Name
        console.log(`Preview Link: ${disc.preview_url}`); //Preview URL
        console.log(`Album Title: ${disc.album.name}`); //Album Title
    });*/

} else if (command === `movie-this`) {
    queryOMDB();
/*    let movieTitle = parameter.join("+");
    if (movieTitle.length === 0) {
        movieTitle = "Mr.+Nobody";
    }
    //console.log(movieTitle);

    let queryURL = `http://www.omdbapi.com/?t=${movieTitle}&y=&plot=short&apikey=trilogy`;

    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(JSON.parse(body));
            console.log(`Title: ${JSON.parse(body).Title}`);
            console.log(`Year Released: ${JSON.parse(body).Year}`);
            console.log(`IMDB Rating: ${JSON.parse(body).Ratings[0].Value}`);
            console.log(`Rotten Tomatoes Rating; ${JSON.parse(body).Ratings[1].Value}`);
            console.log(`Country: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            console.log(`Actors: ${JSON.parse(body).Actors}`);
        }
    });*/

} else if (command === `do-what-it-says`) {
    queryRandom();
/*    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        //console.log(data);
        var randomArray = data.split(",");
        console.log(randomArray);
        command = randomArray[0];
        console.log(command);
        parameter = randomArray[1];
        console.log(parameter);
    })*/
}

// Functions ===========================================================================================================
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
                console.log(`=======================================`);
                console.log(`Venue Name: ${results[k].venue.name}`);
                console.log(`Venue Location: ${results[k].venue.city}, ${results[k].venue.country}`);
                console.log(`Date: ${moment(results[k].datetime).format("MM/DD/YYYY")}`);
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
        console.log(`Artist: ${disc.artists[0].name}`); //Band Name
        console.log(`Song Title: ${disc.name}`); //Song Name
        console.log(`Preview Link: ${disc.preview_url}`); //Preview URL
        console.log(`Album Title: ${disc.album.name}`); //Album Title
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
            //console.log(JSON.parse(body));
            console.log(`Title: ${JSON.parse(body).Title}`);
            console.log(`Year Released: ${JSON.parse(body).Year}`);
            console.log(`IMDB Rating: ${JSON.parse(body).Ratings[0].Value}`);
            console.log(`Rotten Tomatoes Rating; ${JSON.parse(body).Ratings[1].Value}`);
            console.log(`Country: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            console.log(`Actors: ${JSON.parse(body).Actors}`);
        }
    });
}
// =====================================================================================================================
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

    })
}


