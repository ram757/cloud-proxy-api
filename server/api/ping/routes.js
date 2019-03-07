const express = require('express');
const router = express.Router();

const ping = require('./logic/ping');

// const Azure = require('azure');
const ComputeManagementClient = require('azure-arm-compute');
const StorageManagementClient = require('azure-arm-storage');
const AzureRest = require('ms-rest-azure');

const msRestManager = require('../../utilities/msRest');

/* GET - /
    Ping endpoint to determine if service is running and if 
        database connection can be established.
*/
router.get('/', function(req, res, next) {
  ping.buildPingResponseData().then(function (pingResponseData) {
    console.log(process.env.PORT);
    console.log(process.env.AZURE_USER);
    res.send(pingResponseData);
  }).catch(function (error) {

    //ADD LOGGER
    console.log("ERROR | ROUTER - GET - / : " + error.message);

    res.status(error.status);
    res.json(error);
  })
});

router.get('/azure', function(req, res, next) {
  const clientId = process.env.AZURE_CLIENT_ID || null;
  const secret = process.env.AZURE_SECRET || null;
  const domain = process.env.AZURE_TENANT || null;
  const subscription = process.env.AZURE_SUBSCRIPTION || null;

  if(Object.keys(msRestManager.getAzureCredentials()).length === 0) {
      AzureRest.loginWithServicePrincipalSecret(clientId, secret, domain, function(err, credentials) {
          if (err) {
              console.log(err);
              throw err;
          }

          console.log(credentials);
          msRestManager.setAzureCredentials(credentials);

          const computeClient = new ComputeManagementClient(credentials, subscription);
          const storageClient = new StorageManagementClient(credentials, subscription);

          msRestManager.setAzureCompute(computeClient);
          msRestManager.setAzureStorage(storageClient);


          res.send("Successful connection to Azure.");
      });
  } else {
    res.send("Connection to Azure is stable.");
  }

});

module.exports = router;