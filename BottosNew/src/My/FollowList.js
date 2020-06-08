import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList, DeviceEventEmitter
} from 'react-native'
import { connect } from 'react-redux'
import NavStyle from '../Tool/Style/NavStyle'

import I18n from '../Tool/Language'
import {
  REQUEST_UPDATE_FOLLOW_LIST,
  REQUEST_APPEND_FOLLOW_LIST,
  REQUEST_DO_CANCEL_FOLLOW,
  REQUEST_DO_ADD_FOLLOW,
    REQUEST_CHECK_IS_FOLLOW
} from '../Redux/Actions/ActionsTypes'

//我的粉丝关注action
import * as MyfansAction from '../Redux/Actions/MyfansAction'
// 组件
import BTWaitView from '../Tool/View/BTWaitView'
import MoreMessage from './Item/MoreMessage'
import Item from './Item/FollowListItem'
import UserInfo from '../Tool/UserInfo'
import {getRequestBody} from "../Tool/FunctionTool";
import BTFetch from "../Tool/NetWork/BTFetch";
import {Toast} from "antd-mobile-rn";
import Config from "../Tool/Config";

class FollowList extends Component {
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
      headerRight: <Text style={NavStyle.rightButton}> </Text>,
      headerTitle: (
        <Text style={NavStyle.navTitle}>
          {I18n.t('followList.header_title')}
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
      this.mobile = props.navigation.getParam('mobile');
    this.state = {
      page_count: 1,
      page: 1,
      page_size: 10, // 默认每页十条数据
      animating: true, // 请求成功关闭Loading...
      refreshing: false, // loading...
        mobile :this.mobile, //手机号
        myMobile:UserInfo.mobile, //我的手机号
    }
  }

  componentDidMount() {
    this.loadData(this.state.page)
  }

  loadData(page) {
    const { page_size,mobile,myMobile } = this.state
    this.props.dispatch({
      type: REQUEST_UPDATE_FOLLOW_LIST,
      payload: { page, page_size, type:2,mobile }
    })




  }

  // 底部 查看 更多消息
  renderFooter() {
    return this.props.page == this.props.page_count ||
      !this.props.data.length ? null : (
      <MoreMessage onPress={() => this.handleLoadMoreMessage()} />
    )
  }

  // 点击关注 && 取消关注
  _onPressFollow(member_id, isFollow) {
    const { mobile,myMobile } = this.state
    
    //个人画像
    if (isFollow) {
      this.props.dispatch({
        type: REQUEST_DO_CANCEL_FOLLOW,
        payload: { from: member_id,is_follow:false,mobile,myMobile}
      })
      DeviceEventEmitter.emit('FANSLIST_POST');
    } else {
      this.props.dispatch({
        type: REQUEST_DO_ADD_FOLLOW,
        payload: { from: member_id,is_follow:true,mobile,myMobile}
      })
      DeviceEventEmitter.emit('FANSLIST_POST');
    }
    
  }


  // 点击跳转个人画像
  handleNavigateToPortrayal(mobile) {
    const { navigate } = this.props.navigation
    navigate('Portrayal', {
      mobile
    })
  }

  // 加载更多信息
  handleLoadMoreMessage() {
    const { dispatch, page_count, page, data, } = this.props
    const { page_size,mobile } = this.state
    page < page_count &&
      dispatch({
        type: REQUEST_APPEND_FOLLOW_LIST,
        payload: { data, page: parseInt(page) + 1, page_size,type:2,mobile }
      })
  }
  isSHow(followListStatus) {}
  render() {
    const { data, followListStatus } = this.props
    return [
      data && !!data.length ? (
        <FlatList
          // refreshing={this.state.refreshing}
          // onRefresh={() => this.onRefresh()}
          ListFooterComponent={() => this.renderFooter()}
          data={data}
          renderItem={({ item }) => (
            <Item
              data={item}
              onPress={value => this.handleNavigateToPortrayal(value)}
              onPressFollow={(member_id, isFollow) => {
                this._onPressFollow(member_id, isFollow)
              }}
            />
          )}
          keyExtractor={item => item.member_id.toString()}
          key="FollowListPage"
        />
      ) : (
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#fff',
            height: UserInfo.screenH
          }}>
          <Image
            style={{ width: 226, height: 173, marginTop: 64 }}
            source={require('../BTImage/My/my_follow_list_bg.png')}
          />
          <Text style={{ color: '#8395A7', fontSize: 16, marginTop: 32 }}>
            {I18n.t('followList.no_follow_tip1')}
          </Text>
          <Text style={{ color: '#D1D5DD', fontSize: 12, marginTop: 16 }}>
            {I18n.t('followList.no_follow_tip2')}
          </Text>
          <Text style={{ color: '#D1D5DD', fontSize: 12 }}>
            {I18n.t('followList.no_follow_tip3')}
          </Text>
        </View>
      ),
      <BTWaitView
        title={I18n.t('tip.wait_text')}
        show={followListStatus === 'running' ? true : false}
      />
    ]
  }
}
function mapStateToProps({ myState }) {
  const {
    followListData,
    followListStatus,
    followListError,
    followListPageCount,
    followListPage
  } = myState
  return {
    data: followListData,
    followListStatus,
    followListError,
    page_count: followListPageCount,
    page: followListPage
  }
}
export default connect(mapStateToProps)(FollowList)
