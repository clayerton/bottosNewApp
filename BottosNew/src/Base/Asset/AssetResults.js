import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackAndroid
} from 'react-native'
import {
  REQUEST_MEMBER_ASSETS //资产币种列表
} from '../../Redux/Actions/ActionsTypes'
import NavStyle from '../../Tool/Style/NavStyle'

import { transTimeToString } from '../../Tool/FunctionTool'
import I18n from '../../Tool/Language'

class AssetResults extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      headerLeft: <TouchableOpacity style={NavStyle.rightButton} />,
      headerRight: <TouchableOpacity style={NavStyle.rightButton} />,
      headerTitle: (
        <Text style={NavStyle.navTitle}>{I18n.t('base.shop_pay_results')}</Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.props.navigation.state.params
    }
  }
  componentDidMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }
  onBackAndroid = () => {
    this.props.navigation.pop(3)
    return true
  }

  onClickConfirm() {

    this.props.dispatch({
      type: REQUEST_MEMBER_ASSETS
    })
    this.props.navigation.pop(3)
  
  }

  render() {
    const { created_at, token_type, value } = this.state.data
    return (
      <View style={[NavStyle.container, { alignItems: 'center' }]}>
        <View
          style={{
            width: 310,
            height: 268,
            marginTop: 80,
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            alignItems: 'center'
          }}>
          <Image
            style={{ width: 50, height: 50, marginTop: 16 }}
            source={require('../../BTImage/Base/Shop/shop_pay_success.png')}
          />
          <Text style={[styles.payState]}>
            {I18n.t('asset_detail.pay_title_success')}
          </Text>
          <Text
            style={{
              lineHeight: 17,
              height: 17,
              width: 310,
              marginTop: 8,
              textAlign: 'center',
              color: '#596379',
              fontSize: 12
            }}>
            {I18n.t('asset_detail.pay_sub_title')}
          </Text>
          <Text style={[styles.goodsTxt, { marginTop: 16 }]}>
            {I18n.t('asset_detail.pay_time')}
            {transTimeToString(created_at)}
          </Text>
          <Text style={[styles.goodsTxt, { marginTop: 8 }]}>
            {I18n.t('asset_detail.pay_num')}
            {value} {token_type}
          </Text>
          <View
            style={{
              backgroundColor: '#EFF0F3',
              width: 310,
              height: 1,
              marginTop: 16
            }}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.onClickConfirm()}
            style={{ width: 310, justifyContent: 'center', flex: 1 }}>
            <Text
              style={{
                textAlign: 'center',
                width: 310,
                lineHeight: 40,
                height: 40,
                fontSize: 20,
                color: '#353B48'
              }}>
              {I18n.t('tip.confirm')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default connect()(AssetResults)

const styles = StyleSheet.create({
  payState: {
    marginTop: 6,
    lineHeight: 33,
    height: 33,
    textAlign: 'center',
    color: '#353B48',
    fontSize: 24
  },
  goodsTxt: {
    lineHeight: 22,
    height: 22,
    width: 310 - 36,
    textAlign: 'left',
    color: '#353B48',
    fontSize: 16
  }
})
