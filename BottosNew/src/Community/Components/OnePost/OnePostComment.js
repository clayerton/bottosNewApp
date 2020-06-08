import React from 'react'
import { Text, View, FlatList } from 'react-native'
// 组件
import OnePostCommentCell from './OnePostCommentCell'

const OnePostComment = props => {
  const _onPressNavigateToPortrayal = value => {
    const { onPressNavigateToPortrayal } = props
    onPressNavigateToPortrayal && onPressNavigateToPortrayal(value)
  }

  _toolbar = value => {
    // const { toolbar } = props
    // toolbar && toolbar(value)
  }

  const _renderItem = ({ item }) => {
    return (
      <OnePostCommentCell
        {...item}
        onPressNavigateToPortrayal={value => {
          _onPressNavigateToPortrayal(value)
        }}
        toolbar={()=>{_toolbar()}}
      />
    )
  }

  return (
    <View style={{ marginTop: 8 }}>
      <View
        style={{
          backgroundColor: '#046FDB',
          width: 71,
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
          borderTopLeftRadius: 7,
          borderTopRightRadius: 7,
          marginLeft: 15
        }}>
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
          全部评论
        </Text>
      </View>
      <View
        style={{
          padding: 20,
          paddingTop: 0,
          paddingBottom: 0,
          borderRadius: 15,
          borderWidth: 0.5,
          borderColor: '#DEDEDE'
        }}>
        <FlatList
          data={props.reply}
          extraData={props.reply}
          keyExtractor={item =>
            item.reply_time + '-' + item.main_id + '-' + item.reply_id
          }
          renderItem={_renderItem}
        />
      </View>
    </View>
  )
}

export default OnePostComment
