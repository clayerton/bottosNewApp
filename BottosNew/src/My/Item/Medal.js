import React from 'react'
import { Text, View, Image } from 'react-native'
import {getRequestURL,getImageURL} from '../../Tool/FunctionTool';

import FontStyle from '../../Tool/Style/FontStyle'

const Medal = props => {
  const { tags_icon, level_tags_name, tags_name } = props
  return (
    <View
      style={{
        width: 98,
        height: 98,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',

      }}>
      <Image
        style={{ width: 60, height: 60 }}
        source={{ uri: getImageURL(tags_icon) }}
      />
      <Text style={[FontStyle.fontDarkGray, { fontSize: 16, marginTop: 16 }]}>
        {level_tags_name ? level_tags_name : tags_name}
      </Text>
    </View>
  )
}

export default Medal
