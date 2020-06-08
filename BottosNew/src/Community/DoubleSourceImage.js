var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React, { Component } from 'react';
import { Image } from 'react-native';
import { devlog, getRequestURL } from '../Tool/FunctionTool';
// 由于加载的是网络图片
// 所以 source 一定是一个 object
// 且一定有 uri 这个属性
class DoubleSourceImage extends Component {
    constructor(props) {
        super(props);
        this.onError = () => {
            devlog('Image onError');
            const uri = this.state.uri.replace(getRequestURL(), 'http://139.219.185.167/');
            this.setState({ uri });
        };
        const uri = props.source.uri;
        this.state = {
            uri
        };
    }
    render() {
        const _a = this.props, { source } = _a, props = __rest(_a, ["source"]);
        const uri = this.state.uri;
        const _source = Object.assign({}, source, { uri });
        return (React.createElement(Image, Object.assign({ source: _source }, props, { onError: this.onError })));
    }
}
export default DoubleSourceImage;
