import React, { Component } from 'react'
import { connect } from 'react-redux'
import { REQUEST_HOMEPAGE_FORUM_POST_LIST } from '../Redux/Actions/ActionsTypes'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  DeviceEventEmitter,
  TouchableHighlight,
  Modal,
  alert,
  Image,
  Linking
} from 'react-native'
import { Toast } from 'antd-mobile-rn'

import BTBackButton from '../Tool/View/BTBackButton'
import UserInfo from '../Tool/UserInfo'
import Config from '../Tool/Config'
import PublicStyle from '../Tool/Style/NavStyle'
import { fcBlue } from '../Tool/Style/FontStyle'
// 方法
import { requestWithFile } from '../Tool/NetWork/heightOrderFetch'
import throttle from 'lodash-es/throttle'
import {
  devlog,
  isZHLanguage,
  hasEmoji,
  enumerateURLStringsMatchedByRegex
} from '../Tool/FunctionTool'
import I18n from '../Tool/Language'
import {
  setLocalStorage,
  getLocalStorage,
  clearMapForKey
} from '../Tool/FunctionTool'

// 自有组件
import LocalImageAccess from '../Tool/View/LocalImageAccess'
import * as emoticons from '../Tool/View/Emoticons'
import PostPrivacyPolicyItem from './Components/PostPrivacyPolicyItem'

const navigationOptions = ({ navigation }) => {
  const handlePress = navigation.getParam('commitPage')
  return {
    headerLeft: BTBackButton,
    headerRight: (
      <TouchableOpacity onPress={handlePress} style={PublicStyle.rightButton}>
        <Text style={styles.publishButton}>{I18n.t('community.publish')}</Text>
      </TouchableOpacity>
    ),
    headerTitle: I18n.t('community.publish_post')
  }
}

class PostPublish extends Component {
  static displayName = 'PostPublish'
  static navigationOptions = navigationOptions

  constructor(props) {
    super(props)
    const images = props.navigation.getParam('images')
    this.state = {
      images: images ? images : [],
      wordPublish: '',
      visible: false,
      onClickPrivacy: false,
      onClickHint: false,
      isShowPrivacyPolicyView: false,
      disButton: false,
      navigationData: props.navigation.state.params
    }

    const throttledCommit = throttle(this.commitPage, 1000, { trailing: false })

    props.navigation.setParams({
      commitPage: throttledCommit
    })
    this.props.navigation.push.bind(this.props.navigation)
  }

  // 关闭 Modal 框
  onRequestClose = () => {
    this.setState({
      visible: false
    })
  }

  onClickPrivacy() {
    this.setState(preState => ({
      onClickPrivacy: !preState.onClickPrivacy
    }))
  }
  //下次不再提醒
  onClickHint() {
    this.setState(preState => ({
      onClickHint: !preState.onClickHint
    }))
  }

  //弹框确认
  onRequestClick() {
    const { onClickPrivacy, onClickHint } = this.state

    // onClickHint TRUE 下次记住不再提醒
    if (onClickHint) {
      setLocalStorage('hint', { data: true })
    }
    this.setState({
      visible: false
    })
    this.isCommitPage()
  }

  _renderModalPrivacyPolicy() {
    const { onClickPrivacy, onClickHint, isShowPrivacyPolicyView } = this.state
    let unAgree = onClickPrivacy
      ? require('../BTImage/CommunityImages/community_select.png')
      : require('../BTImage/CommunityImages/community_unselect.png')
    let unHint = onClickHint
      ? require('../BTImage/CommunityImages/community_select.png')
      : require('../BTImage/CommunityImages/community_unselect.png')
    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => {
            alert('Modal has been closed.')
          }}>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              width: UserInfo.screenW,
              height: UserInfo.screenH,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 310,
                height: isShowPrivacyPolicyView ? 500 : 210,
                borderRadius: 20,
                alignItems: 'center',
                overflow: 'hidden'
                // padding: 20
              }}>
              <View
                style={{
                  height: 57,
                  paddingTop: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFF0F3',
                  width: 310
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    color: '#353B48',
                    lineHeight: 33,
                    textAlign: 'center'
                  }}>
                  《瓦力社区用户协议》
                </Text>
              </View>
              <View
                style={{
                  // alignItems:'center',
                  paddingTop: 16
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    // devlog(111)
                    this.onClickPrivacy()
                  }}>
                  <View
                    style={{
                      // paddingLeft:47,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                    <Image
                      style={{
                        width: 16,
                        height: 16,
                        marginRight: 8
                      }}
                      source={unAgree}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#353B48',
                        lineHeight: 22
                      }}>
                      我已认证阅读并同意该协议
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.onClickHint()
                  }}>
                  <View
                    style={{
                      // paddingLeft:47,
                      flexDirection: 'row',
                      marginTop: 8,
                      alignItems: 'center'
                    }}>
                    <Image
                      style={{
                        width: 16,
                        height: 16,
                        marginRight: 8
                      }}
                      source={unHint}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#353B48',
                        lineHeight: 22
                      }}>
                      下次不再提醒
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isShowPrivacyPolicyView: !this.state.isShowPrivacyPolicyView
                  })
                  // Linking.openURL('www.baidu.com').catch(err => {})
                  // this.props.navigation('PostPrivacyPolicy')
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#8395A7',
                    paddingTop: 16,
                    paddingBottom: 8
                  }}>
                  请点击阅读用户协议
                </Text>
              </TouchableOpacity>
              {/* 协议 */}
              {isShowPrivacyPolicyView ? <PostPrivacyPolicyItem /> : <View />}
              <View
                style={{
                  flexDirection: 'row',
                  borderTopWidth: 1,
                  borderTopColor: '#EFF0F3'
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    flex: 1
                  }}
                  onPress={() => {
                    this.onRequestClose()
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      height: 48,
                      lineHeight: 48,
                      color: '#353B48',
                      fontSize: 20
                    }}>
                    取消
                  </Text>
                </TouchableOpacity>
                <View style={{ width: 1, backgroundColor: '#EFF0F3' }} />
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={!onClickPrivacy}
                  style={{
                    flex: 1,
                    backgroundColor: !onClickPrivacy ? '#EFF0F3' : null
                  }}
                  onPress={() => {
                    this.onRequestClick()
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      height: 48,
                      lineHeight: 48,
                      color: !onClickPrivacy ? '#D1D5DD' : '#353B48',
                      fontSize: 20
                    }}>
                    确认
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  postPrivacyPolicyBack(self) {
    self.setState({
      visible: true
    })
  }

  commitPage = () => {
    Keyboard.dismiss()

    getLocalStorage(
      'hint',
      res => {
        this.isCommitPage()
      },
      errMsg => {
        this.setState({
          visible: true
        })
      }
    )
  }

  isCommitPage() {
    const { forumId } = this.props
    let wordPublish = this.state.wordPublish
    if (hasEmoji(wordPublish)) {
      wordPublish = emoticons.stringify(wordPublish)
    }
    const { images } = this.state
    if (images.length >= 10) {
      Toast.fail(I18n.t('feedback.image_count'), Config.ToestTime, null, false)
      return
    }
    var formData = new FormData()
    for (let i = 0; i < images.length; i++) {
      let uri = images[i].path
      let index = uri.lastIndexOf('/')
      let name = uri.substring(index + 1)
      let file = { uri, type: 'application/octet-stream', name }
      formData.append('picture' + i, file)
    }

    //防止多次发送帖子
    Toast.loading(I18n.t('tip.wait_text'), 0)
    // 公众号
    const urlArr = enumerateURLStringsMatchedByRegex(wordPublish)
    formData.append('token', UserInfo.token)
    formData.append('content', wordPublish)

    if (forumId) {
      formData.append('forum_id', forumId + '')
    }

    if (urlArr && urlArr.length) {
      const tempURL = urlArr.find(item => {
        return item['url'] != undefined
      })
      tempURL && formData.append('link', tempURL.url)
    }
    requestWithFile('/post/releasePost', formData)
      .then(res => {
        Toast.hide()

        if (res.code == '0') {
          Toast.success(
            I18n.t('community.publish_success'),
            Config.ToestTime,
            null,
            false
          )
          // forum_id:
          this.setState({
            images: [],
            wordPublish: ''
          })

          this.props.navigation.goBack()

          const { option_id } = this.props.CurrentMenuOption.data
          if (forumId || option_id == 6) {
            DeviceEventEmitter.emit('REFRESH_POST', forumId)
          }
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          let msg = res.msg
          Toast.fail(msg, Config.ToestTime, null, false)
        }
      })
      .catch(error => {
        Toast.hide()
        Toast.fail(Config.ToestFailContent, Config.ToestTime, null, false)
      })
  }

  // 用户上传图片列表
  onChangeUploadImage = fileList => {
    this.setState({
      images: fileList
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderModalPrivacyPolicy()}
        <View style={styles.containerView}>
          <View style={[styles.publish]}>
            <TextInput
              style={[styles.text, { height: 138 }]}
              placeholder={I18n.t('community.publish_placeholder')}
              placeholderTextColor={'#D1D5DD'}
              multiline={true}
              autoFocus={true}
              maxLength={500}
              underlineColorAndroid="transparent"
              onChangeText={wordPublish => this.setState({ wordPublish })}
            />
            <Text style={[styles.text, styles.number]}>
              {this.state.wordPublish && this.state.wordPublish.length < 700
                ? this.state.wordPublish.length
                : 0}
              /500
            </Text>
          </View>
          <View style={styles.horizon} />
          <LocalImageAccess
            imageList={this.state.images}
            maxFileNum={9}
            onChange={this.onChangeUploadImage}
          />
        </View>
      </View>
    )
  }
}
function mapStateToProps(state) {
  let forumId = state.communityState.targetForumId

  const { CurrentMenuOption } = state.CommunityPostState

  return { forumId, CurrentMenuOption }
}

export default connect(mapStateToProps)(PostPublish)

const isZH = isZHLanguage()

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative'
  },
  publishButton: {
    color: fcBlue,
    letterSpacing: isZH ? 2 : 0,
    fontSize: 16
  },
  containerView: {
    flex: 1
  },
  publish: {
    borderColor: '#F2F2F2',
    paddingTop: 10,
    paddingRight: 20,
    paddingLeft: 20
  },
  text: {
    borderWidth: 0,
    fontSize: 16,
    lineHeight: 20,
    color: '#353B48'
  },
  number: {
    textAlign: 'right'
  },
  horizon: {
    backgroundColor: '#EFF0F3',
    height: 1,
    margin: 8
  },
  // 用户协议样式
  privacyText: {}
})
