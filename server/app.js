const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//MIDDLEWARE FUNCTIONS
const middleware = require('./interceptors/interceptors');

//ROUTES
const { routes } = require('./api');

//PING ROUTE
const pingRouter = require('./api/ping').routes;

module.exports = () => {
    const app = express();
    
    //ENCODERS/PARSERS
    app.use(logger('[:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] | [Remote ~ {Address= ":remote-addr"} {User= ":remote-user"} {Referer= ":referrer"} {Agent= ":user-agent"}]'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    // PING ROUTE
    app.use('/ping', pingRouter);

    //CORS HANDLING
    app.use(middleware.corsInterceptor);

    // API ROUTES
    app.use('/api', routes);

    //NOT FOUND HANDLING
    app.use(middleware.notFoundInterceptor);

    //ON ERROR HANDLING
    app.use(middleware.errorCatchInterceptor);

    return app;
}

