import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'

const SettingsListItem = props => {
  const _onPress = value => {
    const { onPress } = props
    onPress && onPress(value)
  }
  const { icon, keyItem, title } = props
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        _onPress(keyItem)
      }}
      style={{
        paddingLeft: 24,
        paddingRight: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 18,
        paddingBottom: 18
      }}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          style={{ width: 20, height: 20, marginRight: 24 }}
          source={icon}
        />
        <Text>{title}</Text>
      </View>
      <Image
        style={{ width: 16, height: 16 }}
        source={require('../../BTImage/My/my_settings_ic_arr_right.png')}
      />
    </TouchableOpacity>
  )
}

export default SettingsListItem
