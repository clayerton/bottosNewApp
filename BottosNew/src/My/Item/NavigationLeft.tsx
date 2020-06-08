import React, {Component} from 'react'
import {Text, View, TouchableOpacity, Image } from 'react-native'
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity'
import NavStyle from '../../Tool/Style/NavStyle'

interface NetonPress {
    onPress:void
}

class NavigationLeft extends Component {
    render() {
        const props = this.props
        const _onPress = value => {
            const { onPress } = props
            onPress && onPress(value)
        }
        return (
            <View
            style={{
              flexDirection: 'row',
              height: 44,
              marginRight: 0,
              marginTop: 12,
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
            {/* <ThrottledTouchableOpacity
              activeOpacity={0.5}
              style={{
                flexDirection: 'row',
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 15,
                paddingLeft: 20,
                position: 'relative'
              }}
              onPress={() => {
                _onPress('gameInfo')
              }}>
              <Image
                style={[NavStyle.navBackImage]}
                source={require('../../BTImage/My/my_ic_post_menu_black.png')}
              />
              
            </ThrottledTouchableOpacity> */}
            <ThrottledTouchableOpacity
              activeOpacity={0.5}
              onPress={() => _onPress('Settings')}
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 10
              }}>
              <Image
                style={[
                  NavStyle.navBackImage,
                  {
                    marginRight: 25
                  }
                ]}
                source={require('../../BTImage/My/my_ic_settings.png')}
              />
            </ThrottledTouchableOpacity>
          </View>
        )
    }
}

export default NavigationLeft;









