import React, { Component } from 'react'

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  DeviceEventEmitter,
  Modal,
  alert,
  Image,
  Linking,
  FlatList,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import { Toast, ActivityIndicator } from 'antd-mobile-rn'

import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'
import {
  REQUEST_POST_DETAIL,
  REQUEST_DO_CANCEL_FOLLOW,
  REQUEST_DO_ADD_FOLLOW,
  DO_FOLLOW_PRAISE,
  REQUEST_HOMEPAGE_FORUM_POST_LIST,
  UPDATE_HOMEPAGE_FORUM_POST_LIST,
  REQUEST_DO_ADD_FOLLOW_FORUM,
  TOGGLE_COMMENT_INPUT_VISIBLE
} from '../Redux/Actions/ActionsTypes'
import BTBackButton from '../Tool/View/BTBackButton'
import UserInfo from '../Tool/UserInfo'
import Config from '../Tool/Config'
import throttle from 'lodash-es/throttle'
import NavStyle from '../Tool/Style/NavStyle'

// 方法
import { getImageURL, isiPhone8P } from '../Tool/FunctionTool'
import I18n from '../Tool/Language'

// 自有组件
import PostListCell from './Components/PostListCell'
import ActionListControlButton from '../Community/Components/ActionListControlButton'
import BTEmptyListView from '../Tool/View/BTEmptyListView'
import BTListFooterText from '../Tool/View/BTListFooterText'
import InputItem from './Components/InputItem'
import CommentMainInput from '../Community/Components/CommentMainInput'
const PAGE_SIZE = 6

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

const navigationOptions = ({ navigation }) => {
  const { forum_name } = navigation.state.params
  return {
    headerLeft: BTBackButton,
    headerRight: <ActionListControlButton {...navigation.state.params} />,
    headerTitle: <Text style={NavStyle.navTitle}>{forum_name}</Text>
  }
}

class HomepagePostList extends Component {
  static navigationOptions = navigationOptions

  constructor(props) {
    super(props)
    this.state = {
      forumData: props.navigation.state.params,
      isSelectAllPost: true,
      refreshing: false, // 刷新
      is_boutique: '0', // 是否显示精品贴
      isShowInputItem: false // 显示回复框
    }
    this.page = 1

    // 触底加载
    this.throttledOnEndReached = throttle(this.onEndReached.bind(this), 600, {
      trailing: false
    })

    this.eventHandle = DeviceEventEmitter.addListener(
      'REFRESH_POST',
      forumId => {
        if (forumId) {
          props.dispatch({
            type: REQUEST_HOMEPAGE_FORUM_POST_LIST,
            payload: { forum_id: forumId, page_size: 7 }
          })
        }
      }
    )
  }

  shouldComponentUpdate(nextProps) {
    return (
      !is(
        fromJS(nextProps.HomepageForumPostList.data),
        fromJS(this.props.HomepageForumPostList.data)
      ) ||
      !is(
        fromJS(nextProps.CommentInputVisible.data),
        fromJS(this.props.CommentInputVisible.data)
      ) ||
      !is(
        fromJS(nextProps.CurrentHomepageForumInfo),
        fromJS(this.props.CurrentHomepageForumInfo)
      )
    )
  }

  componentDidMount() {
    const { forum_id } = this.props.CurrentHomepageForumInfo

    this.props.dispatch({
      type: REQUEST_HOMEPAGE_FORUM_POST_LIST,
      payload: { forum_id, page_size: 7 }
    })
  }

  loadData(method) {
    const { is_boutique } = this.state
    const { forum_id } = this.props.CurrentHomepageForumInfo
    method = method ? method : 'new'
    if (method == 'new') {
      // 请求帖子列表，第一次请求多一些
      this.props.dispatch({
        type: REQUEST_HOMEPAGE_FORUM_POST_LIST,
        payload: {
          forum_id,
          is_boutique,
          page: this.page + '',
          page_size: PAGE_SIZE
        }
      })
    } else if (method == 'append') {
      this.props.dispatch({
        type: UPDATE_HOMEPAGE_FORUM_POST_LIST,
        payload: {
          forum_id,
          is_boutique,
          page: this.page + '',
          page_size: PAGE_SIZE
        }
      })
    }
  }

  componentWillUnmount() {
    this.eventHandle.remove()
  }

  // 添加主页频道关注
  _onPressFollowButton(value) {
    const { is_follow, forum_id } = value
    this.props.dispatch({
      type: REQUEST_DO_ADD_FOLLOW_FORUM,
      payload: {
        status: !is_follow ? '1' : '0',
        forum_id,
        router: 'HomepagePostList'
      }
    })

    const { forumData } = this.state
    const forumDataCopy = Object.assign({}, forumData)
    forumDataCopy.is_follow = !is_follow
    this.setState({
      forumData: forumDataCopy
    })
  }

  // 关注 取消关注
  _onPressFollow(value) {
    const { member_id, is_follow } = value
    if (is_follow) {
      this.props.dispatch({
        type: REQUEST_DO_CANCEL_FOLLOW,
        payload: { from: member_id, is_follow: false, router: 'Homepage' }
      })
    } else {
      this.props.dispatch({
        type: REQUEST_DO_ADD_FOLLOW,
        payload: { from: member_id, is_follow: true, router: 'Homepage' }
      })
    }
  }

  // 点赞数
  _onPressPraiseAndComment(value) {
    const { key, mobile, post_id, is_praise } = value
    if (key == 'like') {
      this.props.dispatch({
        type: DO_FOLLOW_PRAISE,
        payload: {
          post_id,
          is_follow: true,
          mobile,
          myMobile: UserInfo.mobile,
          status: !is_praise + '',
          router: 'Homepage'
        }
      })
    }

    key == 'comment' && this.triggerComment(value)
  }

  triggerComment(value) {
    this.props.dispatch({
      type: TOGGLE_COMMENT_INPUT_VISIBLE,
      payload: { ...value, router: 'HomepagePostList' }
    })
    this.scrollToIndex()
  }

  // 这个是点击回复的时候，让该帖子滚动到界面中间
  scrollToIndex = () => {
    const { scrollToIndex, index } = this.props
    if (scrollToIndex && typeof index != 'undefined') scrollToIndex(index)
  }

  // 跳转到身份画像页面
  _onPressNavigateToPortrayal(value) {
    const { mobile } = value
    this.props.navigation.navigate('Portrayal', { mobile })
  }

  // 点击进入帖子详情
  handleNavigateToDetail(post_id) {
    const { HomepageForumPostList } = this.props
    // const { forum_id } = this.state.forumData
    const { forum_id } = this.props.CurrentHomepageForumInfo

    const { admins } = HomepageForumPostList.data
    this.props.dispatch({
      type: REQUEST_POST_DETAIL,
      payload: { post_id, router: 'Homepage' }
    })

    // 2. 确认现有的帖子里面有没有数据
    const isDataExist =
      HomepageForumPostList.data.post.findIndex(ele => ele.post_id == post_id) >
      -1
    this.props.navigation.navigate('OnePost', {
      forum_id,
      admins,
      post_id,
      isDataExist,
      isCommunity: true
    })
  }

  // 所有帖子
  onPressAllPost() {
    // const { forumData } = this.state

    // const { forum_id } = forumData
    const { forum_id } = this.props.CurrentHomepageForumInfo

    this.props.dispatch({
      type: REQUEST_HOMEPAGE_FORUM_POST_LIST,
      payload: { forum_id, is_boutique: '0' }
    })
    this.setState({
      isSelectAllPost: true,
      is_boutique: '0'
    })
  }

  // 精品帖子
  onPressBoutiquePost() {
    const { forumData } = this.state

    const { forum_id } = forumData

    this.props.dispatch({
      type: REQUEST_HOMEPAGE_FORUM_POST_LIST,
      payload: { forum_id, is_boutique: '1' }
    })
    this.setState({
      isSelectAllPost: false,
      is_boutique: '1'
    })
  }

  // 下拉刷新
  onRefresh = () => {
    this.page = 0
    this.loadData()
  }

  // 触底加载
  onEndReached({ distanceFromEnd }) {
    const len = this.props.HomepageForumPostList.data.post.length

    if (len == 0) return
    // 异步回调加载 requestData 帖子总数
    this.page += 1

    this.loadData('append')
  }

  handleClickSendMessage(value) {}
  render() {
    const {
      HomepageForumPostList,
      animating,
      CommentInputVisible,
      CurrentHomepageForumInfo
    } = this.props
    const { post } = HomepageForumPostList.data
    const { refreshing, isShowInputItem } = this.state
    return (
      <View style={styles.container}>
        <FlatList
          data={HomepageForumPostList.data.post}
          extraData={HomepageForumPostList.data.post}
          ListHeaderComponent={this._renderListHeader()}
          renderItem={item => this._renderItem(item)}
          keyExtractor={(item, index) =>
            item.created_at +
            '-' +
            item.mobile +
            '-' +
            item.post_id +
            '-' +
            item.group_id +
            index
          }
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          onEndReachedThreshold={0.2}
          onEndReached={this.throttledOnEndReached}
          ListFooterComponent={
            post && post.length > 7 ? <BTListFooterText /> : null
          }
        />
        {/* {isShowInputItem ? (
          <View style={{ backgroundColor: '#F5F5F5' }}>
            <InputItem
              onClick={value => this.handleClickSendMessage(value)}
              // loading={this.state.sendMessageLoading}
            />
          </View>
        ) : null} */}
        {CommentInputVisible.data && (
          <KeyboardAvoidingView
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior="padding"
            enabled>
            <CommentMainInput router="HomepagePostList" />
          </KeyboardAvoidingView>
        )}
      </View>
    )
  }

  _renderListHeader() {
    const { forumData, isSelectAllPost } = this.state
    const { HomepageForumPostList, CurrentHomepageForumInfo } = this.props

    const {
      forum_name,
      forum_id,
      is_follow,
      forum_post_count,
      forum_icon,
      forum_count
    } = CurrentHomepageForumInfo
    if (!HomepageForumPostList) {
      return <View />
    }
    return (
      <View>
        <View
          style={{
            marginTop: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',

              alignItems: 'center'
            }}>
            <View style={{ width: 67, height: 67 }}>
              <Image
                style={{
                  width: 67,
                  height: 67,
                  borderRadius: 33,
                  marginRight: 10
                }}
                source={{ uri: getImageURL(forum_icon) }}
              />
            </View>
            <View style={{ marginLeft: 19 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    color: '#1F1F1F',
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}>
                  {forum_name}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 11 }}>
                <Text>
                  关注数:
                  <Text style={{ color: '#046FDB' }}>
                    {'  '}
                    {forum_count}
                  </Text>
                </Text>
                <Text style={{ marginLeft: 20 }}>
                  发帖数:
                  <Text style={{ color: '#046FDB' }}>
                    {'  '}
                    {forum_post_count}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[
              {
                backgroundColor: '#046FDB',
                width: 46,
                height: 46,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 23
              },
              is_follow
                ? {
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#046FDB'
                  }
                : {}
            ]}
            onPress={() => this._onPressFollowButton({ is_follow, forum_id })}>
            <Text
              style={[
                { color: '#fff', fontSize: 13 },
                is_follow ? { color: '#046FDB' } : {}
              ]}>
              {is_follow ? '已关注' : '关注'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* 选择全部发帖 精华 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16
          }}>
          <TouchableOpacity
            style={[styles.buttonNor, isSelectAllPost ? styles.buttonSel : {}]}
            onPress={() => {
              this.onPressAllPost()
            }}>
            <Text
              style={[
                { color: '#046FDB', fontSize: 12, fontWeight: 'bold' },
                isSelectAllPost ? styles.textSel : {}
              ]}>
              全部发帖
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonNor,
              { marginLeft: 10 },
              isSelectAllPost ? {} : styles.buttonSel
            ]}
            onPress={() => {
              this.onPressBoutiquePost()
            }}>
            <Text
              style={[
                { color: '#046FDB', fontSize: 12, fontWeight: 'bold' },
                isSelectAllPost ? {} : styles.textSel
              ]}>
              精华
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  /**
   * cell内容
   */
  _renderItem({ item }) {
    return (
      <PostListCell
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
}

function mapStateToProps(state) {
  const {
    HomepageForumPostList,
    PostListAnimating,
    CurrentHomepageForumInfo
  } = state.HomepageState

  const { CommentInputVisible } = state.CommunityPostState

  return {
    HomepageForumPostList,
    animating: PostListAnimating,
    CommentInputVisible,
    CurrentHomepageForumInfo
  }
}

export default connect(mapStateToProps)(HomepagePostList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column'
  },
  buttonSel: {
    backgroundColor: '#046FDB',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  buttonNor: {
    width: 71,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textSel: {
    color: '#fff'
  }
})
