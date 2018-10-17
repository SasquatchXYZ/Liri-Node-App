require("dotenv").config();


let fs = require("fs");
let request = require("request");
let moment = require("moment");
let keys = require("./keys");
let Spotify = require("node-spotify-api");

let spotify = new Spotify(keys.spotify);
console.log(spotify);

const [, , command, parameter] = process.argv;
console.log(command, parameter);


