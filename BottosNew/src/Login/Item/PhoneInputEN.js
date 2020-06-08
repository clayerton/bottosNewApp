import React from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'

export default (PhoneInputEN = props => {
  const _onChangeText = value => {
    const { onChangeText } = props
    onChangeText && onChangeText(value)
  }

  const _onLayout = event => {
    const { onLayout } = props
    onLayout && onLayout(event)
  }
  const _onPress = () => {
    const { onPress } = props
    onPress && onPress()
  }
  const _onFocus = () => {
    const { onFocus } = props
    onFocus && onFocus()
  }
  const _onBlur = () => {
    const { onBlur } = props
    onBlur && onBlur()
  }
  const { placeholder, leftIcon, rightIcon, value, countryCode } = props
  return (
    <View style={styles.containerInputItem}>
      {leftIcon ? leftIcon : null}

      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          _onPress()
        }}
        style={{
          height: 50,
          width: 64,
          justifyContent: 'center'
        }}>
        <Text style={{ marginLeft: 16 }}>+ {countryCode}</Text>
      </TouchableOpacity>
      <View
        style={{
          height: 13,
          width: 2,
          backgroundColor: '#EFF0F3'
        }}
      />
      <TextInput
        autoCapitalize={'none'}
        value={value}
        maxLength={20}
        dataDetectorTypes="phoneNumber"
        keyboardType="phone-pad"
        underlineColorAndroid="transparent"
        placeholderTextColor="#D1D5DD"
        style={{
          color: '#596379',
          fontSize: 14,
          flex: 9,
          height: 50,
          paddingLeft: 8
        }}
        placeholder={placeholder}
        onLayout={event => {
          _onLayout(event)
        }}
        onChangeText={value => {
          _onChangeText(value)
        }}
        onFocus={() => {
          _onFocus()
        }}
        onBlur={() => {
          _onBlur()
        }}
      />
      {rightIcon ? rightIcon : null}
    </View>
  )
})

const styles = StyleSheet.create({
  containerInputItem: {
    backgroundColor: '#fff',
    borderColor: '#DFEFFE',
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    height: 50
  }
})
