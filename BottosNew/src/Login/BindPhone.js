import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    DeviceEventEmitter,
    Keyboard,
    TouchableWithoutFeedback,
    TextInput,
    StyleSheet,
} from 'react-native'
import BTFetch from '../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import {getRequestBody, devlog, setLocalStorage} from '../Tool/FunctionTool'
import UserInfo from '../Tool/UserInfo'
import BTWaitView from '../Tool/View/BTWaitView.config'
import NavStyle from '../Tool/Style/NavStyle'
import I18n from '../Tool/Language'
import VerificationCodeInput from './Item/VerificationCodeInput'
import BTInput from '../Tool/View/BTInput'
import LongButton from '../Tool/View/BTButton/LongButton'
import Protocol from './Item/ProtocolButton'
import Config from '../Tool/Config'
import hashes from "js-sha1";
import Md5 from "../Tool/md5";
import Modal from 'react-native-modalbox'
import SelectionSetting from "./SelectionSetting";

export default class BindPhone extends Component {
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
            verificationCode: '', // 验证码
            isDisabledLoginButton: true,
            isDisabledVerificationButton: false,
            timerCount: '' || 60, //默认倒计时时间
            timerTitle: '' || I18n.t('login.verification_code_button'),
            imageVerification: '',
            imageVerificationText: '',
            base64Image: '',
        }
        this.verificationKey = ''
    }

    componentWillMount() {
        // devlog('-----1----',this.props.navigation.state);
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }


    // 手机号校验
    isPhoneAvailable(phone) {
        let myreg = /^[1][3.4,5,7,8][0-9]{9}$/;
        // devlog(111,myreg.test(phone))
        if(!myreg.test(phone)) {

            return false;
        } else {

            return true;
        }
    }

    // 请求图形验证
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
    // 点击展示图形验证码
    onPressVerificationCode() {
        Toast.hide()
        if (!this.state.phoneNumber) {
            Toast.info(I18n.t('login.test_phone'), Config.ToestTime, null, false)
            return
        }
        this.getCaptcha() // 获取图形验证

        Keyboard.dismiss();
        this.state.imageVerificationText = ''
        this.refs.modal.open()
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

    // 点击获取验证码
    onClickVerification() {

        const {
            phoneNumber,
            imageVerificationText
        } = this.state;

        // 手机号校验
        if( !this.isPhoneAvailable(phoneNumber) ){
            Toast.info('请输入合法的手机号', Config.ToestTime, null, false)
            return;
        }

        if (imageVerificationText === '') {
            Toast.info(I18n.t('login.test_verification_code'), Config.ToestTime, null, false)
            return
        }

        //encryted_code 加密密钥,由时间戳,随机数,口令,得出
        const requestBody = getRequestBody(null)

        let time_stamp = requestBody.reqHeader.deviceInfo.timestamp
        let random = requestBody.reqHeader.deviceInfo.randomNumber


        let encryted_code = [phoneNumber, time_stamp, random, 'botfans888'].sort()

        //sha1加密
        let str_code = hashes(encryted_code.join(''))
        let md5str = Md5.hex_md5(str_code).toLocaleUpperCase()

        let body = {
            mobile: phoneNumber,
            encrypted_code: md5str,
            time_stamp:parseInt(time_stamp / 1000), //时间戳
            key: this.verificationKey, // 验证码的 key
            captcha: imageVerificationText, // 用户输入的验证码
            type:5,
            random_str: random //随机数
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
                    Toast.info(res.msg, Config.ToestTime, null, false)
                } else {
                    this.getCaptcha()
                    BTWaitView.hide()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                BTWaitView.hide()
                Toast.fail(res, Config.ToestTime, null, false)
            })
    }

    onClickSure() {
        // 手机号校验
        if( !this.isPhoneAvailable(this.state.phoneNumber) ){
            Toast.info('请输入合法的手机号', Config.ToestTime, null, false)
            return;
        }

        let body = {
            open_id: this.props.navigation.state.params.openid,
            mobile: this.state.phoneNumber,
            avatar: this.props.navigation.state.params.iconurl,
            name: this.props.navigation.state.params.name,
            code: this.state.verificationCode,
        };
        const requestBody = getRequestBody(body)
        // devlog('----body---',requestBody);

        BTWaitView.show(I18n.t('tip.wait_text'))
        BTFetch('/member/wechat_binding', requestBody)
            .then(res => {
                // devlog('----res---',res);
                BTWaitView.hide()

                if (res.code === '0' || res.code === '1'){
                    //给全局用户信息赋值
                    UserInfo.token = res.data.token
                    UserInfo.mobile = res.data.mobile
                    UserInfo.avatar_thumb = res.data.avatar_thumb //头像
                    UserInfo.avatar = res.data.avatar//头像
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
                        member_id :UserInfo.member_id // 用户ID

                    })
                    //发起通知
                    DeviceEventEmitter.emit(Config.LoginDeviceEventEmitter)
                }
                if (res.code === '0') {//手机号是已经注册过

                    this.props.navigation.popToTop()

                } else if (res.code === '1') {//手机号是没有注册

                    this.props.navigation.navigate('SelectionSetting');

                } else {
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                BTWaitView.hide()
                Toast.fail(res, Config.ToestTime, null, false)
            })
    }

    render() {
        const {
            timerTitle,
            phoneNumber,
            isDisabledVerificationButton,
            verificationCode,
            isDisabledLoginButton,
            imageVerificationText,
            base64Image
        } = this.state

        return [
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
                <View style={styles.container}>
                    <View>
                        <View>
                            <Text style={styles.containerTitleLoginTitle}>绑定</Text>
                            <Text style={styles.containerTitleLoginTitle}>账号</Text>
                        </View>
                        <View style={styles.containerInputBox}>
                            <View>
                                {/* 手机号 */}
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
                                    onChangeText={value => {
                                        this.setState({
                                            phoneNumber: value
                                        })

                                        if (value === '' || verificationCode === ''){
                                            this.setState({
                                                isDisabledLoginButton: true
                                            })
                                        }else{
                                            this.setState({
                                                isDisabledLoginButton:false,
                                            });
                                        }
                                    }}
                                />
                                <VerificationCodeInput
                                    disabled={isDisabledVerificationButton}
                                    value={verificationCode}
                                    timerTitle={timerTitle}
                                    onPress={() => {
                                        this.onPressVerificationCode()
                                    }}
                                    onChangeText={value => {
                                        this.setState({
                                            verificationCode: value
                                        })

                                        if (phoneNumber === '' || value === ''){
                                            this.setState({
                                                isDisabledLoginButton: true
                                            })
                                        }else{
                                            this.setState({
                                                isDisabledLoginButton:false,
                                            });
                                        }
                                    }}
                                />
                            </View>
                        </View>
                        <LongButton style={{marginTop:20}} onPress={() => this.onClickSure()} disabled={isDisabledLoginButton} title='确定'/>
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
