import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    NativeModules,
    Platform, DeviceEventEmitter
} from 'react-native'
import {Modal, Toast} from 'antd-mobile-rn'

import { getRequestBody, devlog , getRequestURL,getImageURL} from '../../Tool/FunctionTool'

import I18n from '../../Tool/Language'

import NavStyle from '../../Tool/Style/NavStyle'
import Config from '../../Tool/Config'
import BTFetch from '../../Tool/NetWork/BTFetch'
// 组件
import SettingsListItem from '../Item/SettingsListItem'
import UserInfo from '../../Tool/UserInfo'
import BTWaitView from "../../Tool/View/BTWaitView.config";
import ModiPassword from "./ParForPassword/ModiPassword";

var ClientUpdateModule = NativeModules.ClientUpdateModule
export default class Settings extends Component {
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
        <Text style={NavStyle.navTitle}>{I18n.t('settings.header_title')}</Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props);
      this.isPayFor = props.navigation.state.params; //从父级获取到是否设置支付密码 true已设置 false 未设置
    let ListData0 = UserInfo.mobile != '15866666666' ?
     [
      {
        icon: require('../../BTImage/My/my_ic_notification.png'),
        title: I18n.t('settings.list1_Realinfomation'),
        keyItem: 'Realinfomation'
      },
        {
            icon: require('../../BTImage/My/my_ic_ethAddress.png'),
            title: I18n.t('settings.list1_EthAddress'),
            keyItem: 'EthAddress'
        },
    ] :
    []

    this.state = {
      ListData1: [
          ...ListData0,
          {
              icon: require('../../BTImage/My/my_ic_PayforPassword.png'),
              title: this.isPayFor ? I18n.t('settings.list1_RevisePassWord') : I18n.t('settings.list1_PassWord'),
              keyItem: 'PayforPassword'
          },
        {
          icon: require('../../BTImage/My/my_settings_ic_3.png'),
          title: I18n.t('settings.list1_Feedback'),
          keyItem: 'Feedback'
        },
        {
          icon: require('../../BTImage/My/my_ic_blacklist.png'),
          title: '黑名单',
          keyItem: 'BlackList'
        },
        {
          icon: require('../../BTImage/My/my_settings_ic_6.png'),
          title: I18n.t('settings.list1_ContactUs'),
          keyItem: 'ContactUs'
        }
      ],
      ListData2: [
        {
          icon: require('../../BTImage/My/my_settings_ic_7.png'),
          title:I18n.t('settings.list2_PrivacyPolicy'), 
          keyItem: 'ServiceTerms'
        },
        {
          icon: require('../../BTImage/My/my_settings_ic_8.png'),
          title: I18n.t('settings.list2_ServiceTerms'),
          keyItem: 'PrivacyPolicy'
        },
        {
          icon: require('../../BTImage/My/my_settings_ic_9.png'),
          title: I18n.t('settings.list2_VersionLog'),
          keyItem: 'VersionLog'
        }
      ],
      ListData3: [
        {
          icon: require('../../BTImage/My/my_settings_ic_4.png'),
          title: I18n.t('settings.list1_LoginOut'),
          keyItem: 'LoginOut'
        }
      ]
    }
  }

  // 检查更新

  updateModal() {

      if (ClientUpdateModule) {
          if (Platform.OS === 'ios') {
              ClientUpdateModule.checkUpdate(
                getRequestURL() + Config.URLSuffix + '/app/checkAppVersion?client=2&sign=cd174dc81c2ee3e7d52914859cbc4c92',
                  1,
                  {
                      update_new_version: I18n.t('base.update_new_version'),
                      update_update: I18n.t('base.update_update'),
                      update_is_new_version: I18n.t('base.update_is_new_version'),
                      update_data_error: I18n.t('base.update_data_error'),
                      update_cancel: I18n.t('tip.cancel'),
                      update_offline: I18n.t('tip.offline'),
                  },
                  (error, events) => {

                  }
              )
          } else if (Platform.OS === 'android') {
              ClientUpdateModule.checkUpdate(
                getRequestURL() + Config.URLSuffix + '/app/checkAppVersion?client=1&sign=ab2396ba0328ea6cd845b7dbc8e8db23',
                  1,
                  msg => {

                  }
              )
          }
      }
  }

  // 登出
  loginOut() {
    Modal.alert(I18n.t('settings.tip'), I18n.t('settings.login_out_msg'), [
      { text: I18n.t('tip.cancel'), onPress: () => {} },
      {
        text: I18n.t('tip.confirm'),
        onPress: () => this.props.navigation.navigate('Login') //登出
      }
    ])
  }

    listpushTo(value){
      if(value === 'PayforPassword'){
          this.PayforPassword()
      }else if(value === 'Realinfomation'){
          this.ifverified();
      }else if(value === 'EthAddress'){
          this.bindEthAddressStatus()
      }
      else{
          this.props.navigation.navigate(value)
      }
    }
    //是否实名
    ifverified() {
        let body = {}
        let requestBody = getRequestBody(body)
        // BTWaitView.show(I18n.t('tip.wait_text'))
        BTFetch('/member/certificationInfo', requestBody)
            .then(res => {
                BTWaitView.hide()
                if (res.code === '0') {
                    this.props.navigation.navigate('Realinfomation')
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
    // 绑定以太网钱包 状态
    bindEthAddressStatus() {
        let body = {}
        let requestBody = getRequestBody(body)
        // BTWaitView.show(I18n.t('tip.wait_text'))
        BTFetch('/member/getEthAddress', requestBody)
            .then(res => {
                BTWaitView.hide()
                if (res.code === '0') {
                    if(res.data!==null)
                        this.props.navigation.navigate('EthAddress')
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
    //是否设置密码
    PayforPassword() {
      //this.isPayFor true 修改密码 false 设置密码  ModiPassword
        this.isPayFor ?
            this.props.navigation.push('ModiPassword')
            :
            this.props.navigation.push('PayforPassword') ;
    }

  render() {
    const { ListData1, ListData2, ListData3 } = this.state
    return (
      <ScrollView
        ref="scrollView"
        keyboardShouldPersistTaps="always"
        style={NavStyle.container}>
        <View
          style={{
            paddingTop: 24,
            paddingBottom: 24,
            backgroundColor: '#fff'
          }}>
          {ListData1 &&
            ListData1.map(item => {
              return (
                <SettingsListItem
                  {...item}
                  onPress={value => {
                    value === 'LoginOut' && this.loginOut() // 登出
                      this.listpushTo(value)
                      // value === 'PayforPassword' && this.PayforPassword() //设置密码
                    // this.props.navigation.navigate(value)
                  }}
                />
              )
            })}
        </View>
        <View
          style={{
            paddingTop: 24,
            paddingBottom: 24,
            backgroundColor: '#fff',
            marginTop: 16
          }}>
          {ListData2 &&
            ListData2.map(item => {
              return (
                <SettingsListItem
                  {...item}
                  onPress={value => {
                    this.props.navigation.navigate(value)
                  }}
                />
              )
            })}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.updateModal()}
            style={{
              flexDirection: 'row',
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 18,
              paddingBottom: 18
            }}>
            <Image
              style={{ width: 20, height: 20, marginRight: 24 }}
              source={require('../../BTImage/My/my_settings_ic_10.png')}
            />
            <Text>{I18n.t('settings.updateButton')}</Text>
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 18,
              color: '#8395A7',
              fontSize: 14
            }}>
             Version {UserInfo.version}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#fff',
            marginBottom: 16,
            marginTop: 16
          }}>
          {ListData3 &&
            ListData3.map(item => {
              return (
                <SettingsListItem
                  {...item}
                  onPress={value => {
                    value === 'LoginOut' && this.loginOut() // 登出
                  }}
                />
              )
            })}
        </View>
      </ScrollView>
    )
  }
}
