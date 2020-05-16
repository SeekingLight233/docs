---
title: Typescript上手笔记
date: 2020-5-15
categories:
  - 前端
---

## 安装与编译

### 安装

```shell
npm i -g typescript
```

工具的话当然是巨硬家搭配的 VScode 啦~~

### 编译

> hello.ts

```ts
const hello = (name: string) => {
  return `hello ${name}`
}

const res = hello("SeekingLight")
```

此时在终端输入`tsc hello.ts`便可以将其编译成 js 文件。

如果想实现编译并且运行可以去 down 下`ts-node`这个 npm 包

## 类型系统

在声明变量时可以在后面用引号为其标注类型。

### 基础类型

```ts
//基本类型
let isDone: boolean = false

let age: number = 20
let binNum: number = 0b1011 //二进制字符串

let firstName: string = "Jason"
//es6中的模板字符串也是支持的
let message: string = `hello,${firstName},age is ${age}`

//undefined和null
let u: undefined = undefined
let n: null = null

//undefined和null是所有类型的子类型
let num: number = undefined
let num1: string = null
```

### 联合类型与 any 类型

联合类型与 any 类型可以允许我们为一个变量赋不同类型的值。

```ts
//any类型允许你用任何类型的变量为其赋值
let notSure: any = 4
notSure = "4"
notSure = true
notSure.name = "jason"
//联合类型
let numberOrString: number | string = 234
numberOrString = "234"
```

### Array 和 Tuple

ts 中的 Array 可以具体的为其制定元素类型。

```ts
//数组
let arr_num: number[] = [1, 2, 3, 4]
arr_num.push(5)

let arr_num: Array<number> = [1, 2, 3, 4] //等同,后面会提及到泛型
```

元组可以理解为合并了不同类型的一种数组,可以具体到为每一个元素规定不同的类型。

```ts
//元组
let user: [string, number, string] = ["jason", 20, "你好"]
```

### 类型别名

有时候一些类型在定义的时候写起来很麻烦(像函数类型)，这时候我们可以通过给这些类型起别名来简化代码量。

```ts
type PlusType = (x: number, y: number) => number
function sum(x: number, y: number) {
  return x + y
}
const sum2: PlusType = sum

type NameResolver = () => string
type NameOrResolver = string | NameResolver
function getName(n: NameOrResolver): string {
  if (typeof n === "string") {
    return n
  } else {
    //传入的参数为函数，直接执行
    return n()
  }
}
```

## 接口与函数

### 对象中接口

ts 中的接口主要有两个作用。
一是对对象和函数的形状(shape)进行描述。
二是对类进行抽象(类似 java)。

```ts
interface Person {
  readonly id: number //只读属性
  name: string
  age: number
  height?: number //属性后面加？代表属性可有可无
}
let circel: Person = {
  id: 3,
  name: "circel",
  age: 20,
}

circel.id = 4 //报错

interface IPlus {
  (a: number, b: number): number
}
function plus(a: number, b: number) {
  return a + b
}
const a: IPlus = plus
```

### 函数

```ts
//函数声明的写法
function add(x: number, y: number, z?: number): number {
  if (typeof z === "number") {
    return x + y + z
  } else {
    return x + y
  }
}
let result = add(3, 4)
let result1 = add(7, 7, 7)
```

在 ts 中，不确定的函数参数也可以用？来进行标注。

### 类型推断

typescript 会默认有一个“类型推断”的功能，如果你在为一个变量赋值的时候没有刻意规定类型，ts 就会根据你第一次赋值的类型为改变量的类型进行推断。

```ts
let str = "string"
str = 1 //报错
```

> 函数表达式也能进行推断

```ts
//函数表达式
const multiply = function(x: number, y: number, z?: number): number {
  if (typeof z === "number") {
    return x * y * z
  } else {
    return x * y
  }
}

const multi2: (x: number, y: number, z?: number) => number = multiply
```

### 类型断言

如果程序员想自己定义推断的类型，那么可以手动在变量前添加类型断言。
语法:`(<type>param)`

```ts
function getLength(input: string | number): number {
  //手动推断类型
  if ((<string>input).length) {
    return (<string>input).length
  } else {
    return input.toString().length
  }
}
```

## Class

### 基本使用

基本和 ES6 的写法差不多，只不过定义属性看起来比 ES6 要优雅一些

```ts
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  run() {
    return `${this.name} is running`
  }
}

const snake = new Animal("sss")
console.log(snake.run()) //sss is running

//继承
class Dog extends Animal {
  bark() {
    return `${this.name} is wangwangwang`
  }
}
const erha = new Dog("erha")
console.log(erha.run()) //erha is running
console.log(erha.bark()) //erha is wangwangwang

class Cat extends Animal {
  constructor(name) {
    super(name)
    console.log(this.name)
  }
  run() {
    return `Meow,` + super.run()
  }
}

const guoguo = new Cat("guoguo") //guoguo
//多态
console.log(guoguo.run()) //Meow,guoguo is running
```

### 修饰符

和面向对象的语言一样，ts 也为我们提供了修饰符。

#### public

```ts
class Animal {
  public name: string
  constructor(name: string) {
    this.name = name
  }
  run() {
    return `${this.name} is running`
  }
}

const snake = new Animal("sss")
console.log(snake.name) //sss
snake.name = "lucy"
console.log(snake.name) //lucy
```

#### private

private 只允许类的内部访问方法，外部和子类无法访问

```ts
class Animal {
  private name: string
  constructor(name: string) {
    this.name = name
  }
  run() {
    return `${this.name} is running`
  }
}

const snake = new Animal("sss")
console.log(snake.name) //报错
snake.name = "lucy"
console.log(snake.name) //报错

//继承
class Dog extends Animal {
  bark() {
    return `${this.name} is wangwangwang` //报错
  }
}
```

#### protected

protected 允许类的内部和子类进行访问，但外部不允许访问

```ts
class Animal {
  protected name: string
  constructor(name: string) {
    this.name = name
  }
  run() {
    return `${this.name} is running`
  }
}

const snake = new Animal("sss")
console.log(snake.name) //报错
snake.name = "lucy"
console.log(snake.name) //报错

//继承
class Dog extends Animal {
  bark() {
    return `${this.name} is wangwangwang` //不报错
  }
}
```

### 静态属性和静态方法

静态属性和静态方法不用实例化便可以直接访问(调用)。

```ts
class Animal {
  readonly name: string
  static categoies: string[] = ["mammal", "bird"]
  static isAnimal(a) {
    {
      return a instanceof Animal
    }
  }
  constructor(name: string) {
    this.name = name
  }
  run() {
    return `${this.name} is running`
  }
}

const snake = new Animal("sss")
console.log(snake.name)
console.log(Animal.categoies[1]) //bird
console.log(Animal.isAnimal(snake)) //true
```

### 类中的接口

在之前我们介绍了接口如何规定对象的“shape”，接下来接口的作用就和 java 中几乎一模一样了。

```ts
interface Radio {
  switchRadio(strigger?: boolean): void
}

interface Battery {
  checkBatteryStatus()
}
//接口继承
interface RadioWithBattery extends Radio {
  checkBatteryStatus()
}
class Car implements Radio {
  switchRadio(strigger?: boolean): void {}
}
//接口实现
class Cellphone implements Radio, Battery {
  checkBatteryStatus() {}
  switchRadio(strigger?: boolean): void {}
}

class Smartphone implements RadioWithBattery {
  checkBatteryStatus() {}
  switchRadio(strigger?: boolean): void {}
}
```

### Enum

枚举可以允许用户去定义一组常量。

#### 数字枚举

```ts
enum Direction {
  Up = 10,
  Down,
  Left,
  Right,
}

console.log(Direction.Up) //10
console.log(Direction[11]) //反向映射
```

#### 字符串枚举

```ts
enum Direction {
  Up = "go up!",
  Down = "go down!",
  Left = "go left",
  Right = "go right",
}

console.log(Direction.Up) //go up!
```

使用常量枚举可以提高性能。

```ts
const enum Direction {
  Up = "go up!",
  Down = "go down!",
  Left = "go left",
  Right = "go right",
}

console.log(Direction.Up) //10
```

## 泛型

泛型是指在定义函数，接口和类的时候，先不指定具体的类型（可以理解为一个占位符），而是在使用的时候才去指定类型。

### 函数中使用泛型

为函数中参数和返回值指定泛型。

```ts
function echo<T>(arg: T): T {
  return arg
}
const res = echo("str")
//参数是元组的情况
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]]
}
const res1 = swap(["string", 1234])
console.log(res1) //[ 1234, 'string' ]

//参数为数组
function echoWithArr<T>(arg: T[]): T[] {
  console.log(arg.length)
  return arg
}
const arrs = echoWithArr([1, 2, 3])
//鼠标悬浮到arrs上   const arrs: number[]
```

### 泛型约束

ts 中的反应允许我们继承接口，从而实现对泛型的约束。

```ts
interface WithLength {
  length: number
}
function echoWithLength<T extends WithLength>(arg: T): T {
  console.log(arg.length)
  return arg
}
const str = echoWithLength("str")
const obj = echoWithLength({ length: 10, width: 10 })
const arr2 = echoWithLength([1, 2, 3])
const num = echoWithLength(333) //报错
```

### 在类中使用泛型

```ts
class Queue<T> {
  private data = []
  enQueue(item: T) {
    return this.data.push(item)
  }
  outQueue(): T {
    return this.data.shift()
  }
}

const queue = new Queue<number>()
queue.enQueue(1)
queue.enQueue("str") //报错

const queue2 = new Queue<string>()
queue2.enQueue("str")
queue2.enQueue(1) //报错
```

### 在接口中使用泛型

```ts
interface KeyPaie<T, U> {
  key: T
  value: U
}

let kp1: KeyPaie<number, string> = { key: 1, value: "value" }
let kp2: KeyPaie<number, string> = { key: 1, value: 2 } //报错

//函数表达式规定泛型接口
interface IPlus<T> {
  (a: T, b: T): T
}
function plus(a: number, b: number) {
  return a + b
}
function connect(a: string, b: string) {
  return a + b
}
const a: IPlus<number> = plus
const b: IPlus<string> = connect
```
