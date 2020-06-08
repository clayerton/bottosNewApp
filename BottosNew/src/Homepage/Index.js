import React, { Component } from 'react'
import {
  Image,
  Text,
  View,
  StyleSheet,
  DeviceEventEmitter,
  FlatList
} from 'react-native'
import { Toast, ActivityIndicator } from 'antd-mobile-rn/lib/index.native'

import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'
import {
  REQUEST_HOMEPAGE_FORUM_LIST,
  REQUEST_HOMEPAGE_FORUM_POST_LIST,
  REQUEST_DO_ADD_FOLLOW_FORUM,
  UPDATE_HOMEPAGE_FORUM_LIST,
  UPDATE_CURRENT_HOMEPAGE_FORUM_INFO,
  SET_CURRENT_HOMEPAGE_FORUM_INFO
} from '../Redux/Actions/ActionsTypes'
import { devlog } from '../Tool/FunctionTool'
import UserInfo from '../Tool/UserInfo'
import Config from '../Tool/Config'
import I18n from '../Tool/Language'
import throttle from 'lodash-es/throttle'

// 组件
import HomepageListCell from './Components/HomepageListCell'
import BTListFooterText from '../Tool/View/BTListFooterText'

// 常量
const PAGE_SIZE = 12
class Homepage extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      refreshing: false // 刷新
    }
    this.page = 1
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
    // props.navigation.addListener('didFocus', e => {
    //   const action = e.action || {}
    //   if (action.type == 'Navigation/INIT') return
    //   if (UserInfo.token !== '') {
    //     this.loadData()
    //   }
    // })

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

    // 触底加载
    this.throttledOnEndReached = throttle(this.onEndReached.bind(this), 600, {
      trailing: false
    })
  }

  componentDidMount() {
    if (UserInfo.token !== '') {
      this.loadData()
    }
  }
  shouldComponentUpdate(nextProps) {
    return !is(
      fromJS(nextProps.HomepageForumList.data),
      fromJS(this.props.HomepageForumList.data)
    )
  }

  // Token超时通知
  tokenDeviceEventEmitter = value => {
    if (!UserInfo.isLoginState) {
      UserInfo.isLoginState = true
      if (value !== null && value !== undefined && value !== '') {
        Toast.info(value, Config.ToestTime, null, false)
      }
      this.props.navigation.navigate('Login')
    }
  }

  //接受登录通知
  loginDeviceEventEmitter = () => {
    UserInfo.isLoginState = false
    this.loadData()
  }

  loadData(method) {
    method = method ? method : 'new'
    // 请求主页列表
    if (method == 'new') {
      this.props.dispatch({
        type: REQUEST_HOMEPAGE_FORUM_LIST,
        payload: {
          page: this.page + '',
          page_size: PAGE_SIZE
        }
      })
    } else if (method == 'append') {
      this.props.dispatch({
        type: UPDATE_HOMEPAGE_FORUM_LIST,
        payload: {
          page: this.page + '',
          page_size: PAGE_SIZE
        }
      })
    }
  }

  // 下拉刷新
  onRefresh = () => {
    this.page = 1
    this.loadData()
  }

  // 触底加载
  onEndReached({ distanceFromEnd }) {
    const len = this.props.HomepageForumList.data.length

    if (len == 0) return
    // 异步回调加载 requestData 帖子总数
    this.page += 1

    this.loadData('append')
  }
  // 点击进入单个主页列表
  onPressHomepageListCell(value) {
    this.props.dispatch({
      type: SET_CURRENT_HOMEPAGE_FORUM_INFO,
      payload: value
    })
    this.props.navigation.navigate('HomepagePostList', value)
  }

  // 点击关注列表
  onPressAddAndCancelFollowForum(value) {
    this.props.dispatch({
      type: REQUEST_DO_ADD_FOLLOW_FORUM,
      payload: value
    })
  }

  render() {
    const { HomepageForumList, animating } = this.props
    const { refreshing } = this.state

    return (
      <View style={styles.container}>
        <FlatList
          data={HomepageForumList.data}
          extraData={HomepageForumList.data}
          ListHeaderComponent={() => this._renderListHeader()}
          renderItem={item => this._renderItem(item)}
          keyExtractor={(item, index) =>
            item.forum_icon + '' + item.forum_id + index
          }
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          onEndReachedThreshold={0.2}
          onEndReached={this.throttledOnEndReached}
          // ListFooterComponent={
          //   HomepageForumList.data && HomepageForumList.data.length > 7 ? (
          //     <BTListFooterText />
          //   ) : null
          // }
          // getItemLayout={(data, index) => {
          //   return getItemLayout(data, index, false)
          // }}
        />
        {/* <ActivityIndicator
          animating={animating}
          toast
          size="large"
          text={I18n.t('tip.wait_text')}
        /> */}
      </View>
    )
  }

  _renderItem({ item }) {
    return (
      <HomepageListCell
        {...item}
        onPress={value => {
          this.onPressHomepageListCell(value)
        }}
        onPressAddAndCancelFollowForum={value => {
          this.onPressAddAndCancelFollowForum(value)
        }}
      />
    )
  }

  _renderListHeader() {
    return (
      <View
        style={{
          marginTop: 60,
          marginBottom: 9,
          paddingLeft: 12,
          paddingRight: 12
        }}>
        <Text style={styles.headerTitleText}>主页</Text>
      </View>
    )
  }
}
function mapStateToProps(state) {
  const { HomepageForumList, animating } = state.HomepageState

  return { HomepageForumList, animating }
}

export default connect(mapStateToProps)(Homepage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  headerTitleText: {
    color: '#212833',
    fontSize: 34,
    fontWeight: '900'
  }
})
