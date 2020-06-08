import React from 'react'
import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import I18n from '../../Tool/Language'

const VerificationCodeInput = props => {
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

  const _onFocus = ()=>{
    const {onFocus} = props
    onFocus && onFocus()
  }
  const _onBlur = ()=>{
    const {onBlur} = props
    onBlur && onBlur()
  }

  const { timerTitle, disabled } = props
  return (
    <View style={styles.mainContainer}>
      <View style={styles.containerInputItem}>
        <Image
          style={styles.icStyles}
          source={require('../../BTImage/Login/login_ic_reset_code.png')}
        />
        <TextInput
          dataDetectorTypes="phoneNumber"
          keyboardType="phone-pad"
          clearButtonMode="while-editing"
          underlineColorAndroid="transparent"
          maxLength={4}
          value={props.value}
          placeholderTextColor="#D1D5DD"
          style={{
            color: '#596379',
            flex: 9
          }}
          placeholder={I18n.t('login.test_verification_code')}
          onLayout={event => {
            _onLayout(event)
          }}
          onChangeText={value => {
            _onChangeText(value)
          }}
          onFocus= {()=>{_onFocus()}}
        onBlur= {()=>{_onBlur()}}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={disabled}
        style={[
          styles.buttonView,
          disabled
            ? { backgroundColor: '#D1D5DD' }
            : { backgroundColor: '#046FDB' }
        ]}
        onPress={() => _onPress()}>
        <Text style={styles.buttonText}>{timerTitle}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default VerificationCodeInput

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  containerInputItem: {
    flex: 6,
    backgroundColor: '#fff',
    borderColor: '#DFEFFE',
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  icStyles: {
    width: 14,
    height: 14,
    marginLeft: 24,
    marginRight: 16
  },
  buttonView: {
    flex: 3,
    height: 32,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    // paddingTop: 10,
    // paddingBottom: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    // marginTop: 14,
    // marginBottom: 14
  }
})
