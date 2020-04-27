---
title: react学习笔记
date: 2019-9-3
categories:
  - 前端
---

## 火速上手

### 变量与表达式

```js
import React, { PureComponent } from "react";

class BaseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Asher",
      flag: true,
      img: "https://seekinglight.cn/icon.png",
    };
  }
  render(h) {
    //一对大括号
    const elem = (
      <div>
        <h1>{this.state.name}</h1>
        <img src={this.state.img}></img>
        <h1>{this.state.flag === true ? "真" : "假"}</h1>
      </div>
    );
    return elem;
  }
}
export default BaseDemo;
```

### class 和 style

#### class

设置 class 的时候需要注意，要把 class 改为`className`,因为 class 在 js 中是保留字。

```js
import React, { PureComponent } from "react";
import "./style.css";

class BaseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(h) {
    const elem = (
      //class在js中是保留字
      <div>
        <h1 className="red">设置字体为红色</h1>
      </div>
    );
    return elem;
  }
}
export default BaseDemo;
```

如果想实现动态 class 也很简单，直接属性值套花括号。

#### style

```js
import React, { PureComponent } from "react";
import "./style.css";

class BaseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(h) {
    const styleData = {
      color: "blue",
    };
    const elem = (
      <div>
        <h1 style={styleData}>设置字体为蓝色</h1>
      </div>
    );
    return elem;
  }
}
export default BaseDemo;
```

### JSX 渲染 innerHTML

```js
import React, { PureComponent } from "react";
import "./style.css";

class BaseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(h) {
    const rawHtml = "<span>富文本内容<i>斜体</i><b>加粗</b></span>";
    const rawHtmlData = {
      __html: rawHtml,
    };
    const elem = (
      <div>
        <p dangerouslySetInnerHTML={rawHtmlData}></p>
      </div>
    );
    return elem;
  }
}
export default BaseDemo;
```

### 条件渲染

```js
import React, { PureComponent } from "react";
import "./style.css";

class BaseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "black",
    };
  }
  render(h) {
    const blackBtn = <button className="black">black</button>;
    const whiteBtn = <button className="white">white</button>;
    // if (this.state.theme === "black") {
    //   return blackBtn;
    // } else {
    //   return whiteBtn;
    // }
    return <div>{this.state.theme === "black" ? blackBtn : whiteBtn}</div>;
  }
}
export default BaseDemo;
```

### 循环渲染

```js
import React, { PureComponent } from "react";
import "./style.css";

class BaseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "black",
      list: [
        { id: "id-1", item: "item1" },
        { id: "id-2", item: "item2" },
        { id: "id-3", item: "item3" },
      ],
    };
  }
  render(h) {
    return (
      <div>
        {this.state.list.map((item, index) => {
          return (
            <div key={item.id}>
              index:{index};item:{item.item}
            </div>
          );
        })}
      </div>
    );
  }
}
export default BaseDemo;
```

### React 事件

在 react 的事件中，一定要在构造函数中将其绑定 this,因为默认事件中 this 的指向不是`组件实例`，而是`undefined`。

```js
import React, { PureComponent } from "react";
import "./style.css";

class BaseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "张三",
    };
    //如果不绑定this那么方法中的this指向就会是undefined
    this.clickHandler1 = this.clickHandler1.bind(this);
  }
  render(h) {
    return <div onClick={this.clickHandler1}>{this.state.name}</div>;
  }
  clickHandler1() {
    this.setState({
      name: "法外狂徒",
    });
  }
}
export default BaseDemo;
```

如果觉得这样写看着不舒服的话也可以直接用静态方法，静态方法中的 this 永远指向组件实例。

```js
import React, { PureComponent } from "react";
import "./style.css";

class BaseDemo extends React.Component {
  //...
  clickHandler1 = () => {
    this.setState({
      name: "法外狂徒",
    });
  };
}
export default BaseDemo;
```

#### 传参

传参的时候 event 默认是追加在最后一个参数上

```js
import React, { PureComponent } from "react";
import "./style.css";

class BaseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "张三",
    };
    //如果不绑定this那么方法中的this指向就会是undefined
  }
  render(h) {
    return (
      <div>
        <a
          href="https://www.baidu.com/"
          onClick={this.clickHandler1.bind(this, "jason", "18")}
        >
          {this.state.name}
        </a>
      </div>
    );
  }
  clickHandler1 = (name, age, event) => {
    event.preventDefault(); //阻止默认行为
    event.stopPropagation(); //阻止冒泡
    console.log(name); //jason
    console.log(age); //18
  };
}
export default BaseDemo;
```

#### React 事件与 Vue 中事件的区别

有一点需要注意，在 react 中的 event 并不和 vue 一样，是原生的 event，它是经过封装的。

我们可以打印 event 实例，能够看到它的原型是`SyntheticEvent`。
![](./react/01.png)

而其中的`nativeEvent`才是真正的原生事件对象。

```js
import React, { PureComponent } from "react";
import "./style.css";

class BaseDemo extends React.Component {
  //...
  clickHandler1 = (event) => {
    event.preventDefault(); //阻止默认行为
    event.stopPropagation(); //阻止冒泡
    console.log(event.nativeEvent); //MouseEvent{...}
    console.log(event.nativeEvent.target); //打印出了a标签
    console.log(event.nativeEvent.currentTarget); //document
  };
}
export default BaseDemo;
```

并且`currentTarget`指向的是`document`,这一点和 Vue 也不太一样。

### 表单

#### input

在 react 中没有类似`v-model`这样的双向数据绑定，要实现这种效果需要我们定义`onChange`事件来手动实现。

注意 label 标签中的`for`属性在 js 中是关键字，因此需要改个名。

```js
import React from "react";

class FormDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "jason",
    };
  }
  render() {
    return (
      <div>
        <p>{this.state.name}</p>
        <label htmlFor="inputName">姓名：</label> {/* 用 htmlFor 代替 for */}
        <input
          id="inputName"
          value={this.state.name}
          onChange={this.onInputChange}
        />
      </div>
    );

  }
  onInputChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

export default FormDemo;

```

#### textarea

```js
import React from "react";

class FormDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: "information",
    };
  }
  render() {
    return (
      <div>
        <textarea value={this.state.info} onChange={this.onTextareaChange} />
        <p>{this.state.info}</p>
      </div>
    );
  }
  onInputChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  onTextareaChange = (e) => {
    this.setState({
      info: e.target.value,
    });
  };
}

export default FormDemo;
```

#### select

```js
import React from "react";

class FormDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "beijing",
    };
  }
  render() {
    return (
      <div>
        <select value={this.state.city} onChange={this.onSelectChange}>
          <option value="beijing">北京</option>
          <option value="shanghai">上海</option>
          <option value="shenzhen">深圳</option>
        </select>
        <p>{this.state.city}</p>
      </div>
    );
  }
  onSelectChange = (e) => {
    this.setState({
      city: e.target.value,
    });
  };
}

export default FormDemo;
```

#### checkBox

checkBox 中绑定的是`checked`属性。

```js
import React from "react";

class FormDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: true,
    };
  }
  render() {
    return (
      <div>
        <input
          type="checkbox"
          checked={this.state.flag}
          onChange={this.onCheckboxChange}
        />
        <p>{this.state.flag.toString()}</p>
      </div>
    );
  }
  onCheckboxChange = () => {
    this.setState({
      flag: !this.state.flag,
    });
  };
}

export default FormDemo;
```

#### radio

```js
import React from "react";

class FormDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: "male",
    };
  }
  render() {
    return (
      <div>
        male{" "}
        <input
          type="radio"
          name="gender"
          value="male"
          checked={this.state.gender === "male"}
          onChange={this.onRadioChange}
        />
        female <input
          type="radio"
          name="gender"
          value="female"
          checked={this.state.gender === "female"}
          onChange={this.onRadioChange}
        />
        <p>{this.state.gender}</p>
      </div>
    );
  }
  onRadioChange = (e) => {
    this.setState({
      gender: e.target.value,
    });
  };
}

export default FormDemo;
```

## 组件使用

### 父组件向子组件通信

在使用的时候直接定义属性，然后在子组件内部通过`this.props.属性`来获取值。

> 父组件

```js
class TodoListDemo extends React.Component {
  constructor(props) {
    super(props);
    // 状态（数据）提升
    this.state = {
      list: [
        {
          id: "id-1",
          title: "标题1",
        },
        {
          id: "id-2",
          title: "标题2",
        },
        {
          id: "id-3",
          title: "标题3",
        },
      ],
      footerInfo: "底部文字",
    };
  }
  render() {
    return (
      <div>
        <List list={this.state.list} myprop="test" />
      </div>
    );
  }
}
```

> 子组件

```js
class List extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    //通过解构赋值先将对象中的属性值取出来
    const { list } = this.props;
    return (
      <ul>
        {list.map((item, index) => {
          return (
            <li key={item.id}>
              <span>{item.title}</span>
            </li>
          );
        })}
      </ul>
    );
  }
}
```

### 子组件向父组件通信

在定义属性的时候，直接传一个函数过去，这样子组件在调用函数的时候，就可以顺便把参数给“带出来”。

> 父组件

```js
class TodoListDemo extends React.Component {
  constructor(props) {
    super(props);
    // 状态（数据）提升
    this.state = {
      list: [
        {
          id: "id-1",
          title: "标题1",
        },
        {
          id: "id-2",
          title: "标题2",
        },
        {
          id: "id-3",
          title: "标题3",
        },
      ],
      footerInfo: "底部文字",
    };
  }
  render() {
    return (
      <div>
        {/* 这里传一个函数过去 */}
        <Input submitTitle={this.onSubmitTitle} />
        <List list={this.state.list} />
      </div>
    );
  }
  onSubmitTitle = (title) => {
    this.setState({
      list: this.state.list.concat({
        id: `id-${Date.now()}`,
        title,
      }),
    });
  };
}
```

> 子组件

```js
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
    };
  }
  render() {
    return (
      <div>
        <input value={this.state.title} onChange={this.onTitleChange} />
        <button onClick={this.onSubmit}>提交</button>
      </div>
    );
  }
  onTitleChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  };
  onSubmit = () => {
    const { submitTitle } = this.props;
    //这样的话就能调用父组件的方法，参数也就能传出去了。
    submitTitle(this.state.title); // 'abc'

    this.setState({
      title: "",
    });
  };
}
```

## setState 使用注意点

### 不可变值

注意，如果要更改 state 中的值，**千万不能**直接对 state 中的值进行修改！至少要拷贝出一份然后更新上去。

#### 数组

如果 state 是数组，如果想偷懒的话可以用纯函数。

```js
// 不可变值（函数式编程，纯函数） - 数组
const list5Copy = this.state.list5.slice();
list5Copy.splice(2, 0, "a"); // 中间插入/删除
this.setState({
  list1: this.state.list1.concat(100), // 追加
  list2: [...this.state.list2, 100], // 追加
  list3: this.state.list3.slice(0, 3), // 截取
  list4: this.state.list4.filter((item) => item > 100), // 筛选
  list5: list5Copy, // 其他操作
});
// 注意，不能直接对 this.state.list 进行 push pop splice 等，这样违反不可变值
```

::: tip
结构运算符并不会影响原数组/对象。
:::

#### 对象

```js
// 不可变值 - 对象
this.setState({
  obj1: Object.assign({}, this.state.obj1, { a: 100 }),
  obj2: { ...this.state.obj2, a: 100 },
});
// 注意，不能直接对 this.state.obj 进行属性设置，这样违反不可变值
```

### 异步与同步

正常情况下是 setState 是异步的，只有在回调中才能拿到更新后的值。

```js
this.setState(
  {
    count: this.state.count + 1,
  },
  () => {
    // 联想 Vue $nextTick - DOM
    console.log("count by callback", this.state.count); // 回调函数中可以拿到最新的 state
  }
);
console.log("count", this.state.count); // 异步的，拿不到最新值
```

但是在**定时器**和**自定义事件**的回调中是同步的。

#### 定时器

```js
// setTimeout 中 setState 是同步的
setTimeout(() => {
  this.setState({
    count: this.state.count + 1,
  });
  console.log("count in setTimeout", this.state.count);
}, 0);
```

#### 自定义事件

```js
    bodyClickHandler = () => {
        this.setState({
            count: this.state.count + 1
        })
        console.log('count in body event', this.state.count)
    }
    componentDidMount() {
        // 自己定义的 DOM 事件，setState 是同步的
        document.body.addEventListener('click', this.bodyClickHandler)
    }
    componentWillUnmount() {
        // 及时销毁自定义 DOM 事件
        document.body.removeEventListener('click', this.bodyClickHandler)
        // clearTimeout
    }
```

::: warning
自定义事件与定时器要记得及时销毁。
:::

### 第一个参数 updater

第一个参数除了传对象以外也可以传一个函数进去。

```js
this.setState((state, props) => {
  return { counter: state.counter + props.step };
});
```

## 高级特性

## Redux

## React-router
