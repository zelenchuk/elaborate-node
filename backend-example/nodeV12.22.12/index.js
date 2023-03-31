// works with Node Js v12.22.12

require('dotenv').config();  // load .env variables (make sure you have .env file in the same directory

const fs = require('fs');
const NodeRSA = require('node-rsa');

// Insert your data here
const TOKEN_FOR_ELABORATE = process.env.TOKEN_FOR_ELABORATE;  // from .env file
const YOUR_TEST_ELABORATE_PATIENT_ID = 15;
const YOUR_TEST_ELABORATE_DOCTOR_ID = 455;
const YOUR_TEST_ELABORATE_REPORT_DATE = '2023-02-07';
const LAB_URL = `https://app.elaborate.com/e/labs/${YOUR_TEST_ELABORATE_REPORT_DATE}/${YOUR_TEST_ELABORATE_DOCTOR_ID}/`;
const PATH_TO_YOUR_PRODUCTION_PEM = '../your_production.pem';
const REPORT_EXPIRATION_DATE = "2035-01-01T19:25:32.578Z";  // you can modify this date as you wish


const encryptData = (path, secureToken) => {
    try {
        const key = new NodeRSA({b: 512});
        const options = {encoding: 'utf8', flag: 'r'};
        const keyData = fs.readFileSync(path, options);
        return key.importKey(keyData).encrypt(secureToken, ['base64']);
    } catch (e) {
        console.log('Error: ', e.stack);
        console.log('Error: ', e.message);
    }
}

const createRawToken = (patientId, expDate) =>
    // Object for request, need be a string
    JSON.stringify({
        api_token: TOKEN_FOR_ELABORATE,
        patient_id: patientId,
        exp: expDate,
    });

const secureToken = createRawToken(YOUR_TEST_ELABORATE_PATIENT_ID, REPORT_EXPIRATION_DATE);
const encryptedData = encryptData(PATH_TO_YOUR_PRODUCTION_PEM, secureToken)  // encrypt data
const secureIframeURL = `${LAB_URL}?token=${encryptedData}`;

console.log(secureIframeURL);