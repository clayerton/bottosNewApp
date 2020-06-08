import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Button,
  NativeModules,
  TouchableOpacity,
  Modal,
  Platform,
  Dimensions,
  Alert
} from 'react-native'
import { Toast } from 'antd-mobile-rn'
import PublicStyle from '../../Tool/Style/NavStyle'
import I18n from '../../Tool/Language'
import UserInfo from "../../Tool/UserInfo";
import Config from "../..//Tool/Config";
import { requestWithFile } from '../../Tool/NetWork/heightOrderFetch'
import throttle from 'lodash-es/throttle'
import { devlog, isZHLanguage, packStr, unPack } from '../../Tool/FunctionTool'
import { fcBlue } from '../../Tool/Style/FontStyle'
// 自有组件
import LocalImageAccess from '../../Tool/View/LocalImageAccess'

const margin = 20
const imgInterval = 5
const imgCountLimit = 9
const textLengthLimit = 140

function navigationOptions({ navigation }) {
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
        onPress={() => state.params.commitPage()}
        style={PublicStyle.rightButton}
      >
        <Text style={styles.publishButton}>{I18n.t('tip.submit')}</Text>
      </TouchableOpacity>
    ),
    headerTitle: <Text style={PublicStyle.navTitle}>{I18n.t('report.reportTitle')}</Text>,
    headerTintColor: '#fff',
    headerStyle: PublicStyle.navBackground
  }
}

export default class Publish extends Component {
  static navigationOptions = navigationOptions

  constructor(props) {
    super(props)
    const params = props.navigation.state.params
    this.member_id = params.member_id
    this.key = params.key
    this.state = {
      images: [],
      modalVisible: false,
      picture: [],
      wordPublish: '',
      repeat: false //防止重复发送
    }
    
    this.onChangeUploadImage = this.onChangeUploadImage.bind(this)
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  componentDidMount() {
    this.props.navigation.setParams({
      commitPage: this.commitPage
    })
  }

  showActionSheet() {
    this.ActionSheet.show()
  }
  commitPage =  () => {
    devlog(this.state.wordPublish)
    if (!this.state.wordPublish) {
      Toast.fail(I18n.t('feedback.write_content'), 1, null, false)
      return
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

    // var content = packStr(this.state.wordPublish)
    formData.append('member_id',this.member_id)
    formData.append('key',this.key)
    formData.append('token', UserInfo.token)
    formData.append('content', this.state.wordPublish)
    // formData.append('content', content)

    devlog('formData', formData);

    requestWithFile('/app/reportMember', formData)
      .then((res) => {
        devlog('app/reportMember res', res);
        Toast.hide()
        if (res.code === '0') {
          Toast.success(res.msg, Config.ToestTime, null, false)
          this.setState({
            images: [],
            wordPublish: ''
          })
          this.props.navigation.goBack()
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
        } else {
          let msg = res.msg || I18n.t('report.reportFail')
          Toast.fail(msg, Config.ToestTime, null, false)
        }
      })
      .catch((error) => {
        Toast.hide()
        Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
      })

  }

  // 用户上传图片列表
  onChangeUploadImage(images) {
    this.setState({ images })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerView}>
          <View style={[styles.publish]}>
            <TextInput
              style={[styles.text, { height:138 }]}
              placeholder={I18n.t('report.reportPlaceholder')}
              placeholderTextColor={'#9B9B9B'}
              multiline={true}
              autoFocus={true}
              maxLength={500}
              underlineColorAndroid="transparent"
              onChangeText={(wordPublish) =>
                this.setState({
                  wordPublish
                })
              }
            />
            <Text style={[styles.text, styles.number]}>
              {this.state.wordPublish && this.state.wordPublish.length < 700
                ? this.state.wordPublish.length
                : 0}/500
            </Text>
          </View>
          <LocalImageAccess imageList={this.state.images} maxFileNum={9} onChange={this.onChangeUploadImage} />
          
        </View>
      </View>
    )
  }
}
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
  title1: {
    backgroundColor: '#444A59',
    height: 70,
    paddingBottom: 14,
    width: UserInfo.screenW,
    paddingLeft: 15,
    paddingRight: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  left: {
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize: 10,
    paddingBottom: 7
  },
  backIcon: {
    width: 20,
    height: 15,
    fontSize: 14,
    color: '#FFFFFF'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    left: 25
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: 10,
    color: '#72BEFF',
    height:60,
    width: 60,
    paddingTop: 20,
    paddingLeft: 20
  },
  publish: {
    borderColor: '#F2F2F2',
    paddingTop: 10,
    paddingRight:20,
    paddingLeft: 20
  },
  text: {
    borderWidth: 0,
    fontSize: 16,
    lineHeight:20,
    color: '#9B9B9B'
  },
  number: {
    textAlign: 'right'
  }
})
