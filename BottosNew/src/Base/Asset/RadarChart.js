import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ImageBackground,
    DeviceEventEmitter,
    ScrollView,
    StyleSheet,
} from 'react-native'

import NavStyle from '../../Tool/Style/NavStyle'
import I18n from '../../Tool/Language/index'
import Config from '../../Tool/Config'
import LongButton from '../../Tool/View/BTButton/LongButton'
import { Toast } from 'antd-mobile-rn/lib/index.native'
import BTRadarChart from '../../Tool/View/BTRadarChart/BTRadarChart'
import UserInfo from "../../Tool/UserInfo";
import BTWaitView from "../../Tool/View/BTWaitView.config";
import BTFetch from "../../Tool/NetWork/BTFetch";
import {getRequestBody,devlog, getRequestURL,getImageURL} from "../../Tool/FunctionTool";

export default class RadarChart extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
            header: null,
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            itemIndex:0,
            itemValue:'',
            data: [],
            waliValue:'0',
        }
    }

    componentDidMount() {

        let body = {};
        let requestBody = getRequestBody(body);

        BTWaitView.show(I18n.t('tip.wait_text'));
        BTFetch("/member/member_dimensional", requestBody)
            .then(res => {
                devlog('********************',res);
                BTWaitView.hide();
                if (res.code === '0') {
                    this.setState({
                        waliValue:res.data.my_value,
                        data:res.data.list,
                        itemValue:res.data.list[0].brief,
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

    onClickBack() {
        this.props.navigation.goBack();
    }
    onClickRightButton() {
        this.props.navigation.navigate('BTPublicWebView',{url:'http://url.lnk4.cn/url/79809224572',navTitle:''});
    }
    onClickItem(index,value) {
        if (this.state.itemIndex !== index){
            this.setState({
                itemIndex:index,
                itemValue:value,
            });
        }
    }

    render() {

        let swiperWidth = UserInfo.screenW;
        let swiperHeight = swiperWidth / 1125 * 597;

        return (
            <View style={NavStyle.container}>
                <ScrollView style={styles.scrollView}>
                    <ImageBackground style={{width: swiperWidth, height: swiperHeight}} source={require('../../BTImage/Base/radarchart_background.png')}>
                        <View style={{flexDirection:'row',backgroundColor: '#FF00FF00',}}>
                            <TouchableOpacity activeOpacity={0.5}
                                              onPress={() => this.onClickBack()}
                                              style={{marginTop:10, marginLeft:0, width: 50, height: 50, backgroundColor: '#FFFF0000',alignItems: 'center', justifyContent: 'center',}}>
                                <Image style={[NavStyle.navBackImage,{width: 15, height: 14,}]} source={require('../../BTImage/Base/radarchart_back.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5}
                                              onPress={() => this.onClickRightButton()}
                                              style={{position: 'absolute', top: 10, right: 0, width: 50, height: 50, backgroundColor: '#FFFF0000',alignItems: 'center', justifyContent: 'center',}}>
                                <Image style={[NavStyle.navBackImage,{width: 21, height: 21,}]} source={require('../../BTImage/Base/radarchart_wenhao.png')}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection:'row', marginLeft:12,marginTop:10,  backgroundColor: '#0000FF00',}}>
                            <Text style={{ color: '#FFFFFFFF', fontSize: 34 }}>{this.state.waliValue}</Text>
                            <Text style={{ color: '#FFFFFFFF', fontSize: 12,marginLeft:6, marginTop:20 }}>瓦力值</Text>
                        </View>

                    </ImageBackground>
                    {
                        this.state.data.length > 0 ?
                            <BTRadarChart
                                style={{width:300,alignSelf:'center', height: 250,marginTop:24, backgroundColor: '#00FF0000'}}
                                dataArray={this.state.data}
                                onClickView={(e) => {//模拟原生回传数据给RN
                                    console.log('test' + e.nativeEvent.value);
                                }
                                }/>
                            :<View></View>
                    }

                    <View style={{flexDirection:'row', backgroundColor: '#0000FF00',}}>

                        {this.state.data.map((value, index) => {

                            let imageName = require('../../BTImage/Base/radarchart_lishi.png');

                            if (value.key === 'radarchart_lishi'){
                                imageName = require('../../BTImage/Base/radarchart_lishi.png');
                            } else if(value.key === 'radarchart_neirong'){
                                imageName = require('../../BTImage/Base/radarchart_neirong.png');
                            }else if(value.key === 'radarchart_renmai'){
                                imageName = require('../../BTImage/Base/radarchart_renmai.png');
                            }else if(value.key === 'radarchart_shenfen'){
                                imageName = require('../../BTImage/Base/radarchart_shenfen.png');
                            }else if(value.key === 'radarchart_token'){
                                imageName = require('../../BTImage/Base/radarchart_token.png');
                            }

                            return (
                                <TouchableOpacity
                                    onPress={() => this.onClickItem(index,value.brief)}
                                    style={{flexDirection:'column',alignItems: 'center', width: UserInfo.screenW/5, backgroundColor: '#0000FF00',}}>

                                    <Image style={{width: 25, height: 26,}} source={imageName}/>
                                    <Text style={{marginTop:7, color: '#212833', fontSize: 12 }}>{value.name}</Text>
                                    {
                                        this.state.itemIndex === index ?
                                            <Image style={{marginTop:6,width: 15, height: 3,}} source={require('../../BTImage/Base/radarchart_juxing.png')}/>
                                            :<View></View>
                                    }
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    <View style={{flexDirection:'row',padding:15, marginLeft:12, marginRight:12, marginTop:25, marginBottom:20, backgroundColor: '#F5F5F5',}}>
                        <Text style={{color: '#212833', fontSize: 13,lineHeight:16,flex:1 }}>{this.state.itemValue}</Text>
                    </View>

                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#FF000000',
    },
})
