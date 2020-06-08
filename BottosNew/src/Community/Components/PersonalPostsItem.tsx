import React, { Component } from 'react'
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  transTimeToString,
  getRequestURL,
  getImageURL,
  enumerateURLStringsMatchedByRegex,
  contentStringHaveEmoji,
  contentStringHaveURL
} from '../../Tool/FunctionTool'
import config from '../../Tool/Config'
import FontStyle, { fcLightGray } from '../../Tool/Style/FontStyle'
import { PostDetail } from '../../Redux/Reducers/CommunityReducer'
import DoubleSourceImage from '../DoubleSourceImage'
import { URL_REG } from '../../Tool/Const'
import * as emoticons from '../../Tool/View/Emoticons'

interface Props {
  data: PostDetail
  onclick(data: PostDetail): void
}

export default class PersonalPostsItem extends Component<Props, {}> {
  constructor(props: Props) {
    super(props)
  }

  // 点击跳转到详情
  handleNavigateToDetail = () => {
    this.props.onclick(this.props.data)
  }

  render() {
    const { data } = this.props

    if (contentStringHaveEmoji(data.content)) {
      data.content = emoticons.parse(data.content)
    }
    return (
      <View style={styles.Item}>
        <TouchableOpacity
          onPress={this.handleNavigateToDetail}
          style={styles.Middle}>
          <View>
            <Text style={styles.time}>
              {transTimeToString(data.created_at)}
            </Text>
            <Text numberOfLines={6} style={FontStyle.fontDarkGray}>
              {data.content}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleNavigateToDetail}>
          <View>
            {data.post_url.length > 0 ? (
              <DoubleSourceImage
                source={{
                  uri: getImageURL(data.post_url[0].post_url)
                }}
                style={styles.square}
              />
            ) : (
              <Text numberOfLines={4} style={styles.square}>
                {data.content}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Item: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#D7D6D6'
  },
  Middle: {
    flex: 7,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'space-between'
  },
  time: {
    color: fcLightGray,
    fontSize: 10
  },
  square: {
    width: 80,
    height: 80
  }
})
