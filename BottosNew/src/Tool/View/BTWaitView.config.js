import React from 'react'
import topView from 'rn-topview/lib/topView'
import WaitView from './BTWaitView'

function notice(isShow, title, size, animationType) {
  topView.set(
    <WaitView
      show={isShow}
      title={title}
      size={size}
      animationType={animationType}
    />
  )
}

export default {
  show(title, size, animationType) {
    return notice(true, title, size, animationType)
  },
  hide() {
    topView.remove()
  }
}
