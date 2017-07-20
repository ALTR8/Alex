var express         = require('express')
,   config          = require('config')
,   path            = require('path')
,   favicon         = require('serve-favicon')
,   logger          = require('morgan')
,   cookieParser    = require('cookie-parser')
,   bodyParser      = require('body-parser')
,   _               = require('lodash')
//  APP SPECS
,   nunjs           = require('./libs/nunjucks')
,   router          = require('./routes')
,   dev_routes      = require('./routes/dev.js')
,   app             = express()
;

// view engine setup
app.set('views', path.join(__dirname, config.Views.dir));
app.set('view engine', config.Views.ext); // .nunjs

nunjs(app); // init

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  Quick middleware things
app.use(function(req, res, next) {

    //  Attach env
    req.env = app.get('env');
    res.locals = _.extend({
        env: app.get('env')
    }, config.ViewLocals || {});

    next();
});

//  Attach routers.

app.use(router);

if(app.get('env') === 'development') {
    app.use(dev_routes);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if(app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
