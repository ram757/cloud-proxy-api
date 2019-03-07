const express = require('express');
const router = express.Router();

const msRestManager = require('../../utilities/msRest');

const AWS = require('aws-sdk');
router.get('/all', function(req, res, next) {
    const computeClient = msRestManager.getAzureCompute();

    computeClient.virtualMachines.listAll((err, result) => {
        if(err) {
            console.log(err);
            res.status(500);
            res.send("There was an error processing request");
        } else {
            res.json(result);
        }
    });
});

router.get('/count', function(req, res, next) {
    const computeClient = msRestManager.getAzureCompute();

    const counts = {vmCounts: {},
    apiCalls: {}};
    computeClient.virtualMachines.listAll((err, result) => {
        if(err) {
            console.log(err);
            res.status(500);
            res.send("There was an error processing request");
        } else {
            counts.vmCounts.azure = result.length;
            counts.apiCalls.azure = 1;
            // res.json(counts);
            ///AWS
            AWS.config.credentials = new AWS.Credentials(process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_ACCESS_KEY, null);
            AWS.config.update({region: 'us-east-2'});

            // Create EC2 service object
            var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
            const params = {
                DryRun: false
            };

            var apiCount = 0;
            ec2.describeRegions(params, function(err, data) {
                if (err) {
                    console.log("Error", err.stack);
                } else {

                    const regions = data.Regions;
                    const promises = [];
                    apiCount = apiCount + regions.length;
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

                        counts.vmCounts.aws= ins.length;
                        counts.vmCounts.total = counts.vmCounts.aws + counts.vmCounts.azure;
                        counts.apiCalls.aws = apiCount;

                        // counts.aws = ins.length;
                        // counts.total = counts.aws + counts.azure;
                        res.json(counts);
                        // res.json(ins);
                    });
                }
            })
        }
    });
});
module.exports = router;