function* seq(from, to){
  for (let i = from; i < to; i++) {
    yield i
  }
}

for (let e of seq(3,8)){
  console.log(e)
}