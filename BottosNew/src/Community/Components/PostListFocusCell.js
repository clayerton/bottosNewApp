import React from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'

import { getImageURL } from '../../Tool/FunctionTool'
import UserInfo from '../../Tool/UserInfo'

const PostListFocusCell = props => {
  // 分享
  const _onPressLinkToURL = (link, title) => {
    const { onPressLinkToURL } = props
    onPressLinkToURL &&
      onPressLinkToURL({
        url: `${link}&token=${UserInfo.token}`,
        navTitle: title
      })
  }
  const { post_member_name, link_url, title, link_cover, read_count } = props
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        _onPressLinkToURL(link_url, title ? title : '看点')
      }}>
      <View style={styles.flexCellStyle}>
        <Text style={{ color: '#1F1F1F', fontSize: 16, lineHeight: 24 }}>
          {title}
        </Text>
        <View
          style={{
            width: 316,
            height: 81,
            backgroundColor: '#F5F5F5',
            marginTop: 19,
            marginBottom: 19
          }}>
          {link_cover ? (
            <Image
              style={{ width: 316, height: 81 }}
              source={{ uri: getImageURL(link_cover) }}
            />
          ) : (
            <View />
          )}
        </View>

        {/* 昵称 阅读数 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: '#046FDB',
                width: 6,
                height: 6,
                borderRadius: 3
              }}
            />
            <Text style={{ color: '#929292', fontSize: 11, marginLeft: 3 }}>
              {post_member_name}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: '#929292', fontSize: 11 }}>
              阅读 {read_count}
            </Text>
            {/* <Text style={{ color: '#929292', fontSize: 11, marginLeft: 3 }}>
                投资 99
              </Text> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default PostListFocusCell

const width = UserInfo.screenW - 24

const styles = StyleSheet.create({
  container: {
    width: width,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#DEDEDE',
    marginTop: 16,
    padding: 18
  },
  flexCellStyle: {
    alignItems: 'center',
    marginBottom: 12
  }
})
