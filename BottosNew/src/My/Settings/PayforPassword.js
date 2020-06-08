import React,{Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, TextInput,TouchableHighlight,
    InteractionManager,} from 'react-native';
import NavStyle from "../../Tool/Style/NavStyle";
import I18n from "../../Tool/Language";
import { PasswordInput } from 'react-native-pay-password'
export default class PayforPassword extends Component{

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
                <Text style={NavStyle.navTitle}>{I18n.t('settingsPassword.setPassword')}</Text>
            ),
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }

    constructor(props){
        super(props);
        const validPay = props.navigation.state.params  //判断是否从忘记密码跳转过来
        this.validPay = validPay
        this.state = {
            text:'',
            maxLength:6,
        }
    }

    //  当输入密码长度等于6位
    onEnd(newText) {
        this.props.navigation.push('PayforPasswordCommit',{newText,validPay:this.validPay})
    }

    render() {
        return (
            <View style={NavStyle.container}>
                <View style={styles.limitView}>
                    <Text style={styles.limitText}>{ this.validPay ? I18n.t('settingsPassword.setNewPassword') : I18n.t('settingsPassword.setLimit')}</Text>
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

});