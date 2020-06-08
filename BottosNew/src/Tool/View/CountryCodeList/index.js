import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SectionList,
  ListView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  Image
} from 'react-native'
import PropTypes from 'prop-types'

import FontStyle from '../../Style/FontStyle'

import UserInfo from '../../UserInfo'
const countryCodeSession = require('./CountryCode.json')

export default class extends React.Component {
  static propTypes = {
    isShow: PropTypes.bool,
    onPick: PropTypes.func,
    animationType: PropTypes.string
    // onCancel: PropTypes.func
  }
  sectionlist: SectionList
  constructor(props) {
    super(props)
    this.state = {
      fullList: true,
      matchItem: new Set(),
      matchSection: new Set(),
      isShow: this.props.isShow,
      isShowSearchInput: false // 是否显示搜索框
    }
    this.handleRightBarPress = this.handleRightBarPress.bind(this)
    this.searchList = this.searchList.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isShow !== nextProps.isShow && nextProps.isShow === true) {
      this.setState({
        isShow: true
      })
    }
  }
  handleRightBarPress(itemIndex) {
    this.sectionlist.scrollToLocation({ itemIndex: itemIndex })
  }
  searchList(text) {
    this.setState({ fullList: false })
    if (!text) {
      this.setState({ fullList: true })
      return
    }
    if (~text.indexOf(' ')) {
      this.setState({ fullList: false })
      return
    }
    let matchItem = new Set()
    let matchSection = new Set()
    for (let i = 0; i < countryCodeSession.length; i++) {
      for (let j = 0; j < countryCodeSession[i].data.length; j++) {
        if (
          countryCodeSession[i].data[j].phoneCode.toString().match(text) ||
          countryCodeSession[i].data[j].countryName.match(text)
        ) {
          matchItem.add(countryCodeSession[i].data[j].countryCode)
          !matchSection.has(countryCodeSession[i].key) &&
            matchSection.add(countryCodeSession[i].key)
        }
      }
    }
    if (matchItem.size) {
      this.setState({ matchItem, matchSection })
    } else {
      this.setState({ matchItem, matchSection }, () => {
        this.setState({ fullList: false })
      })
    }
  }
  
  phoneCodeSelected(item) {
    this.props.onPick(item)
    this.setState({ isShow: false, isShowSearchInput: false })
  }
  onPressIsShowSearchInput() {
    this.setState({
      isShowSearchInput: !this.state.isShowSearchInput
    })
  }
  _keyExtractor(item) {
    return item.countryName
  }
  render() {
    const {
      isShowSearchInput,
      isShow,
      matchItem,
      fullList,
      matchSection
    } = this.state
    return (
      <Modal
        visible={isShow}
        animationType={this.props.animationType || 'slide'}
        transparent={false}>
        {/* 标题 */}
        <View style={styles.container}>
          <View
            style={{
              marginTop: 20,
              height: 64,
              width: UserInfo.screenW,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 24,
              paddingRight: 24
            }}>
            <View />
            <Text style={{ color: '#353B48', fontSize: 16 }}>Country Code</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                this.setState({ isShow: false, isShowSearchInput: false })
              }>
              <Image
                style={{ width: 24, height: 24 }}
                source={require('./asset/country_code_list_ic_close_24.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row'
            }}>
            {/* 搜索框 */}
            {isShowSearchInput ? (
              <TextInput
                style={[styles.searchInput, { paddingLeft: 8 }]}
                onChangeText={text => this.searchList(text)}
                autoFocus={true}
                onBlur={() => {
                  this.setState({ isShowSearchInput: false })
                }}
              />
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.onPressIsShowSearchInput()
                }}
                style={[
                  styles.searchInput,
                  {
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                ]}>
                <Text style={{ color: '#D1D5DD', fontSize: 14 }}>Search</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.container2]}>
            <SectionList
              ref={w => (this.sectionlist = w)}
              keyExtractor={item => item.countryName}
              initialNumToRender={50}
              style={[styles.sessionList]}
              renderItem={({ item }) =>
                matchItem.has(item.countryCode) || fullList ? (
                  <TouchableHighlight
                    onPress={() => this.phoneCodeSelected(item)}>
                    <View style={[styles.sessionListItemContainer]}>
                      <Text style={[styles.sessionListItem1]}>
                        {item.countryName}
                      </Text>
                      <Text style={[styles.sessionListItem2]}>
                        +{item.phoneCode}
                      </Text>
                    </View>
                  </TouchableHighlight>
                ) : (
                  <View />
                )
              }
              renderSectionHeader={({ section }) =>
                matchSection.has(section.key) || fullList ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      backgroundColor: '#EFF0F3',
                      height: 24,
                      width: UserInfo.screenW,
                      paddingLeft: 24
                    }}>
                    <Text style={[FontStyle.fontDarkGray]}>{section.key}</Text>
                  </View>
                ) : (
                  <View />
                )
              }
              sections={countryCodeSession}
              ItemSeparatorComponent={() =>
                fullList ? <View style={[styles.itemSeparator]} /> : <View />
              }
            />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    padding: 8
  },
  container2: {
    flex: 11
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    height: 32,
    marginLeft: 8,
    marginRight: 8
  },
  sessionList: {
    flex: 1
  },
  sessionListItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    paddingLeft: 24,
    paddingRight: 24
  },
  sessionListItem1: {
    flex: 1,
    alignSelf: 'center',
    color: '#353B48',
    fontSize: 14
  },
  sessionListItem2: {
    flex: 1,
    textAlign: 'right',
    color: '#353B48',
    fontSize: 14,
    alignSelf: 'center'
  },
  itemSeparator: {
    flex: 1,
    height: 1,
    backgroundColor: '#EFF0F3'
  }
})
