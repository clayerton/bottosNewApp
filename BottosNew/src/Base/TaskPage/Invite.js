import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
    ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
    CameraRoll,
    ScrollView,
    Platform,

} from 'react-native'
import { Toast } from 'antd-mobile-rn'
import { getRequestBody, devlog } from '../../Tool/FunctionTool'
import BTFetch from '../../Tool/NetWork/BTFetch'
import Config from '../../Tool/Config'
import BTWaitView from '../../Tool/View/BTWaitView.config'
import I18n from '../../Tool/Language'
import NavStyle from '../../Tool/Style/NavStyle'
import UserInfo from "../../Tool/UserInfo";
import LongButton from '../../Tool/View/BTButton/LongButton'
var ReactNative = require('react-native'); //保存图片调用
import  ViewShot from "react-native-view-shot";  //android截屏第三方组件
import InviteItem from './InviteItem'

export default class Invite extends Component {
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
      headerRight: (<TouchableOpacity
        activeOpacity={0.5}
        onPress={() =>state.params.commitPage()}
        style={NavStyle.leftButton}>
        <Image
          style={NavStyle.navBackImage}
          source={require('../../BTImage/navigation_share.png')}
        />
      </TouchableOpacity>),
      headerTitle: (
        <Text style={NavStyle.navTitle}>
          {I18n.t('invite.Invite_navigation')}
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
        data: '',
        recommend_use_amount: '',
        use_count: '' ,
        uri:'null',
    }
    props.navigation.setParams({
      commitPage: this.commitPage
  })
   
  }
  componentDidMount() {
    const { data } = this.props.navigation.state.params
    this.setState({
      data
    })
    this.getRecommendSnValidity(data)
  }
  //  分享页面
  commitPage=()=>{
    // 判断是从邀请界面传到分享页面。
    const { data, recommend_use_amount, use_count } = this.state
    let invite = {
      data,
      recommend_use_amount,
      use_count,
      inviteStatus:true,
    }
    this.props.navigation.navigate('GeneratePicture',invite)
  }
  // 邀请码次数
  getRecommendSnValidity(inviteCode) {
    let body = { recommend_sn: inviteCode }
    let requestBody = getRequestBody(body)
    BTWaitView.show(I18n.t('tip.wait_text'))
    BTFetch('/recommend/getRecommendSnValidity', requestBody)
      .then(res => {
        const { code, msg, data } = res
        if (code === '0') {
          BTWaitView.hide()
          const { use_count, recommend_use_amount } = data
          this.setState({
            use_count:recommend_use_amount - use_count,
            recommend_use_amount
          })
        } else if (code === '99') {
          Toast.info(msg, Config.ToestTime, null, false)
          this.props.navigation.navigate('Login')
          BTWaitView.hide()
        } else {
          Toast.info(msg, Config.ToestTime, null, false)
          BTWaitView.hide()
        }
      })
      .catch(res => {
          BTWaitView.hide();
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
      })
  }

  copy(value) {
    Clipboard.setString(value)
    try {
      Clipboard.getString()
      Toast.info(I18n.t('tip.copy_success'), Config.ToestTime, null, false)
    } catch (e) {}
  }

  //点击保存按钮保存图片
    onClickSaveImg(){
        if(Platform.OS === 'ios'){
            ReactNative.takeSnapshot(this.refs.location, {format: 'png', quality: 1}).then(
                (uri) => {this.setState({uri:uri})
                    let promise = CameraRoll.saveToCameraRoll(uri);
                    promise.then(function(result) {
                        Toast.info(I18n.t('invite.Invite_save_success'),Config.ToestTime,null,false)
                    }).catch(function(uri) {
                        Toast.fail(I18n.t('invite.Invite_save_fail'),Config.ToestTime,null,false);
                    });
                }
            ).catch(
                (error) => alert(error)
            );
        }else{
            this.refs.viewShot.capture().then(uri => {
                let promise = CameraRoll.saveToCameraRoll(uri);
                promise.then(function(result) {
                    Toast.info(I18n.t('invite.Invite_save_success'),Config.ToestTime,null,false)
                }).catch(function(error) {
                    Toast.info(I18n.t('invite.Invite_setting'),Config.ToestTime,null,false);
                });
            }).catch(function(error) {
                Toast.fail(I18n.t('invite.Invite_save_fail'),Config.ToestTime,null,false);
            });
        }



    }

  render() {
    const { data, recommend_use_amount, use_count } = this.state
    return (
      <ScrollView alwaysBounceHorizontal={false} style={[NavStyle.container,{backgroundColor:'#0B0918'}]}  ref="full">
         
          
          <ViewShot ref="viewShot" options={{  quality: 1 }}>
          <ImageBackground  ref='location' style={styles.mainBackground} source={require('../../BTImage/Base/Task/task_invite_bg.png')}>
              <InviteItem data={data} onClickSaveImg={()=>this.onClickSaveImg()}  recommendUseAmount={recommend_use_amount} useCount={use_count} />
          </ImageBackground>
          </ViewShot>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    mainBackground: {
        alignItems:'center',
        justifyContent:'center',
        width: '100%',
        height: '100%',
        //不加这句，就是按照屏幕高度自适应
        //加上这几，就是按照屏幕自适应
        //resizeMode:Image.resizeMode.contain,
        //祛除内部元素的白色背景
        backgroundColor:'rgba(0,0,0,0)',
        resizeMode:'contain'
    },
  })