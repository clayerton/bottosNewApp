import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import I18n from '../../Tool/Language'

import FontStyle from '../../Tool/Style/FontStyle'

// 组件
import Button from '../../Tool/View/BTButton/LongButton'

const MessageAndFollow = props => {
  const _onPress = value => {
    const { onPress } = props
    onPress && onPress(value)
  }
    const {fansCount,followCount,postCount} = props;
  // console.log(props)
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
          paddingBottom:56,
      }}>
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
                _onPress('PersonalPosts')
            }}
            style={styles.myports}
        >
            <Text style={styles.myportsText}>{postCount}</Text>
            <Text style={styles.myportsinfo}>{I18n.t('my.my_posts')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
                _onPress('FollowList')
            }}
            style={styles.myports}
        >
            <Text style={styles.myportsText}>{followCount}</Text>
            <Text style={styles.myportsinfo}>{I18n.t('my.my_follow')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
                _onPress('FollowListMe')
            }}
            style={styles.myports}
        >
            <Text style={styles.myportsText}>{fansCount}</Text>
            <Text style={styles.myportsinfo}>{I18n.t('my.my_fans')}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
                _onPress('BlackList')
            }}
            style={styles.myports}
        >
            <Text style={styles.myportsText}>2</Text>
            <Text style={styles.myportsinfo}>黑名单</Text>
        </TouchableOpacity> */}
     {/* <Button
        style={styles.button}
        textStyle={[
          FontStyle.fontBlue,
          {
            fontSize: 13,
            fontWeight: '400',
            marginTop: 0,
            marginBottom: 0
          }
        ]}
        title={I18n.t('my.my_posts')}
        onPress={() => {
          _onPress('PersonalPosts')
        }}
      />
      <Button
        style={styles.button}
        textStyle={[
          FontStyle.fontBlue,
          {
            fontSize: 13,
            fontWeight: '400',
            marginTop: 0,
            marginBottom: 0
          }
        ]}
        title={I18n.t('my.my_follow')}
        onPress={() => {
          _onPress('FollowList')
        }}
      />
        新增粉丝数
        <Button
            style={styles.button}
            textStyle={[
                FontStyle.fontBlue,
                {
                    fontSize: 13,
                    fontWeight: '400',
                    marginTop: 0,
                    marginBottom: 0
                }
            ]}
            title={I18n.t('my.my_follow_me_count')}
            onPress={() => {
                _onPress('FollowListMe')
            }}
        />*/}
    </View>
  )
}

export default MessageAndFollow
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#046FDB',
    height: 32,
    width: 96,
    marginLeft: 8,
    marginRight: 8
  },
    myports: {
      width:98,

    },
    myportsText:{
      textAlign:'center',
        fontSize:16,
        color:'#353B48',
        fontWeight:'bold',
        lineHeight:22,
    },
    myportsinfo:{
      textAlign:'center',
       fontSize:12,
       color:'#8395A7',
       fontWeight:'bold',
        lineHeight: 17,
        marginTop:2,
    }
})
