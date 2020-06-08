import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  DeviceEventEmitter,
  StyleSheet
} from 'react-native'

import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'
import {
  REQUEST_WITH_DRAW_CHAIN_LIST, // 资产传出 基本信息
  REQUEST_WITH_DRAW_JURISDICTION // 验证用户权限
} from '../../Redux/Actions/ActionsTypes'

import NavStyle from '../../Tool/Style/NavStyle'
import FontStyle from '../../Tool/Style/FontStyle'
import I18n from '../../Tool/Language/index'
import UserInfo from '../../Tool/UserInfo'
import Config from '../../Tool/Config'
import BTWaitView from '../../Tool/View/BTWaitView.config'
import { getRequestBody } from '../../Tool/FunctionTool'
import BTFetch from '../../Tool/NetWork/BTFetch'

// 组件
import { ActionSheet, Toast } from 'antd-mobile-rn'
const testMobile = 15866666666

const options = [I18n.t('tip.cancel')]

class AssetDetail extends Component {
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
          onPress={() => {
            navigation.navigate('Sunline', { ...state.params })
          }}>
          {I18n.t('asset_detail.header_right')}
        </Text>
      ),
      headerTitle: (
        <Text style={NavStyle.navTitle}>
          {I18n.t('asset_detail.header_title')}
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      isShowButton: false
    }
  }

  componentDidMount() {
    const data = this.props.navigation.state.params

    this.setState({
      data
    })

    this.props.dispatch({
      type: REQUEST_WITH_DRAW_CHAIN_LIST
    })

    this.props.dispatch({
      type: REQUEST_WITH_DRAW_JURISDICTION,
      payload: { token_type: data.name }
    })
    if (UserInfo.mobile != testMobile) {
      this.setState({
        isShowButton: true
      })
    }
  }
  // 转入
  actionIn() {
    const { ChainList, withdrawJurisdiction } = this.props
    // 如果不符合用户组
    // if (withdrawJurisdiction.data.Jurisdiction) {
    const optionsList = this.createOptionsList(ChainList.data)
    ActionSheet.showActionSheetWithOptions(
      {
        title: '你的操作',
        options: optionsList,
        cancelButtonIndex: optionsList.length
      },
      index => {
        if (ChainList.data.length != index) {
          this.fecthActionIn(ChainList.data[index])
        }
      }
    )
    // } else {
    //   Toast.info(withdrawJurisdiction.data.msg, Config.ToestTime, null, false)
    // }
  }
  // 转出
  actionOut() {
    const { ChainList, withdrawJurisdiction } = this.props

    if (withdrawJurisdiction.data.Jurisdiction) {
      const optionsList = this.createOptionsList(ChainList.data)
      ActionSheet.showActionSheetWithOptions(
        {
          title: '你的操作',
          options: optionsList,
          cancelButtonIndex: optionsList.length
        },
        index => {
          if (ChainList.data.length != index) {
            this.props.navigation.navigate('AssetOut', {
              ...ChainList.data[index],
              ...this.state.data
            })
          }
        }
      )
    } else {
      Toast.info(withdrawJurisdiction.data.msg, Config.ToestTime, null, false)
    }
  }

  fecthActionIn(chainListData) {
    let body = {
      chain_type: chainListData.chain_type,
      token_type: this.state.data.name
    }
    let requestBody = getRequestBody(body)
    BTWaitView.show(I18n.t('tip.wait_text'))
    BTFetch('/recharge/getRechargeAddress', requestBody)
      .then(res => {
        BTWaitView.hide()
        if (res.code === '0') {
          this.props.navigation.navigate('AssetIn', {
            ...res.data,
            ...this.state.data
          })
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, Config.ToestTime, null, false)
        }
      })
      .catch(res => {
        BTWaitView.hide()
        Toast.fail(Config.ToestFailContent, Config.ToestTime, null, false)
      })
  }

  createOptionsList(ChainList) {
    let temp =
      ChainList &&
      ChainList.map(item => {
        return item.chain_name
      })

    temp.push(I18n.t('tip.cancel'))
    return temp
  }
  render() {
    const { name, value, intro } = this.state.data
    const { isShowButton } = this.state
    return (
      <View style={NavStyle.container}>
        <ScrollView
          ref="scrollView"
          keyboardShouldPersistTaps="always"
          style={{ width: UserInfo.screenW, height: UserInfo.screenH - 63 }}>
          <View style={styles.item}>
            <Text style={[FontStyle.fontNormal, { width: 50 }]}>
              {I18n.t('asset_detail.item_name')}
            </Text>
            <View
              style={{ width: 2, height: 13, backgroundColor: '#EFF0F3' }}
            />
            <Text
              style={[
                FontStyle.fontNormal,
                { alignSelf: 'center', width: 100 }
              ]}>
              {name}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={[FontStyle.fontNormal, { width: 50 }]}>
              {I18n.t('asset_detail.item_count')}
            </Text>
            <View
              style={{ width: 2, height: 13, backgroundColor: '#EFF0F3' }}
            />
            <Text
              style={[
                FontStyle.fontNormal,
                { alignSelf: 'center', width: 100 }
              ]}>
              {Math.floor(value * 100) / 100}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              marginLeft: 16,
              marginRight: 16,
              marginTop: 16,
              borderColor: '#DFEFFE',
              borderWidth: 1,
              borderRadius: 3,
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 16,
              paddingBottom: 16
            }}>
            <Text
              style={[
                FontStyle.fontNormal,
                { marginLeft: 22, marginBottom: 8 }
              ]}>
              {I18n.t('asset_detail.item_intro')}
            </Text>
            <Text style={[FontStyle.fontLightGray, { alignSelf: 'center' }]}>
              {intro}
            </Text>
          </View>
        </ScrollView>

        {isShowButton ? (
          <View
            style={{
              height: 50,
              marginBottom: 13,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.actionIn()}
              style={[
                styles.touch,
                {
                  marginLeft: 20,
                  borderColor: '#046FDB',
                  borderWidth: 1,
                  borderRadius: 100
                }
              ]}>
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 50,
                  flex: 1,
                  fontSize: 16,
                  color: '#046FDB'
                }}>
                {I18n.t('asset_detail.button_in')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.actionOut()}
              style={[
                styles.touch,
                {
                  marginRight: 20,
                  backgroundColor: '#046FDB',
                  borderRadius: 100
                }
              ]}>
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 50,
                  flex: 1,
                  fontSize: 16,
                  color: '#FFFFFF'
                }}>
                {I18n.t('asset_detail.button_out')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
      </View>
    )
  }
}

function mapStateToProps({ memberAssetsState }) {
  const { ChainList, withdrawJurisdiction } = memberAssetsState
  return { ChainList, withdrawJurisdiction }
}
export default connect(mapStateToProps)(AssetDetail)

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    height: 52,
    borderColor: '#DFEFFE',
    borderWidth: 1,
    borderRadius: 3
  },
  touch: {
    backgroundColor: '#00000000',
    height: 50,
    width: 165,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
