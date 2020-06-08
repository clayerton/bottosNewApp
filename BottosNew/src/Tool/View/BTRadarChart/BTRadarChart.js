import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';

let RadarChart = requireNativeComponent('RadarChart', RadarChart);
import PropTypes from 'prop-types'

export default class BTRadarChart extends React.Component {
    static propTypes = {
        /**
         * Callback that is called continuously when the user is dragging the map.
         */
        dataArray:PropTypes.object,
        onClickView:PropTypes.func,
    };
    render() {
        return <RadarChart {...this.props}/>;
    }
}

module.exports = BTRadarChart;

