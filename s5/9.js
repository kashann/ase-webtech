function* fib(limit){
 let [prev, curr] = [1, 1]
 yield prev
 yield curr
 for (let i = 2; i < limit; i++) {
   [prev, curr] = [curr, curr + prev]
   yield curr
 }
}

for (let e of fib(10)){
  console.log(e)
}