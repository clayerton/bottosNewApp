import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Carousel, Toast } from 'antd-mobile-rn';
// 公共方法
import BTFetch from "../../Tool/NetWork/BTFetch";
import Config from "../../Tool/Config";
function devlog() {
    process.env.NODE_ENV == 'development' && console.log.bind(console)(arguments);
}
export default class BasicCarouselExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topPostsArr: [],
            waiting: false
        };
    }
    postslinkto(url) {
        this.setState({ waiting: true });
        // this.props.navigation.push('Postslink', url);
        devlog(url);
        setTimeout(() => {
            this.setState({ waiting: false });
        }, 500);
    }
    componentDidMount() {
        BTFetch('/post/topPost')
            .then(res => {
            devlog('topPost res', res);
            const { code, data } = res;
            if (code === '0' && Array.isArray(data)) {
                this.setState({
                    topPostsArr: data,
                });
            }
            else if (res.code === '99') {
                DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg);
            }
            else {
                Toast.info(res.msg, Config.ToestTime, null, false);
            }
        });
    }
    render() {
        const topPostsArr = this.state.topPostsArr;
        if (topPostsArr.length == 0) {
            return null;
        }
        const ViewLists = topPostsArr.map((item, index) => {
            return (React.createElement(ImageBackground, { key: index, source: require('../../BTImage/CommunityImages/post_top.png'), style: styles.slide, resizeMode: 'cover' },
                React.createElement(TouchableWithoutFeedback, { disabled: this.state.waiting, onPress: () => { this.postslinkto(item.top_post_value); } },
                    React.createElement(View, { style: { flex: 1 } },
                        React.createElement(Text, null,
                            "adsfadfasdfasdf",
                            index)))));
        });
        return (React.createElement(View, { style: styles.topPostContainer },
            React.createElement(Carousel, { style: styles.wrapper, autoplay // 自动切换
                : true, infinite // 循环播放
                : true, autoplayInterval: 5000, afterChange: this.onHorizontalSelectedIndexChange },
                React.createElement(View, { style: styles.containerHorizontal },
                    React.createElement(ImageBackground, { source: require('../../BTImage/CommunityImages/post_top.png'), style: styles.containerHorizontal })),
                React.createElement(View, { style: [styles.containerHorizontal, { backgroundColor: 'blue' }] },
                    React.createElement(Text, null, "Carousel 2")),
                React.createElement(View, { style: [styles.containerHorizontal, { backgroundColor: 'yellow' }] },
                    React.createElement(Text, null, "Carousel 3")))));
    }
}
BasicCarouselExample.propTypes = {
    navigation: PropTypes.object.isRequired,
};
const styles = StyleSheet.create({
    topPostContainer: {
        flexGrow: 1,
        height: 120,
        backgroundColor: '#aaa',
    },
    wrapper: {
        backgroundColor: '#fff',
    },
    containerHorizontal: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
    },
    text: {
        color: '#fff',
        fontSize: 36,
    },
    slide: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 23,
    },
    post_top_logo: {
        width: 45,
        height: 14,
    },
});
