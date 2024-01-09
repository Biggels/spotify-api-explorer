const axios = require('axios');
require('dotenv').config(); // loads values from the .env file into process.env

const clientID = process.env.CLIENT_ID; // we then load the secret from that .env file, and ignore it in our .gitignore file, so it doesn't get pushed
const clientSecret = process.env.CLIENT_SECRET;

async function getClientCredToken() {
    const config = {
        // method: 'post',
        // url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(clientID + ':' + clientSecret).toString('base64'))
        },
        params: {
            'grant_type': 'client_credentials'
        }
    }
    return await axios.post('https://accounts.spotify.com/api/token', undefined, config);
}

module.exports = {
    getClientCredToken
}