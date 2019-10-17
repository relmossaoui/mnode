

module.exports = class Layer {
    constructor({pathname = null, handlers = null, method = null, app}) {
        this.pathname = pathname;
        this.handlers = handlers;
        this.method = method;
        this.app = app
    }
}