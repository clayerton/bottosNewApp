import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'
import {
  Text,
  Modal,
  TouchableOpacity,
  View,
  Image,
  DeviceEventEmitter,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  NativeModules,
  ScrollView
} from 'react-native'
import { Toast, ActivityIndicator } from 'antd-mobile-rn'
import styles from './style'
import {
  DO_SAVE_CURRENT_MENU_OPTION,
  REQUEST_POST_TOP_POST,
  REQUEST_HOMEPAGE_LIST,
  UPDATE_HOME_PAGE_CONTENT,
  APPEND_HOME_PAGE_CONTENT,
  DO_FOLLOW_PRAISE,
  TOGGLE_COMMENT_INPUT_VISIBLE,
  UPDATE_UNREAD_MESSAGE,
  REQUEST_DO_ADD_FOLLOW,
  REQUEST_DO_CANCEL_FOLLOW,
  REQUEST_POST_DETAIL
} from '../Redux/Actions/ActionsTypes'
import CommentMainInput from './Components/CommentMainInput' // 评论输入框
// 操作栏相关的
import ActionListControlButton from './Components/ActionListControlButton'
import ActionList from './Components/ActionList'
// 方法
import {
  devlog,
  isIPhoneX,
  isiPhone8P,
  getRequestURL,
  getImageURL
} from '../Tool/FunctionTool'

import I18n from '../Tool/Language'
import NavStyle from '../Tool/Style/NavStyle'
import Config from '../Tool/Config'
import UserInfo from '../Tool/UserInfo'
import throttle from 'lodash-es/throttle'
import SplashScreen from 'react-native-splash-screen'
import SearchBar from '../Tool/View/SearchInput/components/SearchBar'
import MenuBar from './Components/MenuBar'
import TopPost from './Components/TopPost'
import PostListCellNormal from './Components/PostListCellNormal'
import PostListFocusCell from './Components/PostListFocusCell'
import NavigationRight from './Components/NavigationRight'

let ClientUpdateModule = NativeModules.ClientUpdateModule

// 常量
const PAGE_SIZE = 12
// 键盘弹出的偏移量，要对 Android 和 IOS 分别适配，并且还要适配特定机型
const isBigScreen = UserInfo.screenH / UserInfo.screenW > 1.95
let keyboardVerticalOffset = 55

// 后来发现 小米8 的适配也有问题，所以我判断一下，如果是屏幕很长，就也采用 84
// 并且 android 和 iOS 的要分开判断
if (Platform.OS === 'ios') {
  // 8P 的适配
  if (isiPhone8P()) {
    keyboardVerticalOffset = 60
  } else if (isBigScreen) {
    keyboardVerticalOffset = 84
  }
} else {
  // android 大手机的适配
  if (isBigScreen) {
    keyboardVerticalOffset = 94
  }
}

// 列表底部加载中字样
function ListFooter(props) {
  return (
    <Text style={{ textAlign: 'center' }}>
      {I18n.t('community.loading_wait')}
    </Text>
  )
}

// 当列表为空的时候
const renderEmpty = () => {
  return (
    <View style={{ flexGrow: 1, margin: '20%' }}>
      <Image
        style={{ width: '100%', maxHeight: 200 }}
        resizeMode="contain"
        source={require('../BTImage/My/my_follow_list_bg.png')}
      />
      <Text style={{ marginTop: 50, textAlign: 'center' }}>
        {I18n.t('community.noPost')}
      </Text>
    </View>
  )
}

// 导航栏选项
const navigationOptions = ({ navigation }) => {
  const { push } = navigation
  return {
    headerLeft: (
      <NavigationRight
        navigation={navigation}
        onPress={value => {
          // 跳转消息列表
          if (value === 'message') {
            navigation.navigate('MessageList')
          }
        }}
      />
    ),
    headerTitle: (
      <Text style={NavStyle.navTitle}>社区</Text>
      // <SearchBar
      //   placeholder={'请输入您要搜索的内容'}
      //   searchInputPlaceholderColor={'#B1B1B1'}
      //   // onChange={this.search.bind(this)}
      //   // onFocus={this.onFocus.bind(this)}
      //   // onBlur={this.onBlur.bind(this)}
      //   // onClickCancel={this.onClickCancel.bind(this)}
      //   cancelTitle={'取消'}
      //   ref="searchBar"
      // />
    ),
    headerRight: <ActionListControlButton />
  }
}
class Community extends Component {
  static navigationOptions = navigationOptions

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      refreshing: false,
      adWelcome: undefined, //启动广告
      adWelcomeURL: '', //启动广告URL
      adWelcomeShow: false, //启动广告是否显示
      adWelcomeCountDown: 5, //启动广告倒计时

      adAlert: undefined, //弹窗广告
      adAlertURL: '', //弹窗广告URL
      adAlertShow: false //弹窗广告是否显示
    }
    this.page = 0
    canNavigate = true
    this.requestUnreadMessageInfo = this.requestUnreadMessageInfo.bind(this)

    props.navigation.addListener('didFocus', e => {
      const action = e.action || {}
      if (action.type == 'Navigation/INIT') return
      this.requestUnreadMessageInfo()
    })

    //广告通知
    this.eventHandle = DeviceEventEmitter.addListener(
      Config.AdDeviceEventEmitter,
      this.adDeviceEventEmitter
    )

    //Token超时通知
    this.eventHandle = DeviceEventEmitter.addListener(
      Config.TokenDeviceEventEmitter,
      this.tokenDeviceEventEmitter
    )
    //登录成功通知
    this.eventHandle = DeviceEventEmitter.addListener(
      Config.LoginDeviceEventEmitter,
      this.loginDeviceEventEmitter
    )

    this.eventHandle = DeviceEventEmitter.addListener(
      'REFRESH_POST',
      forumId => {
        if (!forumId) {
          this.loadData()
        }
      }
    )
    // 触底加载
    this.throttledOnEndReached = throttle(this.onEndReached.bind(this), 600, {
      trailing: false
    })
  }

  componentDidMount() {
    this.adDeviceEventEmitter()
    if (UserInfo.token !== '') {
      this.loadData()
    }
    //安全措施，在一定时间内关闭
    setTimeout(() => {
      SplashScreen.hide()

      //关闭广告
      this.setState({
        adWelcomeShow: false,
        adAlertShow: false
      })
      // 检查版本更新
      this.updateModal()
    }, 15000)
  }

  //Token超时通知
  tokenDeviceEventEmitter = value => {
    if (!UserInfo.isLoginState) {
      UserInfo.isLoginState = true
      if (value !== null && value !== undefined && value !== '') {
        Toast.info(value, Config.ToestTime, null, false)
      }
      this.props.navigation.navigate('Login')
      //关闭弹窗广告
      this.setState({
        adAlertShow: false
      })
    }
  }

  //广告资源通知
  adDeviceEventEmitter = () => {
    for (let i = 0; i < UserInfo.adArray.length; i++) {
      let ads = UserInfo.adArray[i]
      if (ads.flag === 'welcome_page_bg') {
        if (
          ads.status !== 1 ||
          ads.ad === undefined ||
          ads.ad[0].file === undefined ||
          ads.ad[0].file === null ||
          ads.ad[0].file === ''
        ) {
          SplashScreen.hide()
          //没有启动广告，开启弹窗广告
          this.showAdAlert()
        } else {
          //有启动广告
          this.setState({
            adWelcomeShow: true,
            adWelcome: getImageURL(ads.ad[0].file),
            adWelcomeURL: ads.ad[0].url
          })
        }
      }
    }
  }

  showAdAlert() {
    for (let i = 0; i < UserInfo.adArray.length; i++) {
      let ads = UserInfo.adArray[i]

      if (ads.flag === 'adAlert') {
        if (
          ads.status !== 1 ||
          ads.ad === undefined ||
          ads.ad[0].file === undefined ||
          ads.ad[0].file === null ||
          ads.ad[0].file === ''
        ) {
        } else {
          this.setState({
            adAlertShow: true,
            adAlert: getImageURL(ads.ad[0].file),
            adAlertURL: ads.ad[0].url
          })
        }
      }
    }
  }

  //接受登录通知
  loginDeviceEventEmitter = () => {
    UserInfo.isLoginState = false

    this.loadData()
  }

  loadData(method) {
    method = method ? method : 'new'
    const { CurrentMenuOption } = this.props
    if (method == 'new') {
      // 获取菜单栏数据
      this.props.dispatch({
        type: REQUEST_HOMEPAGE_LIST
      })
      // 获取置顶帖数据
      this.props.dispatch({
        type: REQUEST_POST_TOP_POST
      })
      // 请求帖子列表，第一次请求多一些
      this.props.dispatch({
        type: UPDATE_HOME_PAGE_CONTENT,
        // payload: { page: 0, page_size: PAGE_SIZE } TODO:
        payload: {
          ...CurrentMenuOption.data,
          page: this.page + '',
          page_size: PAGE_SIZE
        }
      })
      this.requestUnreadMessageInfo()
    } else if (method == 'append') {
      const { CurrentMenuOption } = this.props
      this.props.dispatch({
        type: APPEND_HOME_PAGE_CONTENT,
        payload: {
          ...CurrentMenuOption.data,
          page: this.page + '',
          page_size: PAGE_SIZE
        }
      })
    }
  }

  // 下拉刷新
  onRefresh = () => {
    this.page = 0
    this.loadData()
  }

  // 触底加载
  onEndReached({ distanceFromEnd }) {
    const len = this.props.HomePageContentList.data.length

    if (len == 0) return
    // 异步回调加载 requestData 帖子总数
    this.page += 1

    this.loadData('append')
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !is(fromJS(nextProps.animating), fromJS(this.props.animating)) ||
      !is(
        fromJS(nextProps.HomePageList.data),
        fromJS(this.props.HomePageList.data)
      ) ||
      !is(
        fromJS(nextProps.HomePageContentList),
        fromJS(this.props.HomePageContentList)
      ) ||
      !is(
        fromJS(nextProps.CommentInputVisible.data),
        fromJS(this.props.CommentInputVisible.data)
      ) ||
      !is(
        fromJS(nextProps.HomePageContentRecommendList),
        fromJS(this.props.HomePageContentRecommendList)
      ) ||
      !is(fromJS(nextState), fromJS(this.state))
    )
  }

  componentWillUnmount() {
    this.eventHandle.remove()
  }

  // 获取未读消息
  requestUnreadMessageInfo() {
    this.props.dispatch({
      type: UPDATE_UNREAD_MESSAGE
    })
  }

  // 点击菜单栏
  _onPressMenuBar(value) {
    this.props.dispatch({
      type: DO_SAVE_CURRENT_MENU_OPTION,
      payload: value
    })

    this.props.dispatch({
      type: UPDATE_HOME_PAGE_CONTENT,
      payload: value
    })
  }

  // 点赞数
  _onPressPraiseAndComment(value) {
    const { key, mobile, post_id, is_praise } = value
    key == 'like' &&
      this.props.dispatch({
        type: DO_FOLLOW_PRAISE,
        payload: {
          post_id,
          is_follow: true,
          mobile,
          myMobile: UserInfo.mobile,
          status: !is_praise + ''
        }
      })

    key == 'comment' && this.triggerComment(value)
  }

  // 触发评论框
  triggerComment(value) {
    this.props.dispatch({
      type: TOGGLE_COMMENT_INPUT_VISIBLE,
      payload: value
    })
    this.scrollToIndex()
  }

  // 这个是点击回复的时候，让该帖子滚动到界面中间
  scrollToIndex = () => {
    const { scrollToIndex, index } = this.props
    if (scrollToIndex && typeof index != 'undefined') scrollToIndex(index)
  }

  // 关注 取消关注
  _onPressFollow(value) {
    const { member_id, is_follow } = value
    if (is_follow) {
      this.props.dispatch({
        type: REQUEST_DO_CANCEL_FOLLOW,
        payload: { from: member_id, is_follow: false, router: 'Community' }
      })
    } else {
      this.props.dispatch({
        type: REQUEST_DO_ADD_FOLLOW,
        payload: { from: member_id, is_follow: true, router: 'Community' }
      })
    }
  }

  // 跳转到身份画像页面
  _onPressNavigateToPortrayal(value) {
    const { mobile } = value
    this.props.navigation.navigate('Portrayal', { mobile })
  }

  handleNavigateToDetail(post_id) {
    const { HomePageContentList } = this.props

    this.props.dispatch({
      type: REQUEST_POST_DETAIL,
      payload: { post_id }
    })
    // 2. 确认现有的帖子里面有没有数据
    const isDataExist =
      HomePageContentList.data.findIndex(ele => ele.post_id == post_id) > -1

    this.props.navigation.navigate('OnePost', {
      post_id,
      isDataExist,
      isCommunity: true
    })
  }

  render() {
    if (UserInfo.token == '') {
      return null
    }

    const { HomePageContentList, CommentInputVisible, animating } = this.props
    const { refreshing } = this.state

    return (
      <View style={styles.container}>
        {/*启动页广告*/}
        <Modal
          animationType={'none'}
          transparent={false}
          visible={this.state.adWelcomeShow}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: UserInfo.screenW,
              height: UserInfo.screenH,
              backgroundColor: '#FFFFFF'
            }}
            onPress={() => {
              if (
                this.state.adWelcome === '' ||
                this.state.adWelcome === undefined ||
                this.state.adWelcome === null ||
                this.state.adWelcomeURL === '' ||
                this.state.adWelcomeURL === undefined ||
                this.state.adWelcomeURL === null
              )
                return

              this.props.navigation.navigate('BTPublicWebView', {
                url: this.state.adWelcomeURL,
                navTitle: I18n.t('tip.ad_title')
              })

              clearInterval(this.interval)
              this.setState({
                adWelcomeShow: false
              })
            }}>
            {this.state.adWelcome ? (
              <Image
                source={{
                  uri: this.state.adWelcome,
                  cache: 'force-cache'
                }}
                style={{ width: UserInfo.screenW, height: UserInfo.screenH }}
                onLoadStart={() => {}}
                onLoad={event => {
                  //倒计时
                  this.interval = setInterval(() => {
                    let value = this.state.adWelcomeCountDown - 1
                    this.setState({
                      adWelcomeCountDown: value
                    })

                    if (value <= 0) {
                      clearInterval(this.interval)
                      this.setState({
                        adWelcomeShow: false
                      })
                      //启动广告关闭后，在开启弹窗广告
                      this.showAdAlert()
                    }
                  }, 1000)
                  SplashScreen.hide()
                }}
                onLoadEnd={() => {}}
              />
            ) : (
              <View />
            )}

            <View
              style={{
                backgroundColor: '#F1F1F188',
                borderRadius: 8,
                position: 'absolute',
                left: 18,
                top: 24,
                height: 26,
                width: 48
              }}>
              <Text
                style={{
                  flex: 1,
                  lineHeight: 26,
                  fontSize: 14,
                  color: '#D1D5DD',
                  textAlign: 'center'
                }}>
                {I18n.t('tip.ad_title')}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                backgroundColor: '#F1F1F188',
                borderRadius: 8,
                position: 'absolute',
                right: 18,
                top: 24,
                height: 26,
                width: 73
              }}
              onPress={() => {
                clearInterval(this.interval)
                this.setState({
                  adWelcomeShow: false
                })
                //启动广告关闭后，在开启弹窗广告
                this.showAdAlert()
              }}>
              <Text
                style={{
                  flex: 1,
                  lineHeight: 26,
                  fontSize: 14,
                  color: '#D1D5DD',
                  textAlign: 'center'
                }}>
                {I18n.t('tip.ad_close')}({this.state.adWelcomeCountDown})
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        {//弹窗广告
        this.state.adAlertShow === true && UserInfo.isLoginState !== true ? (
          <Modal
            animationType={'none'}
            transparent={true}
            visible={this.state.adAlertShow}>
            <View
              style={{
                width: UserInfo.screenW,
                height: UserInfo.screenH,
                backgroundColor: '#00000099',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  width: (UserInfo.screenW / 3) * 2,
                  height: UserInfo.screenW
                }}
                onPress={() => {
                  if (
                    this.state.adAlert === '' ||
                    this.state.adAlert === undefined ||
                    this.state.adAlert === null ||
                    this.state.adAlertURL === '' ||
                    this.state.adAlertURL === undefined ||
                    this.state.adAlertURL === null
                  )
                    return

                  this.props.navigation.navigate('BTPublicWebView', {
                    url: this.state.adAlertURL,
                    navTitle: I18n.t('tip.ad_title')
                  })
                  this.setState({
                    adAlertShow: false
                  })
                }}>
                {this.state.adAlert ? (
                  <Image
                    source={{ uri: this.state.adAlert, cache: 'force-cache' }}
                    style={{ flex: 1, resizeMode: Image.resizeMode.contain }}
                    onLoadStart={() => {}}
                    onLoad={event => {}}
                    onLoadEnd={() => {}}
                  />
                ) : (
                  <View />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  width: 50,
                  marginTop: 10
                }}
                onPress={() => {
                  this.setState({
                    adAlertShow: false
                  })
                }}>
                <Image
                  style={{ height: 50, width: 50 }}
                  source={require('../BTImage/Base/base_ad_alert_close.png')}
                />
              </TouchableOpacity>
            </View>
          </Modal>
        ) : (
          <View />
        )}

        <View
          style={{
            flex: 1,
            backgroundColor: '#FFF',
            paddingLeft: 12,
            paddingRight: 12
          }}>
          <FlatList
            data={HomePageContentList.data}
            refreshing={refreshing}
            extraData={HomePageContentList.data}
            ListHeaderComponent={() => this._renderListHeader()}
            ListFooterComponent={
              HomePageContentList.data &&
              HomePageContentList.data.length > 7 &&
              !HomePageContentList.isLastPage ? (
                <ListFooter />
              ) : null
            }
            ListEmptyComponent={
              HomePageContentList.status == 'success' ? renderEmpty : null
            }
            onRefresh={this.onRefresh}
            keyExtractor={(item, index) =>
              item.post_id +
              '-' +
              item.created_at +
              '-' +
              item.member_id +
              index
            }
            renderItem={item => this._renderItem(item)}
            onEndReachedThreshold={0.3}
            onEndReached={this.throttledOnEndReached}
          />
        </View>

        <ActionList key="ActionList" />

        {CommentInputVisible.data && (
          <KeyboardAvoidingView
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior="padding"
            enabled
            key="KeyboardAvoidingView">
            <CommentMainInput key="CommentMainInput" />
          </KeyboardAvoidingView>
        )}

        <ActivityIndicator
          animating={animating}
          toast
          size="large"
          text={I18n.t('tip.wait_text')}
          key="ActivityIndicator"
        />
      </View>
    )
  }

  /**
   * cell内容
   */
  _renderItem({ item }) {
    const { is_long } = item
    return is_long ? (
      <PostListFocusCell
        {...item}
        onPressLinkToURL={value => {
          this.props.navigation.navigate('BTPublicWebView', value)
        }}
      />
    ) : (
      <PostListCellNormal
        {...item}
        onPressFollow={value => {
          this._onPressFollow(value)
        }}
        onPressPraiseAndComment={value => {
          this._onPressPraiseAndComment(value)
        }}
        onPressNavigateToPortrayal={value => {
          this._onPressNavigateToPortrayal(value)
        }}
        handleNavigateToDetail={value => {
          this.handleNavigateToDetail(value)
        }}
        onPressLinkToURL={value => {
          this.props.navigation.navigate('BTPublicWebView', value)
        }}
      />
    )
  }

  /**
   * 菜单栏
   * 置顶
   */
  _renderListHeader() {
    const { CurrentMenuOption, HomePageList } = this.props
    return [
      <MenuBar
        data={HomePageList.data}
        onPress={value => this._onPressMenuBar(value)}
        CurrentMenuOption={CurrentMenuOption}
        key="CommunityMenuBar"
      />,
      CurrentMenuOption.data && CurrentMenuOption.data.option_id == 2 ? (
        <TopPost key="CommunityTopPost" />
      ) : null
    ]
  }

  //检查硬更新版本
  updateModal() {
    if (ClientUpdateModule) {
      if (Platform.OS === 'ios') {
        ClientUpdateModule.checkUpdate(
          getRequestURL() +
            Config.URLSuffix +
            '/app/checkAppVersion?client=2&sign=cd174dc81c2ee3e7d52914859cbc4c92',
          0,
          {
            update_new_version: I18n.t('base.update_new_version'),
            update_update: I18n.t('base.update_update'),
            update_is_new_version: I18n.t('base.update_is_new_version'),
            update_data_error: I18n.t('base.update_data_error'),
            update_cancel: I18n.t('tip.cancel'),
            update_offline: I18n.t('tip.offline')
          },
          (error, events) => {}
        )
      } else if (Platform.OS === 'android') {
        ClientUpdateModule.checkUpdate(
          getRequestURL() +
            Config.URLSuffix +
            '/app/checkAppVersion?client=1&sign=ab2396ba0328ea6cd845b7dbc8e8db23',
          0,
          msg => {}
        )
      }
    }
  }
}

function mapStateToProps(state) {
  const {
    HomePageContentList,
    HomePageList,
    CurrentMenuOption,
    CommentInputVisible,
    animating
  } = state.CommunityPostState

  return {
    CurrentMenuOption,
    HomePageList,
    HomePageContentList,
    CommentInputVisible,
    animating
  }
}

export default connect(mapStateToProps)(Community)
