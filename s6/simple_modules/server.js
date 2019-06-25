const test_v1 = require('./test_module_v1')
const test_v2 = require('./test_module_v2')

const test1 = new test_v1.Test('simple module')
test1.printInfo()

const test2 = test_v2()
test2.printInfo()