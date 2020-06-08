import React, { Component } from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, DeviceEventEmitter,Alert} from 'react-native';
import NavStyle from "../../Tool/Style/NavStyle";
import { Toast } from 'antd-mobile-rn'
import moment from "moment/moment";
import Config from "../../Tool/Config";
import BTFetch from "../../Tool/NetWork/BTFetch";
import {getLocalStorage, getRequestBody,devlog,getImageURL} from "../../Tool/FunctionTool";
import UserInfo from "../../Tool/UserInfo";
import I18n from "../../Tool/Language";
import LongButton from '../../Tool/View/BTButton/LongButton'
import BTWaitView from "../../Tool/View/BTWaitView.config";
import { PasswordModal } from 'react-native-pay-password'

export default class ShopPayConfirm extends Component {

    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            headerLeft: (
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()} style={NavStyle.leftButton}>
                    <Image style={NavStyle.navBackImage} source={require('../../BTImage/navigation_back.png')}/>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity  style={NavStyle.rightButton}>
                </TouchableOpacity>
            ),
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('base.shop_confirmation')}</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground,
        };
    };
    constructor(props) {
        super(props);

        this.state = {
            isDisabled:true,
            password: '',
            shopAddressName: '',
            shopAddressPhone: '',
            shopAddressAddress: ''
        }
    }

    componentWillMount() {

        this.setState({
            params: this.props.navigation.state.params,
            info:JSON.parse(this.props.navigation.state.params.data.info),
            shopAddressPhone: UserInfo.mobile,
        });

        //获取收获地址
        getLocalStorage(
            'shopAddress',
            ret => {
                this.setState({
                    isDisabled:false,
                    shopAddressAddress: ret.shopAddressAddress,
                });
            },
            errMsg => {
                this.state = {
                    isDisabled:true,
                    shopAddressAddress: ''
                }
            }
        );
    }

    componentDidMount() {

        let body = {
            token:UserInfo.token,
        };
        let requestBody = getRequestBody(body);
        BTWaitView.show(I18n.t('tip.wait_text'));
        BTFetch("/member/certificationInfo", requestBody)
            .then(res => {
                BTWaitView.hide();
                if (res.code === '0') {
                    this.setState({
                        shopAddressName: res.data.real_name,
                    });
                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    this.state = {
                        isDisabled:true,
                        shopAddressName: ''
                    }
                }
            })
            .catch(res => {
                BTWaitView.hide();
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            });
    }

    onClickAddress() {
        if (this.state.shopAddressName === ''){
            Toast.info(I18n.t('base.shop_real_name'), Config.ToestTime, null, false);
            return;
        }
        if (this.state.shopAddressPhone === ''){
            Toast.info(I18n.t('base.shop_phone_empty'), Config.ToestTime, null, false);
            return;
        }
        let data = {
            'shopAddressName': this.state.shopAddressName,
            'shopAddressPhone': this.state.shopAddressPhone,
            callback: (shopAddressAddress) => {
                this.setState({
                    shopAddressAddress: shopAddressAddress,
                    isDisabled:false,
                });
            }
        };
        const { navigate } = this.props.navigation;
        navigate('ShopAddAddress',data)
    }

    onClickSubmit() {
        if (this.state.shopAddressName === ''){
            Toast.info(I18n.t('base.shop_real_name'), Config.ToestTime, null, false);
            return;
        }
        if (this.state.shopAddressPhone === ''){
            Toast.info(I18n.t('base.shop_phone_empty'), Config.ToestTime, null, false);
            return;
        }
        if (this.state.shopAddressAddress === ''){
            Toast.info(I18n.t('base.shop_address_empty'), Config.ToestTime, null, false);
            return;
        }

        Alert.alert(
            I18n.t('base.shop_confirmation_payment'),
            I18n.t('base.shop_pay_alert'),
            [
                {text: I18n.t('tip.cancel'), onPress: () => devlog('Cancel Pressed')},
                {text: I18n.t('tip.confirm'), onPress: () =>  this.refs.modal.show()},
            ],
            { cancelable: false }
        )
    }

    onClickConfirmALert(data) {
        BTWaitView.show(I18n.t('tip.wait_text'));

        //等待密码model消失在执行，不然WaitView会不消失
        setTimeout( () => {
                let body = {
                    token:UserInfo.token,
                    order_sn:this.state.params.data.order_sn,
                    realname:this.state.shopAddressName,
                    mobile:this.state.shopAddressPhone,
                    address:this.state.shopAddressAddress,
                    password:data,
                };
                let requestBody = getRequestBody(body);
                BTFetch("/shop/pay", requestBody)
                    .then(res => {
                        BTWaitView.hide();
                        if(res.code === "0"){
                            this.props.navigation.navigate('ShopPayResults',this.props.navigation.state.params)
                        }else if(res.code === '-2'){
                            Toast.info(res.msg,Config.ToestTime,null,false);

                            setTimeout( () => {
                                    this.refs.modal.show();
                                },
                                1000
                            );
                        }else if(res.code === '99'){
                            DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                        }else{
                            this.props.navigation.navigate('ShopPayResults',res || {})
                        }
                    })
                    .catch(res => {
                        BTWaitView.hide();
                        Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
                    });
            },
            600
        );
    }

    render() {

        let iSAddress =  this.state.shopAddressName !== '' && this.state.shopAddressPhone !== '' && this.state.shopAddressAddress !== '';

        return (

            <View style={NavStyle.container}>
                <PasswordModal
                    ref='modal'
                    title={I18n.t('tip.pay_password_title')}
                    onDone={(data) => {
                        this.onClickConfirmALert(data)
                    }} />

                <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClickAddress()} style={styles.backView1}>
                    <View style={{backgroundColor:'#00000000',flexDirection:'row'}}>
                        <Text style={[styles.textStyle_1,{backgroundColor:'#00000000',flex:1}]}>{I18n.t('base.shop_address_info')}</Text>
                        <Image style={{width:16,height:16}} source={require('../../BTImage/Base/Shop/shop_address_right.png')}/>
                    </View>

                    {iSAddress ?
                        <View>
                            <Text style={[styles.textStyle_2,{backgroundColor:'#00000000',marginTop:8,}]}>{this.state.shopAddressName}</Text>
                            <Text style={[styles.textStyle_2,{backgroundColor:'#00000000',marginTop:8,}]}>{this.state.shopAddressPhone}</Text>
                            <Text style={[styles.textStyle_2,{backgroundColor:'#00000000',marginTop:8}]}>{this.state.shopAddressAddress}</Text>
                        </View>
                        :
                        <View></View>}

                </TouchableOpacity>

                <View style={styles.backView1}>
                    <View style={{backgroundColor:'#00000000',flexDirection:'row'}}>
                        <Text style={[styles.textStyle_1,{backgroundColor:'#00000000',marginTop:5,flex:1}]}>{I18n.t('base.shop_order')}：{this.state.params.data.order_sn}</Text>
                    </View>
                    <View style={{backgroundColor:'#00000000',flexDirection:'row',marginTop:10}}>
                        <Image style={{backgroundColor:'white',width:80,height:80,borderRadius: 5,resizeMode: Image.resizeMode.contain,marginTop:8}} source={{ uri:getImageURL(this.state.info.image) }}/>
                        <View style={{backgroundColor:'#00000000',marginLeft:10,marginTop:8,flexDirection:'column',flex:1}}>
                            <View style={{backgroundColor:'#00000000',flexDirection:'row',flex:1}}>
                                <Text style={[styles.textStyle_1,{backgroundColor:'#00000000',flex:1}]}>{this.state.info.title}</Text>
                                <Text style={styles.textStyle_3}>{this.state.params.data.price} {this.state.params.data.currency_name}</Text>
                            </View>
                            <View style={{backgroundColor:'#0000ff00',flexDirection:'row',marginTop:10,justifyContent: 'space-between',}}>
                                <Text style={[styles.textStyle_1,{backgroundColor:'#00000000',flex:1}]}>{this.state.params.data.express_sn}</Text>
                                <Text style={styles.textStyle_3}>×{this.state.params.data.number}</Text>
                            </View>
                            <View style={{backgroundColor:'#00000000',flexDirection:'row',marginTop:10,flex:1}}>
                                <Text style={[styles.textStyle_3,{backgroundColor:'#00000000',textAlign: 'left',flex:1}]}>{this.state.info.property}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.backView1,{marginTop:1}]}>
                    <View style={{backgroundColor:'#00000000',flexDirection:'row'}}>
                        <Text style={[styles.textStyle_3,{backgroundColor:'#00000000',textAlign: 'left',flex:1}]}>{moment.unix(this.state.params.data.create_time).format("YYYY-MM-DD HH:mm:ss")}</Text>
                        <Text style={[styles.textStyle_1,{backgroundColor:'#00000000',textAlign: 'right',flex:1}]}>{I18n.t('base.shop_total')}:{this.state.params.data.total} {this.state.params.data.currency_name}</Text>
                    </View>
                </View>
                <LongButton style={{marginLeft:24,marginRight:24,marginTop:31,height:50}} onPress={() => this.onClickSubmit()} disabled={this.state.isDisabled} title={I18n.t('tip.submit')}/>
            </View>

        );
    }
}

var styles = StyleSheet.create({

    backView1: {
        marginLeft:16,
        marginRight:16,
        marginTop:16,
        padding:16,
        flexDirection:'column',
        backgroundColor:'#FFFFFF',
        borderRadius: 3,
    },
    textStyle_1: {
        lineHeight:20,
        height:20,
        textAlign: 'left',
        color: '#353B48',
        fontSize:14,
    },
    textStyle_2: {
        textAlign: 'left',
        color: '#596379',
        fontSize:14,
    },
    textStyle_3: {
        lineHeight:20,
        height:20,
        textAlign: 'right',
        color: '#596379',
        fontSize:14,
        backgroundColor:'#00ff0000',

    },
})
