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

## 高级特性

## Redux

## React-router
