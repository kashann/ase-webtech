class Animal{
  constructor(name){
    this.name = name
  }
  move(){
    console.log(this.name + ' is moving')
  }
}

let a = new Animal('giraffe')
a.move()

class Cat extends Animal{
  constructor(name){
    super(name)
  }
  meow(){
    console.log(this.name + ' is meowing')
  }
}

let c = new Cat('timmy')
c.meow()
c.move()

Cat.prototype.sneak = function(){
  console.log(this.name + ' is sneaking')
}

c.sneak()