function generateGreeting(words){
  return function(name){
    console.log(words + ', ' + name + '!')
  }
}

let hello = generateGreeting('hello')
let goodBye = generateGreeting('good bye')

hello('jim')
goodBye('jane')