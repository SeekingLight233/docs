---
title: Typescript内建工具类型 & 源码解析
date: 2022-2-6
categories:
  - 前端
  - Typescript
---

## Partial\<Type>

顾名思义，可以将一个 Type 中所有的属性变为【部分的】，即可选项。

```ts
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: 'organize desk',
  description: 'clear clutter',
};

const todo2 = updateTodo(todo1, {
  description: 'throw out trash',
});
```

在官网的 demo 中我们可以看到，即使 `updateTodo`方法没有传递`title`属性，仍然可以通过类型检查。

### 源码解析

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

`keyof`关键字可以将某个 type 中所有的属性提取出来，并作为一个新的**联合类型**。
`in`操作符本来是 js 中的关键字，用来判断一个属性在某个对象中是否存在。在 ts 中作了兼容处理，成为了判断某个类型存在的类型守卫。

这里的`P in keyof T` 可以简单理解为遍历 T 中的所有 key。T[P]为取出 key 上所有的 type。

`?`可以将该属性变为可选。

### 拓展：实现 DeepPartial

Partial 可以将 Type 中的属性变为可选，但是从源码中我们可以看出，他只能对最外层的属性进行一次“浅操作”，那么对于一个嵌套的 type，如何才能将其深层所有的属性变成可选呢？

```ts
interface Type0 {
  data: {
    userInfo: {
      name: string;
      age: number;
    };
  };
  message: string;
}

type PartialDeep = DeepPartial<Type0>;
```

回想一下，在 js 中我们如何遍历一个嵌套对象？我们肯定要用上递归。在 ts 中，type 允许我们进行递归定义，从而实现 type 层的计算。

```ts
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
```

PS: 这里涉及到了 extends 关键字，可以先略过，建议全文阅读完再回头理解会更透彻。

## Required\<Type>

Required 可以理解为 Partial 的反操作。

```ts
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };
// Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
```

### 源码解析

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

这里的源码非常有趣，ts 内部是用了一个减号来对类型进行计算，用来移除所有的可选项。我想你也应该知道如何去实现一个`DeepRequired`了～

## Readonly\<Type>

将 Type 上所有的属性变为只读。

```ts
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: 'Delete inactive users',
};

todo.title = 'Hello'; // error
```

### 源码解析

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

没有任何的黑魔法，仅仅是在属性前面的加了一个 readonly 修饰符。

## Record\<Keys, Type>

用来创建映射关系的一个工具类，Keys 为对象上 key 的联合类型，一般情况我们会用 key of 关键字来进行获取。
Type 为每一条“Record”的值的类型。

```ts
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = 'miffy' | 'boris' | 'mordred';

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: 'Persian' },
  boris: { age: 5, breed: 'Maine Coon' },
  mordred: { age: 16, breed: 'British Shorthair' },
};

cats.boris;
```

### 源码解析

```ts
type Record<Keys extends keyof any, T> = { [P in Keys]: T };
```

从源码中可以看出，Keys 必须要是一个可以经过 keyof 计算的 type，换言之，就是所有可以用来用作 key 的类型！

那么问题来了，哪些类型可以用作 key 呢？

点击查看答案：<hide txt="string,number,symbol"></hide>

## Pick\<Type, Keys>

从 Type 中 取出 Keys 作为新的 Type。

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>;

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
};
```

### 源码实现

```ts
type Pick<T, Keys extends keyof T> = { [P in Keys]: T[P] };
```

如果理解了 Record 的实现，Pick 的实现也就很简单了。需要注意的是 Keys 必须是 T 上已经拥有的属性。

## Exclude\<UnionType, ExcludedMembers>

Exclude 和 Omit 的用法对于初学者经常容易混淆，其实从 ts 官方文档的描述中我们就能看出区别：Exclude 的第一个参数我们需要传的是一个 UnionType，他的作用是将 UnionType 中的某些成员忽略掉，而 Omit 是将 Type 中的某些成员属性忽略掉。

```ts
type T0 = Exclude<'a' | 'b' | 'c', 'a'>;
// type T0 = "b" | "c"
type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>;
// type T1 = "c"
type T2 = Exclude<string | number | (() => void), Function>;
// type T2 = string | number
```

### 源码实现

```ts
type Exclude<UnionType, ExcludedMembers> = UnionType extends ExcludedMembers
  ? never
  : UnionType;
```

这里的源码看似简单，但其实不太好理解。

首先是 extends 关键字，extends 关键字在 ts 中的**语义**为`一个type满足另一个type`。等于说是为 type 增加了一层约束。

而这个语义是具有`条件判断`的隐藏特征的,他后面可以跟一个类似于 js 的三元表达式。

结合 T1 的例子，如果 type "a" 满足 type ExcludedMembers `'a' | 'b'`，就返回 never。此时 ts 编译器内部的计算结果是这样的。

```ts
type Tmp = never | 'b' | 'c';
```

接下来，如果 type "b" 满足 type ExcludedMembers `'a' | 'b'`，此时也返回 never。你可以把下面的代码拷贝到编辑器中，鼠标放到 Tmp 上，你会发现神奇的事情。

```ts
type Tmp = never | never | 'c';
```

也就是说，never 在 UnionType 上是一个空的占位符，除此之外还有 `null`和 `undefined`.

再接下来，type "c" 也会经历一次运算，他是不满足上述三元判断条件的，此时就会返回"c"本身。

最终我们就得到了这个 type。

## Omit\<Type, Keys>

Omit 的用法前文已经提到，用来将 Type 中的某些成员属性忽略掉，也可以认为是 Pick 的反操作。

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, 'description'>;

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
  createdAt: 1615544252770,
};
```

### 源码实现

```ts
type Omit<Type, Keys extends keyof any> = Pick<Type, Exclude<keyof Type, Keys>>;
```

既然作为 Pick 的反操作，我们只需要借助 Exclude 找出需要 Omit 的 type 即可。

### 拓展与思考

思考一个问题，为什么源码中的 Keys extends 的是一个 any？从设计的角度 extends Type 不是更好吗，这样的话在 Omit 的时候还有类型提示多好呀！

其实在早期 Omit 确实是这么实现的，但这样会带来一个副作用: 如果一个属性是可选的，也会出现在 Omit 的 Type 中，这在类型检查的层面就属于 bug 了。

[传送门](https://github.com/microsoft/TypeScript/issues/30825)

## Extract\<UnionType, ExtractMembers>

Exclude 的逆运算，在 Type 中提取 Union 中的类型。

```ts
type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>;
// type T0 = "a"

type T1 = Extract<string | number | (() => void), Function>;
//type T1 = () => void
```

### 源码实现

```ts
type Extract<UnionType, ExtractMembers> = UnionType extends ExtractMembers
  ? UnionType
  : never;
```

很容易理解，和 Exclude 完全相反的类型运算逻辑。

## NonNullable\<UnionType>

将传进来的 UnionType 中的 null 和 undefined 去除掉。

```ts
type T0 = NonNullable<string | number | undefined | null>;

// type T0 = string | number
```

### 源码实现

```ts
type NonNullable<UnionType> = UnionType extends null | undefined
  ? never
  : UnionType;
```

一样的套路，如果 type 满足 null | undefined，就返回 never，否则返回自身。

## Parameters\<FunctionType>

取出函数类型上的参数类型，通常情况我们更倾向去利用 typeof 关键字来取出函数的类型。

最终的返回类型是一个 Tuple

```ts
function foo(a: number, b: string) {
  return a + b;
}
type T0 = Parameters<typeof foo>;
// type T0 = [a: number, b: string]

function bar(a: string) {
  return a;
}

type T1 = Parameters<typeof bar>;
// type T1 = [a: string]
```

### 源码实现

```ts
type Parameters<
  FunctionType extends (args: any) => any
> = FunctionType extends (...args: infer Args) => any ? Args : never;
```

从传入的参数限制我们可以得知，传入的 type 至少要是一个 Function 的 type，这个 FunctionType 如果满足 `(...args: infer Args) => any` 这个条件...

打住，`infer Args`是个什么鬼？

infer 诞生于[这个提案](https://github.com/Microsoft/TypeScript/pull/21496),表示在 extends 条件语句**待推断的类型变量**

在`(...args: infer Args) => any` 中，我们不知道参数类型到底是什么样子的，此时便可以在 typescript 的**类型空间**上开辟一块内存，在 ts 进行编译的过程才知道 `FunctionType`上的 `参数类型` 究竟是谁，这里的参数类型会存储在这块类型空间中，等到编译结束时就会返回给我们。

所以`infer x`的本质是**在 typescript 的类型空间上开辟一块标识名为 x 的内存区域**。

其实任何强类型的语言都会存在两个内存区域，分别是`类型空间`和`值空间`,我们在 java/ts 中 `int a = 1`或者 `let a:number:1`,其实都是在`值空间`上的操作。

## ReturnType\<FunctionType>

和 Parameters 的用法很类似，只不过这个是取出函数类型上的返回值的类型。

```ts
type T0 = ReturnType<() => string>;
// type T0 = string

type T1 = ReturnType<(s: string) => void>;
// type T1 = void
```

### 源码实现

```ts
type ReturnType<
  FunctionType extends (args: any) => any
> = FunctionType extends (args: any) => infer ReturnType ? ReturnType : any;
```

和 Parameters 的实现几乎一样，无非是将 infer 占位由函数参数更换到了返回值的位置。

## 类型体操练习

### GetPromiseVal

```ts
type GetPromiseVal<P> = P extends Promise<infer Value> ? Value : never;
```

### Trim

```ts
type TrimLeft<Str extends string> = Str extends `${" "}${infer x}`? TrimLeft<x> : Str
type TrimRight<Str extends string> = Str extends `${infer x}${" "}`? TrimRight<x> : Str

type Trim<Str extends string> = TrimRight<TrimLeft<Str>>

type res = Trim<"    abc   ">
```

### GetRefProps

```ts
interface Props {
  ref: number | string;
}
type GetRefProps<Props> = Props extends { ref?: infer Value } ? Value : never;
type RefType = GetRefProps<Props>;
```

### Push

```ts
type Push<Arr extends unknown[], Ele> = [...Arr, Ele];

type PushRes = Push<[1, 2, 3], 'jason'>;
```

### Zip

```ts
type tuple1 = [1, 2, 4];
type tuple2 = ['jason', 'lee', 'hello'];

type Zip<Arr1 extends unknown[], Arr2 extends unknown[]> = Arr1 extends [
  infer a,
  ...(infer Rest)
]
  ? Arr2 extends [infer c, ...(infer Rest2)]
    ? [[a, c], ...Zip<Rest, Rest2>]
    : []
  : [];

type Res = Zip<tuple1, tuple2>;
```

### CapitalizeStr

```ts
type CapitalizeStr<Str extends string> = Str extends `${infer first}${infer Rest}`? `${Uppercase<first>}${Rest}` : Str;

type Res = CapitalizeStr<"sendCmd">
```

### CamelCase

```ts
type Str = "send_data_by_pass"

type CapitalizeStr<Str extends string> = Str extends `${infer first}${infer Rest}` ? `${Uppercase<first>}${Rest}` : Str;

type CamelCase<Str extends string> =
  Str extends `${infer head}_${infer Resolve}${infer Rest}`
  ? `${head}${CapitalizeStr<Resolve>}${CamelCase<Rest>}` : Str

type Res = CamelCase<Str>
```
