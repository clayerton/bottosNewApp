import React from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import {getRequestURL,calc_v_level_img,getImageURL} from '../../Tool/FunctionTool';
import I18n from '../../Tool/Language'

const _VIPLEVEL = [
  { level: '1', imageURL: require('../../BTImage/group_id_vip_1.png') },
  { level: '2', imageURL: require('../../BTImage/group_id_vip_2.png') }
]
const getLevelVIP = value => {
  const temp = value.split(',')
  for (let index = 2; index > 0; index--) {
    const result = temp.includes(index.toString())
    if (result) {
      return index
    }
  }
}

const FollowListItem = props => {
  const handleNavigateToPortrayal = () => {
    const { onPress } = props
    onPress && onPress(data.mobile)
  }
  const _onPressFollow = () => {
    const { onPressFollow, data } = props
    onPressFollow && onPressFollow(data.member_id, data.is_follow)
  }
  const { data ,isText } = props
  const { avatar_thumb, member_name, is_follow, group_id } = data

  const _LEVEL = !!group_id && calc_v_level_img(group_id)
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleNavigateToPortrayal}
          style={{
            flexDirection: 'row',
            position: 'relative',
            justifyContent: 'center'
          }}
          >
          <Image
            source={{ uri: getImageURL(avatar_thumb) }}
            style={styles.avatar}
          />
          {_LEVEL ? (
            <Image
              style={{
                width: 12,
                height: 12,
                position: 'absolute',
                right: 0,
                bottom: 0
              }}
              source={_LEVEL} // 大V
            />
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleNavigateToPortrayal}>
          <Text style={styles.nikeName}>{member_name}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={_onPressFollow}
        style={
            is_follow
            ? styles.ButtonItem
            : [
                styles.ButtonItem,
                {
                  borderColor: '#007AFF',
                  borderWidth: 1,
                  backgroundColor: '#fff'
                }
              ]
        }>
        <Text
          style={
              is_follow
              ? styles.ButtonItemText
              : [styles.ButtonItemText, { color: '#007AFF' }]
          }>
           {
             !isText ?
              is_follow
                ? 
                I18n.t('portrayalView.followed')
                : I18n.t('portrayalView.follow')
              :
              '取消拉黑'
           } 


          {/* {is_follow
            ? I18n.t('portrayalView.followed')
            : I18n.t('portrayalView.follow')} */}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default FollowListItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#EFF0F3'
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  nikeName: {
    color: '#046FDB',
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 15
  },
  ButtonItem: {
    borderRadius: 20,
    backgroundColor: '#046FDB',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 24
  },
  ButtonItemText: {
    fontSize: 14,
    color: '#fff',
    alignSelf: 'center'
  }
})
