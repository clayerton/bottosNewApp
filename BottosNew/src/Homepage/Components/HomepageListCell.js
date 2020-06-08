import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'

import { getImageURL } from '../../Tool/FunctionTool'
// 组件
import FollowButtonNormal from './FollowButtonNormal'
import FollowButtonSelect from './FollowButtonSelect'

const HomepageListCell = props => {
  const {
    forum_name,
    forum_post_count,
    is_follow,
    forum_icon,
    forum_count,
    forum_id
  } = props

  const _onPress = value => {
    const { onPress } = props
    onPress && onPress(value)
  }

  const _onPressAddAndCancelFollowForum = value => {
    const { onPressAddAndCancelFollowForum } = props

    onPressAddAndCancelFollowForum && onPressAddAndCancelFollowForum(value)
  }
  return (
    <TouchableOpacity
      style={{
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderColor: '#DEDEDE',
        borderWidth: 0.5,
        borderRadius: 15,
        marginLeft: 12,
        marginRight: 12
      }}
      onPress={() =>
        _onPress({
          forum_name,
          forum_post_count,
          is_follow,
          forum_icon,
          forum_count,
          forum_id
        })
      }>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <View style={{ width: 67, height: 67 }}>
          <Image
            style={{
              width: 67,
              height: 67,
              borderRadius: 33,
              marginRight: 10
            }}
            source={{ uri: getImageURL(forum_icon) }}
          />
        </View>
        <View style={{ marginLeft: 19 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{ color: '#1F1F1F', fontSize: 16, fontWeight: 'bold' }}>
              {forum_name}
            </Text>
            <View style={{ marginLeft: 16 }}>
              {is_follow ? (
                <FollowButtonSelect
                  onPress={() => {
                    _onPressAddAndCancelFollowForum({ status: '0', forum_id })
                  }}
                />
              ) : (
                <FollowButtonNormal
                  onPress={() => {
                    _onPressAddAndCancelFollowForum({ status: '1', forum_id })
                  }}
                />
              )}
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 11 }}>
            <Text>
              关注数:
              <Text style={{ color: '#046FDB' }}>
                {'  '}
                {forum_count}
              </Text>
            </Text>
            <Text style={{ marginLeft: 20 }}>
              发帖数:
              <Text style={{ color: '#046FDB' }}>
                {'  '}
                {forum_post_count}
              </Text>
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Image
          style={{ width: 7, height: 12 }}
          source={require('../../BTImage/Homepage/homepage_right_icon.png')}
        />
      </View>
    </TouchableOpacity>
  )
}

export default HomepageListCell
