import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { Toast } from 'antd-mobile-rn'
import I18n from '../../Tool/Language'

import UserInfo from '../../Tool/UserInfo'
import Config from '../../Tool/Config'
import { hasEmoji } from '../../Tool/FunctionTool'
import PublicStyle from '../../Tool/Style/NavStyle'
import { fcBlue } from '../../Tool/Style/FontStyle'
// 方法
import { requestWithFile } from '../../Tool/NetWork/heightOrderFetch'
// 自有组件
import LocalImageAccess from '../../Tool/View/LocalImageAccess'
import * as emoticons from '../../Tool/View/Emoticons'

const navigationOptions = ({ navigation }) => {
  const { state } = navigation
  return {
    headerLeft: (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.goBack()}
        style={PublicStyle.leftButton}>
        <Image
          style={PublicStyle.navBackImage}
          source={require('../../BTImage/navigation_back.png')}
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => state.params.commitPage()}
        style={PublicStyle.rightButton}>
        <Text style={styles.publishButton}>{I18n.t('tip.submit')}</Text>
      </TouchableOpacity>
    ),
    headerTitle: I18n.t('feedback.header_title'),
    headerTintColor: '#fff'
  }
}

export default class PostPublish extends Component {
  static navigationOptions = navigationOptions

  constructor(props) {
    super(props)
    this.state = {
      images: [],
      wordPublish: '',
      repeat: false //防止重复发送
    }

    props.navigation.setParams({
      commitPage: this.commitPage
    })
  }

  commitPage = () => {
    let { wordPublish } = this.state

    if (!wordPublish) {
      Toast.fail(
        I18n.t('feedback.write_content'),
        Config.ToestTime,
        null,
        false
      )
      return
    }

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
    Toast.loading('Loading...', 0)

    formData.append('token', UserInfo.token)
    formData.append('content', wordPublish)

    requestWithFile('/app/feedback', formData)
      .then(res => {
        this.setState({
          repeat: true
        })
        if (res.code === '0') {
          Toast.hide()
          Toast.success(I18n.t('tip.success'), Config.ToestTime, null, false)
          this.setState({
            images: [],
            wordPublish: ''
          })
          this.props.navigation.goBack()
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          let msg = res.msg || I18n.t('tip.nonsupport_emoji')
          Toast.hide()
          Toast.info(msg, Config.ToestTime, null, false)
        }
      })
      .catch(error => {
        Toast.hide()
          Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
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
        <View style={styles.containerView}>
          <View style={[styles.publish]}>
            <TextInput
              style={[styles.text, { height: 138 }]}
              placeholder={I18n.t('feedback.placeholder')}
              placeholderTextColor={'#D1D5DD'}
              multiline={true}
              autoFocus={true}
              maxLength={500}
              underlineColorAndroid="transparent"
              onChangeText={wordPublish =>
                this.setState({
                  wordPublish
                })
              }
            />
            <Text style={[styles.text, styles.number]}>
              {this.state.wordPublish && this.state.wordPublish.length < 700
                ? this.state.wordPublish.length
                : 0}
              /700
            </Text>
          </View>
          <View style={styles.horizon} />
          <LocalImageAccess onChange={this.onChangeUploadImage} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative'
  },
  publishButton: {
    color: fcBlue,
    letterSpacing: 2,
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
    color: '#D1D5DD'
  },
  number: {
    textAlign: 'right'
  },
  horizon: {
    backgroundColor: '#EFF0F3',
    height: 1,
    margin: 8
  }
})
