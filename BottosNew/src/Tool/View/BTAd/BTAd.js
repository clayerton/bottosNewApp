import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';

let AdView = requireNativeComponent('AdView', AdView);
import PropTypes from 'prop-types'

export default class BTAd extends React.Component {
    static propTypes = {
        /**
         * Callback that is called continuously when the user is dragging the map.
         */
        dataArray:PropTypes.object,
        onClickView:PropTypes.func,
    };
    render() {
        return <AdView {...this.props}/>;
    }
}

module.exports = BTAd;

