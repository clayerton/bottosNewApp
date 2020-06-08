
import React from 'react'
import { View, Text, StyleSheet, ViewProps, Platform } from "react-native";

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
})

function Luck(props: ViewProps) {
  const { style, ...__props } = props
  return <View style={[styles.luckView, style]} {...__props}>
    <Text style={styles.luckText}>拼</Text>
  </View>
}

export default Luck