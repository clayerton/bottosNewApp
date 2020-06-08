import React, { Component } from 'react';
import {View,Text, Image, TouchableOpacity, StyleSheet, FlatList, DeviceEventEmitter,Clipboard} from 'react-native';
import NavStyle from "../../Tool/Style/NavStyle";
import { Toast } from 'antd-mobile-rn'
import moment from "moment/moment";
import Config from "../../Tool/Config";
import BTFetch from "../../Tool/NetWork/BTFetch";
import {getRequestBody,devlog, getRequestURL,getImageURL} from "../../Tool/FunctionTool";
import UserInfo from "../../Tool/UserInfo";
import I18n from "../../Tool/Language";
import BTWaitView from "../../Tool/View/BTWaitView.config";

export default class ShopPayList extends Component{

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
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('base.shop_pay_list')}</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground,
        };
    };


    constructor(props) {
        super(props);

        this.state = {
            dataArray: [],
            showText:"",
        };

        //page_size不传默认是8
        //page 不传默认是1
        //type 传0代表获取未付款订单
        //result no代表未支付 success代表付款成功 fail代表付款失败
        let body = {
            token:UserInfo.token,
            page_size:99999
        };
        let requestBody = getRequestBody(body);
        BTWaitView.show(I18n.t('tip.wait_text'));
        BTFetch("/shop/get_order_list", requestBody)
            .then(res => {
                BTWaitView.hide();
                // devlog('get_order_list res: ', res);
                if (res.code === '0') {
                    if (res.data.rows.length <= 0){
                        this.setState({
                            showText:I18n.t('base.shop_no_order'),
                        });
                    }else {
                        this.setState({
                            dataArray:res.data.rows,
                            showText:"",
                        });
                    }
                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    Toast.info(res.msg,Config.ToestTime,null,false);
                }
            })
            .catch(res => {
                BTWaitView.hide();
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            });
    }

    copy(value){
        Clipboard.setString(value);
        try {
            Clipboard.getString();
            Toast.info(I18n.t('tip.copy_success'), Config.ToestTime, null, false)
        }catch(e){
            this.setState({invite:e.message})
        }
    }

    render() {
        let dataLength = this.state.dataArray.length;
        return (
            <View style={NavStyle.container}>
            {dataLength > 0 ?
                    <View style={{flex:1}}>
                        <FlatList
                            ref={(flatList)=>this._flatList = flatList}
                            renderItem={this._renderItem}
                            onEndReachedThreshold={0}
                            getItemLayout={(data,index)=>(
                                {length: 200, offset: (100+2) * index, index}
                            )}
                            data={this.state.dataArray}
                            style={styles.goodsFlatList}>
                        </FlatList>
                    </View>
                    :
                    <View style={{flex:1}}>
                        <Text style={{backgroundColor:'#ff000000',marginTop:100,textAlign: 'center',fontSize:20,color:'#596379'}}>{this.state.showText}</Text>
                    </View>}
            </View>

        );
    }


    _renderItem = (item) => {

        let info = JSON.parse(item.item.info);

        let result = '';
        let resultColor = '';
        if (item.item.result === 'SUCCESS') {
            result = I18n.t('base.shop_already_paid');
            resultColor = 'green';
        }else if(item.item.result === 'NO'){
            result = I18n.t('base.shop_unpaid');
            resultColor = 'red';
        }else if(item.item.result === 'FAIL'){
            result = I18n.t('base.shop_failure_payment');
            resultColor = 'red';
        }

        return  (
            <View style={{flex:1}}>
                <View style={styles.backView1}>
                    <View style={{backgroundColor:'#00000000',flexDirection:'row'}}>
                        <Text style={[styles.textStyle_1,{backgroundColor:'#00000000',marginTop:5,flex:1}]}>{I18n.t('base.shop_order')}：{item.item.order_sn}</Text>
                        <Text style={[styles.textStyle_1,{backgroundColor:'transparent',marginTop:5,color:resultColor}]}>{result}</Text>
                    </View>
                    <View style={{backgroundColor:'#00000000',flexDirection:'row',marginTop:10}}>
                        <Image style={{backgroundColor:'white',width:80,height:80,borderRadius: 5,resizeMode: Image.resizeMode.contain,marginTop:8}} source={{ uri:getImageURL(info.image)}}/>
                        <View style={{backgroundColor:'#00000000',marginLeft:10,marginTop:8,flexDirection:'column',flex:1}}>
                            <View style={{backgroundColor:'#00000000',flexDirection:'row',flex:1}}>
                                <Text style={[styles.textStyle_1,{backgroundColor:'#00000000',flex:1}]}>{info.title}</Text>
                                <Text style={styles.textStyle_3}>{item.item.price} {item.item.currency_name}</Text>
                            </View>
                            <View style={{backgroundColor:'#0000ff00',flexDirection:'row',marginTop:10,justifyContent: 'space-between',}}>
                                <TouchableOpacity activeOpacity={0.5} onPress={()=>this.copy(item.item.express_sn)}>
                                    <Text style={[styles.textStyle_3,{backgroundColor:'#00000000', textAlign: 'left',}]}>{item.item.express_sn}</Text>
                                </TouchableOpacity>
                                <Text style={styles.textStyle_3}>×{item.item.number}</Text>
                            </View>
                            <View style={{backgroundColor:'#00000000',flexDirection:'row',marginTop:10,flex:1}}>
                                <Text style={[styles.textStyle_3,{backgroundColor:'#00000000',textAlign: 'left',flex:1}]}>{info.property}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.backView1,{marginTop:1}]}>
                    <View style={{backgroundColor:'#00000000',flexDirection:'row'}}>
                        <Text style={[styles.textStyle_3,{backgroundColor:'#00000000',textAlign: 'left',flex:1}]}>{moment.unix(item.item.create_time).format("YYYY-MM-DD HH:mm:ss")}</Text>
                        <Text style={[styles.textStyle_1,{backgroundColor:'#00000000',textAlign: 'right',flex:1}]}>{I18n.t('base.shop_total')}:{item.item.total} {item.item.currency_name}</Text>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({

    cell:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'transparent',
        height:100,
        margin:5,
        borderColor:'black',
        borderWidth:1
    },
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
});
