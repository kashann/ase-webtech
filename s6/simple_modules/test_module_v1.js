function TestModule(name){
  this.name = name
  this.printInfo = function(){
    console.log('i am module with name ' + this.name)
  }
}

module.exports.Test = TestModule