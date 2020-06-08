import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
// 组件

const FollowButtonSelect = props => {
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
        borderRadius: 8,
        borderColor: '#363F4D',
        width: 50,
        height: 16,
        borderWidth: 0.5
      }}>
      <Text style={{ color: '#363F4D', fontSize: 11 }}>已关注</Text>
    </View>
  )
}

export default FollowButtonSelect
