function Person(name, age){
  this.name = name
  this.age = age
  this.ageMe = function(){
    this.age++
    console.log(this.name + ' is now age ' + this.age)
  }
  this.printMe = function(){
    console.log('i have stolen the real function. can you find it?')
  }
  this.oldPrint = function(){
    Person.prototype.printMe.apply(this, [])
  }
}

let p1 = new Person('jane', 33)
let p2 = new Person('jim', 44)

console.log(p1.name)
console.log(p2.name)

function f(x){
  return x * 2
}

console.log(f(2))
p1.ageMe()

let f1 = p1.ageMe
f1()

f1.apply(p2, [])

Person.prototype.printMe = function(){
  console.log(this.name + ' ' + this.age)
}

p1.printMe()
p1.oldPrint()

console.log(p1 instanceof Person)
console.log(p1 instanceof f1)

