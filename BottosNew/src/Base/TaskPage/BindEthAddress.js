import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native'
import BTFetch from '../../Tool/NetWork/BTFetch'
import { Modal, Toast } from 'antd-mobile-rn'

import Config from '../../Tool/Config'
import { getRequestBody, devlog } from '../../Tool/FunctionTool'
import BTWaitView from '../../Tool/View/BTWaitView.config'
import I18n from '../../Tool/Language'
import NavStyle from '../../Tool/Style/NavStyle'
import FontStyle from '../../Tool/Style/FontStyle'

// 组件
import LongButton from '../../Tool/View/BTButton/LongButton'

export default class BindEthAddress extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      headerLeft: (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            const { bindEthAddressGoBack, self } = navigation.state.params
            bindEthAddressGoBack && bindEthAddressGoBack(self)
            navigation.goBack()
          }}
          style={NavStyle.leftButton}>
          <Image
            style={NavStyle.navBackImage}
            source={require('../../BTImage/navigation_back.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: <Text style={NavStyle.rightButton}> </Text>,
      headerTitle: (
        <Text style={NavStyle.navTitle}>
          {I18n.t('bindEthAddress.navigation')}
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      // 0xb2f69ddf70297958e582a0cc98bce43294f1007d
      value: '',
      disabled: true,
      msg: I18n.t('bindEthAddress.modal_check_tip')
    }
  }

  onPressBind() {
    Modal.alert(I18n.t('tip.warning'), I18n.t('bindEthAddress.modal_tip'), [
      { text: I18n.t('tip.cancel'), onPress: () => {} },
      {
        text: I18n.t('tip.confirm'),
        onPress: () => this.handleOk() //登出
      }
    ])
  }

  // 点击Modal框确定之后发送 绑定地址请求
  handleOk() {
    let body = { eth_address: this.state.value }
    let requestBody = getRequestBody(body)
    BTWaitView.show(I18n.t('tip.wait_text'))
    BTFetch('/member/bindEthAddress', requestBody)
      .then(res => {
        const { code, data, msg } = res
        const { ToestTime } = Config
        if (code === '0') {
          Toast.info(msg, ToestTime, null, false)
          BTWaitView.hide()
        } else if (code === '99') {
          BTWaitView.hide()
          Toast.info(msg, ToestTime, null, false)
          this.props.navigation.navigate('Login')
        } else {
          Toast.info(msg, ToestTime, null, false)
          BTWaitView.hide()
        }
      })
      .catch(res => {
        BTWaitView.hide()
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
      })
  }
  // 0xb2f69ddf70297958e582a0cc98bce43294f1007d
  handleChange(value) {
    if (this.isHEXAddress(value)) {
      this.setState({
        value,
        disabled: false
      })
    } else {
      this.setState({
        value,
        disabled: true
      })
    }
  }
  isHEXAddress(address) {
    return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address)
  }

  render() {
    const { value, disabled, msg } = this.state
    return (
      <ScrollView
        ref="scrollView"
        keyboardShouldPersistTaps="always"
        style={NavStyle.container}>
        <View style={styles.container}>
          <Text style={styles.titleFontStyle}>
            {I18n.t('bindEthAddress.title')}
          </Text>
          <Text style={FontStyle.fontBlue}>
            {I18n.t('bindEthAddress.sub_title')}
          </Text>
          <View style={{ marginBottom: 32, marginTop: 32 }}>
            <Text style={[FontStyle.fontBlue, { color: '#596379' }]}>
              {I18n.t('bindEthAddress.input_tip')}
            </Text>
            <View
              style={{
                borderColor: '#DFEFFE',
                borderWidth: 1,
                borderRadius: 8,
                marginTop: 7,
                height: 100
              }}>
              <TextInput
                value={value}
                underlineColorAndroid="transparent"
                placeholderTextColor="#D1D5DD"
                style={{
                  color: '#596379'
                }}
                numberOfLines={2}
                multiline={true}
                onChangeText={value => {
                  this.handleChange(value)
                }}
              />
            </View>
            <Text style={styles.errorTitle}>{disabled ? msg : ''}</Text>
          </View>
          <LongButton
            disabled={disabled}
            onPress={() => {
              this.onPressBind()
            }}
            title="绑定"
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.titleFontStyle}>
            {I18n.t('bindEthAddress.rule_title')}
          </Text>
          <Text style={styles.ruleContentStyle}>
            {I18n.t('bindEthAddress.rule_content1')}
          </Text>
          <Text style={styles.ruleContentStyle}>
            {I18n.t('bindEthAddress.rule_content2')}
          </Text>
          <Text style={styles.ruleContentStyle}>
            {I18n.t('bindEthAddress.rule_content3')}
          </Text>
          <Text style={styles.ruleContentStyle}>
            {I18n.t('bindEthAddress.rule_content4')}
          </Text>
          <Text style={styles.ruleContentStyle}>
            {I18n.t('bindEthAddress.rule_content5')}
          </Text>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'column',
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: '#fff',
    marginBottom: 16
  },
  titleFontStyle: {
    fontSize: 16,
    color: '#353B48'
  },
  ruleContentStyle: {
    marginTop: 16,
    color: '#8395A7',
    fontSize: 14
  },
  errorTitle: {
    color: '#F15B40',
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 5
  }
})
