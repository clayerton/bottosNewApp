import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Clipboard
} from 'react-native'

import NavStyle from '../../Tool/Style/NavStyle'
import I18n from '../../Tool/Language/index'
import Config from '../../Tool/Config'
import LongButton from '../../Tool/View/BTButton/LongButton'
import { Toast } from 'antd-mobile-rn/lib/index.native'
import QRCode from 'react-native-qrcode'

export default class AssetIn extends Component {
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
          {I18n.t('asset_detail.button_in')}
        </Text>
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
  componentDidMount() {}

  copy(value) {
    Clipboard.setString(value)
    try {
      Clipboard.getString()
      Toast.info(I18n.t('tip.copy_success'), Config.ToestTime, null, false)
    } catch (e) {
      this.setState({ invite: e.message })
    }
  }


  render() {
    const { address, name } = this.state.data
    return (
      <View style={NavStyle.container}>
        <Text
          style={{
            textAlign: 'left',
            lineHeight: 33,
            height: 33,
            marginTop: 8,
            marginLeft: 16,
            marginRight: 16,
            fontSize: 12,
            color: '#596379'
          }}>
          {I18n.t('asset_detail.button_in')}
          {name}
          {I18n.t('asset_detail.button_in_address')}
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.copy(address)}>
          <View
            style={{
              marginLeft: 16,
              marginRight: 16,
              height: 75,
              borderWidth: 1,
              borderRadius: 3,
              borderColor: '#DFEFFE',
              backgroundColor: '#FFFFFF'
            }}>
            <Text
              style={{
                marginLeft: 16,
                marginRight: 16,
                marginTop: 14,
                marginBottom: 14,
                fontSize: 14,
                color: '#596379'
              }}>
              {address}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: 160,
            width: 160,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: 16,
            borderWidth: 1,
            borderRadius: 3,
            borderColor: '#DFEFFE',
            backgroundColor: '#FFFFFF'
          }}>
          <QRCode value={address} size={140} bgColor="black" fgColor="white" />
        </View>
        <Text
          style={{
            height: 17,
            textAlign: 'center',
            marginTop: 9,
            fontSize: 12,
            color: '#596379'
          }}>
          {I18n.t('asset_detail.QRcode')}
        </Text>
        <Text
          style={{
            height: 17,
            textAlign: 'center',
            fontSize: 12,
            color: '#596379'
          }}>
          {I18n.t('asset_detail.get_address')}
        </Text>
        <Text
          style={{
            height: 17,
            textAlign: 'center',
            fontSize: 14,
            color: '#596379'
          }}>
          两小时内到账
        </Text>

        <LongButton
          style={{ marginLeft: 24, marginRight: 24, marginTop: 32, height: 50 }}
          onPress={() => this.copy(address)}
          disabled={this.state.isDisabled}
          title={I18n.t('asset_detail.copy_address')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({})
