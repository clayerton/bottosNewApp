import React from 'react'
import { Text, View, Image } from 'react-native'
import I18n from '../Language'

const BTEmptyListView = props => {
  return (
    <View style={{ flexGrow: 1, margin: '20%' }}>
      <Image
        style={{ width: '100%', maxHeight: 200 }}
        resizeMode="contain"
        source={require('../../BTImage/My/my_follow_list_bg.png')}
      />
      <Text style={{ marginTop: 50, textAlign: 'center' }}>
        {I18n.t('community.noPost')}
      </Text>
    </View>
  )
}
export default BTEmptyListView
