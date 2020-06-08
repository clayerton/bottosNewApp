import React, {Component} from 'react';
import { Text, StyleSheet, Image, WebView, View, TouchableOpacity, Platform, BackHandler, StatusBar, share } from "react-native";
import NavStyle from "../Style/NavStyle";
import { devlog,getRequestBody,getImageURL } from '../FunctionTool';
import BTFetch from "../../Tool/NetWork/BTFetch";
import UserInfo from "../../Tool/UserInfo";
import ShareUtil from "../../Tool/UM/ShareUtil";
import config from '../../Tool/Config'
import Modal from 'react-native-modalbox'
import { Toast, ActivityIndicator } from 'antd-mobile-rn'
import BTWaitView from "../../Tool/View/BTWaitView.config";
import Config from "../Config";
 //获取ios设备是否安装微信
 let isInstallShareAPP = true;
 if (Platform.OS === 'ios') {
  ShareUtil.isInstallShareAPP(2,(code) => {
      if (code === '0'){
        isInstallShareAPP = false;
      }
  });
}
export default class BTPublicWebView extends Component {

    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        function onPress() {
            if (state.params.goBackPage) {
                state.params.goBackPage()
            } else {
                navigation.goBack()
            }
        }
        function onShare(){
            state.params.onClickShare()
        }
        return {
            headerLeft: (
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={NavStyle.leftButton}>
                        <Image style={NavStyle.navBackImage} source={require('../../BTImage/navigation_back.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} style={NavStyle.rightButton} onPress = {()=>{navigation.goBack()}}>
                    <   Image style={style.closeButton} source={require('../../BTImage/webview_close.png')}/>
                    </TouchableOpacity>
                </View>
            ),
            headerTitle: <Text style={NavStyle.navTitle}>{state.params.navTitle}</Text>,
            headerRight: (
                isInstallShareAPP ?
                <TouchableOpacity activeOpacity={0.5} style={NavStyle.rightButton} onPress = {onShare}>
                    <Image style={[style.closeButton,{width:22,height:22,}]} source={require('../../BTImage/navigation_share.png')}/>
                </TouchableOpacity>
                :null
            ),
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground,
        };
    };

    constructor(props){
        super(props);
        this.state = {
            backButtonEnabled: false,
            time:0,
            isInstallShareAPP:true,
        }
        
        props.navigation.setParams({
            goBackPage: this.handleBackClick,
            onClickShare:this.onClickShare,
        });
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackClick);
        }
    }

    componentWillUnmount(){
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackClick);
        }
        clearInterval(this.interval);
        
        this.props.navigation.state.params.options && this.count_playtime(this.state.time)

    }
    // 游戏计时接口
    count_playtime(game_time) {
        let body = {
            token:UserInfo.token,
            game_id:this.props.navigation.state.params.game_link_id,
            game_time
        };
        let requestBody = getRequestBody(body);
        BTFetch('/game/count_playtime',requestBody)
            .then(res=>{
                this.props.navigation.state.params.options.callback(this.state.time)
            }).catch(res => {
            BTWaitView.hide();
            Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
        });
    } 

    componentDidMount() {
        // console.log({params: this.props.navigation.state.params})
        // this.refs.modal.open()
        //游戏计时
        this.interval = setInterval(() => {
            this.setState(prevState => ({
                time:prevState.time + 1,
            }))
        },1000)
        if (Platform.OS === 'ios') {
            ShareUtil.isInstallShareAPP(2,(code) => {
                if (code === '0'){
                    this.setState({
                        isInstallShareAPP: false

                    })
                }
            });
        }
    }

    onNavigationStateChange = navState => {
        this.setState({
            backButtonEnabled: navState.canGoBack
        });
    };

    onClickShare= ()=>{
       if(this.state.isInstallShareAPP) 
            this.refs.modal.open()
    }

    handleBackClick = () => {
        // devlog(this);
        if (this.state.backButtonEnabled) {
            this.refs['webView'].goBack();
            return true;
        } else {
            this.props.navigation.goBack();
            return true;
        }
    };
      //---------------------------------------分享函数起始位置-----------------------------------------
  onClickButtonShare(index){
    this.refs.modal.close()
    if (index === 100){//举报
    //   this.onActionPress(1,item.member_id)
    } else if (index === 101){//黑名单
    //   this.onActionPress(0,item.member_id)
    } else if (index === 102){//删除

    } else if(index === 103){ //生成图片
    //   this.props.navigation.navigate('GeneratePicture',item)
    }else{
        let image = this.props.navigation.state.params.icon ? getImageURL(this.props.navigation.state.params.icon) : '';
        
        ShareUtil.share('一边游戏一边挖矿，玩赚两不误！',image,this.props.navigation.state.params.url,`推荐你玩“${this.props.navigation.state.params.navTitle}”`,index,(code,message) =>{
            if(code ==0){
                Toast.info('分享成功', config.ToestTime, null, false)
            }else{
                Toast.info(message, config.ToestTime, null, false)
            }
            
           devlog(code,message,'微信信息')
          
            devlog('--分享结果-------',code,'---------',message);
        });
   
    }
}
//---------------------------------------分享函数终止位置-----------------------------------------
onClickCloseShare(){
    this.refs.modal.close()

}
    render(){
        return <View style={{flex:1}}>
            <StatusBar />
            <WebView
                style={{flex:1,}}
                source={{uri: this.props.navigation.state.params.url}}
                ref="webView"
                onNavigationStateChange={this.onNavigationStateChange}
            />

             {/*---------------------------------------分享UI起始位置-----------------------------------------*/}
                <Modal
                        style={{flexDirection: 'column', height: 280 -110, backgroundColor: '#FFFF0000',}}
                        position={'bottom'}//model视图的位置,top、center、bottom
                        entry={'bottom'}//动画的起始位置top、bottom
                        ref="modal"
                        coverScreen={true}//当true时,modal后面的背景是这个window。比如有navitor时,导航条也会遮住
                        backdropPressToClose={true}//点击背景是否关modal视图,当backdrop未false的情况下失效
                        backButtonClose={true}//仅安卓,当为true时安卓手机按返回键时modal视图close
                        openAnimationDuration={0}
                        swipeToClose={false}//是否滑动关闭
                    >
                        <View style={{ flexDirection: 'column', marginLeft:8,marginRight:8, backgroundColor: '#FFFFFF',height: 220 - 110,borderRadius:8}}>
                            <View style={{ flexDirection: 'row',backgroundColor: '#FFFF0000',height: 90}}>
                                <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickButtonShare(3)}>
                                    <Image style = {{width:50, height: 50, marginTop:20}} source={require('../../BTImage/PublicComponent/umeng_socialize_wxcircle.png')}/>
                                    <Text style = {{width:90, height: 20, lineHeight:20, fontSize: 10, color: '#000000', textAlign: 'center'}}>朋友圈</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickButtonShare(2)}>
                                    <Image style = {{width:50, height: 50, marginTop:20}} source={require('../../BTImage/PublicComponent/umeng_socialize_wechat.png')}/>
                                    <Text style = {{width:90, height: 20, lineHeight:20, fontSize: 10, color: '#000000', textAlign: 'center'}}>微信</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={{ flexDirection: 'column',margin:8, backgroundColor: '#FFFFFF',flex:1,borderRadius:8}}>
                            <TouchableOpacity activeOpacity={0.5} style={{justifyContent: 'center', alignItems: 'center',flex:1}} onPress={() => this.onClickCloseShare()}>
                                <Text style = {{width:100,lineHeight:30, fontSize: 15,  backgroundColor: '#0F0FFF00',color: '#000000', textAlign: 'center'}}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    {/*---------------------------------------分享UI终止位置-----------------------------------------*/}

        </View>

    }
}
const style = StyleSheet.create({

    closeButton: {
        width: 18,
        height: 18
    },
});
