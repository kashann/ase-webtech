let a = [1,2,3,4,5]

function map(a, t){
  let r = []
  for (let e of a){
    r.push(t(e))
  }
  return r
}

console.log(map(a, (e) => e * e))

console.log(a.map((e) => e + 1))
console.log(a.map((e,i) => 'a[' + i + ']=' + e))

console.log(a.filter((e) => e > 1))
console.log(a.filter((e) => !(e % 2)).map((e) => e / 2))

let s = a.reduce((a,e) => a + e,0)
console.log(s)


