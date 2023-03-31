// works with Node Js v19.5.0

require('dotenv').config();  // load .env variables (make sure you have .env file in the same directory

const fs = require('node:fs');
const base64 = require('base64-js');
const axios = require('axios');
const {RSA_NO_PADDING, publicEncrypt} = require('crypto');

const API_URL = process.env.API_URL;
const TOKEN_FOR_ELABORATE = process.env.TOKEN_FOR_ELABORATE;
const PATH_TO_YOUR_PRODUCTION_PEM = '../your_production.pem';
const YOUR_TEST_ELABORATE_PATIENT_ID = 15;
const YOUR_TEST_ELABORATE_DOCTOR_ID = 455;
const YOUR_TEST_ELABORATE_REPORT_DATE = '2023-02-07';
const LAB_URL = `https://app.elaborate.com/e/labs/${YOUR_TEST_ELABORATE_REPORT_DATE}/${YOUR_TEST_ELABORATE_DOCTOR_ID}/`;
const REPORT_EXPIRATION_DATE = "2035-01-01T19:25:32.578Z";  // you can modify this date as you wish

const encrypt = (str) => {
    /*
    * (1) Use public key to encrypt the token
    * (2) Convert the encrypted token to base64
    * (3) Return the base64 string
    * */
    const publicKey = fs.readFileSync(PATH_TO_YOUR_PRODUCTION_PEM);
    const buffer = Buffer.from(str, 'utf-8');
    const encrypted = publicEncrypt({key: publicKey, padding: RSA_NO_PADDING}, buffer);
    return base64.fromByteArray(encrypted);
}

const createIframeUrl = (labUrl, rawToken) => {
    /*
    * (1) Convert the raw token to string
    * (2) Encrypt the stringified token
    * (3) Return the complete iframe url
    * */
    const stringifiedToken = JSON.stringify(rawToken);
    const finalToken = encrypt(stringifiedToken);
    return labUrl + `?token=${finalToken}`;
}

const getAllPatientResults = async patientId => {
    /* Getting all results in list */
    try {
        const headers = {'Authorization': `Bearer ${TOKEN_FOR_ELABORATE}`};
        const response = await axios.get(`${API_URL}/lab-results/by-patient/urls/${patientId}`, {headers});

        return response.data.results;
    } catch (error) {
        console.log("We have an errors!");
    }
}

const getPatientReportByUrl = async (patientID, expDate) => {
    const rawToken = {
        "api_token": TOKEN_FOR_ELABORATE,
        "patient_id": patientID,
        "exp": expDate,
    };

    return createIframeUrl(LAB_URL, rawToken);
}

(async () => {
    const allResults = await getAllPatientResults(YOUR_TEST_ELABORATE_PATIENT_ID);
    const iframeURL = await getPatientReportByUrl(YOUR_TEST_ELABORATE_PATIENT_ID, REPORT_EXPIRATION_DATE);

    console.log(allResults);  // show all results in console
    console.log(`----------- 👆 All patient results 👆 --------------`);
    console.log(`----------------------------------------------------`);
    console.log(`---------- 👇 Click to the link 👇 -----------------`);
    console.log(iframeURL);
})();




