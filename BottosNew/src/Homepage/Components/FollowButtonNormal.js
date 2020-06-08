import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
// 组件

const FollowButtonNormal = props => {
  const _onPress = () => {
    const { onPress } = props
    onPress && onPress()
  }
  return (
    <View
      onPress={_onPress}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#046FDB',
        width: 50,
        height: 16,
        borderRadius: 8
      }}>
      <Text style={{ color: '#fff', fontSize: 11 }}>关注</Text>
    </View>
  )
}

export default FollowButtonNormal
