/**
 * Created by robin on 2017/3/16.
 */

import React from 'react'
import { Modal } from 'react-native'
import { ActivityIndicator } from 'antd-mobile-rn'

export default class BTWaitView extends React.Component {
  static defaultProps = {
    size: 'large', // 'small',
    title: '正在加载',
    animationType: 'fade'
  }

  render() {
    const { show, title, size, animationType } = this.props
    return (
      <Modal animationType={animationType} transparent={true} visible={show}>
        <ActivityIndicator animating={show} toast size={size} text={title} />
      </Modal>
    )
  }
}
