type Update<State> = null | {
  next: Update<State>;
  action: (state: State) => State;
};
type Queue = {
  pending: Update<any> | null;
};

type Hook = null | {
  queue: Queue;
  memoizedState: any;
  next: Hook;
};
interface Fiber {
  memoizedState: Hook;
  stateNode: Function;
}

let isMount = true;
let workInProgressHook: Hook = null; // 用来指示当前正在处理的hook

const fiber: Fiber = {
  memoizedState: null,
  stateNode: App,
};

// 模拟render阶段
function run() {
  workInProgressHook = fiber.memoizedState;
  const app = fiber.stateNode();

  isMount = false; // render之后，commit之前的isMount为false
  return app;
}

function dispatchAction(queue: Queue, action) {
  console.log('触发action');

  const curUpdate: Update<any> = {
    next: null,
    action,
  };

  if (queue.pending == null) {
    // 初始化环状链表
    curUpdate.next = curUpdate;
  } else {
    // 在环状链表中插入元素
    const firstUpdate = queue.pending.next;
    curUpdate.next = firstUpdate; // 当前的更新直接挂到前面(我们先不考虑优先级的问题)
    queue.pending.next = curUpdate; // 尾节点也要跟着更新
  }
  // 我们定义，queue.pending保存最后一个update
  queue.pending = curUpdate;
  // dispatchAction之后触发render
  run();
}

const useState = <T>(initState: T) => {
  let hook: Hook = null;
  if (isMount) {
    hook = {
      queue: {
        pending: null,
      },
      memoizedState: initState,
      next: null,
    };

    if (fiber.memoizedState == null) {
      // 最终把这个初始化的hook挂载到memoizedState上
      fiber.memoizedState = hook;
    } else {
      // 如果已经挂载过了，就追加到后面形成链表(多个hooks的情况)
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    // 因为我们在mount时已经在workInProgressHook变量上保存了
    hook = workInProgressHook;
    workInProgressHook.next = hook;
  }

  let baseState = hook.memoizedState;
  const lastUpdate = hook.queue?.pending; // 我们在dispatchAction中会定义
  //  环状链表,此时cur指向的是链表头
  const firstUpdate = lastUpdate?.next;
  if (lastUpdate) {
    let curUpdate = firstUpdate;
    do {
      const action = curUpdate.action;
      baseState = action(baseState);
      curUpdate = curUpdate.next;
    } while (curUpdate !== firstUpdate);
    // 计算完成，pending置空
    hook.queue.pending = null;
  }

  hook.memoizedState = baseState;
  return [baseState, dispatchAction.bind(null, hook.queue)];
};

function App() {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(1);

  console.log({ count, num });

  return {
    click() {
      setCount((count) => count + 1);
      setNum((num) => num + 1);
    },
  };
}
// @ts-ignore
window.app = run();
