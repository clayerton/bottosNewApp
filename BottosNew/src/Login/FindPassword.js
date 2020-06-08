import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Keyboard,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    NativeModules,
    TouchableWithoutFeedback
} from 'react-native'
import BTFetch from '../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import {
    devlog,
    getRequestBody,
    isZHLanguage,
    prefixPadding0
} from '../Tool/FunctionTool'
import UserInfo from '../Tool/UserInfo'
import Modal from 'react-native-modalbox'
import Verification from 'react-native-verification'
import Md5 from '../Tool/md5'
import hashes from 'js-sha1'
import BTWaitView from '../Tool/View/BTWaitView.config'
import NavStyle from '../Tool/Style/NavStyle'
import I18n from '../Tool/Language'
// 组件
import VerificationCodeInput from './Item/VerificationCodeInput'
import BTInput from '../Tool/View/BTInput'
import LongButton from '../Tool/View/BTButton/LongButton'
import Protocol from './Item/ProtocolButton'
import Config from '../Tool/Config'
import PhoneInputEN from './Item/PhoneInputEN'
import CountryCodeList from '../Tool/View/CountryCodeList'
let RSAModule = NativeModules.RSAModule;

const inputComponents = []
export default class Find extends Component {
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
                        source={require('../BTImage/navigation_back.png')}
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
            phoneNumber: '', // 手机号
            password: '', // 密码
            invitationCode: '', // 邀请码
            verificationCode: '', // 验证码
            isShowPassword: true,
            isDisabledLoginButton: true,
            timerCount: '' || 60, //默认倒计时时间
            timerTitle: '' || I18n.t('login.verification_code_button'),
            counting: false,
            selfEnable: true,
            agree: false,
            active: true,
            imageVerification: '',
            imageVerificationText: '',
            base64Image: '',
            isShowCountryCodePicker: false, // 是否显示区号选择
            countryCode: '86', // 区号
            isZHLanguage: isZHLanguage() // 是否为中文
        }
        this.verificationKey = ''
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

    clickInvitationCode() {
        Toast.hide()
        if (!this.state.phoneNumber) {
            Toast.info(I18n.t('login.test_phone'), Config.ToestTime, null, false)
            return
        }
        if (!this.state.invitationCode) {
            Toast.info(
                I18n.t('login.test_invitation_code'),
                Config.ToestTime,
                null,
                false
            )
            return
        }
        this.userBlur()

        this.state.imageVerificationText = ''
        // 验证码
        // this.refs.modal.open()
    }

    //验证图形验证码
    onClickVerification() {
        const {
            phoneNumber,
            invitationCode,
            verificationCode,
            countryCode,
            isZHLanguage,
            imageVerificationText
        } = this.state
        if (imageVerificationText === '') {
            Toast.info(
                I18n.t('login.test_verification_code'),
                Config.ToestTime,
                null,
                false
            )
            return
        }

        //encryted_code 加密密钥,由时间戳,随机数,口令,得出
        const requestBody = getRequestBody(null)
        let time_stamp = requestBody.reqHeader.deviceInfo.timestamp
        let random = requestBody.reqHeader.deviceInfo.randomNumber

        // 判断是否为大陆手机号
        let newPhoneNumber = ''

        if (isZHLanguage || countryCode === '86') {
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

        const body = {
            mobile: newPhoneNumber,
            encrypted_code: md5str,
            time_stamp:parseInt(time_stamp / 1000), //时间戳
            random_str: random, //随机数
            key: this.verificationKey, // 验证码的 key
            captcha: imageVerificationText, // 用户输入的验证码
            type: 2
        }
        BTWaitView.show(I18n.t('tip.wait_text'))
        requestBody.reqBody = body
        BTFetch('/member/sendMobileCode', requestBody)
            .then(res => {
                BTWaitView.hide()
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
                    Toast.info(res.msg, 1, null, false)
                } else {
                    this.getCaptcha()
                    BTWaitView.hide()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                BTWaitView.hide();
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            })
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow
        )
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide
        )
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    // 手机号校验
    isPhoneAvailable(phone) {
        let myreg = /^[1][3.4,5,7,8][0-9]{9}$/;
        if(!myreg.test(phone)) {

            return false;
        } else {

            return true;
        }
    }

    // 密码校验
    isPasswordAvailable(password) {
        let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;  //至少8个字符，至少1个字母和1个数字,不能包含特殊字符（非数字字母)
        if(!reg.test(password)){
            return false;
        } else {
            return true;
        }
    }

    // 点击找回密码
    onClickFindPassword() {
        Toast.hide()

        const {
            phoneNumber,
            verificationCode,
            password,
            isZHLanguage,
            countryCode
        } = this.state
        if (!password) {
            Toast.info(I18n.t('login.test_password'), Config.ToestTime, null, false)
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
        if (isZHLanguage || countryCode === '86') {
            newPhoneNumber = phoneNumber

            if( !this.isPhoneAvailable(phoneNumber) ){
                Toast.info('请输入合法的手机号', Config.ToestTime, null, false)
                return;
            }

        } else {
            newPhoneNumber =
                (countryCode.length < 3
                    ? prefixPadding0(countryCode, 3)
                    : countryCode) + phoneNumber
        }
        //密码校验
        if(!this.isPasswordAvailable(password)) {
            Toast.info('请输入合法的密码', Config.ToestTime, null, false)
            return;
       }
        RSAModule.encryptString(
            password,
            msg => {
                if (msg === undefined || msg === null){
                    Toast.info('密码加密错误，请联系客服人员。', Config.ToestTime, null, false)
                    return;
                }
                const body = {
                    mobile: newPhoneNumber,
                    code: verificationCode,
                    new_password: msg
                }
                // devlog('----------msg-------',body);

                const requestBody = getRequestBody(body)
                BTWaitView.show(I18n.t('tip.wait_text'))
                BTFetch('/member/forgotPassword', requestBody)
                    .then(res => {
                        BTWaitView.hide()
                        if (res.code === '0') {
                            BTWaitView.hide()
                            Toast.info(
                                res.msg,
                                Config.ToestTime,
                                () => {
                                    // 修改成功跳转登录页
                                    this.props.navigation.navigate('Login')
                                },
                                false
                            )
                        } else {
                            BTWaitView.hide()
                            Toast.fail(res.msg, Config.ToestTime, null, false)
                        }
                    })
                    .catch(res => {
                        BTWaitView.hide();
                        Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
                    })
            }
        )
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

    _onChangePhoneNumber(phoneNumber) {
        const { password, verificationCode} = this.state;
        this.setState({ phoneNumber, isDisabledLoginButton: !phoneNumber||!password||!verificationCode })
    }

    _onStartShouldSetResponderCapture(event) {
        let target = event.nativeEvent.target
        if (!inputComponents.includes(target)) {
            Keyboard.dismiss()
        }
        return false
    }

    _inputOnLayout(event) {
        inputComponents.push(event.nativeEvent.target)
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

    render() {
        const {
            counting,
            timerTitle,
            selfEnable,
            phoneNumber,
            isShowPassword,
            countryCode,
            isShowCountryCodePicker,
            isZHLanguage,
            password,
            isDisabledVerificationButton,
            verificationCode,
            isDisabledLoginButton
        } = this.state

        return [
            <CountryCodeList
                isShow={isShowCountryCodePicker}
                onPick={value => {
                    this.setState({ countryCode: value.phoneCode })
                }}
            />,
            <ScrollView
                ref="scrollView"
                keyboardShouldPersistTaps="always"
                style={styles.mainBackground}>
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
                                value={this.state.imageVerificationText}
                            />

                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 45
                                }}>
                                {this.state.base64Image ? (
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            this.getCaptcha()
                                        }}>
                                        <Image
                                            style={{ height: 35, width: 120 }}
                                            source={{ uri: this.state.base64Image }}
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
                                onPress={() => this.onClickVerification()}
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
                <View
                    style={styles.container}
                    onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(
                        this
                    )}>
                    <View>
                        <View>
                            <Text style={styles.containerTitleLoginTitle}>
                                {I18n.t('login.find_title')}
                            </Text>
                            <Text style={styles.containerTitleLoginTitle}>
                                {I18n.t('login.find_sub_title')}
                            </Text>
                        </View>
                        <View style={styles.containerInputBox}>
                            <View>
                                {/* 手机号 */}
                                {isZHLanguage
                                    ? this._renderPhoneInputZH()
                                    : this._renderPhoneInputEN(countryCode)}
                                {/* 密码 */}
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
                                            onPress={() => this.setState({isShowPassword: !this.state.isShowPassword})}>
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
                                    onLayout={event => {
                                        this._inputOnLayout(event)
                                    }}
                                    onChangeText={password => this.setState({ password,  isDisabledLoginButton: !phoneNumber||!password||!verificationCode  })}
                                    onFocus={() => {
                                        this._hideCountryCodePicker()
                                    }}
                                    onBlur={() => {
                                        this._hideCountryCodePicker()
                                    }}
                                />
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
                                    onChangeText={verificationCode => this.setState({ verificationCode,  isDisabledLoginButton: !phoneNumber||!password||!verificationCode  })}
                                    onFocus={() => {
                                        this._hideCountryCodePicker()
                                    }}
                                    onBlur={() => {
                                        this._hideCountryCodePicker()
                                    }}
                                />
                            </View>
                            <LongButton
                                onPress={() => this.onClickFindPassword()}
                                disabled={isDisabledLoginButton}
                            />
                        </View>
                    </View>
                    <Protocol
                        onPress={() => {
                            this.props.navigation.navigate('ServiceTerms')
                        }}
                    />
                </View>
            </ScrollView>
        ]
    }

    // 隐藏国家区号view
    _hideCountryCodePicker() {
        this.setState({
            isShowCountryCodePicker: false
        })
    }

    lostBlur() {
        //退出软件盘
        if (keyBoardIsShow) {
            Keyboard.dismiss()
        }
    }

    _keyboardDidShow() {
        keyBoardIsShow = true
    }

    _keyboardDidHide() {
        keyBoardIsShow = true
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
    passwordBlur() {
        let pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/ //8到16位数字与字母组合
        if (!pwdReg.test(this.state.password)) {
            Toast.info(I18n.t('login.test_password'), Config.ToestTime, null, false)
            return
        }
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
}

const styles = StyleSheet.create({
    mainBackground: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        marginLeft: 24,
        marginRight: 24,
        height: UserInfo.screenH - 44,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 26
    },
    icStyles: {
        width: 14,
        height: 14,
        marginLeft: 24,
        marginRight: 16
    },
    containerTitleLoginTitle: {
        color: '#353B48',
        fontSize: 36,
        fontWeight: '400'
    },
    containerInputBox: {
        marginTop: 32,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    modal: {
        padding: 20,
        width: 300,
        height: 150,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 5
    }
})
