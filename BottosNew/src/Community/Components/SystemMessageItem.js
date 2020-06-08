import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'

const SystemMessageItem = props => {
  // const { link_url, link_title, link_cover, url } = props

  const _onPress = () => {
    const { onPress } = props
    onPress && onPress()
  }

  return (
    <TouchableOpacity
      onPress={_onPress}
      style={{ flexDirection: 'row', padding: 6 }}>
      <View style={{ backgroundColor: '#acc', width: 24, height: 24 }} />
      <View style={{ marginLeft: 16, marginRight: 10, flex: 9 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#353B48', fontSize: 14 }}>系统信息标题</Text>
          <Text style={{ color: '#8395A7', fontSize: 10 }}>
            2018-3-23 12:34:34
          </Text>
        </View>
        <View style={{ marginTop: 6 }}>
          <Text
            numberOfLines={6}
            style={{ color: '#353B48', fontSize: 12, lineHeight: 14 }}>
            评论内容
            大数据是基于海量数据进行分析从而发现一些隐藏的规律、现象、原理等，而人工智能在大数据的基础上更进一步，人工智能会分析数据，然后根据分析结果做出行动，例如无人驾驶，
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default SystemMessageItem
