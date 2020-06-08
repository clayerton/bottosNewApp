import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { List } from 'antd-mobile-rn';
import PublicStyle from '../../Tool/Style/NavStyle'
const Item = List.Item;
import I18n from '../../Tool/Language'


const descriptions = [I18n.t('report.reportSelect1'), I18n.t('report.reportSelect2'), I18n.t('report.reportSelect3'), I18n.t('report.reportSelect4'), I18n.t('report.reportSelect5')]

export default class Report extends Component {
  static navigationOptions = ({ navigation }) => {
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
      headerRight: null,
      headerTitle: I18n.t('report.reportCenter'),
      headerTintColor: '#fff'
    }
  }

  constructor(props) {
    super(props);
    const params = props.navigation.state.params
    this.mapList = this.mapList.bind(this)
  }

  mapList() {
    const navigation = this.props.navigation
    const {member_id, origin_params} = navigation.state.params
    const list = descriptions.map((value, index) => {
      return <Item arrow="horizontal" key={index} onClick={() => {
        navigation.push('ReportContent', {member_id, key: index + 1, origin_params})
      }}>
        {value}
      </Item>;
    })
    return list;
  }

  render() {
    const navigation = this.props.navigation

    return (
      <View style={styles.container}>
        <List renderHeader={() => I18n.t('report.reportSelect')}>
          {this.mapList()}
        </List>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    position:'relative'
  },
  publishButton:{
    color:'#72BEFF',
    letterSpacing:2,
  },
  containerView:{
    flex:1,
    paddingRight:20,
    paddingLeft:20,
  }
})
