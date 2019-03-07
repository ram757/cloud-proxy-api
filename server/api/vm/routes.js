const express = require('express');
const router = express.Router();

const msRestManager = require('../../utilities/msRest');

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

    computeClient.virtualMachines.listAll((err, result) => {
        if(err) {
            console.log(err);
            res.status(500);
            res.send("There was an error processing request");
        } else {
            const counts = {
                azure: result.length,
                aws: 0,
                total: result.length
            };
            res.json(counts);
        }
    });
});
module.exports = router;