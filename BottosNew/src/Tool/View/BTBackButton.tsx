import React from 'react'
import { TouchableOpacity, Image, StyleProp, ViewStyle, ImageStyle, ImageSourcePropType } from 'react-native'
import PropTypes from 'prop-types'

import NavStyle from '../Style/NavStyle'

interface Props {
  style?: StyleProp<ViewStyle>;
  imgStyle?: ImageStyle;
  source?: ImageSourcePropType;
  onPress(): void;
}

function BTBackButton(props: Props) {
  const { style, imgStyle, source } = props
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        props.onPress()
      }}
      style={[NavStyle.leftButton, style]}>
      <Image
        style={[NavStyle.navBackImage, imgStyle]}
        source={source || require('../../BTImage/navigation_back.png')}
      />
    </TouchableOpacity>
  )
}

BTBackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  imgStyle: PropTypes.object,
  source: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      uri: PropTypes.string,
    }),
  ]),
}

BTBackButton.defaultProps = {
  style: {},
  imgStyle: {},
}

export default BTBackButton