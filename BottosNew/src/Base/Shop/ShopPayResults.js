
import React, { Component } from 'react';
import {View,Text, Platform, TouchableOpacity, StyleSheet, Image,BackAndroid} from 'react-native';
import NavStyle from "../../Tool/Style/NavStyle";
import moment from "moment/moment";
import {devlog} from "../../Tool/FunctionTool";
import I18n from "../../Tool/Language";

export default class ShopPayResults extends Component {

    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            headerLeft: (
                <TouchableOpacity  style={NavStyle.rightButton}>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity  style={NavStyle.rightButton}>
                </TouchableOpacity>
            ),
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('base.shop_pay_results')}</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground,
        };
    };

    constructor(props) {
        super(props);
         // devlog(this.props.navigation.state.params);
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    onBackAndroid = () => {
        this.props.navigation.pop(3);
        return true;
    };

    onClickConfirm() {
        this.props.navigation.pop(3);
    }

    render() {

        return (
            <View style={[NavStyle.container,{justifyContent:'center',alignItems: 'center'}]}>
                {this.props.navigation.state.params.code === '0' ?
                    (
                        <View style={{width:310,height:268, backgroundColor:'#FFFFFF',borderRadius: 8,alignItems: 'center'}}>
                            <Image style={{width:50,height:50,marginTop:16}} source = {require('../../BTImage/Base/Shop/shop_pay_success.png')}/>
                            <Text style={[styles.payState]}>{I18n.t('base.shop_payment_success')}</Text>
                                <Text style={[styles.goodsTxt,{marginTop:16}]}>{I18n.t('base.shop_order')}：{this.props.navigation.state.params.data.order_sn}</Text>
                                <Text style={[styles.goodsTxt,{marginTop:8}]}>{I18n.t('base.shop_pay_time')}：{moment.unix(this.props.navigation.state.params.data.create_time).format("YYYY-MM-DD HH:mm:ss")}</Text>
                                <Text style={[styles.goodsTxt,{marginTop:8}]}>{I18n.t('base.shop_pay_amount')}：{this.props.navigation.state.params.data.total} {this.props.navigation.state.params.data.currency_name}</Text>
                            <View style={{backgroundColor: '#EFF0F3',width:310,height:1,marginTop:16}}/>
                            <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClickConfirm()} style={{width:310,flex:1}}>
                                <Text style={{textAlign: 'center', lineHeight:44,flex:1,fontSize:20,color: '#353B48'}}>{I18n.t('tip.confirm')}</Text>
                            </TouchableOpacity>
                        </View>
                    ):(
                        <View style={{width:310,height:268, backgroundColor:'#FFFFFF',borderRadius: 8,alignItems: 'center'}}>
                            <Image style={{width:50,height:50,marginTop:16}} source = {require('../../BTImage/Base/Shop/shop_pay_fail.png')}/>
                            <Text style={[styles.payState]}>{I18n.t('base.shop_failure_payment2')}</Text>
                            <Text numberOfLines={10} style={[styles.goodsTxt,{marginTop:16,lineHeight:22,height:66,}]}>{I18n.t('base.shop_cause_failure')}：{this.props.navigation.state.params.msg}</Text>
                            <View style={{backgroundColor: '#EFF0F3',width:310,height:1,marginTop:32}}/>
                            <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClickConfirm()} style={{width:310,flex:1}}>
                                <Text style={{textAlign: 'center', lineHeight:44,flex:1,fontSize:20,color: '#353B48'}}>{I18n.t('tip.confirm')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    payState: {
        marginTop:6,
        lineHeight:33,
        height:33,
        textAlign: 'center',
        color: '#353B48',
        fontSize: 24,
    },
    goodsTxt: {
        lineHeight:22,
        height:22,
        width:310 - 36,
        textAlign: 'left',
        color: '#353B48',
        fontSize: 16,
    },

});
