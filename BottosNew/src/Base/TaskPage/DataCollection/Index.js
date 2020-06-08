import React, { Component } from 'react'
import { Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import BTFetch from '../../../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import { getRequestBody, devlog } from '../../../Tool/FunctionTool'

import BTWaitView from '../../../Tool/View/BTWaitView.config'
import NavStyle from '../../../Tool/Style/NavStyle'
import Config from '../../../Tool/Config'
import I18n from '../../../Tool/Language'

// 组件
import TipTitle from './Item/TipTitle'
import MissionCard from './Item/MissionCard'
export default class DataCollection extends Component {
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
            source={require('../../../BTImage/navigation_back.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => state.params.commitPage()}
          style={styles.rightButton}>
          <Text style={styles.rightText}>{I18n.t('dataCollection.hand_written_navigation_title')} </Text>
      </TouchableOpacity>,
      headerTitle: <Text style={NavStyle.navTitle}>{state.params.navTitle}</Text>,
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    
    this.task = this.props.navigation.state.params.data
      this.task_id = this.props.navigation.state.params.task_id
    this.state = {
        data: this.task || [],
        task_id:this.task_id,
    }

      props.navigation.setParams({
          commitPage: this.commitPage
      })
  }
  componentDidMount() {
    this.state.data.map((v, i) => {
      this.fecthStatus(v)
    })
  }
  //跳转到任务记录列表
    commitPage=()=>{
        this.props.navigation.navigate('ReportDataList',{task_id:this.state.task_id})
    }
  // 请求按钮状态
  fecthStatus(value) {
    let body = {
      task_id: value.task_id
    }
    let requestBody = getRequestBody(body)
    //BTWaitView.show(I18n.t('tool.wait_text'))
    BTFetch('/task/getMemberTaskStatus', requestBody)
      .then(res => {
       // BTWaitView.hide()
        if (res.code === '0') {
            // devlog(res.data,'res.data')
          // value['status'] = res.data
            this.state.data.filter((v,i)=>{
                if(v.task_id === value.task_id ){
                    v.status = res.data;
                }
            });
          this.setState({
            data: this.state.data
          },()=>{
              // devlog(this.state.data,'res.state.data,状态')
          })
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
        BTWaitView.hide()
        Toast.fail(res.msg, Config.ToestTime, null, false)
      })
  }

  onPressLinkIntro(value) {
    this.props.navigation.navigate('BTPublicWebView', {
      url: value,
      navTitle: I18n.t('dataCollection.hand_written_navigation_title')
    })
  }

  _onPress(id) {
    devlog(id,)
      let body = {
          task_id:id,
      }
      let requestBody = getRequestBody(body)
      BTWaitView.show(I18n.t('tip.wait_text'))
      BTFetch('/collection/memberCollection', requestBody)
          .then(res => {
              BTWaitView.hide()
              devlog({res})
              if (res.code === '0') {
                  const {data } = res
                  let options = {
                      data,
                      callback: (task_id) => {
                          this.fecthStatus(task_id);
                      }
                  };
                  // 数据采集任务
                  id === 4 &&
                  this.props.navigation.navigate('PhotoCollection', options)
                  // 手写体采集任务
                  id === 10 &&
                  this.props.navigation.navigate('HandWritten', options)
                  id === 12 &&
                  this.props.navigation.navigate('PhotoCollection', options)
                  // 辨别年份人脸识别
                  id === 17 &&
                  this.props.navigation.navigate('PhotoCollection', options)
                  // 玩客城注册
                  id === 20 &&
                   this.props.navigation.navigate('WankrRegister',options)
              } else if (res.code === '99') {
                  DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
              } else {
                  Toast.info(res.msg, Config.ToestTime, null, false)
              }
          })
          .catch(res => {
              BTWaitView.hide()
              Toast.fail(res.msg, Config.ToestTime, null, false)
          })


    /*// 数据采集任务
    id === 4 &&
      this.props.navigation.navigate('DataCollectionPhotoCollection', {
        task_id: id
      })
    // 手写体采集任务
    id === 10 &&
      this.props.navigation.navigate('DataCollectionHandWritten', {
        task_id: id
      })*/
  }

  render() {
    const { data } = this.state
    // devlog('data ', data)
    return (
      <ScrollView
        ref="scrollView"
        keyboardShouldPersistTaps="always"
        style={[NavStyle.container,{paddingBottom:36}]}>
        {/* <TipTitle /> */}
        {data &&
          data.map(v => {
            return (
              <MissionCard
                {...v}
                onPress={v => {
                  this._onPress(v)
                }}
                onPressLinkIntro={v => {
                  this.onPressLinkIntro(v)
                }}
              />
            )
          })}
      </ScrollView>
    )
  }
}
const styles=StyleSheet.create({
    rightButton: {
        width: 80,
        height: 44,
        marginRight: 0,
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff000f00',
    },
    rightText: {
        lineHeight:44,
        height: 44,
        color: '#046FDB',
        fontSize: 16,
        backgroundColor: '#ff00f000',
    },
});
