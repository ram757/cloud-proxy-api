const express = require('express');
const router = express.Router();

const ping = require('./logic/ping');

const azure_sdk = require('azure');

/* GET - /
    Ping endpoint to determine if service is running and if 
        database connection can be established.
*/
router.get('/', function(req, res, next) {
  ping.buildPingResponseData().then(function (pingResponseData) {
    res.send(pingResponseData);
  }).catch(function (error) {

    //ADD LOGGER
    console.log("ERROR | ROUTER - GET - / : " + error.message);

    res.status(error.status);
    res.json(error);
  })
});

router.get('/azure', function(req, res, next) {
  azure_sdk.

    // ping.buildPingResponseData().then(function (pingResponseData) {
    //     res.send(pingResponseData);
    // }).catch(function (error) {
    //
    //     //ADD LOGGER
    //     console.log("ERROR | ROUTER - GET - / : " + error.message);
    //
    //     res.status(error.status);
    //     res.json(error);
    // })
});

module.exports = router;