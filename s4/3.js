let a = [1,2,3,4,5]

console.log(a[3])
a[5] = 6

for (let i = 0; i < a.length; i++) {
  console.log(a[i])
}

for (let e of a){
  console.log(e)
}

a[8] = 9
console.log(a)
console.log(a.length)
a.push(10)
console.log(a)
console.log(a.pop())
console.log(a)
console.log(a.shift())
console.log(a)
let b = [1,2,3,4,5]
console.log(b.slice(1,3))//a[1:3]
console.log(b.slice(1,b.length))//a[1:]
console.log(b.slice(0,3))//a[:3]
console.log(b.slice(0,b.length))//a[:]
console.log(b.indexOf(3))
console.log(b.indexOf('elf'))
console.log(b.splice(1,2,'a','b','c','d'))
console.log(b)
