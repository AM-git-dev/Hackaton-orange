import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authorization = process.env.AUTH_TOKEN;

const phoneNumb = "+33699901032"

// Step 1: Authentication
export async function authenticate() {
    try {
        const response = await axios.post('https://api.orange.com/oauth/v3/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${clientID}:${clientSecret}`).toString('base64'),
                    // 'Authorization': 'Basic ' + `${authorization}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Authentication error:', error.response?.data || error.message);
        throw error;
    }
}

// Step 2: Retrieve Device Location
export async function getDeviceLocation(accessToken) {
    try {
        const response = await axios.post(
            'https://api.orange.com/camara/location-retrieval/orange-lab/v0/retrieve',
            {
                device: {
                    "phoneNumber": phoneNumb
                },
                // maxAge: 60 //-> ne pas mettre si num tel offline (erreur 422)
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Cache-Control': 'no-cache',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error retrieving location controller:', error.response?.data || error.message);
        throw error;
    }
}

// Usage
(async () => {
    const accessToken = await authenticate();

//appel de la fonction getDeviceLocation
    await getDeviceLocation(accessToken);
    // console.log('Informations envoyées:', infoArea); // créer un: const InfoArea = await getDeviceLocation(accessToken);
})();