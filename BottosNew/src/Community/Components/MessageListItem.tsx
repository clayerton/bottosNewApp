import React, { Component } from 'react'
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { transTimeToString } from '../../Tool/FunctionTool'
import config from '../../Tool/Config'
import FontStyle from '../../Tool/Style/FontStyle'
import I18n from '../../Tool/Language'
import { URL_REG } from '../../Tool/Const'

import DoubleSourceImage from '../DoubleSourceImage'
import {
  getRequestURL,
  getImageURL,
  enumerateURLStringsMatchedByRegex,
  contentStringHaveEmoji,
  contentStringHaveURL
} from '../../Tool/FunctionTool'
import * as emoticons from '../../Tool/View/Emoticons'

export interface MessageDetail {
  avatar: string
  avatar_thumb: string
  is_read: number
  master: any
  member_name: string
  reply: string
  reply_content: string
  reply_follow_id: number
  reply_follow_post_id: number
  reply_id: number
  reply_time: number
  uid: number
}

interface Props {
  data: MessageDetail
  onclick(post_id: number): void
}

export default class MessageListItem extends Component<Props> {
  constructor(props) {
    super(props)
  }

  // 点击跳转到详情
  handleNavigateToDetail(value) {
    this.props.onclick(value)
  }

  render() {
    const { data } = this.props
    if (contentStringHaveEmoji(data.reply_content)) {
      data.reply_content = emoticons.parse(data.reply_content)
    }
    if (contentStringHaveEmoji(data.master.content)) {
      data.master.content = emoticons.parse(data.master.content)
    }

    return (
      <View style={styles.Item}>
        <View style={styles.Left}>
          <DoubleSourceImage
            source={{
              uri: getImageURL(data.avatar_thumb)
            }}
            style={styles.itemIconView}
          />
        </View>
        <TouchableOpacity
          onPress={() => this.handleNavigateToDetail(data.master.post_id)}
          style={styles.Middle}>
          <View>
            <Text style={FontStyle.fontBlue}>{data.member_name}</Text>
            <Text
              numberOfLines={6}
              style={[FontStyle.fontDarkGray, styles.content]}>
              {I18n.t('community.reply_content')} {data.reply_content}
            </Text>
            <Text style={styles.time}>
              {transTimeToString(data.reply_time)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.handleNavigateToDetail(data.master.post_id)}
          style={styles.Right}>
          <View>
            {data.master.img && !!data.master.img.length ? (
              <DoubleSourceImage
                source={{
                  uri: getImageURL(data.master.img[0].post_thumb_url)
                }}
                style={styles.square}
              />
            ) : (
              <Text
                numberOfLines={4}
                style={[FontStyle.fontDarkGray, styles.square]}>
                {I18n.t('community.post_content')} {data.master.content}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemIconView: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  Item: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#D7D6D6'
  },
  Middle: {
    flex: 7,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'space-between'
  },
  content: {
    fontSize: 12
  },
  time: {
    color: '#999999',
    fontSize: 10,
    marginTop: 5
  },
  square: {
    width: 80,
    height: 80
  }
})
