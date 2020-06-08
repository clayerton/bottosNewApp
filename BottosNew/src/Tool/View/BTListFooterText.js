import React from 'react'
import { Text } from 'react-native'
import I18n from '../Language'

const BTListFooterText = props => {
  return (
    <Text style={{ textAlign: 'center' }}>
      {I18n.t('community.loading_wait')}
    </Text>
  )
}

export default BTListFooterText
