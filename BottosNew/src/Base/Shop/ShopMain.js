import React,{Component} from 'react'
import {DeviceEventEmitter,View, Text,FlatList, StyleSheet,Image,TouchableOpacity,NativeModules,Platform} from 'react-native'

import NavStyle from "../../Tool/Style/NavStyle";
import BTFetch from "../../Tool/NetWork/BTFetch";
import {Toast} from "antd-mobile-rn/lib/index.native";
import {getRequestBody,devlog, getRequestURL,getImageURL} from "../../Tool/FunctionTool";
import UserInfo from "../../Tool/UserInfo";
import Config from "../../Tool/Config";
import Swiper from 'react-native-swiper';
import I18n from "../../Tool/Language";
import BTWaitView from "../../Tool/View/BTWaitView.config";
let UMAnalyticsModule = NativeModules.UMAnalyticsModule;

export default class StopMain extends Component{

    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            headerLeft: (
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()} style={NavStyle.leftButton}>
                    <Image style={NavStyle.navBackImage} source={require('../../BTImage/navigation_back.png')}/>
                </TouchableOpacity>
            ),
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('base.base_shop')}</Text>,
            headerRight: (
                <TouchableOpacity activeOpacity={0.5} style={styles.rightButton} onPress={() => {navigation.push('ShopPayList')}}>
                    <Text style={styles.rightText}>{I18n.t('base.shop_pay_list')}</Text>
                </TouchableOpacity>
            ),
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
            adArray: [],
        };

    }

    componentDidMount() {
        this.adInit();

        if (Platform.OS === 'ios') {
            UMAnalyticsModule.onPageBegin('StopMain');
        } else if (Platform.OS === 'android') {
            UMAnalyticsModule.onPageStart('StopMain');
        }

        //page_size不传默认是8
        //page 不传默认是1
        //type 传0代表获取未付款订单
        //result no代表未支付 success代表付款成功 fail代表付款失败
        let body = {
            page_size:99999
        };
        let requestBody = getRequestBody(body);

        BTWaitView.show(I18n.t('tip.wait_text'));
        BTFetch("/shop/goods_list", requestBody)
            .then(res => {
                // devlog('********************',res);
                BTWaitView.hide();
                if (res.code === '0') {
                    this.setState({
                        dataArray:res.data.rows,
                    });

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

    componentWillUnmount() {
        UMAnalyticsModule.onPageEnd('StopMain');
    }

    //广告资源通知
    adInit = () => {
        for (let i = 0 ; i < UserInfo.adArray.length; i++){
            let ads = UserInfo.adArray[i];
            if (ads.flag === 'goods_details_page_top_banner' && ads.status === 1){
                if (ads.ad !== null && ads.ad != undefined){
                    this.setState({
                        adArray:ads.ad,
                    })
                }
            }
        }
    }

    onClickAd(url) {
        if (url === '' || url === undefined || url === null)
            return;
        this.props.navigation.navigate('BTPublicWebView',{url:url,navTitle:I18n.t('tip.ad_title')});
    }

    onClickCell(index) {
        // this.props.navigation.navigate('ShopAddAddress');
        this.props.navigation.navigate('ShopGoodsDetails',this.state.dataArray[index]);
        // this.props.navigation.navigate('ShopPayConfirm');
        // this.props.navigation.navigate('ShopPayResults');
    }

    render() {

        let swiperWidth = UserInfo.screenW;
        let swiperHeight = swiperWidth / 5 * 2;

        return (
            <View style={NavStyle.container}>
                {
                    this.state.adArray.length > 0 ?
                        <View style={{height:swiperHeight + 16}}>
                            <Swiper style={{height:swiperHeight + 16}}
                                    showsButtons={false}
                                    loop={true}
                                    showsPagination={true}
                                    autoplay={true}                //自动轮播
                                    autoplayTimeout={4}                //每隔4秒切换*/
                                    paginationStyle={{bottom: 3}}
                                    dotStyle={{backgroundColor: '#9B9B9B', width: 3, height: 3, borderRadius: 4,}}
                                    activeDotStyle={{backgroundColor: '#000000', width: 3, height: 3, borderRadius: 4,}}
                            >
                                {this.state.adArray.map((value, index) => {
                                    return (
                                        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClickAd(value.url)} style={{justifyContent: 'center', alignItems: 'center',}}>
                                            <Image style={{backgroundColor: '#ffffff', height:swiperHeight, width:swiperWidth, resizeMode: Image.resizeMode.contain,}} source={{ uri:getImageURL(value.file)}}/>
                                        </TouchableOpacity>
                                    )
                                })}
                            </Swiper>
                        </View>
                        :
                        <View style={{marginTop:16}} />
                }
                <View style={{flex:1}}>
                    <FlatList
                        ref={(flatList)=>this._flatList = flatList}
                        renderItem={this._renderItem}
                        onEndReachedThreshold={0}
                        showsVerticalScrollIndicator={false}
                        data={this.state.dataArray}
                        style={styles.goodsFlatList}>
                    </FlatList>
                </View>

            </View>
        );
    }

    _renderItem = (item) => {

        let title = item.item.name;
        let plice = item.item.price[0].price + ' ' + item.item.price[0].currency_name;
        let originalPrice = item.item.original_price;
        let original_price_type = item.item.original_price_type;
        let stock = item.item.stock;
        let img = item.item.img;

        return  (
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClickCell(item.index)}>
                <View style={styles.cell}>
                    <Image style={styles.goodsImage} source={{uri:getImageURL(img) }}/>
                    <View style={{marginLeft:20,marginRight:18,height:100,flex:1,flexDirection:'column'}}>
                        <Text style={styles.goodsTitle}>{title}</Text>
                        <View style={{backgroundColor: '#EFF0F3',height:1}}/>

                        <View style={{height:25,flexDirection:'row'}}>
                            <Text style={styles.goodsPlice}>{plice}</Text>
                            <View style={{height:25,flexDirection:'row',marginLeft:10,alignItems:'center'}}>
                                <Text style={styles.goodsOriginalPrice}>{original_price_type}{originalPrice}</Text>
                                <View style={{position:'absolute',backgroundColor: '#BBBBBB',height:1,width:40}}/>
                            </View>
                        </View>
                        <View style={{backgroundColor: '#EFF0F3',height:1}}/>
                        <Text style={styles.goodsStock}>{I18n.t('base.shop_stock')}：{stock}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

}

const styles = StyleSheet.create({

    goodsFlatList: {
        width: UserInfo.screenW - 32,
        marginLeft: 16,
        marginRight: 16,
    },
    cell:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: '#ffffff',
        height:96,
        marginBottom:16,
        borderRadius:3
    },
    goodsTitle: {
        textAlign: 'left',
        color: '#000000',
        height:20,
        lineHeight:20,
        fontSize: 14,
        marginTop:8,
        marginBottom:8,
    },
    goodsPlice: {
        textAlign: 'left',
        color: '#F15B40',
        height:17,
        lineHeight:17,
        fontSize: 12,
        backgroundColor:'transparent',
        marginTop:4,
        marginBottom:4,
    },
    goodsOriginalPrice: {
        textAlign: 'left',
        color: '#D1D5DD',
        height:17,
        lineHeight:17,
        fontSize: 12,
        backgroundColor:'transparent',
        marginTop:4,
        marginBottom:4,
    },
    goodsStock: {
        textAlign: 'left',
        color: '#8395A7',
        height:17,
        lineHeight:17,
        fontSize: 12,
        backgroundColor:'transparent',
        marginTop:4,
    },
    goodsImage: {
        height: 80,
        width: 80,
        marginLeft: 8,
        resizeMode: Image.resizeMode.contain,
    },
    rightButton: {
        width: 80,
        height: 44,
        marginRight: 0,
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff000f00',
    },
    rightText: {
        lineHeight:44,
        height: 44,
        color: '#046FDB',
        fontSize: 16,
        backgroundColor: '#ff00f000',
    },
});
