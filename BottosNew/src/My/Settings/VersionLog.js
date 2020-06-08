import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  NativeModules
} from 'react-native'
import { setLocalStorage, getLocalStorage , getRequestURL,getImageURL} from '../../Tool/FunctionTool'
import NavStyle from '../../Tool/Style/NavStyle'
import Config, { HotVersion } from '../../Tool/Config'
import UserInfo from '../../Tool/UserInfo'
import I18n from '../../Tool/Language'
import FontStyle from '../../Tool/Style/FontStyle'

// 组件
import Button from '../../Tool/View/BTButton/LongButton'
import Item from '../Item/VersionLogItem'
// 数据
import VersionLogData from './VersionLogData'
var ClientUpdateModule = NativeModules.ClientUpdateModule

export default class VersionLog extends Component {
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
          {I18n.t('versionLog.header_title')}
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

 
// 检查更新

updateModal() {
    if (ClientUpdateModule) {
        if (Platform.OS === 'ios') {
            ClientUpdateModule.checkUpdate(
              getRequestURL() + Config.URLSuffix + '/app/checkAppVersion?client=2&sign=cd174dc81c2ee3e7d52914859cbc4c92',
                1,
                {
                    update_new_version: I18n.t('base.update_new_version'),
                    update_update: I18n.t('base.update_update'),
                    update_is_new_version: I18n.t('base.update_is_new_version'),
                    update_data_error: I18n.t('base.update_data_error'),
                    update_cancel: I18n.t('tip.cancel'),
                    update_offline: I18n.t('tip.offline'),
                },
                (error, events) => {

                }
            )
        } else if (Platform.OS === 'android') {
            ClientUpdateModule.checkUpdate(
              getRequestURL() + Config.URLSuffix + '/app/checkAppVersion?client=1&sign=ab2396ba0328ea6cd845b7dbc8e8db23',
                1,
                msg => {

                }
            )
        }
    }
}

  render() {
    return (
      <ScrollView
        ref="scrollView"
        keyboardShouldPersistTaps="always"
        style={NavStyle.container}>
        <View style={styles.listBox}>
          <View style={styles.listBack}>
            <Text style={styles.versionTitle}>
              {I18n.t('versionLog.app_version')}
            </Text>
            <View
              style={{ width: 2, height: 13, backgroundColor: '#EFF0F3' }}
            />
            <Text style={styles.versionTitle}>{UserInfo.version}</Text>
          </View>
          <Text style={styles.versionInfo}>
            ( {I18n.t('versionLog.hot_version')} {HotVersion} )
          </Text>
          <View style={styles.UpdateCheckButton}>
            <Button
              onPress={() => this.updateModal()}
              style={{ width: 165, height: 50 }}
              title={I18n.t('versionLog.updateButton')}
            />
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text
            style={[
              FontStyle.fontDarkGray,
              { marginLeft: 8, marginBottom: 16 }
            ]}>
            {I18n.t('versionLog.content_title')}
          </Text>
          {VersionLogData &&
            VersionLogData.map(item => {
              return (
                <View style={styles.listBox} key={item.version}>
                  <Item {...item} />
                </View>
              )
            })}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  listBox: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    margin: 8
  },
  listBack: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  versionTitle: {
    color: '#6A6F7B',
    fontSize: 14,
    textAlign: 'center'
  },
  versionInfo: {
    paddingBottom: 8,
    textAlign: 'center',
    color: '#8F939C',
    fontSize: 12,
    borderBottomColor: '#EFF0F3',
    borderBottomWidth: 1
  },
  UpdateCheckButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16
  }
})
