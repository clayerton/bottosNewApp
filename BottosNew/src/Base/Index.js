import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    ScrollView,
    StyleSheet,
    RefreshControl,
    DeviceEventEmitter,
    Animated,
    TouchableOpacity,
    ImageBackground,
} from "react-native";

import {
    getRequestBody,
    devlog,
    getRequestURL,
    getImageURL,
} from "../Tool/FunctionTool";
import UserInfo,{logUserInfo} from "../Tool/UserInfo";
import BTFetch from "../Tool/NetWork/BTFetch";
import {Toast} from "antd-mobile-rn/lib/index.native";
import Config from "../Tool/Config";
import I18n from "../Tool/Language";
import ScrollVertical from '../Tool/View/ScrollVertical'
import Sound from 'react-native-sound';
import Swiper from 'react-native-swiper';

//宝箱参数
const BoxWdith = 50;
const BoxHeight = 75;
const BoxSuperHeight = UserInfo.screenH - 45 - 75 - 49 - 308;

//按钮参数
const buttonSpaceW = 12;
const buttonSpaceH = 16;
const buttonW = (UserInfo.screenW - buttonSpaceW * 4) / 3;


export default class Index extends Component {

    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            header: null,
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            isShowShare: false,

            isSign: false, // 是否签到
            signAnim: new Animated.Value(0),//签到移动动画
            signAnim2: new Animated.Value(1),//签到透明动画
            signAnimHidden:true,//签到动画状态
            signArray:[],//签到内容数组

            buttonArray:[],
            sunline:0,
            asset:0,
            isRefreshing: false,//下拉刷新状态
            getAnnouncement: [],//公告列表
            boxArray: [],//宝箱列表
            adBox: '',//宝箱广告
            adBg: '',//背景广告
        };

        //Token超时通知
        this.eventHandle = DeviceEventEmitter.addListener(
            Config.TokenDeviceEventEmitter,
            this.tokenDeviceEventEmitter,
        );
        //登录成功通知
        this.eventHandle = DeviceEventEmitter.addListener(
            Config.LoginDeviceEventEmitter,
            this.loginDeviceEventEmitter,
        );
        //广告通知
        this.eventHandle = DeviceEventEmitter.addListener(
            Config.AdDeviceEventEmitter,
            this.adDeviceEventEmitter,
        );

        props.navigation.addListener('didFocus', e => {
            const action = e.action || {}
            if (action.type === 'Navigation/INIT') return
            this.getDto();    //获取资产
        })
    }

    componentDidMount() {
        devlog('-----componentDidMount-----');

        if (UserInfo.token !== '') {
            this.initData()
        }
    }

    //Token超时通知
    tokenDeviceEventEmitter = (value) => {
        devlog('-------准备进入Login------');
        if (!UserInfo.isLoginState){
            devlog('-------成功进入Login------');
            UserInfo.isLoginState = true;
            if (value !== null && value !== undefined && value !== ''){
                Toast.info(value,Config.ToestTime,null,false);
            }
            this.props.navigation.navigate('Login');
        }
    };
    //接受登录通知
    loginDeviceEventEmitter = () => {
        devlog('---------------登录成功-------Base--------');
        UserInfo.isLoginState = false;
        this.initData();
    };
    //广告资源通知
    adDeviceEventEmitter = () => {
        devlog('---------------广告资源通知-------Base--------');
        for (let i = 0 ; i < UserInfo.adArray.length; i++){
            let ads = UserInfo.adArray[i];
            if (ads.flag === 'box' && ads.status === 1 && ads.ad !== undefined && ads.ad.length > 0){
                this.setState({
                    adBox:getImageURL(ads.ad[0].file) ,
                })
            }else if (ads.flag === 'home_page_bg' && ads.status === 1 && ads.ad !== undefined && ads.ad.length > 0){
                this.setState({
                    adBg:getImageURL(ads.ad[0].file) ,
                })
            }
        }
    }

    initData(){
        // logUserInfo();
        this.getAnnouncement();    //获取公告信息
        this.getBox();    //获取宝箱信息
        this.getDto();    //获取资产
        this.geButton();   //获取按钮列表
        this.memberSignStatus() // 每日签到状态
        this.adDeviceEventEmitter() //广告资源
    }

    //获取按钮列表
    geButton() {
        let body = {};
        let requestBody = getRequestBody(body);

        BTFetch("/app/title_info", requestBody)
            .then(res => {
                if (res.code === '0') {
                    // devlog('++++++++++',res);
                    this.setState({
                        buttonArray: res.data,
                        // buttonArray: [{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"},{id: "1"}],
                    });
                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    Toast.info(res.msg,Config.ToestTime,null,false);
                }
            })
            .catch(res => {
            });
    }
    //获取资产
    getDto() {
        let body = {
            token:UserInfo.token,
        };
        let requestBody = getRequestBody(body);

        BTFetch("/member/getMemberInfo", requestBody)
            .then(res => {
                // devlog('+++++++++++',res);
                if (res.code === '0') {
                    let sum = res.data.btos + '';
                    let field = sum.substring(0, sum.indexOf('.') + 3);
                    this.setState({
                        asset: field,
                        sunline: res.data.hashrate
                    })
                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    Toast.info(res.msg,Config.ToestTime,null,false);
                }
            })
            .catch(res => {
            });
    }
    //获取宝箱
    getBox() {

        //清空动画对象
        for (let i = 0; i < this.state.boxArray.length; i++) {
            let boxInfo = this.state.boxArray[i];

            if (boxInfo !== null && boxInfo !== undefined){
                boxInfo.moveAnim.removeAllListeners();
                boxInfo.scaleAnim.removeAllListeners();
                boxInfo.opacityAnim.removeAllListeners();
                boxInfo.moveAnim = null;
                boxInfo.scaleAnim = null;
                boxInfo.opacityAnim = null;
            }
        }

        //清空数组
        this.state.boxArray = [];
        //重新绘制
        this.setState({
            boxArray: [],
        });

        let body = {};
        let requestBody = getRequestBody(body);

        BTFetch("/cultivate/cultivateList", requestBody)
            .then(res => {
                if (res.code === '0') {
                    // cultivate_id：耕作id
                    // output_type：果实输出的类型 1.bto 2.阳光值
                    // output：果实输出的数量
                    // starttime：果实开始时间
                    // endtime：果实结果时间
                    devlog('++++++++++++',res);
                    let boxBufferArray = [];
                    for (let i = 0; i < res.data.length; i++) {
                        var boxInfo = {
                            cultivate_id:0,
                            output_type:0,
                            fruit_id:0,
                            output:0,
                            starttime:0,
                            endtime:0,
                            x:0,
                            y:0,
                            isSelected:false,
                            startAnimatedTime:0,
                            moveAnim: new Animated.Value(0),//宝箱上下动画
                            scaleAnim: new Animated.Value(1),//宝箱缩放动画
                            opacityAnim: new Animated.Value(0),//宝箱透明度动画
                        };

                        let box = res.data[i];

                        boxInfo.startAnimatedTime = Math.random() * 4000;
                        boxInfo.x = Math.random() * (UserInfo.screenW - BoxWdith);
                        boxInfo.y = Math.random() * (BoxSuperHeight - BoxHeight);
                        boxInfo.cultivate_id = box.cultivate_id;
                        boxInfo.fruit_id = box.fruit_id;
                        boxInfo.output_type = box.output_type;
                        boxInfo.output = box.output;
                        boxInfo.starttime = box.starttime;
                        boxInfo.endtime = box.endtime;
                        boxBufferArray.push(boxInfo);

                    }

                    this.setState({
                        boxArray: boxBufferArray,
                        isRefreshing: false,
                    });

                    //启动动画
                    for (let i = 0; i < this.state.boxArray.length; i++) {
                        let box = this.state.boxArray[i];
                        //开始时间作为唯一的key做校验
                        this.moveBoxAnimated(i,1,true,box.startAnimatedTime);
                    }
                }
                else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    this.setState({
                        isRefreshing: false,
                    });
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                this.setState({
                    isRefreshing: false,
                });
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            });
    }
    //获取公告信息
    getAnnouncement() {

        let body = {};
        let requestBody = getRequestBody(body);

        BTFetch("/app/getAnnouncement", requestBody)
            .then(res => {
                if (res.code === '0') {
                    let arr = [];

                    if (res.data.length >= 1) {
                        for (let i of res.data) {
                            arr.push(i.content)
                        }
                    }
                    this.setState({
                        getAnnouncement: arr
                    })
                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    Toast.info(res.msg,Config.ToestTime,null,false);
                }
            })
            .catch(res => {
            });
    }

    //跳转到身份画像页面
    navigateToPortrayal(mobile) {
        //TODO
        this.props.navigation.navigate('Portrayal', {mobile});
    }
    //公告轮播
    showHeadBar(index)
    {
        Animated.timing(                            // 随时间变化而执行的动画类型
            this.state.fadeAnim,                      // 动画中的变量值
            {
                toValue: index,                             // 透明度最终变为1，即完全不透明
                // Easing: Easing.linear,
                duration: 1000,
            }
        ).start(() => {                          //每一个动画结束后的回调
            if(index === 1) {
                this.state.fadeAnim.setValue(1);
                this.showHeadBar(0);  //循环动画
            }else{
                this.state.fadeAnim.setValue(0);
                this.showHeadBar(1);  //循环动画
            }
        })
    }
    //宝箱动画递归循环
    moveBoxAnimated(boxIndex,animatedIndex,isFirst,startAnimatedTime)
    {

        let boxInfo = this.state.boxArray[boxIndex];
        // devlog('boxIndex:',boxIndex,'animatedIndex:',animatedIndex,'isFirst:',isFirst,'boxInfo:',boxInfo);

        if (this.state.boxArray.length ===0 || boxInfo === null || boxInfo === undefined || boxInfo.moveAnim === null || boxInfo.selected || boxInfo.startAnimatedTime !== startAnimatedTime)
            return;

        Animated.sequence([

            Animated.delay(isFirst ? boxInfo.startAnimatedTime:0),
            Animated.timing(
                boxInfo.opacityAnim,
                {
                    toValue: 1,
                    duration: isFirst ? 1000:0,
                }
            ),
            Animated.timing(
                boxInfo.moveAnim,
                {
                    toValue: animatedIndex,
                    duration: 2000,
                }
            )
        ]).start(() => {
            let boxInfo2 = this.state.boxArray[boxIndex];

            // devlog('++++1+++', this.state.boxArray);
            // devlog('+++2+++', boxInfo.moveAnim);

            if (this.state.boxArray.length ===0 || boxInfo2 === null || boxInfo2 === undefined || boxInfo2.moveAnim === null || boxInfo2.selected || boxInfo2.startAnimatedTime !== startAnimatedTime)
                return;
            // devlog('+++3++++');

            if(animatedIndex === 1) {
                boxInfo2.moveAnim.setValue(1);
                this.moveBoxAnimated(boxIndex,0,false,startAnimatedTime);
            }else{
                boxInfo2.moveAnim.setValue(0);
                this.moveBoxAnimated(boxIndex,1,false,startAnimatedTime);
            }
        })

    }
    //宝箱点击事件
    onClickBox(index) {

        let boxInfo = this.state.boxArray[index];

        if (this.state.boxArray.length ===0 || boxInfo === null || boxInfo === undefined || boxInfo.moveAnim === null || boxInfo.selected)
            return;

        boxInfo.selected = true;

        Animated.parallel([
            Animated.timing(
                boxInfo.opacityAnim,
                {
                    toValue: 0,
                    duration: 300,
                }
            ),
            Animated.timing(
                boxInfo.scaleAnim,
                {
                    toValue: 0.01,
                    duration: 300,
                }
            )
        ]).start(() => {
            // if (boxInfo === null || boxInfo === undefined){
            //     boxInfo.moveAnim.removeAllListeners();
            //     boxInfo.scaleAnim.removeAllListeners();
            //     boxInfo.opacityAnim.removeAllListeners();
            //     boxInfo.moveAnim = null;
            //     boxInfo.scaleAnim = null;
            //     boxInfo.opacityAnim = null;
            // }
            this.state.boxArray.splice(index,1,null);
        });

        // 播放声音
        const demoAudio = require('../BTImage/Sounds/box.mp3');
        const s = new Sound(demoAudio, (e) => {
            if (e) {
                return;
            }
            s.play(() => s.release());
        });

        // 发起请求
        let body = {
            token:UserInfo.token,
            fruit_id:boxInfo.fruit_id,
            cultivate_id:boxInfo.cultivate_id,
        };
        let requestBody = getRequestBody(body);

        BTFetch("/cultivate/cultivatePick", requestBody)
            .then(res => {
                if (res.code === '0') {

                    this.getMember();
                    this.getDto();

                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    Toast.info(res.msg,Config.ToestTime,null,false);
                }
            })
            .catch(res => {
            });
    }
    //按钮点击事件
    onClickButton(value) {

        if(value.key === 'Invitation'){
            this.invite();
        }else{
            this.props.navigation.navigate(value.key);
        }
    }
    // 每日签到状态
    memberSignStatus() {
        let body = {}
        let requestBody = getRequestBody(body)
        BTFetch('/member/memberSignStatus', requestBody)
            .then(res => {
                const { code, data } = res
                if (code === '0') {
                    this.setState({
                        isSign: !data // 是否签到
                    })
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                } else {
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
            })
    }
    // 每日签到
    signIn() {

        if(this.state.isSign){
            Toast.info(I18n.t('task.task_signIn_finish'),Config.ToestTime,null,false)
            return
        }
        let body = {}
        let requestBody = getRequestBody(body)
        BTFetch('/member/memberSign', requestBody)
            .then(res => {
                devlog('---/member/memberSign--------',res);
                const { code, msg, data } = res
                if (code === '0') {
                    // Toast.info(msg, Config.ToestTime, null, false)
                    this.getDto();    //获取资产
                    this.setState({
                        isSign: true,
                    })
                    //add by zzl 增加动画
                    this.setState({
                        signArray:data,
                        // signArray:['dsfdfsdfs','123123123123123123123123123123123123123123123123123123123123','dsfdfsdfs','123123123123123123123123123123123123123123123123123123123123'],
                        signAnimHidden: false
                    })

                    Animated.sequence([
                        Animated.timing(
                            this.state.signAnim,
                            {
                                toValue: 1,
                                duration: 500,
                            }
                        ),
                        Animated.timing(
                            this.state.signAnim2,
                            {
                                toValue: 0,
                                duration: 3000,
                            }
                        ),
                    ]).start(() => {
                        this.setState({
                            signAnimHidden: true
                        });
                    });

                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                } else {
                    Toast.info(msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
            })
    }
    // 判断是否大于24小时，方能邀请
    invite() {
        let body = {}
        let requestBody = getRequestBody(body)
        BTFetch('/recommend/getRecommendSn', requestBody)
            .then(res => {
                const { code, msg, data } = res
                devlog('getRecommendSn => ', res)
                if (code === '0') {
                    this.props.navigation.navigate('Invite', {
                        data
                    })
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                } else {
                    Toast.info(msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            })
    }

    componentWillUnmount() {
        this.eventHandle.remove();
    }

    _onRefresh() {
        this.initData();
    }

    render() {
          // devlog('--this.state.buttonArray---------',this.state.buttonArray);

        return (
            <View style={styles.container}>

                <Image source={{
                    uri: this.state.adBg,
                    cache: 'force-cache'}}
                       style={{width:UserInfo.screenW,height:UserInfo.screenW * 2.5,left:0,top:0,position:'absolute',resizeMode: Image.resizeMode.contain,}}>
                </Image>

                    {/*公告模块*/}
                    <View style={styles.notice}>
                        <Text style={styles.notice_text}>{I18n.t('base.base_notice')} : </Text>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            {this.state.getAnnouncement.length <= 1 ? (
                                <Text style={styles.notice_text}>
                                    {this.state.getAnnouncement}
                                </Text>
                            ) : (
                                <ScrollVertical
                                    onChange={index => {
                                        this.index = index
                                    }}
                                    enableAnimation={true}
                                    data={this.state.getAnnouncement}
                                    delay={2000}
                                    duration={0}
                                    scrollHeight={25}
                                    scrollStyle={{ alignItems: 'flex-start' }}
                                    textStyle={{ color: '#E7F2FF', fontSize: 12 }}
                                />
                            )}
                        </View>
                    </View>

                    {/*资产瓦力值模块*/}
                    <View style={{flexDirection: 'row', backgroundColor: '#0F0F000',justifyContent: 'space-between',alignItems: 'center'}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={()=>{this.props.navigation.navigate('RadarChart')}}>
                            <Text style={{color: '#fff', height: 40,fontWeight: 'bold' ,lineHeight:40, marginLeft:12,marginTop:20,fontSize: 34,backgroundColor: '#FF000000',}}>{this.state.sunline}</Text>
                            <Text style={{color: '#fff',height:15,lineHeight:15, fontWeight: 'bold' ,fontSize: 13,marginLeft:12,marginTop:0,backgroundColor: '#00FF0000',}}>瓦力</Text>
                        </TouchableOpacity>
                    </View>

                    {/*宝箱模块*/}
                    <View style={{backgroundColor: '#0000FF00',flex:1}}>
                        {this.state.boxArray.map((value, index) => {
                            // devlog('=====',index,'=====',value);
                            if(value === null){
                                return null;
                            }
                            return (
                                <Animated.View
                                    style={{
                                        marginTop:value.y,
                                        marginLeft:value.x,
                                        position:'absolute',
                                        width: BoxWdith,
                                        height: BoxHeight,
                                        opacity: value.opacityAnim,
                                        transform: [
                                            {
                                                translateY: value.moveAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, 20] //线性插值，0对应60，0.6对应30，1对应0
                                                }),
                                            },
                                            {
                                                scale:value.scaleAnim
                                            },
                                        ],
                                    }}
                                >
                                    <TouchableOpacity activeOpacity={1} style={{justifyContent: 'center', alignItems: 'center',flex:1}} onPress={() => this.onClickBox(index)}>
                                        <Image style = {{width:BoxWdith,height: BoxHeight - 15}} source = {{uri: this.state.adBox}}/>
                                        <Text style = {{width:BoxWdith,height: 15, fontSize: 10, color: '#D1D5DD', textAlign: 'center'}}>{value.output}</Text>
                                    </TouchableOpacity>
                                </Animated.View>

                            )
                        })}
                    </View>

                    {/*按钮模块*/}
                    <View style={{
                        width:UserInfo.screenW,
                        height:buttonW * 2 + buttonSpaceH * 2 + 60,
                        backgroundColor: '#00ff0000',}}>

                        <Image style= {{resizeMode: Image.resizeMode.stretch , position:'absolute' ,width:UserInfo.screenW, height:buttonW * 2 + buttonSpaceH * 2 + 60,}} source={require('../BTImage/Base/button_background.png')}/>

                        {/*滚动按钮模块*/}
                        {/*0-6*/}
                        {
                            this.state.buttonArray.length  > 0 ?
                                <View style={{ backgroundColor: '#FF000000', marginTop:60 - buttonSpaceH,height:buttonW * 2 + buttonSpaceH * 3}}>
                                    {this.state.buttonArray.map((value, i) => {
                                        if (i < 6){
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => this.onClickButton(value)}
                                                    style={{
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        left:buttonSpaceW + (buttonSpaceW + buttonW) * (i % 3),
                                                        top:buttonSpaceH + (buttonSpaceH + buttonW) * parseInt(i / 3),
                                                        height:buttonW,
                                                        width:buttonW,
                                                        borderRadius: 15,
                                                        borderWidth:1,
                                                        borderColor: '#DEDEDE',
                                                        position:'absolute',}}>
                                                    <Text style = {{marginTop:5, backgroundColor: '#ff000000',height:28,width:buttonW,lineHeight:28,fontSize: 13, fontWeight: 'bold',color: '#212833', textAlign: 'center'}}>{value.name}</Text>
                                                    <Image style = {{resizeMode: Image.resizeMode.contain,height:33, width:33,}} source = {{uri: getRequestURL() + value.img}}/>
                                                    <Text style = {{backgroundColor: '#00ff0000',height:28,width:buttonW,lineHeight:28,fontSize: 11, color: '#212833', textAlign: 'center'}}>{value.profile}</Text>
                                                </TouchableOpacity>
                                            )
                                        }
                                    })}
                                </View>
                                :
                                null
                        }
                        {/*{*/}
                            {/*this.state.buttonArray.length  > 0 ?*/}
                                {/*<Swiper style={{ backgroundColor: '#FF000000', marginTop:60 - buttonSpaceH,height:buttonW * 2 + buttonSpaceH * 3}}*/}
                                        {/*showsButtons={false}*/}
                                        {/*loop={true}*/}
                                        {/*showsPagination={true}*/}
                                        {/*autoplay={false}*/}
                                        {/*autoplayTimeout={4}*/}
                                        {/*paginationStyle={{bottom: 3}}*/}
                                        {/*dotStyle={{backgroundColor: '#9B9B9B', width: 3, height: 3, borderRadius: 4,}}*/}
                                        {/*activeDotStyle={{backgroundColor: '#000000', width: 3, height: 3, borderRadius: 4,}}*/}
                                {/*>*/}
                                    {/*7-12*/}
                                    {/*{*/}
                                        {/*this.state.buttonArray.length > 6 ?*/}
                                            {/*<View>*/}
                                                {/*{this.state.buttonArray.map((value, i) => {*/}
                                                    {/*if (6 < i && i < 12){*/}
                                                        {/*// devlog('---i--------',i);*/}
                                                        {/*let xy = i - 6;*/}
                                                        {/*return (*/}
                                                            {/*<TouchableOpacity*/}
                                                                {/*activeOpacity={0.8}*/}
                                                                {/*onPress={() => this.onClickButton(value)}*/}
                                                                {/*style={{*/}
                                                                    {/*justifyContent: 'space-between',*/}
                                                                    {/*alignItems: 'center',*/}
                                                                    {/*left:buttonSpaceW + (buttonSpaceW + buttonW) * (xy % 3),*/}
                                                                    {/*top:buttonSpaceH + (buttonSpaceH + buttonW) * parseInt(xy / 3),*/}
                                                                    {/*height:buttonW,*/}
                                                                    {/*width:buttonW,*/}
                                                                    {/*borderRadius: 15,*/}
                                                                    {/*borderWidth:1,*/}
                                                                    {/*borderColor: '#DEDEDE',*/}
                                                                    {/*position:'absolute',}}>*/}
                                                                {/*<Text style = {{marginTop:5, backgroundColor: '#ff000000',height:28,width:buttonW,lineHeight:28,fontSize: 13, fontWeight: 'bold',color: '#212833', textAlign: 'center'}}>{value.name}</Text>*/}
                                                                {/*<Image style = {{resizeMode: Image.resizeMode.contain,height:33, width:33,}} source = {{uri: getRequestURL() + value.img}}/>*/}
                                                                {/*<Text style = {{backgroundColor: '#00ff0000',height:28,width:buttonW,lineHeight:28,fontSize: 11, color: '#212833', textAlign: 'center'}}>{value.profile}</Text>*/}
                                                            {/*</TouchableOpacity>*/}
                                                        {/*)*/}
                                                    {/*}*/}
                                                {/*})}*/}
                                            {/*</View>*/}
                                            {/*:*/}
                                            {/*null*/}
                                    {/*}*/}

                                {/*</Swiper>*/}
                                {/*:*/}
                                {/*null*/}
                        {/*}*/}

                        {/*签到模块*/}
                        <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#FF000000',justifyContent:'center',alignItems: 'center',right:12,top: - 34, position:'absolute'}} onPress={() => this.signIn()}>
                            {
                                this.state.isSign ?
                                    <Image style={{width: 66, height: 68}} source={require('../BTImage/Base/sigin_button.png')}/>
                                    :
                                    <Image style={{width: 66, height: 68}} source={require('../BTImage/Base/sigin_button_s.png')}/>
                            }
                        </TouchableOpacity>

                    </View>

                {/*签到动画*/}
                {
                    this.state.signAnimHidden ?
                        <View></View>
                        :
                        <Animated.View
                            style={{
                                justifyContent:'center',alignItems: 'center',width: UserInfo.screenW, height: UserInfo.screenH,
                                position:'absolute',
                                opacity: this.state.signAnim2,
                                transform: [
                                    {
                                        translateY: this.state.signAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -30] //线性插值，0对应60，0.6对应30，1对应0
                                        }),
                                    },
                                ],
                            }}
                        >

                            {this.state.signArray.map((value, index) => {
                                if(value === null){
                                    return null;
                                }
                                return (
                                    <Text style = {{backgroundColor: '#FF000000',width: 320, height: 20,lineHeight:20, fontSize: 14, color: '#EFF0F3', textAlign: 'center'}}>{value}</Text>
                                )
                            })}

                        </Animated.View>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },

    //公告
    notice: {
        height: 25,
        backgroundColor: '#FF000000',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
        marginTop:20,
        width: UserInfo.screenW,
    },
    notice_text: {
        color: '#E7F2FF',
        textAlign: 'center',
        fontSize: 12
    },
    //商城任务邀请模块
    tasks: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
    },
    task_image: {
        width:42,
        height: 42,
        resizeMode: Image.resizeMode.contain
    },
    task_txt: {
        height:17,
        lineHeight:17,
        fontSize: 12,
        color: '#EFF0F3',
        textAlign: 'center'
    },

});
