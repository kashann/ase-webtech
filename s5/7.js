function genFib(){
  let cache = [1,1]
  let fib = function(index){
    if (index < cache.length){
      console.log('returned index ' + index + ' from cache')
      return cache[index]
    }
    else{
      cache[index] = fib(index - 1) + fib(index - 2)
      console.log('returned index ' + index + ' from calculation')
      return cache[index]
    }
  }
  return fib
}

let fib = genFib()
fib(1)
fib(5)
fib(3)

