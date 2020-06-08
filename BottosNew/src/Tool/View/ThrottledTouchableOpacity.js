var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import throttle from 'lodash-es/throttle';
const propTypes = {
    onPress: PropTypes.func.isRequired,
    waitTime: PropTypes.number,
};
const defaultProps = {
    onPress: () => { },
    waitTime: 1200
};
/**
 * 限制 onPress 调用频率的 TouchableOpacity
 */
class ThrottledTouchableOpacity extends PureComponent {
    constructor() {
        super(...arguments);
        this.throttledPress = throttle(this.props.onPress, this.props.waitTime, { 'trailing': false });
    }
    render() {
        const _a = this.props, { onPress, waitTime, children } = _a, _props = __rest(_a, ["onPress", "waitTime", "children"]);
        return (React.createElement(TouchableOpacity, Object.assign({ activeOpacity: 0.5 }, _props, { onPress: this.throttledPress }), children));
    }
}
ThrottledTouchableOpacity.propTypes = propTypes;
ThrottledTouchableOpacity.defaultProps = defaultProps;
export default ThrottledTouchableOpacity;
