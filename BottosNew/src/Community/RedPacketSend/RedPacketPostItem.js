import React, { PureComponent } from 'react';
import { Text, StyleSheet, View, ImageBackground, Modal, Image, TouchableOpacity } from 'react-native';
import { Toast } from 'antd-mobile-rn';
// 组件
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity';
import I18n from '../../Tool/Language';
import { requestWithBody } from '../../Tool/NetWork/heightOrderFetch';
import config from '../../Tool/Config';
import NavigationService from '../../../NavigationService';
const throttledNavigate = NavigationService.throttledNavigate();
let click_locked = false;
export default class RedPacketPostItem extends PureComponent {
    constructor(props) {
        super(props);
        // 控制 modal 框的出现
        this.toggleVisible = () => {
            this.setState({ visible: !this.state.visible });
        };
        this.pickSuccess = (data) => {
            const token_type = data.main.currency_name;
            const picked_amount = data.my_pick;
            this.setState({ token_type, picked_amount });
            // TODO: 列表开发完了之后，把这段加上
            // if (!this.state.visible && !this.props.pack_preview.pick_status) {
            //   this.toggleVisible()
            // }
            this.toggleVisible();
        };
        this.pickFail = () => {
            this.setState({ picked_amount: null });
            if (!this.state.visible)
                this.toggleVisible();
        };
        this.handlePress = () => {
            if (click_locked)
                return;
            click_locked = true;
            const { hash } = this.props.pack_preview;
            const body = {
                pack_key: hash
            };
            Toast.loading(I18n.t('tip.wait_text'));
            requestWithBody('/giftpack/pickGiftpack', body)
                .then((res) => {
                click_locked = false;
                Toast.hide();
                if (res.code === '0') {
                    this.pickData = res.data;
                    // 选取成功了之后
                    // this.pickSuccess(res.data)
                    // 兼容之前的写法
                    if (this.pickData.my_pick == null) {
                        this.pickFail();
                    }
                    else {
                        this.pickSuccess(res.data);
                    }
                }
                else if (res.code == '-1') {
                    Toast.info(res.msg, config.ToestTime);
                }
                else {
                    Toast.fail(res.msg, config.ToestTime);
                }
            })
                .catch(() => {
                click_locked = false;
                Toast.offline(I18n.t('tip.offline'), config.ToestTime);
            });
        };
        this.viewPickedList = () => {
            if (this.state.visible)
                this.toggleVisible();
            const { avatar, group_level_source } = this.props;
            throttledNavigate('RedPacketList', {
                pickData: this.pickData,
                avatar,
                group_level_source,
                pack_preview: this.props.pack_preview.hash
            });
        };
        this.state = {
            visible: false,
            picked_amount: '',
            token_type: '',
        };
    }
    render() {
        const { pick_status } = this.props.pack_preview;
        const { avatar, group_level_source } = this.props;
        return (React.createElement(View, { style: styles.container },
            React.createElement(ThrottledTouchableOpacity, { style: styles.touchView, onPress: this.handlePress },
                React.createElement(ImageBackground, { style: [styles.background, { opacity: pick_status ? 0.7 : 1 }], source: require('../../BTImage/CommunityImages/community_red_packet_unclick.png') },
                    React.createElement(Text, { style: { color: '#EFE657', textAlign: 'center', fontSize: 12 } }, "\u606D\u559C\u53D1\u8D22"),
                    React.createElement(View, { style: styles.smallButton },
                        React.createElement(Text, { style: { fontSize: 12, color: '#fff', textAlign: 'center' } }, I18n.t('community.chaihb'))))),
            React.createElement(Modal, { transparent: true, visible: this.state.visible, onRequestClose: this.toggleVisible },
                React.createElement(View, { style: styles.modalBg },
                    React.createElement(ImageBackground, { style: styles.openedBackground, source: require('../../BTImage/CommunityImages/community_red_packet_bg.png') },
                        React.createElement(Text, { style: { color: '#FCE417', textAlign: 'center', fontSize: 12 } },
                            I18n.t('community.rp_from_1'),
                            " ",
                            this.props.name),
                        this.state.picked_amount == null
                            ?
                                React.createElement(Text, { style: [styles.rp_text, { marginTop: 15 }] }, I18n.t('community.rp_no_rp_left'))
                            :
                                React.createElement(React.Fragment, null,
                                    React.createElement(Text, { style: [styles.rp_text, { marginTop: 5, fontSize: 36 }] }, this.state.picked_amount),
                                    React.createElement(Text, { style: styles.rp_text }, this.state.token_type)),
                        React.createElement(ThrottledTouchableOpacity, { style: styles.picked_detail_button, onPress: this.viewPickedList },
                            React.createElement(Text, { style: [styles.rp_text, { fontSize: 12 }] },
                                I18n.t('community.rp_picked_list'),
                                " >"))),
                    React.createElement(TouchableOpacity, { style: { marginTop: 24 }, onPress: this.toggleVisible },
                        React.createElement(Image, { style: styles.closeIcon, source: require('../../BTImage/CommunityImages/community_red_packet_close.png') }))))));
    }
}
const styles = StyleSheet.create({
    container: {
    // flexDirection: 'column'
    },
    touchView: {
        width: 180,
    },
    background: {
        paddingTop: 170,
        paddingLeft: 10,
        paddingRight: 10,
        width: 157,
        height: 238,
        alignItems: 'center',
    },
    red_packet_label: {
        marginLeft: 5,
        fontSize: 10,
        color: '#596379',
    },
    openedBackground: {
        paddingTop: 140,
        paddingLeft: 10,
        paddingRight: 10,
        width: 216,
        height: 328,
        alignItems: 'center',
    },
    modalBg: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        backgroundColor: 'rgba(0,0,0,0.20)',
    },
    smallButton: {
        marginTop: 15,
        paddingTop: 2,
        paddingLeft: 5,
        paddingRight: 5,
        width: 60,
        height: 20,
        backgroundColor: '#FDC066',
        borderRadius: 10,
    },
    closeIcon: {
        width: 32,
        height: 32,
    },
    rp_text: {
        color: '#fff',
        textAlign: 'center',
    },
    picked_detail_button: {
        position: 'absolute',
        bottom: 15,
    }
});
