import React from 'react'
import { connect } from 'react-redux'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { Toast, Modal } from 'antd-mobile-rn'

import {
  transTimeToString,
  getImageURL,
  calc_v_level_img,
  contentStringHaveEmoji
} from '../../../Tool/FunctionTool'
import I18n from '../../../Tool/Language'
import UserInfo from '../../../Tool/UserInfo'

import GroupLevel from '../GroupLevel' // 用户等级
import * as emoticons from '../../../Tool/View/Emoticons'

const OnePostCommentCell = props => {
  const {
    reply_time,
    avatar_thumb,
    group_id,
    follow_name,
    is_admin,
    mobile,
    reply_id
  } = props

  let flag = follow_name == null || follow_name == undefined
  let member_name = props.member_name + ':'
  let member_follow_name =
    member_name + ' ' + I18n.t('community.reply') + ' ' + follow_name + ' : '
  let isShowDeleteButton = UserInfo.mobile == mobile ? true : false
  if (contentStringHaveEmoji(props.reply_content)) {
    props.reply_content = emoticons.parse(props.reply_content)
  }
  _navigateToPortrayal = value => {
    const { onPressNavigateToPortrayal } = props
    onPressNavigateToPortrayal && onPressNavigateToPortrayal({ mobile: value })
  }

  _toolbar = value => {
    const { toolbar } = props
    toolbar && toolbar(props)
  }

  const _deleteReply = value => {
    const { deleteReply } = props
    deleteReply && deleteReply(value)
  }


  return (
    <View
      style={{
        justifyContent: 'space-between',
        borderBottomColor: '#DEDEDE',
        borderBottomWidth: 0.5
      }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
        <View
          style={{
            position: 'relative',
            width: 40,
            height: 40
          }}>
          <Image
            style={{
              width: 29,
              height: 29,
              borderRadius: 15,
              marginRight: 10
            }}
            source={{ uri: getImageURL(avatar_thumb) }}
          />
          {/* 等级 */}
          <GroupLevel
            style={{ width: 16, height: 16, bottom: 8, right: 8 }}
            group_level_source={calc_v_level_img(group_id)}
          />
        </View>

        <TouchableOpacity onPress={() => _navigateToPortrayal(mobile)}>
          <Text style={{ color: '#046FDB', fontSize: 12, fontWeight: 'bold' }}>
            {flag ? member_name : member_follow_name}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={_toolbar} style={{}}>
        <Text style={{ color: '#1F1F1F', fontSize: 16, lineHeight: 24 }}>
          {props.reply_content}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Text
          style={{
            color: '#929292',
            fontSize: 11,
            marginTop: 15,
            marginBottom: 15
          }}>
          {transTimeToString(reply_time)}
        </Text>

        {isShowDeleteButton ? (
          <TouchableOpacity
            onPress={() =>
              Modal.alert(
                I18n.t('community.delete_reply'),
                '您确认删除本条回复么？',
                [
                  {
                    text: I18n.t('tip.cancel'),
                    onPress: () => {}
                  },
                  {
                    text: I18n.t('tip.confirm'),
                    onPress: () => {
                      _deleteReply(reply_id)
                    }
                  }
                ]
              )
            }
            style={{ padding: 10, paddingLeft: 30 }}>
            <Text style={{ color: '#1677CB', fontSize: 14 }}>删除</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </View>
  )
}

export default connect()(OnePostCommentCell)
