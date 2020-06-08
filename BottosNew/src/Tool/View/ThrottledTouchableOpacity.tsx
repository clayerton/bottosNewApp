import React, { PureComponent, ReactChild } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import throttle from 'lodash-es/throttle'


const propTypes = {
  onPress: PropTypes.func.isRequired,
  waitTime: PropTypes.number,
}

const defaultProps = {
  onPress: () => { },
  waitTime: 1200
}

interface Props extends TouchableOpacityProps {
  onPress(): void;
  waitTime?: number;
  children: ReactChild | ReactChild[];
}

/**
 * 限制 onPress 调用频率的 TouchableOpacity
 */
class ThrottledTouchableOpacity extends PureComponent<Props> {
  static propTypes = propTypes

  static defaultProps = defaultProps

  throttledPress = throttle(this.props.onPress, this.props.waitTime, { 'trailing': false })

  render() {
    const { onPress, waitTime, children, ..._props } = this.props

    return (
      <TouchableOpacity activeOpacity={0.5} {..._props} onPress={this.throttledPress}>
        {children}
      </TouchableOpacity>
    )

  }
}

export default ThrottledTouchableOpacity