import React,{Component} from 'react';
import {
    View, Text, TouchableOpacity, Image, StyleSheet, TextInput, TouchableHighlight,
    InteractionManager, DeviceEventEmitter,NativeModules,
} from 'react-native';
import NavStyle from "../../Tool/Style/NavStyle";
import I18n from "../../Tool/Language";
import { PasswordInput } from 'react-native-pay-password'
import { Toast } from 'antd-mobile-rn'
import BTWaitView from '../../Tool/View/BTWaitView.config'
import BTFetch from '../../Tool/NetWork/BTFetch'
import Config from "../../Tool/Config";
import UserInfo from "../../Tool/UserInfo";
import {getRequestBody} from "../../Tool/FunctionTool";
let RSAModule = NativeModules.RSAModule;
export default class PayforPasswordCommit extends Component{

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
                <Text style={NavStyle.navTitle}>{I18n.t('settingsPassword.setPasswordSure')}</Text>
            ),
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }

    constructor(props){
        super(props);
        this.password = props.navigation.state.params.newText;
        this.validPay = props.navigation.state.params.validPay;
        this.state = {
            text:'',
            maxLength:6,
        }
    }

    componentDidMount() {
    }

    //  当输入密码长度等于6位是
    onEnd(newText) {
        if(this.password === newText){

            RSAModule.encryptString(
                newText,
                msg => {
                    if (msg === undefined || msg === null){
                        Toast.info('密码加密错误，请联系客服人员。', Config.ToestTime, null, false)
                        return;
                    }
                    let body =  {pay_password:msg,}
                    let requestBody = getRequestBody(body)
                    let getUrl =  '/member/setPaypassword' ;
                    BTFetch(getUrl, requestBody)
                        .then(res => {
                            BTWaitView.hide()
                            if (res.code === '0') {
                                Toast.info(res.msg, Config.ToestTime, null, false)
                                let numberPop =  this.validPay ? 4 : 3
                                this.props.navigation.pop(numberPop)
                            } else if (res.code === '99') {
                                DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                            } else {
                                Toast.info(res.msg, Config.ToestTime, null, false)
                            }
                        })
                        .catch(res => {
                            BTWaitView.hide()
                            Toast.fail(res.msg, Config.ToestTime, null, false)
                        })


                }
            )

            
        }else{
            Toast.fail(I18n.t('settingsPassword.setPasswordWrong'),Config.ToestTime, null, false)
        }
    }

    render() {
        return (
            <View style={NavStyle.container}>
                <View style={styles.limitView}>
                    <Text style={styles.limitText}>{this.validPay ? I18n.t('settingsPassword.setNewPasswordAg') : I18n.t('settingsPassword.setLimitSure')}</Text>
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
        flex:1,
        paddingTop: 32,
        justifyContent:'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',

    },
    setinput:{
        width:45*6,
        height:42,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor:'#DFEFFE',
        borderRadius:3,
        flexDirection: 'row'
    },

});