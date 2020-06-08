import React from 'react';
import { View, StyleSheet } from 'react-native';
function BorderedBox(props) {
    const { leftEle, rightEle, style } = props;
    return React.createElement(View, { style: [styles.redBorder, styles.flexBox, style] },
        React.createElement(View, { style: styles.leftDescriptionContent }, leftEle),
        React.createElement(View, { style: styles.separator }),
        React.createElement(View, { style: styles.rightInputContent }, rightEle));
}
export const styles = StyleSheet.create({
    redBorder: {
        marginTop: 16,
        padding: 16,
        height: 52,
        borderColor: 'rgba(241, 91, 64, 0.20)',
        borderRadius: 3,
        borderWidth: 1,
        backgroundColor: '#fff'
    },
    flexBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    separator: {
        width: 2,
        height: 13,
        backgroundColor: '#EFF0F3',
    },
    leftDescriptionContent: {
        paddingLeft: 41,
        flexGrow: 1,
        width: '49%'
    },
    rightInputContent: {
        flexGrow: 1,
        flexDirection: 'row',
        width: '49%',
    },
});
export default BorderedBox;
