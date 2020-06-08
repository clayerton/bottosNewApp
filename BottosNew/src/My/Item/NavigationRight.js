import React from 'react'
import { connect } from 'react-redux'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { CLEAR_UNREAD_MESSAGE } from '../../Redux/Actions/ActionsTypes'

const NavigationRight = props => {
  const _onPress = value => {
    const { onPress } = props
    onPress && onPress(value)
  }

  const { data } = props.UnreadMessage

  return (
    <TouchableOpacity
      style={{
        width: 50,
        height: 44,
        marginLeft: 0,
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0120000'
      }}
      onPress={() => {
        props.dispatch({
          type: CLEAR_UNREAD_MESSAGE
        })
        _onPress('message')
      }}>
      <Image
        style={{ width: 18, height: 18 }}
        source={require('../../BTImage/My/my_ic_notification.png')}
      />
      {data && data.count ? (
        <View
          style={{
            backgroundColor: '#FE4365',
            width: 16,
            height: 16,
            borderRadius: 8,
            justifyContent: 'center',
            position: 'absolute',
            right: 5,
            top: 10
          }}>
          <Text style={{ color: '#fff', fontSize: 12, alignSelf: 'center' }}>
            {data.count}
          </Text>
        </View>
      ) : (
        <View />
      )}
    </TouchableOpacity>
  )
}

function mapStateToProps(state) {
  const { UnreadMessage } = state.CommunityPostState
  return { UnreadMessage }
}

export default connect(mapStateToProps)(NavigationRight)
