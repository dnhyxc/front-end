import {fn} from './add'
import {subCount} from './test'

const name = 'dnhyxc111'

const getName = () => {
  return name;
}


const res = getName(`my name is ${name}, my age is ${fn(9, 2)}`)

const count = fn(9, 2)


console.log(res)
console.log(count)
console.log(subCount, 'subCount')