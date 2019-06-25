function TestModule(name){
  this.name = name
  this.printInfo = function(){
    console.log('i am module with name ' + this.name)
  }
}

function test(name){
  let actualName = name ? name : 'default'
  return new TestModule(actualName)
}

module.exports = test