import React, { Component } from 'react';
import { TextInput, Platform } from 'react-native';
// NOTE: 
// 这是从 https://www.jianshu.com/p/49544321295e 借鉴来的
// 如果之后还是输入框不能输中文的问题
// 就用这个组件试一下
class ZHTextInput extends Component {
    shouldComponentUpdate(nextProps) {
        return Platform.OS !== 'ios' || this.props.value === nextProps.value;
    }
    render() {
        return (React.createElement(TextInput, Object.assign({}, this.props)));
    }
}
export default ZHTextInput;
