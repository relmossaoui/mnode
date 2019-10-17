const fs = require('fs')
const configs = require('../configs')

module.exports = function(req, res, next) {
    if (req.pathname.match(/[a-zA-Z_0-9]+\.[a-zA-Z_0-9]+/)) {
        // res.setHeader('Content-Type', 'text/plain');
        staticFilePath = this.app.configs[configs.STATIC_PATH][0];

        fileStream = fs.createReadStream(`${staticFilePath}${req.pathname}`);

        fileStream.pipe(res);

    } else {
        next(req, res)
    }
}