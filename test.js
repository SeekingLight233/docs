var isMount = true;
var workInProgressHook = null; // 用来指示当前正在处理的hook
var fiber = {
    memoizedState: null,
    stateNode: App
};
// 模拟render阶段
function run() {
    workInProgressHook = fiber.memoizedState;
    var app = fiber.stateNode();
    isMount = false; // render之后，commit之前的isMount为false
    return app;
}
function dispatchAction(queue, action) {
    console.log('触发action');
    var curUpdate = {
        next: null,
        action: action
    };
    if (queue.pending == null) {
        // 初始化环状链表
        curUpdate.next = curUpdate;
    }
    else {
        // 在环状链表中插入元素
        var firstUpdate = queue.pending.next;
        curUpdate.next = firstUpdate; // 当前的更新直接挂到前面(我们先不考虑优先级的问题)
        queue.pending.next = curUpdate; // 尾节点也要跟着更新
    }
    // 我们定义，queue.pending保存最后一个update
    queue.pending = curUpdate;
    // dispatchAction之后触发render
    run();
}
var useState = function (initState) {
    var _a;
    var hook = null;
    if (isMount) {
        hook = {
            queue: {
                pending: null
            },
            memoizedState: initState,
            next: null
        };
        if (fiber.memoizedState == null) {
            // 最终把这个初始化的hook挂载到memoizedState上
            fiber.memoizedState = hook;
        }
        else {
            // 如果已经挂载过了，就追加到后面形成链表(多个hooks的情况)
            workInProgressHook.next = hook;
        }
        workInProgressHook = hook;
    }
    else {
        // 因为我们在mount时已经在workInProgressHook变量上保存了
        hook = workInProgressHook;
        workInProgressHook.next = hook;
    }
    var baseState = hook.memoizedState;
    var lastUpdate = (_a = hook.queue) === null || _a === void 0 ? void 0 : _a.pending; // 我们在dispatchAction中会定义
    //  环状链表,此时cur指向的是链表头
    var firstUpdate = lastUpdate === null || lastUpdate === void 0 ? void 0 : lastUpdate.next;
    if (lastUpdate) {
        var curUpdate = firstUpdate;
        do {
            var action = curUpdate.action;
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
    var _a = useState(0), count = _a[0], setCount = _a[1];
    var _b = useState(1), num = _b[0], setNum = _b[1];
    console.log({ count: count, num: num });
    return {
        click: function () {
            setCount(function (count) { return count + 1; });
            setNum(function (num) { return num + 1; });
        }
    };
}
// @ts-ignore
window.app = run();
