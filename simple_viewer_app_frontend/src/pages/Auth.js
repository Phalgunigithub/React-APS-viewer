import axios from 'axios';

async function getAccessToken(callback) {
    try {
        const resp = await axios.get('/api/auth/token');
        const { access_token, expires_in } = resp.data;
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);
    }
}

const Client={ getAccessToken };
export default Client;