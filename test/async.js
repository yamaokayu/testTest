const assert = require('assert')

describe('AsyncTest', function() {
  it ('WithCallback', function(done) {
    const targetFunc = cb=>{cb()}
    targetFunc(done)
  })
  it ('WithPromise', function() {
    return new Promise(r=>r('OK'))
  })

  it ('A lot more test With chai-promised etc')
})