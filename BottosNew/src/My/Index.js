import React, { Component } from 'react'
import {
  DeviceEventEmitter,
  Text,
  View,
  ScrollView,
  FlatList,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'

import Config from '../Tool/Config'
import BTFetch from '../Tool/NetWork/BTFetch'
import { requestWithFile } from '../Tool/NetWork/heightOrderFetch'

import { Toast } from 'antd-mobile-rn'
import { getRequestBody, setLocalStorage, devlog } from '../Tool/FunctionTool'
import UserInfo from '../Tool/UserInfo'

import I18n from '../Tool/Language'
import BTWaitView from '../Tool/View/BTWaitView.config'
// 公共样式
import FontStyle from '../Tool/Style/FontStyle'
import NavStyle from '../Tool/Style/NavStyle'

// 组件
import NavigationRight from './Item/NavigationRight'
import NavigationLeft from './Item/NavigationLeft'
import PortrayalAvatarInfo from './Item/PortrayalAvatarInfo'
import Medal from './Item/Medal'
import MessageAndFollow from './Item/MessageAndFollow'
import BaseStrategy from './Item/BaseStrategy'
import Portrayal from './Item/Portrayal'

class Index extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    const { setting } = state

    return {
      headerLeft: (
      <NavigationRight
          navigation={navigation}
          onPress={value => {
            value === 'message' && navigation.navigate('MessageList') // 跳转消息列表
            // value === 'Settings' && setting()
            // value === 'Settings' && navigation.navigate('Settings')
          }}
        />
      ),
      headerRight: (
        <NavigationLeft
          navigation={navigation}
          onPress={value => {
            // value === 'gameInfo'&& navigation.navigate('BTPublicWebView',{url:'http://url.lnk1.cn/url/23873372',navTitle:'瓦力攻略'})
            // value === 'message' && navigation.navigate('MessageList') // 跳转消息列表
            value === 'Settings' && setting()
            // value === 'Settings' && navigation.navigate('Settings')
          }}
        />
      ),

      headerTitle: null,
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  setting() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/member/payPasswordStatus', requestBody)
      .then(res => {
        if (res.code === '0') {
          this.props.navigation.navigate('Settings', res.data)
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      isEditableMemberName: false,
      tag: [], // 勋章
      member_name: '', // 昵称
      editable: false, // 修改昵称状态
      // baseStrategyData: [
      //   {
      //     itemkey: 'VIPLevel',
      //     imageUrl: require('../BTImage/My/my_vip_icon.png'),
      //     title: I18n.t('my.baseStrategyData_VIPLevel')
      //   },
      //   {
      //     itemkey: 'GameStrategy',
      //     imageUrl: require('../BTImage/My/my_ic_game_guide.png'),
      //     title: I18n.t('my.baseStrategyData_GameStrategy')
      //   },
      //   {
      //     itemkey: 'MedalRaider',
      //     imageUrl: require('../BTImage/My/my_ic_night_medal.png'),
      //     title: I18n.t('my.baseStrategyData_MedalRaider')
      //   },
      //   {
      //     itemkey: 'Startrack',
      //     imageUrl: require('../BTImage/My/my_ic_star_trek.png'),
      //     title: I18n.t('my.baseStrategyData_Startrack')
      //   }
      // ], //基地攻略
      isBlack: false, // 是否为黑名单用户
      rank: 0, // 注册排名
      exp: 0, // 个人积分
      follow_me_count: 0, //关注我的用户
      post_count: 0, //我的帖子个数
      follow_count: 0, //我的关注数
      fans_count: 0, //我的粉丝数
      avatar_thumb: ''
    }

    this.props.navigation.state.setting = this.setting.bind(this)
    this.loadData = this.loadData.bind(this)

    props.navigation.addListener('didFocus', e => {
      const action = e.action || {}
      if (action.type == 'Navigation/INIT') return
      this.loadData()
      this.getMemberFollowCount()
    })

    //登录成功通知
    this.eventHandle = DeviceEventEmitter.addListener(
      Config.LoginDeviceEventEmitter,
      this.loginDeviceEventEmitter
    )

    //刷新通知
    this.refreshFansEvent = DeviceEventEmitter.addListener(
      'FANSLIST_POST',
      () => this.getMemberFollowCount()
    )
  }

  getMemberFollowCount() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/member/getMemberFollowCount', requestBody)
      .then(res => {
        const { fans_count, follow_count, post_count } = res.data
        if (res.code === '0') {
          this.setState({
            post_count, //我的帖子个数
            follow_count, //我的关注数
            fans_count //我的粉丝数
          })
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
      })
  }

  componentWillUnmount() {
    this.eventHandle.remove()
  }

  componentDidMount() {
    const { token, mobile } = UserInfo
    token && this.getPersonalPortrait(mobile)
    // token && this.getMemberFollowCount() //帖子 关注  粉丝
  }

  loginDeviceEventEmitter = () => {
    this.loadData()
  }

  loadData() {
    const { mobile, member_name } = UserInfo

    this.setState({
      member_name
    })
    this.getPersonalPortrait(mobile)
  }

  // 用户上传图片列表
  onChangeUploadImage(fileList) {
    const obj = fileList.pop()
    let uri = obj.path
    let index = uri.lastIndexOf('/')
    let name = uri.substring(index + 1, uri.length)
    let file = { uri: uri, type: 'multipart/form-data', name: name }
    let formData = new FormData()
    formData.append('token', UserInfo.token)
    formData.append('headimg', file)
    requestWithFile('/member/updateMemberInfo', formData)
      .then(res => {
        if (res.code === '0') {
          Toast.info(res.msg, Config.ToestTime, null, false)
          //给全局用户信息赋值
          UserInfo.avatar_thumb = res.data.avatar_thumb //头像
          this.setState({
            avatar_thumb: res.data.avatar_thumb
          })
          // //保存token到本地
          setLocalStorage(Config.LoginStorage, {
            avatar_thumb: UserInfo.avatar_thumb
          })
          //发起通知
          DeviceEventEmitter.emit(Config.LoginDeviceEventEmitter)
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
      })
  }

  // 获取用户勋章
  getPersonalPortrait(mobile) {
    let body = {
      mobile
    }
    let requestBody = getRequestBody(body)
    BTFetch('/member/getPersonalPortrait', requestBody)
      .then(res => {
        if (res.code === '0') {
          const { data } = res
          const { rank, isBlack, tag, exp, follow_me_count } = data
          this.setState({
            data,
            rank: rank,
            follow_me_count,
            tag: this.tagFormatter(tag),
            isBlack: !!isBlack,
            exp
          })
          // //发起通知
          // DeviceEventEmitter.emit(Config.LoginDeviceEventEmitter)
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
      })
  }

  // 修改昵称
  onPressRename(value) {
    if (value === UserInfo.member_name) {
      Toast.info(I18n.t('my.nickname_same'), Config.ToestTime, null, false)
      return
    }
    if (value.length > 10) {
      Toast.info(I18n.t('my.nickname_count'), Config.ToestTime, null, false)
      return
    }
    let formData = new FormData()
    formData.append('token', UserInfo.token)
    formData.append('member_name', value)
    BTWaitView.show(I18n.t('tip.wait_text'))
    requestWithFile('/member/updateMemberInfo', formData)
      .then(res => {
        BTWaitView.hide()
        if (res.code === '0') {
          Toast.info(res.msg, Config.ToestTime, null, false)
          //给全局用户信息赋值
          UserInfo.member_name = res.data.member_name
          //保存token到本地
          setLocalStorage(Config.LoginStorage, {
            member_name: UserInfo.member_name
          })
          //发起通知
          DeviceEventEmitter.emit(Config.LoginDeviceEventEmitter)
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
        BTWaitView.hide()
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
      })
  }

  render() {
    const { mobile } = UserInfo
    const {
      tag,
      baseStrategyData,
      data,
      exp,
      follow_me_count,
      fans_count,
      follow_count,
      post_count,
      // avatar_thumb
    } = this.state

    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#fff'
        }}>
        {/*  瓦力攻略 */}
        <TouchableOpacity
                  onPress={()=>{
                    this.props.navigation.navigate('BTPublicWebView',{url:'http://url.lnk1.cn/url/23873372',navTitle:'瓦力攻略'})
                  }}
                  activeOpacity={0.5}
                  style={{
                    marginTop:7,
                    marginRight:-15,
                    width:88,
                    height:20,
                    backgroundColor:'#F15B40',
                    alignItems:'center',
                    borderRadius:10,
                    justifyContent:'center',
                    alignSelf:'flex-end'
                  }}>
                  <View style={{
                      flexDirection:'row',
                      alignItems:'center',
                      width:88,
                  }}>
                      <Image 
                      style={{width:16,height:16,margin:3,}}
                      source={require('../BTImage/My/my_ic_help.png')}
                    />
                    <Text
                      style={{
                        fontSize:12,
                        color:'#fff',
                      }}
                    >瓦力攻略</Text>
                  </View>
                
            </TouchableOpacity>

        <View style={{ paddingLeft: 24, paddingRight: 24, position:'relative' }}>
          
          {/* 头像 排名  */}
          <PortrayalAvatarInfo
            isMy={true}
            data={UserInfo}
            avatarThumb={this.state.avatar_thumb}
            onChange={value => {
              this.onChangeUploadImage(value)
            }}
            onPressRename={value => {
              this.onPressRename(value)
            }}
          />

          {/* 我的帖子&我的关注&我的粉丝 */}
          <MessageAndFollow
            fansCount={fans_count}
            followCount={follow_count}
            postCount={post_count}
            onPress={value => {
              this.props.navigation.navigate(value, { mobile: mobile })
            }}
          />
          {/* 勋章 */}
          <View style={{ paddingBottom: 32 }}>
            <FlatList
              keyExtractor={item => item.key}
              horizontal={true}
              data={tag}
              renderItem={({ item }) => <Medal {...item.data} />}
            />
          </View>
        </View>
        {/* 基地攻略 */}
        {/* <View
          style={{
            backgroundColor: '#F7F8FA',
            paddingTop: 16,
            paddingBottom: 32,
            paddingLeft: 24,
            paddingRight: 24
          }}>
          <Text style={[FontStyle.fontNormal, { marginBottom: 16 }]}>
            {I18n.t('my.strategy')}
          </Text>
          <FlatList
            horizontal={true}
            keyExtractor={item => item.itemkey}
            data={baseStrategyData}
            renderItem={({ item }) => (
              <BaseStrategy
                {...item}
                onPress={value => {
                  this.props.navigation.navigate(value)
                }}
              />
            )}
          />
        </View> */}
        {/* 身份画像 */}
        <Portrayal {...data} />
      </ScrollView>
    )
  }

  /**
   * 重新格式化勋章数据
   * @param {*} tag  勋章数组
   */
  tagFormatter(tag) {
    const tagArr = []
    for (const key in tag) {
      let element = tag[key].shift()
      while (element) {
        const temp = {}
        temp['key'] = key
        temp['data'] = element
        tagArr.push(temp)
        element = tag[key].shift()
      }
    }
    return this.tagArrFun(tagArr)
  }
  tagArrFun(tagArr) {
    const tagArrtemp = []
    tagArr &&
      tagArr.map(item => {
        if (!!item['data']['tags_icon']) {
          tagArrtemp.push(item)
        }
      })
    return tagArrtemp
  }
}

export default Index
