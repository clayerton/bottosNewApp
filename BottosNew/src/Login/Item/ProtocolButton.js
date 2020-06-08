import React from 'react'
import { Text, View } from 'react-native'
import I18n from '../../Tool/Language'
import FontStyle from '../../Tool/Style/FontStyle'

const ProtocolButton = props => {
  const _onPress = () => {
    const { onPress } = props
    onPress && onPress()
  }
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Text style={FontStyle.fontNormal}>
        {I18n.t('protocol.protocol_title_tip')}
      </Text>
      <Text style={FontStyle.fontBlue} onPress={() => _onPress()}>
        {I18n.t('protocol.protocol_title')}
      </Text>
    </View>
  )
}

export default ProtocolButton
