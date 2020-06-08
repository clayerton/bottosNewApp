import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  DeviceEventEmitter,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import { getRequestBody, devlog } from '../Tool/FunctionTool'
import { Toast } from 'antd-mobile-rn'

import BTFetch from '../Tool/NetWork/BTFetch'
import I18n from '../Tool/Language'
import Config from '../Tool/Config'
import NavStyle from '../Tool/Style/NavStyle'
import FontStyle from '../Tool/Style/FontStyle'
import UserInfo from '../Tool/UserInfo'
import {
  REQUEST_DO_CANCEL_FOLLOW,
  REQUEST_DO_ADD_FOLLOW,
  REQUEST_CHECK_IS_FOLLOW
} from '../Redux/Actions/ActionsTypes'

// 组件
import BTWaitView from '../Tool/View/BTWaitView.config'
import PortrayalAvatarInfo from './Item/PortrayalAvatarInfo'
import Portrayal from './Item/Portrayal'
import Medal from './Item/Medal'
import PortrayalViewButton from './Item/PortrayalViewButton'
import PortrayalItemInfo from './Item/PortrayalItemInfo'

import ImageShow from '../Community/ImageShow'
class PortrayalView extends Component {
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
            source={require('../BTImage/navigation_back.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: null,
      headerTitle: null,
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      // mobile: '',
      tag: [],
      buttonTitle: {
        forbidden: I18n.t('portrayalView.forbidden'),
        follow: I18n.t('portrayalView.follow')
      },
      animating: true, // 请求成功关闭Loading...
      isBlack: false, // 是否为黑名单用户
      isAdmin: false, // 是否为管理员
      isMy: false, // 是否为自己
      isFollow: false, //是否关注了当前用户
      post_count: 0, //帖子个数
      follow_count: 0, //关注数
      fans_count: 0, //粉丝数
      mobile: this.props.navigation.state.params, //手机号
      myMobile: UserInfo.mobile, //我的手机号
      visible:false,//查看原图
      index:1,//查看图的index
      avatarUrl:null,
      isAddBlack:false, //设置黑名单
      black_list:false, 
    }
  }

  componentDidMount() {
    const { mobile } = this.props.navigation.state.params
    this.setState({
      mobile,
      isAdmin: !!UserInfo.is_admin
    })
    this.loadData(mobile)
    this.getMemberFollowCount(mobile)
    // this.props.dispatch({
    //   type: REQUEST_PERSONAL_PORTRAIT,
    //   payload: { mobile }
    // })
  }

  loadData(mobile) {
    let body = {
      mobile
    }
    let requestBody = getRequestBody(body)
    BTWaitView.show(I18n.t('tip.wait_text'))
    BTFetch('/member/getPersonalPortrait', requestBody)
      .then(res => {
        BTWaitView.hide()
        if (res.code === '0') {
          const { tag, is_black,black_list } = res.data
          devlog(res,'数据信息')
          this.setState({
            data: res.data,
            tag: this.tagFormatter(tag),
            isBlack: !!is_black,
            isAddBlack:black_list==0 ? false:true,
          })
          this.props.dispatch({
            type: REQUEST_CHECK_IS_FOLLOW,
            payload: { from: res.data.member_id }
          })
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
  //获取帖子 关注 粉丝 数据
  getMemberFollowCount(mobile) {
    let body = { mobile }
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

  // 点击关注按钮
  onClickAddFollow() {
    const { data, mobile, myMobile } = this.state
    if (this.props.isFollow) {
      this.props.dispatch({
        type: REQUEST_DO_CANCEL_FOLLOW,
        payload: { from: data.member_id, mobile, myMobile }
      })
    } else {
      this.props.dispatch({
        type: REQUEST_DO_ADD_FOLLOW,
        payload: { from: data.member_id, mobile, myMobile }
      })
    }
    DeviceEventEmitter.emit('FANSLIST_POST');
  }

  //封号& 解封
  onPressIsBlack() {
    const { isBlack } = this.state
    isBlack && this.doDisableUser(0) //解封
    !isBlack && this.doDisableUser(1) // 封号
  }
  // 点击拉黑 && 解禁
  onPressAddBlack() {
    const {isAddBlack} = this.state;
    isAddBlack && this.isAddBlack(2)  //解封
    !isAddBlack && this.isAddBlack(1)  //拉黑
  }
  //  查看头像
  onPressAvatar1111(avatarUrl){
    this.setState({visible: true, avatarUrl})
  }

  render() {
    const { isFollow, addFollowStatus, cancelFollowStatus } = this.props
    const {
      data,
      tag,
      mobile,
      isAdmin,
      isBlack,
      post_count,
      follow_count,
      fans_count,
      isAddBlack,
      black_list
    } = this.state
    const { member_name, rank, avatar_thumb, member_id } = data
    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        bounces={false}
        style={NavStyle.container}>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {/* 头像 排名  */}
          <PortrayalAvatarInfo
            isMy={false}
            data={data}
            onChange={value => {
              this.onChangeUploadImage(value)
            }}
            onPressRename={value => {
              this.onPressRename(value)
            }}
            onPressAvatar={value => {
              this.onPressAvatar1111(value)
            }}
          />

          <View>
            {/*  帖子    &&   关注  &&   粉丝  */}
            <PortrayalItemInfo
              post_count={post_count}
              follow_count={follow_count}
              fans_count={fans_count}
              onPress={value => {
                this.props.navigation.navigate(value, { mobile: mobile })
              }}
            />

            <PortrayalViewButton
              isAdmin={isAdmin}
              isFollow={isFollow}
              isFollowLoading={
                cancelFollowStatus === 'running' ||
                addFollowStatus === 'running'
                  ? true
                  : false
              }
              isBlack={isBlack}
              isAddBlack={isAddBlack}
              blackList={black_list}
              onPress={value => {
                value === 'follow' && this.onClickAddFollow(value)
                value === 'forbidden' && this.onPressIsBlack(value) // 封号
                value === 'report' &&
                  this.props.navigation.navigate('Report', {
                    mobile: mobile,
                    member_id:member_id
                  })
                value === 'isAddBlack' && this.onPressAddBlack(value)
              }}
            />
          </View>
          {/*等级勋章*/}

          <FlatList
            keyExtractor={item => item.key}
            horizontal={true}
            data={tag}
            renderItem={({ item }) => <Medal {...item.data} />}
          />
          <View style={{ paddingBottom: 32 }} />
        </View>
        {/* 身份画像 */}
        <View style={{ backgroundColor: '#fff', flex: 1, marginTop: 16 }}>
          <Portrayal {...data} />
        </View>

        {
          this.state.visible &&
          <ImageShow
             post_url={[{post_med_url:this.state.avatarUrl}]}
              index={0}
              onClose={() => this.setState({visible: false})}
          />

        }
      </ScrollView>
    )
  }
  //点击拉黑
  isAddBlack(value) {
    let body = {
      from: this.state.data.member_id,
      handle: value // 1 拉黑 2 解封
    }
    let requestBody = getRequestBody(body)
    BTFetch('/black//addBlack', requestBody)
      .then(res => {
        devlog({res,value})
        if (res.code === '0') {
          this.setState(preState=>({
            isAddBlack:!preState.isAddBlack,
          }))
          Toast.info(res.msg, Config.ToestTime, null, false)
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

  // 点击封号
  doDisableUser(value) {
    let body = {
      member_id: this.state.data.member_id,
      handle: value // 1 拉黑 0 解封
    }
    devlog({value})
    let requestBody = getRequestBody(body)
    BTFetch('/app/addBlack', requestBody)
      .then(res => {
        if (res.code === '0') {
          this.setState({
            isBlack: !this.state.isBlack
          })
          Toast.info(res.msg, Config.ToestTime, null, false)
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

function mapStateToProps({ myState }) {
  const {
    isFollow,
    addFollowError,
    addFollowStatus,
    cancelFollowError,
    cancelFollowStatus
  } = myState
  return {
    isFollow,
    addFollowError,
    addFollowStatus,
    cancelFollowError,
    cancelFollowStatus
  }
}
export default connect(mapStateToProps)(PortrayalView)
