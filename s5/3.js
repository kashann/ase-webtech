function Animal(name){
  this.name = name
  this.move = function(){
    console.log(this.name + ' is moving')
  }
}

let a = new Animal('giraffe')
a.move()

function Cat(name){
  Animal.apply(this, [name])
  this.meow = function(){
    console.log(this.name + ' is meowing')
  }
}

Cat.prototype = Object.create(Animal.prototype)

let c = new Cat('timmy')
c.meow()
c.move()

