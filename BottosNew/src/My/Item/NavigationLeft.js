import React, { Component } from 'react';
import { View, Image } from 'react-native';
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity';
import NavStyle from '../../Tool/Style/NavStyle';
class NavigationLeft extends Component {
    render() {
        const props = this.props;
        const _onPress = value => {
            const { onPress } = props;
            onPress && onPress(value);
        };
        return (React.createElement(View, { style: {
                flexDirection: 'row',
                height: 44,
                marginRight: 0,
                marginTop: 12,
                justifyContent: 'flex-end',
                alignItems: 'center'
            } },
            React.createElement(ThrottledTouchableOpacity, { activeOpacity: 0.5, onPress: () => _onPress('Settings'), style: {
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 10
                } },
                React.createElement(Image, { style: [
                        NavStyle.navBackImage,
                        {
                            marginRight: 25
                        }
                    ], source: require('../../BTImage/My/my_ic_settings.png') }))));
    }
}
export default NavigationLeft;
