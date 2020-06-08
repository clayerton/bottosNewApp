import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

const LoginInput = props => {
  const _onChangeText = value => {
    const { onChangeText } = props
    onChangeText && onChangeText(value)
  }

  const _onLayout = event => {
    const { onLayout } = props
    onLayout && onLayout(event)
  }

  const _onFocus = ()=>{
    const {onFocus} = props
    onFocus && onFocus()
  }
  const _onBlur = ()=>{
    const {onBlur} = props
    onBlur && onBlur()
  }


  const {
    placeholder,
    leftIcon,
    rightIcon,
    keyboardType,
    secureTextEntry,
    value,
    maxLength,
    dataDetectorTypes
  } = props
  return (
    <View style={styles.containerInputItem}>
      {leftIcon ? leftIcon : null}
      <TextInput
        autoCapitalize={'none'}
        value={value}
        secureTextEntry={secureTextEntry}
        dataDetectorTypes={dataDetectorTypes}
        keyboardType={keyboardType}
        maxLength={maxLength}
        underlineColorAndroid="transparent"
        placeholderTextColor="#D1D5DD"
        style={{
          color: '#596379',
          fontSize: 14,
          flex: 9,
          height: 50
        }}
        placeholder={placeholder}
        onLayout={event => {
          _onLayout(event)
        }}
        onChangeText={value => {
          _onChangeText(value)
        }}
        onFocus= {()=>{_onFocus()}}
        onBlur= {()=>{_onBlur()}}
      />
      {rightIcon ? rightIcon : null}
    </View>
  )
}

export default LoginInput

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
  },
  icStyles: {
    width: 14,
    height: 14,
    marginLeft: 24,
    marginRight: 16
  }
})
