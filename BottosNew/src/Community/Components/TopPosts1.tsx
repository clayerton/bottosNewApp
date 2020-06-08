import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import {Carousel, Toast} from 'antd-mobile-rn';

// 公共方法
import BTFetch from "../../Tool/NetWork/BTFetch";
import Config from "../../Tool/Config";


function devlog() {
  process.env.NODE_ENV == 'development' && console.log.bind(console)(arguments)
}


export default class BasicCarouselExample extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      topPostsArr: [],
      waiting: false
    };
  }

  postslinkto(url: string) {
    this.setState({ waiting: true })
    // this.props.navigation.push('Postslink', url);
    devlog(url)

    setTimeout(() => {
      this.setState({ waiting: false })
    }, 500);
  }

  componentDidMount() {
    BTFetch('/post/topPost')
    .then(res => {
      devlog('topPost res', res)
      const {code, data} = res;
      if (code === '0' && Array.isArray(data)) {
        this.setState({
          topPostsArr: data,
        })
      }else if(res.code === '99'){
          DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
      }else{
          Toast.info(res.msg,Config.ToestTime,null,false);
      }
    })
  }

  render() {
    const topPostsArr = this.state.topPostsArr
    if (topPostsArr.length == 0) {
      return null
    }
    const ViewLists = topPostsArr.map((item, index) => {
      return (
        <ImageBackground key={index} source={require('../../BTImage/CommunityImages/post_top.png')} style={styles.slide} resizeMode={'cover'}>
          <TouchableWithoutFeedback disabled={this.state.waiting} onPress={() => { this.postslinkto(item.top_post_value) }}>
            <View style={{ flex: 1 }}>
              <Text>adsfadfasdfasdf{index}</Text>
              {/* <Image style={styles.post_top_logo} source={require('../../BTImage/CommunityImages/post_top_logo.png')} /> */}
              {/* <View style={styles.post_top_container}>
                <View style={styles.post_left}>
                  <Text style={styles.post_title}>{item.title.length < 18 ? item.title : item.title.substring(0, 18) + '...'}</Text>
                  <Text
                    style={styles.post_content}>
                    {item.content.length < 24 ? item.content : item.content.substring(0, 24) + '...'}
                  </Text>
                </View>
                <Image style={styles.post_img} source={{ uri: fullPostTopUri }} />
              </View> */}
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      )
    })

    return (
      <View style={styles.topPostContainer}>
        <Carousel
          style={styles.wrapper}
          autoplay  // 自动切换
          infinite  // 循环播放
          autoplayInterval={5000}  // 自动切换的时间间隔
          afterChange={this.onHorizontalSelectedIndexChange}
        >
          {/* {ViewLists} */}
          <View style={styles.containerHorizontal}>
            {/* <Text>Carousel 1</Text> */}
            <ImageBackground source={require('../../BTImage/CommunityImages/post_top.png')} style={styles.containerHorizontal}></ImageBackground>
          </View>
          <View style={[styles.containerHorizontal, { backgroundColor: 'blue' }]}>
            <Text>Carousel 2</Text>
          </View>
          <View style={[styles.containerHorizontal, { backgroundColor: 'yellow' }]}>
            <Text>Carousel 3</Text>
          </View>
          {/* <Text>adsfa134134dfasdfasdf</Text>
          <Text>adsfadfasdfa564567sdf</Text>
          <Text>ads69878fadfasdfasdf</Text> */}
        </Carousel>
      </View>
    );
  }
}

BasicCarouselExample.propTypes = {
  navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  topPostContainer: {
    flexGrow: 1,
    height: 120,
    backgroundColor: '#aaa',
  },
  wrapper: {
    backgroundColor: '#fff',
  },
  containerHorizontal: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  text: {
    color: '#fff',
    fontSize: 36,
  },
  slide: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 23,
  },
  post_top_logo: {
    width: 45,
    height: 14,
  },
});
