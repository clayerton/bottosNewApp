import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  TOGGLE_COMMENT_INPUT_VISIBLE,
  DO_DELETE_POST
} from '../../../Redux/Actions/ActionsTypes'
import { Text, View, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { Toast, Modal } from 'antd-mobile-rn'

import UserInfo from '../../../Tool/UserInfo'
import config from '../../../Tool/Config'
import {
  devlog,
  contentStringHaveEmoji,
  contentStringHaveURL,
  enumerateURLStringsMatchedByRegex
} from '../../../Tool/FunctionTool'
import { requestWithBody } from '../../../Tool/NetWork/heightOrderFetch'
import NavigationService from '../../../../NavigationService'
import I18n from '../../../Tool/Language'
import * as emoticons from '../../../Tool/View/Emoticons'

interface Props {
  post_id: number
  scrollToIndex(): void
  item: any
  routeName: string
  deleteComment(post_id: number, reply_id: number): void
  setTargetPostId(post_id: number, follow_id: number): void
  showCommentInput(): void
}

class PostCommentItem extends Component<Props, {}> {
  // 删除回复，只有自己或管理员可以删除
  deleteReply = () => {
    const { post_id, item } = this.props
    const { reply_id } = item
    // devlog('reply_id', reply_id)
    this.props.dispatch({
      type: DO_DELETE_POST,
      payload: { reply_id, currentPostID: post_id, is_delete: 1 }
    })
  }

  //  跳转到身份画像页面
  navigateToPortrayal = () => {
    const { mobile } = this.props.item
    NavigationService.navigate('Portrayal', { mobile })
  }

  //调取键盘
  toolbar = () => {
    const { item, scrollToIndex } = this.props
    let mobile = UserInfo.mobile
    if (mobile == item.mobile) {
      Toast.info(I18n.t('community.can_not_reply_self'), config.ToestTime)
      return
    }

    this.props.dispatch({
      type: TOGGLE_COMMENT_INPUT_VISIBLE,
      payload: item
    })

    scrollToIndex()
  }

  // 点击跳转浏览器
  onClickUrl(url) {
    Linking.openURL(url).catch(err => {})
  }

  onPressContentURLStyle(value) {
    const res = enumerateURLStringsMatchedByRegex(value)
    return (
      <Text style={styles.replayItemRight} selectable={true}>
        {res &&
          res.map(item => {
            if (item.url) {
              return this._renderLinkURL(item.url)
            } else if (item.Content) {
              return item.Content
            } else {
              return null
            }
          })}
      </Text>
    )
  }

  _renderLinkURL(url) {
    return (
      <Text
        style={{ color: '#1677CB' }}
        onPress={() => {
          this.onClickUrl(url)
        }}>
        {I18n.t('community.webLink')}
      </Text>
    )
  }

  render() {
    const item = this.props.item
    let flag = item.follow_name == null || item.follow_name == undefined
    let member_name = item.member_name + ':'
    let follow_name = item.follow_name
    let member_follow_name =
      item.member_name +
      ' ' +
      I18n.t('community.reply') +
      ' ' +
      follow_name +
      ' : '

    const isShowDeleteBtn =
      UserInfo.mobile == item.mobile || UserInfo.is_admin == 1

    if (contentStringHaveEmoji(item.reply_content)) {
      item.reply_content = emoticons.parse(item.reply_content)
    }

    return (
      <View style={styles.replayItem}>
        <TouchableOpacity onPress={this.navigateToPortrayal}>
          <Text style={styles.replayItemLeft}>
            {flag ? member_name : member_follow_name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.toolbar}>
          {/* 帖子内容 */}
          {contentStringHaveURL(item.reply_content) ? (
            this.onPressContentURLStyle(item.reply_content)
          ) : (
            <Text style={styles.replayItemRight}>{item.reply_content}</Text>
          )}
        </TouchableOpacity>
        {isShowDeleteBtn && (
          <TouchableOpacity
            onPress={() =>
              Modal.alert(
                I18n.t('community.delete_reply'),
                '您确认删除本条回复么？',
                [
                  {
                    text: I18n.t('tip.cancel'),
                    onPress: () => devlog('cancel')
                  },
                  {
                    text: I18n.t('tip.confirm'),
                    onPress: this.deleteReply
                  }
                ]
              )
            }
            style={styles.replyItemDelete}>
            <Text style={styles.replayItemLeft}>删除</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

export default connect()(PostCommentItem)
/*回复帖子功能。*/
const styles = StyleSheet.create({
  replayItem: {
    flex: 1,
    width: '100%',
    paddingRight: 20,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'relative',
    marginTop: 6
  },
  replayItemLeft: {
    color: '#1677CB',
    fontSize: 14,
    flexWrap: 'wrap'
  },
  replayItemRight: {
    flexWrap: 'wrap',
    fontSize: 14,
    marginLeft: 2,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  // 删除帖子回复style
  replyItemDelete: {
    position: 'absolute',
    right: 0
  }
})
