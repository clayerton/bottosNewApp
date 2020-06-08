import React, { Component } from 'react'
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'
import {
  REQUEST_WITH_DRAW_CONFIG, // 资产传出 基本信息
  REQUEST_WITH_DRAW_MOBILE_CODE_VERIFY // 转出发验证码
} from '../../Redux/Actions/ActionsTypes'
import { Toast } from 'antd-mobile-rn'

import { devlog, getRequestBody } from '../../Tool/FunctionTool'
import BTFetch from '../../Tool/NetWork/BTFetch'
import NavStyle from '../../Tool/Style/NavStyle'
import I18n from '../../Tool/Language/index'
import Config from '../../Tool/Config'
import BTWaitView from '../../Tool/View/BTWaitView.config'
import LongButton from '../../Tool/View/BTButton/LongButton'
import UserInfo from '../../Tool/UserInfo'
import { PasswordModal } from 'react-native-pay-password'
import VerificationCodeInput from '../../Login/Item/VerificationCodeInput'

class AssetOut extends Component {
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
          {I18n.t('asset_detail.button_out')}
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      in_address: '',
      in_num: '',
      isDisabled: true, //确定按钮是否可点
      isModleShow: false, //验证码界面是否显示
      isModleGetSMS: true, //验证码按钮是否可点
      SMSCountDown: 60, //倒计时时间
      SMSText: I18n.t('asset_detail.pay_SMS_again_button'), //倒计时显示的文本
      AssetType: this.props.navigation.state.params,
      MobileCodeVerify: '',
      isShowCodeVerifyMsg: false,
      withdrawConfigState: {},
      animating: false
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: REQUEST_WITH_DRAW_CONFIG
    })
  }

  componentWillReceiveProps(nextProps) {
    if (
      !is(fromJS(nextProps.withdrawConfig), fromJS(this.props.withdrawConfig))
    ) {
      const temp =
        nextProps.withdrawConfig.data &&
        this.createServiceCharge(nextProps.withdrawConfig)
      this.setState({
        withdrawConfigState: temp
      })
    }
  }
  onAddress(value) {
    if (
      value === null ||
      value === '' ||
      this.state.in_num === null ||
      this.state.in_num === ''
    ) {
      this.setState({
        isDisabled: true
      })
    } else {
      this.setState({
        isDisabled: false
      })
    }
    this.state.in_address = value
  }

  onNum(value) {
    const { withdrawConfig } = this.props

    if (
      value === null ||
      value === '' ||
      this.state.in_address === null ||
      this.state.in_address === '' ||
      (value < withdrawConfig.data.limit_down ||
        value > withdrawConfig.data.limit_up)
    ) {
      this.setState({
        isDisabled: true
      })
    } else {
      this.setState({
        isDisabled: false
      })
    }
    this.state.in_num = value
  }

  onClickSubmit() {
    const { in_address, in_num, withdrawConfigState, AssetType } = this.state
    const { withdrawConfig } = this.props

    if (in_address === '') {
      Toast.info(I18n.t('base.shop_real_name'), Config.ToestTime, null, false)
      return
    }
    if (in_num === '') {
      Toast.info(I18n.t('base.shop_phone_empty'), Config.ToestTime, null, false)
      return
    }

    if (in_num > AssetType.value) {
      Toast.info(
        `可用 ${AssetType.name} 不足请转入`,
        Config.ToestTime,
        null,
        false
      )
      return
    }

    if (
      withdrawConfig.data &&
      withdrawConfig.data.service_charge > withdrawConfigState.value
    ) {
      Toast.info(
        `手续费 ${withdrawConfigState.name} 不足请转入`,
        Config.ToestTime,
        null,
        false
      )
      return
    }

    this.refs.modal.show()
  }

  onClickConfirmALert(data) {
    BTWaitView.show(I18n.t('tip.wait_text'))
    const { in_address, in_num, AssetType } = this.state

    //等待密码model消失在执行，不然WaitView会不消失
    setTimeout(() => {
      let body = {
        token: UserInfo.token,
        pay_password: data,
        token_type: AssetType.name,
        value: in_num,
        chain_type: AssetType.chain_type,
        // dst_account: in_address
        dst_account: '0x314b24CaC9d5e7F7feBed436B7BBA7c0c732C7B7'
      }

      let requestBody = getRequestBody(body)
      BTFetch('/withdraw/withdrawDeposit', requestBody)
        .then(res => {
          BTWaitView.hide()
          if (res.code === '0') {
            setTimeout(() => {
              this.setState({
                isModleShow: true
              })
              this.onClickSMSButton()
            }, 600)
          } else if (res.code === '-3') {
            Toast.info(res.msg, Config.ToestTime, null, false)

            setTimeout(() => {
              this.refs.modal.show()
            }, 1000)
          } else if (res.code === '99') {
            Toast.info(res.msg, Config.ToestTime, null, false)
            DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
          } else {
            Toast.info(res.msg, Config.ToestTime, null, false)
          }
        })
        .catch(res => {
          BTWaitView.hide()
          Toast.fail(Config.ToestFailContent, Config.ToestTime, null, false)
        })
    }, 600)
  }

  onClickSMSButton = () => {
    this.setState({
      isModleGetSMS: true,
      SMSText: this.state.SMSCountDown + 'S'
    })

    //倒计时
    this.interval = setInterval(() => {
      let value = this.state.SMSCountDown - 1
      this.setState({
        SMSCountDown: value,
        SMSText: value + 'S'
      })

      if (value <= 0) {
        clearInterval(this.interval)
        this.setState({
          isModleGetSMS: false,
          SMSText: I18n.t('asset_detail.pay_SMS_again_button'),
          SMSCountDown: 6
        })
      }
    }, 1000)
  }

  onClickSMSConfirm = () => {
    const { in_address, in_num, AssetType, MobileCodeVerify } = this.state

    if (MobileCodeVerify.length == 4) {
      this.setState({
        isShowCodeVerifyMsg: false,
        isModleShow: false
      })
      BTWaitView.show('请稍后')

      // TODO:
      let body = {
        mobile: UserInfo.mobile,
        code: MobileCodeVerify,
        // dst_account: in_address,
        dst_account: '0x314b24CaC9d5e7F7feBed436B7BBA7c0c732C7B7',
        chain_type: AssetType.chain_type,
        value: in_num,
        token_type: AssetType.name
      }
      let requestBody = getRequestBody(body)

      BTFetch('/withdraw/mobileCodeVerify', requestBody)
        .then(res => {
          BTWaitView.hide()

          if (res.code === '0') {
            this.props.navigation.navigate('AssetResults', { ...res.data })
          } else if (res.code === '-1') {
            Toast.info(res.msg, Config.ToestTime, null, false)
          } else if (res.code === '99') {
            Toast.info(res.msg, Config.ToestTime, null, false)
            DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
          } else {
            Toast.info(res.msg, Config.ToestTime, null, false)
          }
        })
        .catch(res => {
          Toast.fail(Config.ToestFailContent, Config.ToestTime, null, false)
        })
    } else {
      this.setState({
        isShowCodeVerifyMsg: true
      })
    }
  }

  createServiceCharge(withdrawConfig) {
    const { MemberAssets } = this.props
    return (
      MemberAssets.data &&
      withdrawConfig.data &&
      MemberAssets.data.find(item => {
        return item.currency_id == withdrawConfig.data.service_charge_id
      })
    )
  }

  render() {
    const { withdrawConfig } = this.props
    const {
      AssetType,
      isShowCodeVerifyMsg,
      withdrawConfigState,
      animating
    } = this.state

    return (
      <View style={NavStyle.container}>
        {/* 支付密码组件 */}
        <PasswordModal
          ref="modal"
          title={I18n.t('tip.pay_password_title')}
          onDone={data => {
            this.onClickConfirmALert(data)
          }}
        />
        {/* 验证码 */}
        <Modal
          animationType={'none'}
          transparent={true}
          visible={this.state.isModleShow}>
          <View
            style={{
              width: UserInfo.screenW,
              height: UserInfo.screenH,
              backgroundColor: '#00000099',
              alignItems: 'center'
            }}>
            <View
              style={{
                marginTop: 147,
                height: isShowCodeVerifyMsg ? 233 : 219,
                width: 310,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: '#00000000',
                backgroundColor: '#FFFFFF'
              }}>
              <Text style={[styles.modelText, { marginTop: 22 }]}>
                {I18n.t('asset_detail.pay_SMS_phone_text')}
              </Text>
              <Text style={styles.modelText}>
                {UserInfo.mobile}
                {I18n.t('asset_detail.pay_SMS_send_text')}
              </Text>
              <View style={styles.mainContainer}>
                <View style={styles.containerInputItem}>
                  <Image
                    style={styles.icStyles}
                    source={require('../../BTImage/Login/login_ic_phone.png')}
                  />
                  <TextInput
                    dataDetectorTypes="phoneNumber"
                    keyboardType="phone-pad"
                    clearButtonMode="while-editing"
                    underlineColorAndroid="transparent"
                    maxLength={4}
                    onChangeText={value => {
                      this.setState({
                        MobileCodeVerify: value
                      })
                    }}
                    value={this.state.MobileCodeVerify}
                    placeholderTextColor="#D1D5DD"
                    style={{ color: '#596379', flex: 1 }}
                    placeholder={I18n.t('login.test_verification_code')}
                  />
                </View>

                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={this.state.isModleGetSMS}
                  style={[
                    styles.buttonView,
                    this.state.isModleGetSMS
                      ? { backgroundColor: '#D1D5DD' }
                      : { backgroundColor: '#046FDB' }
                  ]}
                  onPress={this.onClickSMSButton}>
                  <Text style={styles.buttonText}>{this.state.SMSText}</Text>
                </TouchableOpacity>
              </View>
              {isShowCodeVerifyMsg ? (
                <Text
                  style={{
                    color: 'red',
                    fontSize: 12,
                    marginLeft: 18,
                    marginTop: 6
                  }}>
                  验证码为4位,请确认输入无误
                </Text>
              ) : null}

              <View
                style={{ backgroundColor: '#EFF0F3', height: 1, marginTop: 24 }}
              />
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                  }}
                  onPress={() => {
                    this.setState({
                      isModleShow: false
                    })
                  }}>
                  <Text style={styles.textbutton}>{I18n.t('tip.cancel')}</Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: '#EFF0F3', width: 1 }} />
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                  }}
                  onPress={this.onClickSMSConfirm}>
                  <Text style={styles.textbutton}>{I18n.t('tip.confirm')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View
          style={{
            marginLeft: 16,
            marginRight: 16,
            marginTop: 16,
            height: 75,
            borderWidth: 1,
            borderRadius: 3,
            borderColor: '#DFEFFE',
            backgroundColor: '#FFFFFF'
          }}>
          <TextInput
            style={{
              marginLeft: 16,
              marginRight: 16,
              flex: 1,
              fontSize: 14,
              color: '#596379'
            }}
            keyboardType="default"
            maxLength={100}
            underlineColorAndroid="transparent"
            placeholder={I18n.t('asset_detail.input_address')}
            clearButtonMode="while-editing"
            blurOnSubmit={true}
            onChangeText={value => {
              this.onAddress(value)
            }}
            value={this.state.in_address}
          />
        </View>
        <View
          style={{
            marginLeft: 16,
            marginRight: 16,
            marginTop: 16,
            flexDirection: 'row',
            height: 52,
            borderWidth: 1,
            borderRadius: 3,
            borderColor: '#DFEFFE',
            backgroundColor: '#FFFFFF'
          }}>
          <TextInput
            style={{ marginLeft: 16, flex: 1, fontSize: 14, color: '#596379' }}
            keyboardType="number-pad"
            maxLength={100}
            underlineColorAndroid="transparent"
            placeholder={I18n.t('asset_detail.input_num')}
            clearButtonMode="while-editing"
            blurOnSubmit={true}
            onChangeText={value => {
              this.onNum(value)
            }}
            value={this.state.in_num}
          />
          <Text
            style={{
              textAlign: 'center',
              lineHeight: 52,
              height: 52,
              width: 60,
              marginRight: 54,
              fontSize: 14,
              color: '#596379'
            }}>
            {AssetType.name}
          </Text>
        </View>
        <Text style={styles.textshow}>
          {I18n.t('asset_detail.use_num')}
          {AssetType.value} {AssetType.name}
        </Text>

        <Text style={[styles.textshow, { marginTop: 4 }]}>
          {I18n.t('asset_detail.poundage')}{' '}
          {withdrawConfig.data && withdrawConfig.data.service_charge}{' '}
          {withdrawConfigState && withdrawConfigState.name}
        </Text>
        <Text style={[styles.textshow, { marginTop: 4 }]}>
          {I18n.t('asset_detail.min_num')}
          {withdrawConfig.data && withdrawConfig.data.limit_down}{' '}
          {AssetType.name}
          {I18n.t('asset_detail.max_num')}
          {withdrawConfig.data && withdrawConfig.data.limit_up} {AssetType.name}
        </Text>
        <Text style={[styles.textshow, { marginTop: 4 }]}>
          {withdrawConfig.data && withdrawConfig.data.time}
          {I18n.t('asset_detail.payment_date')}
        </Text>

        <LongButton
          style={{ marginLeft: 24, marginRight: 24, marginTop: 32, height: 50 }}
          onPress={() => this.onClickSubmit()}
          disabled={this.state.isDisabled}
          title={I18n.t('asset_detail.button_out2')}
        />
      </View>
    )
  }
}

function mapStateToProps({ memberAssetsState }) {
  const { withdrawConfig, MemberAssets } = memberAssetsState
  return { withdrawConfig, MemberAssets }
}
export default connect(mapStateToProps)(AssetOut)

const styles = StyleSheet.create({
  textshow: {
    textAlign: 'left',
    lineHeight: 20,
    height: 20,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    fontSize: 12,
    color: '#596379'
  },
  modelText: {
    textAlign: 'center',
    lineHeight: 20,
    height: 20,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 8,
    fontSize: 16,
    color: '#353B48'
  },
  textbutton: {
    textAlign: 'center',
    lineHeight: 30,
    height: 30,
    marginLeft: 0,
    marginRight: 0,
    fontSize: 20,
    color: '#353B48'
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  containerInputItem: {
    backgroundColor: '#fff',
    borderColor: '#DFEFFE',
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 165,
    marginLeft: 15
  },
  icStyles: {
    width: 16,
    height: 16,
    marginLeft: 24,
    marginRight: 16
  },
  buttonView: {
    flex: 3,
    borderRadius: 100,
    height: 32,
    marginLeft: 16,
    marginRight: 17,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 13
  }
})
