const { createServer } = require('http')
const callReduce = require('./call-reduce')
const auth = callReduce(
    (req, res, next) => { 
        if ((Date.now() % 2) === 0) {
            next(req, res)
        } else {
            res.statusCode = 404;
            res.end("Forbidden")
        }
    },
    (req, res) => {
        res.end('Yay! You made it')
    }
)

createServer(auth).listen(9030)