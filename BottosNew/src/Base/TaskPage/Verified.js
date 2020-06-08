import React, { Component } from 'react'
import {
  KeyboardAvoidingView,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native'
import BTFetch from '../../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import Config from '../../Tool/Config'
import { getRequestBody } from '../../Tool/FunctionTool'
import BTWaitView from '../../Tool/View/BTWaitView.config'
import I18n from '../../Tool/Language'
import NavStyle from '../../Tool/Style/NavStyle'
import UserInfo from '../../Tool/UserInfo'
// 组件
import LongButton from '../../Tool/View/BTButton/LongButton'
import BTInput from '../../Tool/View/BTInput'

export default class Verified extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      headerLeft: (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
          style={NavStyle.leftButton}>
          <Image
            style={NavStyle.navBackImage}
            source={require('../../BTImage/navigation_back.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: null,
      headerTitle: null,
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      code: '',
      isDisabled: true
    }
  }

  onPress() {
    const { name, code } = this.state
    if (!code) {
      Toast.info(I18n.t('task.verified_tip'), Config.ToestTime, null, false)
      return
    }

    let body = {
      real_name: name,
      card: code
    }
    let requestBody = getRequestBody(body)
    BTWaitView.show(I18n.t('tip.wait_text'))
    BTFetch('/member/certification', requestBody)
      .then(res => {
        BTWaitView.hide()
        const { code, msg } = res
        if (code === '0') {
          Toast.info(
            msg,
            Config.ToestTime,
            () => {
              this.props.navigation.navigate('TaskPage')
            },
            false
          )
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
        BTWaitView.hide()
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
      })
  }

  _onChangeName(name) {
    this.setState({ name, isDisabled: !name })
  }

  render() {
    return (
      <View style={styles.mainBackground}>
        <View style={styles.container}>
          <KeyboardAvoidingView behavior="position">
            <View style={styles.containerTitle}>
              <Text style={styles.containerTitleLoginTitle}>
                {I18n.t('task.verified_title')}
              </Text>
              <Text style={styles.containerTitleLoginTitle}>
                {I18n.t('task.verified_sub_title')}
              </Text>
            </View>
            <View style={styles.containerInputBox}>
              <View>
                <BTInput
                  leftIcon={
                    <Image
                      style={styles.icStyles}
                      source={require('../../BTImage/Login/login_ic_user.png')}
                    />
                  }
                  placeholder={I18n.t('task.verified_input_name')}
                  dataDetectorTypes="all"
                  keyboardType="default"
                  value={this.state.name}
                  onChangeText={value => {
                    this._onChangeName(value)
                  }}
                />
                <BTInput
                  leftIcon={
                    <Image
                      style={styles.icStyles}
                      source={require('../../BTImage/Login/login_ic_user_code.png')}
                    />
                  }
                  placeholder={I18n.t('task.verified_input_code')}
                  dataDetectorTypes="all"
                  keyboardType="default"
                  value={this.state.code}
                  onChangeText={code =>  this.setState({ code })}
                />
              </View>
              <LongButton
                onPress={() => this.onPress()}
                disabled={this.state.isDisabled}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    marginLeft: 24,
    marginRight: 24,
    height: UserInfo.screenH,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingBottom: 16
  },
  icStyles: {
    width: 14,
    height: 14,
    marginLeft: 24,
    marginRight: 16
  },
  containerTitle: {},
  containerTitleLoginTitle: {
    color: '#353B48',
    fontSize: 36,
    fontWeight: '400'
  },
  containerInputBox: {
    marginTop: 56,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
})
