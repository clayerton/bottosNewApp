import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native'
import BTFetch from '../../../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import {
  clearMapForKey,
  setLocalStorage,
  getRequestBody,
  getLocalStorage,
  devlog
} from '../../../Tool/FunctionTool'
import BTWaitView from '../../../Tool/View/BTWaitView.config'
import NavStyle from '../../../Tool/Style/NavStyle'
import Config from '../../../Tool/Config'
import LongButton from '../../../Tool/View/BTButton/LongButton'



import I18n from "../../../Tool/Language";
import UserInfo from "../../../Tool/UserInfo";
import ReportDataList from "../TaskPageDetails";


// 组件
export default class DataReview extends Component {
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
      headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('review.review_title')}</Text>,
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)

      const { data,task_id } = this.props.navigation.state.params

    this.state = {
      data: data,
        task_id:task_id,

    }
      props.navigation.setParams({
          commitPage: this.commitPage
      })
  }

  ImageBgUrl = taskId => {
    let imageUrl = null
    // 手写体
    taskId === 11 &&
      (imageUrl = require('../../../BTImage/Base/DataCollectionReview/base_task_data_collection_group2.png'))
    // 数据采集任务
    taskId === 5 &&
      (imageUrl = require('../../../BTImage/Base/DataCollectionReview/base_task_data_collection_group1.png'))
      taskId ===16 &&
      (imageUrl = require('../../../BTImage/Base/DataCollectionReview/base_task_data_collection_group1.png'))

      taskId === 18 &&
      (imageUrl = require('../../../BTImage/Base/DataCollectionReview/base_task_data_collection_group2.png'))
    return imageUrl
  }

    //跳转到任务记录列表
    commitPage=()=>{
        this.props.navigation.navigate('ReportDataList',{task_id:this.state.task_id})
    }


  componentDidMount() {
    this.state.data.map((v, i) => {
      this.fecthStatus(v)
    })
  }

  onPressLinkIntro(value) {
    this.props.navigation.navigate('BTPublicWebView', {
      url: value,
      navTitle: I18n.t('dataCollection.hand_written_navigation_title')
    })
  }
  //状态
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
          value['status'] = res.data
          this.setState({
            data: this.state.data
          })
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.hide()
          Toast.info(res.msg, Config.ToestTime, null, false)
        }

      })
      .catch(res => {
          Toast.hide()
          Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
      })
  }

// 创建按钮上的文字
    createStatusStr = status => {
        let str = ''
        status === -1 && (str = I18n.t('dataCollection.hand_start'))
        status === 0 && (str = I18n.t('dataCollection.hand_already_end'))
        status === 1 && (str = I18n.t('dataCollection.hand_already_check'))
        status === 2 && (str = I18n.t('dataCollection.hand_already_submit'))
        status === 3 && (str = I18n.t('dataCollection.hand_already_audit'))
        status === 4 && (str = I18n.t('dataCollection.hand_already_notpass'))
        status === 5 && (str = I18n.t('dataCollection.hand_already_pass'))

        return str
    }
    // 点击开始任务
    _onPress(id) {

      let body = {
          task_id:id,
      }
      devlog(id,'id')
       let requestBody = getRequestBody(body)
        BTWaitView.show(I18n.t('tip.wait_text'))
        BTFetch('/review/memberReview', requestBody)
          .then(res => {
            BTWaitView.hide()
            devlog(res)
            if (res.code === '0') {
              const { data } = res
              let options = {
                data,
                callback: task_id => {
                  this.fecthStatus(task_id)
                }
              }
              this.props.navigation.navigate('DataReviewList', options)
            } else if (res.code === '99') {
              DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
            } else {
              Toast.hide()
              Toast.info(res.msg, Config.ToestTime, null, false)
            }
          })
          .catch(res => {
              Toast.hide()
              Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
          })
     }

  render() {
    const { data } = this.state
    return (

        <ScrollView
            ref="scrollView"
            keyboardShouldPersistTaps="always"
            style={NavStyle.container}>
            <View style={styles.itemBg}>
                <Image
                    style={{ width: 50, height: 16,marginLeft:4, }}
                    source={require('../../../BTImage/Base/DataCollectionReview/base_task_ic_data_collection.png')}
                />
                <Text style={{ color: '#000000', fontSize: 16 }}>{I18n.t('dataCollection.friendly_reminder')}</Text>
                <Text style={[styles.fontStyleContent, { marginTop: 5 }]}>
                    {I18n.t('dataCollection.collection_explain1')}
                </Text>
                <Text style={styles.fontStyleContent}>{I18n.t('dataCollection.collection_explain2')}</Text>
                <Text style={styles.fontStyleContent}>
                    {I18n.t('dataCollection.collection_explain3')}
                </Text>
                <Text style={styles.fontStyleContent}>
                    {I18n.t('dataCollection.collection_explain4')}
                </Text>
                <Text style={styles.fontStyleContent}>
                    {I18n.t('dataCollection.collection_explain5')}
                </Text>
            </View>
            {data &&
            data.map((v,i) => {
                let achievers = 0;
                let doing = 0;
                let tasklimits = 0;
                if(v.hasOwnProperty('status')){
                    achievers = v.status.achievers;
                    doing = v.status.doing;
                    tasklimits = v.status.tasklimits;
                }
                return (
                    <View style={styles.Bg} key={i}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between',paddingLeft:24,paddingRight:24, }}>
                            <Text style={{ color: '#353B48', fontSize: 16,fontWeight:'bold'  }}>{v.task_name}</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                <Text style={{ color: '#596379 ', fontSize:12, }}>{I18n.t('dataCollection.hand_surplus')}</Text>
                                <Text style={{ color: '#046FDB',fontSize:12,  }}>
                                    {achievers + doing}/{tasklimits}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.onPressLinkIntro(v.link_intro)
                            }}>
                            <ImageBackground
                                style={{
                                    width: (UserInfo.screenW - 64),
                                    height: (UserInfo.screenW - 64) * 119 / 311,
                                    marginTop: 8,
                                    marginBottom: 12,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf:'center'
                                }}
                                source={this.ImageBgUrl(v.task_id)}>
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight:'bold'  }}>{I18n.t('dataCollection.hand_explain1')}</Text>
                                <Text style={{ color: '#fff', marginTop: 16 }}>{I18n.t('dataCollection.hand_explain2')}</Text>
                                <Text style={styles.task_image_text}>{I18n.t('dataCollection.hand_explain3')}</Text>
                                <Text style={styles.task_image_text}>················</Text>
                            </ImageBackground>
                        </TouchableOpacity>

                        <View style={styles.dataContentTouch}>
                            <View style={styles.dataContentTouchView}>
                                <Text style={styles.dataContentReward}>{I18n.t('dataCollection.hand_award')}:</Text>
                                <Text style={[styles.dataRewardText]}>{parseInt(v.gift_value)}</Text>
                                <Text style={[styles.dataRewardText]}>{v.currency_name}</Text>
                            </View>

                            <LongButton
                                onPress={() => {
                                    this._onPress(v.task_id)
                                }}
                                style={{ width: 99, height: 32 }}
                                textStyle={{height:32,lineHeight:32,fontSize:13,}}
                                title={this.createStatusStr(v.status && v.status.status)}
                            />
                        </View>
                    </View>
                )
            })}
        </ScrollView>


    )
  }
}

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: '#046FDB'
  },
  itemBg: {
      backgroundColor: '#FFFFFF',
      margin: 8,
      paddingTop: 16,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 3,
      borderWidth:1,
      borderColor: '#DFEFFE',
  },
  taskItem: {
    backgroundColor: '#fff',
    width: 109,
    height: 114
  },
  taskItemIcon: {
    width: 40,
    height: 40
  },
  taskItemTitle: {
    color: '#596379',
    fontSize: 13
  },
  fontStyleContent: {
      color: '#596379',
      fontSize: 12,
      lineHeight:18
  },
    Bg: {
        backgroundColor: '#FFFFFF',
        margin: 8,
        paddingTop: 16,
        paddingBottom: 8,
        borderRadius: 3,
        borderWidth:1,
        borderColor: '#DFEFFE',
    },
    dataContentTouch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#EFF0F3',
        borderTopWidth: 1,
        paddingTop: 10,
        paddingRight:24,
        paddingLeft:24,
    },
    dataContentReward: {
        lineHeight: 24,
        fontSize: 16,
        color: '#596379',
        paddingRight:16,
        fontWeight:'bold',
    },
    dataRewardText: {
        color: 'red',
        lineHeight: 24,
        fontSize: 16,
        paddingRight:3,
        fontWeight:'bold',
    },
    dataContentTouchView:{
        flexDirection:'row',
    },
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
    task_image_text:{
        color: '#fff',
        lineHeight:17,
        fontSize:12,
    },

})
