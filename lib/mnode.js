const http = require('http')
const Layer = require('./src/layer')

class MNode {
    constructor() {
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

        if (
            req.method.toLowerCase() === currentLayer.method &&
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
}

module.exports = MNode;