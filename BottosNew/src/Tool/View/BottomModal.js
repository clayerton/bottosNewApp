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
import { View, Modal, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
const { height } = Dimensions.get('window');
class BottomModal extends PureComponent {
    constructor() {
        super(...arguments);
        this.handleShow = () => {
            // const { onShow } = this.props
            // if (onShow) onShow()
            // console.log('handleShow')
        };
        this.handlePressClose = () => {
            const { onRequestClose } = this.props;
            if (onRequestClose)
                onRequestClose();
        };
    }
    render() {
        const _a = this.props, { children, style } = _a, _props = __rest(_a, ["children", "style"]);
        return (React.createElement(Modal, Object.assign({ transparent: true, animationType: 'slide' }, _props),
            React.createElement(TouchableWithoutFeedback, { onPress: this.handlePressClose },
                React.createElement(View, { style: styles.modalBackgroud })),
            React.createElement(View, { style: [styles.modal, style] }, children)));
    }
}
export default BottomModal;
const styles = StyleSheet.create({
    modalBackgroud: {
        flex: 1,
        height,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modal: {
        position: 'absolute',
        height: 200,
        width: '100%',
        bottom: 0,
        backgroundColor: '#F7F8FA',
    }
});
