var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React from 'react';
import { View, Text, StyleSheet, Platform } from "react-native";
const styles = StyleSheet.create({
    luckView: {
        position: 'absolute',
        top: Platform.OS === "ios" ? -2 : 2,
        left: -18,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingLeft: 2,
        // paddingRight: 2,
        width: 17,
        height: 17,
        borderRadius: 9,
        backgroundColor: '#FE4365',
    },
    luckText: {
        fontSize: 12,
        color: "#fff"
    },
});
function Luck(props) {
    const { style } = props, __props = __rest(props, ["style"]);
    return React.createElement(View, Object.assign({ style: [styles.luckView, style] }, __props),
        React.createElement(Text, { style: styles.luckText }, "\u62FC"));
}
export default Luck;
