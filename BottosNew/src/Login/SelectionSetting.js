import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    NativeModules,
} from 'react-native'
import BTFetch from '../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import {devlog, getRequestBody,} from '../Tool/FunctionTool'
import UserInfo from '../Tool/UserInfo'
import BTWaitView from '../Tool/View/BTWaitView.config'
import NavStyle from '../Tool/Style/NavStyle'
import I18n from '../Tool/Language'
import BTInput from '../Tool/View/BTInput'
import Config from '../Tool/Config'
let RSAModule = NativeModules.RSAModule;

export default class SelectionSetting extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
            headerLeft: null,
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
            isShowPassword: true,
            isDisabledLoginButton: true,
        }
    }

    componentWillMount() {

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


    onClickJump() {
        this.props.navigation.popToTop()
    }
    onClickSure() {

        if(!this.isPasswordAvailable(this.state.password)) {
            Toast.info('请输入合法的密码', Config.ToestTime, null, false)
            return;
        }
        RSAModule.encryptString(
            this.state.password,
            msg => {
                if (msg === undefined || msg === null){
                    Toast.info('密码加密错误，请联系客服人员。', Config.ToestTime, null, false)
                    return;
                }
                let body = {
                    password: msg,
                    parent_code: this.state.invitationCode,
                };
                const requestBody = getRequestBody(body)
                // devlog('----body---',requestBody);

                BTWaitView.show(I18n.t('tip.wait_text'))
                BTFetch('/member/password_setting', requestBody)
                    .then(res => {
                        // devlog('----res---',res);
                        BTWaitView.hide()
                        if (res.code === '0') {
                            this.props.navigation.popToTop()
                        } else {
                            Toast.info(res.msg, Config.ToestTime, null, false)
                        }
                    })
                    .catch(res => {
                        BTWaitView.hide()
                        Toast.fail(res, Config.ToestTime, null, false)
                    })
            }
        )
    }

    // 点击显示密码
    _secureTextEntry() {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }


    render() {
        const {
            invitationCode,
            isShowPassword,
            password,
            isDisabledLoginButton,
        } = this.state

        return [
            <ScrollView
                ref="scrollView"
                keyboardShouldPersistTaps="always"
                style={styles.mainBackground}>
                <View style={styles.container}>
                    <View>
                        <Text style={styles.containerTitleLoginTitle}>选填</Text>
                        <Text style={styles.containerTitleLoginTitle}>设置</Text>
                    </View>
                    <View style={styles.containerInputBox}>
                        <View>
                            {/* 邀请码 */}
                            <BTInput
                                leftIcon={
                                    <Image
                                        style={styles.icStyles}
                                        source={require('../BTImage/Login/login_ic_invitation_code.png')}
                                    />
                                }
                                placeholder='邀请码(选填)'
                                maxLength={5}
                                value={invitationCode}
                                onChangeText={value => {
                                    this.setState({
                                        invitationCode: value
                                    });
                                    if (value !== '' || password !== ''){
                                        this.setState({
                                            isDisabledLoginButton: false
                                        })
                                    }else{
                                        this.setState({
                                            isDisabledLoginButton:true,
                                        });
                                    }
                                }}
                            />

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
                                placeholder='登陆密码(选填)'
                                value={password}
                                secureTextEntry={isShowPassword}
                                onChangeText={value => {
                                    this.setState({
                                        password: value
                                    });
                                    if (value !== '' || invitationCode !== ''){
                                        this.setState({
                                            isDisabledLoginButton: false
                                        })
                                    }else{
                                        this.setState({
                                            isDisabledLoginButton:true,
                                        });
                                    }
                                }}
                            />
                        </View>
                        <View style={{height: 50, marginTop: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClickJump()} style={[styles.touch, {borderColor: '#046FDB', borderWidth: 1}]}>
                                <Text style={{textAlign: 'center', lineHeight: 50, flex: 1, fontSize: 16, color: '#046FDB'}}>跳过</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} disabled={isDisabledLoginButton} onPress={() => this.onClickSure()}
                                              style={[styles.touch,
                                                  isDisabledLoginButton
                                                      ? { backgroundColor: '#D1D5DD' }
                                                      : { backgroundColor: '#046FDB' }]}>
                                <Text style={{textAlign: 'center', lineHeight: 50, flex: 1, fontSize: 16, color: '#FFFFFF'}}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        paddingBottom: 26
    },
    icStyles: {
        width: 14,
        height: 14,
        marginLeft: 24,
        marginRight: 16
    },
    containerTitleLoginTitle: {
        fontSize: 36
    },
    containerInputBox: {
        marginTop: 32,
        flexDirection: 'column',
    },
    touch: {
        borderRadius: 100,
        backgroundColor: '#00000000',
        height: 50,
        width: (UserInfo.screenW - 48 - 15)/2,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
