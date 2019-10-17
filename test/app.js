const path = require('path')
const MNode = require('../lib/mnode')

const app = new MNode()


app.get('/test', (req, res) => {
    res.end('test')
});

app.post('/', (req, res) => {res.end('data has been received correctly')})

console.log(app.stack)

app.start(8081, () => { console.log('server at 8081')})