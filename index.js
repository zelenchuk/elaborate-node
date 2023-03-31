require('dotenv').config();

const base64 = require('base64-js');
const fs = require('fs');
const {RSA_NO_PADDING, publicEncrypt} = require('crypto');
const axios = require('axios');

const apiUrl = process.env.API_URL;
const tokenForElaborate = process.env.TOKEN_FOR_ELABORATE;

function encrypt(str) {
    const publicKey = fs.readFileSync('your_production.pem');
    const buffer = Buffer.from(str, 'utf-8');
    const encrypted = publicEncrypt({key: publicKey, padding: RSA_NO_PADDING}, buffer);
    return base64.fromByteArray(encrypted);
}

function createIframeUrl(labUrl, rawToken) {
    /* Generate iframe secure link */
    const stringifiedToken = JSON.stringify(rawToken);
    const finalToken = encrypt(stringifiedToken);
    return labUrl + `?token=${finalToken}`;
}

async function getAllPatientResults(patientId) {
    /* Getting all results in list */
    try {
        const headers = {'Authorization': `Bearer ${tokenForElaborate}`};
        const response = await axios.get(`${apiUrl}/lab-results/by-patient/urls/${patientId}`, {headers});

        return response.data.results;
    } catch (error) {
        console.log("We have an errors!");
    }
}

async function getPatientReportByUrl() {
    const rawToken = {
        "api_token": tokenForElaborate,
        "patient_id": '15',
        "exp": "2025-01-01T19:25:32.578Z",  // you can modify this date as you wish
    };

    const labUrl = "https://app.elaborate.com/e/labs/2023-02-07/455/";

    const completeIframeUrl = createIframeUrl(labUrl, rawToken);

    console.log(completeIframeUrl);
}

(async () => {
    const allResults = await getPatientReportByUrl('15');
})();