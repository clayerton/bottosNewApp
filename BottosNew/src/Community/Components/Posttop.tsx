import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import Swiper from 'react-native-swiper'
// 公共方法
import BTFetch from "../../Tool/NetWork/BTFetch";
import { devlog, getRequestURL,getImageURL } from '../../Tool/FunctionTool'
import config from '../../Tool/Config'

import throttle from 'lodash-es/throttle'
import I18n from "../../Tool/Language";
// 路由方法
import NavigationService from '../../../NavigationService';

// actions
import { setTopPost } from '../../Redux/Actions/CommunityActions'


const { width } = Dimensions.get('window')

// 置顶帖的数据详情
interface TopPostDetail {
    content: string;
    image: string;
    title: string;
    top_post_value: string;
}

interface Props {
    topPostData: TopPostDetail[];
    setTopPost(topPostData: TopPostDetail[]): void;
}

class Posttop extends PureComponent<Props, {}> {

    postslinkto(linkURL: string) {
        devlog('Posttop postslinkto', linkURL)
        
        NavigationService.navigate('BTPublicWebView', {
            url: linkURL,
            navTitle: I18n.t('community.topPosts')
        });
    }

    // this.postslinkto 限定 600ms 只能触发一次
    throttled = throttle(this.postslinkto, 600, { 'trailing': false });

    componentDidMount() {
        if (this.props.topPostData.length > 0) return;

        BTFetch('/post/topPost')
        .then(res => {
            const { code, data } = res;
            if (code === '0') this.props.setTopPost(data)
        })
        .catch(err => {
        })
    }

    render() {

        const posttop = this.props.topPostData
        if (posttop.length == 0) {
            return null
        }

        const list = posttop.map((item, index) => {
            let fullPostTopUri = getImageURL(item.image);
            return (
                <ImageBackground key={index} source={require('../../BTImage/CommunityImages/post_top.png')} style={styles.img_bg} resizeMode='stretch'>
                    <TouchableWithoutFeedback onPress={() => { this.throttled(item.top_post_value) }}>
                        <View style={{ flexGrow: 1 }}>
                            <Image style={styles.post_top_logo} source={require('../../BTImage/CommunityImages/post_top_logo.png')} />
                            <View style={styles.post_top_container}>
                                <View style={styles.post_left}>
                                    <Text style={styles.post_title} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.post_content} numberOfLines={1}>
                                        {item.content}
                                    </Text>
                                </View>
                                <Image style={styles.post_img} source={{ uri: fullPostTopUri }} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ImageBackground>
            )
        })

        return (
            <View style={styles.container}>
                <Swiper
                    style={styles.wrapper}
                    showsButtons={false}
                    showsPagination={true}
                    paginationStyle={styles.paginationStyle}
                    dotStyle={styles.dotStyle}
                    activeDotStyle={styles.activeDotStyle}
                    horizontal={true}
                    loop={true}
                    autoplay={true}                //自动轮播
                    autoplayTimeout={4}                //每隔4秒切换*/
                /*  dot={<View style={{           //未选中的圆点样式
                    backgroundColor: '#000',
                    width: 3,
                    height: 3,
                    marginLeft: 3,
                    marginRight: 3,
                }}/>}
                */
                >
                    {list}
                </Swiper>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { topPostData } = state.communityState
    return { topPostData }
}

const mapDispatchToProps = (dispatch) => ({
    setTopPost(topPostData: TopPostDetail[]) {
        dispatch(setTopPost(topPostData))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Posttop)

const scale = width / 411
const post_img_width = 48 * scale
const post_img_height = 46 * scale

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
