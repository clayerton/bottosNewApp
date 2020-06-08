import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { TextareaItem, Button } from 'antd-mobile-rn'
export default class InputItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      val: '',
      showReplyView: false,
      disabled: true // 禁用Button
    }
  }
  onChange(val) {
    this.setState({
      val,
      disabled: !val
    })
  }

  // 点击发送回复
  handleSendMessage() {
    const { onClick } = this.props
    onClick && onClick(this.state.val)
  }

  render() {
    const { memberName, loading } = this.props
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          borderColor:'#F5F5F5',
          borderWidth:2
        }}>
        <View style={{ flex: 8, justifyContent: 'center' }}>
          <TextareaItem
            rows={4}
            placeholder={memberName ? `回复 ${memberName}` : '回复'}
            autoHeight
            value={this.state.val}
            style={{ height: 35 }}
            onChange={val => this.onChange(val)}
            autoFocus={true}
            // onVirtualKeyboardConfirm={() => this.handleSendMessage()}
          />
        </View>
        <View>
          <Button
            style={{ height: 35 }}
            type="primary"
            size="large"
            onClick={() => this.handleSendMessage()}
            loading={loading}
            disabled={this.state.disabled}>
            发送
          </Button>
        </View>
      </View>
    )
  }
}
