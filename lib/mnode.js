const http = require('http')
const Layer = require('./src/layer')
const parseUrl = require('./middlewares/urlParser')
const staticServer = require('./middlewares/staticServer')
const configs = require('./configs')

class MNode {

    constructor() {
        // contains all app config
        this.configs = {...configs.configs}

        // contains all middleware's layers
        this.stack = [];

        http.METHODS.forEach( item => {
            let method = item.toLowerCase();

            this[method] = function(pathname, handlers) {
                this.setVerbMethod({ pathname, handlers, method })
            }
        })
    }

    setVerbMethod(params) {
        let layer = new Layer(params);

        this.stack.push(layer);
    }

    middleware(pathname, handlers) {
        if (typeof pathname !== 'string' && 
            typeof handlers !== 'function' &&
            typeof pathname !== 'function'
            ) {
            throw Error('middleware params must contain at least a handlers')
        }
        let layer;

        if (typeof pathname !== 'string') {
            handlers = pathname;

            layer = new Layer({ handlers, app: this });
        } else {
            layer = new Layer({ handlers, pathname, app: this });
        }

        this.stack.push(layer);
    }

    onRequest(req, res) {
        req.nextLayer = 0;

        this.nextLayer(req, res)
    }

    nextLayer(req, res) {
        // if no static page found then return not found page 
        if (req.nextLayer === this.stack.length) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('page not found');

            return;
        }

        // get the current layer
        let currentLayer = this.stack[req.nextLayer]
        req.nextLayer = req.nextLayer + 1;

        // check if current layer is a middleware
        if (!currentLayer.method) {
            currentLayer.handlers(req, res, this.nextLayer.bind(this))
            return;
        }

        if (req.method.toLowerCase() === currentLayer.method &&
            require('url').parse(req.url).pathname === currentLayer.pathname
        ) 
        {
            currentLayer.handlers(req, res);
            return;
        }

        this.nextLayer(req, res)
    }

    start(port, callback) {
        let server = http.createServer(this.onRequest.bind(this))

        return server.listen(port, callback);
    }

    set(key, value) {
        this.configs[key].push(value)
    }

    get(key) {
        return this.configs[key];
    }
}

module.exports = MNode;

module.exports.parseUrl = parseUrl;
module.exports.staticServer = staticServer;
module.exports.configs = { STATIC_PATH: configs.STATIC_PATH }