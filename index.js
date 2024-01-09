// https://github.com/spotify/web-api-examples
// https://github.com/axios/axios/issues/891
const axios = require('axios');

const client_id = '2bded1453076459eb50c4fc7e976bd52';
const client_secret = '05efbe572cb34e06880e61d70b2d56e0';

async function getToken() {
    const config = {
        // method: 'post',
        // url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        params: {
            'grant_type': 'client_credentials'
        }
    }
    return await axios.post('https://accounts.spotify.com/api/token', undefined, config);
}

// https://open.spotify.com/artist/7n2Ycct7Beij7Dj7meI4X0?si=ivNxUWvsQliFLNmiuU2I-g
async function getArtist(token, id) {
    const config = { headers: { 'Authorization': 'Bearer ' + token } }
    return await axios.get(`https://api.spotify.com/v1/artists/${id}`, config);
}


getToken()
    .then(response => {
        return getArtist(response.data.access_token, '7n2Ycct7Beij7Dj7meI4X0?si=ivNxUWvsQliFLNmiuU2I-g');
    })
    .then(artist => {
        console.log(artist.data.name);
    })