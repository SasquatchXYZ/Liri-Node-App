# LIRI-Node-App

##### Homework Assignment 10 - Node.js

LIRI is somewhat akin to SIRI; however, while SIRI is a "Speech Interpretation and Recognition Interface", LIRI is a "Language Interpretation and Recognition Interface".  LIRI is a command line node application that is used to provide you with data given certain parameters and requests.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

In order to install and run LIRI you will need Node.js as well as Spotify API keys which you will provide through your own .env file.  Links to both Node.js and Spotify can be found below.

```
node.js
Spotify API Keys
```

### Installing

You will need to do the following steps after cloning the repo to your device in order to ensure that it works properly.

To ensure Node.js is running within the package and configure all modules for use:

```
npm install
```

To install dotenv module:

```
npm install dotenv
```

Then create your own .env file in which to store your Spotify Keys, the file should look just like this:

```
SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret
```

## Running LIRI

LIRI is run from the command line via:

```
node liri.js
```

And is able to accept the following commands:

```
concert-this <artist/band name here>
```

In doing so, LIRI will query BandsinTown for upcoming concerts by the artist and display the venue, location, and date of the performance.

```
spotify-this-song <song name here>
```

This prompts LIRI to query the Spotify API for the song name, where it will then display the artist, song name, preview link (if available), and the album for the song.

```
movie-this <movie title here>
```

This will query the OMDB API for the movie title, year of release, ratings, country, language, plot, and actors in the movie.  (If no movie is entered, it will display the information for 'Mr. Nobody").

```
do-what-it-says
```

This will cause LIRI to read from the 'random.txt' file included in the repo and then she will perform one of the commands based on the data included in that file.

Additionally, the search parameters, along with the corresponding data returned from the APIs is written to the 'log.txt' file.

## Built With

* [Node.js](https://nodejs.org/en/) - Runtime Environment
* [Spotify API](https://developer.spotify.com/documentation/web-api/) - API
* [BandsinTown API](http://www.artists.bandsintown.com/bandsintown-api) - API
* [OMDB API](http://www.omdbapi.com/) - API
* [WebStorm](https://www.jetbrains.com/webstorm/) - IDE

## Authors

* **Dalton Ricker** - *Primary Author* - [SasquatchXYZ](https://github.com/SasquatchXYZ)

## Acknowledgments
* Many thanks to my instructors & TAs, as well as the O'Reilly reference books.