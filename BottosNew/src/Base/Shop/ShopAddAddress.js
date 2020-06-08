
import React, { Component } from 'react';
import {View,Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions} from 'react-native';
import NavStyle from "../../Tool/Style/NavStyle";
import {Toast} from "antd-mobile-rn";
import {getLocalStorage,setLocalStorage,devlog} from "../../Tool/FunctionTool";
import UserInfo from "../../Tool/UserInfo";
import Config from "../../Tool/Config";
import LongButton from '../../Tool/View/BTButton/LongButton'
import I18n from "../../Tool/Language";

export default class ShopAddAddress extends Component {

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
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('base.shop_add_address')}</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            isDisabled:true,
            shopAddressAddress: ''
        };
    }

    componentDidMount() {
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
                this.setState({
                    isDisabled:true,
                    shopAddressAddress: ''
                });
            }
        );
    }
    onChangeText(value) {
        if (value === null || value === '') {
            this.setState({
                isDisabled:true,
            });
        }else{
            this.setState({
                isDisabled:false,
            });
        }
        this.state.shopAddressAddress = value;
    }

    onClickSubmit() {
        if (this.state.shopAddressAddress ===''){
            Toast.info(I18n.t('base.shop_address_empty2'), Config.ToestTime, null, false);
            return
        }
        setLocalStorage('shopAddress', {
            shopAddressAddress: this.state.shopAddressAddress
        });

        const {state} = this.props.navigation;
        state.params.callback(this.state.shopAddressAddress);

        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={NavStyle.container}>
                <View style={[styles.cell]}>
                    <Text style={styles.topTxt}>{I18n.t('base.shop_consignee')}</Text>
                    <Text style={[styles.bottomTextInput,{height:20,color: '#999999'}]}>{this.props.navigation.state.params.shopAddressName}</Text>
                </View>
                <View style={[styles.cell,{marginTop:1}]}>
                    <Text style={styles.topTxt}>{I18n.t('base.shop_phone')}</Text>
                    <Text style={[styles.bottomTextInput,{height:20,color: '#999999'}]}>{this.props.navigation.state.params.shopAddressPhone}</Text>
                </View>
                <View style={[styles.cell,{marginTop:1}]}>
                    <Text style={styles.topTxt}>{I18n.t('base.shop_address')}</Text>
                    <TextInput
                        style={styles.bottomTextInput}
                        keyboardType = 'default'
                        maxLength = {100}
                        underlineColorAndroid="transparent"
                        placeholder = {I18n.t('base.shop_input_address')}
                        defaultValue = {this.state.shopAddressAddress}
                        multiline = {true}
                        clearButtonMode = 'while-editing'
                        blurOnSubmit = {true}
                        onChangeText={value => {
                            this.onChangeText(value)
                        }}
                        value={this.state.shopAddressAddress}
                    />
                </View>

                <LongButton style={{marginLeft:24,marginRight:24,marginTop:44,height:50}} onPress={() => this.onClickSubmit()} disabled={this.state.isDisabled} title={I18n.t('tip.submit')}/>

                <Text numberOfLines={10} style= {{textAlign: 'left',color: '#999999',fontSize: 12,lineHeight:20,height:60,marginTop:30,marginLeft:24,marginRight:24}}>{I18n.t('base.shop_tips')}</Text>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    cell: {
        marginLeft:16,
        marginRight:16,
        marginTop:16,
        flexDirection:'column',
        backgroundColor:'#FFFFFF',
        borderRadius: 3,
    },
    topTxt: {
        lineHeight:20,
        height:20,
        marginLeft:16,
        marginRight:16,
        marginTop:8,
        textAlign: 'left',
        color: '#353B48',
        fontSize: 14,
    },
    bottomTextInput: {
        color:'#596379',
        marginLeft:16,
        marginRight:16,
        marginTop:8,
        marginBottom:8,
        fontSize: 14,
    },
});