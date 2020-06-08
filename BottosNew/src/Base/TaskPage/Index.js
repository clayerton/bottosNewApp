import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
  DeviceEventEmitter,
  FlatList
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'

import BTFetch from '../../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import {
  clearMapForKey,
  setLocalStorage,
  getRequestBody,
  getLocalStorage,
  devlog,
  getRequestURL,
  getImageURL
} from '../../Tool/FunctionTool'
import BTWaitView from '../../Tool/View/BTWaitView.config'
import NavStyle from '../../Tool/Style/NavStyle'
import TaskList from './Item/TaskList'
import Config from '../../Tool/Config'
import I18n from '../../Tool/Language'
import Swiper from 'react-native-swiper'
import UserInfo from '../../Tool/UserInfo'

//判断显示助力金提示框 90天后不显示
const regdate = UserInfo.regdate
const nowdate = Date.parse(new Date()) / 1000
const isModelTime = 3600 * 24 * 90
const isModelTimeShow = nowdate - regdate - isModelTime

//  区域颜色渐变

// 组件*/
const { height } = Dimensions.get('window')
export default class TaskPage extends Component {
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
      headerRight: <Text style={NavStyle.rightButton}> </Text>,
      headerTitle: (
        <Text style={NavStyle.navTitle}>{I18n.t('task.task_title')}</Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      isSign: false, // 是否签到
      isVerified: false, // 是否实名认证
      isAdvancedVerified: false, //是否高级实名认证
      isBindEthAddress: false, // 是否绑定以太网钱包
      isBoostingGold: false, // 是否领取助力金
      DataCollectionList: [], // 数据采集
      DataReviewList: [], // 数据审核
      WankrRegister:[],//社区共建
      taskListData: {
        limitTask: { title: I18n.t('task.task_limited'), data: [] },
        normalTask: { title: I18n.t('task.task_daily'), data: [] },
        specialTask: { title: I18n.t('task.task_special'), data: [] }
      },
      taskListDataArr: [],
      imageSize: [], //任务广告大小
      adArray: [],
      isModelShow: false, //是否显示助力金弹框
      isModelShowBoost: '',
      areaColor: [
        ['rgb(111,99,243)', 'rgb(98,166,247)'],
        ['rgb(255,117,158)', 'rgb(255,164,133)'],
        ['rgb(135,91,198)', '#ba67d4']
      ]
    }
  }
  componentDidMount() {
      //广告
      this.adInit()

    // 获取任务列表
    this.fetchTaskList()
    // 每日签到状态
    this.memberSignStatus()

    //  是否实名认证
    this.ifverified()

    // 绑定以太网钱包 状态
    this.bindEthAddressStatus()

    //高级实名认证状态
    this.photoCertificationStatus()

    //领取助力金
    this.BoostingGoldStatus()
  }

  componentWillReceiveProps(nextProps) {
  }

  //广告资源通知
  adInit = () => {
    for (let i = 0; i < UserInfo.adArray.length; i++) {
      let ads = UserInfo.adArray[i]
      if (ads.flag === 'job_page_ad' && ads.status === 1) {
          if (ads.ad !== null && ads.ad != undefined){
              this.setState({
                  adArray:ads.ad,
              })
          }
      }
    }
  }

  onClickAd(url) {
    if (url && url.length > 0) {
      this.props.navigation.navigate('BTPublicWebView', {
        url: url,
        navTitle: I18n.t('tip.ad_title')
      })
    }
  }

  onPressTaskItem(title, id) {
    devlog(title, id)
    // 每日签到
    id === 1 && this.signIn()
    // 邀请好友
    id === 2 && this.invite()

    id === 6 && this.isVerified() // 跳转实名认证

    //领取助力金
    id === 14 && this.BoostingGold()

    id === 7 && this.isBindEthAddress()

    //高级实名认证
    id === 15 && this.isAdvancedVerified()

    id === 8 &&
      this.props.navigation.navigate('DataCollection', {
        data: this.state.DataCollectionList,
        task_id: id,
        navTitle:'数据采集'  
      }) // 跳转数据采集

    id === 9 &&
      this.props.navigation.navigate('DataReview', {
        data: this.state.DataReviewList,
        task_id: id
      }) // 跳转数据审核

      //  社区共建
      id === 19 &&
      this.props.navigation.navigate('DataCollection',{
        data:this.state.WankrRegister,
        task_id: id,
        navTitle:'社区共建'  
      })


  }

  bindEthAddressGoBack(self) {
    self.bindEthAddressStatus()
  }
  isVerified() {
    if (this.state.isVerified) {
      this.props.navigation.navigate('Realinfomation')
    } else {
      this.props.navigation.navigate('Verified')
    }
  }
  isBindEthAddress() {
    if (this.state.isBindEthAddress) {
      this.props.navigation.navigate('EthAddress')
    } else {
      this.props.navigation.navigate('BindEthAddress', {
        self: this,
        bindEthAddressGoBack: this.bindEthAddressGoBack
      }) // 跳转绑定以太网钱包
    }
  }

  //高级实名认证
  isAdvancedVerified() {
    if (!this.state.isVerified) {
      Toast.info(
        I18n.t('advanced.invite_before'),
        Config.ToestTime,
        null,
        false
      )
      return
    }
    // devlog(this.state.isVerified,this.state.isAdvancedVerified )
    if (this.state.isAdvancedVerified) {
      Toast.info(
        I18n.t('task.task_advanced_finish'),
        Config.ToestTime,
        null,
        false
      )
      return
    }

    let options = {
      callback: () => {
        this.photoCertificationStatus()
      }
    }
    this.props.navigation.navigate('AdvancedVerified', options)
  }

  // 判断是否大于24小时，方能邀请
  invite() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/recommend/getRecommendSn', requestBody)
      .then(res => {
        const { code, msg, data } = res
        if (code === '0') {
          this.props.navigation.navigate('Invite', {
            data
          })
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail('网络异常，请稍后重试',Config.ToestTime,null,false);
      })
  }

  // 每日签到
  signIn() {
    if (this.state.isSign) {
      Toast.info(
        I18n.t('task.task_signIn_finish'),
        Config.ToestTime,
        null,
        false
      )
      return
    }
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/member/memberSign', requestBody)
      .then(res => {
        const { code, msg } = res
        if (code === '0') {
          Toast.info(msg, Config.ToestTime, null, false)
          this.setState({
            isSign: true
          })
        } else if (res.code === '99') {
          Toast.info(msg, Config.ToestTime, null, false)
          this.props.navigation.navigate('Login')
        } else {
          Toast.info(msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail('网络异常，请稍后重试',Config.ToestTime,null,false);
      })
  }

  // 绑定以太网钱包 状态
  bindEthAddressStatus() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/member/getEthAddressStatus', requestBody)
      .then(res => {
        const { code, data } = res
        if (code === '0') {
          data === '1' &&
            this.setState({
              isBindEthAddress: true // 是否绑定以太网钱包 状态
            })
          data === '0' &&
            this.setState({
              isBindEthAddress: false // 是否绑定以太网钱包 状态
            })
        } else if (res.code === '99') {
          Toast.info(res.msg, Config.ToestTime, null, false)
          this.props.navigation.navigate('Login')
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail('网络异常，请稍后重试',Config.ToestTime,null,false);
      })
  }

  // 每日签到状态
  memberSignStatus() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/member/memberSignStatus', requestBody)
      .then(res => {
        const { code, data } = res
        if (code === '0') {
          this.setState({
            isSign: !data // 是否签到
          })
        } else if (res.code === '99') {
          Toast.info(res.msg, Config.ToestTime, null, false)
          this.props.navigation.navigate('Login')
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail('网络异常，请稍后重试',Config.ToestTime,null,false);
      })
  }

  //领取助力金状态
  BoostingGold() {
    if (this.state.isBoostingGold) {
      Toast.info(
        I18n.t('task.task_BoostingGold_finish'),
        Config.ToestTime,
        null,
        false
      )
      return
    }
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/member/getInviteeFruit', requestBody)
      .then(res => {
        const { code, msg } = res
        devlog(res, '领取助力金状态')
        if (code === '0') {
          isModelTimeShow > 0
            ? Toast.info(msg, Config.ToestTime, null, false)
            : this.setState({
                isModelShow: true,
                isModelShowBoost: msg
              })
        } else if (res.code === '99') {
          Toast.info(msg, Config.ToestTime, null, false)
          this.props.navigation.navigate('Login')
        } else {
          // Toast.info(msg, Config.ToestTime, null, false)
          isModelTimeShow > 0
            ? Toast.info(msg, Config.ToestTime, null, false)
            : this.setState({
                isModelShow: true,
                isModelShowBoost: ''
              })
        }
      })
      .catch(res => {
          Toast.fail('网络异常，请稍后重试',Config.ToestTime,null,false);
      })
  }

  //查看领取助力金状态
  BoostingGoldStatus() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/member/getInviteeStatus', requestBody)
      .then(res => {
        const { code, data } = res
        if (code === '0') {
          this.setState({
            isBoostingGold: !data // 是否领取助力金
          })
        } else if (res.code === '99') {
          Toast.info(res.msg, Config.ToestTime, null, false)
          this.props.navigation.navigate('Login')
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail('网络异常，请稍后重试',Config.ToestTime,null,false);
      })
  }

  //是否高级实名认证
  photoCertificationStatus() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/member/photoCertificationStatus', requestBody)
      .then(res => {
        const { code, data } = res
        // devlog(res,'高级实名认证')
        if (code === '0') {
          if (data === 1) {
            this.setState({
              isAdvancedVerified: true // 是否高级认证
            })
          }
        } else if (res.code === '99') {
          Toast.info(res.msg, Config.ToestTime, null, false)
          this.props.navigation.navigate('Login')
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail('网络异常，请稍后重试',Config.ToestTime,null,false);
      })
  }

  //  是否实名认证
  ifverified() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTFetch('/member/certificationInfo', requestBody)
      .then(res => {
        const { code, data } = res
        if (code === '0') {
          this.setState({
            isVerified: true // 是否签到
          })
        } else if (res.code === '99') {
          Toast.info(res.msg, Config.ToestTime, null, false)
          this.props.navigation.navigate('Login')
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          Toast.fail('网络异常，请稍后重试',Config.ToestTime,null,false);
      })
  }

  // 获取任务列表
  fetchTaskList() {
    let body = {}
    let requestBody = getRequestBody(body)
    BTWaitView.show(I18n.t('tip.wait_text'))
    BTFetch('/task/taskList', requestBody)
      .then(res => {
        const { code, data } = res
        BTWaitView.hide()

        if (code === '0') {
          devlog(res, '任务列表')
          const { limitTask } = data
          for (let index = 0; index < limitTask.length; index++) {
            const element = limitTask[index]
            element.task_id === 8 &&
              this.setState({
                DataCollectionList: element.sub
              })
            element.task_id === 9 &&
              this.setState({
                DataReviewList: element.sub
              })
              element.task_id === 19 && 
                this.setState({
                  WankrRegister: element.sub
                })
          }
          this.setState({
            taskListDataArr: this.createNewTaskListData(data)
          })

        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
          BTWaitView.hide();
          Toast.fail('网络异常，请稍后重试',Config.ToestTime,null,false);
      })
  }

  // 生成新的 Data
  createNewTaskListData(data) {
    const newData = []
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key]
        const newObj = {}
        newObj = this.state.taskListData[key]
        newObj.data = element
        newObj.key = key
        newData.push(newObj)
      }
    }
    return newData
  }

  isDisabled(id) {
    const {
      isSign,
      isVerified,
      isBindEthAddress,
      isBoostingGold,
      isAdvancedVerified
    } = this.state

    if (id === 1 && isSign) {
      return true
    }
    if (id === 6 && isVerified) {
      return true
    }
    if (id === 7 && isBindEthAddress) {
      return true
    }
    if (id === 14 && isBoostingGold) {
      return true
    }
    if (id === 15 && isAdvancedVerified) {
      return true
    }
    return false
  }
  idNormalTask(id, value, type) {
    const { isSign } = this.state
    if (id === 1 && isSign) {
      return `${I18n.t('task.task_signed_day')}+${Number(value)}${type}`
    } else {
      return `${I18n.t('task.task_sign_day')}+${Number(value)}${type}`
    }
  }
  idNormalGold(id) {
    const { isBoostingGold } = this.state
    if (id === 14 && isBoostingGold) {
      return I18n.t('task.task_boost_golded')
    } else {
      return I18n.t('task.task_boost_gold')
    }
  }
  //任务图标
  renderNormalImage(id) {
    const { isVerified, isBindEthAddress, isAdvancedVerified } = this.state
    switch (id) {
      case 1:
        return require('../../BTImage/Base/Task/task_daily_sign.png')
      case 14:
        return require('../../BTImage/Base/Task/task_boosting_gold.png')
        case 19:
        return require('../../BTImage/Base/Task/base_cummunity_build.png')
      case 2:
        return require('../../BTImage/Base/Task/task_invite_friend.png')
      case 8:
        return require('../../BTImage/Base/Task/task_collection_icon.png')
      case 9:
        return require('../../BTImage/Base/Task/task_review_icon.png')
      case 6:
        return isVerified
          ? require('../../BTImage/Base/Task/task_verifie_finish.png')
          : require('../../BTImage/Base/Task/task_verifie.png')
      case 7:
        return isBindEthAddress
          ? require('../../BTImage/Base/Task/task_wallet_bind_finish.png')
          : require('../../BTImage/Base/Task/task_wallet_bind.png')
      case 15:
        return isAdvancedVerified
          ? require('../../BTImage/Base/Task/task_advancedVerified_finish.png')
          : require('../../BTImage/Base/Task/task_advancedVerified.png')
      default:
        return null
    }
  }
  areaColor(id) {
    switch (id) {
      case 1:
        return this.state.areaColor[0]
      case 14:
        return this.state.areaColor[1]
      case 2:
        return this.state.areaColor[2]
      default:
        return this.state.areaColor[0]
    }
  }
  //  日常任务样式
  rendernormalTask(data) {
    return (
      <FlatList
        keyExtractor={item => item.task_name}
        horizontal={true}
        data={data.data}
        extraData={this.state}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                this.onPressTaskItem(item.task_name, item.task_id)
              }}>
              {/* 区域颜色渐变 */}
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                colors={this.areaColor(item.task_id)}
                style={{
                  backgroundColor: '#6d70f4',
                  width: 160,
                  height: 85,
                  marginRight: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#DFEFFE',
                  borderRadius: 5
                }}>
                <Image
                  style={{
                    width: 28,
                    height: 28,
                    marginLeft: 13,
                    marginRight: 11
                  }}
                  source={this.renderNormalImage(item.task_id)}
                />
                <View>
                  <Text
                    style={[
                      {
                        lineHeight: 14,
                        fontSize: 13,
                        color: '#ffffff',
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                        shadowOffset: {
                          width: 0,
                          height: 0
                        },
                        shadowRadius: 3,
                        shadowOpacity: 1
                      }
                    ]}>
                    {item.task_name}
                  </Text>

                  <Text
                    style={{
                      fontFamily: 'PingFang-SC-Medium',
                      fontSize: 11,
                      color: '#ffffff',
                      shadowColor: 'rgba(0, 0, 0, 0.2)',
                      shadowOffset: {
                        width: 0,
                        height: 0
                      },
                      shadowRadius: 3,
                      shadowOpacity: 1,
                      paddingTop: 6
                    }}>
                    {item.task_id === 1 &&
                      this.idNormalTask(
                        item.task_id,
                        item.gift_value,
                        item.currency_name
                      )}
                    {item.task_id === 14 &&
                      this.idNormalGold(
                        item.task_id,
                        item.gift_value,
                        item.currency_name
                      )}
                    {item.task_id === 2 &&
                      `${I18n.t('task.task_receive')}+${Number(
                        item.gift_value
                      )}${item.currency_name}`}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )
        }}
      />
    )
  }

  //限时 特殊任务
  renderNormal(data, isShow) {
    const { isVerified, } = this.state
    
    return (
      <FlatList
        keyExtractor={item => item.task_name}
        horizontal={true}
        data={data.data}
        extraData={this.state}
        renderItem={({ item }) => {
          
          return (
              item.task_id === 15 && !isVerified ? 
              <TouchableOpacity
              activeOpacity={0.5}
              style={{
                backgroundColor: '#fff',
                width: 99,
                height: isShow ? 108 : 93,
                marginRight: 16,
                flexDirection: 'column',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#DFEFFE',
                borderRadius: 4
              }}
              onPress={() => {
                this.onPressTaskItem(item.task_name, 6)
              }}>
              <Image
                style={{
                  width: 43,
                  height: 43,
                  marginTop: 13,
                  marginBottom: 13
                }}
                source={this.renderNormalImage(6)}
              />
              <View>
                <Text
                  style={[
                    {
                      lineHeight: 12,
                      fontSize: 12,
                      color: '#46536e',
                      textAlign: 'center'
                    }
                  ]}>
                  {/* {item.task_name} */}
                  {I18n.t('task.task_isVerified')}
                </Text>
                {isShow ? (
                  <Text
                    style={[
                      {
                        lineHeight: 12,
                        fontSize: 11,
                        color: '#46536e',
                        marginTop: 5,
                        textAlign: 'center'
                      }
                    ]}>
                    {this.isDisabled(6)
                      ? I18n.t('task.task_received')
                      : I18n.t('task.task_receive') + '+'}
                    {Number(item.gift_value)} {item.currency_name}
                  </Text>
                ) : null}
              </View>
          </TouchableOpacity>
                :
                <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  backgroundColor: '#fff',
                  width: 99,
                  height: isShow ? 108 : 93,
                  marginRight: 16,
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#DFEFFE',
                  borderRadius: 4
                }}
                onPress={() => {
                  this.onPressTaskItem(item.task_name, item.task_id)
                }}>
                <Image
                  style={{
                    width: 43,
                    height: 43,
                    marginTop: 13,
                    marginBottom: 13
                  }}
                  source={this.renderNormalImage(item.task_id)}
                />
                <View>
                  <Text
                    style={[
                      {
                        lineHeight: 12,
                        fontSize: 12,
                        color: '#46536e',
                        textAlign: 'center'
                      }
                    ]}>
                    {item.task_name}
                  </Text>
                  {isShow ? (
                    <Text
                      style={[
                        {
                          lineHeight: 12,
                          fontSize: 11,
                          color: '#46536e',
                          marginTop: 5,
                          textAlign: 'center'
                        }
                      ]}>
                      {this.isDisabled(item.task_id)
                        ? I18n.t('task.task_received')
                        : I18n.t('task.task_receive') + '+'}
                      {Number(item.gift_value)} {item.currency_name}
                    </Text>
                  ) : null}
                </View>
            </TouchableOpacity>
            
          )
        }}
      />
    )
  }

  _renderTaskList(data) {
    // devlog(data,'datsa')
    return (
      <View
        style={{
          marginLeft: 12,
          marginRight: 12
        }}>
        <Text
          style={{
            marginTop: 16,
            marginBottom: 16,
            color: '#46536e',
            fontSize: 14,
            fontFamily: 'PingFang-SC-Medium'
          }}>
          {data.title}
        </Text>
        {data.key === 'normalTask' ? this.rendernormalTask(data) : null}
        {data.key === 'limitTask' ? this.renderNormal(data, false) : null}
        {data.key === 'specialTask' ? this.renderNormal(data, true) : null}
      </View>
    )
  }
  //关闭助力金弹框
  onClickModelClose() {
    devlog(this.state.isModelShow)
    this.setState({
      isModelShow: false
    })
  }
  onClickModelFriend() {
    this.invite()
    this.setState({
      isModelShow: false
    })
  }
  render() {
    let swiperWidth = UserInfo.screenW
    let swiperHeight = (swiperWidth / 5) * 2

    return (
      <ScrollView
        ref="scrollView"
        keyboardShouldPersistTaps="always"
        style={[NavStyle.container, { position: 'relative' }]}>
        {this.state.adArray&&this.state.adArray.length > 0 ? (
          <View style={styles.swiperSuper}>
            <Swiper
              style={{ height: swiperHeight + 16 }}
              showsButtons={false}
              loop={true}
              showsPagination={true}
              autoplay={true} //自动轮播
              autoplayTimeout={4} //每隔4秒切换*/
              paginationStyle={{ bottom: 3 }}
              dotStyle={{
                backgroundColor: '#9B9B9B',
                width: 3,
                height: 3,
                borderRadius: 4
              }}
              activeDotStyle={{
                backgroundColor: '#000000',
                width: 3,
                height: 3,
                borderRadius: 4
              }}>
              {this.state.adArray.map((value, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.onClickAd(value.url)}
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      style={{
                        backgroundColor: '#ffffff',
                        height: swiperHeight,
                        width: swiperWidth,
                        resizeMode: Image.resizeMode.contain
                      }}
                      source={{ uri: getImageURL(value.file)}}
                    />
                  </TouchableOpacity>
                )
              })}
            </Swiper>
          </View>
        ) : (
          <View style={{ marginTop: 16 }} />
        )}

        <FlatList
          data={this.state.taskListDataArr}
          keyExtractor={item => item.key}
          extraData={this.state}
          renderItem={({ item }) => this._renderTaskList(item)}
        />
        <View style={{ marginTop: 16 }} />
        {this.state.isModelShow ? (
          <View style={styles.model}>
            <View
              style={[
                styles.modelImage,
                { position: 'relative', marginTop: -50 }
              ]}>
              <TouchableOpacity
                style={styles.modelClose}
                onPress={() => this.onClickModelClose()}
              />
              {!this.state.isModelShowBoost ? (
                <View style={styles.modelInfo}>
                  <Text style={styles.modelInfoText} />
                  <Text
                    style={[
                      styles.modelInfoText,
                      { fontSize: 14, lineHeight: 24, fontWeight: 'bold' }
                    ]}>
                    {this.state.isModelShowBoost}
                  </Text>
                </View>
              ) : (
                <View style={styles.modelInfo}>
                  <Text style={styles.modelInfoText}>
                    {I18n.t('task.task_regret')}
                  </Text>
                  <Text
                    style={[
                      styles.modelInfoText,
                      { fontSize: 14, lineHeight: 24, fontWeight: 'bold' }
                    ]}>
                    {I18n.t('task.task_regret_no')}
                  </Text>
                </View>
              )}
              <Image
                style={styles.modelImage}
                source={require('../../BTImage/Base/Task/base_task_model.png')}
              />
              <TouchableOpacity
                style={styles.modelButton}
                onPress={() => this.onClickModelFriend()}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: '#f7f8fa'
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
  model: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    width: UserInfo.screenW,
    height: UserInfo.screenH,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modelImage: {
    width: 300,
    height: (724 / 530) * 300
  },
  modelClose: {
    position: 'absolute',
    width: 80,
    height: 80,
    right: 0,
    zIndex: 99
  },
  modelButton: {
    width: 300,
    height: 50,
    position: 'absolute',
    bottom: 0
  },
  modelInfo: {
    position: 'absolute',
    top: 130,
    width: 300,
    zIndex: 99
  },
  modelInfoText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    lineHeight: 12
  }
})
