import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { transTimeToString, getImageURL, contentStringHaveEmoji } from '../../Tool/FunctionTool';
import FontStyle, { fcLightGray } from '../../Tool/Style/FontStyle';
import DoubleSourceImage from '../DoubleSourceImage';
import * as emoticons from '../../Tool/View/Emoticons';
export default class PersonalPostsItem extends Component {
    constructor(props) {
        super(props);
        // 点击跳转到详情
        this.handleNavigateToDetail = () => {
            this.props.onclick(this.props.data);
        };
    }
    render() {
        const { data } = this.props;
        if (contentStringHaveEmoji(data.content)) {
            data.content = emoticons.parse(data.content);
        }
        return (React.createElement(View, { style: styles.Item },
            React.createElement(TouchableOpacity, { onPress: this.handleNavigateToDetail, style: styles.Middle },
                React.createElement(View, null,
                    React.createElement(Text, { style: styles.time }, transTimeToString(data.created_at)),
                    React.createElement(Text, { numberOfLines: 6, style: FontStyle.fontDarkGray }, data.content))),
            React.createElement(TouchableOpacity, { onPress: this.handleNavigateToDetail },
                React.createElement(View, null, data.post_url.length > 0 ? (React.createElement(DoubleSourceImage, { source: {
                        uri: getImageURL(data.post_url[0].post_url)
                    }, style: styles.square })) : (React.createElement(Text, { numberOfLines: 4, style: styles.square }, data.content))))));
    }
}
const styles = StyleSheet.create({
    Item: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#D7D6D6'
    },
    Middle: {
        flex: 7,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'space-between'
    },
    time: {
        color: fcLightGray,
        fontSize: 10
    },
    square: {
        width: 80,
        height: 80
    }
});
