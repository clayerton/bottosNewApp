import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
import Swiper from 'react-native-swiper'
// 公共方法
import { devlog, getImageURL } from '../../Tool/FunctionTool'
import UserInfo from '../../Tool/UserInfo'

import throttle from 'lodash-es/throttle'
import I18n from '../../Tool/Language'
// 路由方法
import NavigationService from '../../../NavigationService'


class TopPost extends PureComponent {
  postslinkto(linkURL) {
    NavigationService.navigate('BTPublicWebView', {
      url: linkURL,
      navTitle: I18n.t('community.topPosts')
    })
  }

  // this.postslinkto 限定 600ms 只能触发一次
  throttled = throttle(this.postslinkto, 600, { trailing: false })
  render() {
    const { data } = this.props.PostTopPost

    if (!data || data.length == 0) {
      return null
    }
    return (
      <View style={styles.container}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          showsPagination={true}
          paginationStyle={styles.paginationStyle}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          horizontal={true}
          loop={true}
          autoplay={true}                //自动轮播
          autoplayTimeout={4} //每隔4秒切换*/
        >
          {data &&
            data.map((item, index) => {
              let fullPostTopUri = getImageURL(item.image)
              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.throttled(item.top_post_value)
                  }}
                  key={item.image + index}>
                  <View style={{ flexGrow: 1 }}>
                    <View style={styles.post_top_container}>
                      <Image
                        style={styles.post_img}
                        source={{ uri: fullPostTopUri }}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )
            })}
        </Swiper>

        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: 34,
            height: 14,
            borderRadius: 7,
            position: 'absolute',
            right: 8,
            bottom: 4,
            alignItems:"center",
            justifyContent:'center'
          }}>
          <Text style={{ color: 'rgba(255,255,255,1)', fontSize: 10 }}>
            置顶
          </Text>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {
  const { PostTopPost } = state.CommunityPostState
  return {
    PostTopPost
  }
}

export default connect(mapStateToProps)(TopPost)

const width = UserInfo.screenW - 12 * 2

const scale = width / 100
const height = (width / 351) * 87

const styles = StyleSheet.create({
  container: {

    width,
    // height: 52 + (55 * width) / 375
    height: height,
    marginTop: 15,
  },
  wrapper: {
    // backgroundColor: '#F3F3F3'
  },

  post_top_container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  post_img: {
    width: width,
    height: height,
    borderRadius: 20
  },
  paginationStyle: {
    bottom: 2
  },
  dotStyle: {
    backgroundColor: '#9B9B9B',
    width: 3,
    height: 3
  },
  activeDotStyle: {
    backgroundColor: '#000000',
    width: 3,
    height: 3
  }
})
