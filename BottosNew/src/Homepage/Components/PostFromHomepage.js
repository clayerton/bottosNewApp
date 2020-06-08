import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'

import { getImageURL } from '../../Tool/FunctionTool'
// 组件
import FollowButtonNormal from './FollowButtonNormal'
import FollowButtonSelect from './FollowButtonSelect'

const HomepageListCell = props => {
  const _onPress = value => {
    const { onPressToHomepage } = props
    onPressToHomepage && onPressToHomepage(value)
  }

  const {
    forum_id,
    forum_icon,
    forum_name,
    forum_count,
    forum_post_count
  } = props
  return (
    <View style={{ margin: 12 }}>
      <Text style={{ color: '#333333', fontSize: 17, fontWeight: '900' }}>
        文章来自
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 12,
          borderColor: '#DEDEDE',
          borderWidth: 0.5,
          borderRadius: 15
        }}
        onPress={() =>
          _onPress({
            forum_id,
            forum_icon,
            forum_name,
            forum_count,
            forum_post_count
          })
        }>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
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
                  style={{
                    color: '#1F1F1F',
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}>
                  {forum_name}
                </Text>
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
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default HomepageListCell
