import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
// 组件
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity';
import BTBackButton from '../../Tool/View/BTBackButton';
import { styles as BBStyles } from './BorderedBox';
import I18n from '../../Tool/Language';
function BlueBorderBox(props) {
    const { coin_name, coin_amount, is_selected, onPress } = props;
    function handlePress() {
        if (onPress) {
            onPress(coin_name);
        }
    }
    return React.createElement(ThrottledTouchableOpacity, { onPress: handlePress, style: [BBStyles.redBorder, BBStyles.flexBox, styles.coinSelectBox] },
        React.createElement(View, { style: styles.coinNameContainer },
            React.createElement(Text, { style: styles.coinName }, coin_name),
            is_selected &&
                React.createElement(Image, { style: styles.sureImg, resizeMode: 'contain', source: require('../../BTImage/CommunityImages/community_red_packet_sure.png') })),
        React.createElement(View, { style: BBStyles.separator }),
        React.createElement(Text, { style: styles.amount }, coin_amount || 0));
}
export default class CoinTypeSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.handlePress = (coin_name) => {
            this.setState({ selected_coin: coin_name });
            const onChange = this.props.onChange;
            onChange && onChange(coin_name);
        };
        const default_coin = props.default_coin;
        this.state = {
            selected_coin: default_coin || 'DTO'
        };
    }
    render() {
        const { selected_coin } = this.state;
        const { coin_infos, onClose } = this.props;
        const lists = coin_infos.map(ele => {
            if (ele.value == null)
                return null;
            return React.createElement(BlueBorderBox, { key: ele.name, onPress: this.handlePress, coin_name: ele.name, coin_amount: ele.value, is_selected: selected_coin == ele.name });
        });
        return (React.createElement(View, { style: styles.wrap },
            React.createElement(View, { style: styles.titleContainer },
                React.createElement(Text, { style: styles.titleText }, I18n.t('community.selectToken'))),
            React.createElement(BTBackButton, { style: styles.back, onPress: onClose }),
            lists));
    }
}
const styles = StyleSheet.create({
    wrap: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    titleContainer: {
        marginBottom: 10,
        height: 54,
        padding: 16,
        alignItems: 'center',
        borderBottomColor: '#EFF0F3',
        borderBottomWidth: 1,
    },
    titleText: {
        fontSize: 16,
        color: '#353B48',
        textAlign: 'center',
    },
    sureImg: {
        position: 'absolute',
        top: 3,
        left: 15,
        width: 20,
        height: 15,
    },
    coinNameContainer: {
        width: '49%',
    },
    coinName: {
        textAlign: 'center'
    },
    amount: {
        flexGrow: 1,
        textAlign: 'center'
    },
    back: {
        position: 'absolute',
        top: 5,
    },
    coinSelectBox: {
        borderColor: '#DFEFFE',
        marginLeft: 16,
        marginRight: 16,
    }
});
