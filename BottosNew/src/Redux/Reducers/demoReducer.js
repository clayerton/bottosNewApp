
// 初始化的状态
const initialState = {
    data1: '', // 数据 1
    data2: [], // 数据 2
}

// 下面就是 reducer
const demoState = (state = initialState, action) => {
    switch (action.type) {
        // 更新数据
        case 'UPDATE_DATA_1':
            return { ...state, data1: action.data }

        default:
            return state
    }
}

export default demoState
