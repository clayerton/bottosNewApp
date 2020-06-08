import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import NavStyle from '../Style/NavStyle';
function BTBackButton(props) {
    const { style, imgStyle, source } = props;
    return (React.createElement(TouchableOpacity, { activeOpacity: 0.5, onPress: () => {
            props.onPress();
        }, style: [NavStyle.leftButton, style] },
        React.createElement(Image, { style: [NavStyle.navBackImage, imgStyle], source: source || require('../../BTImage/navigation_back.png') })));
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
};
BTBackButton.defaultProps = {
    style: {},
    imgStyle: {},
};
export default BTBackButton;
