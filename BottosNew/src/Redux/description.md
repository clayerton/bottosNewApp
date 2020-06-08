## 这里是关于 Redux 和 React-Redux 的简介

### Redux
官方描述 Redux 是 JavaScript 状态容器，提供可预测化的状态管理。总之就是存放 state 的。

#### 为什么需要 Redux
可以参照阮一峰老师的文章：
[Redux 入门教程（一）：基本用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)

当应用很复杂的时候，就会需要 Redux 这样的状态管理工具。

#### 用法：
首先可以看一看[中文文档](http://www.redux.org.cn/)
> Ps: 文档讲解很啰嗦

简而言之： redux 主要有这么几个概念：
- Action
- Reducer
- Store

用代码上来理解，在 react 中集成 redux 的写法是这样的：
```js
import { render } from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
)
```
> Ps：Redux 和 React 没有关系，Redux 只是一个 js 的状态管理框架
> 要与 React 绑定使用，通常都是直接使用 react-redux，写法如上

首先 store 是存放 state 的，store 的创建方式如下：

```js
import { createStore } from 'redux'
import reducer from './reducers'
const store = createStore(reducer)
```

所以关键在于 reducer，reducer 是 Redux 中最重要的一个 概念

Reducer 是一个函数，写法如下：

```js
// reducer.js
// 这个就是初始化的 state
const initialState = {
  n: 0,
  data: 1,
}

// 这个就是 reducer 函数
const demoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_DATA':
      return { ...state, data: action.data }
    case 'CHANGE_N':
      return { ...state, n: action.n }
    default:
      return state
  }
}
```

这个 reducer 函数就是用来更新 state 的。

那么怎么触发更新？
之前是通过调用 setState：

```js
this.setState({
  data: 2
})
```

在 Redux 中，需要 dispatch 一个 action 来触发 reducer

一个通常的 action 写法：

```js
// actions.js
export const updataData = (data) => ({
  type: 'CHANGE_DATA',
  data: data
})
```
action 也是一个 函数，返回一个 object，有一个固定的属性 type，是约定写法，type 决定了调用 reducer 里面的那个方法

调用 action 的方法：

```js
import store from './store'
import { updataData } from './actions'
// 然后 dispatch 这个 action
store.dispatch( updataData(2) )

// 实际的效果是 
// store.dispatch({
//   type: 'CHANGE_DATA',
//   data: 2
// })

// 要获取 store 里面的 state
const states = store.getState()
```

那么 Redux 基本用法已经介绍完。

接下来是官方推荐绑定库 React-Redux

### React-Redux
[react-redux 中文文档](http://www.redux.org.cn/docs/react-redux/)

React-Redux 的主要 api 有两个，第一个是 Provider，第二个是 connect。

Provider 的使用方法在上面已经展现过了，将 store 和顶层组件连接起来。

connect 就如同其命名，也是连接的作用。

connect 的典型使用方法如下：

```js
import { updataData } from '../actions'
import { connect } from 'react-redux'

class Demo extends React.Component {
  constructor(props) {
    super(props)

    // data 已经作为 props 传给组件了
    console.log('data', props.data)
  }

  componentDidMount() {
    // updataData 也作为 props 传给组件了
    setTimeout(() => {
      this.props.updata(3)
    }, 3000)
  }

  render() {
    return <div>
      {this.props.data}
    </div>
  }
}

// 这个函数的目的如其命名
// 将 state 映射到组件的 props 当中
// 根据 react 的原则，只传入必要的 props
function mapStateToProps(state) {
  return {
    data: state.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updata: function(data) {
      dispatch( updataData(data) )
    }
  }
}

// 上面两个函数的返回值都是 object，object 的 key 会作为 props 注入到组件当中

export default connect(mapStateToProps, mapDispatchToProps)(Demo)
```

如上，connect 是一个高阶函数，接受函数作为参数并返回一个函数，然后再将组件作为参数传给这个函数

这就是 React Redux 的基本用法了。