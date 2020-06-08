/**
 * Created by haywoodfu on 17/4/16.
 */

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet
} from 'react-native'
import React, { Component } from 'react'

import PropTypes from 'prop-types'
import Theme from './Theme'

const {
  cancelButtonWidth: buttonWidth,
  searchBarHorizontalPadding,
  searchIconWidth,
  searchBarWidth
} = Theme.size

export default class SearchBar extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func, // search input value changed callback,

    onFocus: PropTypes.func, // search input focused callback
    onBlur: PropTypes.func, // search input blured callback

    onClickCancel: PropTypes.func, // the search cancel button clicked
    cancelTitle: PropTypes.string, // title for the search cancel button
    cancelTextColor: PropTypes.string, // color for the search cancel button

    searchInputBackgroundColor: PropTypes.string, // default state background color for the search input
    searchInputBackgroundColorActive: PropTypes.string, // active state background color for the search input
    searchInputPlaceholderColor: PropTypes.string, // default placeholder color for the search input
    searchInputTextColor: PropTypes.string, // default state text color for the search input
    searchInputTextColorActive: PropTypes.string, // active state text color for the search input

    searchBarBackgroundColor: PropTypes.string, // active state background color for the search bar

    isShowHolder: PropTypes.bool // 是否显示搜索图标
  }

  static defaultProps = {
    searchInputBackgroundColor: '#F5F5F5',
    searchInputBackgroundColorActive: '#F5F5F5',

    searchInputPlaceholderColor: '#B1B1B1',
    searchInputTextColor: '#171a23',
    searchInputTextColorActive: '#171a23',

    searchBarBackgroundColor: '#171a23',

    cancelTextColor: '请输入您要搜索的内容',
    cancelTitle: 'Cancel'
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      isShowHolder: true,
      animatedValue: new Animated.Value(0)
    }
  }

  onChange(str) {
    this.props.onChange && this.props.onChange(str)
    this.setState({ str })
  }

  onBlur() {
    this.props.onBlur && this.props.onBlur()
  }

  onFocus() {
    this.props.onFocus && this.props.onFocus()
    this.searchingAnimation(true)
  }

  searchingAnimation(isSearching) {
    let toVal = 0

    if (isSearching) {
      this.state.animatedValue.setValue(0)
      toVal = buttonWidth
    } else {
      this.state.animatedValue.setValue(buttonWidth)
      toVal = 0
    }

    Animated.timing(this.state.animatedValue, {
      duration: Theme.duration.toggleSearchBar,
      toValue: toVal
    }).start(() => {
      this.setState({ isShowHolder: !isSearching })
    })
  }

  cancelSearch() {
    this.refs.input.clear()
    this.refs.input.blur()
    this.searchingAnimation(false)
    this.props.onClickCancel && this.props.onClickCancel()
  }

  render() {
    return (
      <View
        style={[
          this.props.style,
          {
            flexDirection: 'row'
          }
        ]}>
        <Animated.View
          style={{
            width: Theme.size.searchBarWidth,
            backgroundColor: this.state.animatedValue.interpolate({
              inputRange: [0, buttonWidth],
              outputRange: [
                this.props.searchInputBackgroundColor,
                this.props.searchInputBackgroundColorActive
              ]
            }),
            height: 30,
            borderRadius: 20
          }}>
          <TextInput
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}
            ref="input"
            style={[
              styles.searchTextInputStyle,
              {
                color:
                  this.props.searchInputTextColorActive &&
                  !this.state.isShowHolder
                    ? this.props.searchInputTextColorActive
                    : this.props.searchInputTextColor || '#979797'
              },
              this.props.searchTextInputStyle
            ]}
            onChangeText={this.onChange.bind(this)}
            value={this.state.value}
            underlineColorAndroid="transparent"
            returnKeyType="search"
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.leftSearchIconStyle,
              {
                opacity: this.state.animatedValue.interpolate({
                  inputRange: [0, buttonWidth],
                  outputRange: [0, 1]
                })
              }
            ]}>
            <Image
              style={styles.searchIconStyle}
              source={require('../images/icon-search.png')}
            />
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.centerSearchIconStyle,
              {
                opacity: this.state.animatedValue.interpolate({
                  inputRange: [0, 70],
                  outputRange: [!this.state.value ? 1 : 0, 0]
                })
              }
            ]}>
            <Image
              style={styles.searchIconStyle}
              source={require('../images/icon-search.png')}
            />
            <Text
              style={{
                marginLeft: 10,
                color: this.props.searchInputPlaceholderColor,
                fontSize: 14,
                backgroundColor: 'rgba(0, 0, 0, 0)'
              }}>
              {this.props.placeholder}
            </Text>
          </Animated.View>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchTextInputStyle: {
    flex: 1,
    height: 35,
    padding: 0,
    paddingLeft: searchIconWidth+ 10,
    paddingRight: 8,
    borderRadius: 5
  },
  centerSearchIconStyle: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignSelf: 'stretch'
  },
  leftSearchIconStyle: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    width: searchIconWidth,
    left: 10
  },
  searchIconStyle: {
    width: 12,
    height: 12
  }
})
