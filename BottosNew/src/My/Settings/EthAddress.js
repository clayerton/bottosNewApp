import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
    DeviceEventEmitter, Clipboard
} from 'react-native'
import BTFetch from '../../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import { getRequestBody } from '../../Tool/FunctionTool'
import NavStyle from '../../Tool/Style/NavStyle'
import FontStyle from '../../Tool/Style/FontStyle'

import Config from '../../Tool/Config'
import I18n from '../../Tool/Language'

// 组件
import BTWaitView from '../../Tool/View/BTWaitView.config'

export default class EthAddress extends Component {
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
                    {I18n.t('settings.list1_EthAddress')}
                </Text>
            ),
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            ethAddress: '' // 以太网地址
        }
    }
    componentDidMount() {
        this.getEthAddress() // 请求以太网地址
    }
    //  长按复制地址
    copy(value) {
        Clipboard.setString(value)
        try {
            Clipboard.getString()
            Toast.info(I18n.t('tip.copy_success'), Config.ToestTime, null, false)
        } catch (e) {}
    }

    // 请求以太网地址
    getEthAddress() {
        let body = {}
        let requestBody = getRequestBody(body)
        BTWaitView.show(I18n.t('tip.wait_text'))
        BTFetch('/member/getEthAddress', requestBody)
            .then(res => {
                BTWaitView.hide()
                if (res.code === '0') {
                    if(res.data!==null)
                        this.setState({
                            ethAddress: res.data.eth_address
                        })

                    // this.setState({
                    //     ethAddress:'暂无绑定'
                    // })
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
    render() {
        const {  ethAddress } = this.state

        return (
            <ScrollView
                ref="scrollView"
                keyboardShouldPersistTaps="always"
                style={NavStyle.container}>
                <View
                    style={[
                        styles.item,
                        {
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            height:100
                        }
                    ]}>
                    <Text style={[FontStyle.fontNormal]}>{I18n.t('realinfomation.eth_address')}:</Text>
                    <Text onLongPress={()=>{
                        this.copy(ethAddress)
                    }} style={[FontStyle.fontLightGray,{marginTop:8}]}>{ethAddress}</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 16,
        height: 52,
        borderColor: '#DFEFFE',
        borderWidth: 1,
        borderRadius: 3,
        paddingLeft: 16,
        paddingRight: 16
    }
})
