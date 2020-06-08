import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, DeviceEventEmitter, ImageBackground, Platform, CameraRoll, ScrollView, } from 'react-native';
import { Toast } from 'antd-mobile-rn';
import config from '../../Tool/Config';
import UserInfo from '../../Tool/UserInfo';
import * as emoticons from '../../Tool/View/Emoticons';
import BTFetch from '../../Tool/NetWork/BTFetch';
import { getRequestBody, devlog, calc_v_level_img, contentStringHaveEmoji } from '../../Tool/FunctionTool';
import I18n from '../../Tool/Language';
var ReactNative = require('react-native');
import ViewShot from "react-native-view-shot"; //android截屏第三方组件
import GenerateItem from './GenerateItem'; //社区 生成图片
import InviteItem from '../../Base/TaskPage/InviteItem'; // 邀请 生成界面
import ShareUtil from "../../Tool/UM/ShareUtil";
const platformIos = Platform.OS === 'ios' ? true : false;
class GeneratePicture extends Component {
    constructor(props) {
        super(props);
        this.item = props.navigation.state.params;
        this.state = {
            inviteCode: '',
            imageShow: '',
            isInstallShareAPP: true,
        };
        //  判断this.inviteStatus为ture 是从邀请界面跳转过来的
        this.inviteStatus = this.item && this.item.hasOwnProperty('inviteStatus');
        const group_id = this.item.hasOwnProperty('group_id') && this.item.group_id;
        this.group_level_source = calc_v_level_img(group_id);
    }
    onClickButtonShare(index) {
        if (Platform.OS === 'ios') {
            ReactNative.takeSnapshot(this.refs.location, { format: 'png', quality: 1 }).then((uri) => {
                if (index === 100) {
                    let promise = CameraRoll.saveToCameraRoll(uri);
                    promise.then(function (result) {
                        Toast.info(I18n.t('invite.Invite_save_success'), config.ToestTime, null, false);
                    }).catch(function (uri) {
                        Toast.fail(I18n.t('invite.Invite_save_fail'), config.ToestTime, null, false);
                    });
                }
                else {
                    ShareUtil.share('', uri, '', '', index, (code, message) => {
                        devlog(code, message, '微信信息');
                        devlog('--分享结果-------', code, '---------', message);
                    });
                }
                devlog({ uri });
            }).catch((error) => alert(error));
        }
        else {
            this.refs.viewShot.capture().then(uri => {
                let promise = CameraRoll.saveToCameraRoll(uri);
                promise.then(function (result) {
                    Toast.info(I18n.t('invite.Invite_save_success'), config.ToestTime, null, false);
                }).catch(function (error) {
                    Toast.info(I18n.t('invite.Invite_setting'), config.ToestTime, null, false);
                });
            }).catch(function (error) {
                Toast.fail(I18n.t('invite.Invite_save_fail'), config.ToestTime, null, false);
            });
        }
        this.props.navigation.goBack();
    }
    onClickCloseShare() {
        this.props.navigation.goBack();
    }
    componentDidMount() {
        this.invite();
        //获取ios设备是否安装微信
        if (Platform.OS === 'ios') {
            ShareUtil.isInstallShareAPP(2, (code) => {
                if (code === '0') {
                    this.setState({
                        isInstallShareAPP: false
                    });
                }
            });
        }
    }
    invite() {
        let body = {};
        let requestBody = getRequestBody(body);
        BTFetch('/recommend/getRecommendSn', requestBody)
            .then(res => {
            const { code, msg, data } = res;
            if (code === '0') {
                this.setState({
                    inviteCode: data,
                });
            }
            else if (res.code === '99') {
                DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg);
            }
            else {
                Toast.info(msg, config.ToestTime, null, false);
            }
        })
            .catch(res => {
            Toast.fail(res, config.ToestTime, null, false);
        });
    }
    copy() {
    }
    onClickSaveImg() {
    }
    render() {
        let imageBg = ''; //  文字卡片
        let numberRandom = Math.floor(Math.random() * 2 + 1); //生成1,2随机数 背景颜色随机判定
        const { inviteCode } = this.state;
        if (!this.inviteStatus) {
            const { post_id, post_member_name, post_avatar, pack_preview, link_url, link_title, member_id, } = this.item;
            let content = this.item.content;
            if (contentStringHaveEmoji(content)) {
                content = emoticons.parse(content);
            }
            if (content && content.length <= 60) {
                imageBg = numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_bg1.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_bgz1.png');
            }
            else if (content.length <= 100) {
                imageBg = numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_bg1.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_bgz1.png');
            }
            else if (content.length <= 190) {
                imageBg = numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_bg2.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_bgz2.png');
            }
            else if (content.length <= 300) {
                imageBg = numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_bg4.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_bgz4.png');
            }
            else {
                imageBg = numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_bg3.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_bgz3.png');
            }
        }
        return (React.createElement(View, { style: { height: UserInfo.screenH, flexDirection: 'column', backgroundColor: '#fff' } },
            React.createElement(View, { style: { height: UserInfo.screenH - 132, } },
                React.createElement(ScrollView, { style: { flex: 1 }, ref: "full" },
                    React.createElement(ViewShot, { ref: "viewShot", options: { quality: 1, format: 'png', } },
                        React.createElement(ImageBackground, { ref: 'location', source: imageBg, resizeMode: 'cover', imageStyle: { width: UserInfo.screenW, }, style: {
                                width: UserInfo.screenW,
                                padding: 0,
                                margin: 0,
                                paddingBottom: this.inviteStatus ? 0 : 22,
                            } }, this.inviteStatus ?
                            React.createElement(ImageBackground, { ref: 'location', style: styles.mainBackground, source: require('../../BTImage/Base/Task/task_invite_bg.png') },
                                React.createElement(InviteItem, { data: this.item.data, onClickSaveImg: () => { }, recommendUseAmount: this.item.recommend_use_amount, useCount: this.item.use_count }))
                            :
                                React.createElement(GenerateItem, { item: this.item, inviteCode: inviteCode, numberRandom: numberRandom }))))),
            React.createElement(View, { style: { height: 132, backgroundColor: '#fff', borderTopColor: '#DFEFFE', borderTopWidth: 1 } },
                React.createElement(View, { style: { height: 60, flexDirection: 'row', borderBottomColor: '#ddd', marginTop: 16, } }, platformIos ?
                    this.state.isInstallShareAPP ?
                        React.createElement(View, { style: {
                                flexDirection: 'row',
                                backgroundColor: '#FFFF0000',
                                height: 53
                            } },
                            React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                    alignItems: 'center',
                                    width: 90,
                                    height: 53,
                                    backgroundColor: '#FF00FF00'
                                }, onPress: () => this.onClickButtonShare(3) },
                                React.createElement(Image, { style: { width: 29, height: 29, marginBottom: 8 }, source: require('../../BTImage/PublicComponent/umeng_socialize_wxcircle.png') }),
                                React.createElement(Text, { style: {
                                        width: 90,
                                        lineHeight: 16,
                                        fontSize: 11,
                                        color: '#596379',
                                        textAlign: 'center'
                                    } }, "\u670B\u53CB\u5708")),
                            React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                    alignItems: 'center',
                                    width: 90,
                                    height: 53,
                                    backgroundColor: '#FF00FF00'
                                }, onPress: () => this.onClickButtonShare(2) },
                                React.createElement(Image, { style: { width: 29, height: 29, marginBottom: 8 }, source: require('../../BTImage/PublicComponent/umeng_socialize_wechat.png') }),
                                React.createElement(Text, { style: {
                                        width: 90,
                                        lineHeight: 16,
                                        fontSize: 11,
                                        color: '#596379',
                                        textAlign: 'center'
                                    } }, "\u5FAE\u4FE1")),
                            React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                    alignItems: 'center', width: 90, height: 53, backgroundColor: '#FF00FF00'
                                }, onPress: () => this.onClickButtonShare(100) },
                                React.createElement(Image, { style: { width: 29, height: 29, marginBottom: 8, }, source: require('../../BTImage/CommunityImages/share_picture.png') }),
                                React.createElement(Text, { style: { width: 90, lineHeight: 16, fontSize: 11, color: '#596379', textAlign: 'center' } }, "\u4FDD\u5B58\u56FE\u7247")))
                        :
                            React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                    alignItems: 'center', width: 90, height: 53, backgroundColor: '#FF00FF00'
                                }, onPress: () => this.onClickButtonShare(100) },
                                React.createElement(Image, { style: { width: 29, height: 29, marginBottom: 8, }, source: require('../../BTImage/CommunityImages/share_picture.png') }),
                                React.createElement(Text, { style: { width: 90, lineHeight: 16, fontSize: 11, color: '#596379', textAlign: 'center' } }, "\u4FDD\u5B58\u56FE\u7247"))
                    :
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: {
                                alignItems: 'center', width: 90, height: 53, backgroundColor: '#FF00FF00'
                            }, onPress: () => this.onClickButtonShare() },
                            React.createElement(Image, { style: { width: 29, height: 29, marginBottom: 8, }, source: require('../../BTImage/CommunityImages/share_picture.png') }),
                            React.createElement(Text, { style: { width: 90, lineHeight: 16, fontSize: 11, color: '#596379', textAlign: 'center' } }, "\u4FDD\u5B58\u56FE\u7247"))),
                React.createElement(View, { style: { flexDirection: 'column', backgroundColor: '#FFFFFF', flex: 1, } },
                    React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { justifyContent: 'center', alignItems: 'center', flex: 1 }, onPress: () => this.onClickCloseShare() },
                        React.createElement(Text, { style: { width: 100, lineHeight: 30, fontSize: 15, backgroundColor: '#0F0FFF00', color: '#000000', textAlign: 'center' } }, "\u53D6\u6D88"))))));
    }
}
export default GeneratePicture;
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
        color: '#363F4D',
        fontSize: 12,
        marginLeft: 8
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
        fontSize: 18,
        lineHeight: 22,
    },
    contentFontSize2: {
        fontSize: 16,
        lineHeight: 18,
    },
    contentFontSize3: {
        fontSize: 14,
        lineHeight: 18,
    },
    // 邀请界面
    mainBackground: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
