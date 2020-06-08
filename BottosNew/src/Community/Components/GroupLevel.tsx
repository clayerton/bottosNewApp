import React from 'react'
import { Image, StyleSheet, ImageStyle } from 'react-native'

function GroupLevel({
  group_level_source = null,
  style
}: {
  group_level_source: null | number;
  style?: ImageStyle;
}) {
  if (group_level_source == null) {
    return null
  } else {
    return <Image style={[styles.group_level_img, style]} source={group_level_source} />
  }

}

interface Styles {
  group_level_img: ImageStyle;
}
const styles = StyleSheet.create<Styles>({
  group_level_img: {
    width: 16,
    height: 16,
    position: 'absolute',
    bottom: 2,
    right: 2,
  }
})

export default GroupLevel