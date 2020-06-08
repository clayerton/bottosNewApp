import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'

const PraiseAndCommentItem = props => {
  const { praise, reply, is_praise } = props
  const praiseAndCommentData = [
    {
      key: 'like',
      title: '点',
      num: praise && praise,
      imageUrl: require('../../../BTImage/CommunityImages/community_like.png'),
      imageUrlSelected: require('../../../BTImage/CommunityImages/community_like_selected.png')
    },
    {
      key: 'comment',
      title: '评',
      num: (reply && reply.length) || 0,
      imageUrl: require('../../../BTImage/CommunityImages/community_comment.png'),
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
      {praiseAndCommentData &&
        praiseAndCommentData.map(item => {
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => {
                _onPress(item)
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
                  item.key == 'like'
                    ? is_praise
                      ? item.imageUrlSelected
                      : item.imageUrl
                    : item.imageUrl
                }
              />
              <Text
                style={{
                  color: '#929292',
                  fontSize: 12,
                  marginLeft: 8
                }}>
                {item.num}
              </Text>
            </TouchableOpacity>
          )
        })}
    </View>
  )
}

export default PraiseAndCommentItem
