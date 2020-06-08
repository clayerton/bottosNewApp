import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'

import { transTimeToString } from '../../Tool/FunctionTool'
import I18n from '../../Tool/Language/index'
import NavStyle from '../../Tool/Style/NavStyle'
import {
  REQUEST_MEMBER_ASSETS_USR_FULL_DATE,
  REQUEST_APPEND_MEMBER_ASSETS_LIST,
  REQUEST_UPDATE_MEMBER_ASSETS_LIST // 更新资产列表
} from '../../Redux/Actions/ActionsTypes'
import { DatePicker, List } from 'antd-mobile-rn'

// 组件
import BTWaitView from '../../Tool/View/BTWaitView'

import FooterNoMoreData from '../../Tool/View/PublicDataHintComponent/FooterNoMoreData'
import ListEmptyComponent from '../../Tool/View/PublicDataHintComponent/ListEmptyComponent'
class AssetList extends Component {
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
          {I18n.t('asset_list.header_title')}
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      page_size: 10,
      data: [],
      refreshing: false,
      dateList: [],
      newDate: '', //最新日期
      currentDate: this.createCurrentDate(), // 当前日期
      isShowDatePicker: false,
      selectedDatePicker: '',
      selectedDate: '',
      pickerDate: new Date(),
      visible: false
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: REQUEST_UPDATE_MEMBER_ASSETS_LIST,
      payload: {
        date: this.setPickerDate(this.state.pickerDate),
        asset_type: 2,
        page: this.state.page + '',
        page_size: this.state.page_size + ''
      }
    })
  }

  // shouldComponentUpdate(nextProps) {
  //   return (
  //     this.state.isShowDatePicker ||
  //     (!is(
  //       fromJS(nextProps.memberAssetsList.data),
  //       fromJS(this.props.memberAssetsList.data)
  //     ) &&
  //       !!this.
  // props.memberAssetsList.data &&
  //       !!this.props.memberAssetsList.data.length)
  //   )
  // }

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
              asset_type: 2,
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
            asset_type: 2,
            page: this.state.page + '',
            page_size: this.state.page_size + ''
          }
        })
      } else {
      }
    }
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
        refreshing: true
      },
      () => {
        this.loadData(false, 'new')
      }
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

  setPickerDate(date) {
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : '' + m
    return y + m
  }
  onChange = value => {
    this.setState({ pickerDate: value })
  }


  render() {
    const { isShowDatePicker, selectedDatePicker, selectedDate } = this.state
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
          // refreshing={memberAssetsList.status === 'running' ? true : false}
          // refreshing={this.state.refreshing}
          // onRefresh={() => this.onRefresh()}
          onEndReached={() => this.onEndReached()}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={() => <ListEmptyComponent />}
          ListFooterComponent={() => this._renderFooterComponent()}
        />

        {/* <BTWaitView
          title={I18n.t('tip.wait_text')}
          show={memberAssetsList.status === 'running' ? true : false}
        /> */}
      </View>
    )
  }

  _renderItem(value) {
    const { trade_intro, trade_time, trade_value, currency_name } = value.item
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
            +{Math.floor(trade_value)} {currency_name}
          </Text>
        </View>
        <Text style={{ marginTop: 8, color: '#8395A7', fontSize: 13 }}>
          {transTimeToString(trade_time)}
        </Text>
      </View>
    )
  }

  createCurrentDate() {
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : '' + m
    return y + m
  }

  onPressDatePickerButton(value) {
    this.setState({ isShowDatePicker: false,visible: false  })
    value === 'confirm' && this.loadData(false, 'new'),
      this.setState({ currentDate:this.setPickerDate(this.state.pickerDate) })
  }
}

function mapStateToProps({ memberAssetsState }) {
  const { memberAssetsUsefulDate, memberAssetsList } = memberAssetsState
  return { memberAssetsUsefulDate, memberAssetsList }
}
export default connect(mapStateToProps)(AssetList)
