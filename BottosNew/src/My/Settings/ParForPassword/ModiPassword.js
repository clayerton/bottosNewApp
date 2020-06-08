import React,{Component } from 'react'
import {View, Text, StyleSheet, DeviceEventEmitter,TouchableOpacity,Image,NativeModules} from 'react-native'
import NavStyle from "../../../Tool/Style/NavStyle";
import I18n from "../../../Tool/Language";
import { PasswordInput } from 'react-native-pay-password'
import BTFetch from '../../../Tool/NetWork/BTFetch'
import {getRequestBody, devlog} from "../../../Tool/FunctionTool";
import BTWaitView from "../../../Tool/View/BTWaitView.config";
import {Toast} from "antd-mobile-rn";
import Config from "../../../Tool/Config";
let RSAModule = NativeModules.RSAModule;
export default class ModiPassword extends Component {
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
                <Text style={NavStyle.navTitle}>{I18n.t('settingsPassword.modifyPassword')}</Text>
            ),
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            password : null,
        }
    }
    //  验证原密码
    onEnd(data) {
        RSAModule.encryptString(
            data,
            msg => {
                if (msg === undefined || msg === null){
                    Toast.info('密码加密错误，请联系客服人员。', Config.ToestTime, null, false)
                    return;
                }
                let body = {
                    source_password:msg,
                }
                let requestBody = getRequestBody(body)
                BTFetch('/member/validPayPassword', requestBody)
                    .then(res => {
                        BTWaitView.hide()
                        if (res.code === '0') {
                            res.data ?   this.props.navigation.push('PayforPassword',true):Toast.info(res.msg, Config.ToestTime, null, false)
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
        )
    }

    render() {
        return (
            <View style={NavStyle.container}>
                <View style={styles.limitView}>
                    <Text style={styles.limitText}>{I18n.t('settingsPassword.setOldPassword')}</Text>
                </View>
                {/*输入密码框*/}

                <View style={styles.setpassword}>
                    <PasswordInput
                        borderColor={'#DFEFFE'}
                        onDone={(data) => {
                            this.setState({ password: data })
                            if(data.length ===6){
                                this.onEnd(data)
                            }
                        }}
                    />
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={()=>{this.props.navigation.push('ForgetPayPassword')}}
                    >
                        <Text style={styles.forgetPassword}>{I18n.t('settingsPassword.setForgetPassword')}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
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
        paddingTop: 32,
        alignItems:'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    forgetPassword:{
        color:'#046FDB',
        fontSize:12,
        textAlign: 'center',
        lineHeight:17,
        paddingTop: 24,
    }
});