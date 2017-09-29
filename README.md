# CallReduce

Iterate through a sequence of methods, firing each method explicitly in turn with a `next` callback.

Useful for asynchronous pipes or middleware.

## Installation

`npm install call-reduce --save` or `yarn add call-reduce`

## Basic Usage

```javascript
const callReduce = require('call-reduce')
const stack = callReduce(
    (x, next) => next(x + ' world!'),
    (y, next) => {
        console.log(y) // hello world!
    },
    z => {
        throw new Error("We shouldn't get here since `next` is never called at step 2")
    }
)
stack('hello')
```


## Advanced Asynchronous Example

Imagine your Node application has some request middleware that looks up a user from the DB and determines if they have permissions to access that route, or whether they should be rejected.

While a bit more advanced, you could also pipe the `req` and `res` through a whole series of asynchronous operations easily using this pattern, composing each as a stand-alone method

```javascript
const { createServer } = require('http')
const callReduce = require('call-reduce')
const auth = callReduce(
    (req, res, next) => {
        User.findOne({_id: req.params.user}, (err, user) => {
            if (user.canAccess(req)) {
                next(req, res)
            } else {
                res.statusCode = 403
                res.end('Forbidden')
            }
        })
    },
    (req, res) => {
        res.end('Yay! You made it')
    }
)

createServer(auth).listen(8000)
```