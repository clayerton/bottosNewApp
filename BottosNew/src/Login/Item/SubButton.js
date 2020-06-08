import React from 'react'
import { Text, View } from 'react-native'
import I18n from '../../Tool/Language'
import FontStyle from '../../Tool/Style/FontStyle'

const SubButton = props => {
  const _onPress = () => {
    const { onPress } = props
    onPress && onPress()
  }
  const { title, subTitle } = props
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16
      }}>
      <Text style={FontStyle.fontDarkGray}>{title}</Text>
      <Text style={FontStyle.fontBlue} onPress={() => _onPress()}>
        {subTitle}
      </Text>
    </View>
  )
}

export default SubButton
