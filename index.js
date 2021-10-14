const title = 'MySpotify';
const port = process.env.PORT || 3000;

const express = require('express');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//****************************************************************************************************************
// setup spotify api
const spotifyWebApi = require('spotify-web-api-node');

// Create a new spotifyWebApi object
const spotifyApi = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


//****************************************************************************************************************
// start the server
app.listen(port, () => console.log(`Server listening to localhost:${port}`));


//****************************************************************************************************************
app.get('/', (req, res) => {
    res.render('pages/index', { title: title });
});


app.get('/artist-search', (req, res) => {

    spotifyApi.clientCredentialsGrant()
        .then(data => spotifyApi.setAccessToken(data.body['access_token']))
        .catch(error => console.log('Something went wrong when retrieving an access token', error));

    spotifyApi
        .searchArtists(req.query.artist, {}) //{ limit: 10, offset: 0 }
        .then(data => {

            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

            // res.send(data.body);
            res.render('pages/artist-search-results', { title: title, artists: data.body.artists });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/albums/:artistId', (req, res, next) => {

    spotifyApi.clientCredentialsGrant()
        .then(data => spotifyApi.setAccessToken(data.body['access_token']))
        .catch(error => console.log('Something went wrong when retrieving an access token', error));


    spotifyApi
        .getArtistAlbums(req.params.artistId, {}) //{ limit: 10, offset: 0 }
        .then(data => {

            // console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

            // res.send(data.body);
            res.render('pages/album-search-results', { title: title, albums: data.body });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/album-tracks/:albumId', (req, res, next) => {

    spotifyApi.clientCredentialsGrant()
        .then(data => spotifyApi.setAccessToken(data.body['access_token']))
        .catch(error => console.log('Something went wrong when retrieving an access token', error));

    spotifyApi
        .getAlbumTracks(req.params.albumId, { limit: 50, offset: 0 })
        .then(data => {

            // console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

            // res.send(data.body);
            res.render('pages/album-tracks', { title: title, tracks: data.body });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});



//****************************************************************************************************************
app.get('/new-get', (req, res) => {
    console.log(req.query);
    res.send(`got from the form: ${req.query}`);
})

app.post('/new-post', (req, res) => {
    console.log(req.body);
    res.redirect('/');
})


//****************************************************************************************************************
app.use((req, res, next) => {
    return res.status(404).render('pages/err404.ejs', { title: title, url: req.url })
});
