import React,{Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    DeviceEventEmitter,
    TouchableOpacity,
    Image,
    TextInput,
    TouchableWithoutFeedback, ScrollView,
} from 'react-native'
import NavStyle from "../../../Tool/Style/NavStyle";
import I18n from "../../../Tool/Language";
import BTFetch from '../../../Tool/NetWork/BTFetch'
import BTWaitView from "../../../Tool/View/BTWaitView.config";
import {Toast} from "antd-mobile-rn";
import Config from "../../../Tool/Config";
import {
    clearMapForKey, devlog,
    getRequestBody,
    isZHLanguage,
    prefixPadding0
} from '../../../Tool/FunctionTool'
//组件
import LongButton from '../../../Tool/View/BTButton/LongButton'
import BTInput from '../../../Tool/View/BTInput'
/*import SubButton from './../Item/SubButton'
import PhoneInputEN from '../Item/PhoneInputEN'*/
import CountryCodeList from '../../../Tool/View/CountryCodeList'
import PhoneInputEN from "../../../Login/Item/PhoneInputEN";
import VerificationCodeInput from "../../../Login/Item/VerificationCodeInput";
import UserInfo from "../../../Tool/UserInfo";
import hashes from "js-sha1";
import Md5 from "../../../Tool/md5";
import Modal from "react-native-modalbox";
const inputComponents = []

export default class ForgetPayPassword extends Component {
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
                        source={require('../../../BTImage/navigation_back.png')}
                    />
                </TouchableOpacity>
            ),
            headerRight: <Text style={NavStyle.rightButton}> </Text>,
            headerTitle: (
                <Text style={NavStyle.navTitle}>{I18n.t('settingsPassword.findPassword')}</Text>
            ),
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }
    constructor(props) {
        super(props)

        this.state = {
            phoneNumber: '',
            password: '',
            isShowPassword: true,
            isDisabledLoginButton: true,
            isShowCountryCodePicker: false, // 是否显示区号选择
            countryCode: '86', // 区号
            isZHLanguage: isZHLanguage(),
            verificationCode: '', // 验证码
            isDisabledVerificationButton:false,
            imageVerification: '',
            imageVerificationText: '',
            base64Image: '',
            timerCount: '' || 60, //默认倒计时时间
            timerTitle: '' || I18n.t('login.verification_code_button'),

        }
        this.verificationKey = ''
    }

    _inputOnLayout(event) {
        // inputComponents.push(event.nativeEvent.target)
    }

    _onChangePhoneNumber(phoneNumber) {
        this.setState({ phoneNumber,isDisabledLoginButton:!phoneNumber  })
    }
    //  点击国家区号
    _onPressCountryCode() {
        this.setState({
            isShowCountryCodePicker: true
        })
    }

    // 倒计时
    countdown() {
        const codeTime = this.state.timerCount
        this.interval = setInterval(() => {
            const timer = this.state.timerCount - 1
            if (timer === 0) {
                this.interval && clearInterval(this.interval)
                this.setState({
                    timerCount: codeTime,
                    timerTitle:
                        I18n.t('login.take_again') ||
                        I18n.t('login.verification_code_button'),
                    counting: false,
                    selfEnable: true,
                    isDisabledVerificationButton: false
                })
            } else {
                this.setState({
                    timerCount: timer,
                    timerTitle: `(${timer}s)`
                })
            }
        }, 1000)
    }

    // 英文版PhoneInput
    _renderPhoneInputEN(countryCode) {
        return (
            <PhoneInputEN
                leftIcon={
                    <Image
                        style={[styles.icStyles, { marginRight: 0 }]}
                        source={require('../../../BTImage/Login/login_ic_phone.png')}
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
                        source={require('../../../BTImage/Login/login_ic_phone.png')}
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


    // 点击获取验证码
    onPressVerificationCode() {
        Toast.hide()
        if (!this.state.phoneNumber) {
            Toast.info(I18n.t('login.test_phone'), Config.ToestTime, null, false)
            return
        }
        this.userBlur()
        this.getCaptcha() // 获取图形验证

        this.state.imageVerificationText = ''
        this.refs.modal.open()
    }
    onClickCode(){

        const {
            phoneNumber,
            verificationCode,
            countryCode,
            isZHLanguage,
            imageVerificationText
        } = this.state


        const requestBody = getRequestBody(null)

        let time_stamp = requestBody.reqHeader.deviceInfo.timestamp
        let random = requestBody.reqHeader.deviceInfo.randomNumber


        // 判断是否为大陆手机号
        let newPhoneNumber = ''

        if (isZHLanguage || countryCode === '86' ) {
            newPhoneNumber = phoneNumber
        } else {
            newPhoneNumber =
                (countryCode.length < 3
                    ? prefixPadding0(countryCode, 3)
                    : countryCode) + phoneNumber
        }

        let encryted_code = [newPhoneNumber, time_stamp, random, 'botfans888'].sort()

        //sha1加密
        let str_code = hashes(encryted_code.join(''))
        let md5str = Md5.hex_md5(str_code).toLocaleUpperCase()

        let body = {}
        //忘记密码发送验证码参数
        body = {
            mobile: newPhoneNumber,
            encrypted_code: md5str,
            time_stamp:parseInt(time_stamp / 1000), //时间戳
            random_str: random, //随机数
            key: this.verificationKey, // 验证码的 key
            captcha: imageVerificationText, // 用户输入的验证码
            type:4,
        }

        BTWaitView.show(I18n.t('tip.wait_text'))
        requestBody.reqBody = body
        BTFetch('/member/sendMobileCode', requestBody)
            .then(res => {
                BTWaitView.hide()
                devlog(res,body)
                if (res.code === '0') {
                    this.refs.modal.close()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                    this.countdown()
                    this.setState({
                        isDisabledVerificationButton: true
                    })
                } else if (res.code == '-2') {
                    // 邀请码错误
                    this.refs.modal.close()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                } else {
                    this.getCaptcha()

                    BTWaitView.hide()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                BTWaitView.hide()
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            })


    }
    userBlur() {
        let reg = /^1\d{10}$/
        const {
            phoneNumber,
            isZHLanguage
        } = this.state

        if (isZHLanguage && !reg.test(phoneNumber)) {
            Toast.info(I18n.t('login.test_phone'), Config.ToestTime, null, false)
            return
        }
    }

    getCaptcha() {
        let body = { mobile: this.state.phoneNumber }
        let requestBody = getRequestBody(body)
        BTFetch('/member/getCaptcha', requestBody)
            .then(res => {
                if (res.code === '0') {
                    const { key, captcha } = res.data

                    this.verificationKey = key
                    const base64Image = 'data:image/png;base64,' + captcha
                    this.setState({ base64Image })
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
    //  下一步
    onClickNext() {
        const {
            phoneNumber,
            verificationCode,
            countryCode,
            isZHLanguage
        } = this.state
        if (!phoneNumber) {
            Toast.info(I18n.t('login.test_phone'), Config.ToestTime, null, false)
            return
        }

        if (!verificationCode) {
            Toast.info(
                I18n.t('login.test_verification_code'),
                Config.ToestTime,
                null,
                false
            )
            return
        }

        // 判断是否为大陆手机号
        let newPhoneNumber = ''
        if (isZHLanguage || countryCode === '86' ) {
            newPhoneNumber = phoneNumber
        } else {
            newPhoneNumber =
                (countryCode.length < 3
                    ? prefixPadding0(countryCode, 3)
                    : countryCode) + phoneNumber
        }

        //忘记密码发送验证码参数
       let body = {
            mobile: newPhoneNumber,
            code:verificationCode
        }

        BTWaitView.show(I18n.t('tip.wait_text'))
        let requestBody = getRequestBody(body)
        BTFetch('/member/validForgotMobileCode', requestBody)
            .then(res => {
                BTWaitView.hide()
                devlog(res,body,requestBody,'forgetPassword')
                if (res.code === '0') {
                    this.props.navigation.push('PayforPassword',{'validPay':true})
                }else {
                    BTWaitView.hide()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                BTWaitView.hide()
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            })

    }


    render() {
        const {
            isZHLanguage,
            countryCode,
            isShowCountryCodePicker,
            isDisabledVerificationButton,
            verificationCode,
            timerTitle,
            isDisabledLoginButton,
            base64Image,
            imageVerificationText
        } = this.state;
        return [
            <View style={NavStyle.container}>
                {/* 验证码 */}
                <Modal
                    style={styles.modal}
                    position={'center'}
                    ref="modal"
                    isDisabled={false}
                    backdropPressToClose={false}
                    openAnimationDuration={0}
                    swipeToClose={false}
                    onClosed={this.onClosed}
                    onOpened={this.onOpened}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <TextInput
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                style={{
                                    color: '#222222',
                                    backgroundColor: '#F2F2F2',
                                    textAlign: 'left',
                                    height: 45,
                                    width: 130
                                }}
                                keyboardType="default"
                                maxLength={5}
                                onBlur={() => this.userBlur()}
                                onChangeText={value => {
                                    this.setState({ imageVerificationText: value })
                                }}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#666666"
                                placeholder={I18n.t('login.test_verification_code_image')}
                                value={imageVerificationText}
                            />

                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 45
                                }}>
                                {base64Image ? (
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            this.getCaptcha()
                                        }}>
                                        <Image
                                            style={{ height: 35, width: 120 }}
                                            source={{ uri: base64Image }}
                                        />
                                    </TouchableWithoutFeedback>
                                ) : (
                                    <View style={{ height: 35, width: 120 }} />
                                )}
                            </View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.refs.modal.close()}
                                style={{
                                    backgroundColor: '#FFF',
                                    borderRadius: 5,
                                    height: 45,
                                    flex:1,
                                    justifyContent:'center',alignItems:'center',
                                    borderColor:'#046FDB',
                                    borderWidth:1
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: '#046FDB'
                                    }}>
                                    {I18n.t('tip.cancel')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.onClickCode()}
                                style={{
                                    backgroundColor: '#046FDB',
                                    borderRadius: 5,
                                    height: 45,
                                    flex:1,
                                    justifyContent:'center',alignItems:'center',
                                    marginLeft:8
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: '#FFFFFF'
                                    }}>
                                    {I18n.t('tip.confirm')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={styles.limitView}>
                    <Text style={styles.limitText}>{I18n.t('settingsPassword.forgetInfoPassword')}</Text>
                </View>
                {/*输入密码框*/}

                <View style={styles.setpassword}>
                    {/* 手机号 */}
                    {isZHLanguage
                        ? this._renderPhoneInputZH()
                        : this._renderPhoneInputEN(countryCode)}

                    {/* 验证码 */}
                    <VerificationCodeInput
                        disabled={isDisabledVerificationButton}
                        value={verificationCode}
                        timerTitle={timerTitle}
                        onPress={() => {
                            this.onPressVerificationCode()
                        }}
                        onLayout={event => {
                            this._inputOnLayout(event)
                        }}
                        onChangeText={verificationCode =>
                            this.setState({ verificationCode })
                        }
                        onFocus={() => {
                            this._hideCountryCodePicker()
                        }}
                        onBlur={() => {
                            this._hideCountryCodePicker()
                        }}
                    />
                    <LongButton
                        style={{width:UserInfo.screenW - 48}}
                        onPress={() => this.onClickNext()}
                        disabled={isDisabledLoginButton}
                        title={'下一步'}
                    />
                </View>

            </View>
        ,<CountryCodeList
                isShow={isShowCountryCodePicker}
                onPick={value => {
                    this.setState({ countryCode: value.phoneCode })
                }}
            />]
    }
}
const styles = StyleSheet.create({
    limitView:{
        height:70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#fff',
        borderBottomWidth: 0.1,
        borderBottomColor:'#D1D5DD',
    },
    limitText:{
        fontSize:16,
        color:'#17001E',
    },
    setpassword:{
        alignItems:'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 32,
        paddingLeft:24,
        paddingRight:24,
    },
    forgetPassword:{
        color:'#046FDB',
        fontSize:12,
        textAlign: 'center',
        lineHeight:17,
        paddingTop: 24,
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
    },
    modal: {
        padding: 20,
        width: 300,
        height: 170,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 5
    }
});