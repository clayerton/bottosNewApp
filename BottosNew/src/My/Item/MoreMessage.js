import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import I18n from '../../Tool/Language'

const MoreMessage = props => {
  const _onPress = () => {
    const { onPress } = props
    onPress && onPress()
  }

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={_onPress}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderColor: '#EFF0F3'
        }}>
        <Text
          style={{
            color: '#8395A7 ',
            fontSize: 10,
            paddingTop: 15,
            paddingBottom: 15
          }}>
          {I18n.t('tip.more_follow')}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default MoreMessage
