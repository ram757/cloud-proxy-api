module.exports.corsInterceptor = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With'); //Add other headers used in your requests

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
}

module.exports.notFoundInterceptor = function (req, res, next) {
    res.status(404);
    res.json(
        {
            url: req.protocol + "://" + req.get('host') + req.originalUrl,
            message: "ERROR (NOT FOUND): '" + req.originalUrl + "' route does not exist."
        }
    )
}

module.exports.errorCatchInterceptor = function (err, req, res, next) {
    console.error("ERROR (Internal Server Error): \n" + err.stack);

    res.status(500);
    res.send({message: "ERROR (Internal Server Error): There was an issue processing the request.  Ensure that the request is well formatted and try again."})
}