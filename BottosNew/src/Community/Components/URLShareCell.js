import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'

const URLShareCell = props => {
  const { link_url, link_title, link_cover, url } = props

  const _onPress = () => {
    const { onPress } = props
    onPress && onPress(url)
  }

  return (
    <TouchableOpacity
      onPress={_onPress}
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#EFF0F3',
        width: 306,
        height: 48,
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 8,
        marginTop:10
      }}>
      <View
        style={{
          backgroundColor: '#F7F8FA',
          width: 38,
          height: 38
        }}>
        {link_cover ? (
          <Image
            style={{ width: 38, height: 38 }}
            source={{ uri: link_cover }}
          />
        ) : (
          <Image
            style={{ width: 38, height: 38 }}
            source={require('../../BTImage/CommunityImages/community_content_link.png')}
          />
        )}
      </View>
      <Text
        style={{
          color: '#596379',
          fontSize: 14,
          marginLeft: 8,
          marginRight: 40
        }}
        numberOfLines={1}>
        {link_title ? link_title : url[0]}
      </Text>
    </TouchableOpacity>
  )
}

export default URLShareCell
