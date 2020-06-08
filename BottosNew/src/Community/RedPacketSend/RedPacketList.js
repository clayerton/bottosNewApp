import React, { Component } from 'react';
import { Text, View, FlatList, Image, ImageBackground, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// 方法
import I18n from '../../Tool/Language';
import { transTimeToString, calc_v_level_img, getImageURL } from "../../Tool/FunctionTool";
import UserInfo from '../../Tool/UserInfo';
import NavStyle from '../../Tool/Style/NavStyle';
import FontStyle from '../../Tool/Style/FontStyle';
import { redPacketListStyles as styles } from './redPackStyles';
// 组件
import BTBackButton from '../../Tool/View/BTBackButton';
import GroupLevel from '../Components/GroupLevel';
import Modal from 'react-native-modalbox';
import config from '../../Tool/Config';
import ShareUtil from "../../Tool/UM/ShareUtil";
import { Toast } from 'antd-mobile-rn';
function ItemSeparatorComponent() {
    return React.createElement(View, { style: { backgroundColor: '#EFF0F3', height: 1, width: UserInfo.screenW } });
}
function renderHeaderTitle(props) {
    return React.createElement(Text, { style: [props.style, { color: '#fff' }] }, I18n.t('community.rp_list'));
}
//获取ios设备是否安装微信
let isInstallShareAPP = true;
if (Platform.OS === 'ios') {
    ShareUtil.isInstallShareAPP(2, (code) => {
        if (code === '0') {
            isInstallShareAPP = false;
        }
    });
}
const navigationOptions = ({ navigation }) => {
    const onShareClick = navigation.getParam('onShareClick');
    return {
        headerLeft: function (props) {
            return React.createElement(BTBackButton, { onPress: props.onPress, source: require('../../BTImage/CommunityImages/navigation_back_white.png') });
        },
        headerRight: (isInstallShareAPP ?
            React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: NavStyle.rightButton, onPress: onShareClick },
                React.createElement(Image, { style: [style.closeButton, { width: 22, height: 22, }], source: require('../../BTImage/navigation_share_white.png') }))
            :
                ''),
        headerTitle: renderHeaderTitle,
        headerStyle: styles.nav_header,
        headerTintColor: '#fff',
    };
};
class RedPacketList extends Component {
    constructor(props) {
        super(props);
        this.token_type = this.props.navigation.state.params.pickData.main.currency_name; // 币的名字
        this.renderItem = ({ item, index }) => {
            const group_level_source = calc_v_level_img(item.group_id);
            return React.createElement(View, { style: styles.picked_detail_item },
                React.createElement(View, { style: styles.small_avatar_view },
                    React.createElement(Image, { style: styles.avatar_image, source: { uri: getImageURL(item.avatar_thumb) } }),
                    React.createElement(GroupLevel, { group_level_source: group_level_source })),
                React.createElement(View, null,
                    React.createElement(Text, { style: styles.db16 }, item.member_name),
                    React.createElement(Text, { style: styles.pick_time_text }, transTimeToString(item.pick_time))),
                React.createElement(Text, { style: [styles.picked_detail_item_value, styles.db16] },
                    item.pack_value,
                    " ",
                    this.token_type));
        };
        this.renderListHeader = () => {
            const params = this.props.navigation.state.params;
            const { avatar, pickData, group_level_source } = params;
            return React.createElement(View, { style: styles.infoContainer },
                React.createElement(ImageBackground, { style: styles.bg_image_view, imageStyle: styles.bg_image, source: require('../../BTImage/CommunityImages/community_rp_detail_bg.png') },
                    React.createElement(Text, { style: styles.from_text },
                        " ",
                        I18n.t('community.rp_from_1'),
                        " ",
                        pickData.main.member_name,
                        " ",
                        I18n.t('community.rp_from_2'),
                        " "),
                    React.createElement(Text, { style: styles.amount_text },
                        " ",
                        pickData.my_pick,
                        " "),
                    React.createElement(Text, { style: { color: '#fff' } },
                        " ",
                        this.token_type,
                        " "),
                    React.createElement(View, { style: styles.avatar_view },
                        React.createElement(Image, { style: styles.big_avatar, source: { uri: getImageURL(avatar) } }),
                        React.createElement(GroupLevel, { style: { width: 24, height: 24 }, group_level_source: group_level_source }))),
                React.createElement(Text, { style: [FontStyle.fontDarkGray, styles.overview_text] },
                    "\u5DF2\u9886\u53D6",
                    pickData.main.pack_members,
                    "/",
                    pickData.main.total_members,
                    "\u4E2A"));
        };
        this.state = {
            isInstallShareAPP: true,
        };
        props.navigation.setParams({
            onShareClick: () => this.onShareClick()
        });
    }
    onShareClick() {
        if (isInstallShareAPP) {
            this.refs.modal.open();
        }
    }
    componentDidMount() {
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
    //---------------------------------------分享函数起始位置-----------------------------------------
    onClickButtonShare(index, pickData, pack_preview) {
        this.refs.modal.close();
        if (index === 100) { //举报
            //   this.onActionPress(1,item.member_id)
        }
        else if (index === 101) { //黑名单
            //   this.onActionPress(0,item.member_id)
        }
        else if (index === 102) { //删除
        }
        else if (index === 103) { //生成图片
            // URL:  https://dapp.botfans.org/gp/ 编码:  https%3a%2f%2fdapp.botfans.org%2fgp%2f
            // appid wx84408a7ef37b055f
        }
        else {
            ShareUtil.share(`【瓦力社区】${pickData.main.total_members}人瓜分${pickData.main.total_amount}${pickData.main.currency_name}积分！`, 'http://dapp.botfans.org/gp/gp.png', 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx84408a7ef37b055f&redirect_uri=https%3a%2f%2fdapp.botfans.org%2fgp%2f&response_type=code&scope=snsapi_userinfo&state=' + pack_preview + '#wechat_redirect', `${pickData.main.member_name}发了一个大礼包，手慢无～`, index, (code, message) => {
                Toast.info(message, config.ToestTime, null, false);
            });
        }
    }
    //---------------------------------------分享函数终止位置-----------------------------------------
    onClickCloseShare() {
        this.refs.modal.close();
    }
    render() {
        const params = this.props.navigation.state.params;
        const { pickData, pack_preview } = params;
        return (React.createElement(View, { style: styles.container },
            React.createElement(FlatList, { style: [styles.container, styles.list_bg], ListHeaderComponent: this.renderListHeader, data: pickData.list, renderItem: this.renderItem, ItemSeparatorComponent: ItemSeparatorComponent, keyExtractor: (item) => item.pick_member_id.toString() }),
            React.createElement(Modal, { style: { flexDirection: 'column', height: 280 - 110, backgroundColor: '#FFFF0000', }, position: 'bottom', entry: 'bottom', ref: "modal", coverScreen: true, backdropPressToClose: true, backButtonClose: true, openAnimationDuration: 0, swipeToClose: false },
                React.createElement(View, { style: { flexDirection: 'column', marginLeft: 8, marginRight: 8, backgroundColor: '#FFFFFF', height: 220 - 110, borderRadius: 8 } },
                    React.createElement(View, { style: { flexDirection: 'row', backgroundColor: '#FFFF0000', height: 90 } },
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { alignItems: 'center', width: 90, height: 90, backgroundColor: '#FF00FF00' }, onPress: () => this.onClickButtonShare(3, pickData, pack_preview) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../../BTImage/PublicComponent/umeng_socialize_wxcircle.png') }),
                            React.createElement(Text, { style: { width: 90, height: 20, lineHeight: 20, fontSize: 10, color: '#000000', textAlign: 'center' } }, "\u670B\u53CB\u5708")),
                        React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { alignItems: 'center', width: 90, height: 90, backgroundColor: '#FF00FF00' }, onPress: () => this.onClickButtonShare(2, pickData, pack_preview) },
                            React.createElement(Image, { style: { width: 50, height: 50, marginTop: 20 }, source: require('../../BTImage/PublicComponent/umeng_socialize_wechat.png') }),
                            React.createElement(Text, { style: { width: 90, height: 20, lineHeight: 20, fontSize: 10, color: '#000000', textAlign: 'center' } }, "\u5FAE\u4FE1")))),
                React.createElement(View, { style: { flexDirection: 'column', margin: 8, backgroundColor: '#FFFFFF', flex: 1, borderRadius: 8 } },
                    React.createElement(TouchableOpacity, { activeOpacity: 0.5, style: { justifyContent: 'center', alignItems: 'center', flex: 1 }, onPress: () => this.onClickCloseShare() },
                        React.createElement(Text, { style: { width: 100, lineHeight: 30, fontSize: 15, backgroundColor: '#0F0FFF00', color: '#000000', textAlign: 'center' } }, "\u53D6\u6D88"))))));
    }
}
RedPacketList.displayName = 'RedPacketList';
RedPacketList.navigationOptions = navigationOptions;
export default RedPacketList;
const style = StyleSheet.create({
    closeButton: {
        width: 18,
        height: 18
    },
});
