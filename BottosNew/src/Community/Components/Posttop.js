import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Text, View, StyleSheet, ImageBackground, Image, Dimensions, TouchableWithoutFeedback, } from 'react-native';
import Swiper from 'react-native-swiper';
// 公共方法
import BTFetch from "../../Tool/NetWork/BTFetch";
import { devlog, getImageURL } from '../../Tool/FunctionTool';
import throttle from 'lodash-es/throttle';
import I18n from "../../Tool/Language";
// 路由方法
import NavigationService from '../../../NavigationService';
// actions
import { setTopPost } from '../../Redux/Actions/CommunityActions';
const { width } = Dimensions.get('window');
class Posttop extends PureComponent {
    constructor() {
        super(...arguments);
        // this.postslinkto 限定 600ms 只能触发一次
        this.throttled = throttle(this.postslinkto, 600, { 'trailing': false });
    }
    postslinkto(linkURL) {
        devlog('Posttop postslinkto', linkURL);
        NavigationService.navigate('BTPublicWebView', {
            url: linkURL,
            navTitle: I18n.t('community.topPosts')
        });
    }
    componentDidMount() {
        if (this.props.topPostData.length > 0)
            return;
        BTFetch('/post/topPost')
            .then(res => {
            const { code, data } = res;
            if (code === '0')
                this.props.setTopPost(data);
        })
            .catch(err => {
        });
    }
    render() {
        const posttop = this.props.topPostData;
        if (posttop.length == 0) {
            return null;
        }
        const list = posttop.map((item, index) => {
            let fullPostTopUri = getImageURL(item.image);
            return (React.createElement(ImageBackground, { key: index, source: require('../../BTImage/CommunityImages/post_top.png'), style: styles.img_bg, resizeMode: 'stretch' },
                React.createElement(TouchableWithoutFeedback, { onPress: () => { this.throttled(item.top_post_value); } },
                    React.createElement(View, { style: { flexGrow: 1 } },
                        React.createElement(Image, { style: styles.post_top_logo, source: require('../../BTImage/CommunityImages/post_top_logo.png') }),
                        React.createElement(View, { style: styles.post_top_container },
                            React.createElement(View, { style: styles.post_left },
                                React.createElement(Text, { style: styles.post_title, numberOfLines: 1 }, item.title),
                                React.createElement(Text, { style: styles.post_content, numberOfLines: 1 }, item.content)),
                            React.createElement(Image, { style: styles.post_img, source: { uri: fullPostTopUri } }))))));
        });
        return (React.createElement(View, { style: styles.container },
            React.createElement(Swiper, { style: styles.wrapper, showsButtons: false, showsPagination: true, paginationStyle: styles.paginationStyle, dotStyle: styles.dotStyle, activeDotStyle: styles.activeDotStyle, horizontal: true, loop: true, autoplay: true, autoplayTimeout: 4 }, list)));
    }
}
const mapStateToProps = (state) => {
    const { topPostData } = state.communityState;
    return { topPostData };
};
const mapDispatchToProps = (dispatch) => ({
    setTopPost(topPostData) {
        dispatch(setTopPost(topPostData));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Posttop);
const scale = width / 411;
const post_img_width = 48 * scale;
const post_img_height = 46 * scale;
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row',
        width,
        height: 52 + 55 * width / 375,
    },
    wrapper: {
        backgroundColor: '#F3F3F3',
    },
    img_bg: {
        flexGrow: 1,
        paddingLeft: 30 * scale,
        paddingRight: 30 * scale,
        paddingTop: 23 * scale,
        paddingBottom: 15 * scale,
    },
    post_top_logo: {
        width: 45,
        height: 14,
    },
    post_top_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    post_left: {
        marginTop: 3,
        width: width - 60 * scale - post_img_width - 5,
    },
    post_title: {
        height: 22,
        lineHeight: 22,
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    post_content: {
        height: 17,
        lineHeight: 17,
        fontSize: 12,
        color: 'rgba(0,0,0,0.3)',
    },
    post_img: {
        width: post_img_width,
        height: post_img_height,
    },
    paginationStyle: {
        bottom: 2,
    },
    dotStyle: {
        backgroundColor: '#9B9B9B',
        width: 3,
        height: 3,
    },
    activeDotStyle: {
        backgroundColor: '#000000',
        width: 3,
        height: 3,
    },
});
