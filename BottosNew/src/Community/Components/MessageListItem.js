import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { transTimeToString } from '../../Tool/FunctionTool';
import FontStyle from '../../Tool/Style/FontStyle';
import I18n from '../../Tool/Language';
import DoubleSourceImage from '../DoubleSourceImage';
import { getImageURL, contentStringHaveEmoji } from '../../Tool/FunctionTool';
import * as emoticons from '../../Tool/View/Emoticons';
export default class MessageListItem extends Component {
    constructor(props) {
        super(props);
    }
    // 点击跳转到详情
    handleNavigateToDetail(value) {
        this.props.onclick(value);
    }
    render() {
        const { data } = this.props;
        if (contentStringHaveEmoji(data.reply_content)) {
            data.reply_content = emoticons.parse(data.reply_content);
        }
        if (contentStringHaveEmoji(data.master.content)) {
            data.master.content = emoticons.parse(data.master.content);
        }
        return (React.createElement(View, { style: styles.Item },
            React.createElement(View, { style: styles.Left },
                React.createElement(DoubleSourceImage, { source: {
                        uri: getImageURL(data.avatar_thumb)
                    }, style: styles.itemIconView })),
            React.createElement(TouchableOpacity, { onPress: () => this.handleNavigateToDetail(data.master.post_id), style: styles.Middle },
                React.createElement(View, null,
                    React.createElement(Text, { style: FontStyle.fontBlue }, data.member_name),
                    React.createElement(Text, { numberOfLines: 6, style: [FontStyle.fontDarkGray, styles.content] },
                        I18n.t('community.reply_content'),
                        " ",
                        data.reply_content),
                    React.createElement(Text, { style: styles.time }, transTimeToString(data.reply_time)))),
            React.createElement(TouchableOpacity, { onPress: () => this.handleNavigateToDetail(data.master.post_id), style: styles.Right },
                React.createElement(View, null, data.master.img && !!data.master.img.length ? (React.createElement(DoubleSourceImage, { source: {
                        uri: getImageURL(data.master.img[0].post_thumb_url)
                    }, style: styles.square })) : (React.createElement(Text, { numberOfLines: 4, style: [FontStyle.fontDarkGray, styles.square] },
                    I18n.t('community.post_content'),
                    " ",
                    data.master.content))))));
    }
}
const styles = StyleSheet.create({
    itemIconView: {
        width: 36,
        height: 36,
        borderRadius: 18
    },
    Item: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#D7D6D6'
    },
    Middle: {
        flex: 7,
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'space-between'
    },
    content: {
        fontSize: 12
    },
    time: {
        color: '#999999',
        fontSize: 10,
        marginTop: 5
    },
    square: {
        width: 80,
        height: 80
    }
});
