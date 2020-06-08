import React from 'react'
import { Text, View } from 'react-native'
import I18n from '../../Language'

const NoMoreDataHint = props => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        height: 47,
        borderBottomColor: '#EFF0F3',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Text style={{ color: '#8395A7', fontSize: 10 }}>{I18n.t('tip.no_more_msg')}</Text>
    </View>
  )
}

export default NoMoreDataHint
