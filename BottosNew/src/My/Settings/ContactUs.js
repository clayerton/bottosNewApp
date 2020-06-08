import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Linking,
  Clipboard
} from 'react-native'
import { Toast } from 'antd-mobile-rn'
import { isZHLanguage } from '../../Tool/FunctionTool'

import NavStyle from '../../Tool/Style/NavStyle'
import FontStyle from '../../Tool/Style/FontStyle'

import Config from '../../Tool/Config'
import I18n from '../../Tool/Language'

// 组件
export default class ContactUs extends Component {
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
        <Text style={NavStyle.navTitle}>
          {I18n.t('contact_us.header_title')}
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      urlData: [
        {
          name: 'BBS',
          url: 'https://www.botfans.org'
        },
        {
          name: 'Twitter',
          url: 'https://twitter.com/bottos_ai'
        },
        {
          name: 'Telegram',
          url: 'https://t.me/bottoscn'
        },
        {
          name: 'Medium',
          url: 'https://medium.com/bottos'
        },
        {
          name: 'Facebook',
          url: 'https://www.facebook.com/bottos.org'
        },
        {
          name: 'GitHub',
          url: 'https://github.com/Bottos-project'
        }
      ],
      QRCodeListDataZH: [
        {
          title: 'Bottos铂链',
          imageRequire: require('../../BTImage/My/my_contact_us_bitmap1.png')
        },
        {
          title: 'Bottos铂链',
          imageRequire: require('../../BTImage/My/my_contact_us_bitmap2.png')
        },
        {
          title: 'Bottos助理',
          imageRequire: require('../../BTImage/My/my_contact_us_bitmap3.png')
        },
        {
          title: '614664747',
          imageRequire: require('../../BTImage/My/my_contact_us_bitmap4.png')
        }
      ],
      QRCodeListDataEN: [
        {
          title: 'Bottos铂链',
          imageRequire: require('../../BTImage/My/my_contact_us_bitmap1_en.png')
        },
        {
          title: 'Bottos铂链',
          imageRequire: require('../../BTImage/My/my_contact_us_bitmap2_en.png')
        },
        {
          title: 'Bottos助理',
          imageRequire: require('../../BTImage/My/my_contact_us_bitmap3_en.png')
        },
        {
          title: '614664747',
          imageRequire: require('../../BTImage/My/my_contact_us_bitmap4_en.png')
        }
      ],
      dataNew: [
        {
          title: '1.微信公众账号搜索：瓦力社区',
          imageRequire: require('../../BTImage/My/my_contact_us_bitmap5.jpg'),
          key: 'wechat'
        },
        {
          title: '2.品牌和广告合作：walicommunity@163.com',
          imageRequire: '',
          key: 'mail'
        },
        {
          title: '3.瓦力社区今日头条号：今日头条搜索用户：“瓦力社区”',
          imageRequire: '',
          key: 'toutiao'
        }
      ],
      isZHLanguage: isZHLanguage()
    }
  }
  componentDidMount() {
    const { QRCodeListDataZH, QRCodeListDataEN, isZHLanguage } = this.state

    if (isZHLanguage) {
      this.setState({
        data: QRCodeListDataZH
      })
    } else {
      this.setState({
        data: QRCodeListDataEN
      })
    }
  }

  async copy(value) {
    Clipboard.setString(value)
    try {
      await Clipboard.getString()
      Toast.info(I18n.t('tip.copy_success'), Config.ToestTime, null, false)
    } catch (e) {}
  }

  // 点击跳转浏览器
  onClickUrl(url) {
    Linking.openURL(url).catch(err => {})
  }

  render() {
    const { urlData, dataNew } = this.state
    return (
      <ScrollView
        ref="scrollView"
        keyboardShouldPersistTaps="always"
        style={NavStyle.container}>
        <View style={styles.listWhite}>
          <View style={{ borderBottomColor: '#EFF0F3', borderBottomWidth: 1 }}>
            <View style={{ padding: 16 }}>
              {dataNew &&
                dataNew.map(item => {
                  const { title, imageRequire, key } = item
                  return (
                    <View>
                      {key === 'wechat' && (
                        <Image
                          style={styles.contactImage}
                          source={imageRequire}
                        />
                      )}
                      <Text style={styles.linkText} key={title}>
                        {title}
                      </Text>
                    </View>
                  )
                })}
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  linkText: {
    marginTop: 8,
    marginBottom: 8,
    color: '#596379',
    fontSize: 12
  },
  contactImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    height: 258,
    width: 258
  },

  listWhite: {
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    margin: 8
  },
  listItem: {
    marginBottom: 12
  },
  copyView: {
    width: 48,
    height: 24,
    backgroundColor: '#046FDB',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  copy: {
    color: '#fff',
    fontSize: 12
  }
})
