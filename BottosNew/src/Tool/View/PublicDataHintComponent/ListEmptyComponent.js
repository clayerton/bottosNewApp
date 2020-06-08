import React from 'react'
import { Text, View, Image } from 'react-native'
import I18n from '../../Language'

const ListEmptyComponent = props => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70
      }}>
      <Image
        style={{
          width: 226,
          height: 173
        }}
        source={require('../../../BTImage/PublicComponent/public_list_empty_component.png')}
      />
      <Text style={{ marginTop: 32, color: '#8395A7', fontSize: 16 }}>
        {I18n.t('tip.no_more_to_search1')}
      </Text>
      <Text style={{ marginTop: 16, color: '#D1D5DD', fontSize: 12 }}> {I18n.t('tip.no_more_to_search2')}</Text>
      <Text style={{ color: '#D1D5DD', fontSize: 12 }}>{I18n.t('tip.no_more_to_search3')}</Text>
    </View>
  )
}

export default ListEmptyComponent
