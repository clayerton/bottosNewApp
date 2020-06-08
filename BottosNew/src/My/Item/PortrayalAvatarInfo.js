import React from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { Modal } from 'antd-mobile-rn'

import FontStyle from '../../Tool/Style/FontStyle'
import {
  isZHLanguage,
  calc_v_level_img,
  getImageURL
} from '../../Tool/FunctionTool'
import I18n from '../../Tool/Language'
//  组件
import LocalImageAccess from '../../Tool/View/LocalImageAccess'
import UserInfo from '../../Tool/UserInfo'
const _GENDER = [
  { gender: '1', imageURL: require('../../BTImage/My/my_gender_1.png') },
  { gender: '2', imageURL: require('../../BTImage/My/my_gender_2.png') }
]

const isZH = isZHLanguage()
const PortrayalAvatarInfo = props => {
  const _onPress = value => {
    const { onPress } = props
    onPress && onPress(value)
  }

  const { isMy, data, avatarThumb } = props
  const { member_name, rank, avatar_thumb, gender, group_id, avatar } = data

  // 修改头像
  const _onChange = value => {
    const { onChange } = props
    onChange && onChange(value)
  }

  // 修改姓名
  const _onPressRename = value => {
    const { onPressRename } = props
    onPressRename && onPressRename(value)
  }
  // 查看头像
  const _onPressAvatar = value => {
    const { onPressAvatar } = props
    onPressAvatar && onPressAvatar(value)
  }

  const _LEVEL = !!group_id && calc_v_level_img(group_id)
  // 渲染头像
  const _renderAvatar = isMy => {
    return !!isMy ? (
      <LocalImageAccess
        cropping={true}
        width={UserInfo.screenW}
        height={UserInfo.screenW}
        onChange={value => {
          _onChange(value)
        }}
        maxFileNum={1}
        showImageList={false}>
        <View
          style={{
            flexDirection: 'row',
            position: 'relative',
            justifyContent: 'center'
          }}>
          <Image
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              marginTop: 33 - 27,
              marginBottom: 14
            }}
            source={{ uri:  getImageURL(avatarThumb)||getImageURL(avatar) || getImageURL(avatar_thumb) }}
          />

          {_LEVEL ? (
            <Image
              style={{
                width: 24,
                height: 24,
                position: 'absolute',
                right: 14,
                bottom: 14
              }}
              source={_LEVEL} // 大V
            />
          ) : null}
        </View>
      </LocalImageAccess>
    ) : (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => _onPressAvatar(avatar)}>
        <View
          style={{
            flexDirection: 'row',
            position: 'relative',
            justifyContent: 'center'
          }}>
          <Image
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              marginTop: 33,
              marginBottom: 14
            }}
            source={{ uri: getImageURL(avatar) || getImageURL(avatar_thumb) }}
          />

          {_LEVEL ? (
            <Image
              style={{
                width: 24,
                height: 24,
                position: 'absolute',
                right: 14,
                bottom: 14
              }}
              source={_LEVEL} // 大V
            />
          ) : null}
        </View>
      </TouchableOpacity>
    )
  }

  // 渲染修改昵称
  const __renderRename = isMy => {
    return !!isMy ? (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          Modal.prompt(
            I18n.t('my.rename'),
            ' ',
            [
              { text: I18n.t('tip.cancel') },
              {
                text: I18n.t('tip.confirm'),
                onPress: value => _onPressRename(value)
              }
            ],
            'default',
            member_name
          )
        }}
        style={{
          paddingLeft: 5,
          paddingRight: 5
        }}>
        <Image
          style={{
            width: 16,
            height: 16
          }}
          source={require('../../BTImage/My/my_ic_rename.png')}
        />
      </TouchableOpacity>
    ) : null
  }

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {_renderAvatar(isMy)}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Text
          style={{
            color: '#596379',
            fontSize: 16,
            paddingVertical: 0,
            fontWeight: '700'
          }}
          onC>
          {member_name}
        </Text>
        {__renderRename(isMy)}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Text
          style={[FontStyle.fontLightGray, { fontSize: 12, marginBottom: 8 }]}>
          {isZH
            ? `${I18n.t('my.user_rank1')}${rank}${I18n.t('my.user_rank2')}`
            : `NO.${rank}`}
        </Text>

        {!!gender ? (
          <Image
            style={{
              width: 16,
              height: 16,
              marginLeft: 4
            }}
            source={_GENDER[gender - 1].imageURL} // 大V
          />
        ) : null}
      </View>
      <View
        style={{
          width: 32,
          height: 2,
          backgroundColor: '#FE4365',
          marginTop: 24
        }}
      />
    </View>
  )
}

export default PortrayalAvatarInfo
