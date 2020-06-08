import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'

import {
  REQUEST_MEMBER_ASSETS_USR_FULL_DATE,
  REQUEST_UPDATE_MEMBER_ASSETS_LIST,
  REQUEST_APPEND_MEMBER_ASSETS_LIST
} from '../../Redux/Actions/ActionsTypes'

import { transTimeToString } from '../../Tool/FunctionTool'
import UserInfo from '../../Tool//UserInfo'
import I18n from '../../Tool/Language/index'
import NavStyle from '../../Tool/Style/NavStyle'
import { DatePicker, List } from 'antd-mobile-rn'

// 组件
import BTWaitView from '../../Tool/View/BTWaitView.config'
import FooterNoMoreData from '../../Tool/View/PublicDataHintComponent/FooterNoMoreData'
import ListEmptyComponent from '../../Tool/View/PublicDataHintComponent/ListEmptyComponent'

const Item = List.Item
const Brief = Item.Brief

class Sunline extends Component {
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
        <Text style={NavStyle.navTitle}>{I18n.t('sunline.header_title')}</Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      asset_type: this.props.navigation.state.params.currency_id || 0,
      page: 0,
      page_size: 10,
      data: [],
      refreshing: false,
      error: false,
      loading: false,
      dataList: [],
      currentDate: this.createCurrentDate(),
      newDate: '', // 最新日期,吗,,
      isShowDatePicker: false,
      selectedDatePicker: '',
      pickerDate: new Date(),
      visible: false
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: REQUEST_UPDATE_MEMBER_ASSETS_LIST,
      payload: {
        date: this.setPickerDate(this.state.pickerDate),
        asset_type: this.state.asset_type + '',
        page: this.state.page + '',
        page_size: this.state.page_size + ''
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.memberAssetsUsefulDate.status === 'success' &&
      !is(
        fromJS(nextProps.memberAssetsUsefulDate),
        fromJS(this.props.memberAssetsUsefulDate)
      )
    ) {
      if (nextProps.memberAssetsUsefulDate.data.length > 0) {
        this.setState({
          selectedDatePicker: nextProps.memberAssetsUsefulDate.data[0].date
        })
      }
    }
    if (nextProps.memberAssetsList.status === 'running') {
      this.setState({
        refreshing: true
      })
    } else {
      this.setState({
        refreshing: false
      })
    }
  }

  loadData(isEndPage1, action) {
    const { memberAssetsList, memberAssetsUsefulDate } = this.props
    const { isEndPage } = memberAssetsList
    if (action === 'new') {
      this.setState(
        {
          page: 0,
          refreshing: true
        },
        () => {
          this.props.dispatch({
            type: REQUEST_UPDATE_MEMBER_ASSETS_LIST,
            payload: {
              date: this.setPickerDate(this.state.pickerDate),
              asset_type: this.state.asset_type + '',
              page: this.state.page + '',
              page_size: this.state.page_size + ''
            }
          })
        }
      )
    } else {
      if (!isEndPage) {
        this.props.dispatch({
          type: REQUEST_APPEND_MEMBER_ASSETS_LIST,
          payload: {
            date: this.setPickerDate(this.state.pickerDate),
            asset_type: this.state.asset_type + '',
            page: this.state.page + '',
            page_size: this.state.page_size + ''
          }
        })
      } else {
      }
    }
  }

  createCurrentDate() {
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : '' + m
    return y + m
  }

  onEndReached() {
    const { memberAssetsList } = this.props
    this.setState(
      {
        page: memberAssetsList.isEndPage ? 0 : this.state.page + 1,
        refreshing: true
      },
      () => {
        this.loadData(memberAssetsList.isEndPage)
      }
    )
  }

  onRefresh() {
    this.setState(
      {
        page: 0,
        refreshing: true,
        loading: false,
        data: []
      },
      () => {
        this.loadData()
      }
    )
  }

  onChange = value => {
    this.setState({ pickerDate: value })
  }

  // 判断收支类型
  createTradeType(ontology_id, target_id) {
    let temp = '+'
    if (
      (ontology_id && ontology_id === UserInfo.member_id) ||
      UserInfo.member_id !== target_id
    ) {
      temp = '-'
    } else {
      temp = '+'
    }

    return temp
  }

  onPressDatePickerButton(value) {
    this.setState({ isShowDatePicker: false, visible: false })
    value === 'confirm' && this.loadData(false, 'new'),
      this.setState({ currentDate: this.setPickerDate(this.state.pickerDate) })
  }
  setPickerDate(date) {
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : '' + m
    return y + m
  }
  render() {
    const { isShowDatePicker, selectedDatePicker } = this.state
    const { memberAssetsUsefulDate, memberAssetsList } = this.props
    const { data } = memberAssetsUsefulDate
    return (
      <View style={[NavStyle.container, { backgroundColor: '#fff' }]}>
        <DatePicker
          visible={this.state.visible}
          value={this.state.pickerDate}
          mode="month"
          minDate={new Date(2017, 1, 0)}
          maxDate={new Date()}
          onChange={this.onChange}
          onOk={() => {
            this.onPressDatePickerButton('confirm')
          }}
          onDismiss={() => {
            this.onPressDatePickerButton('cancel')
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ visible: !this.state.visible })
            }}
            style={{ backgroundColor: '#fff', height: 45 }}>
            <Text style={{ float: 'right', color: '#888' }}>
              {this.setPickerDate(this.state.pickerDate)}
            </Text>
          </TouchableOpacity>
        </DatePicker>

        <FlatList
          data={memberAssetsList && memberAssetsList.data}
          keyExtractor={(item, index) => item.trade_time.toString() + index}
          renderItem={item => this._renderItem(item)}
          // refreshing={this.state.refreshing}
          // onRefresh={() => this.onRefresh()}
          onEndReached={() => this.onEndReached()}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={() => <ListEmptyComponent />}
          ListFooterComponent={() => this._renderFooterComponent()}
        />
      </View>
    )
  }
  _renderItem(value) {
    const {
      trade_intro,
      trade_time,
      trade_value,
      currency_name,
      target_id,
      ontology_id
    } = value.item

    return (
      <View
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 13,
          paddingBottom: 19,
          backgroundColor: '#fff',
          borderBottomColor: '#F7F8FA',
          borderBottomWidth: 1
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}>
          <Text style={{ color: '#353B48', fontSize: 16 }}>{trade_intro}</Text>
          <Text style={{ color: '#353B48', fontSize: 16 }}>
            {this.createTradeType(ontology_id, target_id)} {trade_value}{' '}
            {currency_name}
          </Text>
        </View>
        <Text style={{ marginTop: 8, color: '#8395A7', fontSize: 13 }}>
          {transTimeToString(trade_time)}
        </Text>
      </View>
    )
  }
  // 到底了
  _renderFooterComponent() {
    const { memberAssetsList } = this.props
    if (!memberAssetsList.data) {
      return null
    }
    const { data } = memberAssetsList
    return data.length === 0 ||
      (data.length > 10 && !memberAssetsList.isEndPage) ? null : (
      <FooterNoMoreData />
    )
  }
}

function mapStateToProps({ memberAssetsState }) {
  const { memberAssetsUsefulDate, memberAssetsList } = memberAssetsState
  return { memberAssetsUsefulDate, memberAssetsList }
}
export default connect(mapStateToProps)(Sunline)
