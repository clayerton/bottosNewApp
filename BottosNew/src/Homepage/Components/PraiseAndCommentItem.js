import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'

const PraiseAndCommentItem = props => {
  const { praise, reply, is_praise } = props
  const praiseAndCommentData = [
    {
      key: 'like',
      title: '点',
      num: praise && praise,
      imageUrl: require('../../BTImage/CommunityImages/community_like.png'),
      imageUrlSelected: require('../../BTImage/CommunityImages/community_like_selected.png')
    },
    {
      key: 'comment',
      title: '评',
      num: (reply && reply.length) || 0,
      imageUrl: require('../../BTImage/CommunityImages/community_comment.png'),
      imageUrlSelected: null
    }
  ]

  const _onPress = value => {
    const { onPress } = props
    onPress && onPress({ ...value, ...props })
  }

  return (
   
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      {/* 点赞 */}
      <TouchableOpacity
        onPress={() => {
          _onPress({
            key: 'like',
            num: praise && praise
          })
        }}
        style={{
          paddingLeft: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Image
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
          source={
            is_praise
              ? require('../../BTImage/CommunityImages/community_like_selected.png')
              : require('../../BTImage/CommunityImages/community_like.png')
          }
        />
        <Text
          style={{
            color: '#929292',
            fontSize: 12,
            marginLeft: 8
          }}>
          {praise && praise}
        </Text>
      </TouchableOpacity>
      {/* 评论 */}

      <TouchableOpacity
        onPress={() => {
          _onPress({
            key: 'comment',
            num: (reply && reply.length) || 0
          })
        }}
        style={{
          paddingLeft: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Image
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
          source={require('../../BTImage/CommunityImages/community_comment.png')}
        />
        <Text
          style={{
            color: '#929292',
            fontSize: 12,
            marginLeft: 8
          }}>
          {(reply && reply.length) || 0}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default PraiseAndCommentItem
