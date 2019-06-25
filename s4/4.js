function f0(x){
  return x + 3
}

console.log(f0(3))

let f1 = f0
console.log(f1(4))

let f2 = function(x){
  return x + 3
}

let f3 = f2

f2 = 0

console.log(f3(4))

let f4 = (x) => {
  return x + 3  
}

let f5 = (x) => x + 3
console.log(f5(5))




