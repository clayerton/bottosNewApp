import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'

interface BorderedBoxProps {
  leftEle: JSX.Element;
  rightEle: JSX.Element;
  style?: ViewStyle;
}
function BorderedBox(props: BorderedBoxProps) {
  const { leftEle, rightEle, style } = props
  return <View style={[styles.redBorder, styles.flexBox, style]}>
    <View style={styles.leftDescriptionContent}>
      {leftEle}
    </View>
    <View style={styles.separator} />
    <View style={styles.rightInputContent}>
      {rightEle}
    </View>
  </View>
}

interface Styles<T> {
  redBorder: T;
  flexBox: T;
  separator: T;
  leftDescriptionContent: T;
  rightInputContent: T;
}

export const styles = StyleSheet.create<Styles<ViewStyle>>({
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
    // justifyContent: 'space-between'
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
})

export default BorderedBox