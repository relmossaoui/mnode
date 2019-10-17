const url = require('url');

module.exports = function parseUrl(req, res, next) {
    let jsonUrl = url.parse(req.url, true);

    req.query = jsonUrl.query;
    req.pathname = jsonUrl.pathname;
    req.path = jsonUrl.path;

    next(req, res);
}