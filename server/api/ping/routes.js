const express = require('express');
const router = express.Router();

const ping = require('./logic/ping');


// const Azure = require('azure');
const ComputeManagementClient = require('azure-arm-compute');
const StorageManagementClient = require('azure-arm-storage');
const AzureRest = require('ms-rest-azure');

const msRestManager = require('../../utilities/msRest');

const azure_sdk = require('azure');
const AWS = require('aws-sdk');


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
    const clientId = process.env.AZURE_CLIENT_ID || null;
    const secret = process.env.AZURE_SECRET || null;
    const domain = process.env.AZURE_TENANT || null;
    const subscription = process.env.AZURE_SUBSCRIPTION || null;

    if (Object.keys(msRestManager.getAzureCredentials()).length === 0) {
        AzureRest.loginWithServicePrincipalSecret(clientId, secret, domain, function (err, credentials) {
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

router.get('/aws', function(req, res, next) {

  AWS.config.credentials = new AWS.Credentials(process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_ACCESS_KEY, null);
  AWS.config.update({region: 'us-east-2'});

  // Create EC2 service object
  var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
  const params = {
    DryRun: false
  };

  ec2.describeRegions(params, function(err, data) {
    if (err) {
      console.log("Error", err.stack);
    } else {

      const regions = data.Regions;
      const promises = [];

      regions.forEach(region => {

        promises.push(new Promise((resolve, reject) => {
          const regionName = region.RegionName;

          AWS.config.update({region: regionName});
          const eccc2 = new AWS.EC2({apiVersion: '2016-11-15'});

          eccc2.describeInstances(params, function (err, instances) {
            const allInstances = [];

            if (err) {
              console.log("`Error", err.stack);
            } else {
              const reservations = instances.Reservations;
              reservations.forEach(reservation => {
                reservation.Instances.forEach(ins => allInstances.push(ins));
              });
            }
            resolve(allInstances);
          });
        }));
      });

      Promise.all(promises).then(results => {
        console.info("Promises complete");
        const ins = [];
        results.forEach(r => {
          r.forEach(bb => ins.push(bb));
        });
        res.json(ins);
      });
    }
    })
});
module.exports = router;