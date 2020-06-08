import React from 'react'
import {
  Alert,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native'
import SearchList, { HighlightableText } from '../../Tool/View/SearchInput'

const HeaderSearchBar = props => {
  clear = () => {
    // console.log('clear--------- ', clear)
  }
  onChange = value => {
    // console.log('onChange---- ', onChange)
  }

  return (<Text>111</Text>
    // <View >
    //   <SearchList
    //     renderBackButton={() => null}
    //     cancelTitle="取消"
    //     onClickBack={() => {}}
    //     searchBarToggleDuration={300}
    //     searchInputPlaceholderColor={'#FFF'}
    //     searchInputTextColor={'#FFF'}
    //     searchInputTextColorActive={'#000'}
    //     searchInputPlaceholder="Search"
    //   />
    // </View>
  )
}

export default HeaderSearchBar
