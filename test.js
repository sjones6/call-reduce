const assert = require("assert")
const makeCallReduce = require("./call-reduce")


describe("call-reduce", function() {

    it("should call the subsequent method when calling next", () => {
        makeCallReduce(
            (a, next) => {
                assert.equal(a, 'a')
                next('b')
            },
            (b, next) => {
                assert.equal(b, 'b')
                next('c')
            },
            (c, next) => {
                assert.equal(c, 'c')
                assert.equal(next, undefined)
            }
        )('a')
    })

    it("should not call a method unless explicitly called with next", () => {
        makeCallReduce(
            (a, next) => {
                assert.equal(a, 'a')
            },
            b => {
                throw new Error("This method should not have been called")
            }
        )('a')
    })

    it("should allow for asynchronous code", () => {
        makeCallReduce(
            (a, next) => {
                assert.equal(a, 'a')
                setTimeout(() => next('b'), 500)
            },
            b => {
                assert.equal(b, 'b')
            }
        )('a')
    })

    it("should allow for variable parameter counts through the stack of methods", () => {
        makeCallReduce(
            (a, next) => next(a, 'b'),
            (a, b, next) => next(a, b, 'c'),
            (a, b, c) => {
                assert.equal(a, 'a')
                assert.equal(b, 'b')
                assert.equal(c, 'c')
            }
        )('a')
    })

})