import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  DeviceEventEmitter
} from 'react-native'
import BTFetch from '../../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import { getRequestBody } from '../../Tool/FunctionTool'
import NavStyle from '../../Tool/Style/NavStyle'
import FontStyle from '../../Tool/Style/FontStyle'

import Config from '../../Tool/Config'
import I18n from '../../Tool/Language'

// 组件
import BTWaitView from '../../Tool/View/BTWaitView.config'

export default class Realinfomation extends Component {
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
      headerRight: <Text style={NavStyle.rightButton}> </Text>,
      headerTitle: (
        <Text style={NavStyle.navTitle}>
          {I18n.t('realinfomation.header_title')}
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      ethAddress: '' // 以太网地址
    }
  }
  componentDidMount() {
    this.getCertificationInfo() // 请求身份证
    //this.getEthAddress() // 请求以太网地址
  }

  // 请求身份证
  getCertificationInfo() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTWaitView.show(I18n.t('tip.wait_text'))
    BTFetch('/member/certificationInfo', requestBody)
      .then(res => {
        BTWaitView.hide()
        if (res.code === '0') {
          this.setState({
            data: res.data
          })
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
        BTWaitView.hide()
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
      })
  }

  // 请求以太网地址
  getEthAddress() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/member/getEthAddress', requestBody)
      .then(res => {
        if (res.code === '0') {
          this.setState({
            ethAddress: res.data.eth_address
          })
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
      })
  }
  render() {
    const { data, ethAddress } = this.state
    const { idcard, real_name } = data
    return (
      <ScrollView
        ref="scrollView"
        keyboardShouldPersistTaps="always"
        style={NavStyle.container}>
        <View style={styles.item}>
          <Text style={[FontStyle.fontNormal, { width: 80 }]}>
            {I18n.t('realinfomation.name')}
          </Text>
          <View style={{ width: 2, height: 13, backgroundColor: '#EFF0F3' }} />
          <Text style={[FontStyle.fontNormal, { width: 100 }]}>
            {real_name}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={[FontStyle.fontNormal, { width: 80 }]}>
            {I18n.t('realinfomation.code')}
          </Text>
          <View style={{ width: 2, height: 13, backgroundColor: '#EFF0F3' }} />
          <Text style={[FontStyle.fontNormal, { width: 100 }]}>{idcard}</Text>
        </View>

       {/* <View
          style={[
            styles.item,
            {
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              height:100
            }
          ]}>
          <Text style={[FontStyle.fontNormal]}>{I18n.t('realinfomation.eth_address')}:</Text>
          <Text style={[FontStyle.fontLightGray,{marginTop:8}]}>{ethAddress}</Text>
        </View>*/}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    height: 52,
    borderColor: '#DFEFFE',
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: 16,
    paddingRight: 16
  }
})
