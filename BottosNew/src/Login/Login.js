import React, { Component } from 'react'
import {
  KeyboardAvoidingView,
  Text,
  Button,
  View,
  TouchableOpacity,
  Image,
  BackAndroid,
  Keyboard,
  Platform,
  StyleSheet,
  NativeModules,
  DeviceEventEmitter
} from 'react-native'
import BTFetch from '../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import Config from '../Tool/Config'
import {
  clearMapForKey,
  setLocalStorage,
  getRequestBody,
  getLocalStorage,
  isZHLanguage,
  prefixPadding0,
  devlog,
  getRequestURL
} from '../Tool/FunctionTool'
import UserInfo, { clearData } from '../Tool/UserInfo'
import FontStyle from '../Tool/Style/FontStyle'
import BTWaitView from '../Tool/View/BTWaitView.config'
import I18n from '../Tool/Language'
import Protocol from './Item/ProtocolButton'
import LongButton from '../Tool/View/BTButton/LongButton'
import BTInput from '../Tool/View/BTInput'
import SubButton from './Item/SubButton'
import PhoneInputEN from './Item/PhoneInputEN'
import CountryCodeList from '../Tool/View/CountryCodeList'
import ShareUtil from '../Tool/UM/ShareUtil'
import BTAd from '../Tool/View/BTAd/BTAd'

let RSAModule = NativeModules.RSAModule

const inputComponents = []
class Login extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      gesturesEnabled: false, // 是否支持滑动返回手势
      header: null //隐藏顶部导航栏
    }
  }

  constructor(props) {
    super(props)
    //清理用户信息
    clearData()
    //删除login的本地数据
    clearMapForKey(Config.LoginStorage)

    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
    }

    this.state = {
      isInstallShareAPP: true,
      phoneNumber: '',
      password: '',
      isShowPassword: true,
      isDisabledLoginButton: true,
      isShowCountryCodePicker: false, // 是否显示区号选择
      countryCode: '86', // 区号
      isZHLanguage: isZHLanguage()
    }
  }

  componentDidMount() {
    //获取ios设备是否安装微信
    if (Platform.OS === 'ios') {
      ShareUtil.isInstallShareAPP(2, code => {
        if (code === '0') {
          this.setState({
            isInstallShareAPP: false
          })
        }
      })
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }
  onBackAndroid() {
    //登录界面不能返回
    return true
  }
  // 手机号校验
  isPhoneAvailable(phone) {
    let myreg = /^[1][3.4,5,7,8,9][0-9]{9}$/
    if (!myreg.test(phone)) {
      return false
    } else {
      return true
    }
  }

  // 密码校验
  isPasswordAvailable(password) {
    let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //至少8个字符，至少1个字母和1个数字,不能包含特殊字符（非数字字母)
    if (!reg.test(password)) {
      return false
    } else {
      return true
    }
  }

  onClickLogin() {
    const { phoneNumber, password, isZHLanguage, countryCode } = this.state

    // 判断是否为大陆手机号
    let newPhoneNumber = ''
    if (isZHLanguage || countryCode === '86') {
      newPhoneNumber = phoneNumber
      // 手机号校验
      if (!this.isPhoneAvailable(phoneNumber)) {
        Toast.info('请输入合法的手机号', Config.ToestTime, null, false)
        return
      }
    } else {
      newPhoneNumber =
        (countryCode.length < 3
          ? prefixPadding0(countryCode, 3)
          : countryCode) + phoneNumber
    }

    if (!this.isPasswordAvailable(password)) {
      Toast.info('请输入合法的密码', Config.ToestTime, null, false)
      return
    }

    RSAModule.encryptString(password, msg => {
      if (msg === undefined || msg === null) {
        Toast.info(
          '密码加密错误，请联系客服人员。',
          Config.ToestTime,
          null,
          false
        )
        return
      }
      let body = {
        mobile: newPhoneNumber,
        password: msg
      }
      let requestBody = getRequestBody(body)
      devlog('----------msg-------', requestBody)

      BTWaitView.show(I18n.t('tip.wait_text'))
      Keyboard.dismiss()
      BTFetch('/member/login', requestBody)
        .then(res => {
          BTWaitView.hide()
          if (res.code === '0') {
            // devlog('+++++++++++',res);

            //给全局用户信息赋值
            UserInfo.token = res.data.token
            UserInfo.mobile = res.data.mobile
            UserInfo.avatar_thumb = res.data.avatar_thumb //头像
            UserInfo.avatar = res.data.avatar //头像
            UserInfo.is_certification = res.data.is_certification //0为未实名认证 1.已认证
            UserInfo.regdate = res.data.regdate //注册时间
            UserInfo.btos = res.data.btos //bto数量
            UserInfo.hashrate = res.data.hashrate //阳光值
            UserInfo.email = res.data.email //邮箱
            UserInfo.is_admin = res.data.is_admin // 是否是管理员
            UserInfo.rank = res.data.rank // 排名
            UserInfo.member_name = res.data.member_name
            UserInfo.group_id = res.data.group_id
            UserInfo.gender = res.data.gender
            UserInfo.member_id = res.data.member_id // 用户ID

            //保存token到本地
            setLocalStorage(Config.LoginStorage, {
              token: UserInfo.token,
              mobile: UserInfo.mobile,
              avatar_thumb: UserInfo.avatar_thumb,
              avatar: UserInfo.avatar,
              is_certification: UserInfo.is_certification,
              regdate: UserInfo.regdate,
              btos: UserInfo.btos,
              hashrate: UserInfo.hashrate,
              email: UserInfo.email,
              is_admin: UserInfo.is_admin,
              rank: UserInfo.rank, // 排名
              member_name: UserInfo.member_name,
              group_id: UserInfo.group_id,
              gender: UserInfo.gender,
              member_id: UserInfo.member_id // 用户ID
            })
            //发起通知
            DeviceEventEmitter.emit(Config.LoginDeviceEventEmitter)

            //登录成功返回到根视图
            this.props.navigation.popToTop()
          } else {
            // Keyboard.dismiss()
            BTWaitView.hide()
            Toast.info(res.msg, Config.ToestTime, null, false)
          }
        })
        .catch(res => {
          BTWaitView.hide()
          Toast.info(res, Config.ToestTime, null, false)
        })
    })
  }

  _inputOnLayout(event) {
    inputComponents.push(event.nativeEvent.target)
  }

  // 找回密码
  onPressNavToFindPassword() {
    this.props.navigation.navigate('Find')
  }

  // 注册账号
  onPressNavToRegister() {
    this.props.navigation.navigate('Register')
  }

  // 点击显示密码
  _secureTextEntry() {
    this.setState({
      isShowPassword: !this.state.isShowPassword
    })
  }

  _onChangePhoneNumber(phoneNumber) {
    const { password } = this.state
    this.setState({
      phoneNumber,
      isDisabledLoginButton: !phoneNumber || !password
    })
  }

  _onChangePassword(password) {
    const { phoneNumber } = this.state
    this.setState({
      password,
      isDisabledLoginButton: !phoneNumber || !password
    })
  }

  //  点击国家区号
  _onPressCountryCode() {
    this.setState({
      isShowCountryCodePicker: true
    })
  }

  // 英文版PhoneInput
  _renderPhoneInputEN(countryCode) {
    return (
      <PhoneInputEN
        leftIcon={
          <Image
            style={[styles.icStyles, { marginRight: 0 }]}
            source={require('../BTImage/Login/login_ic_phone.png')}
          />
        }
        placeholder={I18n.t('login.input_phone')}
        value={this.state.phoneNumber}
        countryCode={countryCode}
        onLayout={event => {
          this._inputOnLayout(event)
        }}
        onChangeText={value => {
          this._onChangePhoneNumber(value)
        }}
        onPress={() => {
          this._onPressCountryCode()
        }}
        onFocus={() => {
          this._hideCountryCodePicker()
        }}
        onBlur={() => {
          this._hideCountryCodePicker()
        }}
      />
    )
  }
  //  中文版PhoneInput
  _renderPhoneInputZH() {
    const { phoneNumber } = this.state
    return (
      <BTInput
        leftIcon={
          <Image
            style={styles.icStyles}
            source={require('../BTImage/Login/login_ic_phone.png')}
          />
        }
        placeholder={I18n.t('login.input_phone')}
        dataDetectorTypes="phoneNumber"
        keyboardType="phone-pad"
        maxLength={11}
        value={phoneNumber}
        onLayout={event => {
          this._inputOnLayout(event)
        }}
        onChangeText={value => {
          this._onChangePhoneNumber(value)
        }}
        onFocus={() => {
          this._hideCountryCodePicker()
        }}
        onBlur={() => {
          this._hideCountryCodePicker()
        }}
      />
    )
  }
  // 隐藏国家区号view
  _hideCountryCodePicker() {
    this.setState({
      isShowCountryCodePicker: false
    })
  }

  onClickWeiXinLogin() {
    ShareUtil.auth(2, (code, result, message) => {
      if (code === 0) {
        // devlog('----------',code,'----------',result,'----------',message);
        UserInfo.openid = result.openid

        let body = {
          open_id: result.openid
        }
        let requestBody = getRequestBody(body)

        BTWaitView.show(I18n.t('tip.wait_text'))
        BTFetch('/member/wechat_login', requestBody)
          .then(res => {
            // devlog('********************',res);
            BTWaitView.hide()
            if (res.code === '0') {
              //给全局用户信息赋值
              UserInfo.token = res.data.token
              UserInfo.mobile = res.data.mobile
              UserInfo.avatar_thumb = res.data.avatar_thumb //头像
              UserInfo.avatar = res.data.avatar //头像
              UserInfo.is_certification = res.data.is_certification //0为未实名认证 1.已认证
              UserInfo.regdate = res.data.regdate //注册时间
              UserInfo.btos = res.data.btos //bto数量
              UserInfo.hashrate = res.data.hashrate //阳光值
              UserInfo.email = res.data.email //邮箱
              UserInfo.is_admin = res.data.is_admin // 是否是管理员
              UserInfo.rank = res.data.rank // 排名
              UserInfo.member_name = res.data.member_name
              UserInfo.group_id = res.data.group_id
              UserInfo.gender = res.data.gender
              UserInfo.member_id = res.data.member_id // 用户ID

              //保存token到本地
              setLocalStorage(Config.LoginStorage, {
                token: UserInfo.token,
                mobile: UserInfo.mobile,
                avatar_thumb: UserInfo.avatar_thumb,
                avatar: UserInfo.avatar,
                is_certification: UserInfo.is_certification,
                regdate: UserInfo.regdate,
                btos: UserInfo.btos,
                hashrate: UserInfo.hashrate,
                email: UserInfo.email,
                is_admin: UserInfo.is_admin,
                rank: UserInfo.rank, // 排名
                member_name: UserInfo.member_name,
                group_id: UserInfo.group_id,
                gender: UserInfo.gender,
                member_id: UserInfo.member_id // 用户ID
              })
              //发起通知
              DeviceEventEmitter.emit(Config.LoginDeviceEventEmitter)

              //登录成功返回到根视图
              this.props.navigation.popToTop()
            } else if (res.code === '1') {
              this.props.navigation.navigate('BindPhone', result)
            } else {
              Toast.info(res.msg, Config.ToestTime, null, false)
            }
          })
          .catch(res => {
            BTWaitView.hide()
            Toast.fail(Config.ToestFailContent, Config.ToestTime, null, false)
          })
      } else {
        Toast.info(message, Config.ToestTime, null, false)
      }
    })
  }

  render() {
    // let adID = '';
    // if (Platform.OS === 'ios') {
    //     adID = '255171';
    // } else if (Platform.OS === 'android') {
    //     adID = '255673';
    // }

    const {
      phoneNumber,
      isShowPassword,
      password,
      isDisabledLoginButton,
      isZHLanguage,
      isShowCountryCodePicker,
      countryCode
    } = this.state
    return [
      <CountryCodeList
        isShow={isShowCountryCodePicker}
        onPick={value => {
          this.setState({ countryCode: value.phoneCode })
        }}
      />,
      <View style={styles.mainBackground}>
        {/*index:0 启动页广告 */}
        {/*index:1 弹窗广告 */}
        {/*index:2 banner广告 */}
        {/*<BTAd*/}
        {/*style={{width:UserInfo.screenW,alignSelf:'center', height: 90,marginTop:24, backgroundColor: '#00FF00'}}*/}
        {/*dataDic={{index:'2',id:adID}}*/}
        {/*onClickView={(e) => {//模拟原生回传数据给RN*/}
        {/*console.log('test' + e.nativeEvent.value);*/}
        {/*}*/}
        {/*}>*/}
        {/*{Platform.OS === 'ios'*/}
        {/*? <Text style={{color: '#999999', marginTop: 5, marginLeft: 5, fontSize: 14}}>广告</Text>*/}
        {/*: <View></View>*/}
        {/*}*/}
        {/*</BTAd>*/}
        <View style={styles.container}>
          <KeyboardAvoidingView behavior="position">
            <View>
              <Text style={[FontStyle.fontDarkGray, { fontSize: 36 }]}>
                {I18n.t('login.login_title')}
              </Text>
              <Text
                style={[FontStyle.fontNormal, styles.containerTitleSubTitle]}>
                {I18n.t('login.login_sub_title')}
              </Text>
            </View>
            <View style={styles.containerInputBox}>
              <View>
                {/* 手机号 */}
                {isZHLanguage
                  ? this._renderPhoneInputZH()
                  : this._renderPhoneInputEN(countryCode)}

                {/* <BTInput
                  leftIcon={
                    <Image
                      style={styles.icStyles}
                      source={require('../BTImage/Login/login_ic_phone.png')}
                    />
                  }
                  placeholder={I18n.t('login.input_phone')}
                  dataDetectorTypes="phoneNumber"
                  keyboardType="phone-pad"
                  maxLength={isZHLanguage ? 11 : 20}
                  value={phoneNumber}
                  onChangeText={value => {
                    this._onChangePhoneNumber(value)
                  }}
                /> */}
                <BTInput
                  leftIcon={
                    <Image
                      style={styles.icStyles}
                      source={require('../BTImage/Login/login_ic_password.png')}
                    />
                  }
                  rightIcon={
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        this._secureTextEntry()
                      }}>
                      <Image
                        style={styles.icStyles}
                        source={
                          isShowPassword
                            ? require('../BTImage/Login/login_ic_show_pass_disable.png')
                            : require('../BTImage/Login/login_ic_show_pass.png')
                        }
                      />
                    </TouchableOpacity>
                  }
                  dataDetectorTypes="all"
                  keyboardType="default"
                  placeholder={I18n.t('login.input_password')}
                  value={password}
                  secureTextEntry={isShowPassword}
                  onChangeText={value => {
                    this._onChangePassword(value)
                  }}
                  onFocus={() => {
                    this._hideCountryCodePicker()
                  }}
                  onBlur={() => {
                    this._hideCountryCodePicker()
                  }}
                />
              </View>
              <Text
                style={[
                  FontStyle.fontBlue,
                  styles.containerInputBoxForgetPassword
                ]}
                onPress={() => this.onPressNavToFindPassword()}>
                {I18n.t('login.login_forget_password')}
              </Text>
              <LongButton
                onPress={() => this.onClickLogin()}
                disabled={isDisabledLoginButton}
                title={I18n.t('login.login_button')}
              />
              <SubButton
                onPress={() => {
                  this.onPressNavToRegister()
                }}
                title={I18n.t('login.login_no_account')}
                subTitle={I18n.t('login.login_welcome_register')}
              />
            </View>
          </KeyboardAvoidingView>

          {this.state.isInstallShareAPP ? (
            <View
              style={{
                alignItems: 'center',
                width: UserInfo.screenW - 48,
                height: 100,
                backgroundColor: '#FFFF0000'
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  alignItems: 'center',
                  width: 90,
                  height: 90,
                  backgroundColor: '#FF00FF00'
                }}
                onPress={() => this.onClickWeiXinLogin()}>
                <Image
                  style={{ width: 50, height: 50, marginTop: 20 }}
                  source={require('../BTImage/PublicComponent/umeng_socialize_wechat.png')}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
          <Protocol
            onPress={() => {
              this.props.navigation.navigate('ServiceTerms')
            }}
          />
        </View>
      </View>
    ]
  }
}

export default Login

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
  containerTitleSubTitle: {
    fontSize: 16,
    marginTop: 24
  },
  containerInputBox: {
    marginTop: 56,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  containerInputBoxForgetPassword: {
    alignSelf: 'flex-end',
    marginRight: 5,
    paddingBottom: 16
  }
})
