const path = require('path')
const MNode = require('../lib/mnode')

const app = new MNode()

app.set(MNode.configs.STATIC_PATH, path.resolve(path.dirname('')) + '/views')

app.middleware(MNode.parseUrl);

app.middleware(MNode.staticServer);

app.get('/test', (req, res) => {
    res.end(JSON.stringify(req.pathname))
});

app.post('/', (req, res) => {res.end('data has been posted correctly ')})

app.start(8081, () => { console.log('server at 8081')})