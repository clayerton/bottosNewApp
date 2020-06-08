import React from 'react'
import { Text, View, Picker } from 'react-native'
import I18n from '../../Tool/Language'

const DatePicker = props => {
  const { selectedValue, data } = props
  const _onValueChange = value => {
    const { onValueChange } = props
    onValueChange && onValueChange(value)
  }

  const _onPressCancel = () => {
    const { onPressCancel } = props
    onPressCancel && onPressCancel()
  }

  const _onPressConfirm = () => {
    const { onPressConfirm } = props
    onPressConfirm && onPressConfirm()
  }

  return (
    <View style={{ backgroundColor: '#fff', height: 229 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          onPress={_onPressCancel}
          style={{
            width: 80,
            height: 40,
            alignSelf: 'center',
            color: '#046FDB',
            fontSize: 14,
            lineHeight: 40,
            textAlign: 'center'
          }}>
          {I18n.t('tip.cancel')}
        </Text>
        <Text
          onPress={_onPressConfirm}
          style={{
            width: 80,
            height: 40,
            alignSelf: 'center',
            color: '#046FDB',
            fontSize: 14,
            lineHeight: 40,
            textAlign: 'center'
          }}>
          {I18n.t('tip.confirm')}
        </Text>
      </View>
      <Picker
        selectedValue={selectedValue}
        onValueChange={value => _onValueChange(value)}>
        {data &&
          data.map(item => {
            return (
              <Picker.Item
                label={item.date}
                value={item.date}
                key={item.date}
              />
            )
          })}
      </Picker>
    </View>
  )
}

export default DatePicker
