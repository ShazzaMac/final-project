// Exporting middleware functions to be used in app.js and scheduleroutes.js


exports.firstMiddleware = (req, res, next) => {
    console.log('First Middleware');
    next();
};
exports.secondMiddleware = (req, res, next) => {
    console.log('Second Middleware');
    next(); 
}

exports.isAuth = (req, res, next) => {
    const { isloggedin } = req.session; 

    if (!isloggedin) {
        console.log(`isAuth : current route = ${req.originalUrl}`);
        req.session.route = req.originalUrl;
        return res.redirect('/login');
    }
    next();
};


