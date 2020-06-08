import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, DeviceEventEmitter,FlatList} from 'react-native';
import NavStyle from "../../Tool/Style/NavStyle";
import I18n from "../../Tool/Language";

//redux组件
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'

import {
    REQUEST_UPDATE_FOLLOW_LIST,
    REQUEST_APPEND_FOLLOW_LIST,
    REQUEST_DO_CANCEL_FOLLOW,
    REQUEST_DO_ADD_FOLLOW,
      REQUEST_CHECK_IS_FOLLOW
  } from '../../Redux/Actions/ActionsTypes'
import * as MyfansAction from '../../Redux/Actions/MyfansAction'


import UserInfo from '../../Tool/UserInfo'

import BTFetch from '../../Tool/NetWork/BTFetch'
import {getRequestBody, devlog} from "../../Tool/FunctionTool";
import {Toast} from "antd-mobile-rn";
import Item from "./FollowListItem";
import BTWaitView from "../../Tool/View/BTWaitView";
import Config from "../../Tool/Config";
import MoreMessage from './MoreMessage'

class BlackList extends Component{
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
            headerTitle: <Text style={NavStyle.navTitle}>黑名单</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }

    constructor(props) {
        super(props);
        this.mobile = props.navigation.getParam('mobile')
        this.state = {
            data:[],
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
        this.blackList(this.state.page)
    }

    blackList(page) {
        const { page_size,mobile,myMobile } = this.state
        let body = {
            // page,
            // page_size,
            // mobile
          }
          let requestBody = getRequestBody(body)
          devlog({requestBody})

          BTFetch('/black/blackList', requestBody)
            .then(res => {
                devlog({res})
              if (res.code === '0') {
                this.setState({
                    data:res.data,
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

    

    // 点击关注 && 取消关注
    _onPressFollow(member_id, isFollow) {
        const { mobile,myMobile,data } = this.state
    
        let body = {
            from: member_id,
            handle: 2 // 1 拉黑 2 解封
          }
          let requestBody = getRequestBody(body)
          BTFetch('/black/addBlack', requestBody)
            .then(res => {
            //   devlog({res,value})
              if (res.code === '0') {
                // this.setState(preState=>({
                //   isAddBlack:!preState.isAddBlack,
                // }))
                let source =data.slice()
                let newData = source.filter((value,index)=>value.member_id!=member_id)
                // devlog(source)
                this.setState(preState=>({
                    data:newData
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
        page < page_count && this.blackList(parseInt(page) + 1)
        

      
    }
    render() {
        const{ data } = this.state;
        return [
            data && !!data.length ? (
                <FlatList
                    ListFooterComponent={() => this.renderFooter()}
                    data={data}
                    renderItem={({ item }) => (
                        <Item
                            data={item}
                            onPress={value => this.handleNavigateToPortrayal(value)}
                            onPressFollow={(member_id, isFollow) => {
                                this._onPressFollow(member_id, isFollow)
                            }}
                            isText={true}
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
                        source={require('../../BTImage/My/my_follow_list_bg.png')}
                    />
                    <Text style={{ color: '#8395A7', fontSize: 16, marginTop: 32 }}>
                        {/* {I18n.t('followList.no_fans_tip1')} */}
                            您暂无黑名单成员
                    </Text>
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

export default connect(mapStateToProps)(BlackList)