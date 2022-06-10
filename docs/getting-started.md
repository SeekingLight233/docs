---
title: 【译】mobx-state-tree 入门教程
date: 2022-06-01
categories:
  - 前端
tags:
  - MobX
sidebarDepth: 5
sidebar: 'auto'
---

<div id="codefund"></div>

[原文链接](https://mobx-state-tree.js.org/intro/getting-started)

在这个教程中，我们会去构建一个 TODO 应用，并向你介绍 mobx-state-tree（MST）中的基础知识。我们的需求是，能够将每一个 TODO 分配给指定的用户。

## 前置知识

本教程假定你已经熟悉了 React 的基本使用。如果对 React 不够了解的话，可能需要先阅读一下 React 官方的 [tutorial](https://facebook.github.io/react/tutorial/tutorial.html)。

### 我需要学习 Mobx 吗?


MST 重度依赖于 Mobx。如果说你了解 Mobx 话，那么对于你去处理 MST 中复杂的情况，以及和 React 组件的数据连接问题是很有帮助的。但如果说你真的没有 Mobx 的经验，那也没有关系，使用 MST 不需要去了解任何的 Mobx API。

## 如何按照本教程进行操作

你可以在浏览器中使用 CodeSandbox playground 编写本教程的代码，或者在你喜欢的代码编辑器（比如 VSCode）中编写。

### 在浏览器里写代码

对于每一个例子，你都能够找到一个 CodeSandbox 的链接。你可以从每一个 playground 开始，一步一步的进入到下一个教程。如果你被卡住了，可以去下一个 playground 里偷偷瞄一眼:)

### 在编辑器里写代码

为 React 项目配置一整套环境会涉及到编译，打包，Lint 校验等等，配置这些东西是一件非常枯燥无趣的事情。幸好我们有`create-react-app`,我们只需要在终端输入几行就能够完成这些事情。

```
npx create-react-app mst-todo
```

接下来安装 `mobx`, `mobx-react-lite` and `mobx-state-tree` 这三个依赖。

```
yarn add mobx mobx-react-lite mobx-state-tree
```

现在你可以运行 `npm run start`, 一个基本的 React 页面就弹出来了。你现在已经准备的差不多，可以开始编辑项目文件啦！

## 概览

MST 是一个状态容器。它将可变数据的简单便捷，与不可变数据的可追溯性，以及可观察数据的响应性与性能，很好的结合到了一起。

如果上面这段话让你感觉有点绕，不要慌，我们来一起深入研究，逐步的去探索它的含义。

## 起步

当用 MST 构建应用时，我们应该去思考最小的实体集是什么以及这个实体集会关联哪些属性，这种思维上训练对于你是很有帮助的。

在我们的示例应用中，我们要处理的是 `TODO`，因此我们肯定需要一个 `Todo` 实体。Todo 实体上会有一个`name`属性，以及用来标记 TODO 是否完成的 `done`属性。我们的应用中还会涉及到用户，因此我们还需要一个`User`实体。它有一个`name`属性，并且可以分配给很多的 TODO。

到目前为止，我们构建的实体和其属性有下面这些：

`Todo`

- name
- done

`User`

- name

## 创建我们的第一个 model

MST 中有一个很重要的核心概念, 动态树 (living tree)。这棵树是由可变的，由受到严格保护的对象所构成，这些对象中会存在大量的运行时类型信息。换句话说，每棵树上的节点都会有一个形状（类型信息）和状态（数据）。这棵动态树能够自动生成不可变和可共享结构的快照。

这也就意味着，要想让我们的 App 正常工作，我们需要向 MST 描述我们的属性是如何形成的。知道了这一点，MST 就可以自动生成数据的边界，并帮我们去规避一些愚蠢的错误，比如在价格字段中放一个字符串，或者在一个应该是数组的地方放一个布尔值。

在 MST 中给一个实体定义 model，最简单的办法是提供一份默认值，并将其传递给`types.model`。

```javascript
import { types } from 'mobx-state-tree';

const Todo = types.model({
  name: '',
  done: false,
});

const User = types.model({
  name: '',
});
```

[查看示例](https://codesandbox.io/s/235jykjp90)

上面的代码将创建两个 model，一个`Todo`model 和一个`User`model。但我们在前文中说过，MST 中的树状 model 由类型信息（我们刚刚已经定义了它们）和状态(实例数据)所组成。那么我们如何创建`Todo`和`User`model 的实例呢？

## 创建 model 的实例 (tree nodes)

我们可以在刚刚定义的`Todo`和 `User`model 上调用 `.create()`来完成。

```javascript
import { types, getSnapshot } from 'mobx-state-tree';

const Todo = types.model({
  name: '',
  done: false,
});

const User = types.model({
  name: '',
});

const john = User.create();
const eat = Todo.create();

console.log('John:', getSnapshot(john));
console.log('Eat TODO:', getSnapshot(eat));
```

[查看示例](https://codesandbox.io/s/kkl8kn4pq5)

在下面的例子你会看到，使用 model 可以确保我们定义的属性是始终存在的，默认是我们预定义的值。如果你想在创建 model 实例时改变这些预定义的值，你可以在`.create`函数中传入你所需要改变的值的对象。

```javascript
const eat = Todo.create({ name: 'eat' });

console.log('Eat TODO:', getSnapshot(eat));
// => 将会打印 {name: "eat", done: false}
```

[查看示例](https://codesandbox.io/s/jpmpyj7pm3)

## 初识 types

如果你向 Todo 的`create`中传入下面的值，你可能会遇到这样的错误

```javascript
const eat = Todo.create({ name: 'eat', done: 1 });
```

```
Error: [mobx-state-tree] Error while converting `{"name":"eat","done":1}` to `AnonymousModel`:
at path "/done" value `1` is not assignable to type: `boolean`.
```

这啥意思呢？我前面说过，MST 节点上的类型信息是很详尽的。这也就意味着，如果要的是一个布尔值，但你传进去了一个错误的类型(比如数字),MST 就会抛出一个错误。在你写代码时，这一点非常有帮助，因为它可以让你的状态保持一致，从而避免类型错误。

emmm 跟你说句实话，在我告诉你去如何定义 model 时，我撒了谎。你用的其实是下面这段语法的语法糖:

```javascript
const Todo = types.model({
  name: types.optional(types.string, ''),
  done: types.optional(types.boolean, false),
});

const User = types.model({
  name: types.optional(types.string, ''),
});
```

[查看示例](https://codesandbox.io/s/kx9x4973z3)

MST 的`types`下面提供了很多有用的类型以及类型工具，比如`array`, `map`, `maybe`, `refinements`， `unions`。如果你对它们感兴趣，可以随时[查阅列表](/overview/types) 并了解它们的参数。

我们现在可以用这些知识去组合这些 model 并去定义我们 store 里的根 model，根 model 会把`Todo`和`User`的许多实例分别保存到`todos`和`users`属性上。

```javascript
import { types } from 'mobx-state-tree';

const Todo = types.model({
  name: types.optional(types.string, ''),
  done: types.optional(types.boolean, false),
});

const User = types.model({
  name: types.optional(types.string, ''),
});

const RootStore = types.model({
  users: types.map(User),
  todos: types.optional(types.map(Todo), {}),
});

const store = RootStore.create({
  users: {}, // users is not required really since arrays and maps are optional by default since MST3
});
```

[查看示例](https://codesandbox.io/s/kk63vox225)

注意！如果你在创建 model 时没有传初始值进去，那么`types.optional`第二个参数就必须要传。再举个例子，如果你想在调用`create`时使`name`或`todos`属性成为必选，可以把 `types.option`换成 `types.*`。

> 译者注: `types.*`指的是其他的类型属性，比如`types.string`,`types.number`

## 修改数据

MST 上的节点 (model 实例)可以使用 action 来修改。action 和 你的 model 是相关联的。定义 action 很简单，只需要在 model 实例上声明`actions`。`actions`函数需要传一个回调进去，在回调的参数上你可以取出 model 的实例，同时你要返回一个对象出来，这个对象上需要有修改树节点的方法。

举个例子，下面的这些 actions 被定义在了`Todo`的 model 上，你可以用它们来切换`done`状态或修改名称。

```javascript
const Todo = types
  .model({
    name: types.optional(types.string, ''),
    done: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setName(newName) {
      self.name = newName;
    },

    toggle() {
      self.done = !self.done;
    },
  }));

const User = types.model({
  name: types.optional(types.string, ''),
});

const RootStore = types
  .model({
    users: types.map(User),
    todos: types.map(Todo),
  })
  .actions((self) => ({
    addTodo(id, name) {
      self.todos.set(id, Todo.create({ name }));
    },
  }));
```

[查看示例](https://codesandbox.io/s/3xw9x060mp)

关于 `self` 你需要注意一下。`self`是你的 model 被创建时的实例对象。多亏有了这玩意儿，实例的 actions 和 this 就没有任何关系了，self 的指向永远是 model 实例。

调用 actions 和你用纯 js 在类上调方法一毛一样，你只需要在实例上直接调用即可。

```javascript
store.addTodo(1, 'Eat a cake');
store.todos.get(1).toggle();
```

[查看示例](https://codesandbox.io/s/r673zxw4p)

## Snapshots 是个好东西 !

我们可以非常简单的在运行时去更改可变数据，但调试起来就很难受了。反观使用不可变
数据就好很多。但鱼与熊掌可否兼得？也许屏幕外的现实生活可以给我们答案。你家里的主子可能每时每刻都在蹦跶，它是“可变的”。但是你可以通过你的手机来给它拍张照片，照片中的它就是“不可变的”。我们可以对我们 App 中的状态做同样的事情吗？

答案是可以的。我们可以通过 MST 的`getSnapshot`函数，获取 store 的快照。

```javascript
console.log(getSnapshot(store));
/*
{
    "users": {},
    "todos": {
        "1": {
            "name": "Eat a cake",
            "done": true
        }
    }
}
*/
```

因为状态本身是可变的，所以每当状态发生变化时，就会有一个快照被发射出来。为了监听新的快照，你可以使用`onSnapshot(store, snapshot => console.log(snapshot))`并在快照发出时来记录它们。

## 从 snapshot 到 model

我们刚才已经知道，从 model 上获取 snapshot 是很简单的事情。但有没有办法从 snapshot 上恢复一个 model 呢？当然可以啦！

只要你知道节点的**类型信息**和它的**snapshot**，就可以通过你自定义的方式来进行恢复。有两种办法：

1. 创建一个新的 model 实例，并把快照传给`create`函数。这意味着你会更新 store 上的引用，如果在 React 组件中使用到了，那这份 store 对于组件来讲就是全新的。

2. 想要避免问题 1，可以将 snapshot 覆盖到现有的 model 实例上。这样的话只会更新其中的部分属性，但原来的引用会保持不变。这会触发一个叫做`协调`的过程。我们在后面的原理篇详细讨论。

```javascript
// 1st
const store = RootStore.create({
  users: {},
  todos: {
    1: {
      name: 'Eat a cake',
      done: true,
    },
  },
});

// 2nd
applySnapshot(store, {
  users: {},
  todos: {
    1: {
      name: 'Eat a cake',
      done: true,
    },
  },
});
```

[查看示例](https://codesandbox.io/s/3x3v5kl5mq)

## 时间旅行

获取 snapshot 和更新 snapshot 的能力可以很好的在应用层实现时间旅行。你需要做的仅仅是监听 snapshot，找个地方存起来，然后再重新覆盖回去！

下面是一个简单的实现：

```javascript
import { applySnapshot, onSnapshot } from 'mobx-state-tree';

var states = [];
var currentFrame = -1;

onSnapshot(store, (snapshot) => {
  if (currentFrame === states.length - 1) {
    currentFrame++;
    states.push(snapshot);
  }
});

export function previousState() {
  if (currentFrame === 0) return;
  currentFrame--;
  applySnapshot(store, states[currentFrame]);
}

export function nextState() {
  if (currentFrame === states.length - 1) return;
  currentFrame++;
  applySnapshot(store, states[currentFrame]);
}
```

## 与 UI 结合

由于 MST 是基于 Mobx 的，他可以与 Mobx 中的`autorun`，`reaction`，`observer`等 API 完全兼容。 你可以用 `mobx-react-lite`来连接 MST 的 store 和 React 组件。更多的细节可以自行翻阅 `mobx-react-lite`文档。但请你记住，任何视图库都可以和 MST 集成，只要监听 `onSnapshot`并进行相应的更新即可。

```javascript
import { observer } from 'mobx-react-lite';
import { values } from 'mobx';

const App = observer((props) => (
  <div>
    <button onClick={(e) => props.store.addTodo(randomId(), 'New Task')}>
      Add Task
    </button>
    {values(props.store.todos).map((todo) => (
      <div>
        <input
          type='checkbox'
          checked={todo.done}
          onChange={(e) => todo.toggle()}
        />
        <input
          type='text'
          value={todo.name}
          onChange={(e) => todo.setName(e.target.value)}
        />
      </div>
    ))}
  </div>
));
```

[查看示例](https://codesandbox.io/s/310ol795x6)

## 提升渲染性能

如果你安装了 React DevTools，并启用 "更新高亮" 检查，你会看到每当切换`Todo`或改变`name`时，整个应用程序都会重新渲染。这肯定不能忍，因为如果我们的列表中有大量的`Todo`，这可能会导致性能问题!

由于 Mobx 能够产生细粒度的更新，想要解决这个问题也非常简单。你只需要将`Todo`拆分成一个子组件，当`Todo`的数据发生变化时才会触发重渲染。

```javascript
const TodoView = observer((props) => (
  <div>
    <input
      type='checkbox'
      checked={props.todo.done}
      onChange={(e) => props.todo.toggle()}
    />
    <input
      type='text'
      value={props.todo.name}
      onChange={(e) => props.todo.setName(e.target.value)}
    />
  </div>
));

const AppView = observer((props) => (
  <div>
    <button onClick={(e) => props.store.addTodo(randomId(), 'New Task')}>
      Add Task
    </button>
    {values(props.store.todos).map((todo) => (
      <TodoView todo={todo} />
    ))}
  </div>
));
```

[查看示例](https://codesandbox.io/s/jvmw9oxyxv)

而每个`observer`高阶函数能够为 React 组件附加一项能力——只有当它所观察的数据变化时才会重新渲染。由于 `AppView`在观察所有数据，当你更改了**一些东西**时，`AppView` 会跟着重渲染。

现在我们已经把渲染逻辑分割成一个个的独立的观察者，`TodoView`只会在`Todo`改变时重新渲染，而`AppView`将只会在新的`Todo`被添加或删除时重新渲染，因为它只观察`todos`的长度。

## 计算属性

我们现在想显示我们应用程序中待完成的 TODO 的数量，以帮助用户知道还有多少 TODO。即计算`done` 为 `false`的 TODO 的数量。要做到这一点，我们需要修改`RootStore`声明，并通过调用`.view`在我们的 model 上挂一个 getter 属性，来计算还有多少 TODO。

```javascript
const RootStore = types
  .model({
    users: types.map(User),
    todos: types.map(Todo),
  })
  .views((self) => ({
    get pendingCount() {
      return values(self.todos).filter((todo) => !todo.done).length;
    },
    get completedCount() {
      return values(self.todos).filter((todo) => todo.done).length;
    },
  }))
  .actions((self) => ({
    addTodo(id, name) {
      self.todos.set(id, Todo.create({ name }));
    },
  }));
```

[查看示例](https://codesandbox.io/s/7z01y57no0)

这些属性是 "可计算的"，因为它们在观察属性的变化，该属性所使用的任何东西发生变化时会自动重新计算。这可以节省性能。例如，改变 TODO 的名称并不会影响待办和已办的数量，也就不会触发这些“counter”的重新计算。

我们可以在我们的 App 中创建一个额外的组件来观察 Store 并渲染这些“counter”，来简单验证一下。使用 React DevTools 和并开启更新高亮，你会发现改变 TODO 的名称时这些 counter 并不会重渲染，当切换完成状态时才会重新渲染`TodoView`和`TodoCounterView`。

```javascript
const TodoCounterView = observer((props) => (
  <div>
    {props.store.pendingCount} pending, {props.store.completedCount} completed
  </div>
));

const AppView = observer((props) => (
  <div>
    <button onClick={(e) => props.store.addTodo(randomId(), 'New Task')}>
      Add Task
    </button>
    {values(props.store.todos).map((todo) => (
      <TodoView todo={todo} />
    ))}
    <TodoCounterView store={props.store} />
  </div>
));
```

[查看示例](https://codesandbox.io/s/k21ol780xr)

如果你打印你的快照，你会发现计算过的属性不会出现在快照中。这是故意这样设计的，因为这些属性必须依赖其他属性上进行计算，只要知道它们的定义就可以重新生成。出于同样的原因，如果给快照中传一个计算值，你用的时候肯定会报错。

## Model 的 views

你可能需要使用`是否完成`来过滤`todos`列表。你当然可以在渲染层去维护这段逻辑，但时间久了你会发现这不是一个可行的解决方案。

MST 通过 model view 解决了这个问题。一个 model 的`.views`属性可以接受一个回调。回调的第一个参数可以读取到 model，但如果你想从 view 上去改变 model 里的值，MST 将抛出一个错并阻止你这样做。

```javascript
const RootStore = types
  .model({
    users: types.map(User),
    todos: types.map(Todo),
  })
  .views((self) => ({
    get pendingCount() {
      return values(self.todos).filter((todo) => !todo.done).length;
    },
    get completedCount() {
      return values(self.todos).filter((todo) => todo.done).length;
    },
    getTodosWhereDoneIs(done) {
      return values(self.todos).filter((todo) => todo.done === done);
    },
  }))
  .actions((self) => ({
    addTodo(id, name) {
      self.todos.set(id, Todo.create({ name }));
    },
  }));
```

[查看示例](https://codesandbox.io/s/x293k4q95o)

注意，其他的 View 和视图层组件可以任意调用`getTodosWhereDoneIs`。

## 更进一步: 引用

OK，我们的 TODO 应用基本逻辑已经完成了。但正如我在开始本教程时所说，我们希望能够把每一个 TODO 都分配出去。

我们接下来将重点讨论这个功能。假设用户列表是来自网络请求或其他数据源，我们希望我们的 TODO 应用可以实现对这些用户的管理。

首先，我们要有一个`users`的 map，我们先初始化几个用户。

```javascript
const store = RootStore.create({
  users: {
    1: {
      name: 'mweststrate',
    },
    2: {
      name: 'mattiamanzati',
    },
    3: {
      name: 'johndoe',
    },
  },
  todos: {
    1: {
      name: 'Eat a cake',
      done: true,
    },
  },
});
```

[查看示例](https://codesandbox.io/s/7wwn0x4xkq)

现在我们需要改一下我们的`Todo`model，用来存储分配 TODO 的用户。你可以通过存储`User`映射`id`来做到这一点，并提供一个可以解析到用户的 computed（你可以作为一个练习来做），但这样你可能要写不少代码。

MST 支持开箱即用的引用。我们可以在`Todo`model 上定义一个`user`属性，它是`User`实例的引用。当获取快照时，该属性的值是`User`的标识符。读取的时候，它能解析到`User`model 的正确实例，更改的时候，你可以用`User`model 实例或者是`User`的标识符。

### 标识符

为了能够让我们的引用正常工作，我们需要手动告诉 MST，用哪个属性作为每个`user`model 实例的唯一标识。

> 译者注: 一般情况下会声明成一个`key`或者`id`。

一旦 model 实例被创建，就必须要定义标识符属性。这也意味着，如果你试图在该 model 上 apply 一个具有不同标识符的 snpashot,MST 会直接报错。另一方面，提供标识符有助于 MST 理解 map 和数组中的元素，并允许它在可能的情况下正确重用数组和 map 中的 model 实例。

要定义一个标识符，你需要使用`types.identifier`定义一个属性。接下来的例子中，我们会把标识符定义为字符串。

```javascript
const User = types.model({
  id: types.identifier,
  name: types.optional(types.string, ''),
});
```

标识符一旦在 model 中定义了，model 的实例就必须要提供，而且不能被改变，所以如果你收到这样的错误，那是因为你还必须为`RootStore`的`.create`提供用户 id。

```
Error: [mobx-state-tree] Error while converting `{"users":{"1":{"name":"mweststrate"},"2":{"name":"mattiamanzati"},"3":{"name":"johndoe"}},"todos":{"1":{"name":"Eat a cake","done":true}}}` to `AnonymousModel`:
at path "/users/1/id" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier(string)` instead.
at path "/users/2/id" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier(string)` instead.
at path "/users/3/id" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier(string)` instead.
```

我们可以通过添加 id 属性来解决这个问题，

```javascript
const store = RootStore.create({
  users: {
    1: {
      id: '1',
      name: 'mweststrate',
    },
    2: {
      id: '2',
      name: 'mattiamanzati',
    },
    3: {
      id: '3',
      name: 'johndoe',
    },
  },
  todos: {
    1: {
      name: 'Eat a cake',
      done: true,
    },
  },
});
```

[查看示例](https://codesandbox.io/s/44jn3pv2x)

### 定义引用

在这个例子中，我们可以通过`types.reference(User)`来定义 User 的引用。但如果这时候我们还没有定义 User 这个 model，就会导致循环引用。这时候我们可以使用`types.late(() => User)`来代替`User`，这样就能延迟`user` model 的解析，我们也就可以在`Todo`的`user`属性中使用`null`来初始化了。Todo 的 user 是可选的(有可能还没有指派用户)，我们可以使用 `types.maybe(...)`来允许 `user`属性为 null 并被初始化为 null。

```javascript
const Todo = types
  .model({
    name: types.optional(types.string, ''),
    done: types.optional(types.boolean, false),
    user: types.maybe(types.reference(types.late(() => User))),
  })
  .actions((self) => ({
    setName(newName) {
      self.name = newName;
    },
    toggle() {
      self.done = !self.done;
    },
  }));
```

[查看示例](https://codesandbox.io/s/xv1lkqw9oq)

### 更改引用上的值

model 的引用可以通过提供标识符或 model 实例来设置。首先，我们需要定义一个动作，允许你改变`Todo`的`user`。

```javascript
const Todo = types
  .model({
    name: types.optional(types.string, ''),
    done: types.optional(types.boolean, false),
    user: types.maybe(types.reference(types.late(() => User))),
  })
  .actions((self) => ({
    setName(newName) {
      self.name = newName;
    },
    setUser(user) {
      if (user === '') {
        // When selected value is empty, set as undefined
        self.user = undefined;
      } else {
        self.user = user;
      }
    },
    toggle() {
      self.done = !self.done;
    },
  }));
```

现在我们需要编辑我们的视图组件，在每个`TodoView`中显示一个 select 框，用户可以选择该任务的分配者。我们可以创建一个单独的组件`UserPickerView`，并在`TodoView`组件中使用它来触发`setUser`调用。大功告成！

```javascript
const UserPickerView = observer((props) => (
  <select
    value={props.user ? props.user.id : ''}
    onChange={(e) => props.onChange(e.target.value)}
  >
    <option value=''>-none-</option>
    {values(props.store.users).map((user) => (
      <option value={user.id}>{user.name}</option>
    ))}
  </select>
));

const TodoView = observer((props) => (
  <div>
    <input
      type='checkbox'
      checked={props.todo.done}
      onChange={(e) => props.todo.toggle()}
    />
    <input
      type='text'
      value={props.todo.name}
      onChange={(e) => props.todo.setName(e.target.value)}
    />
    <UserPickerView
      user={props.todo.user}
      store={props.store}
      onChange={(userId) => props.todo.setUser(userId)}
    />
  </div>
));

const TodoCounterView = observer((props) => (
  <div>
    {props.store.pendingCount} pending, {props.store.completedCount} completed
  </div>
));

const AppView = observer((props) => (
  <div>
    <button onClick={(e) => props.store.addTodo(randomId(), 'New Task')}>
      Add Task
    </button>
    {values(props.store.todos).map((todo) => (
      <TodoView store={props.store} todo={todo} />
    ))}
    <TodoCounterView store={props.store} />
  </div>
));
```

[View sample in the playground](https://codesandbox.io/s/6j3qy74kpw)

## 引用更加的安全!

使用引用还有一个好处，如果你不小心删除了 model，而这个 model 被某个计算属性所引用，MST 会直接抛出一个错误！如果你试图移除一个被引用的 user，你会得到这样的结果。

```
[mobx-state-tree] Failed to resolve reference of type <late>: '1' (in: /todos/1/user)
```
