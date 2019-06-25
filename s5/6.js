function g(base){
  let n = base
  return function(){
    n++
    console.log('current value of n ' + n)
  }
}

let f1 = g(0)
let f2 = g(10)
f1()
f1()
f1()
f2()