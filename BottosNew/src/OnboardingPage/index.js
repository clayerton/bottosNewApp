import React, { Component } from 'react'
import { StyleSheet, ImageBackground } from 'react-native'
import Swiper from 'react-native-swiper'
// import ScreenUtil from '../../util/ScreenUtil'
import { Button } from 'antd-mobile-rn'

export default class OnboardingPage extends Component {
  // 点击进入程序
  onClickToHome () {
    const { screenProps } = this.props
    screenProps()
  }

  render () {
    return (
      <Swiper style={styles.wrapper} showsButtons={false} loop={false} >
        <ImageBackground source={require('../../src/BTImage/OnboardingPage/board_page1.jpg')} style={styles.slide} resizeMode={'cover'}></ImageBackground>
        <ImageBackground source={require('../../src/BTImage/OnboardingPage/board_page2.jpg')} style={styles.slide} resizeMode={'cover'}></ImageBackground>
        <ImageBackground source={require('../../src/BTImage/OnboardingPage/board_page3.jpg')} style={styles.slide} resizeMode={'cover'}></ImageBackground>
        <ImageBackground source={require('../../src/BTImage/OnboardingPage/board_page4.jpg')} style={styles.slide} resizeMode={'cover'}>
          <Button
            onClick={() => this.onClickToHome()}
            style={styles.Button}
            type='primary'
          >
              进入
          </Button>
        </ImageBackground>
      </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  Button: {
    width:160,
    position: 'absolute',
    bottom: '9%'
  }
})
