import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, DeviceEventEmitter,FlatList} from 'react-native';
import NavStyle from "../Tool/Style/NavStyle";
import I18n from "../Tool/Language";

//redux组件
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'

import {
    REQUEST_UPDATE_FOLLOW_LIST,
    REQUEST_APPEND_FOLLOW_LIST,
    REQUEST_DO_CANCEL_FOLLOW,
    REQUEST_DO_ADD_FOLLOW,
      REQUEST_CHECK_IS_FOLLOW
  } from '../Redux/Actions/ActionsTypes'
import * as MyfansAction from '../Redux/Actions/MyfansAction'


import UserInfo from '../Tool/UserInfo'

import BTFetch from '../Tool/NetWork/BTFetch'
import {getRequestBody, devlog} from "../Tool/FunctionTool";
import {Toast} from "antd-mobile-rn";
import Item from "./Item/FollowListItem";
import BTWaitView from "../Tool/View/BTWaitView";
import Config from "../Tool/Config";
import MoreMessage from './Item/MoreMessage'

class FollowListMe extends Component{
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
            headerRight: (
                <Text
                    style={{
                        color: '#046FDB',
                        fontSize: 16,
                        paddingRight: 24,
                        fontWeight: 'bold'
                    }}
                   />
            ),
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('my.my_follow_me_count')}</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }

    constructor(props) {
        super(props);
        this.mobile = props.navigation.getParam('mobile')
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
        this.fansData(this.state.page)
        devlog(this.props,'hhhh')
    }
    //初始数据源 数据
    fansData(page) {

        const { page_size,mobile,myMobile } = this.state
        this.props.dispatch({
        type: REQUEST_UPDATE_FOLLOW_LIST,
        payload: { page, page_size, type:1,mobile }
        })

    }

    // 点击关注 && 取消关注
    _onPressFollow(member_id, isFollow) {
        const { mobile,myMobile } = this.state
    
        //个人画像
        if (isFollow) {
          this.props.dispatch({
            type: REQUEST_DO_CANCEL_FOLLOW,
            payload: { from: member_id,is_follow:false,mobile,myMobile,isFollowMe:true}
          })
          DeviceEventEmitter.emit('FANSLIST_POST');
        } else {
          this.props.dispatch({
            type: REQUEST_DO_ADD_FOLLOW,
            payload: { from: member_id,is_follow:true,mobile,myMobile,isFollowMe:true}
          })
          DeviceEventEmitter.emit('FANSLIST_POST');
        }

    }

    renderFooter() {
        return this.props.page == this.props.page_count ||
            !this.props.data.length ? null : (
            <MoreMessage onPress={() => this.handleLoadMoreMessage()} />
    )
      
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
            payload: { data, page: parseInt(page) + 1, page_size,type:1,mobile }
        })
      
    }
    render() {
        const {data, } = this.props;
        devlog('render',data)
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
                    key="FansListPage"
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
                        {I18n.t('followList.no_fans_tip1')}
                    </Text>
                    {/* <Text style={{ color: '#D1D5DD', fontSize: 12, marginTop: 16 }}>
                        {I18n.t('followList.no_follow_tip2')}
                    </Text>
                    <Text style={{ color: '#D1D5DD', fontSize: 12 }}>
                        {I18n.t('followList.no_follow_tip3')}
                    </Text> */}
                </View>
            ),
            <BTWaitView
                title={I18n.t('tip.wait_text')}
                show={ false}
            />
        ]
    }
}

function mapStateToProps({myState}){
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators(MyfansAction, dispatch)
}

export default connect(mapStateToProps)(FollowListMe)