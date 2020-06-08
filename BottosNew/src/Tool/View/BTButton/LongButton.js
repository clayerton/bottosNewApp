import React from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import I18n from '../../Language'

const LongButton = props => {
  const _onPress = () => {
    const { onPress } = props
    onPress && onPress()
  }
  const { title, disabled, style, textStyle, loading } = props
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={disabled || loading}
      style={[
        styles.containerInputBoxLoginBtn,
        (disabled || loading)
          ? { backgroundColor: '#D1D5DD' }
          : { backgroundColor: '#046FDB' },
        style
      ]}
      onPress={() => _onPress()}>
      {loading ? (<ActivityIndicator
        animating={true}
        style={{
          marginRight:4
        }}
        size="small"
      />) : null}
      <Text style={[styles.containerInputBoxLoginBtnText, textStyle]}>
        {title ? title : I18n.t('button.confirm')}
      </Text>
    </TouchableOpacity>
  )
}

export default LongButton
const styles = StyleSheet.create({
  containerInputBoxLoginBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    height: 50
  },
  containerInputBoxLoginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
})
