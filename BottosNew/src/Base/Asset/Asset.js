import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  DeviceEventEmitter,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'

import { Toast } from 'antd-mobile-rn'

import {
  REQUEST_MEMBER_ASSETS, //资产币种列表
  REQUEST_CONVERT_REDEEM_USE // 兑换 兑换码
} from '../../Redux/Actions/ActionsTypes'

import { getRequestBody } from '../../Tool/FunctionTool'

import BTFetch from '../../Tool/NetWork/BTFetch'
import NavStyle from '../../Tool/Style/NavStyle'
import FontStyle from '../../Tool/Style/FontStyle'
import I18n from '../../Tool/Language/index'

import Config from '../../Tool/Config'

// 组件
import BTWaitView from '../../Tool/View/BTWaitView.config'
import Button from '../../Tool/View/BTButton/LongButton'

class Asset extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    const { getFullType } = state
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
            navigation.navigate('Sunline', {
              currency_id: navigation.state.getFullType()
            })
          }}>
          {I18n.t('asset.header_right')}
        </Text>
      ),
      headerTitle: (
        <Text style={NavStyle.navTitle}>{I18n.t('asset.header_title')}</Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  getFullType() {
    const { MemberAssets } = this.props
    let currency_id = []
    MemberAssets.data &&
      MemberAssets.data.map(item => {
        currency_id.push(item.currency_id)
      })

    return currency_id.join(',')
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      value: '',
      disabled: true
    }
    this.props.navigation.state.getFullType = this.getFullType.bind(this)
  }
  componentDidMount() {
    this.props.dispatch({
      type: REQUEST_MEMBER_ASSETS
    })
  }

  // 兑换码
  onPressRedeemUse() {
    this.props.dispatch({
      type: REQUEST_CONVERT_REDEEM_USE,
      payload: { redeem: this.state.value }
    })
  }

  _onChangeText(value) {
    this.setState({
      value,
      disabled: !value.length
    })
  }

  render() {
    const { value, disabled } = this.state
    const { data } = this.props.MemberAssets
    return (
      <ScrollView
        ref="scrollView"
        keyboardShouldPersistTaps="always"
        style={NavStyle.container}>
        <View style={[styles.item, { paddingLeft: 16, paddingRight: 8 }]}>
          <TextInput
            value={value}
            underlineColorAndroid="transparent"
            placeholderTextColor="#D1D5DD"
            style={{
              color: '#596379',
              fontSize: 14,
              flex: 9
            }}
            placeholder={I18n.t('asset.convert_input_placeholder')}
            onChangeText={value => {
              this._onChangeText(value)
            }}
          />
          <Button
            style={{ width: 70, height: 24 }}
            textStyle={{ fontWeight: 'normal' }}
            title={I18n.t('asset.convert_button_text')}
            disabled={disabled}
            onPress={() => {
              this.onPressRedeemUse()
            }}
          />
        </View>
        {data &&
          data.map(item => {
            const { name, value } = item
            return (
              <TouchableOpacity
                key={item.currency_id}
                activeOpacity={0.5}
                style={styles.item}
                onPress={() => {
                  this.props.navigation.navigate('AssetDetail', { ...item })
                }}>
                <Text
                  style={[
                    FontStyle.fontNormal,
                    { alignSelf: 'center', width: 50 }
                  ]}>
                  {name}
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
              </TouchableOpacity>
            )
          })}
      </ScrollView>
    )
  }
}

function mapStateToProps({ memberAssetsState }) {
  const { MemberAssets, RedeemCode } = memberAssetsState
  return { MemberAssets, RedeemCode }
}
export default connect(mapStateToProps)(Asset)

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
  }
})
