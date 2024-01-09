// https://github.com/spotify/web-api-examples
// https://github.com/axios/axios/issues/891
const axios = require('axios');
const auth = require('./auth');


// https://open.spotify.com/artist/7n2Ycct7Beij7Dj7meI4X0?si=ivNxUWvsQliFLNmiuU2I-g
async function getArtist(token, id) {
    const config = { headers: { 'Authorization': `Bearer ${token}` } }
    return await axios.get(`https://api.spotify.com/v1/artists/${id}`, config);
}


async function getArtistBio(token, id) {
    // const response = await auth.getClientCredToken();
    const artist = await getArtist(token, id);
    const { name, genres, followers, popularity } = artist.data;
    return `${name} is a ${genres[0]} artist with ${followers.total} followers and ${popularity} popularity`;
}

// tried paging with the provided 'next' url, and that didn't work (one page works, then the next page is empty or doesn't have as many as it should)
// then tried paging manually (thats the version it is now), and got same results. setting this aside for now
async function getArtistAlbums(token, id) {
    const limit = 20;
    const offset = 0;
    const include_groups = 'album,single';
    const albums = [];

    let config = {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { include_groups: include_groups, limit: limit, offset: offset }
    }
    let response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, config);
    const total = response.data.total;
    console.log(total);
    console.log(response);

    for (let album of response.data.items) { albums.push(album) }
    console.log(`${offset}:${limit}/${response.data.total}, pushed ${response.data.items.length} albums`);

    for (let i = 1; i < total / limit; i++) {
        let newOffset = limit * i;
        config = {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { include_groups: include_groups, limit: limit, offset: newOffset }
        }
        response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, config);
        for (let album of response.data.items) { albums.push(album) }
        console.log(`${newOffset}:${limit}/${response.data.total}, pushed ${response.data.items.length} albums`);
        console.log(response);
        // try a parallel version where you add a .then() to the response telling it to push onto albums when it's done. no await...how to wait for the final one though?
        // i guess you can iterate up to but don't include the final page in your for loop, don't use awaits, then do the final page with an await
        // that should stop the getArtistAlbums promise from settling until the last page is done
        // wait but that makes no sense, you don't know that the last page will take the longest
        // so i guess you need to do something like add all the promises to an array and check that they're all settled before moving on. can explore more
        // response.then(res => {
        //     for (let album of res.data.items) { albums.push(album) }
        //     console.log(`${newOffset}:${limit}, pushed ${response.data.items.length} albums`);
        // });
    }


    return albums;
}

async function main() {
    let response = await auth.getClientCredToken();
    const token = response.data.access_token;
    // const artistID = '7n2Ycct7Beij7Dj7meI4X0'; // twice
    const artistID = '0ghlgldX5Dd6720Q3qFyQB'; // txt

    const artistBio = await getArtistBio(token, artistID);
    console.log(artistBio);

    // leaving this for now since paging through album results seems bugged (or i'm missing something)
    // const albums = await getArtistAlbums(token, artistID);
    // console.log(albums.length, albums.map(album => album.name));






}

main();