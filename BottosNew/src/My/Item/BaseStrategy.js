import React from 'react'
import { Text, TouchableOpacity, Image } from 'react-native'

import FontStyle from '../../Tool/Style/FontStyle'

const BaseStrategy = props => {
  const _onPress = value => {
    const { onPress } = props
    onPress && onPress(value)
  }
  const { title, imageUrl, itemkey } = props
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        _onPress(itemkey)
      }}
      style={{
        width: 104,
        height: 99,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
      <Image style={{ width: 40, height: 40 }} source={imageUrl} />
      <Text style={[FontStyle.fontNormal, { fontSize: 13, marginTop: 16 }]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default BaseStrategy
