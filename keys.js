console.log('this is loaded');

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.omdbAPIKey = process.env.OMDB_KEY;

exports.bandsAPIkey = process.env.BANDS_KEY;