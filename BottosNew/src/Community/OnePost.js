import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Toast } from 'antd-mobile-rn';
import { View, StyleSheet, Text, ScrollView, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import { DO_FOLLOW_PRAISE, TOGGLE_COMMENT_INPUT_VISIBLE, REQUEST_DO_ADD_FOLLOW, REQUEST_DO_CANCEL_FOLLOW, DO_DELETE_POST, DO_POST_READ_COUNT } from '../Redux/Actions/ActionsTypes';
// 组件
import CommentMainInput from './Components/CommentMainInput'; // 评论输入框
import OnePostCommentCell from './Components/OnePost/OnePostCommentCell';
import OnePostContent from './Components/OnePost/OnePostContent';
import Modal from 'react-native-modalbox';
import PostFromHomepage from '../Homepage/Components/PostFromHomepage';
// 方法
import I18n from '../Tool/Language';
import NavStyle from '../Tool/Style/NavStyle';
import UserInfo from '../Tool/UserInfo';
import config from '../Tool/Config';
import BTBackButton from '../Tool/View/BTBackButton';
import { isiPhone8P, getRequestBody } from '../Tool/FunctionTool';
import BTFetch from '../Tool/NetWork/BTFetch';
import BTAd from '../Tool/View/BTAd/BTAd';
// 键盘弹出的偏移量，要对 Android 和 IOS 分别适配，并且还要适配特定机型
const isBigScreen = UserInfo.screenH / UserInfo.screenW > 1.95;
let keyboardVerticalOffset = 55;
// 后来发现 小米8 的适配也有问题，所以我判断一下，如果是屏幕很长，就也采用 84
// 并且 android 和 iOS 的要分开判断
if (Platform.OS === 'ios') {
    // 8P 的适配
    if (isiPhone8P()) {
        keyboardVerticalOffset = 60;
    }
    else if (isBigScreen) {
        keyboardVerticalOffset = 84;
    }
}
else {
    // android 大手机的适配
    if (isBigScreen) {
        keyboardVerticalOffset = 94;
    }
}
// 导航栏选项
const navigationOptions = ({ navigation }) => {
    return {
        headerLeft: props => {
            return (React.createElement(BTBackButton, { onPress: () => {
                    const onBack = navigation.getParam('onBack', () => { });
                    onBack();
                    props.onPress();
                } }));
        },
        headerTitle: React.createElement(Text, { style: NavStyle.navTitle }, "\u5E16\u5B50\u8BE6\u60C5"),
        headerRight: (React.createElement(TouchableOpacity, { style: NavStyle.rightButton, onPress: () => {
                const onPressToShare = navigation.getParam('onPressToShare', () => { });
                onPressToShare();
            } },
            React.createElement(Image, { style: {
                    width: 24,
                    height: 24
                }, source: require('../BTImage/CommunityImages/community_black.png') })))
    };
};
class OnePost extends Component {
    constructor(props) {
        super(props);
        // 在单个帖子的页面，删除帖子要后退
        this.deletePost = () => {
            const { PostDetail } = this.props;
            const { post_id } = PostDetail.data;
            this.props.dispatch({
                type: DO_DELETE_POST,
                payload: { post_id }
            });
            const { pop } = this.props.navigation;
            pop(2);
        };
        this.handleChange = (keyboardHeight) => {
            this.setState({ keyboardHeight });
            // 记录一下这个高度
            if (keyboardHeight > 0) {
                this.defaultHeight = keyboardHeight;
            }
        };
        // 如果聚焦的时候，高度不是默认高度，就要设置成默认高度
        // 以免键盘把页面顶起来了
        this.handleFocus = () => {
            if (this.state.keyboardHeight != this.defaultHeight) {
                this.setState({ keyboardHeight: this.defaultHeight });
            }
        };
        this.handlekeyboardDidHide = () => {
            this.props.closeCommentInput();
        };
        this.onPress = () => {
            setTimeout(() => {
                this.setState({
                    data: district
                });
            }, 500);
        };
        this.onChange = (value) => {
            this.setState({ value });
        };
        const navigation = props.navigation;
        const { post_id, isDataExist, isCommunity, forum_id, admins } = navigation.state.params;
        const isShowTopAndBoutiqueButton = value => {
            return value && value.find(item => item.member_id == UserInfo.member_id);
        };
        this.state = {
            keyboardHeight: 0,
            isShowDeleteButton: false,
            isBlack: false,
            admins: props.navigation.state.params.admins,
            isShowTopAndBoutiqueButton: UserInfo.is_admin ||
                (admins instanceof Array && !!isShowTopAndBoutiqueButton(admins)) ||
                false,
            data: [],
            value: [],
            pickerValue: []
        };
        this.isCommunity = isCommunity;
        this.post_id = post_id;
        this.forum_id = forum_id;
        this.admins = admins;
        this.defaultHeight = 290;
        navigation.setParams({
            onBack: () => {
                // const index = props.postsData.findIndex(ele => ele.post_id == post_id)
                // if (!isDataExist && index > -1) {
                //   props.deletePost(post_id)
                // }
            },
            onPressToShare: () => {
                this.refs.modal.open();
            }
        });
    }
    componentDidMount() {
        const { PostDetail } = this.props;
        const mobile = PostDetail.data && PostDetail.data.mobile;
        const isShowDeleteButton = UserInfo.is_admin || mobile == UserInfo.mobile;
        this.setState({
            isShowDeleteButton
        });
        this.props.dispatch({
            type: DO_POST_READ_COUNT,
            payload: { post_id: this.post_id, router: 'OnePost' }
        });
    }
    // 关注 取消关注
    _onPressFollow(value) {
        const { member_id, is_follow } = value;
        if (is_follow) {
            this.props.dispatch({
                type: REQUEST_DO_CANCEL_FOLLOW,
                payload: { from: member_id, is_follow: false, router: 'OnePost' }
            });
        }
        else {
            this.props.dispatch({
                type: REQUEST_DO_ADD_FOLLOW,
                payload: { from: member_id, is_follow: true, router: 'OnePost' }
            });
        }
    }
    // 跳转到身份画像页面
    _onPressNavigateToPortrayal(value) {
        const { mobile } = value;
        this.props.navigation.navigate('Portrayal', { mobile });
    }
    // 点赞数
    _onPressPraiseAndComment(value) {
        const { key, mobile, post_id, is_praise } = value;
        key == 'like' &&
            this.props.dispatch({
                type: DO_FOLLOW_PRAISE,
                payload: {
                    post_id,
                    is_follow: true,
                    mobile,
                    myMobile: UserInfo.mobile,
                    status: !is_praise + '',
                    router: 'OnePost'
                }
            });
        key == 'comment' && this.triggerComment(value);
    }
    // 触发评论框
    triggerComment(value) {
        this.props.dispatch({
            type: TOGGLE_COMMENT_INPUT_VISIBLE,
            payload: value
        });
        this.scrollToIndex();
    }
    // 这个是点击回复的时候，让该帖子滚动到界面中间
    scrollToIndex() {
        const { scrollToIndex, index } = this.props;
        if (scrollToIndex && typeof index != 'undefined')
            scrollToIndex(index);
    }
    _toolbarOnePost(value) {
        const { PostDetail } = this.props;
        let mobile = UserInfo.mobile;
        if (mobile == value.mobile) {
            Toast.info(I18n.t('community.can_not_reply_self'), config.ToestTime);
            return;
        }
        this.props.dispatch({
            type: TOGGLE_COMMENT_INPUT_VISIBLE,
            payload: Object.assign({}, value, { router: 'OnePost', post_id: PostDetail.data && PostDetail.data.post_id })
        });
        this.scrollToIndex();
    }
    // 删除评论
    _deleteReply(value) {
        const { PostDetail } = this.props;
        const { post_id } = PostDetail.data;
        this.props.dispatch({
            type: DO_DELETE_POST,
            payload: { reply_id: value, currentPostID: post_id, router: 'OnePost' }
        });
    }
    onActionPress(index, member_id) {
        const { navigation } = this.props;
        if (index === 0) {
            this.addBlack(member_id);
        }
        if (index === 1) {
            navigation.push('Report', {
                member_id
            });
        }
    }
    //加入黑名单
    addBlack(member_id) {
        // handle 1 拉黑 2 解禁
        const { isBlack } = this.state;
        let body = {
            from: member_id,
            handle: isBlack ? 2 : 1
        };
        let requestBody = getRequestBody(body);
        BTFetch('/black/addBlack', requestBody)
            .then(res => {
            if (res.code === '0') {
                Toast.success(res.msg, config.ToestTime, null, false);
                this.setState(preState => ({
                    isBlack: !preState.isBlack
                }));
            }
            else if (res.code === '99') {
                DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg);
            }
            else {
                Toast.info(res.msg, config.ToestTime, null, false);
            }
        })
            .catch(res => {
            Toast.fail(res.msg, config.ToestTime, null, false);
        });
    }
    _renderItem({ item }) {
        return (React.createElement(OnePostCommentCell, Object.assign({}, item, { toolbar: value => this._toolbarOnePost(value), onPressNavigateToPortrayal: value => this._onPressNavigateToPortrayal(value), deleteReply: value => {
                this._deleteReply(value);
            } })));
    }
    // 前台设置置顶 && 前台设置加精
    /**
     *
     * @param 传token,post_id，point
     */
    _setForumPostTopAndBoutique(value) {
        const { forum_id } = value;
        if (!forum_id) {
            value.forum_id = '0';
        }
        let requestBody = getRequestBody(value);
        BTFetch('/forum/setForumPost', requestBody)
            .then(res => {
            if (res.code === '0') {
                Toast.success(res.msg, config.ToestTime, null, false);
            }
            else if (res.code === '99') {
                DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg);
            }
            else {
                Toast.info(res.msg, config.ToestTime, null, false);
            }
        })
            .catch(res => {
            Toast.fail(res.msg, config.ToestTime, null, false);
        });
    }
    // 前台设置置顶 && 前台设置加精
    _setAdminPostPoint(value) {
        const { post_id } = value;
        const obj = {
            post_id,
            point: 10
        };
        let requestBody = getRequestBody(obj);
        BTFetch('/post/adminPostPoint', requestBody)
            .then(res => {
            if (res.code === '0') {
                Toast.success(res.msg, config.ToestTime, null, false);
            }
            else if (res.code === '99') {
                DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg);
            }
            else {
                Toast.info(res.msg, config.ToestTime, null, false);
            }
        })
            .catch(res => {
            Toast.fail(res.msg, config.ToestTime, null, false);
        });
    }
    render() {
        const { isShowTopAndBoutiqueButton } = this.state;
        const { PostDetail, CommentInputVisible } = this.props;
        let pack_preview = null;
        PostDetail.data &&
            PostDetail.data.pack_preview &&
            (pack_preview = PostDetail.data.pack_preview);
        const bottom = this.state.keyboardHeight + 20;
        // 判断是否红包 true 帖子
        let isH = pack_preview && Array.isArray(pack_preview) && pack_preview.length === 0;
        let item = PostDetail.data;
        const isShowDeleteButton = UserInfo.is_admin ||
            (item && item.mobile && item.mobile == UserInfo.mobile);
        let adID = '';
        if (Platform.OS === 'ios') {
            adID = '255171';
        }
        else if (Platform.OS === 'android') {
            adID = '255673';
        }
        return (React.createElement(ScrollView, { ref: "scrollView", keyboardShouldPersistTaps: "always", style: [styles.container, styles.position] },
            React.createElement(OnePostContent, Object.assign({}, PostDetail.data, { onPressFollow: value => {
                    this._onPressFollow(value);
                }, onPressPraiseAndComment: value => {
                    this._onPressPraiseAndComment(value);
                }, onPressNavigateToPortrayal: value => {
                    this._onPressNavigateToPortrayal(value);
                }, onPressLinkToURL: value => {
                    this.props.navigation.navigate('BTPublicWebView', value);
                } })),
            item && item.forum_name ? (React.createElement(PostFromHomepage, Object.assign({}, item, { onPressToHomepage: value => {
                    this.props.navigation.navigate('HomepagePostList', Object.assign({}, value, { is_follow: value.is_follow_forum }));
                } }))) : null,
            React.createElement(BTAd, { style: {
                    width: UserInfo.screenW,
                    alignSelf: 'center',
                    height: 90,
                    marginTop: 20,
                    marginBottom: 5,
                    backgroundColor: '#00FF0000'
                }, dataDic: { index: '2', id: adID }, onClickView: e => {
                    //模拟原生回传数据给RN
                    // console.log('test' + e.nativeEvent.value)
                } },
                React.createElement(Image, { style: { position: 'absolute', left: 0, top: 0, width: 28, height: 90 }, source: require('../BTImage/CommunityImages/ad_background_left.png') }),
                Platform.OS === 'ios' ? (React.createElement(Text, { style: {
                        color: '#999999',
                        marginTop: 5,
                        marginLeft: 30,
                        fontSize: 14
                    } }, "\u5E7F\u544A")) : (React.createElement(View, null)),
                React.createElement(Image, { style: { position: 'absolute', right: 0, top: 0, width: 28, height: 90 }, source: require('../BTImage/CommunityImages/ad_background_right.png') })),
            PostDetail.data &&
                PostDetail.data.reply &&
                PostDetail.data.reply.length ? (React.createElement(View, { style: [{ marginTop: 8 }, styles.container2] },
                React.createElement(View, { style: {
                        backgroundColor: '#046FDB',
                        width: 71,
                        height: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopLeftRadius: 7,
                        borderTopRightRadius: 7,
                        marginLeft: 15
                    } },
                    React.createElement(Text, { style: { color: '#fff', fontSize: 12, fontWeight: 'bold' } }, "\u5168\u90E8\u8BC4\u8BBA")),
                React.createElement(View, { style: {
                        padding: 20,
                        paddingTop: 0,
                        paddingBottom: 0,
                        borderRadius: 15,
                        borderWidth: 0.5,
                        borderColor: '#DEDEDE'
                    } },
                    React.createElement(FlatList, { data: PostDetail.data.reply, extraData: PostDetail.data.reply, keyExtractor: item => item.reply_time + '-' + item.main_id + '-' + item.reply_id, renderItem: item => this._renderItem(item) })))) : (React.createElement(View, null)),
            CommentInputVisible.data && (React.createElement(KeyboardAvoidingView, { keyboardVerticalOffset: keyboardVerticalOffset, behavior: "padding", enabled: true },
                React.createElement(CommentMainInput, { router: "OnePost" }))),
            React.createElement(Modal, { style: {
                    flexDirection: 'column',
                    height: isH && false ? 280 : 280,
                    backgroundColor: '#FFFF0000'
                }, position: 'bottom', entry: 'bottom', ref: "modal", coverScreen: true, backdropPressToClose: true, backButtonClose: true, openAnimationDuration: 0, swipeToClose: false },
                React.createElement(View, { style: {
                        flexDirection: 'column',
                        marginLeft: 8,
                        marginRight: 8,
                        backgroundColor: '#FFFFFF',
                        height: isH && false ? 220 : 220,
                        borderRadius: 8
                    } },
                    isH && false && (React.createElement(View, { style: {
                            flexDirection: 'row',
                            backgroundColor: '#FFFF0000',
                            height: 90
                        } },
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                alignItems: 'center',
                                width: 90,
                                height: 90,
                                backgroundColor: '#FF00FF00'
                            }, onPress: () => this.onClickButtonShare(3, item) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../BTImage/PublicComponent/umeng_socialize_wxcircle.png') }),
                            React.createElement(Text, { style: {
                                    width: 90,
                                    height: 20,
                                    lineHeight: 20,
                                    fontSize: 10,
                                    color: '#000000',
                                    textAlign: 'center'
                                } }, "\u670B\u53CB\u5708")),
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                alignItems: 'center',
                                width: 90,
                                height: 90,
                                backgroundColor: '#FF00FF00'
                            }, onPress: () => this.onClickButtonShare(2, item) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../BTImage/PublicComponent/umeng_socialize_wechat.png') }),
                            React.createElement(Text, { style: {
                                    width: 90,
                                    height: 20,
                                    lineHeight: 20,
                                    fontSize: 10,
                                    color: '#000000',
                                    textAlign: 'center'
                                } }, "\u5FAE\u4FE1")))),
                    isH && false && (React.createElement(View, { style: {
                            backgroundColor: '#EFF0F3',
                            height: 1,
                            marginTop: 20
                        } })),
                    React.createElement(View, { style: {
                            flexDirection: 'row',
                            backgroundColor: '#FFFF0000',
                            height: 90
                        } },
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                alignItems: 'center',
                                width: 90,
                                height: 90,
                                backgroundColor: '#FF00FF00'
                            }, onPress: () => this.onClickButtonShare(100, item) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../BTImage/PublicComponent/report.png') }),
                            React.createElement(Text, { style: {
                                    width: 90,
                                    height: 20,
                                    lineHeight: 20,
                                    fontSize: 10,
                                    color: '#000000',
                                    textAlign: 'center'
                                } }, "\u4E3E\u62A5")),
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                alignItems: 'center',
                                width: 90,
                                height: 90,
                                backgroundColor: '#FF00FF00'
                            }, onPress: () => this.onClickButtonShare(101, item) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../BTImage/PublicComponent/blacklist.png') }),
                            React.createElement(Text, { style: {
                                    width: 90,
                                    height: 20,
                                    lineHeight: 20,
                                    fontSize: 10,
                                    color: '#000000',
                                    textAlign: 'center'
                                } }, "\u9ED1\u540D\u5355")),
                        Array.isArray(pack_preview) && pack_preview.length === 0 && (React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                alignItems: 'center',
                                width: 90,
                                height: 90,
                                backgroundColor: '#FF00FF00'
                            }, onPress: () => this.onClickButtonShare(103, item) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../BTImage/PublicComponent/wx_share.png') }),
                            React.createElement(Text, { style: {
                                    width: 90,
                                    height: 20,
                                    lineHeight: 20,
                                    fontSize: 10,
                                    color: '#000000',
                                    textAlign: 'center'
                                } }, "\u5206\u4EAB"))),
                        isShowDeleteButton ? (React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                alignItems: 'center',
                                width: 90,
                                height: 90,
                                backgroundColor: '#FF00FF00'
                            }, onPress: () => this.onClickButtonShare(102) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../BTImage/PublicComponent/delete.png') }),
                            React.createElement(Text, { style: {
                                    width: 90,
                                    height: 20,
                                    lineHeight: 20,
                                    fontSize: 10,
                                    color: '#000000',
                                    textAlign: 'center'
                                } }, "\u5220\u9664"))) : (React.createElement(View, null))),
                    React.createElement(View, { style: {
                            flexDirection: 'row',
                            backgroundColor: '#FFFF0000',
                            height: 90
                        } },
                        item && item.forum_id && isShowTopAndBoutiqueButton ? (React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                alignItems: 'center',
                                width: 90,
                                height: 90,
                                backgroundColor: '#FF00FF00'
                            }, onPress: () => this.onClickButtonShare(104, item) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../BTImage/PublicComponent/top.png') }),
                            React.createElement(Text, { style: {
                                    width: 90,
                                    height: 20,
                                    lineHeight: 20,
                                    fontSize: 10,
                                    color: '#000000',
                                    textAlign: 'center'
                                } }, item && !!item.is_top ? '取消置顶' : '置顶'))) : (React.createElement(View, null)),
                        item && item.forum_id && isShowTopAndBoutiqueButton ? (React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                alignItems: 'center',
                                width: 90,
                                height: 90,
                                backgroundColor: '#FF00FF00'
                            }, onPress: () => this.onClickButtonShare(105, item) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../BTImage/PublicComponent/boutique.png') }),
                            React.createElement(Text, { style: {
                                    width: 90,
                                    height: 20,
                                    lineHeight: 20,
                                    fontSize: 10,
                                    color: '#000000',
                                    textAlign: 'center'
                                } }, item && !!item.is_boutique ? '取消加精' : '加精'))) : (React.createElement(View, null)),
                        UserInfo.is_admin ? (React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                alignItems: 'center',
                                width: 90,
                                height: 90,
                                backgroundColor: '#FF00FF00'
                            }, onPress: () => this.onClickButtonShare(106, item) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../BTImage/PublicComponent/add_point.png') }),
                            React.createElement(Text, { style: {
                                    width: 90,
                                    height: 20,
                                    lineHeight: 20,
                                    fontSize: 10,
                                    color: '#000000',
                                    textAlign: 'center'
                                } }, "\u63A8\u8350"))) : (React.createElement(View, null)))),
                React.createElement(View, { style: {
                        flexDirection: 'column',
                        margin: 8,
                        backgroundColor: '#FFFFFF',
                        flex: 1,
                        borderRadius: 8
                    } },
                    React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1
                        }, onPress: () => this.onClickCloseShare() },
                        React.createElement(Text, { style: {
                                width: 100,
                                lineHeight: 30,
                                fontSize: 15,
                                backgroundColor: '#0F0FFF00',
                                color: '#000000',
                                textAlign: 'center'
                            } }, "\u53D6\u6D88"))))));
    }
    //---------------------------------------分享函数起始位置-----------------------------------------
    onClickButtonShare(index, item) {
        this.refs.modal.close();
        if (index === 100) {
            //举报
            this.onActionPress(1, item.member_id);
        }
        else if (index === 101) {
            //黑名单
            this.onActionPress(0, item.member_id);
        }
        else if (index === 102) {
            //删除
            this.deletePost();
        }
        else if (index === 103) {
            //生成图片
            this.props.navigation.navigate('GeneratePicture', item);
        }
        else if (index === 104) {
            this._setForumPostTopAndBoutique({
                key: '置顶',
                post_id: this.post_id,
                forum_id: this.forum_id,
                is_top: !item.is_top ? '1' : '0'
            });
        }
        else if (index === 105) {
            this._setForumPostTopAndBoutique({
                key: '加精',
                post_id: this.post_id,
                forum_id: this.forum_id,
                is_boutique: !item.is_boutique ? '1' : '0'
            });
        }
        else if (index === 106) {
            this._setAdminPostPoint(item);
        }
        else {
            // 判断是否是红包  false 是红包
            if (Array.isArray(item.pack_preview) && item.pack_preview.length === 0) {
                this.props.navigation.navigate('GeneratePicture', item);
            }
            else {
                ShareUtil.share(`【瓦力社区】${item.pack_preview.total_members}人瓜分100DTO积分！${item.post_member_name}发了一个大礼包，手慢无～`, '../../BTImage/CommunityImages/community_red_packet_bg.png', 'http://dapp.botfans.org/gp/', '瓦力红包', index, (code, message) => {
                    Toast.info(message, config.ToestTime, null, false);
                });
            }
        }
    }
    onClickCloseShare() {
        this.refs.modal.close();
    }
}
OnePost.displayName = 'OnePost';
OnePost.navigationOptions = navigationOptions;
function mapStateToProps(state) {
    const { PostDetail, CommentInputVisible } = state.CommunityPostState;
    return { PostDetail, CommentInputVisible };
}
export default connect(mapStateToProps)(OnePost);
const width = UserInfo.screenW - 24;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    position: {},
    container2: {
        width: width,
        alignSelf: 'center'
    }
});
