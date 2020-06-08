
/**
 * 这就是一个典型的 action 的写法
 * 是一个函数
 * @param {*} data 是可选参数，根据需要传入，也可以传入多个
 * @return {Object}     返回参数是一个有 type 属性的 object
 */

export const updateData1 = (data) => ({
    type: 'UPDATE_DATA_1',
    data
})