import React, { PureComponent } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, StyleSheet, Dimensions, ScrollView, DeviceEventEmitter } from 'react-native';
import { Toast } from 'antd-mobile-rn';
import { PasswordModal } from 'react-native-pay-password';
// 方法
import I18n from '../../Tool/Language';
import NavStyle from '../../Tool/Style/NavStyle';
import { fcBlue } from '../../Tool/Style/FontStyle';
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity';
import Config from '../../Tool/Config';
import { requestWithBody } from '../../Tool/NetWork/heightOrderFetch';
import { hasEmoji } from '../../Tool/FunctionTool';
// 自有组件
import BTBackButton from '../../Tool/View/BTBackButton';
import BorderedBox, { styles as BBStyles } from './BorderedBox';
import CoinTypeSelect from './CoinTypeSelect';
import BottomModal from '../../Tool/View/BottomModal';
import LongButton from '../../Tool/View/BTButton/LongButton';
import Luck from './Luck';
import * as emoticons from '../../Tool/View/Emoticons';
const { width } = Dimensions.get('window');
const MAX_RED_PACKET_NUMBER = 99;
const MIN_RED_PACKET_NUMBER = 10;
// 导航栏选项
const navigationOptions = () => {
    return {
        headerLeft: BTBackButton,
        headerTitle: I18n.t('community.red_packet_send'),
        headerRight: React.createElement(TouchableOpacity, { style: NavStyle.rightButton })
    };
};
class RedPacketSend extends PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        // 切换红包模式，是普通模式还是拼手气
        this.changeRedPacketMode = () => {
            this.setState({
                is_lucky: !this.state.is_lucky,
                red_packet_amount: '',
                one_red_packet_amount: ''
            });
        };
        // 切换粉丝模式
        this.changeFansMode = () => {
            this.setState({
                is_fans: !this.state.is_fans
            });
        };
        // 红包个数
        this.handleNumberChange = (text) => {
            text = text.replace(/[-|,| |.]/, '');
            let num = Number.parseInt(text);
            const valid = this.checkRPNumber(num);
            const { one_red_packet_amount, is_lucky, red_packet_amount } = this.state;
            // 如果处于普通模式，也要计算总金额
            if (is_lucky == false && Number(one_red_packet_amount) > 0) {
                let red_packet_amount_num = Number(one_red_packet_amount) * num;
                this.setState({ red_packet_amount: red_packet_amount_num.toString() });
                if (valid) {
                    this.checkAmount(red_packet_amount_num);
                }
            }
            if (is_lucky && Number(red_packet_amount) > 0 && valid) {
                this.checkAmount(red_packet_amount);
            }
            this.setState({ red_packet_number: text });
        };
        // 当处于普通模式的时候，单个红包金额的改变
        this.handleOneRedPacketAmountChange = (text) => {
            text = text.replace(/[-|,| ]/, '');
            // 限制小数点的位数为 6 位
            const index = text.indexOf('.');
            if (index > -1 && text.length - index - 1 > 6) {
                return;
            }
            // 红包总金额初始化
            let red_packet_amount = 0;
            // 单个红包金额
            let single_money = Number(text);
            // 如果红包个数大于 0
            const red_packet_number = Number.parseInt(this.state.red_packet_number); // 红包数
            if (red_packet_number > 0) {
                // 计算红包总金额
                red_packet_amount = red_packet_number * single_money;
                let valid = this.checkAmount(red_packet_amount);
                if (valid) {
                    this.checkRPNumber(red_packet_number);
                }
            }
            this.setState({
                one_red_packet_amount: text,
                red_packet_amount: red_packet_amount.toString()
            });
        };
        // 当处于拼手气模式的时候
        this.handleLuckRedPacketAmountChange = (text) => {
            text = text.replace(/[-|,| ]/, '');
            // 限制小数点的位数为 6 位
            const index = text.indexOf('.');
            if (index > -1 && text.length - index - 1 > 6) {
                return;
            }
            // 红包总金额不能大于 1 亿
            let valid = this.checkAmount(text);
            const red_packet_number = this.state.red_packet_number; // 红包个数
            if (valid && red_packet_number != '') {
                this.checkRPNumber(Number(red_packet_number));
            }
            this.setState({
                red_packet_amount: text
            });
        };
        // 限制总金额
        this.checkAmount = (amount) => {
            let num = Number(amount);
            const { coin_infos, coin_name } = this.state;
            let current_info, // 当前币种的参数
            value = 0; // 币种的数量
            if (coin_infos.length > 0) {
                current_info = coin_infos.find(ele => ele.name == coin_name);
            }
            if (current_info != undefined) {
                value = current_info.value ? Number(current_info.value) : 0;
            }
            let amount_valid = false;
            if (num == 0) {
                this.setState({ amount_valid, msg: '' });
            }
            else if (Number.isNaN(num)) {
                this.setState({ amount_valid, msg: I18n.t('community.rp_input_valid') });
            }
            else if (num > 1e8) {
                this.setState({
                    amount_valid,
                    msg: I18n.t('community.rp_amount_no_more_than') + 1e8
                });
            }
            else if (num < 1) {
                this.setState({
                    amount_valid,
                    msg: I18n.t('community.rp_amount_no_less_than') + '1'
                });
            }
            else if (num > value) {
                this.setState({
                    amount_valid,
                    msg: I18n.t('community.rp_amount_no_more_than_coin') + coin_name
                });
            }
            else {
                amount_valid = true;
                this.setState({ amount_valid, msg: '' });
            }
            return amount_valid;
        };
        // 检查红包个数
        this.checkRPNumber = (num) => {
            // 没有输入的时候，不给 msg
            let number_valid = false;
            if (num == 0 || Number.isNaN(num)) {
                this.setState({ number_valid, msg: '' });
            }
            else if (num > MAX_RED_PACKET_NUMBER) {
                this.setState({
                    number_valid,
                    msg: I18n.t('community.rp_num_no_more_than') + MAX_RED_PACKET_NUMBER
                });
            }
            else if (num < MIN_RED_PACKET_NUMBER) {
                this.setState({
                    number_valid,
                    msg: I18n.t('community.rp_num_no_less_than') + MIN_RED_PACKET_NUMBER
                });
            }
            else {
                number_valid = true;
                this.setState({ number_valid, msg: '' });
            }
            return number_valid;
        };
        // 控制 modal 的显示
        this.toggleModalVisible = (visible) => {
            const current_visible = this.state.modal_show;
            // 未传参数，则直接取反
            // 传了参数，如果与现在不同，则 setState
            if (visible == undefined) {
                this.setState({ modal_show: !current_visible });
            }
            else if (visible !== current_visible) {
                this.setState({ modal_show: visible });
            }
        };
        // 关闭 modal，同时关闭键盘
        this.closeModal = () => {
            this.setState({ modal_show: false });
            Keyboard.dismiss();
        };
        // 获取所有币种和币量，每次选择都会重新请求
        this.getCoinInfo = () => {
            Toast.loading(I18n.t('tip.wait_text'), 0);
            requestWithBody('/member/getMemberAssets', {}, (res) => {
                this.setState({ coin_infos: res.data });
            });
        };
        // 当所选的币种被点击的时候
        this.handleCoinChange = (coin_name) => {
            const { coin_name: pre_coin_name, modal_show } = this.state;
            if (coin_name != pre_coin_name) {
                this.setState({ coin_name });
            }
            if (modal_show) {
                this.closeModal();
            }
        };
        // 点击按钮
        this.handlePackRedPacket = () => {
            const node = this.myRef.current;
            node.show();
        };
        // 输入密码的回调
        // 发送红包的请求就在这里
        this.handlePasswordInput = (password) => {
            const { red_packet_number, red_packet_amount, one_red_packet_amount, coin_infos, coin_name, is_lucky, is_fans } = this.state;
            let currency_id = 1;
            coin_infos.forEach(ele => {
                if (ele.name == coin_name) {
                    currency_id = ele.currency_id;
                }
            });
            let addition_text = this.state.addition_text;
            if (hasEmoji(addition_text)) {
                addition_text = emoticons.stringify(addition_text);
            }
            const body = {
                total: is_lucky ? red_packet_amount : one_red_packet_amount,
                pieces: red_packet_number,
                intro: addition_text || '恭喜发财',
                only_follow: is_fans ? '1' : '0',
                type: is_lucky ? 1 : 2,
                currency_id,
                password
            };
            Toast.loading(I18n.t('tip.wait_text'), 0);
            requestWithBody('/giftpack/sendGiftpack', body)
                .then((res) => {
                Toast.hide();
                const { code, msg } = res;
                if (code == '-3') {
                    // 说明没有设置支付密码
                    Toast.fail(msg, Config.ToestTime);
                }
                else if (code == '0') {
                    Toast.success(msg, Config.ToestTime);
                    this.props.navigation.goBack();
                    DeviceEventEmitter.emit('REFRESH_POST'); // 刷新帖子
                }
                else {
                    Toast.fail(msg, Config.ToestTime);
                }
            })
                .catch(() => {
                Toast.offline(I18n.t('tip.offline'), Config.ToestTime, undefined, false);
            });
        };
        this.handleBlur = () => {
            // Keyboard.dismiss()
        };
        this.state = {
            is_lucky: true,
            is_fans: false,
            red_packet_number: '',
            red_packet_amount: '',
            one_red_packet_amount: '',
            coin_infos: [],
            coin_name: 'DTO',
            modal_show: false,
            addition_text: '',
            number_valid: false,
            amount_valid: false,
            msg: ''
        };
    }
    componentDidMount() {
        this.getCoinInfo();
    }
    render() {
        const { is_lucky, is_fans, modal_show, red_packet_number, coin_infos, coin_name, red_packet_amount, addition_text, number_valid, amount_valid, msg } = this.state;
        const isEnable = number_valid && amount_valid && coin_infos.length > 0; // 是否可以点击发红包
        const valid_coin_infos = coin_infos.filter(ele => ele.value != null);
        const modal_height = valid_coin_infos.length < 4 ? 350 : 450;
        return (React.createElement(View, { style: styles.container },
            React.createElement(ScrollView, { ref: "scrollView", showsVerticalScrollIndicator: false, showsHorizontalScrollIndicator: false, keyboardDismissMode: 'on-drag', style: { flex: 1 } },
                React.createElement(BorderedBox, { leftEle: React.createElement(Text, null, I18n.t('community.rp_number')), rightEle: React.createElement(React.Fragment, null,
                        React.createElement(TextInput, { style: styles.input, placeholder: "\u8F93\u5165\u4E2A\u6570", underlineColorAndroid: "transparent", keyboardType: "numeric", onChangeText: this.handleNumberChange, value: red_packet_number, onBlur: this.handleBlur }),
                        React.createElement(Text, null, " \u4E2A")) }),
                !isEnable &&
                    msg != '' && (React.createElement(View, { style: styles.noticeBar },
                    React.createElement(Text, { style: styles.noticeText }, msg))),
                React.createElement(View, { style: [styles.flexBox, { marginTop: 10 }] },
                    React.createElement(Text, { style: styles.smallText },
                        is_fans
                            ? I18n.t('community.current_fans_left')
                            : I18n.t('community.current_all_left'),
                        "\uFF0C"),
                    React.createElement(ThrottledTouchableOpacity, { onPress: this.changeFansMode, waitTime: 300 },
                        React.createElement(Text, { style: [styles.smallText, { color: fcBlue }] }, is_fans
                            ? I18n.t('community.current_fans_right')
                            : I18n.t('community.current_all_right')))),
                is_lucky ? (React.createElement(BorderedBox, { leftEle: React.createElement(View, null,
                        React.createElement(Luck, null),
                        React.createElement(Text, null, I18n.t('community.amount'))), rightEle: React.createElement(TextInput, { style: styles.input, placeholder: "0.00", underlineColorAndroid: "transparent", keyboardType: "numeric", onChangeText: this.handleLuckRedPacketAmountChange, value: red_packet_amount, onBlur: this.handleBlur }) })) : (React.createElement(BorderedBox, { leftEle: React.createElement(Text, null, I18n.t('community.rp_single_amount')), rightEle: React.createElement(TextInput, { style: styles.input, placeholder: "0.00", underlineColorAndroid: "transparent", keyboardType: "numeric", onChangeText: this.handleOneRedPacketAmountChange, value: this.state.one_red_packet_amount, onBlur: this.handleBlur }) })),
                React.createElement(View, { style: [styles.flexBox, { marginTop: 10 }] },
                    React.createElement(Text, { style: styles.smallText },
                        I18n.t('community.rp_current') +
                            (is_lucky
                                ? I18n.t('community.rp_lucky')
                                : I18n.t('community.rp_normal')),
                        "\uFF0C"),
                    React.createElement(ThrottledTouchableOpacity, { onPress: this.changeRedPacketMode, waitTime: 300 },
                        React.createElement(Text, { style: [styles.smallText, { color: fcBlue }] }, I18n.t('community.rp_change') +
                            (is_lucky
                                ? I18n.t('community.rp_normal')
                                : I18n.t('community.rp_lucky'))))),
                React.createElement(ThrottledTouchableOpacity, { onPress: () => this.toggleModalVisible(true), style: [BBStyles.redBorder, BBStyles.flexBox] },
                    React.createElement(View, { style: BBStyles.leftDescriptionContent },
                        React.createElement(Text, null, I18n.t('community.choose_coin'))),
                    React.createElement(View, { style: BBStyles.separator }),
                    React.createElement(View, { style: BBStyles.rightInputContent },
                        React.createElement(Text, { style: styles.coinType }, coin_name),
                        React.createElement(Text, { style: { width: 15 } }, ">"))),
                React.createElement(TextInput, { style: [BBStyles.redBorder, { height: 62 }], placeholder: "\u606D\u559C\u53D1\u8D22", maxLength: 120, underlineColorAndroid: "transparent", onChangeText: addition_text => this.setState({ addition_text }), onBlur: this.handleBlur }),
                React.createElement(BottomModal, { visible: modal_show && valid_coin_infos.length > 0, style: { height: modal_height }, onRequestClose: this.closeModal },
                    React.createElement(CoinTypeSelect, { onClose: this.closeModal, default_coin: coin_name, coin_infos: valid_coin_infos, onChange: this.handleCoinChange })),
                React.createElement(Text, { style: styles.amount_container_text },
                    React.createElement(Text, { style: styles.amountText }, red_packet_amount || 0),
                    React.createElement(Text, { style: { color: fcBlue, fontSize: 12, fontWeight: '600' } }, coin_name)),
                React.createElement(LongButton, { onPress: this.handlePackRedPacket, title: I18n.t('community.saihb'), style: {
                        backgroundColor: isEnable ? '#DD4B39' : '#DD4B3955',
                        marginTop: 5,
                        marginBottom: 100
                    }, disabled: !isEnable }),
                React.createElement(PasswordModal, { title: I18n.t('tip.pay_password_title'), ref: this.myRef, onDone: this.handlePasswordInput }))));
    }
}
RedPacketSend.displayName = 'RedPacketSend';
RedPacketSend.navigationOptions = navigationOptions;
export default RedPacketSend;
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: '#f7f8fa'
    },
    flexBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
        // justifyContent: 'space-between'
    },
    input: {
        width: '80%',
        padding: 0,
        textAlign: 'right'
    },
    suffixText: {
        width: 32,
        textAlign: 'right'
    },
    smallText: {
        fontSize: 12
    },
    coinType: {
        width: '85%',
        paddingLeft: 25,
        textAlign: 'center'
    },
    amount_container_text: {
        marginTop: 30,
        marginBottom: 40,
        textAlign: 'center'
    },
    amountText: {
        fontSize: 36,
        fontWeight: '600',
        color: '#353B48'
    },
    // 顶部提醒
    noticeBar: {
        position: 'absolute',
        // top: 50,
        height: 20,
        width,
        backgroundColor: '#FDC066'
    },
    noticeText: {
        textAlign: 'center'
    }
});
