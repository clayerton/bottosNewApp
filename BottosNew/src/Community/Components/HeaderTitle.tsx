import React from 'react'
import {
  Alert,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native'
import { SearchBar } from 'antd-mobile-rn'

const HeaderTitle = props => {

  
  clear = () => {
    // console.log('clear--------- ', clear)
  }
  onChange = value => {
    // console.log('onChange---- ', onChange)
  }

  return (
    <View
      style={{
        backgroundColor: '#aac',
        width: 277,
        height: 29,
        borderRadius: 14,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
      }}>
      <SearchBar
        value={'ddddd'}
        placeholder="搜索"
        onSubmit={value => Alert.alert(value)}
        onChange={this.onChange}
        showCancelButton={false}
        style={{
          backgroundColor: '#aac',
          width: 277,
          height: 29,
          borderRadius: 14,
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center'
        }}
      />
    </View>
  )
}

export default HeaderTitle
