const express = require('express');
const router = express.Router({mergeParams: true});

const vmRoutes = require('./vm').routes;

/****** ROUTES ********/
router.use('/vm', vmRoutes);
/********************/

module.exports = router;