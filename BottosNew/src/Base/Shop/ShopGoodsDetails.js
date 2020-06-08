
import React, { Component } from 'react';
import {StyleSheet,ScrollView, View, Text, Image, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import NavStyle from "../../Tool/Style/NavStyle";
import Swiper from 'react-native-swiper';
import { Toast } from 'antd-mobile-rn'
import UserInfo from "../../Tool/UserInfo";
import Config from "../../Tool/Config";
import BTFetch from "../../Tool/NetWork/BTFetch";
import {getRequestBody,devlog, getImageURL} from "../../Tool/FunctionTool";
import I18n from "../../Tool/Language";
import BTWaitView from "../../Tool/View/BTWaitView.config";

export default class ShopGoodsDetails extends Component {

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
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('base.shop_goods_details')}</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            swiperView: <Text />,
            sizeIndex: 0,
            colorIndex: 0,
            data:'',
            image:[],
            property:[],
            info:[],
            imageSize:[],
        };
    }

    componentDidMount() {
        // devlog('-----1----',this.props.navigation.state);

        let body = {
            goods_id:this.props.navigation.state.params.id,
        };
        let requestBody = getRequestBody(body);
        BTWaitView.show(I18n.t('tip.wait_text'));
        BTFetch("/shop/goods_detail", requestBody)
            .then(res => {
                BTWaitView.hide();
                // devlog('-----1----',res);
                if (res.code === '0') {
                    this.setState({
                        data:res.data,
                        image:res.data.img === null ? [] : res.data.img,
                        property:res.data.property === null ? [] : res.data.property,
                        info:res.data.info === null ? [] : res.data.info,
                    });
                    //获取详情网络图片尺寸
                    this.state.info.map((value, index) => {
                        Image.getSize(getImageURL(value), (width, height) => {
                            // this.state.imageSize.push({width:width,heght:height});
                            this.setState ({
                                imageSize:[...this.state.imageSize,{width:width,height:height}],
                            })
                        });
                        // devlog('=====width=====height====',this.state.imageSize);
                    })
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

    onClickProperty(index1,index2) {

        let select = this.state.property[index1];
        select.select = index2;

        this.setState ({
            property:this.state.property,
        });
    }

     onClickPay() {

        let info = {
            originalPrice:this.props.navigation.state.params.original_price,
            plice:this.props.navigation.state.params.price,
            title:this.props.navigation.state.params.name,
            image:this.props.navigation.state.params.img,
            property:'',
        };

        //拼接详情字符串
        let pro = '';
        this.state.property.map((value, index) => {

            let strs=value.value.split(",");
            if (this.state.property[index].select === undefined){
                pro += value.name + ':' + strs[0] + ' ';
            } else{
                pro += value.name + ':' + strs[this.state.property[index].select] + ' ';
            }
        });
        info.property = pro;

        let body = {
            token:UserInfo.token,
            goods_id:this.props.navigation.state.params.id,
            number:1,
            price:this.props.navigation.state.params.price[0].price,
            currency_name:this.props.navigation.state.params.price[0].currency_name,
            info:JSON.stringify(info),
        };
        let requestBody = getRequestBody(body);
         BTWaitView.show(I18n.t('tip.wait_text'));
        BTFetch("/shop/create_order", requestBody)
            .then(res => {
                // devlog('====res===',res);
                if (res.code === '0') {
                    this.props.navigation.navigate('ShopPayConfirm',res);
                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    Toast.info(res.msg,Config.ToestTime,null,false);
                }
            })
            .catch(res => {
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            });
    }

    render() {

        let plice = this.props.navigation.state.params.price[0].price + ' ' + this.props.navigation.state.params.price[0].currency_name;

        let swiperWidth = UserInfo.screenW - 32;
        let swiperHeight = swiperWidth / 2;

        return (

            <View style={NavStyle.container}>
                <ScrollView style={{backgroundColor:'transparent',marginLeft:16,marginRight:16}} showsVerticalScrollIndicator = {false} showsHorizontalScrollIndicator = {false}>
                    {
                        this.state.image.length > 0 ?
                            <Swiper style={{height:swiperHeight + 16 ,marginTop: 10}} showsButtons={false} loop={false} showsPagination={true}
                                    paginationStyle={{bottom: 3}}
                                    dotStyle={{backgroundColor: '#9B9B9B', width: 3, height: 3, borderRadius: 4,}}
                                    activeDotStyle={{backgroundColor: '#000000', width: 3, height: 3, borderRadius: 4,}}
                            >
                                {this.state.image.map((value, index) => {
                                    return (
                                        <View style={{justifyContent: 'center', alignItems: 'center',}}>
                                            <Image style={{backgroundColor: '#ffffff', height:swiperHeight, width:swiperWidth, resizeMode: Image.resizeMode.contain,}}  source={{ uri:getImageURL(value) }}/>
                                        </View>
                                    )
                                })}
                            </Swiper>
                            :
                            <View style={{marginTop:16}} />
                    }

                    <Text style={{lineHeight:25,height:25,marginTop:32,color: '#353B48', backgroundColor:'transparent', fontSize:18}}>{this.props.navigation.state.params.name}</Text>
                    <View style={{height:17,flexDirection:'row',alignItems:'center'}}>
                        <Text style={{lineHeight:17,height:17,color: '#D1D5DD',fontSize:12}}>{this.props.navigation.state.params.original_price_type}{this.props.navigation.state.params.original_price}</Text>
                        <View style={{position:'absolute',backgroundColor: '#D1D5DD',height:1,width:32}}/>
                    </View>
                    <Text style={{lineHeight:22,height:22,color: '#F15B40', backgroundColor:'transparent', fontSize:16}}>{plice}</Text>
                    <Text style={{lineHeight:17,height:17,color: '#D1D5DD', fontSize:12 }}>{I18n.t('base.shop_stock')}：{this.props.navigation.state.params.stock}</Text>
                    <View style={{backgroundColor: '#EFF0F3',height:1,marginTop:12}}/>

                    {this.state.property.map((value, index1) => {
                        // devlog('---value----',value);

                        let strs=value.value.split(",");

                        return (
                            <View style={{backgroundColor: 'transparent',height:41,flexDirection:'column'}}>
                                <View style={{backgroundColor: 'transparent',height:40,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{lineHeight:20,height:20,color: '#596379',fontSize:14}}>{value.name}</Text>
                                    {strs.map((value, index2) => {
                                        let indexBuffer = 0;
                                        // devlog('---length----',value.toString().length);

                                        if(this.state.property[index1].select !== undefined){
                                            indexBuffer = this.state.property[index1].select;
                                        }
                                        // devlog('-----',index1,'-----',index2,'-----',indexBuffer,'-----',this.state.property[index1].select);

                                        return (
                                            <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClickProperty(index1,index2)} style={[styles.checkTouchStyle,value.toString().length <= 3 ? {width:42} : {}]}>
                                                <View style={[indexBuffer === index2 ? styles.checkSelectStyle : styles.checkStyle,value.toString().length <= 2 ? {width:25} : {}]}>
                                                    <Text style={indexBuffer=== index2 ? styles.checkTextSelectStyle : styles.checkTextStyle}>{value}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                                <View style={{backgroundColor: '#EFF0F3',height:1}}/>
                            </View>
                        )
                    })}
                    <View style={{backgroundColor: 'transparent',flex:1,marginTop:30}}>

                        {this.state.info.map((value, index) => {
                             // devlog('---info----',value);

                            let imageWidth = 0;
                            let imageHeight = 0;
                            // devlog('---this.state.imageSize.length,index---',this.state.imageSize.length,index);

                            if (this.state.imageSize.length > index){
                                imageWidth = this.state.imageSize[index].width;
                                imageHeight = this.state.imageSize[index].height;
                                // devlog('---imageWidth,imageHeight---',imageWidth,imageHeight);
                            }

                            let showWidth = UserInfo.screenW - 44;
                            let showHeight = (UserInfo.screenW - 44) * imageHeight / imageWidth;

                            return (
                                <Image style={{resizeMode: Image.resizeMode.contain,width:showWidth,height:showHeight}} source={{ uri:getImageURL(value) }}/>
                            )
                        })}
                    </View>

                </ScrollView>

                <View style={{alignItems:'center',backgroundColor:'#FFFFFF',height:48,flexDirection:'row'}}>
                    <Text style={{textAlign: 'left',color: '#F15B40',fontSize:16,flex:1,marginLeft:16}}>{I18n.t('base.shop_total')}：{plice}</Text>

                    {this.props.navigation.state.params.stock >= 1 ? (
                        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClickPay()} style={{backgroundColor: '#00000000',height:48,width:99,marginRight:16,alignItems: 'center',justifyContent: 'center'}}>
                            <View style={{backgroundColor:'#4A90E2',height:32,width:99,borderRadius:100}}>
                                <Text style={{lineHeight:32,height:32,textAlign: 'center',fontWeight: 'bold',color: '#FFFFFF',fontSize:14}}>{I18n.t('base.shop_redeem')}</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <View style={{backgroundColor:'#EFF0F3',height:32,width:99,marginRight:16,borderRadius:100}}>
                            <Text style={{lineHeight:32,height:32,textAlign: 'center',fontWeight: 'bold',color: '#D1D5DD',fontSize:14}}>{I18n.t('base.shop_redeem')}</Text>
                        </View>
                    )}

                </View>

            </View>
        );
    }
}

var styles = StyleSheet.create({

    checkTouchStyle:{
        backgroundColor: '#00000000',
        height:40,
        // width:42,
        marginRight:5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkStyle: {
        backgroundColor:'#D1D5DD',
        height:17,
        // width:25,
    },
    checkSelectStyle: {
        backgroundColor:'#353B48',
        height:17,
        // width:25,
    },
    checkTextStyle: {
        lineHeight:17,
        flex:1,
        textAlign: 'center',
        color: '#353B48',
        fontSize:12
    },
    checkTextSelectStyle: {
        lineHeight:17,
        flex:1,
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize:12
    },

});
