import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, DeviceEventEmitter, Linking } from 'react-native';
import { Toast } from 'antd-mobile-rn';
// 组件
import ImageShow from '../ImageShow';
import PostComment from './PostComment';
import GroupLevel from './GroupLevel';
import DoubleSourceImage from '../DoubleSourceImage';
import RedPacketPostItem from '../RedPacketSend/RedPacketPostItem';
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity';
import URLShareCell from '../Components/URLShareCell';
import { requestWithBody } from '../../Tool/NetWork/heightOrderFetch';
import config from '../../Tool/Config';
import UserInfo from '../../Tool/UserInfo';
import BTFetch from '../../Tool/NetWork/BTFetch';
import { getRequestBody, transTimeToString, devlog, getImageURL, calc_v_level_img, contentStringHaveURL, contentStringHaveURL1, enumerateURLStringsMatchedByRegex, contentStringHaveEmoji } from '../../Tool/FunctionTool';
import I18n from '../../Tool/Language';
import * as emoticons from '../../Tool/View/Emoticons';
import ShareUtil from "../../Tool/UM/ShareUtil";
import Modal from 'react-native-modalbox';
var ReactNative = require('react-native');
const options1 = ['拉黑', '举报', I18n.t('tip.cancel')];
const options2 = ['取消拉黑', '举报', I18n.t('tip.cancel')];
class PostItem extends Component {
    constructor(props) {
        super(props);
        this.routeName = this.props.navigation.state.routeName;
        // 这个是点击回复的时候，让该帖子滚动到界面中间
        this.scrollToIndex = () => {
            const { scrollToIndex, index } = this.props;
            if (scrollToIndex && typeof index != 'undefined')
                scrollToIndex(index);
        };
        this.state = {
            visible: false,
            index: 0,
            isBlack: false,
            uri: '',
            share: false,
        };
        const group_id = props.item.group_id;
        this.group_level_source = calc_v_level_img(group_id);
        this.navigateToPortrayal = this.navigateToPortrayal.bind(this);
        this.alertDeleteModal = this.alertDeleteModal.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.getLike = this.getLike.bind(this);
        this.triggerComment = this.triggerComment.bind(this);
        // this.report = this.report.bind(this) //举报
    }
    // 删除这个帖子
    deletePost() {
        const post_id = this.props.item.post_id;
        const token = UserInfo.token;
        requestWithBody('/post/deletePost', { token, post_id })
            .then((res) => {
            if (res.code === '0') {
                Toast.success(res.msg, config.ToestTime);
                this.props.deletePost(post_id);
            }
            else if (res.code === '99') {
                DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg);
            }
            else {
                Toast.fail(res.msg, config.ToestTime);
            }
        })
            .catch(() => {
            Toast.offline(I18n.t('tip.offline'), config.ToestTime, undefined, false);
        });
    }
    // 弹出删除帖子确认框
    alertDeleteModal() {
        Modal.alert(I18n.t('community.delete_post'), I18n.t('community.sure_delete_post'), [
            { text: I18n.t('tip.cancel'), onPress: () => devlog('cancel') },
            { text: I18n.t('tip.confirm'), onPress: this.deletePost }
        ]);
    }
    //点赞功能
    getLike() {
        const token = UserInfo.token;
        const item = this.props.item;
        const post_id = item.post_id;
        let param = {
            token,
            post_id,
            status: 1
        };
        requestWithBody('/post/followPraise', param)
            .then((res) => {
            if (res.code == '0') {
                const _item = Object.assign({}, item, { praise: item.praise + 1, is_praise: 1 });
                this.props.updateOnePost(_item);
            }
            else if (res.code === '99') {
                DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg);
            }
            else {
                Toast.hide();
                Toast.fail(res.msg, config.ToestTime, undefined, false);
            }
        })
            .catch(() => {
            Toast.offline(I18n.t('tip.offline'), config.ToestTime);
        });
    }
    // 触发评论框
    triggerComment() {
        const { showCommentInput, setTargetPostId } = this.props;
        const item = this.props.item;
        const post_id = item.post_id;
        setTargetPostId(post_id);
        showCommentInput();
        this.scrollToIndex();
    }
    // 查看原图
    viewPhoto(index) {
        this.setState({ visible: true, index });
        return;
    }
    // 跳转到身份画像页面
    navigateToPortrayal() {
        const { navigation } = this.props;
        const item = this.props.item;
        navigation.push('Portrayal', {
            mobile: item.mobile
        });
    }
    //操作举报中心
    report(member_id) {
        this.refs.modal.open();
    }
    onActionPress(index, member_id) {
        const { navigation } = onClickButtonSharethis.props;
        if (index === 0) {
            this.addBlack(member_id);
        }
        if (index === 1) {
            navigation.push('Report', {
                member_id,
            });
        }
    }
    //加入黑名单
    addBlack(member_id) {
        // handle 1 拉黑 2 解禁
        const { isBlack } = this.state;
        let body = {
            from: member_id,
            handle: isBlack ? 2 : 1,
        };
        let requestBody = getRequestBody(body);
        BTFetch('/black/addBlack', requestBody)
            .then(res => {
            devlog({ res });
            if (res.code === '0') {
                Toast.success(res.msg, config.ToestTime, null, false);
                this.setState(preState => ({
                    isBlack: !preState.isBlack,
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
    onPressLinkToURL(link, link_title) {
        this.props.navigation.navigate('BTPublicWebView', {
            url: link,
            navTitle: link_title
        });
    }
    // 点击跳转浏览器
    onClickUrl(url) {
        Linking.openURL(url).catch(err => { });
    }
    onPressContentURLStyle(value) {
        const res = enumerateURLStringsMatchedByRegex(value);
        return (React.createElement(Text, { style: styles.item_text, selectable: true }, res &&
            res.map(item => {
                if (item.url) {
                    return this._renderLinkURL(item.url);
                }
                else if (item.Content) {
                    return item.Content;
                }
                else {
                    return null;
                }
            })));
    }
    _renderLinkURL(url) {
        return (React.createElement(Text, { style: { color: '#1677CB' }, onPress: () => {
                this.onClickUrl(url);
            } }, I18n.t('community.webLink')));
    }
    onClickCloseShare() {
        this.refs.modal.close();
    }
    componentDidMount() {
    }
    //---------------------------------------分享函数起始位置-----------------------------------------
    onClickButtonShare(index, item) {
        this.refs.modal.close();
        if (index === 100) { //举报
            this.onActionPress(1, item.member_id);
        }
        else if (index === 101) { //黑名单
            this.onActionPress(0, item.member_id);
        }
        else if (index === 102) { //删除
            this.deletePost();
        }
        else if (index === 103) { //生成图片
            this.props.navigation.navigate('GeneratePicture', item);
        }
        else {
            // 判断是否是红包  false 是红包
            if (Array.isArray(item.pack_preview) && item.pack_preview.length === 0) {
                this.props.navigation.navigate('GeneratePicture', item);
            }
            else {
                ShareUtil.share(`【瓦力社区】${item.pack_preview.total_members}人瓜分100DTO积分！${item.post_member_name}发了一个大礼包，手慢无～`, '../../BTImage/CommunityImages/community_red_packet_bg.png', 'http://dapp.botfans.org/gp/', '瓦力红包', index, (code, message) => {
                    Toast.info(message, config.ToestTime, null, false);
                    devlog(code, message, '微信信息');
                    devlog('--分享结果-------', code, '---------', message);
                });
            }
        }
    }
    //---------------------------------------分享函数终止位置-----------------------------------------
    render() {
        const { item } = this.props;
        const { post_id, post_member_name, post_avatar, pack_preview, link_url, link_title, member_id, } = item;
        const { isBlack, share, } = this.state;
        if (isBlack) {
            return null;
        }
        let content = item.content;
        if (contentStringHaveEmoji(content)) {
            content = emoticons.parse(content);
        }
        const hasURL = contentStringHaveURL(content);
        const imageList = item.post_url.map((ele, index) => {
            return (React.createElement(ThrottledTouchableOpacity, { key: ele.post_img_id, onPress: () => this.viewPhoto(index) },
                React.createElement(DoubleSourceImage, { style: styles.showimg, source: { uri: getImageURL(ele.post_thumb_url) } })));
        });
        const isShowDeleteBtn = UserInfo.mobile == item.mobile || UserInfo.is_admin == 1;
        let contentFontSize = null;
        //判断content内容字数
        if (content.length <= 2) {
            contentFontSize = styles.contentFontSize1;
        }
        else if (content.length < 30) {
            contentFontSize = styles.contentFontSize2;
        }
        else {
            contentFontSize = styles.contentFontSize3;
        }
        // 判断是否红包 true 帖子
        let isH = Array.isArray(pack_preview) && pack_preview.length === 0;
        return (React.createElement(View, { style: styles.container },
            React.createElement(Image, { style: styles.container, source: { uri: this.state.uri } }),
            React.createElement(View, { style: styles.item },
                React.createElement(View, { style: styles.avatar_view },
                    React.createElement(Image, { style: {
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            marginRight: 10
                        }, source: { uri: getImageURL(post_avatar) } }),
                    React.createElement(GroupLevel, { group_level_source: this.group_level_source })),
                React.createElement(View, { style: styles.items },
                    React.createElement(View, { style: { justifyContent: 'space-between', flexDirection: 'row' } },
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, onPress: this.navigateToPortrayal },
                            React.createElement(Text, { style: styles.item_title }, post_member_name)),
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, onPress: () => this.report(member_id) },
                            React.createElement(Image, { style: {
                                    width: 24,
                                    height: 24,
                                }, source: require('../../BTImage/CommunityImages/community_black.png') }))),
                    hasURL ? (this.onPressContentURLStyle(content)) : (React.createElement(Text, { style: styles.item_text, selectable: true }, content)),
                    React.createElement(Text, { style: styles.show }, " "),
                    hasURL ? (React.createElement(URLShareCell, Object.assign({ url: contentStringHaveURL1(content) }, item, { onPress: url => {
                            this.onPressLinkToURL(link_url ? link_url : url[0], link_title);
                        } }))) : null,
                    React.createElement(View, { style: styles.allImg }, imageList),
                    React.createElement(View, { style: styles.info },
                        React.createElement(View, { style: styles.deleteAll },
                            React.createElement(Text, { style: styles.time }, transTimeToString(item.created_at)),
                            "}"),
                        React.createElement(View, { style: styles.comments },
                            React.createElement(TouchableOpacity, { onPress: this.triggerComment },
                                React.createElement(Image, { style: {
                                        width: 26,
                                        height: 26,
                                        borderRadius: 8
                                    }, source: require('../../BTImage/CommunityImages/community_comment_trigger.png') })),
                            React.createElement(Text, { style: styles.comment }, item.reply.length),
                            React.createElement(TouchableOpacity, { style: { marginLeft: 5 }, onPress: this.getLike },
                                React.createElement(Image, { style: { width: 18, height: 18 }, source: !!item.is_praise
                                        ? require('../../BTImage/CommunityImages/forum_like_selected.png')
                                        : require('../../BTImage/CommunityImages/forum_like.png') })),
                            React.createElement(Text, { style: [styles.comment] }, item.praise))),
                    pack_preview &&
                        typeof pack_preview.pack_id == 'number' && (React.createElement(RedPacketPostItem, { group_level_source: this.group_level_source, avatar: post_avatar, pack_preview: pack_preview, name: post_member_name })),
                    item.reply.length > 0 && (React.createElement(PostComment, { replys: item.reply, scrollToIndex: this.scrollToIndex, post_id: post_id, routeName: this.routeName })))),
            this.state.visible && (React.createElement(ImageShow, { post_url: item.post_url, index: this.state.index, onClose: () => this.setState({ visible: false }) })),
            React.createElement(Modal, { style: { flexDirection: 'column', height: isH ? 280 : 170, backgroundColor: '#FFFF0000', }, position: 'bottom', entry: 'bottom', ref: "modal", coverScreen: true, backdropPressToClose: true, backButtonClose: true, openAnimationDuration: 0, swipeToClose: false },
                React.createElement(View, { style: { flexDirection: 'column', marginLeft: 8, marginRight: 8, backgroundColor: '#FFFFFF', height: isH ? 220 : 110, borderRadius: 8 } },
                    isH
                        &&
                            React.createElement(View, { style: { flexDirection: 'row', backgroundColor: '#FFFF0000', height: 90 } },
                                React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { alignItems: 'center', width: 90, height: 90, backgroundColor: '#FF00FF00' }, onPress: () => this.onClickButtonShare(3, item) },
                                    React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../../BTImage/PublicComponent/umeng_socialize_wxcircle.png') }),
                                    React.createElement(Text, { style: { width: 90, height: 20, lineHeight: 20, fontSize: 10, color: '#000000', textAlign: 'center' } }, "\u670B\u53CB\u5708")),
                                React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { alignItems: 'center', width: 90, height: 90, backgroundColor: '#FF00FF00' }, onPress: () => this.onClickButtonShare(2, item) },
                                    React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../../BTImage/PublicComponent/umeng_socialize_wechat.png') }),
                                    React.createElement(Text, { style: { width: 90, height: 20, lineHeight: 20, fontSize: 10, color: '#000000', textAlign: 'center' } }, "\u5FAE\u4FE1"))),
                    isH
                        &&
                            React.createElement(View, { style: { backgroundColor: '#EFF0F3', height: 1, marginTop: 20 } }),
                    React.createElement(View, { style: { flexDirection: 'row', backgroundColor: '#FFFF0000', height: 90 } },
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { alignItems: 'center', width: 90, height: 90, backgroundColor: '#FF00FF00' }, onPress: () => this.onClickButtonShare(100, item) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../../BTImage/PublicComponent/report.png') }),
                            React.createElement(Text, { style: { width: 90, height: 20, lineHeight: 20, fontSize: 10, color: '#000000', textAlign: 'center' } }, "\u4E3E\u62A5")),
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { alignItems: 'center', width: 90, height: 90, backgroundColor: '#FF00FF00' }, onPress: () => this.onClickButtonShare(101, item) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../../BTImage/PublicComponent/blacklist.png') }),
                            React.createElement(Text, { style: { width: 90, height: 20, lineHeight: 20, fontSize: 10, color: '#000000', textAlign: 'center' } }, "\u9ED1\u540D\u5355")),
                        (Array.isArray(pack_preview) && pack_preview.length === 0
                            &&
                                React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { alignItems: 'center', width: 90, height: 90, backgroundColor: '#FF00FF00' }, onPress: () => this.onClickButtonShare(103, item) },
                                    React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../../BTImage/CommunityImages/share_picture.png') }),
                                    React.createElement(Text, { style: { width: 90, height: 20, lineHeight: 20, fontSize: 10, color: '#000000', textAlign: 'center' } }, "\u4FDD\u5B58\u56FE\u7247"))),
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { alignItems: 'center', width: 90, height: 90, backgroundColor: '#FF00FF00' }, onPress: () => this.onClickButtonShare(102) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../../BTImage/PublicComponent/delete.png') }),
                            React.createElement(Text, { style: { width: 90, height: 20, lineHeight: 20, fontSize: 10, color: '#000000', textAlign: 'center' } }, "\u5220\u9664")))),
                React.createElement(View, { style: { flexDirection: 'column', margin: 8, backgroundColor: '#FFFFFF', flex: 1, borderRadius: 8 } },
                    React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { justifyContent: 'center', alignItems: 'center', flex: 1 }, onPress: () => this.onClickCloseShare() },
                        React.createElement(Text, { style: { width: 100, lineHeight: 30, fontSize: 15, backgroundColor: '#0F0FFF00', color: '#000000', textAlign: 'center' } }, "\u53D6\u6D88"))))));
    }
}
export default PostItem;
const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    item: {
        flexDirection: 'row',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        flexGrow: 1,
        backgroundColor: '#fff'
    },
    items: {
        flex: 1
    },
    item_title: {
        fontSize: 14,
        color: '#1677CB',
        lineHeight: 20,
        fontFamily: 'PingFangSC-Semibold'
    },
    item_text: {
        fontSize: 14,
        lineHeight: 20
    },
    show: {
        color: '#1677CB',
        opacity: 0.6,
        fontSize: 12,
        height: 2
    },
    allImg: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    deleteAll: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    time: {
        color: '#999',
        fontSize: 10
    },
    comments: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    comment: {
        color: '#999',
        fontSize: 10,
        marginLeft: 0
    },
    delete: {
        color: '#1677CB',
        borderWidth: 0,
        height: 18,
        fontSize: 12,
        paddingLeft: 6
    },
    showimg: {
        width: 100,
        height: 100,
        marginRight: 13,
        marginBottom: 10
    },
    avatar_view: {
        position: 'relative',
        width: 40,
        height: 40
    },
    group_level_img: {
        width: 12,
        height: 12,
        position: 'absolute',
        bottom: 2,
        right: 2
    },
    contentFontSize1: {
        fontSize: 72,
        color: '#596379',
        letterSpacing: 3.75,
        textAlign: 'center',
    },
    contentFontSize2: {
        fontSize: 24,
        color: '#596379',
        letterSpacing: 3.33,
    },
    contentFontSize3: {
        fontSize: 14,
        color: '#596379',
        letterSpacing: 5,
    }
});
